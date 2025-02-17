import React from 'react';
import { Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../app/context/ThemeContext';

interface BlurModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  intensity?: number;
  contentStyle?: ViewStyle;
}

export function BlurModal({
  visible,
  onClose,
  children,
  intensity = 70,
  contentStyle,
}: BlurModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={[
        StyleSheet.absoluteFill,
        { 
          backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
          opacity: 0.5 
        }
      ]} />
      <BlurView
        intensity={intensity}
        tint={theme}
        style={StyleSheet.absoluteFill}
      />
      <Pressable
        style={styles.overlay}
        onPress={onClose}>
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
});