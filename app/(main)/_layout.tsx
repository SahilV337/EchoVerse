import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';

export default function MainLayout() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/(auth)/login');
    }
  }, [session, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="text-to-text" 
        options={{ 
          title: 'Text Translation',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="text-to-speech" 
        options={{ 
          title: 'Text to Speech',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="speech-to-text" 
        options={{ 
          title: 'Speech to Text',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="phrases" 
        options={{ 
          title: 'Common Phrases',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          headerShown: true 
        }} 
      />
    </Stack>
  );
} 