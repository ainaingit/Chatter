import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Lire les variables d’environnement
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Debug : Afficher dans la console
console.log('[SUPABASE] URL:', supabaseUrl);
console.log('[SUPABASE] ANON KEY:', supabaseAnonKey ? '✓ Key found' : '⛔️ No key');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Supabase environment variables are missing. Please check your .env file and app.config.js.');
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
