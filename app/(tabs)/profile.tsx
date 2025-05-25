import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const user = {
  name: 'Aina Kevin',
  username: '@ainakevin',
  bio: 'Mobile Developer | React Native Enthusiast | Coffee Lover',
};

export default function Profile() {
  const handleLogout = () => {
    alert('Logged out!');
  };

  const handleEditProfile = () => {
    alert('Edit profile clicked!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
       

        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={96} color="#aaa" style={styles.defaultAvatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.bio}>{user.bio ? user.bio : 'No bio available'}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEditProfile} style={[styles.actionButton, { marginRight: 24 }]}>
              <MaterialIcons name="edit" size={18} color="#007aff" />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.actionButton}>
              <Ionicons name="log-out-outline" size={18} color="#ff3b30" />
              <Text style={[styles.actionText, { color: '#ff3b30' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  defaultAvatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  username: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007aff',
    marginLeft: 8,
  },
});
