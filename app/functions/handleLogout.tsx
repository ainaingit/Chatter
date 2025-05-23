import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export async function handleLogout() {
    try {
        await SecureStore.deleteItemAsync('user_connected');
        Alert.alert('Disconnected', 'You have been disconnected.', [
            {
                text: 'OK',
                onPress: () => router.replace('/'),
            },
        ]);
    } catch (error) {
        Alert.alert('Error', 'Failed to logout. Please try again.');
    }
}