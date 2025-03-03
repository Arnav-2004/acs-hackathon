import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function JobCard() {
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="edit-2" size={16} color="white" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>UI Design</Text>
            <Text style={styles.headerSubtitle}>Searched 30 mins ago</Text>
          </View>
          {/* <TouchableOpacity style={styles.closeButton}>
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity> */}
        </View>

        <View style={styles.content}>
          <Text style={styles.jobTitle}>UI/UX Designer needed to redesign our current website</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>$700.00</Text>
            <Text style={styles.priceLabel}>Client Fix Budget</Text>
          </View>
          
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Checkout Vulnerabilities</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
 },
  cardContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  jobTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    lineHeight: 32,
  },
  priceContainer: {
    marginBottom: 20,
  },
  price: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  priceLabel: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: 'rgba(203, 121, 61, 1)',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});