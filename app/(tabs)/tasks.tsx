import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowDownUp,
  Triangle,
  CircleDashed,
  CircleCheckBig,
  CircleSlash,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { BottomPill } from '../../components/BottomPill';
import { AppScreenLayout } from '../../components/common/AppScreenLayout';
import { commonStyles } from '../../styles/commonStyles';
import { IconButton } from '../../components/common/IconButton';
import { AnimatedFabButton } from '../../components/common/AnimatedFabButton';
import { BlurModal } from '../../components/common/BlurModal';
import { TaskItem } from '../../components/tasks/TaskItem';
import { useTasks } from '../../src/hooks/useTasks';
import type { Priority, SortType } from '../../src/types/task';
import { getPriorityValue, getStatusValue, getNextStatus, getPreviousStatus } from '../../src/types/task';
import { PriorityIcon } from '../../components/tasks/PriorityIcon';

export default function TasksScreen() {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    tasks,
    isLoading,
    isRefreshing,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks,
    reorderTasks,
  } = useTasks();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>('manual');
  const [showCompleted, setShowCompleted] = useState(true);

  const fabScale = useSharedValue(1);
  const bottomPillOpacity = useSharedValue(1);

  const handleNewTask = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const task = await addTask('');
    if (task) {
      setEditingId(task.id);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    if (selectedTaskId) {
      // Close the modal immediately
      setPriorityModalVisible(false);
      setSelectedTaskId(null);

      // Update the task
      updateTask(selectedTaskId, { priority });
    }
  };

  const toggleSort = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSortType((current) => {
      switch (current) {
        case 'manual':
          return 'priority';
        case 'priority':
          return 'status';
        case 'status':
          return 'manual';
      }
    });
  };

  const toggleShowCompleted = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowCompleted((current) => !current);
  };

  const sortedAndFilteredTasks = useCallback(() => {
    let filteredTasks = showCompleted 
      ? tasks 
      : tasks.filter(task => task.status !== 'completed');

    if (sortType === 'manual') {
      return [...filteredTasks].sort((a, b) => a.order - b.order);
    }

    return filteredTasks.sort((a, b) => {
      if (sortType === 'priority') {
        return getPriorityValue(b.priority) - getPriorityValue(a.priority);
      } else {
        return getStatusValue(a.status) - getStatusValue(b.status);
      }
    });
  }, [tasks, sortType, showCompleted]);

  const sortIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${sortType === 'manual' ? 0 : sortType === 'priority' ? 120 : 240}deg`) }],
  }));

  const hideCompletedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(showCompleted ? '0deg' : '180deg') }],
  }));

  const getSortIcon = () => {
    switch (sortType) {
      case 'manual':
        return <ArrowDownUp size={24} color={colors.text} />;
      case 'priority':
        return <Triangle size={24} strokeDasharray="5,5" color={colors.text} />;
      case 'status':
        return <CircleDashed size={24} color={colors.text} />;
    }
  };

  const PriorityOption = ({ priority, label }: { priority: Priority; label: string }) => (
    <Pressable
      onPress={() => handlePriorityChange(priority)}
      style={styles.priorityOption}>
      <View style={styles.priorityOptionContent}>
        <PriorityIcon priority={priority} size={20} color={colors.text} showNoIcon={true} />
        <Text style={[styles.priorityOptionText, { color: colors.text }]}>{label}</Text>
      </View>
    </Pressable>
  );

  const bottomPill = (
    <View style={[commonStyles.bottomPillContainer]}>
      <BottomPill>
        <Animated.View style={sortIconStyle}>
          <IconButton
            icon={getSortIcon()}
            onPress={toggleSort}
          />
        </Animated.View>

        <AnimatedFabButton onPress={handleNewTask} />

        <Animated.View style={hideCompletedAnimatedStyle}>
          <IconButton
            icon={showCompleted ? (
              <CircleCheckBig size={24} color={colors.text} />
            ) : (
              <CircleSlash size={24} color={colors.text} />
            )}
            onPress={toggleShowCompleted}
          />
        </Animated.View>
      </BottomPill>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading tasks...
        </Text>
      </View>
    );
  }

  return (
    <AppScreenLayout
      scrollViewProps={{
        ref: scrollViewRef,
        refreshControl: (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTasks}
            tintColor={colors.text}
            colors={[colors.text]}
            progressBackgroundColor={colors.background}
          />
        ),
      }}
      bottomContent={bottomPill}>
      {sortedAndFilteredTasks().map((task, index) => (
        <Animated.View
          key={task.id}
          layout={Layout}
          exiting={FadeOut.duration(200)}>
          <TaskItem
            task={task}
            isEditing={editingId === task.id}
            onStatusChange={(reverse) => {
              const newStatus = reverse 
                ? getPreviousStatus(task.status)
                : getNextStatus(task.status);
              updateTask(task.id, { status: newStatus });
            }}
            onTextChange={(text) => updateTask(task.id, { text })}
            onStartEditing={() => setEditingId(task.id)}
            onEndEditing={() => setEditingId(null)}
            onLongPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              }
              setSelectedTaskId(task.id);
              setPriorityModalVisible(true);
            }}
            onDelete={() => deleteTask(task.id)}
            onPriorityPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setSelectedTaskId(task.id);
              setPriorityModalVisible(true);
            }}
            onMove={(direction) => {
              const newIndex = direction === 'up' 
                ? index - 1 
                : index + 1;

              if (newIndex < 0 || newIndex >= tasks.length) return;

              // During drag, don't commit changes
              reorderTasks(index, newIndex, false);
            }}
            onDragEnd={() => {
              // When drag ends, commit the current order to the database
              const currentIndex = tasks.findIndex(t => t.id === task.id);
              if (currentIndex !== -1) {
                reorderTasks(currentIndex, currentIndex, true);
              }
            }}
          />
        </Animated.View>
      ))}

      <BlurModal
        visible={priorityModalVisible}
        onClose={() => setPriorityModalVisible(false)}>
        <PriorityOption priority="none" label="No Priority" />
        <PriorityOption priority="low" label="Low Priority" />
        <PriorityOption priority="medium" label="Medium Priority" />
        <PriorityOption priority="high" label="High Priority" />
        <PriorityOption priority="urgent" label="Urgent" />
      </BlurModal>
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  priorityOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  priorityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
});