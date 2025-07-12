// app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'conversations') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            if (route.name === 'Testscreen') {
              iconName = focused ? 'flask' : 'flask-outline';
            } else {
              iconName = 'ellipse';
            }
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2D9CDB',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home' , headerShown: false }}
      />
      <Tabs.Screen
        name="conversations"
        options={{ title: 'Discuss' , headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' , headerShown: false }}
      />
      <Tabs.Screen
        name="Testscreen"
        options={{ title: 'Ally', headerShown: false }}    ></Tabs.Screen>
    </Tabs>
  );
}
