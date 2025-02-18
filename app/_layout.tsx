import { useEffect } from 'react';
import { initializeEnv } from '../src/config/env';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ThemeProvider from './context/ThemeContext';
import AuthProvider from '../src/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
    try {
      initializeEnv();
    } catch (error) {
      console.error('Error initializing environment:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="auth" 
              options={{ 
                headerShown: false,
                presentation: 'fullScreenModal',
                animation: 'fade',
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}