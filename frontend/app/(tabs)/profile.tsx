import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

export default function ProfileTabScreen() {
  const colors = preventionTheme.colors.light;
  const { user } = useAuth();

  const [dailyAnalysisEnabled, setDailyAnalysisEnabled] = useState(true);
  const [healthKitEnabled, setHealthKitEnabled] = useState(true);
  const [shareAnonymousEnabled, setShareAnonymousEnabled] = useState(false);
  const [appearanceMode, setAppearanceMode] = useState<"light" | "dark">(
    "light"
  );

  const baselineCards = [
    {
      icon: "heart",
      value: "98",
      unit: "/100",
      label: "Cardio Score",
      status: "Low Risk",
    },
    {
      icon: "activity",
      value: "Low",
      label: "Stress Baseline",
      status: "Steady",
    },
    {
      icon: "droplet",
      value: "62",
      unit: "ms",
      label: "Recovery",
      status: "Improving",
    },
  ];

  const personalInfo = [
    { label: "Name", value: user?.fullName || "Alex Doe" },
    { label: "Age", value: "34" },
    { label: "Height", value: "175", unit: "cm" },
    { label: "Weight", value: "68", unit: "kg" },
  ];

  const preferences = [
    {
      label: "AI Daily Analysis",
      value: dailyAnalysisEnabled,
      setValue: setDailyAnalysisEnabled,
    },
    {
      label: "HealthKit Sync",
      value: healthKitEnabled,
      setValue: setHealthKitEnabled,
    },
    {
      label: "Share Anonymous Data",
      value: shareAnonymousEnabled,
      setValue: setShareAnonymousEnabled,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingHorizontal: preventionTheme.spacing.m,
          paddingTop: preventionTheme.spacing.s,
          paddingBottom: preventionTheme.spacing.m,
          backgroundColor: colors.background,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Text
            style={{
              color: colors.primary,
              fontFamily: preventionTheme.typography.family.semiBold,
              fontSize: preventionTheme.typography.size.bodyLg,
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: preventionTheme.spacing.m,
          paddingTop: 0,
          paddingBottom: preventionTheme.spacing.xl,
          gap: preventionTheme.spacing.m,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: preventionTheme.spacing.xs }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: preventionTheme.typography.family.bold,
              fontSize: preventionTheme.typography.size.headline,
              lineHeight: preventionTheme.typography.lineHeight.headline,
            }}
          >
            Your Profile & Preferences
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: preventionTheme.spacing.s,
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 4 }}>
            <View
              style={{
                width: 112,
                height: 112,
                borderRadius: 56,
                backgroundColor: colors.card,
                borderWidth: 2,
                borderColor: colors.inputBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontFamily: preventionTheme.typography.family.bold,
                  fontSize: 44,
                }}
              >
                {(user?.fullName?.slice(0, 1) || "A").toUpperCase()}
              </Text>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 8,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: colors.card,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="camera" size={16} color={colors.card} />
            </View>
          </View>

          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: preventionTheme.typography.family.bold,
              fontSize: 42,
              lineHeight: 50,
            }}
          >
            {(user?.fullName || "Alex Doe").split(" ")[0]}
          </Text>

          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: preventionTheme.typography.family.body,
              fontSize: preventionTheme.typography.size.bodyLg,
            }}
          >
            Premium Member since Jan 2023
          </Text>
        </View>

        <View style={{ gap: preventionTheme.spacing.m }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily: preventionTheme.typography.family.bold,
                fontSize: preventionTheme.typography.size.subheadlineLg,
              }}
            >
              Baseline Summary
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: preventionTheme.typography.family.medium,
                fontSize: preventionTheme.typography.size.caption,
                letterSpacing: 1,
              }}
            >
              AI ANALYSIS
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: preventionTheme.spacing.s }}>
            {baselineCards.map((card) => (
              <View
                key={card.label}
                style={{
                  width: 170,
                  borderWidth: 1,
                  borderColor: colors.secondary,
                  borderRadius: preventionTheme.radius.md,
                  backgroundColor: colors.card,
                  paddingVertical: preventionTheme.spacing.m,
                  paddingHorizontal: preventionTheme.spacing.m,
                  gap: preventionTheme.spacing.s,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Feather name={card.icon as keyof typeof Feather.glyphMap} size={20} color={colors.primary} />
                  <Text
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: colors.secondary,
                      paddingHorizontal: preventionTheme.spacing.s,
                      paddingVertical: 2,
                      borderRadius: 999,
                      fontFamily: preventionTheme.typography.family.semiBold,
                      fontSize: preventionTheme.typography.size.caption,
                    }}
                  >
                    {card.status}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontFamily: preventionTheme.typography.family.bold,
                      fontSize: 38,
                      lineHeight: 40,
                    }}
                  >
                    {card.value}
                  </Text>
                  {!!card.unit && (
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontFamily: preventionTheme.typography.family.body,
                        fontSize: preventionTheme.typography.size.bodyLg,
                        marginBottom: 3,
                      }}
                    >
                      {card.unit}
                    </Text>
                  )}
                </View>

                <Text
                  style={{
                    color: colors.textPrimary,
                    fontFamily: preventionTheme.typography.family.body,
                    fontSize: preventionTheme.typography.size.subheadline,
                  }}
                >
                  {card.label}
                </Text>
              </View>
            ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ gap: preventionTheme.spacing.s }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: preventionTheme.typography.family.bold,
              fontSize: preventionTheme.typography.size.subheadlineLg,
            }}
          >
            Personal Info
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: preventionTheme.radius.md,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              overflow: "hidden",
            }}
          >
            {personalInfo.map((item, index) => (
              <View
                key={item.label}
                style={{
                  minHeight: 54,
                  paddingHorizontal: preventionTheme.spacing.m,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: index === personalInfo.length - 1 ? 0 : 1,
                  borderBottomColor: colors.inputBorder,
                }}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: preventionTheme.typography.family.body,
                    fontSize: preventionTheme.typography.size.subheadline,
                  }}
                >
                  {item.label}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontFamily: preventionTheme.typography.family.medium,
                      fontSize: preventionTheme.typography.size.subheadline,
                    }}
                  >
                    {item.value}
                  </Text>
                  {!!item.unit && (
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontFamily: preventionTheme.typography.family.body,
                        fontSize: preventionTheme.typography.size.bodyLg,
                      }}
                    >
                      {item.unit}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: preventionTheme.spacing.s }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: preventionTheme.typography.family.bold,
              fontSize: preventionTheme.typography.size.subheadlineLg,
            }}
          >
            Preferences
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: preventionTheme.typography.family.body,
              fontSize: preventionTheme.typography.size.bodyLg,
            }}
          >
            These settings help AI generate your daily risk score.
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: preventionTheme.radius.md,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              overflow: "hidden",
            }}
          >
            {preferences.map((item, index) => (
              <View
                key={item.label}
                style={{
                  minHeight: 58,
                  paddingHorizontal: preventionTheme.spacing.m,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: index === preferences.length - 1 ? 0 : 1,
                  borderBottomColor: colors.inputBorder,
                }}
              >
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontFamily: preventionTheme.typography.family.medium,
                      fontSize: preventionTheme.typography.size.body,
                    }}
                  >
                  {item.label}
                </Text>

                <Switch
                  value={item.value}
                  onValueChange={item.setValue}
                  trackColor={{ false: colors.inputBorder, true: colors.primary }}
                  thumbColor={colors.card}
                  ios_backgroundColor={colors.inputBorder}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: preventionTheme.spacing.m }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: preventionTheme.typography.family.bold,
              fontSize: preventionTheme.typography.size.subheadlineLg,
            }}
          >
            App Appearance
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: preventionTheme.radius.md,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              padding: 4,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setAppearanceMode("light")}
              style={{
                flex: 1,
                borderRadius: preventionTheme.radius.sm,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: preventionTheme.spacing.s,
                backgroundColor:
                  appearanceMode === "light" ? colors.background : colors.card,
              }}
            >
              <Feather name="sun" size={16} color={colors.textPrimary} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontFamily: preventionTheme.typography.family.semiBold,
                  fontSize: preventionTheme.typography.size.button,
                }}
              >
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setAppearanceMode("dark")}
              style={{
                flex: 1,
                borderRadius: preventionTheme.radius.sm,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: preventionTheme.spacing.s,
                backgroundColor:
                  appearanceMode === "dark" ? colors.background : colors.card,
              }}
            >
              <Feather name="moon" size={16} color={colors.textSecondary} />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: preventionTheme.typography.family.semiBold,
                  fontSize: preventionTheme.typography.size.button,
                }}
              >
                Dark
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              borderWidth: 1,
              borderColor: colors.error,
              borderRadius: preventionTheme.radius.md,
              height: 62,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: preventionTheme.spacing.s,
            }}
          >
            <Feather name="trash-2" size={18} color={colors.error} />
            <Text
              style={{
                color: colors.error,
                fontFamily: preventionTheme.typography.family.medium,
                fontSize: preventionTheme.typography.size.subheadline,
              }}
            >
              Delete Account
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              fontFamily: preventionTheme.typography.family.body,
              fontSize: preventionTheme.typography.size.caption,
            }}
          >
            Version 1.4.2 | Build 889
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
