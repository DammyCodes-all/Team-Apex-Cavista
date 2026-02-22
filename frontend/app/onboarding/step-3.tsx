import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function OnboardingStepThree() {
  const colors = preventionTheme.colors.light;

  // Form state from global store
  const age = useOnboardingStore((state) => state.age);
  const setAge = useOnboardingStore((state) => state.setAge);

  const gender = useOnboardingStore((state) => state.gender);
  const setGender = useOnboardingStore((state) => state.setGender);

  const height = useOnboardingStore((state) => state.height);
  const setHeight = useOnboardingStore((state) => state.setHeight);

  const weight = useOnboardingStore((state) => state.weight);
  const setWeight = useOnboardingStore((state) => state.setWeight);

  // Local state
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [skipAnonymity, setSkipAnonymity] = useState(false);
  const [errors, setErrors] = useState<{
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
  }>({});

  const name = useOnboardingStore((state) => state.name);
  const setName = useOnboardingStore((state) => state.setName);

  const GENDER_OPTIONS = [
    { id: "female", label: "Female", icon: "female" },
    { id: "male", label: "Male", icon: "male" },
  ];

  const validateForm = () => {
    const nextErrors: {
      age?: string;
      gender?: string;
      height?: string;
      weight?: string;
    } = {};

    if (!age.trim()) {
      nextErrors.age = "Age is required";
    } else if (Number.isNaN(Number(age)) || Number(age) <= 0) {
      nextErrors.age = "Enter a valid age";
    }

    if (!gender?.trim()) {
      nextErrors.gender = "Gender is required";
    }

    if (!height.trim()) {
      nextErrors.height = "Height is required";
    } else if (Number.isNaN(Number(height)) || Number(height) <= 0) {
      nextErrors.height = "Enter a valid height";
    }

    if (!weight.trim()) {
      nextErrors.weight = "Weight is required";
    } else if (Number.isNaN(Number(weight)) || Number(weight) <= 0) {
      nextErrors.weight = "Enter a valid weight";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    router.push("/onboarding/step-4");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
      <OnboardingSwipeView step={3} totalSteps={5}>
        <View style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 55,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step dots */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <OnboardingStepDots
                step={3}
                totalSteps={5}
                labelColor="#5C6875"
                labelFontSize={16}
                labelFontFamily={preventionTheme.typography.family.medium}
                activeColor={colors.primary}
                inactiveColor="#90A5B5"
                activeSize={16}
                inactiveSize={8}
                gap={10}
              />
            </View>

            {/* Heading */}
            <Text
              style={{
                color: "#2D3449",
                fontSize: 26,
                lineHeight: 40,
                fontFamily: preventionTheme.typography.family.bold,
                marginBottom: 5,
              }}
            >
              Let's Learn About You
            </Text>
            <Text
              style={{
                color: "#4E6177",
                fontSize: 16,
                lineHeight: 24,
                fontFamily: preventionTheme.typography.family.body,
                marginBottom: 16,
              }}
            >
              This helps the AI give personalized health insights.
            </Text>

            {/* Full Name */}
            <Text
              style={{
                color: "#2D3449",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.semiBold,
                marginBottom: 8,
              }}
            >
              Full Name
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E2EAF0",
                paddingHorizontal: 14,
                height: 56,
                marginBottom: 10,
              }}
            >
              <Ionicons name="person-outline" size={20} color="#A0B0C0" />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#A0B0C0"
                value={name}
                onChangeText={setName}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  color: "#2D3449",
                  fontSize: 16,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              />
            </View>

            {/* Age + Gender row */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginBottom: 10,
              }}
            >
              {/* Age */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#2D3449",
                    fontSize: 14,
                    fontFamily: preventionTheme.typography.family.semiBold,
                    marginBottom: 8,
                  }}
                >
                  Age
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: errors.age ? colors.error : "#E2EAF0",
                    paddingHorizontal: 14,
                    height: 56,
                  }}
                >
                  <TextInput
                    placeholder="28"
                    placeholderTextColor="#A0B0C0"
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={(v) => {
                      setAge(v);
                      if (errors.age)
                        setErrors((prev) => ({ ...prev, age: undefined }));
                    }}
                    style={{
                      flex: 1,
                      color: "#2D3449",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  />
                </View>
                {errors.age ? (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: preventionTheme.typography.family.body,
                      marginTop: 4,
                    }}
                  >
                    {errors.age}
                  </Text>
                ) : null}
              </View>

              {/* Gender */}
              <View style={{ flex: 1.4 }}>
                <Text
                  style={{
                    color: "#2D3449",
                    fontSize: 14,
                    fontFamily: preventionTheme.typography.family.semiBold,
                    marginBottom: 8,
                  }}
                >
                  Gender
                </Text>
                <TouchableOpacity
                  onPress={() => setShowGenderModal(true)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: errors.gender ? colors.error : "#E2EAF0",
                    paddingHorizontal: 14,
                    height: 56,
                  }}
                >
                  <Ionicons name="people-outline" size={20} color="#A0B0C0" />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: gender ? "#2D3449" : "#A0B0C0",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  >
                    {gender
                      ? GENDER_OPTIONS.find((g) => g.id === gender)?.label
                      : "Select gender"}
                  </Text>
                  <Ionicons
                    name="chevron-down-outline"
                    size={18}
                    color="#A0B0C0"
                  />
                </TouchableOpacity>
                {errors.gender ? (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: preventionTheme.typography.family.body,
                      marginTop: 4,
                    }}
                  >
                    {errors.gender}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Height + Weight row */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* Height */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#2D3449",
                    fontSize: 14,
                    fontFamily: preventionTheme.typography.family.semiBold,
                    marginBottom: 8,
                  }}
                >
                  Height
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: errors.height ? colors.error : "#E2EAF0",
                    paddingHorizontal: 14,
                    height: 56,
                  }}
                >
                  <Ionicons
                    name="swap-vertical-outline"
                    size={20}
                    color="#A0B0C0"
                  />
                  <TextInput
                    placeholder="170"
                    placeholderTextColor="#A0B0C0"
                    keyboardType="decimal-pad"
                    value={height}
                    onChangeText={(v) => {
                      setHeight(v);
                      if (errors.height)
                        setErrors((prev) => ({ ...prev, height: undefined }));
                    }}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: "#2D3449",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "#EDF2F7",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#5D7A94",
                        fontSize: 13,
                        fontFamily: preventionTheme.typography.family.medium,
                      }}
                    >
                      cm
                    </Text>
                  </View>
                </View>
                {errors.height ? (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: preventionTheme.typography.family.body,
                      marginTop: 4,
                    }}
                  >
                    {errors.height}
                  </Text>
                ) : null}
              </View>

              {/* Weight */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#2D3449",
                    fontSize: 14,
                    fontFamily: preventionTheme.typography.family.semiBold,
                    marginBottom: 8,
                  }}
                >
                  Weight
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: errors.weight ? colors.error : "#E2EAF0",
                    paddingHorizontal: 14,
                    height: 56,
                  }}
                >
                  <Ionicons name="cube-outline" size={20} color="#A0B0C0" />
                  <TextInput
                    placeholder="65"
                    placeholderTextColor="#A0B0C0"
                    keyboardType="decimal-pad"
                    value={weight}
                    onChangeText={(v) => {
                      setWeight(v);
                      if (errors.weight)
                        setErrors((prev) => ({ ...prev, weight: undefined }));
                    }}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: "#2D3449",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "#EDF2F7",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#5D7A94",
                        fontSize: 13,
                        fontFamily: preventionTheme.typography.family.medium,
                      }}
                    >
                      kg
                    </Text>
                  </View>
                </View>
                {errors.weight ? (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: preventionTheme.typography.family.body,
                      marginTop: 4,
                    }}
                  >
                    {errors.weight}
                  </Text>
                ) : null}
              </View>
            </View>
          </ScrollView>

          {/* Fixed bottom button */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 24,
              backgroundColor: "#F5F8FB",
              borderTopWidth: 1,
              borderTopColor: "#E8EEF4",
            }}
          >
            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.85}
              style={{
                height: 56,
                backgroundColor: colors.primary,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Save & Continue
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showGenderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setShowGenderModal(false)}
              activeOpacity={1}
            />

            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 20,
                paddingHorizontal: 20,
                paddingBottom: 32,
                maxHeight: "70%",
              }}
            >
              <View
                className="flex-row items-center justify-between"
                style={{ marginBottom: 16 }}
              >
                <Text
                  style={{
                    color: "#2D3449",
                    fontSize: 18,
                    fontFamily: preventionTheme.typography.family.bold,
                  }}
                >
                  Select Gender
                </Text>

                <TouchableOpacity
                  onPress={() => setShowGenderModal(false)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color="#90A2B7" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={true}>
                <View style={{ gap: 10 }}>
                  {GENDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => {
                        setGender(option.id);
                        if (errors.gender) {
                          setErrors((prev) => ({ ...prev, gender: undefined }));
                        }
                        setShowGenderModal(false);
                      }}
                      activeOpacity={0.8}
                      className="flex-row items-center rounded-2xl"
                      style={{
                        backgroundColor:
                          gender === option.id ? "#E8F4F9" : "#F5F8FB",
                        borderWidth: 2,
                        borderColor:
                          gender === option.id ? colors.primary : "#D3DEE8",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                      }}
                    >
                      <MaterialIcons
                        name={option.icon as any}
                        size={24}
                        color={
                          gender === option.id ? colors.primary : "#90A2B7"
                        }
                      />
                      <Text
                        style={{
                          marginLeft: 12,
                          color:
                            gender === option.id ? colors.primary : "#2D3449",
                          fontSize: 16,
                          fontFamily: preventionTheme.typography.family.medium,
                          flex: 1,
                        }}
                      >
                        {option.label}
                      </Text>

                      {gender === option.id && (
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                activeOpacity={0.85}
                className="h-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: "#DCE8EF",
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    color: "#2F80ED",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
