import { StyleSheet } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export const aiMarkdownStyles = StyleSheet.create({
  body: {
    fontFamily: typo.family.body,
    fontSize: typo.size.bodyLg,
    lineHeight: typo.lineHeight.bodyLg,
    color: colors.textPrimary,
  },
  heading1: {
    fontFamily: typo.family.bold,
    fontSize: typo.size.headline,
    lineHeight: typo.lineHeight.headline,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontFamily: typo.family.bold,
    fontSize: typo.size.subheadlineLg,
    lineHeight: typo.lineHeight.subheadlineLg,
    color: colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  heading3: {
    fontFamily: typo.family.semiBold,
    fontSize: typo.size.subheadline,
    lineHeight: typo.lineHeight.subheadline,
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  strong: {
    fontFamily: typo.family.bold,
  },
  em: {
    fontStyle: "italic",
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  list_item: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet_list_icon: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
    lineHeight: typo.lineHeight.bodyLg,
  },
  ordered_list_icon: {
    color: colors.primary,
    fontFamily: typo.family.semiBold,
    fontSize: typo.size.body,
    marginRight: 8,
    lineHeight: typo.lineHeight.bodyLg,
  },
  code_inline: {
    fontFamily: "Courier",
    fontSize: typo.size.body,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: "#7C3AED",
  },
  code_block: {
    fontFamily: "Courier",
    fontSize: typo.size.body,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    color: colors.textPrimary,
  },
  fence: {
    fontFamily: "Courier",
    fontSize: typo.size.body,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    color: colors.textPrimary,
  },
  blockquote: {
    backgroundColor: "#F0F8FF",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    paddingVertical: 6,
    marginVertical: 8,
    borderRadius: 4,
  },
  link: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  hr: {
    backgroundColor: colors.inputBorder,
    height: 1,
    marginVertical: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: "#F0F4F8",
  },
  th: {
    fontFamily: typo.family.semiBold,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: colors.inputBorder,
  },
  td: {
    fontFamily: typo.family.body,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: colors.inputBorder,
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
});
