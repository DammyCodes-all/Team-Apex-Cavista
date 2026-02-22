import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme() ?? "light";
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const linkColor = Colors[colorScheme].accent;

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? [styles.link, { color: linkColor }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts?.sans,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts?.semiBold,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: Fonts?.bold,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts?.semiBold,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
