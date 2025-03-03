import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_300Light,
} from "@expo-google-fonts/inter";

const { width } = Dimensions.get("window");

// Type definition for CVE data
interface CVE {
  cveid: string;
  epssscore: string;
  maxcvss: string;
  publisheddate: string;
  source: string;
  summary: string;
  updateddate: string;
}

// Type definition for vulnerability category data
interface VulnerabilityCategory {
  name: string;
  count: number;
  color: string;
}

interface VulnerabilitiesByTypeChartProps {
  cves?: CVE[];
}

export const VulnerabilitiesByTypeChart = ({
  cves,
}: VulnerabilitiesByTypeChartProps) => {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_300Light,
  });

  // Predefined vulnerability types to look for in CVE summaries
  const vulnerabilityTypes = [
    {
      name: "Overflow",
      keywords: ["overflow", "buffer overflow"],
      color: "#0096C7",
    },
    {
      name: "Memory corruption",
      keywords: ["memory corruption", "memory leak"],
      color: "#FFA069",
    },
    {
      name: "SQL injection",
      keywords: ["sql injection", "sqli"],
      color: "#00B4A6",
    },
    {
      name: "XSS",
      keywords: ["xss", "cross site scripting", "cross-site scripting"],
      color: "#5A7CA5",
    },
    {
      name: "Directory traversal",
      keywords: ["directory traversal", "path traversal"],
      color: "#007F80",
    },
    {
      name: "File inclusion",
      keywords: ["file inclusion", "lfi", "rfi"],
      color: "#ECC94B",
    },
    {
      name: "CSRF",
      keywords: [
        "csrf",
        "cross site request forgery",
        "cross-site request forgery",
      ],
      color: "#009473",
    },
    { name: "XXE", keywords: ["xxe", "xml external entity"], color: "#FF8A50" },
    {
      name: "SSRF",
      keywords: [
        "ssrf",
        "server side request forgery",
        "server-side request forgery",
      ],
      color: "#1565C0",
    },
    {
      name: "Open redirect",
      keywords: ["open redirect", "unvalidated redirect"],
      color: "#F06292",
    },
    {
      name: "Input validation",
      keywords: ["input validation", "validation"],
      color: "#0C5776",
    },
    {
      name: "Execute code",
      keywords: [
        "execute code",
        "code execution",
        "rce",
        "remote code execution",
      ],
      color: "#9C27B0",
    },
    {
      name: "Bypass",
      keywords: ["bypass", "authentication bypass"],
      color: "#FF5722",
    },
    {
      name: "Gain privilege",
      keywords: ["gain privilege", "privilege escalation"],
      color: "#673AB7",
    },
    {
      name: "Denial of service",
      keywords: ["denial of service", "dos"],
      color: "#3F51B5",
    },
    {
      name: "Information leak",
      keywords: ["information leak", "information disclosure"],
      color: "#2196F3",
    },
  ];

  // Process CVE data to categorize vulnerabilities
  const vulnerabilityData = useMemo(() => {
    // Default to empty array if no CVEs provided
    if (!cves || cves.length === 0) {
      return vulnerabilityTypes.map((type) => ({
        name: type.name,
        count: 0,
        color: type.color,
      }));
    }

    // Initialize counts for each vulnerability type
    const categoryCounts = vulnerabilityTypes.map((type) => ({
      name: type.name,
      count: 0,
      color: type.color,
    }));

    // Count occurrences of each vulnerability type in CVE summaries
    cves.forEach((cve) => {
      const summary = cve.summary.toLowerCase();

      vulnerabilityTypes.forEach((type, index) => {
        // Check if any of the type's keywords are in the summary
        if (type.keywords.some((keyword) => summary.includes(keyword))) {
          categoryCounts[index].count++;
        }
      });
    });

    // Filter out categories with zero count
    return categoryCounts.filter((category) => category.count > 0);
  }, [cves]);

  // Format data for pie chart
  const chartData = useMemo(() => {
    return vulnerabilityData.map((item) => ({
      name: item.name,
      population: item.count,
      color: item.color,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));
  }, [vulnerabilityData]);

  // Calculate total vulnerabilities
  const totalVulnerabilities = useMemo(() => {
    return vulnerabilityData.reduce((sum, item) => sum + item.count, 0);
  }, [vulnerabilityData]);

  // If no vulnerabilities are categorized, show default data
  const hasData = useMemo(
    () => totalVulnerabilities > 0,
    [totalVulnerabilities]
  );

  // Default vulnerability data to show when no CVEs match categories
  const defaultVulnerabilityData: VulnerabilityCategory[] = [
    { name: "Overflow", count: 25, color: "#0096C7" },
    { name: "Memory corruption", count: 20, color: "#FFA069" },
    { name: "SQL injection", count: 15, color: "#00B4A6" },
    { name: "XSS", count: 22, color: "#5A7CA5" },
    { name: "Directory traversal", count: 8, color: "#007F80" },
    { name: "File inclusion", count: 5, color: "#ECC94B" },
    { name: "Other", count: 15, color: "#9E9E9E" },
  ];

  // Use categorized data if available, otherwise use default
  const finalData = hasData ? vulnerabilityData : defaultVulnerabilityData;
  const finalChartData = hasData
    ? chartData
    : defaultVulnerabilityData.map((item) => ({
        name: item.name,
        population: item.count,
        color: item.color,
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      }));
  const finalTotal = hasData
    ? totalVulnerabilities
    : defaultVulnerabilityData.reduce((sum, item) => sum + item.count, 0);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vulnerabilities by type</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={finalChartData}
          width={width - 60}
          height={220}
          chartConfig={{
            backgroundColor: "#222",
            backgroundGradientFrom: "#222",
            backgroundGradientTo: "#222",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          center={[width / 4.8, 0]} // Adjust this to center the chart
          absolute
          hasLegend={false}
        />
      </View>

      <ScrollView
        style={styles.legendContainer}
        showsVerticalScrollIndicator={false}
      >
        {!hasData && (
          <Text style={styles.noDataText}>
            {cves && cves.length > 0
              ? "No vulnerability types detected in CVE data. Showing sample data."
              : "No CVE data provided. Showing sample data."}
          </Text>
        )}

        {finalData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.colorIndicator, { backgroundColor: item.color }]}
            />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendCount}>
              {((item.count / finalTotal) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 30,
    backgroundColor: "#111",
    padding: 30,
  },
  heading: {
    color: "#eee",
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  },
  legendContainer: {
    marginTop: 10,
    maxHeight: 200,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    color: "#eee",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    flex: 1,
  },
  legendCount: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_300Light",
    fontSize: 14,
  },
  noDataText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
});
