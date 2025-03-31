import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { lightTheme } from '../src/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={lightTheme}>
      <AuthProvider>
        <SettingsProvider>
          <Stack>
            <Stack.Screen 
              name="(auth)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="(main)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="index" 
              options={{ headerShown: false }} 
            />
          </Stack>
        </SettingsProvider>
      </AuthProvider>
    </PaperProvider>
  );
} 