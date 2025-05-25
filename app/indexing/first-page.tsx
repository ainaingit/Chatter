// app/FirstPage.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const FirstPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chatter!</Text>
      <Text style={styles.subtitle}>
        Connect, chat, and share with your friends.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)/home')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D9CDB',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2D9CDB',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FirstPage;
