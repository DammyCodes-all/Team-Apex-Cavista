import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Modal,
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

  // Local modal state
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showWhyWeAsk, setShowWhyWeAsk] = useState(false);
  const [errors, setErrors] = useState<{
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
  }>({});

  const WHY_WE_ASK_ITEMS = [
    {
      field: "Name",
      reason:
        "Helps us personalize your health insights and recommendations based on your preferences.",
    },
    {
      field: "Age",
      reason:
        "Age-specific health patterns are critical for accurate risk assessment and prevention strategies.",
    },
    {
      field: "Gender",
      reason:
        "Different health profiles between genders allow us to provide more targeted insights.",
    },
    {
      field: "Height",
      reason:
        "Used to calculate BMI and understand your baseline physical metrics for health analysis.",
    },
    {
      field: "Weight",
      reason:
        "Combines with height to assess your health metrics and track meaningful changes over time.",
    },
  ];

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C9DCE8" }}>
      <OnboardingSwipeView step={3} totalSteps={5}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 20,
          }}
          style={{
            backgroundColor: "#C9DCE8",
          }}
        >
          <View className="items-center pt-l">
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

          <View style={{ flex: 1, justifyContent: "center" }}>
            <View className="mt-xl items-center px-l">
              <Text
                style={{
                  color: "#2D3449",
                  fontSize: 42 / 2,
                  lineHeight: 50 / 2,
                  fontFamily: preventionTheme.typography.family.bold,
                }}
              >
                Let&apos;s Learn About You
              </Text>

              <Text
                className="mt-s text-center"
                style={{
                  color: "#4E6177",
                  fontSize: 16,
                  lineHeight: 26,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              >
                This helps the AI give personalized health insights.
              </Text>
            </View>

            <View
              className="mt-l py-5 rounded-3xl "
              style={{
                backgroundColor: "#EEF4F8",
                padding: 15,
              }}
            >
              <View style={{ gap: 10 }}>
                <View
                  className="flex-row items-center rounded-2xl"
                  style={{
                    backgroundColor: "#F5F8FB",
                    borderWidth: 1,
                    borderColor: "#D3DEE8",
                    paddingHorizontal: 14,
                    height: 52,
                  }}
                >
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#90A2B7"
                  />
                  <TextInput
                    placeholder="Age"
                    placeholderTextColor="#8A9CB1"
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={(value) => {
                      setAge(value);
                      if (errors.age) {
                        setErrors((prev) => ({ ...prev, age: undefined }));
                      }
                    }}
                    style={{
                      flex: 1,
                      marginLeft: 12,
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
                    }}
                  >
                    {errors.age}
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={() => setShowGenderModal(true)}
                  className="flex-row items-center rounded-2xl"
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: "#F5F8FB",
                    borderWidth: 1,
                    borderColor: "#D3DEE8",
                    paddingHorizontal: 14,
                    height: 52,
                  }}
                >
                  <MaterialIcons
                    name="sentiment-satisfied"
                    size={20}
                    color="#90A2B7"
                  />
                  <Text
                    style={{
                      marginLeft: 12,
                      color: gender ? "#2D3449" : "#8A9CB1",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                      flex: 1,
                    }}
                  >
                    {gender
                      ? GENDER_OPTIONS.find((g) => g.id === gender)?.label
                      : "Select gender"}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={22}
                    color="#90A2B7"
                  />
                </TouchableOpacity>

                <View
                  className="flex-row items-center rounded-2xl"
                  style={{
                    backgroundColor: "#F5F8FB",
                    borderWidth: 1,
                    borderColor: "#D3DEE8",
                    paddingHorizontal: 14,
                    height: 52,
                  }}
                >
                  <MaterialIcons name="height" size={20} color="#90A2B7" />
                  <TextInput
                    placeholder="Height (ft/in)"
                    placeholderTextColor="#8A9CB1"
                    keyboardType="decimal-pad"
                    value={height}
                    onChangeText={(value) => {
                      setHeight(value);
                      if (errors.height) {
                        setErrors((prev) => ({ ...prev, height: undefined }));
                      }
                    }}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      color: "#2D3449",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  />
                  <Text
                    style={{
                      color: "#2F80ED",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.medium,
                    }}
                  >
                    cm
                  </Text>
                </View>
                {errors.height ? (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  >
                    {errors.height}
                  </Text>
                ) : null}

                <View
                  className="flex-row items-center rounded-2xl"
                  style={{
                    backgroundColor: "#F5F8FB",
                    borderWidth: 1,
                    borderColor: "#D3DEE8",
                    paddingHorizontal: 14,
                    height: 52,
                  }}
                >
                  <MaterialIcons
                    name="monitor-weight"
                    size={20}
                    color="#90A2B7"
                  />
                  <TextInput
                    placeholder="Weight (lbs)"
                    placeholderTextColor="#8A9CB1"
                    keyboardType="decimal-pad"
                    value={weight}
                    onChangeText={(value) => {
                      setWeight(value);
                      if (errors.weight) {
                        setErrors((prev) => ({ ...prev, weight: undefined }));
                      }
                    }}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      color: "#2D3449",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  />
                  <Text
                    style={{
                      color: "#2F80ED",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.medium,
                    }}
                  >
                    kg
                  </Text>
                </View>
                {errors.weight ? (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: preventionTheme.typography.family.body,
                    }}
                  >
                    {errors.weight}
                  </Text>
                ) : null}
              </View>
            </View>
            {errors.gender ? (
              <Text
                className="mt-s"
                style={{
                  color: colors.error,
                  fontSize: 12,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              >
                {errors.gender}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() => setShowWhyWeAsk(!showWhyWeAsk)}
              className="mt-m h-12 flex-row items-center justify-center rounded-2xl"
              activeOpacity={0.85}
              style={{ backgroundColor: "#DCE8EF" }}
            >
              <Text
                style={{
                  color: "#2F80ED",
                  fontSize: 16,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Why we ask
              </Text>
              <MaterialIcons
                name={
                  showWhyWeAsk ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={20}
                color="#2F80ED"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            {showWhyWeAsk && (
              <View
                className="mt-m rounded-2xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#D8E4EC",
                  overflow: "hidden",
                }}
              >
                {WHY_WE_ASK_ITEMS.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      borderBottomWidth:
                        index < WHY_WE_ASK_ITEMS.length - 1 ? 1 : 0,
                      borderBottomColor: "#E8EEF4",
                    }}
                  >
                    <View style={{ padding: 14 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <View
                          style={{
                            width: 4,
                            height: 16,
                            backgroundColor: colors.primary,
                            borderRadius: 2,
                            marginRight: 10,
                          }}
                        />
                        <Text
                          style={{
                            color: "#2D3449",
                            fontSize: 15,
                            fontFamily:
                              preventionTheme.typography.family.semiBold,
                          }}
                        >
                          {item.field}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: "#60718A",
                          fontSize: 13,
                          lineHeight: 20,
                          fontFamily: preventionTheme.typography.family.body,
                          marginLeft: 14,
                        }}
                      >
                        {item.reason}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View className="mt-l">
              <TouchableOpacity
                onPress={handleContinue}
                className="h-14 items-center justify-center rounded-button"
                style={{ backgroundColor: colors.primary }}
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
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

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
                        paddingVertical: 0,
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
