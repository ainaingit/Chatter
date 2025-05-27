import { supabase } from '../database/supabase';
import * as SecureStore from 'expo-secure-store';

export async function handleLogin(email: string, password: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Erreur login:', error.message);
            return false;
        }

        if (data?.user) {
            // Stocker l'UUID dans SecureStore
            await SecureStore.setItemAsync('user_uuid', data.user.id);
            return true;
        }

        return false;
    } catch (e) {
        console.error('Exception login:', e);
        return false;
    }
}
