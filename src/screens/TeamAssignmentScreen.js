import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialTeamMembers = [
  { id: '1', name: 'John Doe', role: 'Field Operative', status: 'Available', skills: ['Tree Inspection', 'Soil Analysis'] },
  { id: '2', name: 'Jane Smith', role: 'GIS Specialist', status: 'On Task', skills: ['Mapping', 'Data Analysis'] },
  { id: '3', name: 'Mike Johnson', role: 'Field Operative', status: 'Available', skills: ['Pest Control', 'Fire Management'] },
  { id: '4', name: 'Sarah Williams', role: 'Emergency Response', status: 'On Task', skills: ['First Aid', 'Evacuation Planning'] },
  { id: '5', name: 'Chris Brown', role: 'Field Operative', status: 'On Leave', skills: ['Reforestation', 'Wildlife Management'] },
];

const TeamMemberItem = ({ member, onAssign, onViewDetails }) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return '#4CAF50';
      case 'On Task':
        return '#FFA000';
      case 'On Leave':
        return '#F44336';
      default:
        return theme.textColor;
    }
  };

  return (
    <View style={[styles.itemContainer, { backgroundColor: theme.inputBackground }]}>
      <TouchableOpacity onPress={() => onViewDetails(member)} style={styles.itemContent}>
        <Text style={[styles.itemName, { color: theme.textColor }]}>{member.name}</Text>
        <Text style={[styles.itemRole, { color: theme.textColor }]}>{member.role}</Text>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(member.status) }]}>
          <Text style={styles.statusText}>{member.status}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.assignButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => onAssign(member)}
      >
        <Ionicons name="person-add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default function TeamAssignmentScreen() {
  const { theme } = useTheme();
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', skills: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const filteredMembers = teamMembers
    .filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(member => filterRole === 'All' || member.role === filterRole);

  const handleAssign = (member) => {
    setSelectedMember(member);
    setIsAssignModalVisible(true);
  };

  const handleViewDetails = (member) => {
    Alert.alert(
      `${member.name} Details`,
      `Role: ${member.role}\nStatus: ${member.status}\nSkills: ${member.skills.join(', ')}`
    );
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setTeamMembers(prevMembers => [
        ...prevMembers,
        {
          id: (prevMembers.length + 1).toString(),
          ...newMember,
          status: 'Available',
          skills: newMember.skills.split(',').map(skill => skill.trim())
        }
      ]);
      setIsAddMemberModalVisible(false);
      setNewMember({ name: '', role: '', skills: '' });
    } else {
      Alert.alert('Invalid Input', 'Please fill in all required fields');
    }
  };

  const handleStatusChange = (memberId, newStatus) => {
    setTeamMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId ? { ...member, status: newStatus } : member
      )
    );
    setIsAssignModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Team Assignment</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
          placeholder="Search team members..."
          placeholderTextColor={theme.placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: theme.textColor }]}>Filter by role:</Text>
        <TouchableOpacity
          style={[styles.filterButton, filterRole === 'All' && styles.activeFilterButton]}
          onPress={() => setFilterRole('All')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterRole === 'Field Operative' && styles.activeFilterButton]}
          onPress={() => setFilterRole('Field Operative')}
        >
          <Text style={styles.filterButtonText}>Field Operative</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterRole === 'GIS Specialist' && styles.activeFilterButton]}
          onPress={() => setFilterRole('GIS Specialist')}
        >
          <Text style={styles.filterButtonText}>GIS Specialist</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMembers}
        renderItem={({ item }) => (
          <TeamMemberItem
            member={item}
            onAssign={handleAssign}
            onViewDetails={handleViewDetails}
          />
        )}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => setIsAddMemberModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAssignModalVisible}
        onRequestClose={() => setIsAssignModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Assign {selectedMember?.name}</Text>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleStatusChange(selectedMember?.id, 'Available')}
            >
              <Text style={styles.statusButtonText}>Set Available</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#FFA000' }]}
              onPress={() => handleStatusChange(selectedMember?.id, 'On Task')}
            >
              <Text style={styles.statusButtonText}>Set On Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#F44336' }]}
              onPress={() => handleStatusChange(selectedMember?.id, 'On Leave')}
            >
              <Text style={styles.statusButtonText}>Set On Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.dangerColor }]}
              onPress={() => setIsAssignModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddMemberModalVisible}
        onRequestClose={() => setIsAddMemberModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Team Member</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Name"
              placeholderTextColor={theme.placeholderColor}
              value={newMember.name}
              onChangeText={(text) => setNewMember({ ...newMember, name: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Role"
              placeholderTextColor={theme.placeholderColor}
              value={newMember.role}
              onChangeText={(text) => setNewMember({ ...newMember, role: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Skills (comma-separated)"
              placeholderTextColor={theme.placeholderColor}
              value={newMember.skills}
              onChangeText={(text) => setNewMember({ ...newMember, skills: text })}
            />
            <TouchableOpacity
              style={[styles.addMemberButton, { backgroundColor: theme.primaryColor }]}
              onPress={handleAddMember}
            >
              <Text style={styles.addMemberButtonText}>Add Team Member</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.dangerColor }]}
              onPress={() => setIsAddMemberModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemRole: {
    fontSize: 14,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  assignButton: {
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
  statusButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addMemberButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addMemberButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});