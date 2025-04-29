import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Button, Avatar, Snackbar } from "react-native-paper";
import { auth, db, storage } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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

  const handlePhotoUpload = async () => {
    try {
      // Demande de permission pour accéder à la galerie d'images
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Désolé, permission refusée pour accéder à vos photos !");
        return;
      }

      // Lancer la sélection d'image depuis la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, // Sélection uniquement d'images
        allowsEditing: true,
        aspect: [4, 4], // Ratio de l'image
        quality: 1, // Qualité maximale de l'image
      });

      console.log(result); // Log du résultat de l'image choisie

      // Vérifier que l'utilisateur a sélectionné une image
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;

        // Convertir l'image en blob
        const response = await fetch(uri);
        const blob = await response.blob();

        // Créer une référence dans Firebase Storage pour l'upload de l'image
        const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);

        // Créer une tâche d'upload de l'image
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Erreur d'upload :", error);
            setErrorMessage("Erreur lors de l'upload de l'image.");
          },
          async () => {
            // Une fois l'upload terminé, obtenir l'URL de téléchargement de l'image
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Mettre à jour la photo de profil dans Firestore
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
              photoUrl: downloadURL,
            });

            // Mettre à jour les données de l'utilisateur dans le state
            setUserData((prevData) => ({
              ...prevData,
              photoUrl: downloadURL,
            }));

            setSuccessMessage("Photo mise à jour avec succès !");
          }
        );
      }
    } catch (err) {
      console.error("Erreur traitement image :", err);
      setErrorMessage("Erreur traitement image.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const creationDate = userData?.createdAt?.toDate().toLocaleDateString() || "Non défini";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {userData?.photoUrl ? (
          <Avatar.Image size={100} source={{ uri: userData.photoUrl }} />
        ) : (
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        )}
        {!userData?.photoUrl && (
          <Button
            icon="camera"
            mode="contained"
            onPress={handlePhotoUpload}
            style={styles.uploadButton}
          >
            Ajouter une photo
          </Button>
        )}
      </View>

      <Text variant="titleLarge" style={styles.title}>
        {userData?.fullName || "Nom complet non défini"}
      </Text>

      <View style={styles.bioBox}>
        <Text style={styles.label}>Bio :</Text>
        <Text>{userData?.bio || "Aucune bio disponible"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email :</Text>
        <Text>{userData?.email || "Non défini"}</Text>

        <Text style={styles.label}>Numéro :</Text>
        <Text>{userData?.phoneNumber || "Non défini"}</Text>

        <Text style={styles.label}>Membre depuis :</Text>
        <Text>{creationDate}</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => router.push("../editprofil")}
        style={styles.button}
      >
        Modifier les informations
      </Button>

      <Snackbar
        visible={!!successMessage}
        onDismiss={() => setSuccessMessage("")}
        duration={3000}
        style={{ backgroundColor: "green" }}
      >
        {successMessage}
      </Snackbar>

      <Snackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage("")}
        duration={3000}
        style={{ backgroundColor: "red" }}
      >
        {errorMessage}
      </Snackbar>
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#6200ee",
  },
  uploadButton: {
    marginTop: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  bioBox: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
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
    color: "#555",
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
