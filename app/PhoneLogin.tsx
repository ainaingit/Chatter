import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

// Utilitaire simple pour valider un numéro avec indicatif
const isValidPhoneNumber = (number) => {
  const phoneRegex = /^\+\d{1,4}\d{6,12}$/; // Exemple: +261341234567
  return phoneRegex.test(number);
};

export default function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (!isValidPhoneNumber(phone)) {
      setError("Numéro invalide. Exemple: +261341234567");
      return;
    }
    setError("");
    router.push({
      pathname: "/PhoneLogin",
      params: { phone }, // tu peux envoyer le numéro à PhoneLogin si besoin
    });
  };

  return (
    
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.box}>
          <Text variant="titleLarge" style={styles.title}>
            Connexion
          </Text>

          <TextInput
            label="Numéro de téléphone"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
            error={!!error}
          />
          {error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            mode="contained"
            onPress={handlePress}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
            icon="cellphone"
          >
            Se connecter avec un numéro
          </Button>

          <Text style={styles.footer}>
            Pas encore de compte ?{" "}
            <Text
              style={{ color: theme.colors.primary }}
              onPress={() => router.push("/Register")}
            >
              S'inscrire
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 25,
    fontSize: 24,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
});
