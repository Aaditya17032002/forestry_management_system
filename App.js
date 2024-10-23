import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import WorkOrderManagementScreen from './src/screens/WorkOrderManagementScreen';
import InspectionOverviewScreen from './src/screens/InspectionOverviewScreen';
import TeamAssignmentScreen from './src/screens/TeamAssignmentScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import InspectionFormScreen from './src/screens/InspectionFormScreen';
import InteractiveMapScreen from './src/screens/InteractiveMapScreen';
import DataManagementScreen from './src/screens/DataManagementScreen';
import EmergencyTaskListScreen from './src/screens/EmergencyTaskListScreen';
import EmergencyResourcesScreen from './src/screens/EmergencyResourcesScreen';
import UserManagementScreen from './src/screens/UserManagementScreen';
import SystemHealthCheckScreen from './src/screens/SystemHealthCheckScreen';

const Stack = createStackNavigator();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // Manages logged-in user state

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2E7D32',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {currentUser ? (
            // Render screens based on the user's role
            <>
              {currentUser.role === 'Forestry Manager' && (
                <>
                  <Stack.Screen 
                    name="Dashboard"
                    children={(props) => <DashboardScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="WorkOrderManagement"
                    children={(props) => <WorkOrderManagementScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="InspectionOverview"
                    children={(props) => <InspectionOverviewScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="TeamAssignment"
                    children={(props) => <TeamAssignmentScreen {...props} handleLogout={handleLogout} />}
                  />
                </>
              )}
              
              {currentUser.role === 'Field Operative' && (
                <>
                  <Stack.Screen 
                    name="TaskList"
                    children={(props) => <TaskListScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="InspectionForm"
                    children={(props) => <InspectionFormScreen {...props} handleLogout={handleLogout} />}
                  />
                </>
              )}

              {currentUser.role === 'GIS Specialist' && (
                <>
                  <Stack.Screen 
                    name="InteractiveMap"
                    children={(props) => <InteractiveMapScreen {...props} handleLogout={handleLogout} />}
                  />
                </>
              )}

              {currentUser.role === 'Emergency Response Coordinator' && (
                <>
                  <Stack.Screen 
                    name="EmergencyTaskList"
                    children={(props) => <EmergencyTaskListScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="EmergencyResources"
                    children={(props) => <EmergencyResourcesScreen {...props} handleLogout={handleLogout} />}
                  />
                </>
              )}

              {currentUser.role === 'Administrator' && (
                <>
                  <Stack.Screen 
                    name="DataManagement"
                    children={(props) => <DataManagementScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="UserManagement"
                    children={(props) => <UserManagementScreen {...props} handleLogout={handleLogout} />}
                  />
                  <Stack.Screen 
                    name="SystemHealthCheck"
                    children={(props) => <SystemHealthCheckScreen {...props} handleLogout={handleLogout} />}
                  />
                </>
              )}
            </>
          ) : (
            // If not logged in, show the Login screen
            <Stack.Screen 
              name="Login"
              children={(props) => <LoginScreen {...props} setCurrentUser={setCurrentUser} />}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
