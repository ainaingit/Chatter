import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotFoundPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>404</Text>
            <Text style={styles.message}>Page Not Found</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#343a40',
    },
    message: {
        fontSize: 18,
        color: '#6c757d',
        marginTop: 10,
    },
});

export default NotFoundPage;