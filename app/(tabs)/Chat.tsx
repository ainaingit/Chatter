import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";

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
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
              <Text style={styles.backText}>⬅</Text>
            </TouchableOpacity>
            <Text style={styles.chatTitle}>Discussion avec {selectedUser.name}</Text>
          </View>

          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{item}</Text>
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
            style={styles.messagesContainer}
          />

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Tape ton message"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold" },
  plusButton: { padding: 8 },
  plusText: { fontSize: 24, color: "#007AFF" },
  userItem: { padding: 12, borderBottomColor: "#ddd", borderBottomWidth: 1 },
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
  chatHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#075e54", 
    padding: 10 
  },
  backButton: { padding: 8 },
  backText: { fontSize: 20, color: "#fff" },
  chatTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
  messageBubble: {
    backgroundColor: "#dcf8c6", 
    padding: 12, 
    marginVertical: 4, 
    borderRadius: 20, 
    alignSelf: "flex-start", 
    maxWidth: "80%" 
  },
  messageText: { fontSize: 16 },
  messagesContainer: { paddingBottom: 60 },
  inputContainer: { 
    flexDirection: "row", 
    padding: 10, 
    backgroundColor: "#fff", 
    alignItems: "center" 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 25, 
    padding: 12 
  },
  sendButton: { 
    backgroundColor: "#007AFF", 
    borderRadius: 25, 
    padding: 12, 
    marginLeft: 10 
  },
  sendText: { color: "#fff", fontWeight: "bold" },
});
