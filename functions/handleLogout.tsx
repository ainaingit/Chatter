// utils/handleLogout.js
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../database/supabase'; // Assurez-vous d’avoir ce fichier configuré

export async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut(); // Supprime l'utilisateur côté Supabase

    if (error) {
      console.error('Supabase logout error:', error.message);
      Alert.alert('Logout failed', error.message);
      return;
    }

    await SecureStore.deleteItemAsync('user_connected');

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
