
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [supabaseInitialized, setSupabaseInitialized] = useState(true);

  useEffect(() => {
    // Check if Supabase credentials are using placeholders
    if (
      supabase.options.url === 'https://placeholder-project.supabase.co' || 
      supabase.options.key === 'placeholder-key'
    ) {
      setSupabaseInitialized(false);
      setLoading(false);
      console.warn('Using placeholder Supabase credentials. Authentication will not work properly.');
      return;
    }

    // Initial session fetch
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      toast({
        variant: "destructive",
        title: "Konfiguracja niepełna",
        description: "Brak właściwych danych dostępowych do Supabase. Skontaktuj się z administratorem.",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Zalogowano pomyślnie",
        description: "Witaj w systemie zarządzania flotą pojazdów",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Błąd logowania",
        description: error.message || "Wystąpił problem podczas logowania",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      toast({
        variant: "destructive",
        title: "Konfiguracja niepełna",
        description: "Brak właściwych danych dostępowych do Supabase. Skontaktuj się z administratorem.",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Konto utworzone",
        description: "Sprawdź swoją skrzynkę email, aby potwierdzić rejestrację",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Błąd rejestracji",
        description: error.message || "Wystąpił problem podczas tworzenia konta",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabaseInitialized) return;
    
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Wylogowano pomyślnie",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Błąd wylogowania",
        description: error.message || "Wystąpił problem podczas wylogowywania",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
