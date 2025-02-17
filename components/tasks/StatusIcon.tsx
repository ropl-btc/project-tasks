import React from 'react';
import { CircleDashed, Circle, CircleCheckBig } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { TaskStatus } from '../../src/types/task';

interface StatusIconProps {
  status: TaskStatus;
  size: number;
  color: string;
  taskId: string;
}

const BaseStatusIcon = ({ status, size, color }: Omit<StatusIconProps, 'taskId'>) => {
  switch (status) {
    case 'not-started':
      return <CircleDashed size={size} color={color} />;
    case 'in-progress':
      return <Circle size={size} color={color} />;
    case 'completed':
      return <CircleCheckBig size={size} color={color} />;
  }
};

export function StatusIcon({ status, size, color, taskId }: StatusIconProps) {
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <BaseStatusIcon status={status} size={size} color={color} />
    </Animated.View>
  );
}