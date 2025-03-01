import { Stack } from 'expo-router';

// VS Code-like dark theme colors
export const darkTheme = {
  background: '#1E1E1E',
  surface: '#252526',
  primary: '#0078D4',
  text: '#D4D4D4',
  textSecondary: '#808080',
  border: '#404040',
  error: '#F14C4C',
  success: '#73C991',
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkTheme.background,
        },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="note-editor" />
    </Stack>
  );
}
