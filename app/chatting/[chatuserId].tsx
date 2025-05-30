import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ChatUserScreen() {
  const { chatuserId, name } = useLocalSearchParams();

  const [messages, setMessages] = useState([
    { id: '1', text: 'Salut !', fromMe: false },
    { id: '2', text: 'Salut, ça va ?', fromMe: true },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: inputText.trim(), fromMe: true },
    ]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{name} (ID: {chatuserId})</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.fromMe ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={{ color: item.fromMe ? '#fff' : '#000' }}>{item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Envoyer</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    backgroundColor: '#3A86FF',
    padding: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  myMessage: {
    backgroundColor: '#3A86FF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: '#EAEAEA',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#3A86FF',
    borderRadius: 24,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
