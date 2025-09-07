import { supabase } from '../lib/supabase';

class AuthService {
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'family'
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Sign up failed' } };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Sign in failed' } };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Sign out failed' } };
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location?.origin}/reset-password`
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Password reset failed' } };
    }
  }

  async updatePassword(newPassword) {
    try {
      const { error } = await supabase?.auth?.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Password update failed' } };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      if (error) throw error;
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to get current user' } };
    }
  }

  async getUserProfile(userId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: null, error: { message: 'No user ID provided' } };
      }

      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', targetUserId)?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to fetch user profile' } };
    }
  }

  async updateUserProfile(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to update profile' } };
    }
  }

  async uploadAvatar(file) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('No authenticated user');

      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase?.storage?.from('memorial-images')?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase?.storage?.from('memorial-images')?.getPublicUrl(fileName);

      // Update user profile with avatar URL
      const { data, error } = await supabase?.from('user_profiles')?.update({ avatar_url: urlData?.publicUrl })?.eq('id', user?.id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to upload avatar' } };
    }
  }
}

export default new AuthService();