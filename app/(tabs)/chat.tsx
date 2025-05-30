import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../database/supabase';

const fakeUsers = [
  { id: '1', email: 'alice@example.com', name: 'Alice' },
  { id: '2', email: 'bob@example.com', name: 'Bob' },
  { id: '3', email: 'charlie@example.com', name: 'Charlie' },
];

export default function ChatListScreen() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [chatList, setChatList] = useState(fakeUsers);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Recherche dans la base, filtre résultats
  const handleSearch = async (text) => {
    setSearchText(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name')
      .ilike('email', `%${text}%`)
      .limit(10);

    if (error) {
      console.log('Erreur recherche utilisateur :', error.message);
      return;
    }

    // Exclure l'utilisateur connecté
    setResults(
      data
        ? data.filter((u) => u.id !== user?.id)
        : []
    );
  };

  // Démarrer chat, router vers page dynamique en passant id
  const handleStartChat = (userToChat) => {
    setShowSearch(false);
    setSearchText('');
    setResults([]);

    router.push(`/chatting/${userToChat.id}?name=${encodeURIComponent(userToChat.name || userToChat.email)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Conversations</Text>

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleStartChat(item)}
          >
            <Text style={styles.chatId}>ID: {item.id}</Text>
            <Text style={styles.chatName}>Nom: {item.name}</Text>
            <Text style={styles.chatEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => setShowSearch(true)}
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {showSearch && (
        <View style={styles.searchOverlay}>
          <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.searchTitle}>Nouvelle discussion</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Recherche par email..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => handleStartChat(item)}
                >
                  <Text style={styles.username}>{item.email} ({item.name || 'Sans nom'})</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>Aucun utilisateur trouvé</Text>}
              keyboardShouldPersistTaps="handled"
            />
            <TouchableOpacity
              style={styles.closeSearch}
              onPress={() => setShowSearch(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', paddingHorizontal: 20 },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 24,
    color: '#22223B',
    letterSpacing: -1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#22223B',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chatId: { fontSize: 14, fontWeight: '600', color: '#22223B' },
  chatName: { fontSize: 18, fontWeight: '700', color: '#22223B' },
  chatEmail: { fontSize: 14, color: '#9A8C98', marginTop: 4 },
  separator: { height: 12 },
  newChatButton: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#3A86FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  searchTitle: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  userItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  username: { fontSize: 16, color: '#22223B' },
  closeSearch: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
