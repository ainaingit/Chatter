// ChatListScreen.tsx – Liste des discussions
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../database/supabase';

// Composant représentant un élément de la liste de chats
const ChatListItem = ({ name, lastMessage, time, avatar, unread, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>
    <Image source={{ uri: avatar }} style={styles.avatar} />
    <View style={styles.textContainer}>
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
        {unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function ChatListScreen() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    fetchChatList();
  }, []);

  // Récupération des conversations depuis la vue Supabase
  const fetchChatList = async () => {
    const { data, error } = await supabase.from('chats_view').select('*');
    if (!error) setChatList(data);
  };

  // Redirige vers l'écran de chat
  const handleChatPress = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  const handleSearch = async (text) => {
    setSearchText(text);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${text}%`);

    if (error) {
      console.log('Erreur lors de la recherche :', error.message);
      return;
    }

    setResults(data);
  };

  // Démarrer une nouvelle discussion avec un utilisateur
  const handleStartChat = async (user) => {
    setShowSearch(false);
    setSearchText('');
    setResults([]);

    const { data: existingChat } = await supabase
      .from('chats')
      .select('*')
      .eq('participant_id', user.id)
      .maybeSingle();

    if (existingChat) {
      router.push(`/chat/${existingChat.id}`);
    } else {
      const { data: newChat } = await supabase
        .from('chats')
        .insert({ participant_id: user.id })
        .select()
        .single();

      router.push(`/chat/${newChat.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            name={item.name}
            lastMessage={item.lastMessage}
            time={item.time}
            avatar={item.avatar_url}
            unread={item.unread_count || 0}
            onPress={() => handleChatPress(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton pour créer un nouveau chat */}
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => setShowSearch(true)}
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Interface de recherche d'utilisateur */}
      {showSearch && (
        <View style={styles.searchOverlay}>
          <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.searchTitle}>New Message</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by email..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
            />
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => handleStartChat(item)}
                >
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={styles.userAvatar}
                  />
                  <Text style={styles.username}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeSearch}
              onPress={() => setShowSearch(false)}
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
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 24,
    color: '#22223B',
    letterSpacing: -1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#22223B',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22223B',
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: '#9A8C98',
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 15,
    color: '#4A4E69',
    flex: 1,
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: '#3A86FF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  separator: {
    height: 12,
  },
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
    backgroundColor: '#ffffffee',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: '#333',
  },
  closeSearch: {
    position: 'absolute',
    top: 16,
    right: 20,
  },
});
