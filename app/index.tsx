import React from "react";
import { Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Import dégradé
import { useRouter } from "expo-router";

const App = () => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <LinearGradient
    colors={["#e0f7fa", "#80deea"]} // 💙 dégradé doux ciel
      style={styles.container}
    >
      <Text style={styles.welcomeText}>Welcome to Chatter!</Text>

      <Button
        mode="contained"
        onPress={handleGoToLogin}
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
      >
        Go to Login
      </Button>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // 🤍 pour bien ressortir
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    width: 180,
  },
});

export default App;
