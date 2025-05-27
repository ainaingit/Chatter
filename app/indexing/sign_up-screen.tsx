import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../database/supabase'; // 📌 Assure-toi que ce chemin est correct

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSignupPress = async () => {
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setError(signupError.message);
    } else {
      Alert.alert(
        'Succès',
        "Compte créé ! Vérifie ton email pour confirmer l'inscription.",
        [{ text: 'OK', onPress: () => router.replace('/indexing/login-screen') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Créer un compte</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={onSignupPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/indexing/login-screen')}
          style={styles.signupWrapper}
        >
          <Text style={styles.signupText}>Déjà inscrit ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafc',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: width * 0.9,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 36,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f4f7',
    borderRadius: 14,
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#444',
    borderWidth: 1,
    borderColor: '#f2f4f7',
  },
  error: {
    color: '#e03e3e',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  button: {
    borderWidth: 1.5,
    borderColor: '#3a86ff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonText: {
    color: '#3a86ff',
    fontWeight: '600',
    fontSize: 18,
  },
  signupWrapper: {
    alignItems: 'center',
  },
  signupText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
