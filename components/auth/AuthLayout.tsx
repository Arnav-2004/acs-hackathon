import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const AuthLayout = ({
  children,
  title,
  subtitle,
}: {
  children: any;
  title: string;
  subtitle: string;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.gradientOverlay} />

          <View style={styles.headerContent}>
            <Animated.View
              entering={FadeIn.duration(800)}
              style={styles.titleContainer}
            >
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </Animated.View>
          </View>
        </View>

        <Animated.View
          entering={FadeIn.duration(800).delay(200)}
          style={styles.content}
        >
          {children}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: 200,
    position: "relative",
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#782aff",
    opacity: 0.3,
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
    paddingBottom: 32,
  },
  titleContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
});

export default AuthLayout;
