import React from 'react';
import {
  Triangle,
  AlertTriangle,
  OctagonAlert,
  CircleSlash,
} from 'lucide-react-native';
import type { Priority } from '../../src/types/task';

interface PriorityIconProps {
  priority: Priority;
  size: number;
  color: string;
  showNoIcon?: boolean;
}

export function PriorityIcon({
  priority,
  size,
  color,
  showNoIcon = false,
}: PriorityIconProps) {
  switch (priority) {
    case 'low':
      return <Triangle size={size} strokeDasharray="5,5" color="#22c55e" />;
    case 'medium':
      return <Triangle size={size} color="#eab308" />;
    case 'high':
      return <AlertTriangle size={size} color="#f97316" />;
    case 'urgent':
      return <OctagonAlert size={size} color="#ef4444" />;
    case 'none':
      return showNoIcon ? <CircleSlash size={size} color={color} /> : null;
    default:
      return null;
  }
}