import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

// Données simulées (à remplacer plus tard avec Firebase ou une API)
const mockStatuses = [
  { id: "1", text: "En ligne" },
  { id: "2", text: "Disponible pour discuter" },
  { id: "3", text: "En réunion" },
];

export default function StatusScreen() {
  const [currentStatus, setCurrentStatus] = useState("Disponible");
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState(mockStatuses);

  const updateStatus = () => {
    if (newStatus.trim() === "") return;
    const updatedStatuses = [{ id: `${statuses.length + 1}`, text: newStatus }, ...statuses];
    setStatuses(updatedStatuses);
    setCurrentStatus(newStatus);
    setNewStatus("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mettre à jour le statut</Text>
      </View>

      {/* Affichage du statut actuel */}
      <View style={styles.currentStatusContainer}>
        <Text style={styles.currentStatusText}>Statut actuel: {currentStatus}</Text>
      </View>

      {/* Champ de texte pour entrer un nouveau statut */}
      <TextInput
        style={styles.input}
        placeholder="Mettre à jour votre statut"
        value={newStatus}
        onChangeText={setNewStatus}
      />
      <TouchableOpacity style={styles.updateButton} onPress={updateStatus}>
        <Text style={styles.updateButtonText}>Mettre à jour</Text>
      </TouchableOpacity>

      {/* Liste des anciens statuts */}
      <View style={styles.statusListContainer}>
        <Text style={styles.statusListTitle}>Historique des statuts</Text>
        <FlatList
          data={statuses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.statusItem}>
              <Text style={styles.statusText}>{item.text}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#075e54" },
  currentStatusContainer: { marginBottom: 16 },
  currentStatusText: { fontSize: 18, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: "#075e54",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  updateButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  statusListContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    elevation: 2,
  },
  statusListTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  statusItem: {
    paddingVertical: 8,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  statusText: { fontSize: 16, color: "#333" },
});
