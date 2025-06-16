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
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserProfile, updateUserProfile, uploadAvatar, deleteAccount } from '../../functions/profileFunctions';
import { handleLogout } from '../../functions/handleLogout'; // Assure-toi que handleLogout est bien exporté

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');

  const scaleAnim = new Animated.Value(0.8);
  const opacityAnim = new Animated.Value(0);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUserProfile();
      setProfile(data);
      setEditUsername(data?.username || '');
      setEditEmail(data?.email || '');
      setEditBio(data?.bio || '');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (isAvatarModalVisible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [isAvatarModalVisible]);

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(profile, editUsername, editEmail, editBio);
      Alert.alert('Succès', 'Profil mis à jour');
      setIsEditModalVisible(false);
      loadProfile();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleAvatarUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission requise', "Autorisez l'accès à la galerie");
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (pickerResult.canceled) return;

      const localUri = pickerResult.assets[0].uri;
      const filename = localUri.split('/').pop() || 'avatar.jpg';

      await uploadAvatar(localUri, filename);
      Alert.alert('Succès', 'Avatar mis à jour');
      setIsAvatarModalVisible(false);
      loadProfile();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Erreur lors de l'upload");
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      "Cette action est irréversible. Confirmer ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert('Compte supprimé');
              // TODO : redirection après suppression
            } catch (error: any) {
              Alert.alert('Erreur', error.message || 'Erreur lors de la suppression');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setIsAvatarModalVisible(true)} style={styles.avatarWrapper}>
              <Image source={avatarSource} style={styles.avatar} />
            </TouchableOpacity>

            <Text style={styles.name}>{profile?.username || 'Utilisateur'}</Text>
            <Text style={styles.email}>{profile?.email}</Text>
            <Text style={styles.bio}>{profile?.bio || 'Aucune bio disponible.'}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setIsEditModalVisible(true)} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color="#0a84ff" />
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmDeleteAccount} style={styles.logoutButton}>
                <Entypo name="trash" size={20} color="#ff3b30" />
                <Text style={styles.logoutText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bouton Déconnexion fixe en bas */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutBtnFixed} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutBtnText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Modal édition profil */}
        <Modal visible={isEditModalVisible} animationType="slide" transparent onRequestClose={() => setIsEditModalVisible(false)}>
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
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
              />

              <View style={styles.buttonsRow}>
                <Pressable style={[styles.button, styles.cancelButton]} onPress={() => setIsEditModalVisible(false)}>
                  <Text style={[styles.buttonText, { color: '#444' }]}>Annuler</Text>
                </Pressable>

                <Pressable style={[styles.button, styles.saveButton]} onPress={handleUpdateProfile}>
                  <Text style={[styles.buttonText, { color: '#fff' }]}>Enregistrer</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal avatar fullscreen + bouton changer */}
        <Modal
          visible={isAvatarModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAvatarModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsAvatarModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <Animated.Image
                source={avatarSource}
                style={[styles.fullscreenAvatar, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
              />
              <TouchableOpacity style={styles.changeAvatarButton} onPress={handleAvatarUpload}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
                <Text style={styles.changeAvatarText}>Changer la photo</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },

  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // centre verticalement la carte
    padding: 20,
    alignItems: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  avatarWrapper: {
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 15,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },

  fullscreenAvatar: {
    width: '90%',
    height: '65%',
    resizeMode: 'contain',
    borderRadius: 12,
  },

  name: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  email: { fontSize: 16, color: '#666', marginBottom: 12 },
  bio: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 20, textAlign: 'center' },

  actions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },

  editText: { color: '#0a84ff', marginLeft: 8, fontWeight: '600' },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },

  logoutText: { color: '#ff3b30', marginLeft: 8, fontWeight: '600' },

  logoutContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },

  logoutBtnFixed: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ff3b30',
  paddingVertical: 14,
  borderRadius: 30,
  width: '60%',  // <-- ici on limite la largeur à 80%
  alignSelf: 'center', // centre le bouton horizontalement
},

  logoutBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },

  label: { fontWeight: '600', marginTop: 10, marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },

  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  cancelButton: {
    backgroundColor: '#eee',
  },

  saveButton: {
    backgroundColor: '#0a84ff',
  },

  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  changeAvatarButton: {
    marginTop: 20,
    backgroundColor: '#0a84ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  changeAvatarText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
});
