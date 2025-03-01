import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme } from './_layout';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      if (authStatus !== 'true') {
        router.replace('/');
        return;
      }
      loadNotes();
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/');
    }
  };

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load notes');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'false');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleAddNote = () => {
    router.push('/note-editor');
  };

  const handleNotePress = (note: Note) => {
    router.push({ pathname: '/note-editor', params: { noteId: note.id } });
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => handleNotePress(item)}>
      <View style={styles.noteContent}>
        <ThemedText style={styles.noteTitle}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.notePreview}>
          {item.content}
        </ThemedText>
        <ThemedText style={styles.noteDate}>{item.date}</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', onPress: () => handleDeleteNote(item.id), style: 'destructive' }
            ]
          );
        }}>
        <Ionicons name="trash-outline" size={20} color={darkTheme.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={darkTheme.textSecondary} />
      <ThemedText style={styles.emptyText}>No notes yet</ThemedText>
      <ThemedText style={styles.emptySubtext}>Tap the + button to create one</ThemedText>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Notes</ThemedText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={darkTheme.error} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={darkTheme.text}
            colors={[darkTheme.primary]}
          />
        }
      />
      <TouchableOpacity 
        style={[styles.addButton, { bottom: insets.bottom + 20 }]} 
        onPress={handleAddNote}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: darkTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  logoutButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: darkTheme.surface,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: darkTheme.text,
    fontWeight: 'bold',
  },
  notePreview: {
    marginTop: 4,
    color: darkTheme.textSecondary,
  },
  noteDate: {
    marginTop: 8,
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: darkTheme.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: darkTheme.textSecondary,
    marginTop: 8,
  },
}); 