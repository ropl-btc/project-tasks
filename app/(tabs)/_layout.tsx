import { Tabs } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Notebook, CheckCircle, Calculator, Settings } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabLayout() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleTabPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const TabButton = ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSpring(0.8, { mass: 0.3, stiffness: 400 });
      setTimeout(() => {
        scale.value = withSpring(1, { mass: 0.3, stiffness: 400 });
      }, 100);
      onPress();
    };

    return (
      <AnimatedPressable
        onPress={handlePress}
        style={[styles.tabButton, animatedStyle]}>
        {children}
      </AnimatedPressable>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          paddingHorizontal: 50,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 45,
              right: 45,
              height: 1,
              backgroundColor: colors.border,
            }}
          />
        ),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: Platform.select({
          ios: '#999999',
          default: '#666666',
        }),
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <TabButton onPress={props.onPress}>
            {props.children}
          </TabButton>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarIcon: ({ color }) => (
            <CheckCircle size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarIcon: ({ color }) => (
            <Notebook size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          tabBarIcon: ({ color }) => (
            <Calculator size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};