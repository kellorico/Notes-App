import React, { useState } from 'react';

function NoteList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([]);
  
  // Add this function to filter notes
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="note-list">
      {/* Add search input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Update the notes mapping to use filteredNotes instead of notes */}
      {filteredNotes.map((note) => (
        // ... existing note rendering code ...
      ))}
    </div>
  );
}

export default NoteList; 