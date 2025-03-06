import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import Button from '../components/Button';
import { commonStyles } from '../styles/commonStyles';

const AddNoteScreen = ({ route, navigation }) => {
  const { addNote } = route.params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
        title="Save"
        onPress={() => {
          addNote(title, content);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default AddNoteScreen; 