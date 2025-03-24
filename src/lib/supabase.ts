
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase credentials
const supabaseUrl = 'https://xkomegyeuylyqgshzgup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrb21lZ3lldXlseXFnc2h6Z3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDE3OTcsImV4cCI6MjA1ODQxNzc5N30.7ELHg-gugK_iDxRIai3Kk9Yi_0D9UQrdGh0HmJDt_CY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
