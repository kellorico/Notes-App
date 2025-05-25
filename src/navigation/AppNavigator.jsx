import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from '../screens/HomeScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import EditNoteScreen from '../screens/EditNoteScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Notes" 
          component={HomeScreen}
          options={{
            headerLeft: () => null,
            headerRight: () => (
              <MaterialIcons 
                name="notes" 
                size={28} 
                color="white" 
                style={{ marginRight: 16 }}
              />
            ),
          }}
        />
        <Stack.Screen 
          name="AddNote" 
          component={AddNoteScreen}
          options={{
            title: 'Add Note',
            headerRight: () => (
              <MaterialIcons 
                name="edit" 
                size={28} 
                color="white" 
                style={{ marginRight: 16 }}
              />
            ),
          }}
        />
        <Stack.Screen 
          name="EditNote" 
          component={EditNoteScreen}
          options={{
            title: 'Edit Note',
            headerRight: () => (
              <MaterialIcons 
                name="edit" 
                size={28} 
                color="white" 
                style={{ marginRight: 16 }}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 