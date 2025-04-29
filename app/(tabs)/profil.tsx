import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("Utilisateur non trouvé dans Firestore");
        }
      } catch (error) {
        console.error("Erreur récupération Firestore :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="account" style={styles.avatar} />
      <Text variant="titleLarge" style={styles.title}>
        Mon Profil
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nom complet :</Text>
        <Text>{userData?.fullName || "Non défini"}</Text>

        <Text style={styles.label}>Email :</Text>
        <Text>{userData?.email || "Non défini"}</Text>

        <Text style={styles.label}>Numéro :</Text>
        <Text>{userData?.phoneNumber || "Non défini"}</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => router.push("/EditProfile")}
        style={styles.button}
      >
        Modifier les informations
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatar: {
    marginBottom: 20,
    backgroundColor: "#6200ee",
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  infoBox: {
    width: "100%",
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
