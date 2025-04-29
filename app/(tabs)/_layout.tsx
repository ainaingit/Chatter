import React from "react";
import { SafeAreaView } from "react-native";
import { Tabs } from "expo-router"; // Assuming Tabs is from expo-router
import { Title } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'; // Import des icônes modernes (Ionicons)

export default function TabLogin() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen
          name="Chat"
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" /> // Icône Chat (style WhatsApp)
            ),
          }}
        />
        <Tabs.Screen
          name="update"
          options={{
            headerTitle: () => <Title style={{ fontSize: 20 }}>Mettre à jour le statut</Title>,
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="sync-outline" size={24} color="black" /> // Icône Update (style WhatsApp)
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="settings-outline" size={24} color="black" /> // Icône Settings (style WhatsApp)
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
