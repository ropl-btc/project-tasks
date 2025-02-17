import React from 'react';
import { ViewStyle } from 'react-native';
import { CircleFadingPlus } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { IconButton } from './IconButton';
import { useTheme } from '../../app/context/ThemeContext';

interface AnimatedFabButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
}

export function AnimatedFabButton({ 
  onPress, 
  style,
  size = 24,
}: AnimatedFabButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.8, { mass: 0.3, stiffness: 400 }),
      withSpring(1, { mass: 0.3, stiffness: 400 })
    );
    onPress();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <IconButton
        icon={<CircleFadingPlus size={size} color={colors.text} />}
        onPress={handlePress}
      />
    </Animated.View>
  );
}