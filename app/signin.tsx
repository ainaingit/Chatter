import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';  // Importation de useRouter pour redirection
// Importation de supabase pour la gestion de l'authentification
import {supabase} from '../database/SupabaseConfig'; // Assurez-vous que le chemin est correct


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();  // Initialisation de useRouter

  const handleSignIn = () => {
    // Logique de connexion ici
    console.log('Se connecter avec', email, password);

    // Redirection vers l'écran (tabs) après une connexion réussie
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleSignIn} />
      <Link href="/signup" style={styles.link}>Pas encore de compte ? Inscrivez-vous</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
