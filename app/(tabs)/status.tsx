import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";

// Données fictives pour les statuts et histoires
const statusData = [
    { id: '1', name: 'Jean Dupont', image: 'https://placeimg.com/100/100/people', status: 'Je suis en vacances!' },
    { id: '2', name: 'Marie Martin', image: 'https://placeimg.com/100/100/people', status: 'Disponible pour un café!' },
    { id: '3', name: 'Paul Lefevre', image: 'https://placeimg.com/100/100/people', status: 'Je travaille sur un projet.' },
];

export default function Status() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Statuts & Histoires</Text>
            
            <FlatList
                data={statusData}
                renderItem={({ item }) => (
                    <View style={styles.statusContainer}>
                        <Image source={{ uri: item.image }} style={styles.profileImage} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.status}>{item.status}</Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.list}
            />
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Ajouter un statut</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 20,
    },
    header: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        color: '#bbb',
    },
    list: {
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#34b7f1',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
