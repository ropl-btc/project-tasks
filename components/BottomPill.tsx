import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../app/context/ThemeContext';

interface BottomPillProps {
  children: React.ReactNode;
  style?: any;
  floating?: boolean;
}

export function BottomPill({ children, style, floating = true }: BottomPillProps) {
  const { theme } = useTheme();

  const pillBackgroundStyle = {
    backgroundColor: Platform.OS === 'web' 
      ? 'transparent' 
      : `${theme === 'dark' ? '#ffffff' : '#000000'}10`,
  };

  return (
    <BlurView
      intensity={20}
      tint={theme}
      style={[
        styles.pill,
        floating && styles.floating,
        pillBackgroundStyle,
        style
      ]}>
      <View style={styles.content}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  floating: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 24,
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});