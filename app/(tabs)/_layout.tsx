import React from "react";
import { Tabs } from "expo-router"; // Assuming Tabs is from expo-router

export default function TabLogin(){
    return (
        <Tabs>
      <Tabs.Screen name="Chat" options={{ headerShown: false }} />
      <Tabs.Screen name="settings" options={{ headerShown: false }} />
      <Tabs.Screen name="PhoneLogin" options={{ headerShown: false }} />
    </Tabs>
    );
    
}