import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  const ButtonContent = () => (
    <>
      <Home size={20} color={colors.text} style={styles.icon} />
      <Text style={[styles.buttonText, { color: colors.text }]}>
        Return Home
      </Text>
    </>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Page Not Found
          </Text>
          <Text style={[styles.description, { color: colors.text + '99' }]}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          {Platform.OS === 'web' ? (
            <Link href="/tasks" style={[styles.button, { borderColor: colors.text }]}>
              <ButtonContent />
            </Link>
          ) : (
            <Link href="/tasks" asChild>
              <Pressable style={[styles.button, { borderColor: colors.text }]}>
                <ButtonContent />
              </Pressable>
            </Link>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});