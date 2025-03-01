import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme } from './_layout';

const FIXED_PASSWORD = '12';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        router.replace('/notes');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleLogin = async () => {
    try {
      if (password === FIXED_PASSWORD) {
        await AsyncStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        router.replace('/notes');
      } else {
        Alert.alert('Error', 'Incorrect password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      <View style={[styles.safeArea, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <View style={styles.content}>
          <View style={styles.loginContainer}>
            <Ionicons name="lock-closed-outline" size={80} color={darkTheme.primary} />
            <View style={styles.titleContainer}>
              <ThemedText style={styles.title}>Secure Notes</ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter password to access your notes
              </ThemedText>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={darkTheme.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.loginButton, password.length > 0 && styles.loginButtonActive]}
              onPress={handleLogin}
              disabled={password.length === 0}>
              <ThemedText style={styles.buttonText}>Login</ThemedText>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: darkTheme.surface,
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: 24,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 25,
    color: darkTheme.text,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    includeFontPadding: false,
    padding: 0,
  },
  subtitle: {
    color: darkTheme.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: darkTheme.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: darkTheme.background,
    color: darkTheme.text,
  },
  loginButton: {
    backgroundColor: darkTheme.textSecondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  loginButtonActive: {
    backgroundColor: darkTheme.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 