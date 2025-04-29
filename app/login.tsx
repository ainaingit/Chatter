import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      // Stocker l'identifiant utilisateur localement
      await AsyncStorage.setItem("userId", userId);

      console.log("User logged in:", user.email);

      // Vérifier si un numéro est déjà lié
      if (!user.phoneNumber) {
        Alert.alert(
          "Ajouter un numéro",
          "Souhaitez-vous ajouter un numéro de téléphone pour faciliter vos futures connexions ?",
          [
            {
              text: "Plus tard",
              style: "cancel"
            },
            {
              text: "Ajouter maintenant",
              onPress: () => router.push("/LinkPhoneNumber")
            }
          ]
        );
      }

      // Aller à la page de chat
      router.push("(tabs)");

    } catch (error) {
      if (__DEV__) {
        console.error("Login error:", error.message);
      }
      Alert.alert("Erreur", "Email ou mot de passe incorrect. Veuillez réessayer.");
    }
  };

  return (
    <LinearGradient colors={["#e0f7fa", "#80deea"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Image
          source={require("../assets/logo.jpg")}
          style={styles.logo}
        />

        <Text variant="titleLarge" style={styles.title}>
          Connexion
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Se connecter
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push("/PhoneLogin")}
          style={styles.phoneButton}
          contentStyle={{ paddingVertical: 6 }}
          icon="cellphone"
        >
          Se connecter avec le téléphone
        </Button>

        <Text style={styles.footer}>
          Pas encore de compte ?{" "}
          <Text
            style={{ color: theme.colors.primary }}
            onPress={() => router.push("/signUp")}
          >
            S'inscrire
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 25,
    fontSize: 24,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
  phoneButton: {
    marginTop: 10,
    borderRadius: 8,
    borderColor: "#00796B",
    borderWidth: 1,
  },
});
