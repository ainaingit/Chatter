import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';  // Importation de Link

export default function Index() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignInWithPhone = () => {
    // Afficher un prompt pour entrer le numéro de téléphone
    const userPhoneNumber = prompt("Entrez votre numéro de téléphone :");

    if (userPhoneNumber) {
      setPhoneNumber(userPhoneNumber);  // Mettre à jour le numéro dans l'état
      console.log('Se connecter avec le numéro:', userPhoneNumber);
      // Logique d'authentification avec le numéro de téléphone ici
    } else {
      Alert.alert('Erreur', 'Numéro de téléphone non fourni.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue sur Chatter !</Text>
      <Text style={styles.text}>Vous avez déjà un compte ?</Text>
      <Link href="/signin" style={styles.button}>Se connecter</Link>
      <Text style={styles.text}>Ou inscrivez-vous !</Text>
      <Link href="/signup" style={styles.button}>S'inscrire</Link>

      <Text style={styles.text}>Se connecter avec mon numéro :</Text>
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button
        title="Se connecter avec le numéro"
        onPress={handleSignInWithPhone}
        disabled={phoneNumber.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    fontSize: 20,
    color: '#fff',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    borderRadius: 5,
  },
});
