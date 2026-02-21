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

export default function LoginScreen() {
  const colors = preventionTheme.colors.light;
  const { signIn, isLoading, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const didSignIn = await signIn({
      email: email.trim().toLowerCase(),
      password,
    });

    if (didSignIn) {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#CDE7E0", height: "100%" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: 420 }}>
          <View className="items-center">
            <Text
              className="text-center"
              style={{
                color: "#2D3449",
                fontSize: 28,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Welcome back
            </Text>
            <Text
              className="mt-xs text-center"
              style={{
                color: "#5B6B7A",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Log in to your health dashboard
            </Text>
          </View>

          <View className="mt-xl gap-m">
            <View>
              <View
                className="flex-row items-center rounded-input px-m"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.inputBorder,
                  borderWidth: 1,
                  height: 54,
                }}
              >
                <MaterialIcons name="mail-outline" size={20} color="#8A9AAF" />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor={colors.inputPlaceholder}
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
                    color: colors.textPrimary,
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
                    fontSize: 12,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                >
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View>
              <PasswordInput
                placeholder="Password"
                placeholderTextColor={colors.inputPlaceholder}
                textColor={colors.textPrimary}
                fontFamily={preventionTheme.typography.family.body}
                backgroundColor={colors.card}
                borderColor={colors.inputBorder}
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
                    fontSize: 12,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                >
                  {errors.password}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity className="self-end">
              <Text
                style={{
                  color: "#2F80ED",
                  fontSize: 14,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-xl">
            <TouchableOpacity
              className="items-center justify-center rounded-button"
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.7 : 1,
                height: 56,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                {isLoading ? "Logging In..." : "Log In"}
              </Text>
            </TouchableOpacity>
            {authError ? (
              <Text
                className="mt-xs"
                style={{
                  color: colors.error,
                  fontSize: 12,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              >
                {authError}
              </Text>
            ) : null}
          </View>

          <View className="mt-l items-center">
            <Text
              style={{
                color: "#5B6B7A",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" asChild>
                <Text
                  style={{
                    color: "#2F80ED",
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Sign up
                </Text>
              </Link>
            </Text>
          </View>

          <View className="mt-xl items-center">
            <Text
              style={{
                color: "#8896A6",
                fontSize: 12,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Secure login — your health data is safe and private
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
