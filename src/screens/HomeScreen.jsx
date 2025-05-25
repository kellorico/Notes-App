import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Alert, TextInput, Text, Switch, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import NoteItem from '../components/NoteItem';
import { commonStyles } from '../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StorageService } from '../services/storage';

const CATEGORIES = {
  WORK: { name: 'Work', color: '#FF6B6B' },
  PERSONAL: { name: 'Personal', color: '#4ECDC4' },
  IDEAS: { name: 'Ideas', color: '#FFD93D' },
  TASKS: { name: 'Tasks', color: '#95E1D3' },
};

class Note {
    constructor(title, content, category = 'PERSONAL') {
        this.id = Date.now().toString();
        this.title = title;
        this.content = content;
        this.category = category;
        this.tags = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isPinned = false;
        this.isArchived = false;
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
    }

    togglePin() {
        this.isPinned = !this.isPinned;
    }

    toggleArchive() {
        this.isArchived = !this.isArchived;
    }

    setCategory(category) {
        this.category = category;
    }
}

function getSortedNotes(notes, sortBy = 'date') {
    return notes.sort((a, b) => {
        // Pinned notes appear first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then sort by selected criteria
        switch (sortBy) {
            case 'date':
                return b.createdAt - a.createdAt;
            case 'title':
                return a.title.localeCompare(b.title);
            case 'category':
                return a.category.localeCompare(b.category);
            default:
                return b.createdAt - a.createdAt;
        }
    });
}

let saveTimeout;

function autoSave(note) {
    // Clear any existing timeout
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }

    // Set new timeout to save after 1 second of inactivity
    saveTimeout = setTimeout(() => {
        saveNote(note);
        console.log('Note auto-saved');
    }, 1000);
}

class NoteSharing {
    shareNote(noteId, recipientEmail) {
        return new Promise((resolve, reject) => {
            try {
                // Generate sharing link or send email
                const sharingLink = `https://yourapp.com/shared-notes/${noteId}`;
                sendEmail(recipientEmail, 'Note Shared', `
                    Someone shared a note with you! 
                    View it here: ${sharingLink}
                `);
                resolve(sharingLink);
            } catch (error) {
                reject(error);
            }
        });
    }
}

const STORAGE_KEY = '@notes_app_notes';

const HomeScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from storage on initial mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const loadedNotes = await StorageService.loadNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = useCallback(async (note) => {
    try {
      console.log('Adding new note in HomeScreen:', note);
      if (!note.title || !note.content) {
        console.error('Invalid note data:', note);
        return;
      }

      const newNote = new Note(note.title, note.content, note.category);
      console.log('Created Note instance:', newNote);

      const updatedNotes = await StorageService.addNote(newNote);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to add note');
    }
  }, []);

  const deleteNote = useCallback((id) => {
    Alert.alert(
      "🗑️ Confirm Deletion",
      "This action cannot be undone. Are you sure you want to delete this note?",
      [
        {
          text: "Keep",
          style: "default",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updatedNotes = await StorageService.deleteNote(id);
              setNotes(updatedNotes);
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          },
          style: "destructive",
        }
      ],
      {
        cancelable: true,
      }
    );
  }, []);

  const deleteAllNotes = useCallback(async () => {
    if (notes.length === 0) {
      Alert.alert("No Notes", "There are no notes to delete.");
      return;
    }

    Alert.alert(
      "🗑️ Delete All Notes",
      "This will permanently delete all your notes. This action cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          onPress: async () => {
            try {
              const updatedNotes = await StorageService.deleteAllNotes();
              setNotes(updatedNotes);
            } catch (error) {
              console.error('Error deleting all notes:', error);
              Alert.alert('Error', 'Failed to delete all notes');
            }
          },
          style: "destructive"
        }
      ],
      {
        cancelable: true
      }
    );
  }, [notes.length]);

  const toggleNotePin = useCallback(async (id) => {
    try {
      const updatedNotes = await StorageService.toggleNotePin(id);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error toggling note pin:', error);
      Alert.alert('Error', 'Failed to toggle note pin');
    }
  }, []);

  const toggleNoteArchive = useCallback(async (id) => {
    try {
      const updatedNotes = await StorageService.toggleNoteArchive(id);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error toggling note archive:', error);
      Alert.alert('Error', 'Failed to toggle note archive');
    }
  }, []);

  const changeNoteCategory = useCallback(async (id, category) => {
    try {
      const updatedNotes = await StorageService.updateNoteCategory(id, category);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error updating note category:', error);
      Alert.alert('Error', 'Failed to update note category');
    }
  }, []);

  const restoreAllArchived = useCallback(async () => {
    if (notes.filter(note => note.isArchived).length === 0) {
      Alert.alert("No Archived Notes", "There are no archived notes to restore.");
      return;
    }

    Alert.alert(
      "Restore All Archived",
      "Do you want to restore all archived notes?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Restore All",
          onPress: async () => {
            try {
              const updatedNotes = await StorageService.restoreAllArchived();
              setNotes(updatedNotes);
            } catch (error) {
              console.error('Error restoring archived notes:', error);
              Alert.alert('Error', 'Failed to restore archived notes');
            }
          }
        }
      ]
    );
  }, [notes]);

  const deleteAllArchived = useCallback(async () => {
    const archivedNotes = notes.filter(note => note.isArchived);
    if (archivedNotes.length === 0) {
      Alert.alert("No Archived Notes", "There are no archived notes to delete.");
      return;
    }

    Alert.alert(
      "Delete All Archived",
      "This will permanently delete all archived notes. This action cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedNotes = await StorageService.deleteAllArchived();
              setNotes(updatedNotes);
            } catch (error) {
              console.error('Error deleting archived notes:', error);
              Alert.alert('Error', 'Failed to delete archived notes');
            }
          }
        }
      ]
    );
  }, [notes]);

  // Update the navigation focus effect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('Navigation focus event triggered');
      console.log('Current route params:', route.params);
      
      if (route.params) {
        const { type, note, noteId } = route.params;
        console.log('Processing navigation params:', { type, note, noteId });
        
        try {
          if (type === 'ADD_NOTE' && note) {
            console.log('Adding new note from navigation:', note);
            await addNote(note);
          } else if (type === 'UPDATE_NOTE' && note) {
            console.log('Updating note:', note);
            const updatedNotes = await StorageService.updateNote(note);
            setNotes(updatedNotes);
          } else if (type === 'DELETE_NOTE' && noteId) {
            console.log('Deleting note with ID:', noteId);
            const updatedNotes = await StorageService.deleteNote(noteId);
            setNotes(updatedNotes);
          }
        } catch (error) {
          console.error('Error processing navigation params:', error);
          Alert.alert('Error', 'Failed to process note changes');
        }
        
        // Clear the params after handling them
        navigation.setParams({});
      }
    });

    return unsubscribe;
  }, [navigation, route.params, addNote]);

  // Debug effect to log notes changes
  useEffect(() => {
    console.log('Notes state updated:', notes);
  }, [notes]);

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || note.category === selectedCategory;
      const matchesArchive = note.isArchived === showArchived;
      
      return matchesSearch && matchesCategory && matchesArchive;
    });

  const sortedNotes = getSortedNotes(filteredNotes, sortBy);

  const handleAddNote = useCallback((title, content, category) => {
    addNote(new Note(title, content, category));
    navigation.goBack();
  }, [addNote, navigation]);

  const handleUpdateNote = useCallback((updatedNote) => {
    setNotes(prevNotes => prevNotes.map(n => 
      n.id === updatedNote.id ? updatedNote : n
    ));
    navigation.goBack();
  }, [navigation]);

  const handleCategorySelect = useCallback((category) => {
    console.log('Selecting category:', category);
    setSelectedCategory(category);
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color={isDarkMode ? '#999' : '#666'} style={styles.searchIcon} />
          <TextInput 
            placeholder="Search notes..."
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
          />
        </View>
        
        <View style={styles.themeToggle}>
          <Icon name={isDarkMode ? "light-mode" : "dark-mode"} size={24} color={isDarkMode ? '#fff' : '#666'} />
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            style={styles.switch}
          />
        </View>
      </View>

      <View style={styles.archiveToggle}>
        <TouchableOpacity
          style={[styles.archiveTab, !showArchived && styles.activeArchiveTab]}
          onPress={() => setShowArchived(false)}
        >
          <Icon name="note" size={20} color={!showArchived ? '#6200ea' : '#666'} />
          <Text style={[styles.archiveTabText, !showArchived && styles.activeArchiveTabText]}>
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.archiveTab, showArchived && styles.activeArchiveTab]}
          onPress={() => setShowArchived(true)}
        >
          <Icon name="archive" size={20} color={showArchived ? '#6200ea' : '#666'} />
          <Text style={[styles.archiveTabText, showArchived && styles.activeArchiveTabText]}>
            Archived
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'ALL' && styles.selectedCategory,
              isDarkMode && styles.darkCategoryButton
            ]}
            onPress={() => handleCategorySelect('ALL')}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === 'ALL' && styles.selectedCategoryText,
              isDarkMode && styles.darkCategoryText
            ]}>All</Text>
          </TouchableOpacity>
          {Object.entries(CATEGORIES).map(([key, { name, color }]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryButton,
                selectedCategory === key && { backgroundColor: color },
                isDarkMode && styles.darkCategoryButton
              ]}
              onPress={() => handleCategorySelect(key)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === key && styles.selectedCategoryText,
                isDarkMode && styles.darkCategoryText
              ]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        {!showArchived ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => navigation.navigate("AddNote")}
          >
            <Icon name="add" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Add Note</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.restoreButton]}
            onPress={restoreAllArchived}
          >
            <Icon name="restore" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Restore All</Text>
          </TouchableOpacity>
        )}

        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.sortButton]}
            onPress={() => {
              Alert.alert(
                "Sort Notes",
                "Choose sorting method",
                [
                  { text: "Date", onPress: () => setSortBy('date') },
                  { text: "Title", onPress: () => setSortBy('title') },
                  { text: "Category", onPress: () => setSortBy('category') },
                  { text: "Cancel", style: "cancel" }
                ]
              );
            }}
          >
            <Icon name="sort" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={showArchived ? deleteAllArchived : deleteAllNotes}
          >
            <Icon name="delete" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Delete All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.notesList}
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem
            item={item}
            onPress={() => navigation.navigate("EditNote", { note: item })}
            onDelete={() => deleteNote(item.id)}
            onPin={() => toggleNotePin(item.id)}
            onArchive={() => toggleNoteArchive(item.id)}
            onShare={() => shareNote(item)}
            onCategoryChange={(category) => changeNoteCategory(item.id, category)}
            isDarkMode={isDarkMode}
            categories={CATEGORIES}
          />
        )}
        contentContainerStyle={styles.notesListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="note-add" size={64} color={isDarkMode ? '#666' : '#999'} />
            <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
              {showArchived 
                ? "No archived notes found"
                : searchTerm 
                  ? `No results found for "${searchTerm}"`
                  : "No notes yet. Click 'Add Note' to create your first note!"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  darkSearchInput: {
    color: '#fff',
    backgroundColor: '#333',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 8,
  },
  archiveToggle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  archiveTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeArchiveTab: {
    backgroundColor: '#f0e6ff',
  },
  archiveTabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  activeArchiveTabText: {
    color: '#6200ea',
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  darkCategoryButton: {
    backgroundColor: '#333',
  },
  selectedCategory: {
    backgroundColor: '#6200ea',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  darkCategoryText: {
    color: '#fff',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#6200ea',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    backgroundColor: '#4ECDC4',
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    minWidth: 100,
  },
  restoreButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesList: {
    flex: 1,
  },
  notesListContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  darkEmptyText: {
    color: '#999',
  },
});

export default HomeScreen; 