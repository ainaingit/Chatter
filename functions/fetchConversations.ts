import { supabase } from '../database/supabase';
import * as SecureStore from 'expo-secure-store';

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const userId = await SecureStore.getItemAsync('user_uuid');
    return userId;
  } catch (e) {
    console.error('[getCurrentUserId] Error:', e);
    return null;
  }
}

export async function fetchUserConversations(userId: string) {
  try {
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
      console.error('[fetchUserConversations] Supabase error:', error.message);
      return [];
    }

    return data.map((item: any) => ({
      id: item.conversation_id,
      name: item.conversations?.name || 'Conversation privée',
      is_group: item.conversations?.is_group,
    }));
  } catch (e) {
    console.error('[fetchUserConversations] Exception:', e);
    return [];
  }
}

export async function searchUsersByUsername(term: string) {
  if (!term.trim()) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', `%${term}%`);

    if (error) {
      console.error('[searchUsersByUsername] Supabase error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[searchUsersByUsername] Exception:', e);
    return [];
  }
}


export async function getPrivateConversationBetweenUsers(user1: string, user2: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_private_conversation_between_users', { user1, user2 });

    if (error) {
      console.error('[getPrivateConversationBetweenUsers] Supabase error:', error.message);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('[getPrivateConversationBetweenUsers] Exception:', e);
    return [];
  }
}
