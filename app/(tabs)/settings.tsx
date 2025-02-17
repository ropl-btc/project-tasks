import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.text + '08',
              opacity: pressed ? 0.7 : 1,
            },
          ]}>
          <LogOut size={20} color={colors.text} style={styles.icon} />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 12,
  },
});