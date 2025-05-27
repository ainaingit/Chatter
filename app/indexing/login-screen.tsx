import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { handleLogin } from '../../functions/handleLogin'; // Ajuste si besoin

export default function Login() {
  const [name, setName] = useState('');
  const [mdp, setMdp] = useState('');
  const router = useRouter();

  const onLoginPress = async () => {
    const success = await handleLogin(name, mdp);
    if (success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Erreur lors de la connexion', 'Nom ou mot de passe incorrect.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>

        {/* Lien vers signup */}
        <TouchableOpacity onPress={() => router.push('/indexing/sign_up-screen')}>
          <Text style={styles.signupLink}>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    textAlign: 'center',
    color: '#4f8cff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});
