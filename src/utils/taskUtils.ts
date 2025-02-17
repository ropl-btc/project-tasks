import React from 'react';
import {
  CircleDashed,
  Circle,
  CircleCheckBig,
  Triangle,
  AlertTriangle,
  Octagon,
  CircleSlash,
} from 'lucide-react-native';

export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export function getNextStatus(current: TaskStatus): TaskStatus {
  const statusOrder: TaskStatus[] = ['not-started', 'in-progress', 'completed'];
  const currentIndex = statusOrder.indexOf(current);
  return statusOrder[(currentIndex + 1) % statusOrder.length];
}

export function getPriorityValue(priority: Priority): number {
  const priorityValues: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
    none: 0,
  };
  return priorityValues[priority];
}

export function getStatusValue(status: TaskStatus): number {
  const statusValues: Record<TaskStatus, number> = {
    'not-started': 0,
    'in-progress': 1,
    'completed': 2,
  };
  return statusValues[status];
}

interface StatusIconProps {
  status: TaskStatus;
  size: number;
  color: string;
}

export function StatusIcon({ status, size, color }: StatusIconProps) {
  switch (status) {
    case 'not-started':
      return <CircleDashed size={size} color={color} />;
    case 'in-progress':
      return <Circle size={size} color={color} />;
    case 'completed':
      return <CircleCheckBig size={size} color={color} />;
  }
}

interface PriorityIconProps {
  priority: Priority;
  size: number;
  color: string;
  showNoIcon?: boolean;
}

export function PriorityIcon({ priority, size, color, showNoIcon = false }: PriorityIconProps) {
  switch (priority) {
    case 'low':
      return <Triangle size={size} strokeDasharray="5,5" color="#22c55e" />;
    case 'medium':
      return <Triangle size={size} color="#eab308" />;
    case 'high':
      return <AlertTriangle size={size} color="#f97316" />;
    case 'urgent':
      return <Octagon size={size} color="#ef4444" />;
    case 'none':
      return showNoIcon ? <CircleSlash size={size} color={color} /> : null;
    default:
      return null;
  }
}