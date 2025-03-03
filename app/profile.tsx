import React, { useState, useEffect } from "react";
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
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut, Pencil } from "lucide-react-native";
import { FixedNavigationBar } from "@/components/dashboard/fixedNavigationBar";
import useAuthStore from "@/utils/store";
import { Redirect } from "expo-router";
import axios from "axios";

const ProfileScreen = () => {
  const {
    username,
    email,
    password,
    logout,
    updateEmail,
    updatePassword,
    updateUsername,
  } = useAuthStore();

  const [userData, setUserData] = useState({
    username: username ?? "",
    email: email ?? "",
    password: password ?? "",
  });

  // State for edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [tempEditValue, setTempEditValue] = useState(""); // Added for better control

  const profileImageUrl = "https://github.com/shadcn.png";

  // Update userData if store values change
  useEffect(() => {
    setUserData({
      username: username ?? "",
      email: email ?? "",
      password: password ?? "",
    });
  }, [username, email, password]);

  const handleEdit = (field: keyof typeof userData) => {
    const currentValue = userData[field] || "";
    setEditField(field);
    setEditValue(currentValue);
    setTempEditValue(currentValue);
    setIsEditing(true);
  };

  const handleChangeText = (text: string) => {
    setTempEditValue(text);
  };

  const saveEdit = async () => {
    try {
      // First update local state to provide immediate feedback
      setUserData((prevData) => ({
        ...prevData,
        [editField]: tempEditValue,
      }));

      // Close the modal
      setIsEditing(false);

      // Then make the API call
      await axios.put(
        "https://acs-hackathon-backend.onrender.com/update-user",
        {
          username: userData.username,
          [`new_${editField}`]: tempEditValue,
        }
      );

      // Update the global store
      if (editField === "username") {
        updateUsername(tempEditValue);
      } else if (editField === "email") {
        updateEmail(tempEditValue);
      } else if (editField === "password") {
        updatePassword(tempEditValue);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      // Revert to previous state if API call fails
      setUserData((prevData) => ({
        ...prevData,
        [editField]: editValue,
      }));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTempEditValue("");
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
                <Pencil color={"white"} size={20} />
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
                <Pencil color={"white"} size={20} />
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
                  {"•".repeat(userData?.password?.length || 0)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => handleEdit("password")}
              >
                <Pencil color={"white"} size={20} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => logout()}
            style={styles.logoutButton}
          >
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
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            cancelEdit();
          }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Edit {editField}</Text>

              <TextInput
                style={styles.input}
                value={tempEditValue}
                onChangeText={handleChangeText}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  editField === "email" ? "email-address" : "default"
                }
                secureTextEntry={editField === "password"}
                placeholderTextColor="#AAAAAA"
                autoFocus
                selectionColor="#A64AFF"
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
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <FixedNavigationBar />
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
    textTransform: "capitalize",
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
