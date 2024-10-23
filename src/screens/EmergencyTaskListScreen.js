import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialEmergencyTasks = [
  { id: '1', title: 'Wildfire Containment in Sector A', priority: 'High', status: 'In Progress', estimatedTime: '2 hours', location: 'Sector A', assignedTo: 'Team Alpha' },
  { id: '2', title: 'Flood Risk Assessment in Sector B', priority: 'Medium', status: 'Pending', estimatedTime: '1 hour', location: 'Sector B', assignedTo: 'Team Beta' },
  { id: '3', title: 'Landslide Evacuation in Sector C', priority: 'High', status: 'Completed', estimatedTime: '3 hours', location: 'Sector C', assignedTo: 'Team Gamma' },
  { id: '4', title: 'Storm Damage Survey in Sector D', priority: 'Low', status: 'Pending', estimatedTime: '2 hours', location: 'Sector D', assignedTo: 'Team Delta' },
  { id: '5', title: 'Wildlife Rescue Operation in Sector E', priority: 'Medium', status: 'In Progress', estimatedTime: '4 hours', location: 'Sector E', assignedTo: 'Team Epsilon' },
];

const EmergencyTaskItem = ({ task, onStatusChange, onPriorityChange, onPress }) => {
  const { theme } = useTheme();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#FF5252';
      case 'Medium':
        return '#FFA000';
      case 'Low':
        return '#4CAF50';
      default:
        return theme.textColor;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA000';
      case 'In Progress':
        return '#2196F3';
      case 'Completed':
        return '#4CAF50';
      default:
        return theme.textColor;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(task)} style={[styles.taskItem, { backgroundColor: theme.inputBackground }]}>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, { color: theme.textColor }]}>{task.title}</Text>
        <Text style={[styles.taskDetails, { color: theme.textColor }]}>Location: {task.location}</Text>
        <Text style={[styles.taskDetails, { color: theme.textColor }]}>Assigned to: {task.assignedTo}</Text>
        <Text style={[styles.taskDetails, { color: theme.textColor }]}>Est. Time: {task.estimatedTime}</Text>
        <View style={styles.taskMeta}>
          <TouchableOpacity onPress={() => onPriorityChange(task.id)} style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onStatusChange(task.id)}>
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>{task.status}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmergencyTaskListScreen = ({ handleLogout }) => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState(initialEmergencyTasks);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', status: 'Pending', estimatedTime: '', location: '', assignedTo: '' });

  useEffect(() => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'status') {
        const statusOrder = { 'In Progress': 1, Pending: 2, Completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
    setFilteredTasks(sorted);
  }, [tasks, searchQuery, sortBy]);

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

  const handlePriorityChange = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newPriority = task.priority === 'Low' ? 'Medium' :
                              task.priority === 'Medium' ? 'High' : 'Low';
          return { ...task, priority: newPriority };
        }
        return task;
      })
    );
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.location && newTask.assignedTo && newTask.estimatedTime) {
      setTasks(prevTasks => [
        ...prevTasks,
        {
          id: (prevTasks.length + 1).toString(),
          ...newTask
        }
      ]);
      setIsAddModalVisible(false);
      setNewTask({ title: '', priority: 'Medium', status: 'Pending', estimatedTime: '', location: '', assignedTo: '' });
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  const handleQuickAction = (action, task) => {
    switch (action) {
      case 'complete':
        setTasks(prevTasks =>
          prevTasks.map(t => t.id === task.id ? { ...t, status: 'Completed' } : t)
        );
        break;
      case 'escalate':
        setTasks(prevTasks =>
          prevTasks.map(t => t.id === task.id ? { ...t, priority: 'High' } : t)
        );
        break;
      case 'reassign':
        // In a real app, this would open a modal to select a new team
        Alert.alert('Reassign Task', 'This would open a team selection modal in a full app.');
        break;
    }
    setSelectedTask(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Emergency Tasks</Text>
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
        data={filteredTasks}
        renderItem={({ item }) => (
          <EmergencyTaskItem
            task={item}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
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
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Emergency Task</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Title"
              placeholderTextColor={theme.placeholderColor}
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Location"
              placeholderTextColor={theme.placeholderColor}
              value={newTask.location}
              onChangeText={(text) => setNewTask({ ...newTask, location: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Assigned To"
              placeholderTextColor={theme.placeholderColor}
              value={newTask.assignedTo}
              onChangeText={(text) => setNewTask({ ...newTask, assignedTo: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Estimated Time (e.g., 2 hours)"
              placeholderTextColor={theme.placeholderColor}
              value={newTask.estimatedTime}
              onChangeText={(text) => setNewTask({ ...newTask, estimatedTime: text })}
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
                <Text style={[styles.taskDetailsText, { color: theme.textColor }]}>Title: {selectedTask.title}</Text>
                <Text style={[styles.taskDetailsText, { color: theme.textColor }]}>Location: {selectedTask.location}</Text>
                <Text style={[styles.taskDetailsText, { color: theme.textColor }]}>Assigned To: {selectedTask.assignedTo}</Text>
                <Text style={[styles.taskDetailsText, { color: theme.textColor }]}>Estimated Time: {selectedTask.estimatedTime}</Text>
                <Text style={[styles.taskDetailsText, { color: theme.textColor }]}>Priority: {selectedTask.priority}</Text>
                <Text style={[styles.taskDetailsText, { color: theme.textColor }]}>Status: {selectedTask.status}</Text>
                <View style={styles.quickActionContainer}>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.primaryColor }]}
                    onPress={() => handleQuickAction('complete', selectedTask)}
                  >
                    <Text style={styles.quickActionButtonText}>Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.warningColor }]}
                    onPress={() => handleQuickAction('escalate', selectedTask)}
                  >
                    <Text style={styles.quickActionButtonText}>Escalate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.infoColor }]}
                    onPress={() => handleQuickAction('reassign', selectedTask)}
                  >
                    
                    <Text style={styles.quickActionButtonText}>Reassign</Text>
                  </TouchableOpacity>
                </View>
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
  taskDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
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
  taskDetailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  quickActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  quickActionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EmergencyTaskListScreen;