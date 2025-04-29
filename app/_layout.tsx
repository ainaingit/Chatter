// app/_layout.js
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../config/AppProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="LinkPhoneNumber" options={{ headerShown: true }} />
      </Stack>
    </AuthProvider>
  );
}
