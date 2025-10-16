import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/upload'); // logged in → chat list
      } else {
        router.replace('/auth-screen'); // not logged in → auth screen
      }
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#555" />
      <Text style={{ marginTop: 12 }}>{loading ? 'Checking session...' : 'Redirecting...'}</Text>
    </View>
  );
}
