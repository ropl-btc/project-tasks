import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  ScrollViewProps,
  KeyboardAvoidingViewProps,
  Pressable,
} from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { TouchableScrollView } from './TouchableScrollView';

interface AppScreenLayoutProps {
  children: React.ReactNode;
  bottomContent?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  keyboardAvoidingViewProps?: Partial<KeyboardAvoidingViewProps>;
  scrollViewProps?: Partial<ScrollViewProps>;
  onEmptySpaceLongPress?: () => void;
}

export function AppScreenLayout({
  children,
  bottomContent,
  style,
  contentContainerStyle,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0,
  keyboardAvoidingViewProps,
  scrollViewProps,
  onEmptySpaceLongPress,
}: AppScreenLayoutProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, style]}>
      <View style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={keyboardVerticalOffset}
          {...keyboardAvoidingViewProps}>
          <TouchableScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}
            onEmptySpaceLongPress={onEmptySpaceLongPress}
            {...scrollViewProps}>
            {children}
          </TouchableScrollView>
        </KeyboardAvoidingView>
        {bottomContent}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
    minHeight: '100%',
  },
});