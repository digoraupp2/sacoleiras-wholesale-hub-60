
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    session,
    userProfile,
    loading,
    setUser,
    setSession,
    setUserProfile,
    setLoading,
  } = useAuthState();

  const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut } = useAuthOperations();

  const isAdmin = userProfile?.tipo_usuario === 'admin';

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authSignIn(email, password);
    if (result.error) {
      setLoading(false);
    }
    return result;
  };

  const signUp = async (email: string, password: string, nome: string, tipoUsuario: 'admin' | 'sacoleira') => {
    setLoading(true);
    const result = await authSignUp(email, password, nome, tipoUsuario);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await authSignOut();
    
    // Clear state immediately
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setLoading(false);
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
