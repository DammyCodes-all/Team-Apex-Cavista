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
              Create your account
            </Text>
            <Text
              className="mt-xs text-center"
              style={{
                color: "#5B6B7A",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Start your Prevention AI journey
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
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color="#8A9AAF"
                />
                <TextInput
                  placeholder="Full name"
                  placeholderTextColor={colors.inputPlaceholder}
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
                    color: colors.textPrimary,
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
                    fontSize: 12,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                >
                  {errors.name}
                </Text>
              ) : null}
            </View>

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
          </View>

          <View className="mt-xl">
            <TouchableOpacity
              className="items-center justify-center rounded-button"
              onPress={handleSignup}
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
                {isLoading ? "Creating account..." : "Sign Up"}
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
              Already have an account?{" "}
              <Link href="/auth/login" asChild>
                <Text
                  style={{
                    color: "#2F80ED",
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
