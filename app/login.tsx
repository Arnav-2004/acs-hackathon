import { View, Text,StyleSheet } from "react-native";
import React from "react";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    color: '#eee'
  },
})