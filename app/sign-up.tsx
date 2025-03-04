import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import InputField from "@/components/auth/InputField";
import { Link, Redirect } from "expo-router";
import useAuthStore from "@/utils/store";
import axios from "axios";

const SignUpScreen = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!userName) {
      newErrors.userName = "Username is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return (
      !newErrors.userName &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    );
  };

  const handleSignUp = () => {
    if (!validateForm()) return;

    setLoading(true);

    axios
      .post("https://acs-hackathon-backend.onrender.com/signup", {
        username: userName,
        email,
        password,
      })
      .then((response) => {
        login(userName, email, password);
        setLoading(false);
        return <Redirect href="/" />;
      })
      .catch((error) => {
        setLoading(false);
        alert("Some error occurred. Please try again.");
      });
  };

  return (
    <AuthLayout title="Create an account" subtitle="Sign up to get started">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <InputField
            label="UserName"
            placeholder="JohnDoe"
            value={userName}
            onChangeText={setUserName}
            error={errors.userName}
          />

          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
          />

          <InputField
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <AuthButton
            label="Create Account"
            onPress={handleSignUp}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Link href={"/login"} style={styles.footerLink}>
                Sign in
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  footerLink: {
    color: "#7C3AED",
    fontWeight: "600",
  },
});
