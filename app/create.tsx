import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, X, ArrowRight, ChevronLeft } from "lucide-react-native";
import axios from "axios";
import { useNavigation } from "expo-router";
import ResponseModal from "@/components/create/responseModal";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type AnalysisOption = string;

const OPTIONS: AnalysisOption[] = [
  "HTTP Header",
  "Find Directories",
  "Exposed JS Files",
  "ASN",
  "Find Subdomain",
  "Find Web Technology",
  "Find Admin Panel",
  "Whois Information",
  "Port Scan",
  "TCP Scan",
  "UDP Scan",
  "External Links",
  "Banner Grab",
  "Subnet Lookup",
  "Reverse IP Lookup",
  "Geo-Location",
  "DNS Lookup",
  "Trace Route",
  "Firewall Detect",
  "Vulnerability Scan",
];

interface WebsiteAnalyzerScreenProps {
  // Add props as needed
}

// Main component
const WebsiteAnalyzerScreen: React.FC<WebsiteAnalyzerScreenProps> = () => {
  const navigation = useNavigation();

  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<AnalysisOption[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const buttonScale = useRef<Animated.Value>(new Animated.Value(1)).current;

  const [loading, setLoading] = useState<boolean>(false);
  const [responseContent, setResponseContent] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOptionSelect = (option: AnalysisOption): void => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else if (selectedOptions.length < 5) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  // Form submission handler
  const handleSubmit = async () => {
    setLoading(true);
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    axios
      .post("https://acs-hackathon-backend.onrender.com/generate-insights", {
        url: websiteUrl,
        options: selectedOptions,
      })
      .then((response) => {
        if (response.data && response.data.insights) {
          console.log(response.data.insights);
          setResponseContent(response.data.insights);
          setLoading(false);
          setModalVisible(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setResponseContent(
          "An error occurred while analyzing the website. Please try again."
        );
        setLoading(false);
        setModalVisible(true);
      });

    Keyboard.dismiss();
    console.log("Website URL:", websiteUrl);
    console.log("Selected options:", selectedOptions);
  };

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginRight: 13,
              padding: 5,
              borderRadius: 50,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Website Analyzer</Text>

            <Text style={styles.subtitle}>
              Analyze any website with custom parameters
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <LinearGradient
          colors={["rgba(147, 112, 219, 0.2)", "rgba(147, 112, 219, 0.05)"]}
          style={[
            styles.inputGradient,
            isFocused && styles.inputGradientFocused,
          ]}
        >
          <Link size={20} color="#9370DB" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter website URL"
            placeholderTextColor="#666"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor="#9370DB"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {websiteUrl.length > 0 && (
            <TouchableOpacity
              onPress={() => setWebsiteUrl("")}
              style={styles.clearButton}
            >
              <X size={16} color="#666" />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      <View style={styles.optionsSection}>
        <View style={styles.optionsHeader}>
          <Text style={styles.optionsTitle}>Select Analysis Options</Text>
          <Text style={styles.optionsSubtitle}>Choose up to 5 options</Text>
        </View>

        {showError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              You can select maximum 5 options
            </Text>
          </View>
        )}

        <View style={styles.selectedBadgesContainer}>
          {selectedOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.selectedBadge}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.selectedBadgeText}>{option}</Text>
              <X size={12} color="#fff" style={styles.badgeIcon} />
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.optionsList}>
          <View style={styles.optionsGrid}>
            {OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  selectedOptions.includes(option) && styles.optionItemSelected,
                ]}
                onPress={() => handleOptionSelect(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ scale: buttonScale }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!websiteUrl || selectedOptions.length === 0 || loading) &&
              styles.analyzeButtonDisabled,
            animatedStyle,
          ]}
          onPress={handleSubmit}
          disabled={!websiteUrl || selectedOptions.length === 0 || loading}
        >
          <LinearGradient
            colors={["#9370DB", "#8A2BE2"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator
                color="#fff"
                size="small"
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text style={styles.buttonText}>
              {loading ? "Analyzing..." : "Analyze Website"}
            </Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <ResponseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        content={responseContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputGradientFocused: {
    borderColor: "#9370DB", // Custom purple border when focused instead of default white
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 60,
    color: "#fff",
    fontSize: 16,
    outline: "none",
  },
  clearButton: {
    padding: 5,
  },
  optionsSection: {
    flex: 1,
  },
  optionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  optionsSubtitle: {
    fontSize: 14,
    color: "#9370DB",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
  },
  selectedBadgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9370DB",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedBadgeText: {
    color: "#fff",
    fontSize: 14,
  },
  badgeIcon: {
    marginLeft: 5,
  },
  optionsList: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  optionItemSelected: {
    backgroundColor: "rgba(147, 112, 219, 0.2)",
    borderWidth: 1,
    borderColor: "#9370DB",
  },
  optionText: {
    color: "#ccc",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  analyzeButton: {
    borderRadius: 30,
    overflow: "hidden",
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default WebsiteAnalyzerScreen;
