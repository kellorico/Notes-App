import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Alert, TextInput, Text, Switch, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import NoteItem from '../components/NoteItem';
import { commonStyles } from '../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const HomeScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);

  const addNote = useCallback((title, content, category = 'PERSONAL') => {
    if (title.trim() === "" || content.trim() === "") {
      Alert.alert("Error", "Title and content cannot be empty!");
      return;
    }
    const newNote = new Note(title, content, category);
    setNotes(prevNotes => [newNote, ...prevNotes]);
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
          onPress: () => setNotes(prevNotes => prevNotes.filter((note) => note.id !== id)),
          style: "destructive",
        }
      ],
      {
        cancelable: true,
      }
    );
  }, []);

  const deleteAllNotes = useCallback(() => {
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
          onPress: () => setNotes([]),
          style: "destructive"
        }
      ],
      {
        cancelable: true
      }
    );
  }, [notes.length]);

  const toggleNotePin = useCallback((id) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  }, []);

  const toggleNoteArchive = useCallback((id) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, isArchived: !note.isArchived } : note
    ));
  }, []);

  const changeNoteCategory = useCallback((id, category) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, category } : note
    ));
  }, []);

  const shareNote = useCallback(async (note) => {
    try {
      Alert.alert('Share Note', 'Sharing functionality coming soon!');
    } catch (error) {
      Alert.alert('Error', 'Failed to share note');
    }
  }, []);

  const restoreAllArchived = useCallback(() => {
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
          onPress: () => {
            setNotes(prevNotes => prevNotes.map(note => ({ ...note, isArchived: false })));
          }
        }
      ]
    );
  }, [notes]);

  const deleteAllArchived = useCallback(() => {
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
          onPress: () => {
            setNotes(prevNotes => prevNotes.filter(note => !note.isArchived));
          }
        }
      ]
    );
  }, [notes]);

  const filteredNotes = notes
    .filter(note => 
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'ALL' || note.category === selectedCategory) &&
      note.isArchived === showArchived
    );

  const sortedNotes = getSortedNotes(filteredNotes, sortBy);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Navigation focus event triggered');
      console.log('Current route params:', route.params);
      
      // Check if we have params from navigation
      if (route.params) {
        const { type, note, noteId } = route.params;
        console.log('Processing navigation params:', { type, note, noteId });
        
        if (type === 'ADD_NOTE') {
          console.log('Adding new note:', note);
          const newNote = new Note(note.title, note.content, note.category);
          setNotes(prevNotes => {
            const updatedNotes = [newNote, ...prevNotes];
            console.log('Updated notes after adding:', updatedNotes);
            return updatedNotes;
          });
        } else if (type === 'UPDATE_NOTE') {
          console.log('Updating note:', note);
          setNotes(prevNotes => {
            const updatedNotes = prevNotes.map(n => 
              n.id === note.id ? note : n
            );
            console.log('Updated notes after updating:', updatedNotes);
            return updatedNotes;
          });
        } else if (type === 'DELETE_NOTE') {
          console.log('Deleting note with ID:', noteId);
          setNotes(prevNotes => {
            const updatedNotes = prevNotes.filter(n => n.id !== noteId);
            console.log('Updated notes after deleting:', updatedNotes);
            return updatedNotes;
          });
        }
        
        // Clear the params after handling them
        navigation.setParams({});
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // Add a debug effect to log notes changes
  useEffect(() => {
    console.log('Notes state updated:', notes);
  }, [notes]);

  const handleAddNote = useCallback((title, content, category) => {
    addNote(title, content, category);
    navigation.goBack();
  }, [addNote, navigation]);

  const handleUpdateNote = useCallback((updatedNote) => {
    setNotes(prevNotes => prevNotes.map(n => 
      n.id === updatedNote.id ? updatedNote : n
    ));
    navigation.goBack();
  }, [navigation]);

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
            onPress={() => setSelectedCategory('ALL')}
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
              onPress={() => setSelectedCategory(key)}
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

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="note-add" size={64} color={isDarkMode ? '#666' : '#999'} />
          <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
            No notes yet. Click "Add Note" to create your first note!
          </Text>
        </View>
      ) : filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="search-off" size={64} color={isDarkMode ? '#666' : '#999'} />
          <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
            {showArchived 
              ? "No archived notes found"
              : `No results found for "${searchTerm}"`}
          </Text>
        </View>
      ) : (
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
        />
      )}
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