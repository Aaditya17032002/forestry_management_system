import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const initialUsers = [
  { id: '1', name: 'John Doe', role: 'Forestry Manager', status: 'Active' },
  { id: '2', name: 'Jane Smith', role: 'Field Operative', status: 'Active' },
  { id: '3', name: 'Mike Johnson', role: 'GIS Specialist', status: 'Inactive' },
  { id: '4', name: 'Sarah Williams', role: 'Emergency Response Coordinator', status: 'Active' },
  { id: '5', name: 'Chris Brown', role: 'Administrator', status: 'Active' },
];

const UserItem = ({ user, onEdit, onToggleStatus }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.userItem, { backgroundColor: theme.inputBackground }]}>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.textColor }]}>{user.name}</Text>
        <Text style={[styles.userRole, { color: theme.textColor }]}>{user.role}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: user.status === 'Active' ? '#4CAF50' : '#F44336' }]}
          onPress={() => onToggleStatus(user.id)}
        >
          <Text style={styles.statusButtonText}>{user.status}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.primaryColor }]}
          onPress={() => onEdit(user)}
        >
          <Ionicons name="create" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserManagementScreen = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  const handleToggleStatus = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      )
    );
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? { ...user, name: editName, role: editRole }
            : user
        )
      );
      setEditingUser(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>User Management</Text>
      {editingUser ? (
        <View style={styles.editForm}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
            value={editName}
            onChange={setEditName}
            placeholder="Name"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
            value={editRole}
            onChange={setEditRole}
            placeholder="Role"
            placeholderTextColor={theme.placeholderColor}
          />
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primaryColor }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          )}
          keyExtractor={item => item.id}
        />
      )}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => {/* Add new user logic */}}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

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
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
    borderRadius: 5,
  },
  editForm: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default UserManagementScreen;