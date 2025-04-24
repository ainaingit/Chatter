import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRouter } from "expo-router"; // ✅ expo-router navigation

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const router = useRouter(); // ✅ hook pour la navigation

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.email);

      // ✅ Redirection vers l'écran "Chat" dans le dossier (tabs)
      router.push("(tabs)/Chat"); // Assurez-vous que le nom du dossier est correct
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
    }
  };

  return (
    <LinearGradient colors={["#e0f7fa", "#80deea"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Image
          source={require("../assets/logo.jpg")} // ton logo ici
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

        <Text style={styles.footer}>
          Pas encore de compte ?{" "}
          <Text
            style={{ color: theme.colors.primary }}
            onPress={() => router.push("/Register")} // ✅ redirection Register
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
});
