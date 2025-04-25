import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
