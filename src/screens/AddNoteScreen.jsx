import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

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

  const handleSave = () => {
    if (title.trim() === '' || content.trim() === '') {
      alert('Please fill in both title and content');
      return;
    }
    navigation.navigate('Notes', {
      type: 'ADD_NOTE',
      note: {
        title,
        content,
        category: selectedCategory
      }
    });
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

export default AddNoteScreen; 