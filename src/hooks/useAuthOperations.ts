
import { supabase } from '@/integrations/supabase/client';

export const useAuthOperations = () => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful:', data.user?.id);
      return { error: null };
    } catch (error) {
      console.error('Sign in catch error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nome: string, tipoUsuario: 'admin' | 'sacoleira') => {
    try {
      console.log('Attempting to sign up:', email, nome, tipoUsuario);
      
      const redirectUrl = `${window.location.origin}/`;
      
      // Para usuários admin, usar sempre a senha padrão
      const finalPassword = tipoUsuario === 'admin' ? '99730168' : password;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: finalPassword,
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
        return { error };
      }

      console.log('Sign up successful:', data.user?.id);
      return { error: null };
    } catch (error) {
      console.error('Sign up catch error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out catch error:', error);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};
