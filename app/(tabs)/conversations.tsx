import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  getCurrentUserId,
  fetchUserConversations,
  searchUsersBySurname,
  getPrivateConversationBetweenUsers,
} from '../../functions/fetchConversations';

export default function ConversationsScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        console.error("UUID non trouvé dans SecureStore.");
        setLoading(false);
        return;
      }
      const data = await fetchUserConversations(currentUserId);
      setConversations(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const goToChat = (conversationId: string) => {
    router.push(`../chat/${conversationId}`);
  };

  const searchUsers = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = await searchUsersBySurname(term);
    setSearchResults(results);
  };

  const startConversationWith = async (otherUserId: string) => {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      console.error("UUID non trouvé dans SecureStore.");
      return;
    }

    // Vérifie si une conversation privée existe déjà
    const existingConversations = await getPrivateConversationBetweenUsers(
      currentUserId,
      otherUserId
    );

    if (existingConversations.length > 0) {
      const existingId = existingConversations[0].id;
      router.push(`../chat/${existingId}`);
      setModalVisible(false);
      return;
    }

    // Crée une nouvelle conversation privée
    try {
      const newConversationResponse = await fetch(
        '/api/createPrivateConversation', // À adapter si tu as une API ou à faire en direct ici
        {
          method: 'POST',
          body: JSON.stringify({ currentUserId, otherUserId }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const newConversation = await newConversationResponse.json();

      if (!newConversation?.id) throw new Error('Création de conversation échouée');

      router.push(`../chat/${newConversation.id}`);
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur création conversation:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Mes Conversations</Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#4f8cff" />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => goToChat(item.id)}
              >
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.type}>
                  {item.is_group ? 'Groupe' : 'Privée'}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Rechercher un utilisateur</Text>
              <TextInput
                placeholder="Entrer un nom"
                value={searchTerm}
                onChangeText={searchUsers}
                style={styles.searchInput}
              />
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => startConversationWith(item.id)}
                    style={styles.searchResultItem}
                  >
                    <Text style={styles.searchResultText}>{item.surname}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: 'red', textAlign: 'center' }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  type: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 32,
    color: '#4f8cff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  searchResultItem: {
    paddingVertical: 10,
  },
  searchResultText: {
    fontSize: 16,
  },
});
