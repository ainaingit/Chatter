import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

// Données simulées (à remplacer plus tard avec Firebase ou une API)
const mockUsers = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function ChatScreen() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const sendMessage = () => {
    if (message.trim() === "") return;
    setMessages([...messages, message]);
    setMessage("");
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Pas encore de destinataire sélectionné */}
      {!selectedUser ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Discussions</Text>
            <TouchableOpacity onPress={() => setSearchMode(true)} style={styles.plusButton}>
              <Text style={styles.plusText}>＋</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockUsers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedUser(item)} style={styles.userItem}>
                <Text style={styles.userName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Mode recherche pour démarrer une nouvelle discussion */}
          {searchMode && (
            <View style={styles.searchSection}>
              <TextInput
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedUser(item);
                      setSearchMode(false);
                    }}
                    style={styles.userItem}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Fermer" onPress={() => setSearchMode(false)} />
            </View>
          )}
        </>
      ) : (
        // Interface de chat
        <>
          <Text style={styles.title}>Discussion avec {selectedUser.name}</Text>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <Text style={styles.messageBubble}>{item}</Text>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Tape ton message"
          />
          <Button title="Envoyer" onPress={sendMessage} />
          <Button title="⬅ Retour" onPress={() => setSelectedUser(null)} color="gray" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  plusButton: { padding: 8 },
  plusText: { fontSize: 24, color: "#007AFF" },
  userItem: {
    padding: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  userName: { fontSize: 16 },
  searchSection: {
    marginTop: 16,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  messageBubble: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 10,
    borderRadius: 4,
  },
});
