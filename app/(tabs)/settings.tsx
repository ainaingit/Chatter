import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function Settings() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(null);;
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
  const router = useRouter();

  // Demander la permission pour les notifications
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Les notifications sont nécessaires pour l\'application.');
    }
  };

  const handleNotificationSwitch = async (value) => {
    setIsNotificationEnabled(value);

    if (value) {
      // Si les notifications sont activées, demande la permission
      await requestNotificationPermission();
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirmation de déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Se déconnecter",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/login");
            } catch (error) {
              console.error("Erreur lors de la déconnexion :", error);
              Alert.alert("Erreur", "La déconnexion a échoué. Veuillez réessayer.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      {/* Notifications */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Activer les notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={handleNotificationSwitch}
          value={isNotificationEnabled}
        />
      </View>

      {/* Informations personnelles */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Informations personnelles</Text>
      </TouchableOpacity>

      {/* Mot de passe */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Modifier le mot de passe</Text>
      </TouchableOpacity>

      {/* Compte lié */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Compte lié / Center Account</Text>
      </TouchableOpacity>

      {/* Déconnexion */}
      <TouchableOpacity
        style={[styles.settingItem, { justifyContent: 'center' }]}
        onPress={handleLogout}
      >
        <Text style={[styles.settingText, { color: 'red', fontWeight: 'bold', textAlign: 'center' }]}>
          Se déconnecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
  },
});
