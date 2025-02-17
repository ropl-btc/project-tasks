import React, { useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import {
  RectButton,
  Swipeable,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { Trash2, GripVertical } from 'lucide-react-native';
import { useTheme } from '../app/context/ThemeContext';
import * as Haptics from 'expo-haptics';
import { useSharedValue, useAnimatedGestureHandler, runOnJS, withSpring } from 'react-native-reanimated';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onMove?: (direction: 'up' | 'down', velocity: number, distance: number) => void;
}

export function SwipeableRow({ 
  children, 
  onDelete,
  onDragStart,
  onDragEnd,
  onMove,
}: SwipeableRowProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const dragY = useSharedValue(0);
  const isDragging = useRef<boolean>(false);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = dragY.value;
      runOnJS(onDragStart)?.();
      if (Platform.OS !== 'web') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
      // Close swipeable when starting drag
      runOnJS(() => swipeableRef.current?.close())();
    },
    onActive: (event, ctx) => {
      dragY.value = ctx.startY + event.translationY;
      runOnJS(onMove)?.(
        event.velocityY < 0 ? 'up' : 'down',
        Math.abs(event.velocityY),
        dragY.value
      );
    },
    onEnd: () => {
      dragY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
      runOnJS(onDragEnd)?.();
    },
    onCancel: () => {
      dragY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
      runOnJS(onDragEnd)?.();
    },
  });

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-80, -60],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <RectButton style={styles.rightAction} onPress={onDelete}>
        <Animated.View
          style={[
            styles.actionIcon,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}>
          <Trash2 size={24} color="#ef4444" />
        </Animated.View>
      </RectButton>
    );
  };

  const renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [60, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <PanGestureHandler
        activeOffsetY={[-5, 5]}
        failOffsetX={[-20, 20]}
        onGestureEvent={panGestureHandler}>
        <RectButton style={styles.leftAction}>
          <Animated.View
            style={[
              styles.actionIcon,
              {
                transform: [{ scale }],
                opacity,
              },
            ]}>
            <GripVertical size={24} color={colors.text} />
          </Animated.View>
        </RectButton>
      </PanGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        friction={1}
        leftThreshold={40}
        rightThreshold={40}
        overshootLeft={false}
        overshootRight={false}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}>
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  leftAction: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: 80,
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: 80,
  },
  actionIcon: {
    width: 80,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});