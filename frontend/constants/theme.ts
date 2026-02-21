import { Platform } from "react-native";
import { preventionTheme } from "@/constants/tokens";

export const Colors = {
  light: {
    text: preventionTheme.colors.light.textPrimary,
    textSecondary: preventionTheme.colors.light.textSecondary,
    background: preventionTheme.colors.light.background,
    card: preventionTheme.colors.light.card,
    tint: preventionTheme.colors.light.primary,
    icon: preventionTheme.colors.light.tabIconDefault,
    tabIconDefault: preventionTheme.colors.light.tabIconDefault,
    tabIconSelected: preventionTheme.colors.light.tabIconSelected,
    border: preventionTheme.colors.light.inputBorder,
    success: preventionTheme.colors.light.success,
    info: preventionTheme.colors.light.info,
    error: preventionTheme.colors.light.error,
    secondary: preventionTheme.colors.light.secondary,
    accent: preventionTheme.colors.light.accent,
  },
  dark: {
    text: preventionTheme.colors.dark.textPrimary,
    textSecondary: preventionTheme.colors.dark.textSecondary,
    background: preventionTheme.colors.dark.background,
    card: preventionTheme.colors.dark.card,
    tint: preventionTheme.colors.dark.primary,
    icon: preventionTheme.colors.dark.tabIconDefault,
    tabIconDefault: preventionTheme.colors.dark.tabIconDefault,
    tabIconSelected: preventionTheme.colors.dark.tabIconSelected,
    border: preventionTheme.colors.dark.inputBorder,
    success: preventionTheme.colors.dark.success,
    info: preventionTheme.colors.dark.info,
    error: preventionTheme.colors.dark.error,
    secondary: preventionTheme.colors.dark.secondary,
    accent: preventionTheme.colors.dark.accent,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: preventionTheme.typography.family.body,
    medium: preventionTheme.typography.family.medium,
    semiBold: preventionTheme.typography.family.semiBold,
    bold: preventionTheme.typography.family.bold,
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: preventionTheme.typography.family.body,
    medium: preventionTheme.typography.family.medium,
    semiBold: preventionTheme.typography.family.semiBold,
    bold: preventionTheme.typography.family.bold,
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    medium:
      "Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    semiBold:
      "Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    bold: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
