import { supabase } from '../database/supabase';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

export const fetchUserProfile = async () => {
  const uuid = await SecureStore.getItemAsync('user_uuid');
  if (!uuid) throw new Error('UUID non trouvé dans SecureStore');

  const { data, error } = await supabase
    .from('profiles')
    .select('username, bio, email, avatar_url')
    .eq('id', uuid)
    .single();

  if (error) throw error;
  return { data, uuid };
};

export const updateUserProfile = async (profile: any, username: string, email: string, bio: string) => {
  const uuid = await SecureStore.getItemAsync('user_uuid');
  if (!uuid) throw new Error('UUID non trouvé dans SecureStore');

  const updates: any = { id: uuid };
  if (username !== profile?.username) updates.username = username;
  if (email !== profile?.email) updates.email = email;
  if (bio !== profile?.bio) updates.bio = bio;

  if (Object.keys(updates).length === 1) {
    Alert.alert('Aucune modification détectée');
    return;
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('profiles')
    .upsert(updates, { returning: 'minimal' });

  if (error) throw error;
};

export const uploadAvatar = async (fileUri: string, fileName: string) => {
  const uuid = await SecureStore.getItemAsync('user_uuid');
  if (!uuid) throw new Error('UUID non trouvé');

  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`public/${uuid}/${fileName}`, blob, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(`public/${uuid}/${fileName}`);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: urlData?.publicUrl })
    .eq('id', uuid);

  if (updateError) throw updateError;

  return urlData?.publicUrl;
};

export const deleteAccount = async () => {
  const uuid = await SecureStore.getItemAsync('user_uuid');
  if (!uuid) throw new Error('UUID non trouvé');

  const { error: deleteProfileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', uuid);

  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(uuid);

  if (deleteProfileError || deleteUserError) {
    throw deleteProfileError || deleteUserError;
  }

  await SecureStore.deleteItemAsync('user_uuid');
};
