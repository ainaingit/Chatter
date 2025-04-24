import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation();

  const handleGoToLogin = () => {
    navigation.navigate('login'); // Ensure you registered "Login" in your navigator
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Chatter!</Text>
      
      <Button 
        mode="contained" 
        onPress={handleGoToLogin} 
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
      >
        Go to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    width: 180,
  },
});

export default App;
