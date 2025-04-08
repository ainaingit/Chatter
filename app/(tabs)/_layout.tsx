import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      <Tabs.Screen name="status" options={{ title: 'Statuette' }} />
      <Tabs.Screen name="appel" options={{ title: 'Appels' }} />
      <Tabs.Screen name="messages" options={{ title: 'Liste des messages' }} />
    </Tabs>
  );
}
