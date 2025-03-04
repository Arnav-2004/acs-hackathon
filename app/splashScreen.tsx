// SplashScreen.tsx (custom splash component)

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Svg, { Circle } from 'react-native-svg';

// Animated Circle component from react-native-svg
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SplashScreenComponent: React.FC = () => {
  // Create animated values for the radius of each circle
  const circle1Radius = new Animated.Value(45);
  const circle2Radius = new Animated.Value(35);
  const circle3Radius = new Animated.Value(25);

  useEffect(() => {
    // Prevent auto-hiding of the splash screen
    SplashScreen.preventAutoHideAsync();

    // Create an animation that will pulse the circles
    const pulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          // Animate each circle to grow and shrink
          Animated.timing(circle1Radius, {
            toValue: 50,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(circle1Radius, {
            toValue: 45,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(circle2Radius, {
            toValue: 40,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(circle2Radius, {
            toValue: 35,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(circle3Radius, {
            toValue: 30,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(circle3Radius, {
            toValue: 25,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    pulseAnimation();

    // Simulate loading and hide the splash screen after 2 seconds
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="purple">
        <AnimatedCircle
          cx="50"
          cy="50"
          r={circle1Radius} // Animated radius for the first circle
          strokeWidth="5"
          fill="none"
        />
        <AnimatedCircle
          cx="50"
          cy="50"
          r={circle2Radius} // Animated radius for the second circle
          strokeWidth="5"
          fill="none"
        />
        <AnimatedCircle
          cx="50"
          cy="50"
          r={circle3Radius} // Animated radius for the third circle
          strokeWidth="5"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
});

export default SplashScreenComponent;
