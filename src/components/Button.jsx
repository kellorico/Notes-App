import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const Button = ({ onPress, title, icon, style }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#6200ea",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection: "row",
        justifyContent: "center",
        ...style
      }}
      onPress={onPress}
    >
      {icon && <MaterialIcons name={icon} size={24} color="white" style={{ marginRight: 8 }} />}
      <Text style={{ color: "white", fontSize: 18, fontWeight: '600' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button; 