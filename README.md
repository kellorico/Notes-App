# 📝 Notes App

A feature-rich note-taking application built with **React Native**, offering a modern, intuitive interface for managing your notes efficiently.

---

## 🚀 Features

### 📄 Note Management

* **Create Notes**: Add notes with titles, content, and categories
* **Edit Notes**: Modify notes using a clean, user-friendly editor
* **Delete Notes**: Remove individual notes or bulk delete
* **Archive Notes**: Declutter your view while retaining important info
* **Pin Notes**: Keep important notes at the top

### 📒 Organization

* **Categories**: Organize notes into color-coded groups:

  * 🔴 **Work**
  * 🔵 **Personal**
  * 🟡 **Ideas**
  * 🟢 **Tasks**
* **Search**: Quickly find notes using keywords
* **Sort Options**:

  * By **Date**: Newest / Oldest
  * By **Title**
  * By **Category**

### 🎨 User Interface

* **Dark Mode**: Toggle between light and dark themes
* **Responsive Design**: Optimized for phones and tablets
* **Modern Aesthetic**: Clean UI with smooth animations
* **Category Colors**: Visual distinction through color tagging

### 🧰 Additional Features

* **Archive Management**:

  * View and restore archived notes
  * Bulk delete archived notes
* **Quick Actions**:

  * Pin/Unpin
  * Archive/Unarchive
  * Share notes *(Coming Soon)*

---

## ✨ How to Use

### 🔁 Creating a Note

1. Tap the **➕ Add Note** button
2. Enter a title and content
3. Choose a category (Work, Personal, Ideas, Tasks)
4. Tap **Save**

### ✏️ Managing Notes

* **Edit**: Tap a note to open the editor
* **Delete**: Swipe or use the delete button
* **Pin/Unpin**: Tap the pin icon
* **Archive/Unarchive**: Tap the archive icon
* **Share**: *(Coming Soon)*

### 🔍 Organizing Notes

* **Search**: Use the search bar
* **Filter by Category**: Tap category chips/tags
* **Sort**: Use the sort menu
* **Archived View**: Switch to view archived notes

### 🌙 Using Dark Mode

* Tap the theme toggle (🌞/🌙) in the header

---

## 🛠️ Technical Details

### 📁 Project Structure

```
src/
├── assets/             # Images and icons
├── components/         # Reusable UI components
├── navigation/         # Navigation config
├── screens/            # App screens (Home, Add, Edit)
└── styles/             # Shared style definitions
```

### 🧹 Key Components

* `HomeScreen`: Displays all active notes
* `AddNoteScreen`: Create new note interface
* `EditNoteScreen`: Edit or delete a note
* `NoteItem`: UI block for individual notes

### 📦 State Management

* Uses React Hooks (`useState`, `useEffect`)
* Manages:

  * Notes list
  * Categories
  * Theme preference
  * Archive/pin state

### 🔀 Navigation

* React Navigation (stack-based)
* Supports screen transitions and navigation events

---

## 📦 Getting Started

### ✅ Prerequisites

* Node.js
* npm or yarn
* Expo CLI (recommended for React Native)
* Android Studio / Xcode for device simulation

### 📅 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/notes-app.git
   cd notes-app
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### ▶️ Running the App

* **Start Expo**:

  ```bash
  npm start
  # or
  yarn start
  ```

* **Run on Device**:

  * iOS:

    ```bash
    npm run ios
    # or
    yarn ios
    ```
  * Android:

    ```bash
    npm run android
    # or
    yarn android
    ```

---

## 🧹 Package Compatibility

Ensure you're using versions compatible with Expo SDK 52:

```powershell
expo install @react-native-community/datetimepicker@8.2.0 expo@~52.0.46 react-native@0.76.9 react-native-gesture-handler@~2.20.2 react-native-reanimated@~3.16.1 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 expo-notifications@~0.29.14
```

Restart Expo after installation.

---

## 🌱 Future Enhancements

* 📤 Note sharing (social and system)
* ☕️ Cloud sync (Firebase/Appwrite)
* 📝 Rich text editor
* 📸 Image attachments
* 📌 Tags and labels
* 📁 Export/import support
* 🔎 Search inside note content
* 📄 Templates for recurring note formats

---

## 🤝 Contributing

Pull requests are welcome! Please fork the repo and create a branch for your feature or bugfix.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for full terms.
