import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const userId = await AsyncStorage.getItem("userId");

      if (userId) {
        // Si un userId est trouvé, rediriger vers le chat
        router.replace("(tabs)/Chat");
      } else {
        // Si aucun userId n'est trouvé, rediriger vers la page de login
        router.replace("/Login");
      }

      setIsLoading(false); // Chargement terminé
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
