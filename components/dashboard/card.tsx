import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Circle from "./circle";
import { LinearGradient } from "expo-linear-gradient";

export default function JobCard({ content }: any) {
  if (!content || content.length === 0) {
    return <Text style={styles.noData}>No vulnerabilities found</Text>;
  }

  // Function to determine card theme based on CVSS score
  const getThemeColors = (cvssScore: any) => {
    const score = parseFloat(cvssScore);

    if (score >= 7.0) {
      // High severity - Red theme
      return {
        gradientColors: ["#ff4d4d", "#990000"] as [string, string],
        headerGradient: ["#8B0000", "transparent"] as [string, string],
        buttonGradient: ["rgba(255, 77, 77, 0.3)", "#2a2a2a"] as [
          string,
          string
        ],
        cardBackground: "#3a2a2a",
        iconColor: "#ff4d4d",
        severity: "High",
      };
    } else if (score >= 4.0) {
      // Medium severity - Orange theme
      return {
        gradientColors: ["#ff9933", "#cc6600"] as [string, string],
        headerGradient: ["#7D4E00", "transparent"] as [string, string],
        buttonGradient: ["rgba(255, 153, 51, 0.3)", "#2a2a2a"] as [
          string,
          string
        ],
        cardBackground: "#3a2e2a",
        iconColor: "#ff9933",
        severity: "Medium",
      };
    } else {
      // Low severity - Yellow theme
      return {
        gradientColors: ["#ffcc00", "#998200"] as [string, string],
        headerGradient: ["#7A6800", "transparent"] as [string, string],
        buttonGradient: ["rgba(255, 204, 0, 0.3)", "#2a2a2a"] as [
          string,
          string
        ],
        cardBackground: "#35352a",
        iconColor: "#ffcc00",
        severity: "Low",
      };
    }
  };

  return (
    <ScrollView style={styles.container}>
      {content.map((item: any, index: number) => {
        const theme = getThemeColors(item.maxcvss);

        return (
          <View
            key={index}
            style={[
              styles.cardContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <LinearGradient
              colors={theme.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.severityBanner}
            >
              <Text style={styles.severityText}>{theme.severity} Severity</Text>
            </LinearGradient>

            <View style={styles.header}>
              <LinearGradient
                colors={theme.headerGradient}
                style={styles.iconContainer}
              >
                <Feather
                  name="alert-triangle"
                  size={16}
                  color={theme.iconColor}
                />
              </LinearGradient>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{item.cveid}</Text>
                <View style={styles.datesContainer}>
                  <Text style={styles.dateText}>
                    Published: {item.publisheddate}
                  </Text>
                  <Text style={styles.dateText}>
                    Updated: {item.updateddate}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.jobTitle}>
                {item.summary.slice(0, 60)}...
              </Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>EPSS Score</Text>
                    <Text style={styles.detailValue}>{item.epssscore}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Max CVSS</Text>
                    <Text
                      style={[styles.detailValue, { color: theme.iconColor }]}
                    >
                      {item.maxcvss}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sourceText}>{item.source}</Text>
              </View>

              <TouchableOpacity onPress={()=>{
                Linking.openURL(item.link);
              }} style={styles.applyButtonContainer}>
                <LinearGradient
                  colors={theme.buttonGradient}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradient}
                >
                  <Text
                    style={[styles.applyButtonText, { color: theme.iconColor }]}
                  >
                    View More
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    position: "relative",
  },
  severityBanner: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  severityText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  datesContainer: {
    flexDirection: "row",
    marginTop: 2,
    flexWrap: "wrap",
  },
  dateText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginRight: 12,
  },
  content: {
    padding: 16,
  },
  jobTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsContainer: {
    marginBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  sourceText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  applyButtonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  gradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  noData: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
