// app/index.js
import React, { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthContext } from "../config/AppProvider";
import { useRouter } from "expo-router";

export default function Index() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/(tabs)/Chat"); // 👈 redirige vers page de chat
      } else {
        router.replace("/login"); // 👈 redirige vers login
      }
    }
  }, [user, isLoading]);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00796B" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
