import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Settings() {
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = React.useState(false);
  const router = useRouter();

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
          onValueChange={() => setIsNotificationEnabled(prev => !prev)}
          value={isNotificationEnabled}
        />
      </View>

      {/* Informations */}
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

      {/* Sauvegarde */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Sauvegarde automatique</Text>
        <Switch
          trackColor={{ false: '#ccc', true: '#4caf50' }}
          thumbColor={isAutoSaveEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => setIsAutoSaveEnabled(prev => !prev)}
          value={isAutoSaveEnabled}
        />
      </View>

      {/* Statut */}
      <View style={[styles.settingItem, { justifyContent: 'space-between' }]}>
        <Text style={styles.settingText}>Statut du compte</Text>
        <Text style={[styles.settingText, { color: '#4caf50', fontWeight: 'bold' }]}>Actif</Text>
      </View>

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
