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
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { handleLogout } from '../../functions/handleLogout';
import { supabase } from '../../database/supabase';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Champs d'édition
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const uuid = await SecureStore.getItemAsync('user_uuid');
      if (!uuid) throw new Error('UUID not found in secure store');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, email, avatar_url')
        .eq('id', uuid)
        .single();

      if (error) throw error;
      setProfile(data);

      setEditUsername(data?.username || '');
      setEditEmail(data?.email || '');
      setEditBio(data?.bio || '');
    } catch (err: any) {
      console.error('Error loading profile:', err);
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      const uuid = await SecureStore.getItemAsync('user_uuid');
      if (!uuid) throw new Error('UUID not found in secure store');

      const updates: any = { id: uuid };
      if (editUsername !== profile?.username) updates.username = editUsername;
      if (editEmail !== profile?.email) updates.email = editEmail;
      if (editBio !== profile?.bio) updates.bio = editBio;

      if (Object.keys(updates).length === 1) {
        Alert.alert('Aucune modification détectée');
        return;
      }

      updates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { returning: 'minimal' });

      if (error) throw error;

      Alert.alert('Succès', 'Profil mis à jour avec succès');
      setIsEditModalVisible(false);
      fetchProfile();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      Alert.alert('Erreur', err.message);
    }
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsAvatarModalVisible(true)}
            style={styles.avatarWrapper}
          >
            <Image source={avatarSource} style={styles.avatar} />
          </TouchableOpacity>

          <Text style={styles.name}>{profile?.username || 'Unnamed User'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          <Text style={styles.bio}>{profile?.bio || 'No bio available.'}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(true)}
              style={styles.editButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={20} color="#0a84ff" />
              <Text style={styles.editText}>Modifier le profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal d'édition */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>

            <Text style={styles.label}>Nom d’utilisateur</Text>
            <TextInput
              style={styles.input}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="Nom d’utilisateur"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Bio"
              multiline={true}
              numberOfLines={4}
              placeholderTextColor="#999"
            />

            <View style={styles.buttonsRow}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: '#444' }]}>Annuler</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.saveButton]} onPress={updateProfile}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // CENTRAGE VERTICAL
    alignItems: 'center',     // CENTRAGE HORIZONTAL
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    // Ombre douce
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  avatarWrapper: {
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#0a84ff',
    padding: 3,
    marginBottom: 18,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 14,
  },
  bio: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#0a84ff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  editText: {
    marginLeft: 8,
    color: '#0a84ff',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#ff3b30',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  logoutText: {
    marginLeft: 8,
    color: '#ff3b30',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    color: '#111',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111',
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 28,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#0a84ff',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 15,
  },

  fullscreenAvatar: {
    width: '90%',
    height: '70%',
    borderRadius: 20,
    resizeMode: 'contain',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
