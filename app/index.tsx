import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router'; // Pour rediriger l'utilisateur après la connexion
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'; 
import { auth } from '../database/firebase';  // Assurez-vous que le chemin vers firebase.ts est correct

export default function SignInPhone() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);  // Typage de la réponse Firebase
  const router = useRouter();

  // Fonction pour gérer la connexion par téléphone
  const handlePhoneSignIn = async () => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container', // ID de ton conteneur reCAPTCHA
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA validé :', response);
          },
        },
        auth
      );

      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      alert('Code envoyé à votre numéro!');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code :', error.message);
      alert('Erreur lors de l\'envoi du code : ' + error.message);
    }
  };

  // Fonction pour vérifier le code de vérification
  const handleVerifyCode = async () => {
    try {
      await confirmationResult.confirm(verificationCode);
      alert('Connexion réussie!');
      router.push('/(tabs)'); // Redirection après connexion réussie
    } catch (error) {
      console.error('Erreur de vérification du code :', error.message);
      alert('Erreur de vérification du code : ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Button title="Envoyer le code" onPress={handlePhoneSignIn} />
      {confirmationResult && (
        <View>
          <TextInput
            placeholder="Code de vérification"
            value={verificationCode}
            onChangeText={setVerificationCode}
            style={styles.input}
            keyboardType="number-pad"
          />
          <Button title="Vérifier le code" onPress={handleVerifyCode} />
        </View>
      )}
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
