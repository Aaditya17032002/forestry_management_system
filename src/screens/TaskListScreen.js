import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialTasks = [
  { id: '1', title: 'Inspect Oak Trees in Sector A', status: 'Pending', priority: 'High', description: 'Conduct a thorough inspection of oak trees for signs of disease or pest infestation.' },
  { id: '2', title: 'Collect Soil Samples from Sector B', status: 'In Progress', priority: 'Medium', description: 'Gather soil samples from various locations in Sector B for laboratory analysis.' },
  { id: '3', title: 'Update GIS Data for New Plantings', status: 'Completed', priority: 'Low', description: 'Input data for newly planted trees into the GIS system, including species and location.' },
  { id: '4', title: 'Assess Fire Risk in Sector C', status: 'Pending', priority: 'High', description: 'Evaluate current fire risk levels in Sector C and update the fire management plan accordingly.' },
  { id: '5', title: 'Maintain Trail Markers', status: 'In Progress', priority: 'Medium', description: 'Check and replace damaged or faded trail markers throughout the forest.' },
];

const TaskItem = ({ task, onStatusChange, onPress }) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA000';
      case 'In Progress':
        return '#1E88E5';
      case 'Completed':
        return '#43A047';
      default:
        return theme.textColor;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#F44336';
      case 'Medium':
        return '#FB8C00';
      case 'Low':
        return '#4CAF50';
      default:
        return theme.textColor;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(task)} style={[styles.taskItem, { backgroundColor: theme.inputBackground }]}>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, { color: theme.textColor }]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>{task.status}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => onStatusChange(task.id)}
      >
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const TaskListScreen = ({ handleLogout }) => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'Pending' });

  const handleStatusChange = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'Pending' ? 'In Progress' :
                            task.status === 'In Progress' ? 'Completed' : 'Pending';
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      setTasks(prevTasks => [
        ...prevTasks,
        {
          id: (prevTasks.length + 1).toString(),
          ...newTask
        }
      ]);
      setIsAddModalVisible(false);
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'Pending' });
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  const handleEditTask = (editedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editedTask.id ? editedTask : task
      )
    );
    setSelectedTask(null);
  };

  const filteredAndSortedTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(task => filterStatus === 'All' || task.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'status') {
        const statusOrder = { Pending: 1, 'In Progress': 2, Completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Task List</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
        placeholder="Search tasks..."
        placeholderTextColor={theme.placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: theme.textColor }]}>Filter:</Text>
        {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filterStatus === status && styles.activeFilterButton]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={styles.filterButtonText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.textColor }]}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'priority' && styles.activeSortButton]}
          onPress={() => setSortBy('priority')}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Priority</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'status' && styles.activeSortButton]}
          onPress={() => setSortBy('status')}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Status</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedTasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onStatusChange={handleStatusChange}
            onPress={setSelectedTask}
          />
        )}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Task</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Title"
              placeholderTextColor={theme.placeholderColor}
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Description"
              placeholderTextColor={theme.placeholderColor}
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              multiline
            />
            <View style={styles.priorityContainer}>
              <Text style={[styles.priorityLabel, { color: theme.textColor }]}>Priority:</Text>
              {['Low', 'Medium', 'High'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newTask.priority === priority && styles.activePriorityButton
                  ]}
                  onPress={() => setNewTask({ ...newTask, priority })}
                >
                  <Text style={styles.priorityButtonText}>{priority}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.addModalButton, { backgroundColor: theme.primaryColor }]}
              onPress={handleAddTask}
            >
              <Text style={styles.addModalButtonText}>Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelModalButton, { backgroundColor: theme.dangerColor }]}
              onPress={() => setIsAddModalVisible(false)}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedTask}
        onRequestClose={() => setSelectedTask(null)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Task Details</Text>
            {selectedTask && (
              <>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                  value={selectedTask.title}
                  onChangeText={(text) => setSelectedTask({ ...selectedTask, title: text })}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
                  value={selectedTask.description}
                  onChangeText={(text) => setSelectedTask({ ...selectedTask, description: text })}
                  multiline
                />
                <View style={styles.priorityContainer}>
                  <Text style={[styles.priorityLabel, { color: theme.textColor }]}>Priority:</Text>
                  {['Low', 'Medium', 'High'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        selectedTask.priority === priority && styles.activePriorityButton
                      ]}
                      onPress={() => setSelectedTask({ ...selectedTask, priority })}
                    >
                      <Text style={styles.priorityButtonText}>{priority}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.addModalButton, { backgroundColor: theme.primaryColor }]}
                  onPress={() => handleEditTask(selectedTask)}
                >
                  <Text style={styles.addModalButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelModalButton, { backgroundColor: theme.dangerColor }]}
                  onPress={() => setSelectedTask(null)}
                >
                  <Text style={styles.cancelModalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    marginRight: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginRight: 5,
  },
  activeFilterButton: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortLabel: {
    marginRight: 10,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  activeSortButton: {
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
  },
  sortButtonText: {
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    
    marginBottom: 10,
    elevation: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  priorityLabel: {
    marginRight: 10,
  },
  priorityButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginRight: 5,
  },
  activePriorityButton: {
    backgroundColor: '#2E7D32',
  },
  priorityButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  addModalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelModalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TaskListScreen;