import React from "react";
import { SafeAreaView } from "react-native";
import { Tabs } from "expo-router"; // Pour les onglets
import { Title } from "react-native-paper"; // Pour le titre de l'en-tête
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Icônes modernes

export default function TabLogin() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs>
        {/* Onglet Accueil */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />

        {/* Onglet Status */}
        <Tabs.Screen
          name="update"
          options={{
            headerTitle: () => <Title style={{ fontSize: 20 }}>Mettre à jour le statut</Title>,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sync-outline" size={size} color={color} /> // Icône de mise à jour
            ),
          }}
        />

        {/* Onglet Paramètres */}
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} /> // Icône des paramètres
            ),
          }}
        />

        {/* Onglet Profil */}
        <Tabs.Screen
          name="profil"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} /> // Icône du profil
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
