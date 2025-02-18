import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../app/context/ThemeContext';

interface BottomPillProps {
  children: React.ReactNode;
  style?: any;
  floating?: boolean;
  circular?: boolean;
}

export function BottomPill({ children, style, floating = true, circular = false }: BottomPillProps) {
  const { theme } = useTheme();

  const { colors } = useTheme();

  const pillBackgroundStyle = {
    backgroundColor: Platform.OS === 'web'
      ? 'transparent'
      : `${colors.text}14`,
  };

  return (
    <BlurView
      intensity={20}
      tint={theme}
      style={[
        styles.pill,
        floating && styles.floating,
        circular && styles.circular,
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
  circular: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 0,
  },
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});