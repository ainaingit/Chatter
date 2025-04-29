import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { auth } from "../config/firebase";
import {
  PhoneAuthProvider,
  updatePhoneNumber,
} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../config/firebase";
import { useRouter } from "expo-router";

export default function LinkPhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState("");
  const recaptchaVerifier = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert("Non connecté", "Veuillez vous reconnecter.");
      router.replace("/"); // Redirige vers la page de login
    }
  }, []);

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const id = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(id);
      Alert.alert("Code envoyé", "Veuillez vérifier votre téléphone.");
    } catch (err) {
      console.error("Erreur envoi code:", err);
      Alert.alert("Erreur", "Échec de l'envoi du code. Numéro invalide ?");
    }
  };

  const confirmCode = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Erreur", "Aucun utilisateur connecté.");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await updatePhoneNumber(currentUser, credential);

      Alert.alert("Succès", "Numéro ajouté avec succès !");
      router.push("(tabs)/Chat"); // Redirection après succès
    } catch (err) {
      console.error("Erreur de confirmation:", err);
      Alert.alert("Erreur", "Le code est incorrect ou expiré.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <Text variant="titleLarge" style={styles.title}>
        Ajouter un numéro de téléphone
      </Text>

      <TextInput
        label="Numéro (ex: +2613...)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={sendVerification}
        style={styles.button}
        disabled={!phoneNumber}
      >
        Envoyer le code
      </Button>

      {verificationId && (
        <>
          <TextInput
            label="Code reçu"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={confirmCode}
            style={styles.button}
            disabled={!code}
          >
            Confirmer
          </Button>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
});
