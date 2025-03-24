
import { createClient } from '@supabase/supabase-js';

// Default to empty values during development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only show a warning in development, not an error that breaks the application
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase environment variables. For development, placeholder values are being used. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file for actual authentication to work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
