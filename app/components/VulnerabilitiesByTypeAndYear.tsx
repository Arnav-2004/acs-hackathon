import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useFonts, Inter_600SemiBold, Inter_500Medium, Inter_300Light } from "@expo-google-fonts/inter";

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

// Type definition for vulnerability data by year
interface VulnerabilityYearData {
  year: string;
  total: number;
  categories: {
    [key: string]: number;
  };
}

interface VulnerabilitiesByTypeAndYearChartProps {
  cves?: CVE[];
}

export const VulnerabilitiesByTypeAndYearChart = ({ cves }: VulnerabilitiesByTypeAndYearChartProps) => {
  const [fontsLoaded] = useFonts({ Inter_600SemiBold, Inter_500Medium, Inter_300Light });
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  
  // Predefined vulnerability types to track
  const vulnerabilityTypes = [
    { name: "SQL injection", keywords: ["sql injection", "sqli"] },
    { name: "Gain privilege", keywords: ["gain privilege", "privilege escalation"] }
  ];
  
  // Process CVE data to categorize vulnerabilities by year
  const vulnerabilityData = useMemo(() => {
    // Default to empty array if no CVEs provided
    if (!cves || cves.length === 0) {
      return [];
    }
    
    // Extract years from CVE data
    const years = new Set<string>();
    cves.forEach(cve => {
      const year = cve.publisheddate.split('-')[0];
      years.add(year);
    });
    
    // Sort years chronologically
    const sortedYears = Array.from(years).sort();
    
    // Initialize year data structure
    const yearData: VulnerabilityYearData[] = sortedYears.map(year => ({
      year,
      total: 0,
      categories: vulnerabilityTypes.reduce((acc, type) => {
        acc[type.name] = 0;
        return acc;
      }, {} as Record<string, number>)
    }));
    
    // Count CVEs by year and type
    cves.forEach(cve => {
      const year = cve.publisheddate.split('-')[0];
      const yearIndex = yearData.findIndex(data => data.year === year);
      
      if (yearIndex !== -1) {
        // Increment total count for the year
        yearData[yearIndex].total++;
        
        // Check for each vulnerability type
        const summary = cve.summary.toLowerCase();
        vulnerabilityTypes.forEach(type => {
          if (type.keywords.some(keyword => summary.includes(keyword))) {
            yearData[yearIndex].categories[type.name]++;
          }
        });
      }
    });
    
    return yearData;
  }, [cves]);
  
  // If no CVE data, use default data
  const defaultVulnerabilityData: VulnerabilityYearData[] = [
    { year: "2018", total: 16200, categories: { "SQL injection": 750, "Gain privilege": 800 } },
    { year: "2019", total: 17500, categories: { "SQL injection": 820, "Gain privilege": 850 } },
    { year: "2020", total: 18200, categories: { "SQL injection": 900, "Gain privilege": 950 } },
    { year: "2021", total: 19800, categories: { "SQL injection": 950, "Gain privilege": 1050 } },
    { year: "2022", total: 24500, categories: { "SQL injection": 1200, "Gain privilege": 1500 } },
    { year: "2023", total: 28900, categories: { "SQL injection": 1500, "Gain privilege": 1800 } },
    { year: "2024", total: 18200, categories: { "SQL injection": 900, "Gain privilege": 950 } }
  ];
  
  // Use real data if available, otherwise use default
  const finalData = vulnerabilityData.length > 0 ? vulnerabilityData : defaultVulnerabilityData;
  
  // Format data for chart based on selected year or show all data
  const chartData = useMemo(() => {
    const years = finalData.map(item => item.year);
    
    if (selectedYear) {
      // Filter data for the selected year
      const selectedYearData = finalData.find(item => item.year === selectedYear);
      
      if (selectedYearData) {
        // Create data for the selected year only, showing detailed breakdown
        const categories = Object.keys(selectedYearData.categories);
        
        return {
          labels: categories,
          datasets: [
            {
              data: categories.map(category => selectedYearData.categories[category] || 0),
              color: (opacity = 1) => `rgba(128, 90, 213, ${opacity})`,
              strokeWidth: 3
            }
          ],
          legend: ["Vulnerabilities"]
        };
      }
    }
    
    // Default: show all years with Total, SQL injection, and Gain privilege
    const totalDataset = {
      data: finalData.map(item => item.total),
      color: (opacity = 1) => `rgba(128, 90, 213, ${opacity})`,
      strokeWidth: 3
    };
    
    const sqlInjectionDataset = {
      data: finalData.map(item => item.categories["SQL injection"] || 0),
      color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
      strokeWidth: 2
    };
    
    const gainPrivilegeDataset = {
      data: finalData.map(item => item.categories["Gain privilege"] || 0),
      color: (opacity = 1) => `rgba(106, 27, 154, ${opacity})`,
      strokeWidth: 2
    };
    
    return {
      labels: years,
      datasets: [totalDataset, sqlInjectionDataset, gainPrivilegeDataset],
      legend: ["Total", "SQL injection", "Gain privilege"]
    };
  }, [finalData, selectedYear]);

  // Calculate the max value for the y-axis (with some padding)
  const yAxisMax = useMemo(() => {
    if (selectedYear) {
      const selectedYearData = finalData.find(item => item.year === selectedYear);
      if (selectedYearData) {
        const maxCategoryValue = Math.max(...Object.values(selectedYearData.categories));
        if (maxCategoryValue < 100) return 100;
        return Math.ceil(maxCategoryValue / 100) * 100;
      }
    }
    
    const maxTotal = Math.max(...finalData.map(item => item.total));
    if (maxTotal < 100) return 100;
    return Math.ceil(maxTotal / 1000) * 1000;
  }, [finalData, selectedYear]);

  // Prepare legend items based on what's being displayed
  const legendItems = useMemo(() => {
    let items = [];
    
    // Base colors for active items
    const activeColors = {
      "SQL injection": "#8000A0",
      "Gain privilege": "#6A1B9A",
      "Total": "#805AD5"
    };
    
    if (selectedYear) {
      // When a year is selected, show all vulnerability types for that year
      const selectedYearData = finalData.find(item => item.year === selectedYear);
      if (selectedYearData) {
        const categories = Object.keys(selectedYearData.categories);
        categories.forEach((category, index) => {
          items.push({
            name: category,
            color: activeColors[category] || `hsl(${(index * 30) % 360}, 70%, 50%)`,
            active: true
          });
        });
      }
    } else {
      // Default view: all years with Total selected by default
      items = [
        { name: "Overflow", color: "#e0e0e0", active: false },
        { name: "Memory corruption", color: "#e0e0e0", active: false },
        { name: "SQL injection", color: activeColors["SQL injection"], active: true },
        { name: "XSS", color: "#e0e0e0", active: false },
        { name: "Directory traversal", color: "#e0e0e0", active: false },
        { name: "File inclusion", color: "#e0e0e0", active: false },
        { name: "CSRF", color: "#e0e0e0", active: false },
        { name: "XXE", color: "#e0e0e0", active: false },
        { name: "SSRF", color: "#e0e0e0", active: false },
        { name: "Open redirect", color: "#e0e0e0", active: false },
        { name: "Input validation", color: "#e0e0e0", active: false },
        { name: "Execute code", color: "#e0e0e0", active: false },
        { name: "Bypass", color: "#e0e0e0", active: false },
        { name: "Gain privilege", color: activeColors["Gain privilege"], active: true },
        { name: "Denial of service", color: "#e0e0e0", active: false },
        { name: "Information leak", color: "#e0e0e0", active: false },
        { name: "Total", color: activeColors["Total"], active: true }
      ];
    }
    
    return items;
  }, [finalData, selectedYear]);

  // Check if we have real data from CVEs
  const hasRealData = cves && cves.length > 0 && vulnerabilityData.length > 0;

  // Handle label press in the chart
  const handleLabelPress = (index: number) => {
    const yearLabels = finalData.map(item => item.year);
    const selectedYearValue = yearLabels[index];
    
    // If already selected, deselect it to return to the default view
    if (selectedYear === selectedYearValue) {
      setSelectedYear(null);
    } else {
      setSelectedYear(selectedYearValue);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vulnerabilities by type & year</Text>
      
      {!hasRealData && (
        <Text style={styles.noDataText}>
          {cves && cves.length > 0 
            ? "Insufficient CVE data to show yearly trends. Showing sample data."
            : "No CVE data provided. Showing sample data."}
        </Text>
      )}
      
      {selectedYear && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setSelectedYear(null)}
        >
          <Text style={styles.backButtonText}>← Back to all years</Text>
        </TouchableOpacity>
      )}
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <LineChart
            data={chartData}
            width={Math.max(width - 40, (selectedYear ? Object.keys(finalData[0].categories).length : finalData.length) * 60)}
            height={250}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#111",
              backgroundGradientFrom: "#111",
              backgroundGradientTo: "#111",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#111"
              },
              propsForBackgroundLines: {
                stroke: "rgba(255, 255, 255, 0.1)",
                strokeDasharray: "5, 5"
              },
              formatYLabel: (value) => {
                return Number(value).toLocaleString();
              }
            }}
            bezier
            fromZero
            withInnerLines={true}
            withOuterLines={true}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withDots={true}
            withShadow={false}
            segments={5}
            style={{
              marginVertical: 8,
              borderRadius: 8
            }}
            onDataPointClick={({ index }) => {
              // Only handle clicks on x-axis labels when showing all years
              if (!selectedYear) {
                handleLabelPress(index);
              }
            }}
          />
          
          {/* Custom clickable x-axis labels */}
          {!selectedYear && (
            <View style={styles.xAxisLabelsContainer}>
              {finalData.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.xAxisLabel,
                    { width: (width - 40) / finalData.length }
                  ]}
                  onPress={() => handleLabelPress(index)}
                >
                  <Text style={styles.xAxisLabelText}>{item.year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendScrollView}>
        <View style={styles.legendContainer}>
          {legendItems.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, { 
                color: item.active ? "#eee" : "rgba(255,255,255,0.4)" 
              }]}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {selectedYear && (
        <View style={styles.selectedYearInfo}>
          <Text style={styles.selectedYearTitle}>
            {selectedYear} Vulnerability Breakdown
          </Text>
          <Text style={styles.selectedYearSubtitle}>
            Tap the back button to return to the overview
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
    backgroundColor: "#111",
    marginBottom: 20,
  },
  heading: {
    color: "#eee",
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    marginBottom: 20,
  },
  noDataText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center"
  },
  legendScrollView: {
    marginTop: 10,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    paddingVertical: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  xAxisLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -24,
  },
  xAxisLabel: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  xAxisLabelText: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_500Medium",
    fontSize: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(128, 90, 213, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#805AD5",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  selectedYearInfo: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(128, 90, 213, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedYearTitle: {
    color: "#eee",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 5,
  },
  selectedYearSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_300Light",
    fontSize: 12,
  },
});