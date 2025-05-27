import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { handleLogout } from '../../functions/handleLogout';
import { supabase } from '../../database/supabase';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  const fetchProfile = async () => {
    try {
      const uuid = await SecureStore.getItemAsync('user_uuid');
      if (!uuid) throw new Error('UUID not found in secure store');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, email, avatar_url')
        .eq('id', uuid)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    alert('Edit profile clicked!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#007aff" />
      </SafeAreaView>
    );
  }

  const avatarSource = profile?.avatar_url
    ? { uri: profile.avatar_url }
    : require('../../assets/default-avatar.jpg');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => setIsAvatarModalVisible(true)}>
            <Image source={avatarSource} style={styles.avatar} />
          </TouchableOpacity>

          <Text style={styles.name}>{profile?.username || 'Unnamed User'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          <Text style={styles.bio}>{profile?.bio || 'No bio available.'}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
              <MaterialIcons name="edit" size={18} color="#007aff" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={18} color="#ff3b30" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Avatar full screen modal */}
      <Modal
        visible={isAvatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAvatarModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsAvatarModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Image source={avatarSource} style={styles.fullscreenAvatar} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  container: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 16,
    color: '#007aff',
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff3b30',
    marginLeft: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenAvatar: {
    width: 300,
    height: 300,
    borderRadius: 150,
    resizeMode: 'cover',
  },
});
