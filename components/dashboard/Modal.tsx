import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView
} from 'react-native';
import {
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import { IconsUser } from './IconUser';

const { width, height } = Dimensions.get('window');

// This component replaces the IconsUser component
export const ProfileModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState([
    // Placeholder news data until you provide the API
    {
      id: '1',
      title: 'Critical vulnerability found in popular framework',
      description: 'Security researchers have discovered a new zero-day vulnerability affecting millions of devices worldwide.',
      publishedAt: '2025-03-02T14:30:00Z',
      source: 'Security Daily'
    },
    {
      id: '2',
      title: 'New patches released for CVE-2025-0142',
      description: 'Vendors have released emergency patches addressing the recently disclosed vulnerability. Users are advised to update immediately.',
      publishedAt: '2025-03-01T09:15:00Z',
      source: 'Cyber News Network'
    },
    {
      id: '3',
      title: 'Ransomware attack exploits unpatched systems',
      description: 'A new ransomware campaign is actively exploiting systems that haven\'t applied recent security updates.',
      publishedAt: '2025-02-28T16:45:00Z',
      source: 'Threat Intel Report'
    }
  ]);

  const openModal = async () => {
    setModalVisible(true);
    setLoading(true);
    
    // Simulate loading news data
    // Replace this with your actual API call later
    setTimeout(() => {
      // This is where you would fetch from your news API
      // const response = await fetch('your-news-api-url');
      // const data = await response.json();
      // setNewsData(data);
      
      setLoading(false);
    }, 1500);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Component for the user icon that opens the modal
  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        style={styles.iconContainer}
        accessible={true}
        accessibilityLabel="Open news"
        accessibilityRole="button"
        accessibilityHint="Opens a modal with security news"
      >
        <View style={styles.userIcon}>
            <IconsUser />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security News Feed</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                accessible={true}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6722A8" />
                <Text style={styles.loadingText}>Loading news...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.newsContainer}
                showsVerticalScrollIndicator={false}
              >
                {newsData.map((item) => (
                  <View key={item.id} style={styles.newsItem}>
                    <Text style={styles.newsSource}>{item.source} • {formatDate(item.publishedAt)}</Text>
                    <Text style={styles.newsTitle}>{item.title}</Text>
                    <Text style={styles.newsDescription}>{item.description}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginTop: 20,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#222',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#eee',
    marginTop: 16,
    fontFamily: 'Inter_500Medium',
  },
  newsContainer: {
    flex: 1,
    padding: 16,
  },
  newsItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  newsSource: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    marginBottom: 4,
  },
  newsTitle: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  newsDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
});