import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { IconButton } from '../common/IconButton';
import { SwipeableRow } from '../SwipeableRow';
import { commonStyles } from '../../styles/commonStyles';
import type { Task } from '../../src/types/task';
import { StatusIcon } from './StatusIcon';
import { PriorityIcon } from './PriorityIcon';

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
}: TaskItemProps) {
  const { colors } = useTheme();
  const [localText, setLocalText] = useState(task.text);


  useEffect(() => {
    setLocalText(task.text);
  }, [task.text]);

  const handleEndEditing = () => {
    if (localText !== task.text) {
      onTextChange(localText);
    }
    onEndEditing();
  };



  return (
    <SwipeableRow 
      onDelete={onDelete}
>
      <View style={styles.container}>
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
      </View>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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