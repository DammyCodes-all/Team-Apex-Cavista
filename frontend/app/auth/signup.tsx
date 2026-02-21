import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PasswordInput } from "@/components/password-input";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

export default function SignupScreen() {
  const colors = preventionTheme.colors.light;
  const { signUp, isLoading, error: authError, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const nextErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      nextErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required";
    } else if (password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    } else if (!/[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\/`~]/.test(password)) {
      nextErrors.password =
        "Password must include at least one special character";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    const didSignUp = await signUp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (didSignUp) {
      router.replace("/onboarding/step-1");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#EEF1F7", height: "100%" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: 420 }}>
          <View className="items-center" style={{ marginBottom: 22 }}>
            <Text
              className="text-center"
              style={{
                color: "#0E1633",
                fontSize: 28,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Create account
            </Text>
            <Text
              className="mt-xs text-center"
              style={{
                color: "#617188",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.body,
                lineHeight: 22,
              }}
            >
              Start your health journey, guided by AI.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#F6F7FB",
              borderRadius: 22,
              paddingHorizontal: 20,
              paddingTop: 22,
              paddingBottom: 20,
              shadowColor: "#6A84A3",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 14,
              elevation: 1,
            }}
          >
            <View>
              <Text
                style={{
                  color: "#223555",
                  fontSize: 15,
                  marginBottom: 8,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Full name
              </Text>
              <View
                className="flex-row items-center rounded-input px-m"
                style={{
                  backgroundColor: "#F4F6F9",
                  borderColor: "#E3E8EF",
                  borderWidth: 1,
                  height: 56,
                  borderRadius: 16,
                }}
              >
                <MaterialIcons name="person" size={20} color="#8A9AAF" />
                <TextInput
                  placeholder="Full name"
                  placeholderTextColor="#8EA0B6"
                  autoCapitalize="words"
                  className="ml-s flex-1"
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (authError) {
                      clearError();
                    }
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  style={{
                    color: "#344966",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                />
              </View>
              {errors.name ? (
                <Text
                  className="mt-xs"
                  style={{
                    color: colors.error,
                    fontSize: 13,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                >
                  {errors.name}
                </Text>
              ) : null}
            </View>

            <View>
              <Text
                style={{
                  color: "#223555",
                  fontSize: 15,
                  marginBottom: 8,
                  marginTop: 14,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Email
              </Text>
              <View
                className="flex-row items-center rounded-input px-m"
                style={{
                  backgroundColor: "#F4F6F9",
                  borderColor: "#E3E8EF",
                  borderWidth: 1,
                  height: 56,
                  borderRadius: 16,
                }}
              >
                <MaterialIcons name="mail" size={20} color="#8A9AAF" />
                <TextInput
                  placeholder="user@example.com"
                  placeholderTextColor="#8EA0B6"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="ml-s flex-1"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (authError) {
                      clearError();
                    }
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  style={{
                    color: "#344966",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                />
              </View>
              {errors.email ? (
                <Text
                  className="mt-xs"
                  style={{
                    color: colors.error,
                    fontSize: 13,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                >
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View>
              <Text
                style={{
                  color: "#223555",
                  fontSize: 15,
                  marginBottom: 8,
                  marginTop: 14,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Password
              </Text>
              <PasswordInput
                placeholder="••••••••"
                placeholderTextColor="#8EA0B6"
                textColor="#344966"
                fontFamily={preventionTheme.typography.family.body}
                backgroundColor="#F4F6F9"
                borderColor="#E3E8EF"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (authError) {
                    clearError();
                  }
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
              />
              {errors.password ? (
                <Text
                  className="mt-xs"
                  style={{
                    color: colors.error,
                    fontSize: 13,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                >
                  {errors.password}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              className="items-center justify-center"
              onPress={handleSignup}
              disabled={isLoading}
              style={{
                backgroundColor: "#63B5DB",
                opacity: isLoading ? 0.7 : 1,
                height: 48,
                borderRadius: 16,
                marginTop: 24,
                shadowColor: "#63B5DB",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.18,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontFamily: preventionTheme.typography.family.medium,
                  lineHeight: 26,
                }}
              >
                {isLoading ? "Creating..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
            {authError ? (
              <Text
                className="mt-xs text-center"
                style={{
                  color: colors.error,
                  fontSize: 13,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              >
                {authError}
              </Text>
            ) : null}

            <View
              className="items-center justify-center"
              style={{ marginTop: 20, flexDirection: "row", gap: 8 }}
            >
              <MaterialIcons name="verified-user" size={18} color="#B6A6D9" />
              <Text
                style={{
                  color: "#8A9AAF",
                  fontSize: 14,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              >
                We never sell your data
              </Text>
            </View>
          </View>

          <View className="mt-xl items-center" style={{ marginTop: 26 }}>
            <Text
              style={{
                color: "#617188",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Already have an account?{" "}
              <Link href="/auth/login" asChild>
                <Text
                  style={{
                    color: "#63B5DB",
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Log in
                </Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
