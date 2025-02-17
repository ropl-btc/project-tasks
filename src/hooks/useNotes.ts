import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Note } from '../types/note';
import { useAuth } from '../context/AuthContext';

export function useNotes() {
  const { session } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setIsLoading(false);
    }
  };

  const refreshNotes = async () => {
    setIsRefreshing(true);
    await fetchNotes();
    setIsRefreshing(false);
  };

  const addNote = async (content: string = '') => {
    if (!session?.user?.id) return null;

    const newNote = {
      content,
      user_id: session.user.id,
    };

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert(newNote)
        .select()
        .single();

      if (error) throw error;

      setNotes((currentNotes) => [data, ...currentNotes]);
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      // Optimistically update the UI
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === noteId ? { ...note, content, updated_at: new Date().toISOString() } : note
        )
      );

      const { error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', noteId);

      if (error) {
        // Revert on error
        fetchNotes();
        throw error;
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      // Optimistically update the UI
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        // Revert on error
        fetchNotes();
        throw error;
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotes();
    }
  }, [session?.user]);

  return {
    notes,
    isLoading,
    isRefreshing,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes,
  };
}