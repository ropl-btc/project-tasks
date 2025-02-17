import React, { useRef, forwardRef } from 'react';
import {
  ScrollView,
  View,
  Platform,
  ScrollViewProps,
  GestureResponderEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface TouchableScrollViewProps extends ScrollViewProps {
  onEmptySpaceLongPress?: () => void;
}

export const TouchableScrollView = forwardRef<ScrollView, TouchableScrollViewProps>(({
  children,
  onEmptySpaceLongPress,
  ...props
}, ref) => {
  const contentRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout>();

  // Forward the ref to both our local ref and the passed ref
  const handleRef = (scrollView: ScrollView | null) => {
    scrollViewRef.current = scrollView;
    if (typeof ref === 'function') {
      ref(scrollView);
    } else if (ref) {
      ref.current = scrollView;
    }
  };

  const handleLongPress = (event: GestureResponderEvent) => {
    if (!onEmptySpaceLongPress) return;

    // Get the scroll position
    if (scrollViewRef.current) {
      // @ts-ignore - contentOffset exists but is not in types
      const scrollOffset = scrollViewRef.current._contentOffset?.y || 0;
      
      // Get the content measurements
      contentRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const clickY = event.nativeEvent.pageY - pageY + scrollOffset;
        const contentHeight = height;
        
        // If the click is below the content, trigger the empty space press
        if (clickY > contentHeight) {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          onEmptySpaceLongPress();
        }
      });
    }
  };

  return (
    <TouchableWithoutFeedback onLongPress={handleLongPress}>
      <ScrollView
        ref={handleRef}
        {...props}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={Platform.OS !== 'web'}>
        <View 
          ref={contentRef}
          onLayout={() => {}}>
          {children}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
});

TouchableScrollView.displayName = 'TouchableScrollView';