import { Database } from '../lib/supabase';

export type Note = Database['public']['Tables']['notes']['Row'];