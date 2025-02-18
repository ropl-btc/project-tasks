import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types/task';
import { useAuth } from '../context/AuthContext';

export function useTasks() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      setTasks(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setIsLoading(false);
    }
  };

  const refreshTasks = async () => {
    setIsRefreshing(true);
    await fetchTasks();
    setIsRefreshing(false);
  };

  const addTask = async (text: string, priority: Task['priority'] = 'none') => {
    if (!session?.user?.id) return null;

    const newTask = {
      text,
      status: 'not-started' as const,
      priority,
      order: tasks.length,
      user_id: session.user.id,
    };

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      setTasks((currentTasks) => [...currentTasks, data]);
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Optimistically update the UI
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) {
        // Revert on error
        fetchTasks();
        throw error;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Find the task to be deleted
      const deletedTask = tasks.find(t => t.id === taskId);
      if (!deletedTask) return;

      // Optimistically update the UI
      const updatedTasks = tasks
        .filter(t => t.id !== taskId)
        .map(t => {
          if (t.order > deletedTask.order) {
            return { ...t, order: t.order - 1 };
          }
          return t;
        });
      setTasks(updatedTasks);

      // Perform the actual deletion
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        // Revert on error
        fetchTasks();
        throw error;
      }

      // Update the order of remaining tasks in the background
      await Promise.all(
        updatedTasks
          .filter(t => t.order > deletedTask.order)
          .map(t => supabase
            .from('tasks')
            .update({ order: t.order })
            .eq('id', t.id)
          )
      );
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const reorderTasks = async (fromIndex: number, toIndex: number, commitChanges: boolean = false) => {
    if (fromIndex === toIndex) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);

    // Update orders
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    // Update the UI immediately
    setTasks(updatedTasks);

    // Only update the database if commitChanges is true
    if (commitChanges) {
      try {
        await Promise.all(
          updatedTasks.map(task => 
            supabase
              .from('tasks')
              .update({ order: task.order })
              .eq('id', task.id)
          )
        );
      } catch (error) {
        console.error('Error updating task orders:', error);
        // Revert on error
        setTasks(tasks);
      }
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchTasks();
    }
  }, [session?.user]);

  return {
    tasks,
    isLoading,
    isRefreshing,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    refreshTasks,
    draggedTask,
    setDraggedTask,
  };
}