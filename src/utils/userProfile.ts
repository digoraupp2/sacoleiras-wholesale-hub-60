
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
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
