import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const NoteItem = ({ item, onPress, onDelete }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      }}
    >
      <TouchableOpacity 
        style={{ flex: 1 }}
        onPress={onPress}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.title}</Text>
        <Text numberOfLines={2} style={{ fontSize: 14, color: '#666' }}>{item.content}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ padding: 8 }}
        onPress={onDelete}
      >
        <MaterialIcons name="delete" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );
};

export default NoteItem; 