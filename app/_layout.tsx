import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false, // remove header globally
        }}
      />
      <Stack.Screen name="index"
        options={{
          title: 'Home',
          headerShown: false,
        }} />
      <Stack.Screen
        name="auth-screen"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom', // nice for auth screen
        }}
      />

      <Stack.Screen
        name="chat-list"
        options={{
          headerShown: false,
          animation: 'slide_from_right', // default chat screen animation
        }}
      />

    </AppProvider>
  );
}
