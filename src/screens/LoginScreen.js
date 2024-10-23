import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation, setCurrentUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const leafAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(leafAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(leafAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    if (username === 'manager' && password === 'password') {
      setCurrentUser({ role: 'Forestry Manager' });
      navigation.navigate('Dashboard'); // Navigate to manager's dashboard
    } else if (username === 'operative' && password === 'password') {
      setCurrentUser({ role: 'Field Operative' });
      navigation.navigate('TaskListScreen'); // Navigate to operative's task list 
    } else if (username === 'gis' && password === 'password') {
      setCurrentUser({ role: 'GIS Specialist' });
      navigation.navigate('InteractiveMapScreen'); // Navigate to GIS specialist's map screen
    } else if (username === 'emergency' && password === 'password') {
      setCurrentUser({ role: 'Emergency Response Coordinator' });
      navigation.navigate('EmergencyTaskList'); // Navigate to emergency coordinator's task list
    } else if (username === 'admin' && password === 'password') {
      setCurrentUser({ role: 'Administrator' });
      navigation.navigate('DataManagement'); // Navigate to admin's data management screen
    } else {
      setError('Invalid credentials');
    }
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Animated.View
        style={[
          styles.leaf,
          {
            transform: [
              {
                rotate: leafAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '10deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="leaf" size={100} color={theme.primaryColor} />
      </Animated.View>
      <Text style={[styles.title, { color: theme.textColor }]}>Forestry Management</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
        placeholder="Username"
        placeholderTextColor={theme.placeholderColor}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
        placeholder="Password"
        placeholderTextColor={theme.placeholderColor}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primaryColor }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  leaf: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;