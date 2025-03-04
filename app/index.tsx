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
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { IconsUser } from "@/components/dashboard/IconUser";
import JobCard from "@/components/dashboard/card";
import { NoOfCVEByYearGraph } from "@/components/dashboard/NoOfCVEByYearGraph";
import { VulnerabilitiesByTypeChart } from "@/components/dashboard/VulneranbilitiesByTypeChartPie";
import { VulnerabilitiesByTypeAndYearChart } from "@/components/dashboard/VulnerabilitiesByTypeAndYear";
import VulnerabilityTable from "@/components/dashboard/VulnerabilityTable";
import { FixedNavigationBar } from "@/components/dashboard/fixedNavigationBar";
import { ProfileModal } from "@/components/dashboard/Modal";
import KEVFilter from "@/components/dashboard/KEVFilter";

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

// Define an interface for raw API CVE data
interface RawCVE {
  id?: string;
  cveid?: string;
  epssscore?: string;
  cvss?: string;
  maxcvss?: string;
  published?: string;
  publisheddate?: string;
  source?: string;
  summary?: string;
  lastModified?: string;
  updateddate?: string;
  [key: string]: any; // Allow for any other properties
}

// Define yearly data structure
interface YearData {
  year: string;
  data: RawCVE[];
}

// Define constants for cache keys and expiration
const CACHE_KEYS = {
  CVES_DATA: 'cves_data',
  CVES_FORMATTED: 'cves_formatted',
  YEARS_WITH_DATA: 'years_with_data',
  CACHE_TIMESTAMP: 'cve_cache_timestamp',
};

