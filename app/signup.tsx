import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Importation correcte du Picker
import { Picker } from '@react-native-picker/picker';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('FR'); // Valeur par défaut: France
  const [countryCode, setCountryCode] = useState('+33'); // Code du pays par défaut

  const handleSignUp = () => {
    if (!firstName || !lastName || !birthDate || !phoneNumber) {
      Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
      return;
    }

    // Affichage des informations après validation
    Alert.alert('Inscription réussie', `Nom: ${firstName} ${lastName}\nDate de naissance: ${birthDate}\nNuméro: ${countryCode} ${phoneNumber}\nPays: ${country}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Date de naissance (JJ/MM/AAAA)"
        value={birthDate}
        onChangeText={setBirthDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Sélectionner le pays :</Text>
        <Picker
          selectedValue={country}
          style={styles.picker}
          onValueChange={(itemValue) => setCountry(itemValue)}
        >
          <Picker.Item label="France" value="FR" />
          <Picker.Item label="Allemagne" value="DE" />
          <Picker.Item label="Italie" value="IT" />
          <Picker.Item label="Espagne" value="ES" />
          <Picker.Item label="États-Unis" value="US" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Sélectionner le code pays :</Text>
        <Picker
          selectedValue={countryCode}
          style={styles.picker}
          onValueChange={(itemValue) => setCountryCode(itemValue)}
        >
          <Picker.Item label="+33 (France)" value="+33" />
          <Picker.Item label="+1 (États-Unis)" value="+1" />
          <Picker.Item label="+49 (Allemagne)" value="+49" />
          <Picker.Item label="+39 (Italie)" value="+39" />
          <Picker.Item label="+34 (Espagne)" value="+34" />
        </Picker>
      </View>

      <Button title="Valider" onPress={handleSignUp} />
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
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    borderRadius: 5,
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
  },
});
