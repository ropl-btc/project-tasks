import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setError(null);
      setLoading(true);

      if (isSignUp) {
        await signUp(email, password);
        // After sign up, we automatically sign in
        await signIn(email, password);
      } else {
        await signIn(email, password);
      }

      router.replace('/(tabs)/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>

        {error && (
          <Text style={[styles.error, { color: '#ef4444' }]}>{error}</Text>
        )}

        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.text + '08',
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.text + '60'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.text + '08',
            },
          ]}
          placeholder="Password"
          placeholderTextColor={colors.text + '60'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          onPress={handleAuth}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.text,
              opacity: (pressed || loading) ? 0.7 : 1,
            },
          ]}>
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {loading 
              ? 'Loading...' 
              : isSignUp 
                ? 'Sign Up' 
                : 'Sign In'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setIsSignUp(!isSignUp)}
          style={({ pressed }) => [
            styles.switchButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}>
          <Text style={[styles.switchButtonText, { color: colors.text }]}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 14,
  },
});