// Set cache expiration to 24 hours (in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

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
  const [cvesData, setCvesData] = useState<YearData[]>([]);
  const [yearFilters, setYearFilters] = useState<{id: string, label: string}[]>([]);
  const [loadingFromCache, setLoadingFromCache] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [kevFilteredCVEs, setKevFilteredCVEs] = useState<CVE[]>([]);
  const [kevFilterDate, setKevFilterDate] = useState<string | null>(null);
  
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
  
  const handleKEVFilter = useCallback((kevDate: string | null) => {
    setKevFilterDate(kevDate);
    
    if (!kevDate) {
      // If no KEV date is selected, clear the KEV filter
      setKevFilteredCVEs([]);
      return;
    }
    
    // Filter the CVEs that match the KEV date
    // You'll need to call your API endpoint to get the CVE IDs for the selected KEV date
    const fetchKEVCVEs = async () => {
      try {
        const response = await fetch(`https://acs-hackathon-backend.onrender.com/scrape-known-exploited/${activeFilter}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const kevData = await response.json();
        
        // Extract CVE IDs that match the selected date
        const matchingCVEIDs = kevData
          .filter(item => item.cisakevadded === kevDate)
          .map(item => item.cveid);
        
        // Filter the current filteredCVEs to only include those in the matching IDs
        const matchingCVEs = filteredCVEs.filter(cve => 
          matchingCVEIDs.includes(cve.cveid)
        );
        
        setKevFilteredCVEs(matchingCVEs);
        
        // Log the results for debugging
        console.log(`Found ${matchingCVEs.length} CVEs that match KEV date ${kevDate}`);
      } catch (error) {
        console.error("Error fetching KEV CVEs:", error);
        // If there's an error, clear the filter
        setKevFilteredCVEs([]);
      }
    };
    
    fetchKEVCVEs();
  }, [activeFilter, filteredCVEs]);
  
  // 4. Modify the displayCVEs variable to use the KEVFilter results when available
  const displayCVEs = useMemo(() => {
    if (kevFilterDate && kevFilteredCVEs.length > 0) {
      return kevFilteredCVEs;
    }
    return filteredCVEs;
  }, [filteredCVEs, kevFilterDate, kevFilteredCVEs]);

  // Generate an array of years from 2015 to current year
  const getAllYears = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2015; year <= currentYear; year++) {
      years.push(year.toString());
    }
    return years.sort((a, b) => b.localeCompare(a)); // Sort in descending order (newest first)
  }, []);

  // Enhanced convertRawCVE function to better handle various API response formats
  const convertRawCVE = useCallback((rawCVE: RawCVE, year: string): CVE => {
    // Handle null or undefined input
    if (!rawCVE) {
      return {
        cveid: `Unknown-${Math.random().toString(36).substr(2, 9)}`,
        epssscore: "N/A",
        maxcvss: "N/A",
        publisheddate: `${year}-01-01`,
        source: "Unknown Source",
        summary: "No summary available",
        updateddate: `${year}-01-01`
      };
    }

    // Extract the CVE ID either from id or cveid property
    let cveId = rawCVE.id || rawCVE.cveid;
    if (!cveId) {
      // If no ID is found, generate a random one
      cveId = `Unknown-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Extract date from either published or publisheddate
    let publishedDate = rawCVE.published || rawCVE.publisheddate;
    if (!publishedDate) {
      // If no date is found, use January 1st of the year
      publishedDate = `${year}-01-01`;
    }

    // Extract updated date from either lastModified or updateddate
    let updatedDate = rawCVE.lastModified || rawCVE.updateddate;
    if (!updatedDate) {
      // If no updated date is found, use the published date
      updatedDate = publishedDate;
    }

    // Extract CVSS score from either cvss or maxcvss
    let cvssScore = rawCVE.cvss || rawCVE.maxcvss;

    return {
      cveid: cveId,
      epssscore: rawCVE.epssscore || "N/A",
      maxcvss: cvssScore || "N/A",
      publisheddate: publishedDate,
      source: rawCVE.source || "Unknown Source",
      summary: rawCVE.summary || "No summary available",
      updateddate: updatedDate
    };
  }, []);

  // Cache management functions
  const saveCacheData = useCallback(async (cvesData: YearData[], formattedCVEs: CVE[], yearsWithData: string[]) => {
    try {
      const timestamp = Date.now();
      const cacheData = {
        cvesData,
        formattedCVEs,
        yearsWithData,
        timestamp
      };
      
      await AsyncStorage.setItem(CACHE_KEYS.CVES_DATA, JSON.stringify(cacheData));
      console.log('Cache data saved successfully');
    } catch (error) {
      console.error('Error saving cache data:', error);
    }
  }, []);
  
  const loadCacheData = useCallback(async () => {
    try {
      setLoadingFromCache(true);
      const cachedDataStr = await AsyncStorage.getItem(CACHE_KEYS.CVES_DATA);
      
      if (cachedDataStr) {
        const cachedData = JSON.parse(cachedDataStr);
        const { cvesData, formattedCVEs, yearsWithData, timestamp } = cachedData;
        
        // Check if cache is still valid
        const now = Date.now();
        if (now - timestamp < CACHE_EXPIRATION) {
          console.log('Loading data from cache');
          
          // Update state with cached data
          setCvesData(cvesData);
          setCves(formattedCVEs);
          
          // Update year filters
          const allYears = ["all", ...yearsWithData];
          const newFilters = allYears.map(year => ({
            id: year,
            label: year === "all" ? "All Years" : year
          }));
          setYearFilters(newFilters);
          
          setIsLoading(false);
          setLoadingFromCache(false);
          return true; // Cache was valid and loaded
        } else {
          console.log('Cache expired, fetching fresh data');
          await AsyncStorage.removeItem(CACHE_KEYS.CVES_DATA);
        }
      } else {
        console.log('No cache data found');
      }
      
      setLoadingFromCache(false);
      return false; // No valid cache found
    } catch (error) {
      console.error('Error loading cache data:', error);
      setLoadingFromCache(false);
      return false;
    }
  }, []);
  
  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.CVES_DATA);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  // Function to fetch data for a specific year
  const fetchYearData = useCallback(async () => {
    try {
      // First try to load from cache
      const cacheLoaded = await loadCacheData();
      if (cacheLoaded) {
        return; // If cache was loaded successfully, no need to fetch
      }
      
      const years = getAllYears();
      const newCvesData: YearData[] = [];
      let allFormattedCVEs: CVE[] = [];
      
      // Show loading state
      setIsLoading(true);
      
      for (const year of years) {
        console.log(`Fetching data for year ${year}...`);
        try {
          const response = await fetch(`https://acs-hackathon-backend.onrender.com/scrape-by-date/${year}`,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          
          const data = await response.json();
          console.log(data);
          let processedData: RawCVE[] = [];
          
          // Handle different possible data structures
          if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
            // Handle object format (like the 2025 data with numeric keys)
            processedData = Object.values(data).map(cve => {
              // Handle both possible formats
              if (typeof cve === 'object' && cve !== null) {
                if ('cveid' in cve) {
                  // Format as seen in 2025 data
                  return {
                    id: cve.cveid,
                    epssscore: cve.epssscore,
                    cvss: cve.maxcvss,
                    published: cve.publisheddate,
                    source: cve.source,
                    summary: cve.summary,
                    lastModified: cve.updateddate
                  };
                } else {
                  // Standard raw API format
                  return cve as RawCVE;
                }
              }
              return null;
            }).filter(Boolean) as RawCVE[];
          } else if (Array.isArray(data)) {
            // If data is already an array
            processedData = data;
          } else {
            // Fallback for unexpected formats
            console.warn(`Unexpected data format for year ${year}:`, typeof data);
            processedData = [];
          }
          
          // Store the processed data
          if (processedData.length > 0) {
            newCvesData.push({
              year,
              data: processedData
            });
            
            // Convert to standardized CVE format
            const formattedCVEs = processedData.map(cve => convertRawCVE(cve, year));
            allFormattedCVEs = [...allFormattedCVEs, ...formattedCVEs];
            
            console.log(`Successfully fetched data for year ${year}. Items: ${processedData.length}`);
          } else {
            console.log(`No data found for year ${year}`);
          }
        } catch (yearError) {
          console.error(`Error fetching data for year ${year}:`, yearError);
          // Continue with other years even if one fails
        }
      }
      
      // Update the full years data
      setCvesData(newCvesData);
      console.log(`Total years data collected: ${newCvesData.length}`);
      
      // Update the filter options with all years that have data
      const yearsWithData = newCvesData.map(yd => yd.year);
      const allYears = ["all", ...yearsWithData];
      const newFilters = allYears.map(year => ({
        id: year,
        label: year === "all" ? "All Years" : year
      }));
      setYearFilters(newFilters);
      
      // Update the combined CVEs list
      if (allFormattedCVEs.length > 0) {
        setCves(allFormattedCVEs);
        console.log(`Total CVEs loaded: ${allFormattedCVEs.length}`);
        
        // Save to cache for future use
        await saveCacheData(newCvesData, allFormattedCVEs, yearsWithData);
      } else {
        // If no data was found, use a fallback message
        setError("No vulnerability data found for any year");
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetchYearData:", error);
      setError("Failed to load vulnerability data");
      setIsLoading(false);
    }
  }, [getAllYears, convertRawCVE, loadCacheData, saveCacheData]);
  

  // Updated useEffect to remove sample data and initialize the app state
  useEffect(() => {
    // Initialize with empty array instead of sample data
    setCves([]);
    setError(null);
    
    // Initialize year filters with all years from 2015 to present
    const years = getAllYears();
    const initialFilters = ["all", ...years].map(year => ({
      id: year,
      label: year === "all" ? "All Years" : year
    }));
    setYearFilters(initialFilters);
    
    // Fetch data for all years or load from cache
    fetchYearData();
    
    // Optional: Add a cache refresh mechanism for when the app has been in the 
    // background for a while (e.g., when the user comes back to this screen)
    return () => {
      // Cleanup if needed
    };
  }, [fetchYearData, getAllYears]);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  // Handle scroll event to update active index
  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  }, []);

  // Get display name for active filter
  const getActiveFilterLabel = useCallback(() => {
    const filter = yearFilters.find((item) => item.id === activeFilter);
    return filter ? filter.label : "All Years";
  }, [yearFilters, activeFilter]);

  // Open and close dropdown
  const toggleDropdown = useCallback(() => {
    setDropdownVisible(!dropdownVisible);
  }, [dropdownVisible]);

  // Select filter from dropdown
  const selectFilter = useCallback((filterId) => {
    console.log("Setting filter to:", filterId);
    setActiveFilter(filterId);
    setDropdownVisible(false);
  }, []);

  // Function to copy the filtered data to clipboard
  const copyFilteredDataToClipboard = useCallback(async () => {
    if (isCopying) return;
    
    setIsCopying(true);
    try {
      let dataToCopy;
      
      if (activeFilter === "all") {
        // Copy all data
        dataToCopy = JSON.stringify(cves, null, 2);
      } else {
        // Copy only the data for the selected year
        dataToCopy = JSON.stringify(filteredCVEs, null, 2);
      }
      
      await Clipboard.setStringAsync(dataToCopy);
      
      // Show success message based on platform
      if (Platform.OS === 'android') {
        ToastAndroid.show(`${getActiveFilterLabel()} data copied to clipboard`, ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', `${getActiveFilterLabel()} data copied to clipboard`);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Show error message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to copy data', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to copy data to clipboard');
      }
    } finally {
      setIsCopying(false);
    }
  }, [activeFilter, cves, filteredCVEs, getActiveFilterLabel, isCopying]);

  // Force refresh data
  const forceRefresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await clearCache();
    fetchYearData();
  }, [clearCache, fetchYearData]);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6722A8" />
        <Text style={styles.loadingText}>
          {loadingFromCache ? 'Loading from cache...' : 'Loading vulnerability data...'}
        </Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.text}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={forceRefresh}
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
          <ProfileModal />

        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.text, { paddingHorizontal: 30 }]}>
              Weekly Report
            </Text>
            
            {/* Added refresh button */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={forceRefresh}
              accessible={true}
              accessibilityLabel="Refresh data"
              accessibilityRole="button"
              accessibilityHint="Clears cache and fetches fresh vulnerability data"
            >
              <Text style={styles.refreshButtonText}>↻</Text>
            </TouchableOpacity>
          </View>

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
            
            {/* Copy Button */}
            {activeFilter !== "all" && filteredCVEs.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  isCopying && styles.copyButtonDisabled
                ]}
                onPress={copyFilteredDataToClipboard}
                disabled={isCopying}
                accessible={true}
                accessibilityLabel={`Copy ${getActiveFilterLabel()} data as JSON`}
                accessibilityRole="button"
                accessibilityHint="Copies all vulnerability data for the selected year to clipboard in JSON format"
              >
                <Text style={styles.copyButtonText}>
                  {isCopying ? 'Copying...' : 'Copy JSON'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.kevFilterWrapper}>
            {/* <KEVFilter 
              activeFilter={activeFilter}
              filteredCVEs={filteredCVEs}
              onApplyKEVFilter={handleKEVFilter}
            /> */}
          </View>

          {/* Carousel for JobCards */}
          <FlatList
            ref={flatlistRef}
            data={displayCVEs}
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
        {/* Pass both the formatted CVEs and the raw year data to the graph components */}
        <NoOfCVEByYearGraph cves={cves} yearsData={cvesData} />
        <VulnerabilitiesByTypeChart cves={cves} yearsData={cvesData} />
        <VulnerabilitiesByTypeAndYearChart cves={cves} yearsData={cvesData} />
        <VulnerabilityTable  />
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
              {yearFilters.map((item) => (
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

      {/* Fixed Navigation Bar at the bottom */}
      <FixedNavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#eee',
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
    position: "relative", // Add this to ensure nav bar positioning works
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
    paddingBottom: 80, // Add padding to ensure content doesn't hide behind nav bar
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 30,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  refreshButtonText: {
    color: '#eee',
    fontSize: 18,
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
    flexDirection: "row", // Changed to row for placing copy button
    alignItems: "center", // Align items in the row
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1, // Take up available space
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
  // Copy button styles
  copyButton: {
    backgroundColor: "#6722A8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  copyButtonDisabled: {
    backgroundColor: "rgba(103, 34, 168, 0.5)",
  },
  copyButtonText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
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
    backgroundColor: "rgba(180, 5, 255, 0.1)",
  },
  dropdownItemText: {
    color: "#eee",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  activeDropdownItemText: {
    color: "#6722A8",
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
  kevFilterWrapper: {
    marginHorizontal: 30,
    marginBottom: 10,
    zIndex: 900, // High z-index to ensure it appears over other elements
  },
});