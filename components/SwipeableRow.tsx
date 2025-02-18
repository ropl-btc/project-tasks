import React, { useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import {
  RectButton,
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '../app/context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export function SwipeableRow({ 
  children, 
  onDelete,
}: SwipeableRowProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [70, 0],
    });

    return (
      <View style={{ width: 70 }}>
        <Animated.View
          style={[
            {
              flex: 1,
              transform: [{ translateX }],
            },
          ]}
        >
          <RectButton
            style={styles.rightAction}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              onDelete();
            }}
          >
            <Trash2 size={24} color="#D42620" />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        leftThreshold={80}
        rightThreshold={40}
        renderRightActions={renderRightActions}
      >
        <View style={styles.container}>
          {children}
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});