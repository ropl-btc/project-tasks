import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  hapticFeedback?: boolean;
  size?: number;
}

export function IconButton({ 
  icon, 
  onPress, 
  onLongPress,
  style,
  hapticFeedback = true,
  size = 44,
}: IconButtonProps) {
  const handlePress = () => {
    if (hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const handleLongPress = () => {
    if (!onLongPress) return;
    
    if (hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLongPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[
        styles.button,
        { width: size, height: size },
        style,
      ]}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});