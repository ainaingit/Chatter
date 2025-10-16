import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
};

export default function UploadScreen() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf", "video/mp4"],
      multiple: true,
    });

    if (result.canceled) return;

    const newFiles = result.assets.map((file) => ({
      name: file.name,
      size: file.size ?? 0,
      type: file.mimeType ?? "unknown",
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => simulateUpload(file.name));
  };

  const simulateUpload = (fileName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setFiles((prev) =>
        prev.map((f) =>
          f.name === fileName
            ? {
                ...f,
                progress,
                status: progress >= 1 ? "completed" : "uploading",
              }
            : f
        )
      );
      if (progress >= 1) clearInterval(interval);
    }, 300);
  };

  const handleRemove = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload files</Text>
      <Text style={styles.subtitle}>Select and upload the files of your choice</Text>

      <TouchableOpacity style={styles.dropzone} onPress={handlePickFile}>
        <Ionicons name="cloud-upload-outline" size={40} color="#999" />
        <Text style={styles.dropText}>Choose a file or drag & drop it here</Text>
        <Text style={styles.fileTypes}>JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</Text>
      </TouchableOpacity>

      {files.map((file, index) => (
        <View key={index} style={styles.fileItem}>
          <Ionicons name="document-text-outline" size={24} color="#e74c3c" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.fileName}>{file.name}</Text>
            <Text style={styles.fileInfo}>
              {Math.round(file.size / 1024)} KB{" "}
              {file.status === "uploading" ? "• Uploading..." : "• Completed"}
            </Text>
            <Progress.Bar
              progress={file.progress}
              width={null}
              color={file.status === "completed" ? "#27ae60" : "#3498db"}
              style={styles.progressBar}
            />
          </View>
          <TouchableOpacity onPress={() => handleRemove(file.name)}>
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.orContainer}>
        <Text style={styles.orText}>OR</Text>
      </View>

      <View style={styles.urlBox}>
        <Ionicons name="link-outline" size={20} color="#999" />
        <Text style={styles.urlText}>Import from URL Link</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#777",
    marginBottom: 16,
  },
  dropzone: {
    borderWidth: 2,
    borderColor: "#eee",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  dropText: {
    fontSize: 16,
    marginTop: 8,
    color: "#555",
  },
  fileTypes: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  fileName: {
    fontWeight: "600",
    color: "#333",
  },
  fileInfo: {
    color: "#777",
    fontSize: 12,
  },
  progressBar: {
    marginTop: 5,
    height: 6,
    borderRadius: 3,
  },
  orContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  orText: {
    color: "#aaa",
    fontWeight: "600",
  },
  urlBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  urlText: {
    marginLeft: 8,
    color: "#888",
  },
});
