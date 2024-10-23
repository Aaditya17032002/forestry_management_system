import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialResources = [
  { id: '1', name: 'Fire Trucks', available: 5, total: 8, location: 'Station A' },
  { id: '2', name: 'Ambulances', available: 3, total: 4, location: 'Station B' },
  { id: '3', name: 'Helicopters', available: 1, total: 2, location: 'Helipad C' },
  { id: '4', name: 'Emergency Personnel', available: 25, total: 30, location: 'HQ' },
  { id: '5', name: 'Water Pumps', available: 10, total: 15, location: 'Warehouse D' },
];

const ResourceItem = ({ resource, onUpdate, onViewHistory }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAvailable, setEditedAvailable] = useState(resource.available.toString());

  const handleSave = () => {
    const newAvailable = parseInt(editedAvailable, 10);
    if (!isNaN(newAvailable) && newAvailable >= 0 && newAvailable <= resource.total) {
      onUpdate(resource.id, newAvailable);
      setIsEditing(false);
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number within the total range.');
    }
  };

  return (
    <View style={[styles.resourceItem, { backgroundColor: theme.inputBackground }]}>
      <View style={styles.resourceInfo}>
        <Text style={[styles.resourceName, { color: theme.textColor }]}>{resource.name}</Text>
        <Text style={[styles.resourceLocation, { color: theme.textColor }]}>Location: {resource.location}</Text>
        {isEditing ? (
          <TextInput
            style={[styles.editInput, { backgroundColor: theme.backgroundColor, color: theme.textColor }]}
            value={editedAvailable}
            onChangeText={setEditedAvailable}
            keyboardType="numeric"
            autoFocus
          />
        ) : (
          <Text style={[styles.resourceCount, { color: theme.textColor }]}>
            Available: {resource.available} / {resource.total}
          </Text>
        )}
      </View>
      <View style={styles.resourceActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Ionicons name={isEditing ? 'checkmark' : 'create'} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.infoColor }]}
          onPress={() => onViewHistory(resource)}
        >
          <Ionicons name="time" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EmergencyResourcesScreen = ({ handleLogout }) => {
  const { theme } = useTheme();
  const [resources, setResources] = useState(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', total: '', location: '' });
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [selectedResourceHistory, setSelectedResourceHistory] = useState(null);

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateResource = (id, newAvailable) => {
    setResources(prevResources =>
      prevResources.map(resource =>
        resource.id === id ? { ...resource, available: newAvailable } : resource
      )
    );
  };

  const handleAddResource = () => {
    if (newResource.name && newResource.total && newResource.location) {
      const totalValue = parseInt(newResource.total, 10);
      if (!isNaN(totalValue) && totalValue > 0) {
        setResources(prevResources => [
          ...prevResources,
          {
            id: (prevResources.length + 1).toString(),
            ...newResource,
            total: totalValue,
            available: totalValue
          }
        ]);
        setIsAddModalVisible(false);
        setNewResource({ name: '', total: '', location: '' });
      } else {
        Alert.alert('Invalid Input', 'Please enter a valid positive number for total resources.');
      }
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  const handleViewHistory = (resource) => {
    // In a real app, this would fetch the actual usage history from a backend
    const mockHistory = [
      { date: '2023-06-20', action: 'Deployed', quantity: 2 },
      { date: '2023-06-19', action: 'Returned', quantity: 1 },
      { date: '2023-06-18', action: 'Maintenance', quantity: 1 },
    ];
    setSelectedResourceHistory({ ...resource, history: mockHistory });
    setIsHistoryModalVisible(true);
  };

  const handleResourceRequest = () => {
    // In a real app, this would open a more complex form or workflow
    Alert.alert(
      'Request Additional Resources',
      'This would open a form to request additional resources from other stations or external agencies.'
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setResources(prevResources =>
        prevResources.map(resource => ({
          ...resource,
          available: Math.max(0, resource.available - Math.floor(Math.random() * 2))
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Emergency Resources</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
        placeholder="Search resources..."
        placeholderTextColor={theme.placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredResources}
        renderItem={({ item }) => (
          <ResourceItem
            resource={item}
            onUpdate={handleUpdateResource}
            onViewHistory={handleViewHistory}
          />
        )}
        keyExtractor={item => item.id}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primaryColor }]}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.requestButton, { backgroundColor: theme.warningColor }]}
          onPress={handleResourceRequest}
        >
          <Text style={styles.requestButtonText}>Request Resources</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Resource</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Resource Name"
              placeholderTextColor={theme.placeholderColor}
              value={newResource.name}
              onChangeText={(text) => setNewResource({ ...newResource, name: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Total Quantity"
              placeholderTextColor={theme.placeholderColor}
              value={newResource.total}
              onChangeText={(text) => setNewResource({ ...newResource, total: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Location"
              placeholderTextColor={theme.placeholderColor}
              value={newResource.location}
              onChangeText={(text) => setNewResource({ ...newResource, location: text })}
            />
            <TouchableOpacity
              style={[styles.addModalButton, { backgroundColor: theme.primaryColor }]}
              onPress={handleAddResource}
            >
              <Text style={styles.addModalButtonText}>Add Resource</Text>
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
        visible={isHistoryModalVisible}
        onRequestClose={() => setIsHistoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Resource Usage History</Text>
            {selectedResourceHistory && (
              <>
                <Text style={[styles.historyResourceName, { color: theme.textColor }]}>{selectedResourceHistory.name}</Text>
                <FlatList
                  data={selectedResourceHistory.history}
                  renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                      <Text style={[styles.historyDate, { color: theme.textColor }]}>{item.date}</Text>
                      <Text style={[styles.historyAction, { color: theme.textColor }]}>{item.action}</Text>
                      <Text style={[styles.historyQuantity, { color: theme.textColor }]}>Qty: {item.quantity}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </>
            )}
            <TouchableOpacity
              style={[styles.closeModalButton, { backgroundColor: theme.primaryColor }]}
              onPress={() => setIsHistoryModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
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
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resourceLocation: {
    fontSize: 14,
    marginBottom: 5,
  },
  resourceCount: {
    fontSize: 16,
  },
  resourceActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  editInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  requestButton: {
    flex: 1,
    marginLeft: 20,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  historyResourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  historyDate: {
    flex: 1,
  },
  historyAction: {
    flex: 1,
    textAlign: 'center',
  },
  historyQuantity: {
    flex: 1,
    textAlign: 'right',
  },
  closeModalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EmergencyResourcesScreen;