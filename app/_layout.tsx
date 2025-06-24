import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      <Stack.Screen
        name="indexing/first-page"
        options={{
          title: "First Page",
          headerShown: true,               // Affiche le header sur cet écran
          animation: "slide_from_right",   // Animation quand on ouvre cet écran
          presentation: "card",            // Modal ou carte (default 'card')
          // scrollFromBottom: true,      // <-- Option fictive / exemple, voir doc réelle si dispo
          gestureEnabled: false,            // Empêche la fermeture par geste sur modale
        }}
      />

      <Stack.Screen
        name="indexing/login-screen"
        options={{
          title: "Login",
          headerShown: false,              // Pas de header ici (modal style)
          animation: "slide_from_bottom", // Animation modale venant du bas
          presentation: "modal",           // Présentation modale
          gestureEnabled: true,            // Permet retour par geste (glisser)
        }}
      />
      
      <Stack.Screen
        name="indexing/sign_up-screen"
        options={{
          title: "Dashboard",
          headerShown: false,
          animation: "fade",
          presentation: "card",
          gestureEnabled: true,
        }}
      />
      
    </Stack>
  );
}
