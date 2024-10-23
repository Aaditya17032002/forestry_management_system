import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ handleLogout }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(3);

  const workOrderData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [20, 45, 35],
      },
    ],
  };

  const teamStatusData = [
    {
      name: 'Available',
      population: 40,
      color: '#7CB9E8',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'On Task',
      population: 60,
      color: '#0066b2',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const handleAIInsight = () => {
    Alert.alert('AI Insight', 'Based on current data, we predict a 20% increase in work orders next month. Consider allocating additional resources.');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'You have 3 new notifications:\n\n1. New work order assigned\n2. Team meeting at 2 PM\n3. Weather alert: Heavy rain expected');
    setNotifications(0);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNotifications} style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Work Orders Overview</Text>
        <BarChart
          data={workOrderData}
          width={300}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: theme.chartBackground,
            backgroundGradientFrom: theme.chartGradientFrom,
            backgroundGradientTo: theme.chartGradientTo,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Team Status</Text>
        <PieChart
          data={teamStatusData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: theme.chartBackground,
            backgroundGradientFrom: theme.chartGradientFrom,
            backgroundGradientTo: theme.chartGradientTo,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('WorkOrderManagement')}
  >
    <Ionicons name="list" size={24} color="#fff" />
    <Text style={styles.buttonText}>Work Orders</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('InspectionOverview')}
  >
    <Ionicons name="search" size={24} color="#fff" />
    <Text style={styles.buttonText}>Inspections</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('TeamAssignment')}
  >
    <Ionicons name="people" size={24} color="#fff" />
    <Text style={styles.buttonText}>Team</Text>
  </TouchableOpacity>
</View>


      <TouchableOpacity
        style={styles.aiInsightButton}
        onPress={handleAIInsight}
      >
        <Ionicons name="bulb" size={24} color="#fff" />
        <Text style={styles.buttonText}>Get AI Insight</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.weatherButton}
        onPress={() => Alert.alert('Weather Forecast', 'Today: Partly cloudy, High: 75°F, Low: 60°F\nTomorrow: Sunny, High: 80°F, Low: 62°F')}
      >
        <Ionicons name="partly-sunny" size={24} color="#fff" />
        <Text style={styles.buttonText}>Weather Forecast</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
  },
  logoutButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
    marginRight: 8,
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#2E7D32',
    marginHorizontal: 4,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    marginTop: 4,
  },
  aiInsightButton: {
    backgroundColor: '#2E7D32',
    margin: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  weatherButton: {
    backgroundColor: '#1565C0',
    margin: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
});