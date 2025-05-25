import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        options={{ title: "Home" }} // headerShown inutile ici
      />
      <Stack.Screen
        name="Profile"
        options={{ title: "Profile" , headerShown: true }} // idem
      />
    </Stack>
  );
}
