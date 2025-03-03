import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pencil } from "lucide-react-native";

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    username: "johndoe",
    email: "john.doe@example.com",
    password: "March 2023",
  });

  // State for edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  const profileImageUrl = "https://github.com/shadcn.png";

  const handleEdit = (field: keyof typeof userData) => {
    setEditField(field);
    setEditValue(userData[field]);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setUserData({
      ...userData,
      [editField]: editValue,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileUsername}>@{userData.username}</Text>
            <Text style={styles.profileJoinDate}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <LinearGradient
            colors={["rgba(114, 59, 241, 0.4)", "rgba(114, 59, 241, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{userData.username}</Text>
              </View>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => handleEdit("username")}
              >
                <Text>
                  <Pencil color={"white"} size={50} />
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(114, 59, 241, 0.4)", "rgba(114, 59, 241, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => handleEdit("email")}
              >
                <Text>
                  <Pencil color={"white"} size={50} />
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(114, 59, 241, 0.4)", "rgba(114, 59, 241, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Password</Text>
                <Text style={styles.infoValue}>
                  {"•".repeat(userData.password.length)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => handleEdit("password")}
              >
                <Text>
                  <Pencil color={"white"} size={50} />
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        transparent={true}
        visible={isEditing}
        animationType="fade"
        onRequestClose={cancelEdit}
      >
        <TouchableWithoutFeedback onPress={cancelEdit}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Edit {editField === "username" ? "Username" : "Email"}
                </Text>

                <TextInput
                  style={styles.input}
                  value={editValue}
                  onChangeText={setEditValue}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#AAAAAA"
                  secureTextEntry={editField === "password"}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={cancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={saveEdit}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#A64AFF",
    fontSize: 36,
    fontWeight: "bold",
    paddingVertical: 40,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#A64AFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileUsername: {
    color: "#A64AFF",
    fontSize: 16,
    marginBottom: 4,
  },
  profileJoinDate: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 20,
  },
  infoCard: {
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "#AAAAAA",
    fontSize: 14,
    marginBottom: 8,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  editIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(166, 74, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  settingCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  settingToggle: {
    width: 50,
    height: 24,
    backgroundColor: "#2E2E2E",
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    width: 20,
    height: 20,
    backgroundColor: "#A64AFF",
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 74, 74, 0.2)",
    borderWidth: 1,
    borderColor: "#FF4A4A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#A64AFF",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#444444",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#2A2A2A",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#A64AFF",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileScreen;
