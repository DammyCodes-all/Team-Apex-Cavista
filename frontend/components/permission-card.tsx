import { Switch, Text, View } from "react-native";

import type { Permission } from "@/constants/permissions";
import { preventionTheme } from "@/constants/tokens";

interface PermissionCardProps {
  permission: Permission;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  activeColor: string;
}

export function PermissionCard({
  permission,
  isEnabled,
  onToggle,
  activeColor,
}: PermissionCardProps) {
  return (
    <View
      className="flex-row items-center rounded-2xl"
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E4EC",
        paddingHorizontal: 14,
        paddingVertical: 13,
      }}
    >
      <Text style={{ fontSize: 30, marginRight: 12 }}>{permission.icon}</Text>

      <View style={{ flex: 1 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text
            style={{
              color: "#2D3449",
              fontSize: 30 / 2,
              lineHeight: 36 / 2,
              fontFamily: preventionTheme.typography.family.semiBold,
              flexShrink: 1,
            }}
          >
            {permission.title}
          </Text>

          {permission.optional ? (
            <View
              className="rounded-md"
              style={{
                backgroundColor: "#FDECC8",
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: "#DD8B00",
                  fontSize: 11,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                OPTIONAL
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          style={{
            color: "#60718A",
            fontSize: 24 / 2,
            lineHeight: 30 / 2,
            fontFamily: preventionTheme.typography.family.body,
            marginTop: 4,
          }}
        >
          {permission.subtitle}
        </Text>
      </View>

      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: "#D3DCE6", true: activeColor }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D3DCE6"
      />
    </View>
  );
}
