import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const InspectionFormScreen = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    location: '',
    inspectionType: 'Tree Health',
    notes: '',
    severity: 'Low',
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting inspection form:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>New Inspection</Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textColor }]}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
          placeholder="Enter location"
          placeholderTextColor={theme.placeholderColor}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textColor }]}>Inspection Type</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.inputBackground }]}>
          <Picker
            selectedValue={formData.inspectionType}
            onValueChange={(itemValue) => handleInputChange('inspectionType', itemValue)}
            style={{ color: theme.textColor }}
          >
            <Picker.Item label="Tree Health" value="Tree Health" />
            <Picker.Item label="Pest Control" value="Pest Control" />
            <Picker.Item label="Fire Hazard" value="Fire Hazard" />
            <Picker.Item label="Soil Quality" value="Soil Quality" />
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textColor }]}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
          value={formData.notes}
          onChangeText={(text) => handleInputChange('notes', text)}
          placeholder="Enter inspection notes"
          placeholderTextColor={theme.placeholderColor}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textColor }]}>Severity</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.inputBackground }]}>
          <Picker
            selectedValue={formData.severity}
            onValueChange={(itemValue) => handleInputChange('severity', itemValue)}
            style={{ color: theme.textColor }}
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.primaryColor }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit Inspection</Text>
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  submitButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InspectionFormScreen;