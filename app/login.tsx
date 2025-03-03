import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import { Link, Redirect } from "expo-router";
import useAuthStore from "@/utils/store";
import axios from "axios";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const { login } = useAuthStore();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    setLoading(true);

    axios
      .post("https://acs-hackathon-backend.onrender.com/login", {
        email,
        password,
      })
      .then((response) => {
        login(response.data.username, email, password);
        setLoading(false);
        return <Redirect href="/" />;
      })
      .catch((error) => {
        setLoading(false);
        setErrors({
          email: "Invalid credentials",
          password: "Invalid credentials",
        });
      });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account">
      <View style={styles.container}>
        <InputField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        <InputField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <AuthButton label="Log in" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Link href={"/sign-up"} style={styles.footerLink}>
              Sign up
            </Link>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: 20,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#7C3AED",
    fontSize: 14,
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
