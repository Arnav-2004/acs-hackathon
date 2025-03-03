// app/_layout.tsx
import { useEffect } from "react";
import useAuthStore from "@/utils/store";
import { Stack, useRouter } from "expo-router";

export default function RootLayout() {
  const { username, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !username) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [isAuthenticated, username, router]);

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
