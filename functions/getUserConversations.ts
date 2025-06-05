import { supabase } from '../database/supabase';
import * as SecureStore from 'expo-secure-store';

export async function getUserConversations() {
  try {
    const userId = await SecureStore.getItemAsync('user_uuid');
    console.log('User UUID récupéré :', userId); // 🔍 Vérifie l'UUID utilisateur

    if (!userId) return [];

    const { data, error } = await supabase
      .from('participants')
      .select(`
        conversation_id,
        conversations (
          id,
          name,
          is_group,
          created_at
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur récupération conversations:', error.message);
      return [];
    }

    console.log('Conversations brutes récupérées :', data); // 🔍 Affiche les données récupérées

    const formatted = data.map((item: any) => ({
      id: item.conversation_id,
      name: item.conversations?.name || 'Conversation privée',
      is_group: item.conversations?.is_group,
    }));

    console.log('Conversations formatées :', formatted); // 🔍 Affiche le format final

    return formatted;
  } catch (e) {
    console.error('Exception getUserConversations:', e);
    return [];
  }
}
