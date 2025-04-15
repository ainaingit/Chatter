import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="status" options={{ title: 'Statuette' }} />
    </Tabs>
  );
}
