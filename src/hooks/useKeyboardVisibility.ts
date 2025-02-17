import { useState, useEffect } from 'react';
import { Platform, Keyboard } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

interface UseKeyboardVisibilityOptions {
  /** Whether to track keyboard height */
  trackHeight?: boolean;
  /** Whether to animate bottom pill opacity */
  animateBottomPill?: boolean;
  /** Whether to animate toolbar translation */
  animateToolbar?: boolean;
}

interface UseKeyboardVisibilityResult {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  bottomPillOpacity?: Animated.SharedValue<number>;
  toolbarTranslateY?: Animated.SharedValue<number>;
}

export function useKeyboardVisibility({
  trackHeight = false,
  animateBottomPill = false,
  animateToolbar = false,
}: UseKeyboardVisibilityOptions = {}): UseKeyboardVisibilityResult {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const bottomPillOpacity = animateBottomPill ? useSharedValue(1) : undefined;
  const toolbarTranslateY = animateToolbar ? useSharedValue(100) : undefined;

  useEffect(() => {
    const handleKeyboardShow = (e?: any) => {
      setKeyboardVisible(true);
      if (trackHeight && e) {
        setKeyboardHeight(e.endCoordinates.height);
      }
      if (bottomPillOpacity) {
        bottomPillOpacity.value = withTiming(0, { duration: 150 });
      }
      if (toolbarTranslateY) {
        toolbarTranslateY.value = withTiming(0, { duration: 250 });
      }
    };

    const handleKeyboardHide = () => {
      setKeyboardVisible(false);
      if (trackHeight) {
        setKeyboardHeight(0);
      }
      if (bottomPillOpacity) {
        bottomPillOpacity.value = withTiming(1, { duration: 150 });
      }
      if (toolbarTranslateY) {
        toolbarTranslateY.value = withTiming(100, { duration: 200 });
      }
    };

    const showSubscription = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillShow', handleKeyboardShow)
      : Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    const hideSubscription = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', handleKeyboardHide)
      : Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [trackHeight, bottomPillOpacity, toolbarTranslateY]);

  return {
    isKeyboardVisible,
    keyboardHeight,
    bottomPillOpacity,
    toolbarTranslateY,
  };
}