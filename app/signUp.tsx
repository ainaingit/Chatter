import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Alert } from "react-native";
import { Button } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase"; // Assure-toi d'avoir importé 'db' (Firestore)
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore"; // Import de Firestore pour ajouter un utilisateur

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      // Créer un utilisateur avec email et mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Créer un document dans la collection 'users' de Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "", // Initialisation d'un nom vide, tu pourras le modifier après
        bio: "",  // Initialisation d'une bio vide
        photoUrl: "", // Photo par défaut
        createdAt: new Date(), // Date de création
      });

      // Alerte et redirection après création
      Alert.alert("Succès", "Compte créé avec succès !");
      router.replace("/login");
    } catch (error: any) {
      console.log("Erreur inscription:", error);
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        S'inscrire
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    padding: 5,
  },
});
