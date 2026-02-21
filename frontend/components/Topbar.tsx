import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";
export const Topbar = () => {
  const colors = preventionTheme.colors.light;
  return (
    <View
      style={{
        paddingHorizontal: preventionTheme.spacing.m,
        paddingTop: preventionTheme.spacing.s,
        paddingBottom: preventionTheme.spacing.s,
        backgroundColor: colors.background,
        zIndex: 10,
      }}
    >
      {" "}
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
            fontSize: preventionTheme.typography.size.subheadline,
          }}
        >
          Prevention AI
        </Text>

        <View style={{ flexDirection: "row", gap: preventionTheme.spacing.s }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: colors.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.textPrimary}
            />
            <View
              style={{
                position: "absolute",
                top: 4,
                right: 6,
                minWidth: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: colors.error,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 2,
              }}
            >
              <Text
                style={{
                  color: colors.card,
                  fontSize: 9,
                  fontFamily: preventionTheme.typography.family.bold,
                  lineHeight: 12,
                }}
              >
                2
              </Text>
            </View>
          </View>

          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: colors.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={colors.textPrimary}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
