import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { IconButton } from '../common/IconButton';
import { SwipeableRow } from '../SwipeableRow';
import { commonStyles } from '../../styles/commonStyles';
import type { Task } from '../../src/types/task';
import { StatusIcon } from './StatusIcon';
import { PriorityIcon } from './PriorityIcon';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  onStatusChange: (reverse?: boolean) => void;
  onTextChange: (text: string) => void;
  onStartEditing: () => void;
  onEndEditing: () => void;
  onLongPress: () => void;
  onDelete: () => void;
  onPriorityPress: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onMove?: (direction: 'up' | 'down', velocity: number) => void;
}

export function TaskItem({
  task,
  isEditing,
  onStatusChange,
  onTextChange,
  onStartEditing,
  onEndEditing,
  onLongPress,
  onDelete,
  onPriorityPress,
  onDragStart,
  onDragEnd,
  onMove,
}: TaskItemProps) {
  const { colors } = useTheme();
  const [localText, setLocalText] = useState(task.text);
  const [isDragging, setIsDragging] = useState(false);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setLocalText(task.text);
  }, [task.text]);

  const handleEndEditing = () => {
    if (localText !== task.text) {
      onTextChange(localText);
    }
    onEndEditing();
  };

  const dragAnimatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      Math.abs(translateY.value),
      [0, 50],
      [1, 1.02],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale: isDragging ? scaleValue : scale.value },
        { translateY: translateY.value }
      ],
      backgroundColor: isDragging ? colors.text + '08' : 'transparent',
      zIndex: isDragging ? 999 : 0,
      elevation: isDragging ? 5 : 0,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: isDragging ? 4 : 0 },
      shadowOpacity: isDragging ? 0.1 : 0,
      shadowRadius: isDragging ? 8 : 0,
    };
  });

  const handleDragStart = () => {
    setIsDragging(true);
    scale.value = withSpring(1.02, {
      mass: 0.5,
      damping: 20,
      stiffness: 200,
    });
    onDragStart?.();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    scale.value = withSpring(1, {
      mass: 0.5,
      damping: 20,
      stiffness: 200,
    });
    translateY.value = withSpring(0, {
      mass: 0.5,
      damping: 20,
      stiffness: 200,
    });
    onDragEnd?.();
  };

  const handleMove = (direction: 'up' | 'down', velocity: number, distance: number) => {
    translateY.value = distance;
    onMove?.(direction, velocity);
  };

  return (
    <SwipeableRow 
      onDelete={onDelete}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMove={handleMove}>
      <Animated.View style={[styles.container, dragAnimatedStyle]}>
        <View style={[commonStyles.row, styles.taskRow]}>
          <IconButton
            icon={
              <StatusIcon
                status={task.status}
                size={24}
                color={colors.text}
                taskId={task.id}
              />
            }
            onPress={() => onStatusChange()}
            onLongPress={() => onStatusChange(true)}
            size={44}
          />

          {isEditing ? (
            <TextInput
              value={localText}
              onChangeText={setLocalText}
              onBlur={handleEndEditing}
              onSubmitEditing={handleEndEditing}
              placeholder="Enter task..."
              placeholderTextColor={colors.text + '60'}
              autoFocus
              style={[commonStyles.textInput, { color: colors.text }]}
            />
          ) : (
            <Pressable
              onPress={onStartEditing}
              onLongPress={onLongPress}
              style={commonStyles.textContainer}>
              <View style={commonStyles.textWrapper}>
                <Text style={[styles.taskText, { color: colors.text }]}>
                  {localText || 'Enter task...'}
                </Text>
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={onPriorityPress}
            style={styles.priorityContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={styles.priorityIconWrapper}>
              <PriorityIcon priority={task.priority} size={20} color={colors.text} />
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
  },
  taskRow: {
    paddingVertical: 4,
  },
  taskText: {
    fontSize: 16,
  },
  priorityContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityIconWrapper: {
    padding: 6,
  },
});