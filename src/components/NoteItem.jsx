import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NoteItem = ({ 
  item, 
  onPress, 
  onDelete, 
  onPin, 
  onArchive, 
  onShare, 
  onCategoryChange,
  isDarkMode,
  categories 
}) => {
  const category = categories[item.category] || categories.PERSONAL;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#333' : '#fff' },
        item.isPinned && styles.pinnedNote
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {item.isPinned && (
            <Icon name="push-pin" size={16} color="#FFD700" style={styles.pinIcon} />
          )}
          <Text 
            style={[
              styles.title,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
        <View style={styles.categoryTag}>
          <View 
            style={[
              styles.categoryDot,
              { backgroundColor: category.color }
            ]} 
          />
          <Text style={styles.categoryText}>{category.name}</Text>
        </View>
      </View>

      <Text 
        style={[
          styles.content,
          { color: isDarkMode ? '#ccc' : '#666' }
        ]}
        numberOfLines={2}
      >
        {item.content}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onPin} style={styles.actionButton}>
            <Icon 
              name={item.isPinned ? "push-pin" : "push-pin-outline"} 
              size={20} 
              color={item.isPinned ? "#FFD700" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onArchive} style={styles.actionButton}>
            <Icon 
              name={item.isArchived ? "unarchive" : "archive"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.actionButton}>
            <Icon name="share" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Icon name="delete" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pinnedNote: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    marginRight: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    padding: 4,
  },
});

export default NoteItem; 