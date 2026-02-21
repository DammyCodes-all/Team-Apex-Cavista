import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const SCREEN_WIDTH = Dimensions.get("window").width;

// ─── Top Header (back arrow + Edit/Save) ──────────────────────────
function TopHeader({
  isEditing,
  onToggleEdit,
}: {
  isEditing: boolean;
  onToggleEdit: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        // marginTop: 10,
      }}
    >
      <TouchableOpacity>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleEdit}>
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.bodyLg,
            lineHeight: typo.lineHeight.bodyLg,
            color: isEditing ? colors.success : colors.primary,
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Avatar Section ────────────────────────────────────────────────
function AvatarSection() {
  return (
    <View style={{ alignItems: "center", marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.headline,
          lineHeight: typo.lineHeight.headline,
          color: colors.textPrimary,
          alignSelf: "flex-start",
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        Your Profile & Preferences
      </Text>

      {/* Avatar circle */}
      <View style={{ position: "relative", marginBottom: 14 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#D5EFE6",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Ionicons name="person" size={56} color="#5BA68A" />
        </View>
        {/* Camera badge */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.card,
          }}
        >
          <Ionicons name="camera" size={14} color="#fff" />
        </View>
      </View>

      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.subheadlineLg,
          lineHeight: typo.lineHeight.subheadlineLg,
          color: colors.textPrimary,
          marginBottom: 2,
        }}
      >
        Alex Doe
      </Text>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
        }}
      >
        Premium Member since Jan 2023
      </Text>
    </View>
  );
}

