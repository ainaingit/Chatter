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

const ChatListItem = ({ name, lastMessage, time, avatar, unread, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>
    <Image source={{ uri: avatar }} style={styles.avatar} />
    <View style={styles.textContainer}>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage || ''}</Text>
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    fetchChatList();
  }, []);

  const fetchChatList = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('conversations')
      .select('id, name, last_message, last_message_time, avatar_url, unread_count')
      .contains('participants', [user.id]); // Récupérer uniquement les conversations où l'utilisateur est participant

    if (error) {
      console.log('Erreur fetch chats :', error.message);
    } else {
      setChatList(data || []);
    }
  };

  // Rafraîchir la liste des chats à chaque changement d'user
  useEffect(() => {
    if (user) fetchChatList();
  }, [user]);

  const handleChatPress = (chatId) => {
    router.push('../../');
  };

  const handleSearch = async (text) => {
    setSearchText(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, avatar_url')
      .ilike('email', `%${text}%`)
      .limit(10);

    if (error) {
      console.log('Erreur recherche utilisateur :', error.message);
      return;
    }
    setResults(data.filter((u) => u.id !== user?.id)); // Exclure soi-même
  };

  const handleStartChat = async (userToChat) => {
    setShowSearch(false);
    setSearchText('');
    setResults([]);

    if (!user) return;

    // Vérifier si chat existant entre user et userToChat (exactement ces deux participants)
    const { data: existingChats, error } = await supabase
      .from('conversations')
      .select('id, participants')
      .contains('participants', [user.id, userToChat.id]);

    if (error) {
      console.log('Erreur récupération chat existant:', error.message);
      return;
    }

    let existingChat = null;
    if (existingChats && existingChats.length > 0) {
      existingChat = existingChats.find((chat) => {
        const participants = chat.participants || [];
        return (
          participants.length === 2 &&
          participants.includes(user.id) &&
          participants.includes(userToChat.id)
        );
      });
    }

    if (existingChat) {
      router.push(`../${existingChat.id}`);
    } else {
      // Créer un nouveau chat avec les deux participants
      const { data: newChat, error: insertError } = await supabase
        .from('conversations')
        .insert({
          participants: [user.id, userToChat.id],
          created_at: new Date().toISOString(),
          name: `${user.email} & ${userToChat.email}`, // Optionnel : générer un nom pour la conversation
          avatar_url: userToChat.avatar_url || null, // Optionnel : afficher avatar de l'autre participant
        })
        .select()
        .single();

      if (insertError) {
        console.log('Erreur création chat :', insertError.message);
        return;
      }

      router.push(`/${newChat.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>      Chats</Text>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatListItem
            name={item.name}
            lastMessage={item.last_message}
            time={item.last_message_time}
            avatar={item.avatar_url || 'https://via.placeholder.com/54'}
            unread={item.unread_count || 0}
            onPress={() => handleChatPress(item.id)}
          />
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
            <Text style={styles.searchTitle}>New Message</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by email..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => handleStartChat(item)}
                >
                  <Image
                    source={{ uri: item.avatar_url || 'https://via.placeholder.com/40' }}
                    style={styles.userAvatar}
                  />
                  <Text style={styles.username}>{item.email}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>No users found</Text>}
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
  textContainer: { flex: 1, justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { fontSize: 18, fontWeight: '600', color: '#22223B', flex: 1 },
  time: { fontSize: 13, color: '#9A8C98', marginLeft: 8 },
  lastMessage: { fontSize: 15, color: '#4A4E69', flex: 1, marginTop: 4 },
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
  unreadText: { color: '#fff', fontWeight: '700', fontSize: 13 },
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { fontSize: 16, color: '#22223B' },
  closeSearch: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
