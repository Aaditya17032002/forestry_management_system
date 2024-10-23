import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';

const SystemHealthCheckScreen = () => {
  const { theme } = useTheme();
  const [cpuUsage, setCpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);
  const [diskSpace, setDiskSpace] = useState({ used: 0, total: 100 });
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Simulating real-time data updates
    const interval = setInterval(() => {
      setCpuUsage(prev => [...prev.slice(-11), Math.floor(Math.random() * 100)]);
      setMemoryUsage(prev => [...prev.slice(-11), Math.floor(Math.random() * 100)]);
      setDiskSpace({ used: Math.floor(Math.random() * 80) + 10, total: 100 });
      setActiveUsers(Math.floor(Math.random() * 50) + 10);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderStatusIndicator = (status) => {
    const color = status === 'Operational' ? '#4CAF50' : '#F44336';
    return (
      <View style={[styles.statusIndicator, { backgroundColor: color }]} />
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>System Health Check</Text>

      <View style={styles.overviewContainer}>
        <View style={[styles.overviewItem, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.overviewLabel, { color: theme.textColor }]}>System Status</Text>
          <View style={styles.statusContainer}>
            {renderStatusIndicator('Operational')}
            <Text style={[styles.statusText, { color: theme.textColor }]}>Operational</Text>
          </View>
        </View>
        <View style={[styles.overviewItem, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.overviewLabel, { color: theme.textColor }]}>Active Users</Text>
          <Text style={[styles.overviewValue, { color: theme.textColor }]}>{activeUsers}</Text>
        </View>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.inputBackground }]}>
        <Text style={[styles.chartTitle, { color: theme.textColor }]}>CPU Usage</Text>
        <LineChart
          data={{
            labels: [...Array(12).keys()].map(i => (i * 5).toString()),
            datasets: [{ data: cpuUsage }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.chartBackground,
            backgroundGradientFrom: theme.chartGradientFrom,
            backgroundGradientTo: theme.chartGradientTo,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.inputBackground }]}>
        <Text style={[styles.chartTitle, { color: theme.textColor }]}>Memory Usage</Text>
        <LineChart
          data={{
            labels: [...Array(12).keys()].map(i => (i * 5).toString()),
            datasets: [{ data: memoryUsage }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.chartBackground,
            backgroundGradientFrom: theme.chartGradientFrom,
            backgroundGradientTo: theme.chartGradientTo,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.inputBackground }]}>
        <Text style={[styles.chartTitle, { color: theme.textColor }]}>Disk Space</Text>
        <BarChart
          data={{
            labels: ['Used', 'Free'],
            datasets: [{ data: [diskSpace.used, diskSpace.total - diskSpace.used] }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.chartBackground,
            backgroundGradientFrom: theme.chartGradientFrom,
            backgroundGradientTo: theme.chartGradientTo,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => {/* Refresh data logic */}}
      >
        <Ionicons name="refresh" size={24} color="#fff" />
        <Text style={styles.refreshButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </ScrollView>
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
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SystemHealthCheckScreen;