import React, { useState, useEffect } from 'react';
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
  console.log("KEVFilter rendered with activeFilter:", activeFilter, "type:", typeof activeFilter);

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

  // Fetch KEV dates when year is selected (not "all")
  useEffect(() => {
    const activeFilterStr = String(activeFilter);
    console.log("useEffect triggered with activeFilter:", activeFilterStr);

    if (activeFilterStr !== "all") {
      fetchKEVDates(activeFilterStr);
      // Reset KEV filter when year changes
      setSelectedKEVDate(null);
      setKevFilterApplied(false);
      // Ensure original filtered CVEs are displayed
      onApplyKEVFilter(null);
    } else {
      // Reset when "All Years" is selected
      setKevDates([]);
      setSelectedKEVDate(null);
      setKevFilterApplied(false);
      onApplyKEVFilter(null);
    }
  }, [activeFilter, onApplyKEVFilter]);

  // Fetch KEV dates from the API
  const fetchKEVDates = async (year) => {
    if (!year || year === "all") return;

    console.log("Fetching KEV dates for year:", year);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://acs-hackathon-backend.onrender.com/scrape-known-exploited/${year}`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      console.log(`Received KEV data for ${year}:`, data ? data.length : 0, "items");

      // Extract unique dates from the response
      let dates = [];
      if (data && Array.isArray(data)) {
        const uniqueDates = new Set();
        data.forEach(item => {
          if (item.cisakevadded) {
            uniqueDates.add(item.cisakevadded); // Collect unique KEV dates
          }
        });
        dates = Array.from(uniqueDates).sort((a, b) => new Date(b) - new Date(a)); // Sort newest first
      }

      setKevDates(dates);
      console.log(`Found ${dates.length} unique KEV dates`);

      if (dates.length === 0) {
        showMessage(`No KEV data found for ${year}`);
      }
    } catch (error) {
      console.error("Error fetching KEV dates:", error);
      setError(`Failed to load KEV data: ${error.message}`);
      showMessage(`Error loading KEV data for ${year}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectKEVDate = (date) => {
    setSelectedKEVDate(date);
    setKevFilterApplied(true);

    // Filter CVEs based on an exact match to the selected KEV date
    const filtered = filteredCVEs.filter(cve => cve.cisakevadded === date);
    onApplyKEVFilter(filtered);

    setShowKEVDropdown(false);
  };

  const clearKEVFilter = () => {
    setSelectedKEVDate(null);
    setKevFilterApplied(false);
    onApplyKEVFilter(null);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Conditional rendering for the KEV filter
  if (String(activeFilter) === "all") {
    console.log("KEVFilter hidden because activeFilter is 'all'");
    return null;
  }

  console.log("KEVFilter will be displayed with kevDates.length:", kevDates.length);

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
              <View style={styles.kevDropdownMenu}>
                <ScrollView>
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

// Keep existing styles and add this new style
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  kevFilterText: {
    color: '#eee',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
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
  },
  kevDropdownMenu: {
    position: 'absolute',
    top: 40, // Position it below the filter button
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    zIndex: 2000,
  },
  kevDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    