// ─── Baseline Summary ──────────────────────────────────────────────
function BaselineSummary() {
  const cardW = (SCREEN_WIDTH - 64) / 2;

  const summaryCards = [
    {
      icon: "heart-outline" as const,
      iconColor: "#10b981",
      badgeText: "Low Risk",
      badgeBg: "#E8F5E9",
      badgeColor: "#10b981",
      value: "98",
      valueSuffix: "/100",
      label: "Cardio Score",
    },
    {
      icon: "body-outline" as const,
      iconColor: colors.primary,
      badgeText: "Steady",
      badgeBg: "#E8F5E9",
      badgeColor: "#10b981",
      value: "Low",
      valueSuffix: "",
      label: "Stress Baseline",
    },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.semiBold,
            fontSize: typo.size.subheadline,
            lineHeight: typo.lineHeight.subheadline,
            color: colors.textPrimary,
          }}
        >
          Baseline Summary
        </Text>
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.caption,
            lineHeight: typo.lineHeight.caption,
            color: colors.textSecondary,
            letterSpacing: 1.5,
          }}
        >
          AI ANALYSIS
        </Text>
      </View>

      {/* Cards row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {summaryCards.map((card, index) => (
          <View
            key={index}
            style={{
              width: cardW,
              backgroundColor: "#F0FAF5",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#D5EFE6",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.card,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={card.icon} size={18} color={card.iconColor} />
              </View>
              <View
                style={{
                  backgroundColor: card.badgeBg,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: typo.family.medium,
                    fontSize: typo.size.caption,
                    lineHeight: typo.lineHeight.caption,
                    color: card.badgeColor,
                  }}
                >
                  {card.badgeText}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 4 }}>
              <Text
                style={{
                  fontFamily: typo.family.bold,
                  fontSize: typo.size.headline,
                  lineHeight: typo.lineHeight.headline,
                  color: colors.textPrimary,
                }}
              >
                {card.value}
                {card.valueSuffix ? (
                  <Text
                    style={{
                      fontFamily: typo.family.body,
                      fontSize: typo.size.body,
                      lineHeight: typo.lineHeight.body,
                      color: colors.textSecondary,
                    }}
                  >
                    {card.valueSuffix}
                  </Text>
                ) : null}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                lineHeight: typo.lineHeight.caption,
                color: colors.textSecondary,
              }}
            >
              {card.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Personal Info ─────────────────────────────────────────────────
interface ProfileData {
  name: string;
  age: string;
  height: string;
  weight: string;
}

function PersonalInfo({
  isEditing,
  profileData,
  onChangeField,
}: {
  isEditing: boolean;
  profileData: ProfileData;
  onChangeField: (field: keyof ProfileData, value: string) => void;
}) {
  const rows: {
    label: string;
    field: keyof ProfileData;
    unit: string;
    keyboard: "default" | "numeric";
  }[] = [
    { label: "Name", field: "name", unit: "", keyboard: "default" },
    { label: "Age", field: "age", unit: "", keyboard: "numeric" },
    { label: "Height", field: "height", unit: "cm", keyboard: "numeric" },
    { label: "Weight", field: "weight", unit: "kg", keyboard: "numeric" },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
          marginBottom: 14,
        }}
      >
        Personal Info
      </Text>

      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          overflow: "hidden",
        }}
      >
        {rows.map((row, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: isEditing ? 8 : 14,
              paddingHorizontal: 16,
              borderBottomWidth: index < rows.length - 1 ? 1 : 0,
              borderBottomColor: colors.inputBorder,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textSecondary,
              }}
            >
              {row.label}
            </Text>

            {isEditing ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <TextInput
                  value={profileData[row.field]}
                  onChangeText={(text) => onChangeField(row.field, text)}
                  keyboardType={row.keyboard}
                  style={{
                    fontFamily: typo.family.medium,
                    fontSize: typo.size.body,
                    lineHeight: typo.lineHeight.body,
                    color: colors.textPrimary,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    minWidth: 80,
                    textAlign: "right",
                  }}
                />
                {row.unit ? (
                  <Text
                    style={{
                      fontFamily: typo.family.body,
                      fontSize: typo.size.caption,
                      lineHeight: typo.lineHeight.caption,
                      color: colors.textSecondary,
                    }}
                  >
                    {row.unit}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: typo.family.medium,
                    fontSize: typo.size.body,
                    lineHeight: typo.lineHeight.body,
                    color: colors.textPrimary,
                  }}
                >
                  {profileData[row.field]}
                </Text>
                {row.unit ? (
                  <Text
                    style={{
                      fontFamily: typo.family.body,
                      fontSize: typo.size.caption,
                      lineHeight: typo.lineHeight.caption,
                      color: colors.textSecondary,
                    }}
                  >
                    {row.unit}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Preferences ───────────────────────────────────────────────────
function Preferences() {
  const [aiDaily, setAiDaily] = useState(true);
  const [healthKit, setHealthKit] = useState(true);
  const [shareAnon, setShareAnon] = useState(false);

  const toggles = [
    { label: "AI Daily Analysis", value: aiDaily, setter: setAiDaily },
    { label: "HealthKit Sync", value: healthKit, setter: setHealthKit },
    { label: "Share Anonymous Data", value: shareAnon, setter: setShareAnon },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        Preferences
      </Text>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
          marginBottom: 14,
        }}
      >
        These settings help AI generate your daily risk score.
      </Text>

      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          overflow: "hidden",
        }}
      >
        {toggles.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: index < toggles.length - 1 ? 1 : 0,
              borderBottomColor: colors.inputBorder,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textPrimary,
              }}
            >
              {item.label}
            </Text>
            <Switch
              value={item.value}
              onValueChange={item.setter}
              trackColor={{ false: "#E0E0E0", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Log Out + Version ─────────────────────────────────────────────
function Footer({ onLogOut }: { onLogOut: () => void }) {
  const handleLogOut = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: onLogOut,
        },
      ],
    );
  };

  return (
    <View style={{ alignItems: "center", marginBottom: 24 }}>
      <TouchableOpacity
        onPress={handleLogOut}
        style={{
          width: "100%",
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#FECACA",
          backgroundColor: "#FFF5F5",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.bodyLg,
            lineHeight: typo.lineHeight.bodyLg,
            color: colors.error,
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
        }}
      >
        Version 1.4.2 | Build 889
      </Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function ProfileTabScreen() {
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Alex Doe",
    age: "34",
    height: "175",
    weight: "68",
  });

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleLogOut = async () => {
    await signOut();
  };

  const handleChangeField = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <TopHeader isEditing={isEditing} onToggleEdit={handleToggleEdit} />
        <AvatarSection />
        <BaselineSummary />
        <PersonalInfo
          isEditing={isEditing}
          profileData={profileData}
          onChangeField={handleChangeField}
        />
        <Preferences />
        <Footer onLogOut={handleLogOut} />
      </ScrollView>
    </SafeAreaView>
  );
}
