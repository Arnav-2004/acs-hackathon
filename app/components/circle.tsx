import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <LinearGradient
    // Background Linear Gradient
    colors={['#6722A8', '#FF4203', '#FF8503']}
    style={styles.background}
  />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 50,
    width: 50,
    filter: "blur(10px)"
  },
});
