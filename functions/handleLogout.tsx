import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../database/supabase';

export async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase logout error:', error.message);
      Alert.alert('Logout failed', error.message);
      return;
    }

    // Supprime la bonne clé stockée
    await SecureStore.deleteItemAsync('user_uuid');

    Alert.alert('Disconnected', 'You have been disconnected.', [
      {
        text: 'OK',
        onPress: () => router.replace('/'),
      },
    ]);
  } catch (error) {
    console.error('Logout error:', error);
    Alert.alert('Error', 'Failed to logout. Please try again.');
  }
}
