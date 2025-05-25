import React, { useState, useEffect } from 'react';
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

const EditNoteScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedCategory, setSelectedCategory] = useState(note.category);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleDelete}
        >
          <Text style={styles.headerButtonText}>Delete</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSave = async () => {
    console.log('Attempting to save edited note:', { title, content, category: selectedCategory });
    
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Error', 'Title and content cannot be empty');
      return;
    }

    try {
      const updatedNote = {
        ...note,
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
        updatedAt: new Date()
      };

      console.log('Created updated note object:', updatedNote);
      
      // Navigate back to Notes screen with the updated note
      navigation.navigate('Notes', {
        type: 'UPDATE_NOTE',
        note: updatedNote
      });
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            navigation.navigate('Notes', {
              type: 'DELETE_NOTE',
              noteId: note.id
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#666"
      />

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Category:</Text>
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
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === key && { color: '#fff' }
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TextInput
        style={styles.contentInput}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor="#666"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerButton: {
    marginRight: 15,
  },
  headerButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
});

export default EditNoteScreen; 