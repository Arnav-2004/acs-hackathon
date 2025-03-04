import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import { Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";

// KEV Filter component to be added to the dashboard
const KEVFilter = ({ activeFilter, filteredCVEs, onApplyKEVFilter }) => {
  const showMessage = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Message', message);
    }
  };

  const [showKEVDropdown, setShowKEVDropdown] = useState(false);
  const [kevDates, setKevDates] = useState([]);
  const [selectedKEVDate, setSelectedKEVDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kevFilterApplied, setKevFilterApplied] = useState(false);

  // Improved fetchKEVDates function with better error handling and fallback
  const fetchKEVDates = useCallback(async (year) => {
    if (!year || year === "all") return;

    console.log("Fetching KEV dates for year:", year);
    setIsLoading(true);
    setError(null);

    try {
      // Log the full URL being called
      const url = `https://acs-hackathon-backend.onrender.com/scrape-known-exploited/${year}`;
      console.log("API URL:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Log raw response for debugging
      const rawText = await response.text();
      console.log("Raw response preview:", rawText.substring(0, 200) + (rawText.length > 200 ? "..." : ""));
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(`Failed to parse response as JSON: ${parseError.message}`);
      }
      
      console.log("Data type:", typeof data, "Array?", Array.isArray(data), "Length:", Array.isArray(data) ? data.length : 'N/A');
      
      // Extract unique dates from the response
      let dates = [];
      if (data) {
        const uniqueDates = new Set();
        
        // Handle both array and object responses
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.cisakevadded) {
              uniqueDates.add(item.cisakevadded);
            }
          });
        } else {
          // Handle object format (convert to array of values)
          Object.values(data).forEach(item => {
            if (item.cisakevadded) {
              uniqueDates.add(item.cisakevadded);
            }
          });
        }
        
        dates = Array.from(uniqueDates).sort((a, b) => new Date(b) - new Date(a)); // Sort newest first
      }

      setKevDates(dates);
      console.log(`Found ${dates.length} unique KEV dates from API`);

      if (dates.length === 0) {
        // Try to use filteredCVEs as fallback
        useLocalDataFallback();
      }
    } catch (error) {
      console.error("Error fetching KEV dates:", error);
      setError(`Failed to load KEV data: ${error.message}`);
      
      // Try to use filteredCVEs as fallback on error
      useLocalDataFallback();
    } finally {
      setIsLoading(false);
    }
  }, [filteredCVEs]);

  // Helper function to use local data as fallback
  const useLocalDataFallback = useCallback(() => {
    if (filteredCVEs && filteredCVEs.length > 0) {
      console.log("Using local data as fallback...");
      const uniqueDatesFallback = new Set();
      filteredCVEs.forEach(item => {
        if (item.cisakevadded) {
          uniqueDatesFallback.add(item.cisakevadded);
        }
      });
      const fallbackDates = Array.from(uniqueDatesFallback).sort((a, b) => new Date(b) - new Date(a));
      setKevDates(fallbackDates);
      console.log(`Found ${fallbackDates.length} unique KEV dates from local data`);
      
      if (fallbackDates.length > 0) {
        setError(null); // Clear error since we have fallback data
      } else {
        const yearStr = activeFilter ? String(activeFilter) : "selected year";
        showMessage(`No KEV data found for ${yearStr}`);
      }
    } else {
      const yearStr = activeFilter ? String(activeFilter) : "selected year";
      showMessage(`No KEV data available for ${yearStr}`);
    }
  }, [filteredCVEs, activeFilter, showMessage]);

  // Reset filter function
  const resetKEVFilter = useCallback(() => {
    setSelectedKEVDate(null);
    setKevFilterApplied(false);
    onApplyKEVFilter(null);
  }, [onApplyKEVFilter]);

  // Fetch KEV dates when year is selected (not "all")
  useEffect(() => {
    const activeFilterStr = String(activeFilter);
    
    if (activeFilterStr !== "all") {
      fetchKEVDates(activeFilterStr);
      resetKEVFilter();
    } else {
      // Reset when "All Years" is selected
      setKevDates([]);
      resetKEVFilter();
    }
  }, [activeFilter, fetchKEVDates, resetKEVFilter]);

  const selectKEVDate = (date) => {
    setSelectedKEVDate(date);
    setKevFilterApplied(true);

    // Filter CVEs based on an exact match to the selected KEV date
    const filtered = filteredCVEs.filter(cve => cve.cisakevadded === date);
    onApplyKEVFilter(filtered);
    
    // Log the results for debugging
    console.log(`Selected KEV date: ${date}, Found ${filtered.length} matching CVEs`);

    setShowKEVDropdown(false);
  };

  const clearKEVFilter = () => {
    resetKEVFilter();
    console.log("KEV filter cleared");
  };

  const formatDate = (date) => {
    if (!date) return "";
    
    try {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return date; // Return the original string if parsing fails
    }
  };

  // Early return if activeFilter is "all"
  if (String(activeFilter) === "all") {
    return null;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6722A8" />
          <Text style={styles.loadingText}>Loading KEV data...</Text>
        </View>
      ) : kevDates.length > 0 ? (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.kevFilterButton}
            onPress={() => setShowKEVDropdown(true)}
            accessible={true}
            accessibilityLabel={selectedKEVDate ? `KEV filter: ${formatDate(selectedKEVDate)}` : "Filter by KEV date"}
            accessibilityRole="button"
            accessibilityHint="Opens a dropdown to filter by CISA Known Exploited Vulnerabilities dates"
            accessibilityState={{ expanded: showKEVDropdown }}
          >
            <Text style={styles.kevFilterText}>
              {selectedKEVDate ? `KEV: ${formatDate(selectedKEVDate)}` : "Filter by KEV Date"}
            </Text>
            <Text style={styles.kevDropdownIcon}>▼</Text>
          </TouchableOpacity>

          {kevFilterApplied && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={clearKEVFilter}
              accessible={true}
              accessibilityLabel="Clear KEV filter"
              accessibilityRole="button"
              accessibilityHint="Removes the applied KEV date filter"
            >
              <Text style={styles.clearFilterText}>×</Text>
            </TouchableOpacity>
          )}

          {/* KEV Date Dropdown */}
          <Modal
            transparent={true}
            visible={showKEVDropdown}
            animationType="fade"
            onRequestClose={() => setShowKEVDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowKEVDropdown(false)}
              accessible={true}
              accessibilityLabel="Close KEV date dropdown"
              accessibilityRole="button"
            >
              <View style={[styles.kevDropdownMenu, { marginHorizontal: 16 }]}>
                <ScrollView style={{ maxHeight: 200 }}>
                  {kevDates.map((date) => (
                    <TouchableOpacity
                      key={date}
                      style={[styles.kevDropdownItem, selectedKEVDate === date && styles.activeKevDropdownItem]}
                      onPress={() => selectKEVDate(date)}
                      accessible={true}
                      accessibilityLabel={`Filter by KEV date: ${formatDate(date)}`}
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected: selectedKEVDate === date }}
                    >
                      <Text
                        style={[styles.kevDropdownItemText, selectedKEVDate === date && styles.activeKevDropdownItemText]}
                      >
                        {formatDate(date)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.noDataText}>No KEV data available for {activeFilter}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%', // Ensure it takes full width
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loadingText: {
    color: '#eee',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kevFilterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(103, 34, 168, 0.2)',
    padding: 20,
    borderRadius: 8,
    flex: 1,
  },
  kevFilterText: {
    color: '#eee',
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  kevDropdownIcon: {
    color: '#eee',
    fontSize: 10,
    marginLeft: 4,
  },
  clearFilterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearFilterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  kevDropdownMenu: {
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    zIndex: 2000,
  },
  kevDropdownItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeKevDropdownItem: {
    backgroundColor: 'rgba(103, 34, 168, 0.2)',
  },
  kevDropdownItemText: {
    color: '#eee',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  activeKevDropdownItemText: {
    color: '#b405ff',
    fontFamily: 'Inter_600SemiBold',
  },
  errorText: {
    color: '#FF6B6B',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  noDataText: {
    color: '#eee',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  }
});

export default KEVFilter;