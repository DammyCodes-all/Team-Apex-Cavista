import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";
import { useGet } from "@/hooks/use-api-methods";
import { getErrorMessage } from "@/lib/api/client";
import { type ProfileResponse, updateProfile } from "@/lib/api/profile";
import {
  TopHeader,
  AvatarSection,
  BaselineSummary,
  PersonalInfo,
  Preferences,
  Footer,
  type ProfileData,
} from "@/components/profile";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

// ─── Main Screen ───────────────────────────────────────────────────
export default function ProfileTabScreen() {
  const { signOut, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [preferences, setPreferences] = useState({
    trackingSleep: true,
    trackingSteps: true,
    trackingScreenTime: true,
    trackingVoiceStress: false,
  });
  const { data: profile, execute: fetchProfile } =
    useGet<ProfileResponse>("/profile");

  const handleToggleEdit = async () => {
    if (!isEditing) {
      setSaveError(null);
      setIsEditing(true);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const parseNumber = (value: string, fallback = 0) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    try {
      await updateProfile({
        name: profileData?.name.trim() || user?.fullName || "",
        age: parseNumber(profileData?.age || ""),
        gender: profile?.gender ?? "",
        height_cm: parseNumber(profileData?.height || ""),
        weight_kg: parseNumber(profileData?.weight || ""),
        tracking_sleep: preferences.trackingSleep,
        tracking_steps: preferences.trackingSteps,
        tracking_screen_time: preferences.trackingScreenTime,
        tracking_voice_stress: preferences.trackingVoiceStress,
        goals_selected: [],
        goals_custom: "",
      });
      setIsEditing(false);
    } catch (error) {
      setSaveError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogOut = async () => {
    await signOut();
  };

  const handleChangeField = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => {
      const baseProfile: ProfileData = prev ?? {
        name: "",
        age: "",
        height: "",
        weight: "",
      };

      return { ...baseProfile, [field]: value };
    });
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const resolvedName = profile.name || user?.fullName || "";

    setProfileData({
      name: resolvedName,
      age: profile.age ? String(profile.age) : "",
      height: profile.height_cm ? String(profile.height_cm) : "",
      weight: profile.weight_kg ? String(profile.weight_kg) : "",
    });

    setPreferences({
      trackingSleep: profile.tracking_sleep,
      trackingSteps: profile.tracking_steps,
      trackingScreenTime: profile.tracking_screen_time,
      trackingVoiceStress: profile.tracking_voice_stress,
    });
  }, [profile, user?.fullName]);

  const displayName = profileData?.name || user?.fullName || "Profile";
  const displaySubtitle = profile?.email || user?.email || "Premium Member";
  const handleTogglePreference = (
    key: "sleep" | "steps" | "screenTime" | "voiceStress",
  ) => {
    setPreferences((prev) => {
      if (key === "sleep") {
        return { ...prev, trackingSleep: !prev.trackingSleep };
      }
      if (key === "steps") {
        return { ...prev, trackingSteps: !prev.trackingSteps };
      }
      if (key === "screenTime") {
        return { ...prev, trackingScreenTime: !prev.trackingScreenTime };
      }
      return { ...prev, trackingVoiceStress: !prev.trackingVoiceStress };
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <TopHeader
          isEditing={isEditing}
          isSaving={isSaving}
          onToggleEdit={handleToggleEdit}
        />
        {saveError ? (
          <Text
            style={{
              color: colors.error,
              fontFamily: typo.family.body,
              fontSize: typo.size.caption,
              marginBottom: 8,
            }}
          >
            {saveError}
          </Text>
        ) : null}
        <AvatarSection name={displayName} subtitle={displaySubtitle} />
        <BaselineSummary />
        <PersonalInfo
          isEditing={isEditing}
          profileData={
            profileData ?? { name: "", age: "", height: "", weight: "" }
          }
          onChangeField={handleChangeField}
        />
        <Preferences
          trackingSleep={preferences.trackingSleep}
          trackingSteps={preferences.trackingSteps}
          trackingScreenTime={preferences.trackingScreenTime}
          trackingVoiceStress={preferences.trackingVoiceStress}
          onToggle={handleTogglePreference}
        />
        <Footer onLogOut={handleLogOut} />
      </ScrollView>
    </SafeAreaView>
  );
}
