import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StorageService } from '../services/storage';

const CATEGORIES = {
  WORK: { name: 'Work', color: '#FF6B6B' },
  PERSONAL: { name: 'Personal', color: '#4ECDC4' },
  IDEAS: { name: 'Ideas', color: '#FFD93D' },
  TASKS: { name: 'Tasks', color: '#95E1D3' },
};

const AddNoteScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('PERSONAL');

  const handleSave = async () => {
    console.log('Attempting to save note:', { title, content, category: selectedCategory });
    
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Error', 'Title and content cannot be empty');
      return;
    }

    try {
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        isArchived: false,
        tags: []
      };

      console.log('Created new note object:', newNote);
      
      // Navigate back to Notes screen with the new note
      navigation.navigate('Notes', {
        type: 'ADD_NOTE',
        note: newNote
      });
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Note</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.saveButton}
        >
          <Icon name="check" size={24} color="#6200ea" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.contentInput}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor="#999"
      />

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Category:</Text>
        <View style={styles.categoryButtons}>
          {Object.entries(CATEGORIES).map(([key, { name, color }]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryButton,
                selectedCategory === key && { backgroundColor: color }
              ]}
              onPress={() => setSelectedCategory(key)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === key && styles.selectedCategoryText
              ]}>
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    color: '#333',
  },
  categoryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

export default AddNoteScreen; 