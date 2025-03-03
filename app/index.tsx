import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={"/login"}>Go to login</Link>
      <Link href={"/sign-up"}>Go to SignUp</Link>
    </View>
  );
}
