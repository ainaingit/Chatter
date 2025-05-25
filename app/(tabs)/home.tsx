import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
                    {updates.map((update, idx) => (
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
                <TouchableOpacity style={styles.feedbackButton}>
                    <Text style={styles.feedbackText}>Send Feedback</Text>
                </TouchableOpacity>
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
});