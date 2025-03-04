import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export const NoOfCVEByYearGraph = ({ cves, yearsData }) => {
  const [yearCounts, setYearCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCVEsByYear = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://acs-hackathon-backend.onrender.com/no-of-cves-by-year");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && typeof data === 'object') {
          const formattedData = Object.entries(data)
            .map(([year, count]) => ({ year, count: Number(count) }))
            .sort((a, b) => a.year.localeCompare(b.year));
          
          setYearCounts(formattedData);
        } else {
          processLocalData();
        }
        
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load CVE year data. Using local data instead.");
        processLocalData();
        setIsLoading(false);
      }
    };

    const processLocalData = () => {
      if (yearsData && yearsData.length > 0) {
        const counts = yearsData.map(({ year, data }) => ({
          year,
          count: data.length
        })).sort((a, b) => a.year.localeCompare(b.year));
        
        setYearCounts(counts);
      } else if (cves && cves.length > 0) {
        const yearMap = {};
        
        cves.forEach(cve => {
          const year = cve.publisheddate.split('-')[0];
          yearMap[year] = (yearMap[year] || 0) + 1;
        });
        
        const counts = Object.entries(yearMap)
          .map(([year, count]) => ({ year, count: Number(count) }))
          .sort((a, b) => a.year.localeCompare(b.year));
        
        setYearCounts(counts);
      }
    };

    fetchCVEsByYear();
  }, [cves, yearsData]);

  const chartData = useMemo(() => {
    if (yearCounts.length === 0) return null;
    
    return {
      labels: yearCounts.map(item => item.year),
      datasets: [
        {
          data: yearCounts.map(item => item.count),
        },
      ],
    };
  }, [yearCounts]);

  const chartConfig = {
    backgroundColor: "#1e1e1e",
    backgroundGradientFrom: "#222",
    backgroundGradientTo: "#111",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(208, 165, 249, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#6722A8",
    },
    barPercentage: 0.8,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number of CVEs by Year</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6722A8" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : yearCounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No vulnerability data available</Text>
        </View>
      ) : (
        <ScrollView horizontal>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={Math.max(width, yearCounts.length * 50)}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero={true}
              showBarTops={true}
              showValuesOnTopOfBars={true}
              style={styles.chart}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#111",
  },
  title: {
    color: "#eee",
    fontSize: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 10,
  },
  errorContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
  },
  emptyContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
  },
});