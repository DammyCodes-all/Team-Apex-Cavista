import React from "react";
import { View, Text } from "react-native";
import Markdown from "@ronradtke/react-native-markdown-display";
import { preventionTheme } from "@/constants/tokens";
import { aiMarkdownStyles } from "@/constants/ai-markdown-styles";
import { useTypewriter } from "@/hooks/use-typewriter";

const typo = preventionTheme.typography;
const colors = preventionTheme.colors.light;

interface MarkdownBubbleProps {
  text: string;
  isNew?: boolean;
  onAnimationComplete?: () => void;
  charDelay?: number;
}

/**
 * Renders AI message text with markdown formatting and an optional typewriter reveal.
 * When `isNew` is true, text appears character-by-character. Once complete,
 * calls `onAnimationComplete` so the parent can mark the message as seen.
 */
export function MarkdownBubble({
  text,
  isNew = false,
  onAnimationComplete,
  charDelay = 12,
}: MarkdownBubbleProps) {
  const { displayedText, isComplete } = useTypewriter(text, isNew, charDelay);

  // Notify parent when typewriter finishes
  React.useEffect(() => {
    if (isNew && isComplete && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isNew, isComplete, onAnimationComplete]);

  const textToRender = isNew ? displayedText : text;

  // If text is very simple (no markdown characters), render as plain Text for performance
  const hasMarkdown = /[*_#`\-\[\]>|]/.test(textToRender);

  if (!hasMarkdown) {
    return (
      <View>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.bodyLg,
            lineHeight: typo.lineHeight.bodyLg,
            color: colors.textPrimary,
          }}
        >
          {textToRender}
          {isNew && !isComplete && (
            <Text style={{ color: colors.primary }}>▍</Text>
          )}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Markdown style={aiMarkdownStyles}>
        {isNew && !isComplete ? `${textToRender}▍` : textToRender}
      </Markdown>
    </View>
  );
}
