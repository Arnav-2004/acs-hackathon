import { Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  useFonts,
  Inter_900Black,
  Inter_500Medium,
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { IconsUser } from "./components/IconUser";
import JobCard from "./components/card";
import { NoOfCVEByYearGraph } from "./components/NoOfCVEByYearGraph";
import { VulnerabilitiesByTypeChart } from "./components/VulneranbilitiesByTypeChartPie";
import { VulnerabilitiesByTypeAndYearChart } from "./components/VulnerabilitiesByTypeAndYear";
import { VulnerabilityTables } from "./components/VulnerabilityTable";

const { width, height } = Dimensions.get("window");

// Type definitions for CVE data
interface CVE {
  cveid: string;
  epssscore: string;
  maxcvss: string;
  publisheddate: string;
  source: string;
  summary: string;
  updateddate: string;
}

export default function Index() {
  const [fontsLoaded] = useFonts({
    Inter_900Black,
    Inter_500Medium,
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_300Light,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const flatlistRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cves, setCves] = useState<CVE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch or initialize CVE data
  useEffect(() => {
    // Simulating data fetching with validation
    try {
      const today = new Date();
      // Sample data - in a real app, this would come from an API
      const sampleCves = [
        {
          cveid: "CVE-2024-56803",
          epssscore: "0.04%",
          maxcvss: "5.1",
          publisheddate: "2024-12-31",
          source: "Source: GitHub, Inc.",
          summary:
            'Ghostty is a cross-platform terminal emulator. Ghostty, as allowed by default in 1.0.0, allows attackers to modify the window title via a certain character escape sequence and then insert it back to the command line in the user\'s terminal, e.g. when the user views a file containing the malicious sequence, which could allow the attacker to execute arbitrary commands. This attack requires an attacker to send malicious escape sequences followed by convincing the user to physically press the "enter" key. Fixed in Ghostty v1.0.1.',
          updateddate: "2024-12-31",
        },
        {
          cveid: "CVE-2024-12345",
          epssscore: "0.12%",
          maxcvss: "7.5",
          publisheddate: "2024-11-15",
          source: "Source: NIST",
          summary:
            "A vulnerability in XYZ software allows remote attackers to bypass authentication and gain access to sensitive data. The issue affects versions prior to 2.3.4 and has been patched in version 2.3.5.",
          updateddate: "2024-11-16",
        },
        {
          cveid: "CVE-2024-67890",
          epssscore: "0.30%",
          maxcvss: "8.2",
          publisheddate: "2024-10-05",
          source: "Source: MITRE",
          summary:
            "An SQL injection vulnerability in the login module of ABC web application allows attackers to execute arbitrary SQL queries, potentially leading to unauthorized access. The issue is resolved in patch v1.5.7.",
          updateddate: "2024-10-06",
        },
        {
          cveid: "CVE-2023-98765",
          epssscore: "0.50%",
          maxcvss: "6.9",
          publisheddate: "2023-08-20",
          source: "Source: CVE Details",
          summary:
            "An insecure deserialization vulnerability in the XYZ service allows remote attackers to execute arbitrary code, which could lead to a complete system compromise. The issue was patched in version 3.2.1.",
          updateddate: "2023-08-21",
        },
        {
          cveid: "CVE-2023-43210",
          epssscore: "0.35%",
          maxcvss: "9.0",
          publisheddate: "2023-09-05",
          source: "Source: CVE Info",
          summary:
            "A critical vulnerability in the PQR application allows remote attackers to execute arbitrary commands on vulnerable systems. The flaw was patched in version 1.2.3.",
          updateddate: "2023-09-06",
        },
      ];

      // Filter out future-dated CVEs (beyond current date)
      const validCves = sampleCves.filter((cve) => {
        const cveDate = new Date(cve.publisheddate);
        return cveDate <= today;
      });

      setCves(validCves);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load vulnerability data");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  // Memoized year filters to prevent recalculation on each render
  const filterOptions = useMemo(() => {
    const years = new Set();
    // Add "All" option
    years.add("all");

    // Extract years from data
    cves.forEach((cve) => {
      const year = cve.publisheddate.split("-")[0];
      years.add(year);
    });

    // Convert to array and sort
    const yearFilters = Array.from(years).sort((a, b) => {
      if (a === "all") return -1; // "All" should be first
      if (b === "all") return 1;
      return b.localeCompare(a); // Most recent years first
    });

    return yearFilters.map((year) => ({
      id: year,
      label: year === "all" ? "All Years" : year,
    }));
  }, [cves]);

  // Memoized filtered CVEs to prevent recalculation on each render
  const filteredCVEs = useMemo(() => {
    if (activeFilter === "all") {
      return cves;
    }

    return cves.filter((cve) => {
      const year = cve.publisheddate.split("-")[0];
      return year === activeFilter;
    });
  }, [cves, activeFilter]);

  // Get display name for active filter
  const getActiveFilterLabel = useCallback(() => {
    const filter = filterOptions.find((item) => item.id === activeFilter);
    return filter ? filter.label : "All Years";
  }, [filterOptions, activeFilter]);

  // Handle scroll event to update active index
  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  }, []);

  // Open and close dropdown
  const toggleDropdown = useCallback(() => {
    setDropdownVisible(!dropdownVisible);
  }, [dropdownVisible]);

  // Select filter from dropdown
  const selectFilter = useCallback((filterId) => {
    setActiveFilter(filterId);
    setDropdownVisible(false);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.text}>Loading vulnerabilities...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.text}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setIsLoading(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.text}>Welcome, johndoe</Text>
            <Text style={styles.text1}>
              This is your weekly report for the publicly listed vulnerabilities
            </Text>
          </View>
          <Link href="/profile" style={styles.link}>
            <IconsUser />
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={[styles.text, { paddingHorizontal: 30 }]}>
            Your Website
          </Text>

          {/* Year Dropdown - Improved Accessibility */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={toggleDropdown}
              accessible={true}
              accessibilityLabel={`Filter by year: ${getActiveFilterLabel()}`}
              accessibilityRole="button"
              accessibilityState={{ expanded: dropdownVisible }}
              accessibilityHint="Opens a dropdown menu to filter vulnerabilities by year"
            >
              <Text style={styles.dropdownButtonText}>
                {getActiveFilterLabel()}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Carousel for JobCards */}
          <FlatList
            ref={flatlistRef}
            data={filteredCVEs}
            keyExtractor={(item) => item.cveid}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <JobCard content={[item]} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No vulnerabilities found for {getActiveFilterLabel()}
                </Text>
              </View>
            }
            accessible={true}
            accessibilityLabel="List of vulnerability cards"
          />
        </View>
        {/* Pass CVE data to the graph component */}
        <NoOfCVEByYearGraph cves={cves} />
        <VulnerabilitiesByTypeChart cves={cves} />
        <VulnerabilitiesByTypeAndYearChart cves={cves} />
        <VulnerabilityTables cves={cves} />
        {/* Add additional padding at the bottom for better scrolling experience */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Dropdown Modal with improved keyboard accessibility */}
      <Modal
        transparent={true}
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
          accessible={true}
          accessibilityLabel="Close dropdown menu"
          accessibilityRole="button"
        >
          <View
            style={[
              styles.dropdownMenu,
              {
                top: 185, // Positioned below the dropdown button
                left: 30,
              },
            ]}
          >
            <ScrollView>
              {filterOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dropdownItem,
                    activeFilter === item.id && styles.activeDropdownItem,
                  ]}
                  onPress={() => selectFilter(item.id)}
                  accessible={true}
                  accessibilityLabel={`Filter by ${item.label}`}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: activeFilter === item.id }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      activeFilter === item.id && styles.activeDropdownItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  text: {
    color: "#eee",
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    marginTop: 5,
  },
  link: {
    marginTop: 20,
    color: "#1E90FF",
    fontSize: 18,
  },
  text1: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_300Light",
    fontSize: 10,
    marginTop: 10,
    maxWidth: 200,
  },
  section: {
    marginTop: 30,
  },
  carouselItem: {
    width: width,
    paddingHorizontal: 30,
  },
  dropdownContainer: {
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 30,
    position: "relative",
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dropdownButtonText: {
    color: "#eee",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  dropdownIcon: {
    color: "#eee",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    position: "absolute",
    width: width - 60,
    maxHeight: 200,
    backgroundColor: "#222",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    zIndex: 2000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  activeDropdownItem: {
    backgroundColor: "rgba(30, 144, 255, 0.1)",
  },
  dropdownItemText: {
    color: "#eee",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  activeDropdownItemText: {
    color: "#1E90FF",
    fontFamily: "Inter_600SemiBold",
  },
  emptyContainer: {
    width: width - 60,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginHorizontal: 30,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
