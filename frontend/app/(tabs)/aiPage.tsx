import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { sendChatMessage } from "@/lib/api/ai";
import { useChatStore, type ChatMessage } from "@/stores/chat-store";
import {
  TypingIndicator,
  AiMessageBubble,
  UserMessageBubble,
  ActionButtons,
  ChatHeader,
  InputBar,
  SuggestedPrompts,
  ErrorBanner,
} from "@/components/ai";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

// ─── Helpers ────────────────────────────────────────────────────────

function getTimeString(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const mm = m < 10 ? `0${m}` : m;
  return `Today, ${h12}:${mm} ${ampm}`;
}

// ─── Error Message Mapping ──────────────────────────────────────────

function mapErrorToUserMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;

    // Axios error with response data
    const responseData = (err.response as Record<string, unknown>)?.data as
      | Record<string, unknown>
      | undefined;

    const errorType = responseData?.error_type as string | undefined;
    const status = (err.response as Record<string, unknown>)?.status as
      | number
      | undefined;

    if (errorType === "authentication" || status === 401) {
      return "Your session has expired. Please log in again to continue chatting.";
    }
    if (errorType === "service_unavailable" || status === 503) {
      return "Kin AI is temporarily unavailable. Please try again in a moment.";
    }
    if (errorType === "service_error" || status === 500) {
      return "Something went wrong on our end. Please try again.";
    }
  }

  if (error instanceof Error) {
    if (
      error.message.includes("Network Error") ||
      error.message.includes("timeout")
    ) {
      return "Unable to reach Kin AI. Please check your connection and try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

// ─── Welcome Message ────────────────────────────────────────────────

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "ai",
  text: "Hi! I'm **Kin AI**, your personal health buddy. I can help you understand your health data, plan activities, and give personalized wellness advice.\n\nAsk me anything, or tap a suggestion below to get started!",
  timestamp: getTimeString(),
  isNew: false,
};

// ─── Main Screen ────────────────────────────────────────────────────

export default function AiPageScreen() {
  const timeLabel = getTimeString();

  // ── Store ──
  const {
    messages,
    isLoading,
    addUserMessage,
    addAiMessage,
    addErrorMessage,
    setLoading,
    markMessageSeen,
    clearChat,
  } = useChatStore();

  const [inputText, setInputText] = useState("");
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const allMessages = messages.length === 0 ? [WELCOME_MESSAGE] : messages;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      console.log("[KinAI] sendMessage called with:", text.trim());

      addUserMessage(text.trim());
      setInputText("");
      setLastFailedText(null);
      scrollToBottom();

      setLoading(true);

      try {
        // Build conversation history including the new message
        const history = useChatStore.getState().conversationHistory;
        console.log("[KinAI] Conversation history length:", history.length);
        const response = await sendChatMessage(history);

        console.log(
          "[KinAI] API response received:",
          response.content?.substring(0, 80),
        );
        setLoading(false);
        addAiMessage(response.content, response.any?.source);
        scrollToBottom();
      } catch (error) {
        console.log("[KinAI] API error:", error);
        setLoading(false);
        const errorMessage = mapErrorToUserMessage(error);
        addErrorMessage(errorMessage);
        setLastFailedText(text.trim());
        scrollToBottom();
      }
    },
    [addUserMessage, addAiMessage, addErrorMessage, setLoading, scrollToBottom],
  );

  // ── Handlers ──
  const handleSend = useCallback(() => {
    sendMessage(inputText);
  }, [inputText, sendMessage]);

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage],
  );

  const handleRetry = useCallback(() => {
    if (lastFailedText) {
      // Remove the last error message before retrying
      const store = useChatStore.getState();
      const lastMsg = store.messages[store.messages.length - 1];
      if (lastMsg?.error) {
        useChatStore.setState({
          messages: store.messages.slice(0, -1),
        });
      }
      sendMessage(lastFailedText);
    }
  }, [lastFailedText, sendMessage]);

  const handleAnimationComplete = useCallback(
    (id: string) => {
      markMessageSeen(id);
    },
    [markMessageSeen],
  );

  const handleNewChat = useCallback(() => {
    clearChat();
    setInputText("");
    setLastFailedText(null);
  }, [clearChat]);

  // ── Show suggested prompts when chat is empty or after last AI message ──
  const showSuggestions =
    messages.length === 0 ||
    (!isLoading &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "ai");

  // ── Render item ──
  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <View>
        {item.error ? (
          <ErrorBanner
            message={item.text}
            onRetry={lastFailedText ? handleRetry : undefined}
          />
        ) : item.sender === "ai" ? (
          <>
            <AiMessageBubble
              message={item}
              onAnimationComplete={() => handleAnimationComplete(item.id)}
            />
            {item.actions && (
              <ActionButtons actions={item.actions} onAction={() => {}} />
            )}
          </>
        ) : (
          <UserMessageBubble message={item} />
        )}
      </View>
    ),
    [handleAnimationComplete, handleRetry, lastFailedText],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ChatHeader onNewChat={messages.length > 0 ? handleNewChat : undefined} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Time label */}
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.inputBorder,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: typo.family.medium,
                      fontSize: typo.size.caption,
                      color: colors.textSecondary,
                    }}
                  >
                    {timeLabel}
                  </Text>
                </View>
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              {isLoading && <TypingIndicator />}
              {!isLoading && (
                <SuggestedPrompts
                  onSelect={handleSuggestedPrompt}
                  visible={showSuggestions}
                />
              )}
            </View>
          }
          onContentSizeChange={scrollToBottom}
        />

        <InputBar
          value={inputText}
          onChange={setInputText}
          onSend={handleSend}
          disabled={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
