import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import Button from '../components/Button';
import { commonStyles } from '../styles/commonStyles';

const EditNoteScreen = ({ route, navigation }) => {
  const { note, notes, setNotes } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const updateNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      Alert.alert("Error", "Title and content cannot be empty!");
      return;
    }
    
    Alert.alert(
      "📝 Save Changes",
      "Would you like to save the changes to this note?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Save Changes",
          onPress: () => {
            setNotes(notes.map((n) => (n.id === note.id ? { ...n, title, content } : n)));
            navigation.goBack();
          },
          style: "default",
        }
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View style={commonStyles.screen}>
      <TextInput 
        placeholder="Title" 
        style={commonStyles.input}
        value={title} 
        onChangeText={setTitle} 
      />
      <TextInput 
        placeholder="Content" 
        style={commonStyles.textArea}
        multiline
        value={content} 
        onChangeText={setContent} 
      />
      <Button
        title="Update"
        onPress={updateNote}
      />
    </View>
  );
};

export default EditNoteScreen; 