import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function Settings() {
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = React.useState(false);

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
