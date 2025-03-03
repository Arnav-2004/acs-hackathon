import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useFonts, Inter_900Black,Inter_500Medium, Inter_700Bold,Inter_600SemiBold, Inter_300Light} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { IconsUser } from "./components/IconUser";
import JobCard from "./components/card";
export default function Index() {
  const [fontsLoaded] = useFonts({ Inter_900Black,Inter_500Medium, Inter_700Bold,Inter_600SemiBold, Inter_300Light });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View>
          <Text style={styles.text}>Welcome, johndoe</Text>
          <Text style={styles.text1}>This is your weekly report for the publicly listed vulnerabilities</Text>
        </View>
        <Link href="/profile" style={styles.link}>
          <IconsUser />
        </Link>
      </View>
      <View style={{
        flexDirection: 'column',
        marginTop: 50,
      }}>
        <Text style={styles.text}>
          Your Website
        </Text>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
        }}>
          <JobCard />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#111",
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
  text1:{
    color: "rgba(255,255,255,0.7)",
    fontFamily: " Inter_300Light  ",
    fontSize: 10,
    marginTop: 10,
    maxWidth: 200,
  },
});
