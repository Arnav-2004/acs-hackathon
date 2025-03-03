import { BarChart } from "react-native-chart-kit";
import { View, Text, Dimensions, StyleSheet } from 'react-native';

// Define the prop types for the component
interface NoOfCVEByYearGraphProps {
  cves: Array<{
    cveid: string;
    publisheddate: string;
    maxcvss: string;
    // Include other properties as needed
  }>;
}

export function NoOfCVEByYearGraph({ cves = [] }: NoOfCVEByYearGraphProps) {
  // Process CVE data to count by year
  const countCVEsByYear = () => {
    const yearCounts = {};
    
    // Count CVEs by year
    cves.forEach(cve => {
      const year = cve.publisheddate.split('-')[0];
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    // Sort years in ascending order
    const sortedYears = Object.keys(yearCounts).sort();
    
    return {
      labels: sortedYears,
      datasets: [
        {
          data: sortedYears.map(year => yearCounts[year])
        }
      ]
    };
  };

  const { width } = Dimensions.get("window");
  const data = countCVEsByYear();

  // Handle empty data case
  if (data.labels.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No CVE data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CVEs by Year</Text>
      <BarChart
        data={data}
        width={width - 80 }
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#222",
          backgroundGradientTo: "#333",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 10,
          },
          barPercentage: 0.8,
        }}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: "#eee",
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    marginBottom: 10,
    paddingLeft: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
    padding:10,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  }
});