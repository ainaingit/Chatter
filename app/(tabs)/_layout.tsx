import React from "react";
import { SafeAreaView, View } from "react-native";
import { Tabs } from "expo-router"; // Assuming Tabs is from expo-router

export default function TabLogin() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen name="Chat" options={{ headerShown: false }} />
        <Tabs.Screen name="settings" options={{ headerShown: false }} />
        <Tabs.Screen name="PhoneLogin" options={{ headerShown: false }} />
      </Tabs>
    </SafeAreaView>
  );
}
