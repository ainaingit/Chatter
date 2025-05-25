import * as SecureStore from 'expo-secure-store';
import { supabase } from '../database/supabase';

export async function handleLogin(name: string, mdp: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('name, mdp')
            .eq('name', name)
            .eq('mdp', mdp)
            .single();

        if (error || !data) {
            return false;
        }
        // Store user session in SecureStore
        await SecureStore.setItemAsync('user_connected', JSON.stringify({ name: data.name }));
        return true;
    } catch (err) {
        return false;
    }
}