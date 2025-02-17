import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Animated, { 
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  withSequence,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  // Create three dots for the loading animation
  const dot1Scale = useAnimatedStyle(() => ({
    transform: [{ scale: withRepeat(
      withSequence(
        withTiming(1.4, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    ) }],
  }));

  const dot2Scale = useAnimatedStyle(() => ({
    transform: [{ scale: withRepeat(
      withSequence(
        withDelay(200,
          withTiming(1.4, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
        ),
        withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    ) }],
  }));

  const dot3Scale = useAnimatedStyle(() => ({
    transform: [{ scale: withRepeat(
      withSequence(
        withDelay(400,
          withTiming(1.4, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
        ),
        withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    ) }],
  }));

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/(tabs)/tasks');
      } else {
        router.replace('/auth');
      }
    }
  }, [session, loading]);

  if (!loading) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Tasks & Notes
      </Text>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { backgroundColor: colors.text }, dot1Scale]} />
        <Animated.View style={[styles.dot, { backgroundColor: colors.text }, dot2Scale]} />
        <Animated.View style={[styles.dot, { backgroundColor: colors.text }, dot3Scale]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 48,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});