import { Database } from '../lib/supabase';

export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';
export type SortType = 'manual' | 'priority' | 'status';

export type Task = Database['public']['Tables']['tasks']['Row'];

export const getNextStatus = (current: TaskStatus): TaskStatus => {
  const statusOrder: TaskStatus[] = ['not-started', 'in-progress', 'completed'];
  const currentIndex = statusOrder.indexOf(current);
  return statusOrder[(currentIndex + 1) % statusOrder.length];
};

export const getPreviousStatus = (current: TaskStatus): TaskStatus => {
  const statusOrder: TaskStatus[] = ['not-started', 'in-progress', 'completed'];
  const currentIndex = statusOrder.indexOf(current);
  return statusOrder[(currentIndex - 1 + statusOrder.length) % statusOrder.length];
};

export const getPriorityValue = (priority: Priority): number => {
  const priorityValues: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
    none: 0,
  };
  return priorityValues[priority];
};

export const getStatusValue = (status: TaskStatus): number => {
  const statusValues: Record<TaskStatus, number> = {
    'not-started': 0,
    'in-progress': 1,
    'completed': 2,
  };
  return statusValues[status];
};