import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const inspections = [
  { id: '1', title: 'Annual Tree Health Check', date: '2023-06-20', status: 'Pending' },
  { id: '2', title: 'Quarterly Pest Inspection', date: '2023-06-15', status: 'Completed' },
  { id: '3', title: 'Fire Hazard Assessment', date: '2023-06-25', status: 'Pending' },
  { id: '4', title: 'Soil Quality Analysis', date: '2023-06-10', status: 'Overdue' },
];

const InspectionItem = ({ inspection }) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA000';
      case 'Completed':
        return '#4CAF50';
      case 'Overdue':
        return '#F44336';
      default:
        return theme.textColor;
    }
  };

  return (
    <View style={[styles.itemContainer, { backgroundColor: theme.inputBackground }]}>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: theme.textColor }]}>{inspection.title}</Text>
        <Text style={[styles.itemDate, { color: theme.textColor }]}>{inspection.date}</Text>
      </View>
      <View style={[styles.statusContainer, { backgroundColor: getStatusColor(inspection.status) }]}>
        <Text style={styles.statusText}>{inspection.status}</Text>
      </View>
    </View>
  );
};

const InspectionList = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textColor }]}>Upcoming Inspections</Text>
      <FlatList
        data={inspections}
        renderItem={({ item }) => <InspectionItem inspection={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 14,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InspectionList;