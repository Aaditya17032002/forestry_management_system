import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialWorkOrders = [
  { id: '1', title: 'Tree Pruning', status: 'Pending', dueDate: '2023-06-15', priority: 'High', assignedTo: 'John Doe' },
  { id: '2', title: 'Pest Control', status: 'In Progress', dueDate: '2023-06-20', priority: 'Medium', assignedTo: 'Jane Smith' },
  { id: '3', title: 'Reforestation', status: 'Completed', dueDate: '2023-06-10', priority: 'Low', assignedTo: 'Mike Johnson' },
  { id: '4', title: 'Soil Analysis', status: 'Pending', dueDate: '2023-06-25', priority: 'High', assignedTo: 'Sarah Williams' },
  { id: '5', title: 'Fire Break Maintenance', status: 'In Progress', dueDate: '2023-06-18', priority: 'Medium', assignedTo: 'Chris Brown' },
];

const WorkOrderItem = ({ workOrder, onPress, onStatusChange }) => {
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
    <TouchableOpacity
      style={[styles.workOrderItem, { backgroundColor: theme.inputBackground }]}
      onPress={() => onPress(workOrder)}
    >
      <View style={styles.workOrderInfo}>
        <Text style={[styles.workOrderTitle, { color: theme.textColor }]}>{workOrder.title}</Text>
        <Text style={[styles.workOrderDetails, { color: theme.textColor }]}>Due: {workOrder.dueDate}</Text>
        <Text style={[styles.workOrderDetails, { color: theme.textColor }]}>Assigned to: {workOrder.assignedTo}</Text>
      </View>
      <View style={styles.workOrderMeta}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(workOrder.priority) }]}>
          <Text style={styles.priorityText}>{workOrder.priority}</Text>
        </View>
        <TouchableOpacity onPress={() => onStatusChange(workOrder.id)}>
          <Text style={[styles.statusText, { color: getStatusColor(workOrder.status) }]}>{workOrder.status}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function WorkOrderManagementScreen() {
  const { theme } = useTheme();
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState({ title: '', dueDate: '', priority: 'Medium', assignedTo: '' });

  const sortedAndFilteredWorkOrders = workOrders
    .filter(wo => filterStatus === 'All' || wo.status === filterStatus)
    .filter(wo => wo.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const handleStatusChange = (id) => {
    setWorkOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === id) {
          const newStatus = order.status === 'Pending' ? 'In Progress' :
                            order.status === 'In Progress' ? 'Completed' : 'Pending';
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  const handleAddWorkOrder = () => {
    if (newWorkOrder.title && newWorkOrder.dueDate && newWorkOrder.assignedTo) {
      setWorkOrders(prevOrders => [
        ...prevOrders,
        {
          id: (prevOrders.length + 1).toString(),
          ...newWorkOrder,
          status: 'Pending'
        }
      ]);
      setIsAddModalVisible(false);
      setNewWorkOrder({ title: '', dueDate: '', priority: 'Medium', assignedTo: '' });
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Work Order Management</Text>
      
      <View style={styles.filterContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
          placeholder="Search work orders..."
          placeholderTextColor={theme.placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'All' && styles.activeFilterButton]}
            onPress={() => setFilterStatus('All')}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'Pending' && styles.activeFilterButton]}
            onPress={() => setFilterStatus('Pending')}
          >
            <Text style={styles.filterButtonText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'In Progress' && styles.activeFilterButton]}
            onPress={() => setFilterStatus('In Progress')}
          >
            <Text style={styles.filterButtonText}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'Completed' && styles.activeFilterButton]}
            onPress={() => setFilterStatus('Completed')}
          >
            <Text style={styles.filterButtonText}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.textColor }]}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'dueDate' && styles.activeSortButton]}
          onPress={() => setSortBy('dueDate')}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Due Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'priority' && styles.activeSortButton]}
          onPress={() => setSortBy('priority')}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Priority</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedAndFilteredWorkOrders}
        renderItem={({ item }) => (
          <WorkOrderItem
            workOrder={item}
            onPress={(workOrder) => Alert.alert('Work Order Details', JSON.stringify(workOrder, null, 2))}
            onStatusChange={handleStatusChange}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.list}
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
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Work Order</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Title"
              placeholderTextColor={theme.placeholderColor}
              value={newWorkOrder.title}
              onChangeText={(text) => setNewWorkOrder({ ...newWorkOrder, title: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Due Date (YYYY-MM-DD)"
              placeholderTextColor={theme.placeholderColor}
              value={newWorkOrder.dueDate}
              onChangeText={(text) => setNewWorkOrder({ ...newWorkOrder, dueDate: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Assigned To"
              placeholderTextColor={theme.placeholderColor}
              value={newWorkOrder.assignedTo}
              onChangeText={(text) => setNewWorkOrder({ ...newWorkOrder, assignedTo: text })}
            />
            <View style={styles.priorityContainer}>
              <Text style={[styles.priorityLabel, { color: theme.textColor }]}>Priority:</Text>
              {['Low', 'Medium', 'High'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newWorkOrder.priority === priority && styles.activePriorityButton
                  ]}
                  onPress={() => setNewWorkOrder({ ...newWorkOrder, priority })}
                >
                  <Text style={styles.priorityButtonText}>{priority}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.addModalButton, { backgroundColor: theme.primaryColor }]}
              onPress={handleAddWorkOrder}
            >
              <Text style={styles.addModalButtonText}>Add Work Order</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
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
  list: {
    flex: 1,
  },
  workOrderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  workOrderInfo: {
    flex: 1,
  },
  workOrderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workOrderDetails: {
    fontSize: 14,
  },
  workOrderMeta: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
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
});