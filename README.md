# Notes App

A feature-rich note-taking application built with React Native, offering a modern and intuitive interface for managing your notes efficiently.

## Features

### 1. Note Management
- **Create Notes**: Add new notes with titles, content, and categories
- **Edit Notes**: Modify existing notes with a user-friendly editor
- **Delete Notes**: Remove individual notes or delete all notes at once
- **Archive Notes**: Archive notes to keep your main view clean while preserving important information
- **Pin Notes**: Pin important notes to keep them at the top of your list

### 2. Organization
- **Categories**: Organize notes into different categories:
  - Work (Red)
  - Personal (Teal)
  - Ideas (Yellow)
  - Tasks (Mint)
- **Search**: Find notes quickly using the search functionality
- **Sorting**: Sort notes by:
  - Date (newest/oldest)
  - Title (alphabetical)
  - Category

### 3. User Interface
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on both mobile and tablet devices
- **Modern UI**: Clean and intuitive interface with smooth animations
- **Category Colors**: Visual color coding for different note categories

### 4. Additional Features
- **Archive Management**: 
  - View archived notes separately
  - Restore archived notes
  - Delete all archived notes
- **Note Actions**:
  - Pin/unpin notes
  - Archive/unarchive notes
  - Share notes (coming soon)
  - Delete notes

## How to Use

### Creating a Note
1. Tap the "Add Note" button on the home screen
2. Enter a title for your note
3. Select a category (Work, Personal, Ideas, or Tasks)
4. Write your note content
5. Tap "Save" to create the note

### Managing Notes
- **Edit**: Tap on any note to open the edit screen
- **Delete**: Use the delete button in the edit screen or swipe to delete
- **Pin**: Tap the pin icon to pin/unpin a note
- **Archive**: Tap the archive icon to archive/unarchive a note
- **Share**: Tap the share icon (coming soon)

### Organizing Notes
- **Search**: Use the search bar at the top to find specific notes
- **Filter by Category**: Tap on category buttons to filter notes
- **Sort**: Use the sort button to change the order of notes
- **View Archived**: Toggle between active and archived notes

### Using Dark Mode
- Tap the theme toggle in the top right corner to switch between light and dark modes

## Technical Details

### Project Structure
```
src/
├── components/         # Reusable UI components
├── screens/           # Main app screens
├── navigation/        # Navigation configuration
├── styles/           # Shared styles
└── assets/           # Images and other assets
```

### Key Components
- `HomeScreen`: Main screen displaying the list of notes
- `AddNoteScreen`: Screen for creating new notes
- `EditNoteScreen`: Screen for editing existing notes
- `NoteItem`: Reusable component for displaying individual notes

### State Management
- Uses React's useState and useEffect hooks for state management
- Implements proper navigation state handling
- Manages notes, categories, and UI preferences

### Navigation
- Stack-based navigation using React Navigation
- Smooth transitions between screens
- Proper handling of navigation events

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- React Native development environment

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Running the App
- For iOS:
  ```bash
  npm run ios
  # or
  yarn ios
  ```
- For Android:
  ```bash
  npm run android
  # or
  yarn android
  ```

## Future Enhancements
- Note sharing functionality
- Cloud synchronization
- Rich text editing
- Image attachments
- Tags and labels
- Export/import functionality
- Search within note content
- Note templates

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 