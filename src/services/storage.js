import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@notes_app_notes';

export const StorageService = {
  // Load all notes
  async loadNotes() {
    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        return parsedNotes.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading notes:', error);
      throw new Error('Failed to load notes');
    }
  },

  // Save all notes
  async saveNotes(notes) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      console.log('Notes saved successfully:', notes.length);
      return true;
    } catch (error) {
      console.error('Error saving notes:', error);
      throw new Error('Failed to save notes');
    }
  },

  // Add a single note
  async addNote(note) {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = [note, ...notes];
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error adding note:', error);
      throw new Error('Failed to add note');
    }
  },

  // Update a single note
  async updateNote(updatedNote) {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id 
          ? { ...note, ...updatedNote, updatedAt: new Date() }
          : note
      );
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  },

  // Delete a single note
  async deleteNote(noteId) {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  },

  // Delete all notes
  async deleteAllNotes() {
    try {
      await this.saveNotes([]);
      return [];
    } catch (error) {
      console.error('Error deleting all notes:', error);
      throw new Error('Failed to delete all notes');
    }
  },

  // Toggle note pin status
  async toggleNotePin(noteId) {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
          : note
      );
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error toggling note pin:', error);
      throw new Error('Failed to toggle note pin');
    }
  },

  // Toggle note archive status
  async toggleNoteArchive(noteId) {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { ...note, isArchived: !note.isArchived, updatedAt: new Date() }
          : note
      );
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error toggling note archive:', error);
      throw new Error('Failed to toggle note archive');
    }
  },

  // Update note category
  async updateNoteCategory(noteId, category) {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { ...note, category, updatedAt: new Date() }
          : note
      );
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error updating note category:', error);
      throw new Error('Failed to update note category');
    }
  },

  // Restore all archived notes
  async restoreAllArchived() {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.map(note => 
        note.isArchived 
          ? { ...note, isArchived: false, updatedAt: new Date() }
          : note
      );
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error restoring archived notes:', error);
      throw new Error('Failed to restore archived notes');
    }
  },

  // Delete all archived notes
  async deleteAllArchived() {
    try {
      const notes = await this.loadNotes();
      const updatedNotes = notes.filter(note => !note.isArchived);
      await this.saveNotes(updatedNotes);
      return updatedNotes;
    } catch (error) {
      console.error('Error deleting archived notes:', error);
      throw new Error('Failed to delete archived notes');
    }
  }
}; 