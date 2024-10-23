import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

const initialDataItems = [
  { id: '1', name: 'Tree Inventory', type: 'CSV', size: '2.5 MB', lastUpdated: '2023-06-10' },
  { id: '2', name: 'Soil Analysis Results', type: 'PDF', size: '1.8 MB', lastUpdated: '2023-06-12' },
  { id: '3', name: 'Wildlife Survey', type: 'XLSX', size: '3.2 MB', lastUpdated: '2023-06-15' },
  { id: '4', name: 'Fire Risk Map', type: 'PNG', size: '5.1 MB', lastUpdated: '2023-06-18' },
  { id: '5', name: 'Pest Control Report', type: 'DOCX', size: '1.5 MB', lastUpdated: '2023-06-20' },
];

const DataItem = ({ item, onPress, onDownload, onShare, onDelete }) => {
  const { theme } = useTheme();

  const getFileIcon = (type) => {
    switch (type) {
      case 'CSV':
        return 'document-text';
      case 'PDF':
        return 'document';
      case 'XLSX':
        return 'grid';
      case 'PNG':
        return 'image';
      case 'DOCX':
        return 'document-text';
      default:
        return 'document';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.dataItem, { backgroundColor: theme.inputBackground }]}
      onPress={() => onPress(item)}
    >
      <Ionicons name={getFileIcon(item.type)} size={24} color={theme.primaryColor} style={styles.fileIcon} />
      <View style={styles.dataInfo}>
        <Text style={[styles.dataName, { color: theme.textColor }]}>{item.name}</Text>
        <Text style={[styles.dataDetails, { color: theme.textColor }]}>
          {item.type} • {item.size} • Last updated: {item.lastUpdated}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => onDownload(item)}>
          <Ionicons name="download-outline" size={24} color={theme.primaryColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onShare(item)}>
          <Ionicons name="share-outline" size={24} color={theme.primaryColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={24} color={theme.dangerColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function DataManagementScreen({ handleLogout }) {
  const { theme } = useTheme();
  const [dataItems, setDataItems] = useState(initialDataItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleItemPress = (item) => {
    setSelectedItem(item);
    Alert.alert('File Details', `Name: ${item.name}
Type: ${item.type}
Size: ${item.size}
Last Updated: ${item.lastUpdated}`);
  };

  const handleDownload = (item) => {
    // Simulating download with a delay
    Alert.alert('Downloading', `Downloading ${item.name}...`);
    setTimeout(() => {
      Alert.alert('Download Complete', `${item.name} has been downloaded successfully.`);
    }, 2000);
  };

  const handleShare = async (item) => {
    try {
      const result = await Sharing.shareAsync(FileSystem.documentDirectory + item.name);
      if (result.action === Sharing.sharedAction) {
        Alert.alert('Success', `${item.name} has been shared successfully.`);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sharing the file.');
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setDataItems(dataItems.filter(dataItem => dataItem.id !== item.id));
          Alert.alert('Success', `${item.name} has been deleted.`);
        }},
      ]
    );
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        setNewFileName(result.name);
        setIsUploadModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'There was an error selecting the file.');
    }
  };

  const confirmUpload = () => {
    const newFile = {
      id: (dataItems.length + 1).toString(),
      name: newFileName,
      type: newFileName.split('.').pop().toUpperCase(),
      size: '0 KB',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setDataItems([...dataItems, newFile]);
    setIsUploadModalVisible(false);
    setNewFileName('');
    Alert.alert('Upload Successful', `File ${newFileName} has been uploaded successfully.`);
  };

  const sortedAndFilteredData = dataItems
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(a.lastUpdated) - new Date(b.lastUpdated) : new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return 0;
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Data Management</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.textColor }]}
        placeholder="Search files..."
        placeholderTextColor={theme.placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.textColor }]}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
          onPress={() => {
            setSortBy('name');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Name</Text>
          {sortBy === 'name' && <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color={theme.textColor} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'date' && styles.activeSortButton]}
          onPress={() => {
            setSortBy('date');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          <Text style={[styles.sortButtonText, { color: theme.textColor }]}>Date</Text>
          {sortBy === 'date' && <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color={theme.textColor} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedAndFilteredData}
        renderItem={({ item }) => (
          <DataItem
            item={item}
            onPress={handleItemPress}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: theme.primaryColor }]}
        onPress={handleUpload}
      >
        <Ionicons name="cloud-upload" size={24} color="#fff" />
        <Text style={styles.uploadButtonText}>Upload New Data</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isUploadModalVisible}
        onRequestClose={() => setIsUploadModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Confirm Upload</Text>
            <Text style={[styles.modalText, { color: theme.textColor }]}>File Name: {newFileName}</Text>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.primaryColor }]}
              onPress={confirmUpload}
            >
              <Text style={styles.confirmButtonText}>Confirm Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.dangerColor }]}
              onPress={() => setIsUploadModalVisible(false)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortLabel: {
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  activeSortButton: {
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
  },
  sortButtonText: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  fileIcon: {
    marginRight: 15,
  },
  dataInfo: {
    flex: 1,
  },
  dataName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dataDetails: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
  modalText: {
    marginBottom: 20,
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
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