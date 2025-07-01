
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Type definition for user profile
type UserProfile = {
  id: string;
  nome: string;
  tipo_usuario: 'admin' | 'sacoleira';
  sacoleira_relacionada?: string;
  created_at?: string;
  updated_at?: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, tipoUsuario: 'admin' | 'sacoleira') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = userProfile?.tipo_usuario === 'admin';

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched:', profile);
      if (profile) {
        // Validate and cast the tipo_usuario field
        const validatedProfile: UserProfile = {
          ...profile,
          tipo_usuario: (profile.tipo_usuario === 'admin' || profile.tipo_usuario === 'sacoleira') 
            ? profile.tipo_usuario as 'admin' | 'sacoleira'
            : 'sacoleira' // Default fallback
        };
        return validatedProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer the profile fetch and prevent blocking
          setTimeout(async () => {
            if (mounted) {
              try {
                const profile = await fetchUserProfile(session.user.id);
                if (mounted) {
                  setUserProfile(profile);
                }
              } catch (error) {
                console.error('Error fetching profile on auth change:', error);
              }
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        // Set loading to false for relevant events
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.id);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            if (mounted) {
              setUserProfile(profile);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Sign in successful:', data.user?.id);
      return { error: null };
    } catch (error) {
      console.error('Sign in catch error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nome: string, tipoUsuario: 'admin' | 'sacoleira') => {
    try {
      console.log('Attempting to sign up:', email, nome, tipoUsuario);
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome,
            tipo_usuario: tipoUsuario,
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Sign up successful:', data.user?.id);
      setLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Sign up catch error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setLoading(false);
    } catch (error) {
      console.error('Sign out catch error:', error);
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
