import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFound() {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.back()}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Page not found</Text>
      <Text style={styles.hint}>(Tap anywhere to go back)</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 12,
  },
  message: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#ff0000',
  },
});
