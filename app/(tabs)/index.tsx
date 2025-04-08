import React from "react";

import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';  // Importation de Link

export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to the Index Page!</Text>
        </View>
    );
}