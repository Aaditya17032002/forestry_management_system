import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const WorkOrderItem = ({ workOrder }) => {
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

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBackground }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.textColor }]}>{workOrder.title}</Text>
        <Text style={[styles.dueDate, { color: theme.textColor }]}>Due: {workOrder.dueDate}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
          <Text style={styles.statusText}>{workOrder.status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.detailsButton}>
        <Ionicons name="chevron-forward" size={24} color={theme.primaryColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsButton: {
    padding: 5,
  },
});

export default WorkOrderItem;