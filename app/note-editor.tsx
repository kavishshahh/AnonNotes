import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme } from './_layout';
import { LinkPreview } from './components/LinkPreview';
import { ThemedText } from './components/ThemedText';
import { ThemedView } from './components/ThemedView';

// URL regex pattern
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NoteEditorScreen() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAuth();
    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  useEffect(() => {
    // Extract URLs from content
    const matches = content.match(URL_REGEX) || [];
    setUrls(Array.from(new Set(matches))); // Remove duplicates
  }, [content]);

  const checkAuth = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      if (authStatus !== 'true') {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/');
    }
  };

  const loadNote = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        const notes: Note[] = JSON.parse(savedNotes);
        const note = notes.find((n) => n.id === noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    }
  };

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Error', 'Title is required');
        return;
      }

      const savedNotes = await AsyncStorage.getItem('notes');
      let notes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];

      if (noteId) {
        // Update existing note
        notes = notes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                date: new Date().toLocaleString(),
              }
            : note
        );
      } else {
        // Create new note
        notes.unshift({
          id: Date.now().toString(),
          title: title.trim(),
          content: content.trim(),
          date: new Date().toLocaleString(),
        });
      }

      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={darkTheme.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={24} color="#fff" />
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={darkTheme.textSecondary}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor={darkTheme.textSecondary}
        />
        {urls.length > 0 && (
          <View style={styles.previewsContainer}>
            <ThemedText style={styles.previewsTitle}>Link Previews</ThemedText>
            {urls.map((url, index) => (
              <LinkPreview key={index} url={url} />
            ))}
          </View>
        )}
        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  scrollView: {
    flex: 1,
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
  backButton: {
    padding: 8,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    color: darkTheme.text,
  },
  contentInput: {
    minHeight: 200,
    fontSize: 16,
    margin: 16,
    padding: 16,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    color: darkTheme.text,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: darkTheme.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewsContainer: {
    margin: 16,
  },
  previewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
}); 