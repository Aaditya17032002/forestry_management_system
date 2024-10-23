import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialInspections = [
  { id: '1', title: 'Annual Tree Health Check', date: '2023-07-15', status: 'Scheduled', priority: 'High', assignedTo: 'John Doe' },
  { id: '2',   title: 'Quarterly Soil Quality Assessment', date: '2023-08-01', status: 'In Progress', priority: 'Medium', assignedTo: 'Jane Smith' },
  { id: '3', title: 'Monthly Fire Risk Evaluation', date: '2023-06-30', status: 'Completed', priority: 'High', assignedTo: 'Mike Johnson' },
  { id: '4', title: 'Bi-annual Wildlife Population Survey', date: '2023-09-15', status: 'Scheduled', priority: 'Medium', assignedTo: 'Sarah Williams' },
  { id: '5', title: 'Annual Pest Control Inspection', date: '2023-07-30', status: 'Scheduled', priority: 'Low', assignedTo: 'Chris Brown' },
];

const InspectionItem = ({ item, onPress, onStatusChange }) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
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
      style={[styles.inspectionItem, { backgroundColor: theme.inputBackground }]}
      onPress={() => onPress(item)}
    >
      <View style={styles.inspectionInfo}>
        <Text style={[styles.inspectionTitle, { color: theme.textColor }]}>{item.title}</Text>
        <Text style={[styles.inspectionDetails, { color: theme.textColor }]}>Date: {item.date}</Text>
        <Text style={[styles.inspectionDetails, { color: theme.textColor }]}>Assigned to: {item.assignedTo}</Text>
      </View>
      <View style={styles.inspectionMeta}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
        <TouchableOpacity onPress={() => onStatusChange(item.id)}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function InspectionOverviewScreen({ handleLogout }) {
  const { theme } = useTheme();
  const [inspections, setInspections] = useState(initialInspections);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newInspection, setNewInspection] = useState({ title: '', date: '', priority: 'Medium', assignedTo: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleStatusChange = (id) => {
    setInspections(prevInspections =>
      prevInspections.map(inspection => {
        if (inspection.id === id) {
          const newStatus = inspection.status === 'Scheduled' ? 'In Progress' :
                            inspection.status === 'In Progress' ? 'Completed' : 'Scheduled';
          return { ...inspection, status: newStatus };
        }
        return inspection;
      })
    );
  };

  const handleAddInspection = () => {
    if (newInspection.title && newInspection.date && newInspection.assignedTo) {
      setInspections(prevInspections => [
        ...prevInspections,
        {
          id: (prevInspections.length + 1).toString(),
          ...newInspection,
          status: 'Scheduled'
        }
      ]);
      setIsAddModalVisible(false);
      setNewInspection({ title: '', date: '', priority: 'Medium', assignedTo: '' });
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  const sortedAndFilteredInspections = inspections
    .filter(inspection => inspection.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(inspection => filterStatus === 'All' || inspection.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return sortOrder === 'asc' ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Inspection Overview</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
        placeholder="Search inspections..."
        placeholderTextColor={theme.placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: theme.textColor }]}>Filter by status:</Text>
        {['All', 'Scheduled', 'In Progress', 'Completed'].map((status) => (
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
          style={[styles.sortButton, sortBy === 'date' && styles.activeSortButton]}
          onPress={() => {
            setSortBy('date');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Date</Text>
          {sortBy === 'date' && <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color={theme.textColor} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'priority' && styles.activeSortButton]}
          onPress={() => {
            setSortBy('priority');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Priority</Text>
          {sortBy === 'priority' && <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color={theme.textColor} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedAndFilteredInspections}
        renderItem={({ item }) => (
          <InspectionItem
            item={item}
            onPress={(inspection) => Alert.alert('Inspection Details', JSON.stringify(inspection, null, 2))}
            onStatusChange={handleStatusChange}
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
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Inspection</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Title"
              placeholderTextColor={theme.placeholderColor}
              value={newInspection.title}
              onChangeText={(text) => setNewInspection({ ...newInspection, title: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor={theme.placeholderColor}
              value={newInspection.date}
              onChangeText={(text) => setNewInspection({ ...newInspection, date: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Assigned To"
              placeholderTextColor={theme.placeholderColor}
              value={newInspection.assignedTo}
              onChangeText={(text) => setNewInspection({ ...newInspection, assignedTo: text })}
            />
            <View style={styles.priorityContainer}>
              <Text style={[styles.priorityLabel, { color: theme.textColor }]}>Priority:</Text>
              {['Low', 'Medium', 'High'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newInspection.priority === priority && styles.activePriorityButton
                  ]}
                  onPress={() => setNewInspection({ ...newInspection, priority })}
                >
                  <Text style={styles.priorityButtonText}>{priority}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.addModalButton, { backgroundColor: theme.primaryColor }]}
              onPress={handleAddInspection}
            >
              <Text style={styles.addModalButtonText}>Add Inspection</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 5,
  },
  inspectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  inspectionInfo: {
    flex: 1,
  },
  inspectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inspectionDetails: {
    fontSize: 14,
  },
  inspectionMeta: {
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