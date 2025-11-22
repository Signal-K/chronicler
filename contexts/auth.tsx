import type { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          // User already has a session (guest or registered)
          console.log('🟢 Existing session found:', existingSession.user?.id);
          setSession(existingSession);
          setLoading(false);
        } else {
          // No session exists - create automatic guest account
          console.log('🔵 No existing session, creating automatic guest account...');
          const { data, error } = await supabase.auth.signInAnonymously();
          
          if (error) {
            console.error('🔴 Failed to create guest account:', error);
            setLoading(false);
          } else {
            console.log('🟢 Guest account created automatically:', data.user?.id);
            setSession(data.session);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('🔴 Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};