import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // npm install @react-native-async-storage/async-storage
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = '@custom_ads';

const updates = [
  {
    title: "🎉 Welcome to Chatter v2.0!",
    description: "We've redesigned the app for a smoother, faster experience. Enjoy the new look and feel!",
    date: "2024-06-10",
  },
  {
    title: "🆕 Group Chats",
    description: "Now you can create and join group chats with your friends. Try it out from the Chats tab!",
    date: "2024-06-08",
  },
  {
    title: "🔒 Enhanced Privacy",
    description: "Your conversations are now end-to-end encrypted by default.",
    date: "2024-06-05",
  },
];

export default function HomeScreen() {
  const [ads, setAds] = useState([]); // pubs sauvegardées
  const [modalVisible, setModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [dateInput, setDateInput] = useState('');

  // Charger les pubs au démarrage
  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setAds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erreur chargement pubs", e);
    }
  }

  async function saveAd(newAd) {
    try {
      const updatedAds = [newAd, ...ads];
      setAds(updatedAds);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAds));
    } catch (e) {
      console.error("Erreur sauvegarde pub", e);
    }
  }

  function onAddPress() {
    // Validation simple
    if (!titleInput.trim() || !descInput.trim() || !dateInput.trim()) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs');
      return;
    }
    const newAd = {
      title: titleInput,
      description: descInput,
      date: dateInput,
    };
    saveAd(newAd);
    setTitleInput('');
    setDescInput('');
    setDateInput('');
    setModalVisible(false);
  }

  // Combine updates + pubs ajoutées
  const allUpdates = [...ads, ...updates];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="chatbubbles" size={36} color="#4F8EF7" />
          <Text style={styles.title}>Chatter Updates</Text>
        </View>
        <Text style={styles.subtitle}>
          Stay up to date with the latest features and improvements!
        </Text>

        <View style={styles.updatesSection}>
          {allUpdates.map((update, idx) => (
            <View key={idx} style={styles.updateCard}>
              <Text style={styles.updateTitle}>{update.title}</Text>
              <Text style={styles.updateDesc}>{update.description}</Text>
              <View style={styles.updateFooter}>
                <MaterialCommunityIcons name="calendar" size={16} color="#888" />
                <Text style={styles.updateDate}>{update.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bouton pour ouvrir modal */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Ajouter une pub</Text>
        </TouchableOpacity>

        {/* Modal d'ajout */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nouvelle pub</Text>

              <TextInput
                placeholder="Titre"
                style={styles.input}
                value={titleInput}
                onChangeText={setTitleInput}
              />
              <TextInput
                placeholder="Description"
                style={[styles.input, { height: 80 }]}
                value={descInput}
                onChangeText={setDescInput}
                multiline
              />
              <TextInput
                placeholder="Date (YYYY-MM-DD)"
                style={styles.input}
                value={dateInput}
                onChangeText={setDateInput}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#aaa' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#4F8EF7' }]}
                  onPress={onAddPress}
                >
                  <Text style={{ color: '#fff' }}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 12,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  updatesSection: {
    marginBottom: 32,
  },
  updateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  updateDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  updateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateDate: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
  },
  feedbackButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
