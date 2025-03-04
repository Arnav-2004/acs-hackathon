import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { LinearGradient } from "expo-linear-gradient";

interface ResponseModalProps {
  visible: boolean;
  onClose: () => void;
  content: string;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  visible,
  onClose,
  content,
}) => {
  const { width, height } = Dimensions.get("window");

  const markdownStyles = {
    body: {
      color: "#fff",
      fontSize: 16,
      lineHeight: 24,
      padding: 10, // Add padding to ensure content isn't cut off at edges
    },
    heading1: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 10,
    },
    heading2: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 8,
    },
    heading3: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 6,
    },
    paragraph: {
      color: "#fff",
      marginVertical: 8,
    },
    list_item: {
      color: "#fff",
      marginVertical: 4,
      flexDirection: "row",
      flexWrap: "wrap", // Ensure list items can wrap
    },
    bullet_list: {
      marginLeft: 20,
    },
    ordered_list: {
      marginLeft: 20,
    },
    em: {
      fontStyle: "italic" as "italic",
      color: "#ccc",
    },
    link: {
      color: "#9370DB",
      textDecorationLine: "underline" as "underline",
    },
    code_inline: {
      backgroundColor: "rgba(147, 112, 219, 0.2)",
      color: "#E6E6FA",
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    },
    code_block: {
      backgroundColor: "rgba(147, 112, 219, 0.1)",
      padding: 10,
      borderRadius: 8,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      marginVertical: 10,
    },
    fence: {
      backgroundColor: "rgba(147, 112, 219, 0.1)",
      padding: 10,
      borderRadius: 8,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      marginVertical: 10,
      overflow: "scroll", // Allow scrolling for long code blocks
    },
    blockquote: {
      backgroundColor: "rgba(147, 112, 219, 0.05)",
      borderLeftWidth: 4,
      borderLeftColor: "#9370DB",
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginVertical: 10,
    },
    hr: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      height: 1,
      marginVertical: 16,
    },
    table: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      marginVertical: 10,
      width: "100%", // Ensure tables take full width
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      flexDirection: "row",
    },
    th: {
      padding: 10,
      backgroundColor: "rgba(147, 112, 219, 0.2)",
      flex: 1, // Distribute space evenly
    },
    td: {
      padding: 10,
      flex: 1, // Distribute space evenly
    },
    text: {
      color: "#fff", // Ensure all text is visible
    },
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: height * 0.85 }]}>
            <LinearGradient
              colors={["#1E1E1E", "#121212"]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Analysis Results</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={[
                  "rgba(147, 112, 219, 0.2)",
                  "rgba(147, 112, 219, 0.05)",
                ]}
                style={styles.divider}
              />
              <ScrollView
                style={styles.contentScrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={true}
                indicatorStyle="white"
              >
                <Markdown style={markdownStyles}>{content}</Markdown>
                {/* Add padding at the bottom to ensure last content is visible */}
                <View style={{ height: 30 }} />
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 15, // Add padding to avoid edges
  },
  modalContent: {
    width: "95%",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 20,
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 8, // Increased touch target
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  divider: {
    height: 2,
    marginBottom: 15,
  },
  contentScrollView: {
    maxHeight: "80%", // Increased height since button is removed
  },
  scrollViewContent: {
    paddingBottom: 10, // Increased padding at the bottom
  },
});

export default ResponseModal;
