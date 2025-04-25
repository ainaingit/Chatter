import React from "react";
import { SafeAreaView } from "react-native";
import { Tabs } from "expo-router"; // Assuming Tabs is from expo-router
import { Title } from "react-native-paper";
import { MaterialIcons } from '@expo/vector-icons'; // Import des icônes

export default function TabLogin() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen
          name="Chat"
          options={{
            headerShown: false,
            tabBarIcon: () => <MaterialIcons name="chat" size={24} color="black" />, // Icône Chat
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            tabBarIcon: () => <MaterialIcons name="settings" size={24} color="black" />, // Icône Settings
          }}
        />
        <Tabs.Screen
          name="update"
          options={{
            headerTitle: () => <Title style={{ fontSize: 20 }}>Mettre à jour le statut</Title>,
            headerShown: true,
            tabBarIcon: () => <MaterialIcons name="update" size={24} color="black" />, // Icône Update
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
