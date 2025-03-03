import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen name="index" options={{ headerShown:false}} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
