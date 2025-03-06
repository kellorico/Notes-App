import React, { useState } from 'react';
import { View, FlatList, Alert, TextInput, Text } from 'react-native';
import Button from '../components/Button';
import NoteItem from '../components/NoteItem';
import { commonStyles } from '../styles/commonStyles';

class Note {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        this.tags = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isPinned = false;
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
}

function getSortedNotes(notes) {
    return notes.sort((a, b) => {
        // Pinned notes appear first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then sort by date
        return b.createdAt - a.createdAt;
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

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addNote = (title, content) => {
    if (title.trim() === "" || content.trim() === "") {
      Alert.alert("Error", "Title and content cannot be empty!");
      return;
    }
    setNotes([{ id: Date.now().toString(), title, content }, ...notes]);
  };

  const deleteNote = (id) => {
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
          onPress: () => setNotes(notes.filter((note) => note.id !== id)),
          style: "destructive",
        }
      ],
      {
        cancelable: true,
      }
    );
  };

  const deleteAllNotes = () => {
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
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={commonStyles.screen}>
      <TextInput 
        placeholder="Search notes..."
        style={[commonStyles.input, { marginBottom: 10 }]}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          title="Add Note"
          icon="add"
          onPress={() => navigation.navigate("AddNote", { addNote })}
        />
        <Button
          title="Delete All"
          icon="delete"
          onPress={deleteAllNotes}
          style={{ backgroundColor: '#dc3545' }}
        />
      </View>
      {notes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6c757d' }}>
            No notes yet. Click "Add Note" to create your first note!
          </Text>
        </View>
      ) : filteredNotes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6c757d' }}>
            No results found for "{searchTerm}"
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ marginTop: 20 }}
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteItem
              item={item}
              onPress={() => navigation.navigate("EditNote", { note: item, notes, setNotes })}
              onDelete={() => deleteNote(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen; 