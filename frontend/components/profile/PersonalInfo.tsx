import React from "react";
import { View, Text, TextInput } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export interface ProfileData {
  name: string;
  age: string;
  height: string;
  weight: string;
}

interface PersonalInfoProps {
  isEditing: boolean;
  profileData: ProfileData;
  onChangeField: (field: keyof ProfileData, value: string) => void;
}

export function PersonalInfo({
  isEditing,
  profileData,
  onChangeField,
}: PersonalInfoProps) {
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
