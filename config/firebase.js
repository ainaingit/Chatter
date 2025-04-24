import Constants from "expo-constants"; // ✅ pas avec des { }
import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const extra = Constants?.expoConfig?.extra ?? {}; // ✅ Plus sûr que manifest

const firebaseConfig = {
  apiKey: extra.apiKey,
  authDomain: extra.authDomain,
  projectId: extra.projectId,
  storageBucket: extra.storageBucket,
  messagingSenderId: extra.messagingSenderId,
  appId: extra.appId,
  databaseURL: extra.databaseURL,
  measurementId: extra.measurementId,
};

const app = initializeApp(firebaseConfig);

// Initialisation de l'auth avec la persistance
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export { auth }; // Exporte auth
