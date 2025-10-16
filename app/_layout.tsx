import { Stack } from "expo-router";
import { AppProviders } from "../context/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{ headerShown: false,animation: 'fade', }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth-screen"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="upload"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AppProviders>
  );
}
