// app/_layout.tsx
import { useEffect, useState } from "react";
import useAuthStore from "@/utils/store";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen'; // Import the splash screen API
import SplashScreenComponent from "./splashScreen";

export default function RootLayout() {
  const { username, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Handle the splash screen visibility
  useEffect(() => {
    // Prevent the splash screen from automatically hiding
    SplashScreen.preventAutoHideAsync();

    // Simulate loading process (e.g., fetching resources or data)
    setTimeout(async () => {
      setIsReady(true); // Once loading is complete, set isReady to true
      await SplashScreen.hideAsync(); // Hide the splash screen when ready
    }, 2000); // Adjust time as necessary (currently 2 seconds)
  }, []);

  // Handle the authentication check
  useEffect(() => {
    if (isReady) { // Only check authentication after splash screen is ready
      if (!isAuthenticated || !username) {
        router.replace("/login");
      } else {
        router.replace("/");
      }
    }
  }, [isReady, isAuthenticated, username, router]);

  if (!isReady) {
    // Optionally, render a custom splash screen component here
    return (
      <SplashScreenComponent />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="create" options={{ title: "Create" }} />
    </Stack>
  );
}
