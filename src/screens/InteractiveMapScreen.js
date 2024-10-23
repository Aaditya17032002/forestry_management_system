import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MapView, { Marker, Callout, Polygon } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const initialMarkers = [
  { id: 1, title: 'Sector A', description: 'Oak Tree Inspection', coordinate: { latitude: 37.78825, longitude: -122.4324 } },
  { id: 2, title: 'Sector B', description: 'Soil Sample Collection', coordinate: { latitude: 37.78925, longitude: -122.4344 } },
  { id: 3, title: 'Sector C', description: 'Fire Risk Assessment', coordinate: { latitude: 37.79025, longitude: -122.4364 } },
];

const forestBoundary = [
  { latitude: 37.78725, longitude: -122.4314 },
  { latitude: 37.79125, longitude: -122.4314 },
  { latitude: 37.79125, longitude: -122.4374 },
  { latitude: 37.78725, longitude: -122.4374 },
];

export default function InteractiveMapScreen({ handleLogout }) {
  const { theme } = useTheme();
  const [mapType, setMapType] = useState('standard');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState(initialMarkers);
  const [isAddMarkerModalVisible, setIsAddMarkerModalVisible] = useState(false);
  const [newMarker, setNewMarker] = useState({ title: '', description: '' });
  const [userLocation, setUserLocation] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const handleAddMarker = (event) => {
    const { coordinate } = event.nativeEvent;
    setNewMarker({ ...newMarker, coordinate });
    setIsAddMarkerModalVisible(true);
  };

  const saveNewMarker = () => {
    if (newMarker.title && newMarker.description) {
      setMarkers([...markers, { ...newMarker, id: markers.length + 1 }]);
      setIsAddMarkerModalVisible(false);
      setNewMarker({ title: '', description: '' });
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  const toggleLayer = () => {
    setIsLayerVisible(!isLayerVisible);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primaryColor }]}>
        <Text style={styles.headerTitle}>Interactive Map</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={handleAddMarker}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => setSelectedMarker(marker)}
          >
            <Callout>
              <View>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
        {isLayerVisible && (
          <Polygon
            coordinates={forestBoundary}
            fillColor="rgba(0, 255, 0, 0.2)"
            strokeColor="rgba(0, 255, 0, 0.8)"
            strokeWidth={2}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.mapButton, { backgroundColor: theme.primaryColor }]}
          onPress={toggleMapType}
        >
          <Ionicons name={mapType === 'standard' ? 'map' : 'map-outline'} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mapButton, { backgroundColor: theme.primaryColor }]}
          onPress={toggleLayer}
        >
          <Ionicons name={isLayerVisible ? 'layers' : 'layers-outline'} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mapButton, { backgroundColor: theme.primaryColor }]}
          onPress={() => Alert.alert('Legend', 'Green Area: Forest Boundary\nRed Markers: Points of Interest\nBlue Marker: Your Location')}
        >
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {selectedMarker && (
        <View style={[styles.markerInfo, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.markerTitle, { color: theme.textColor }]}>{selectedMarker.title}</Text>
          <Text style={[styles.markerDescription, { color: theme.textColor }]}>{selectedMarker.description}</Text>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddMarkerModalVisible}
        onRequestClose={() => setIsAddMarkerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add New Marker</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Title"
              placeholderTextColor={theme.placeholderColor}
              value={newMarker.title}
              onChangeText={(text) => setNewMarker({ ...newMarker, title: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
              placeholder="Description"
              placeholderTextColor={theme.placeholderColor}
              value={newMarker.description}
              onChangeText={(text) => setNewMarker({ ...newMarker, description: text })}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primaryColor }]}
              onPress={saveNewMarker}
            >
              <Text style={styles.addButtonText}>Add Marker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.dangerColor }]}
              onPress={() => setIsAddMarkerModalVisible(false)}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: 70,
    right: 20,
    flexDirection: 'column',
  },
  mapButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  markerInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  markerDescription: {
    fontSize: 14,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calloutDescription: {
    fontSize: 14,
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
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
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
});