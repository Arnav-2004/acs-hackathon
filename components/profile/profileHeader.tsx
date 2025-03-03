import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from "react-native-reanimated";

interface ProfileHeaderProps {
  username: string;
  email: string;
  photoUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  email,
  photoUrl = "https://github.com/shadcn.png",
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.05);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.delay(100).duration(500)}
    >
      {/* Profile photo */}
      <View style={styles.photoContainer}>
        <Animated.View style={[styles.photoWrapper, animatedStyle]}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.photo} />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Text style={styles.placeholderText}>{username.charAt(0)}</Text>
            </View>
          )}
        </Animated.View>

        {/* Camera icon for changing photo */}
        <TouchableOpacity
          style={styles.cameraButton}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Camera size={14} color="white" />
        </TouchableOpacity>
      </View>

      {/* User info */}
      <Animated.Text
        style={styles.username}
        entering={FadeIn.delay(300).duration(500)}
      >
        {username}
      </Animated.Text>

      <Animated.Text
        style={styles.email}
        entering={FadeIn.delay(400).duration(500)}
      >
        {email}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  photoContainer: {
    position: "relative",
  },
  photoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.5)",
    marginBottom: 16,
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderPhoto: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: "rgba(255, 255, 255, 0.7)",
  },
  cameraButton: {
    position: "absolute",
    bottom: 12,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
});

export default ProfileHeader;
