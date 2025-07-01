
import { User, Session } from '@supabase/supabase-js';

// Type definition for user profile
export type UserProfile = {
  id: string;
  nome: string;
  tipo_usuario: 'admin' | 'sacoleira';
  sacoleira_relacionada?: string;
  created_at?: string;
  updated_at?: string;
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, tipoUsuario: 'admin' | 'sacoleira') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}
