import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

// ─── Types ──────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  boldSegments?: string[]; // substrings to render bold
  timestamp: string;
  actions?: { label: string; type: "confirm" | "dismiss" }[];
}

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

// ─── Typing Indicator ───────────────────────────────────────────────
function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* AI avatar */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#D5D8DC",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        <Ionicons name="sparkles" size={18} color="#5D6D7E" />
      </View>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: "row",
          gap: 6,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        }}
      >
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#AEB6BF",
              opacity: dot,
            }}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Bold Text Renderer ─────────────────────────────────────────────
function RichText({
  text,
  boldSegments = [],
}: {
  text: string;
  boldSegments?: string[];
}) {
  if (!boldSegments.length) {
    return (
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.bodyLg,
          lineHeight: 24,
          color: colors.textPrimary,
        }}
      >
        {text}
      </Text>
    );
  }

  // Split text around bold segments
  let parts: { text: string; bold: boolean }[] = [];
  let remaining = text;

  for (const seg of boldSegments) {
    const idx = remaining.indexOf(seg);
    if (idx === -1) continue;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx), bold: false });
    parts.push({ text: seg, bold: true });
    remaining = remaining.slice(idx + seg.length);
  }
  if (remaining) parts.push({ text: remaining, bold: false });

  return (
    <Text
      style={{
        fontFamily: typo.family.body,
        fontSize: typo.size.bodyLg,
        lineHeight: 24,
        color: colors.textPrimary,
      }}
    >
      {parts.map((p, i) =>
        p.bold ? (
          <Text key={i} style={{ fontFamily: typo.family.bold }}>
            {p.text}
          </Text>
        ) : (
          <Text key={i}>{p.text}</Text>
        ),
      )}
    </Text>
  );
}

// ─── AI Message Bubble ──────────────────────────────────────────────
function AiMessageBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      <Text
        style={{
          fontFamily: typo.family.medium,
          fontSize: typo.size.caption,
          color: colors.primary,
          marginLeft: 48,
          marginBottom: 6,
        }}
      >
        Kin AI
      </Text>

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {/* Avatar */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#D5D8DC",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <Ionicons name="sparkles" size={18} color="#5D6D7E" />
        </View>

        {/* Bubble */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 16,
            borderTopLeftRadius: 4,
            padding: 16,
            borderLeftWidth: 3,
            borderLeftColor: "#B9A8D6",
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <RichText text={message.text} boldSegments={message.boldSegments} />
        </View>
      </View>
    </View>
  );
}

// ─── User Message Bubble ────────────────────────────────────────────
function UserMessageBubble({ message }: { message: ChatMessage }) {
  return (
    <View
      style={{
        marginBottom: 16,
        alignItems: "flex-end",
      }}
    >
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 16,
          borderTopRightRadius: 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
          maxWidth: "80%",
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.bodyLg,
            lineHeight: 24,
            color: "#FFFFFF",
          }}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

// ─── Action Buttons ─────────────────────────────────────────────────
function ActionButtons({
  actions,
  onAction,
}: {
  actions: { label: string; type: "confirm" | "dismiss" }[];
  onAction: (type: "confirm" | "dismiss") => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
        marginLeft: 48,
      }}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          activeOpacity={0.8}
          onPress={() => onAction(action.type)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 24,
            backgroundColor:
              action.type === "confirm" ? "#D5F5E3" : colors.card,
            borderWidth: action.type === "dismiss" ? 1 : 0,
            borderColor: colors.inputBorder,
          }}
        >
          <Ionicons
            name={action.type === "confirm" ? "checkmark" : "close"}
            size={18}
            color={action.type === "confirm" ? "#10b981" : colors.textSecondary}
          />
          <Text
            style={{
              fontFamily: typo.family.semiBold,
              fontSize: typo.size.body,
              color:
                action.type === "confirm"
                  ? colors.textPrimary
                  : colors.textSecondary,
            }}
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Header ─────────────────────────────────────────────────────────
function ChatHeader() {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        position: "relative",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", left: 20 }}
      >
        <Ionicons name="chevron-down" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
        }}
      >
        Kin AI
      </Text>
    </View>
  );
}

// ─── Input Bar ──────────────────────────────────────────────────────
function InputBar({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (t: string) => void;
  onSend: () => void;
}) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const attachOptions: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    bg: string;
  }[] = [
    { icon: "image-outline", label: "Photo", color: "#7C3AED", bg: "#EDE9FE" },
    {
      icon: "camera-outline",
      label: "Camera",
      color: "#0EA5E9",
      bg: "#E0F2FE",
    },
    {
      icon: "document-outline",
      label: "Document",
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
    {
      icon: "location-outline",
      label: "Location",
      color: "#10b981",
      bg: "#D1FAE5",
    },
  ];

  return (
    <View>
      {/* Attachment menu popup */}
      {showAttachMenu && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.inputBorder,
          }}
        >
          {attachOptions.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              activeOpacity={0.7}
              onPress={() => setShowAttachMenu(false)}
              style={{ alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: opt.bg,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={opt.icon} size={24} color={opt.color} />
              </View>
              <Text
                style={{
                  fontFamily: typo.family.medium,
                  fontSize: 11,
                  color: colors.textSecondary,
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: keyboardVisible ? 12 : 80,
          gap: 10,
          borderTopWidth: 1,
          borderTopColor: colors.inputBorder,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowAttachMenu((prev) => !prev)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name={showAttachMenu ? "close" : "add"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === "ios" ? 10 : 4,
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            style={{
              flex: 1,
              fontFamily: typo.family.body,
              fontSize: typo.size.body,
              color: colors.textPrimary,
            }}
            returnKeyType="send"
            onSubmitEditing={onSend}
          />
          <TouchableOpacity onPress={onSend}>
            <Ionicons
              name="send"
              size={20}
              color={value.trim() ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────
export default function AiPageScreen() {
  const timeLabel = getTimeString();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    scrollToBottom();

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Thanks for your message! I'm analyzing your health data to give you a personalized response. Stay tuned for more insights.",
        timestamp: getTimeString(),
      };
      setMessages((prev) => [...prev, aiReply]);
      scrollToBottom();
    }, 2000);
  };

  const handleAction = (type: "confirm" | "dismiss") => {
    if (type === "confirm") {
      const aiReply: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: "Great! I've planned a 20-minute brisk walk for you at 4:00 PM. I'll send you a reminder. Your optimal route based on weather is through the park nearby.",
        boldSegments: ["20-minute brisk walk", "4:00 PM"],
        timestamp: getTimeString(),
      };
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, aiReply]);
        scrollToBottom();
      }, 1500);
    } else {
      const aiReply: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: "No worries! I'll check in with you later. Remember, even a short 5-minute stretch can make a difference.",
        boldSegments: ["5-minute stretch"],
        timestamp: getTimeString(),
      };
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, aiReply]);
        scrollToBottom();
      }, 1500);
    }

    // Remove action buttons from the first message
    setMessages((prev) =>
      prev.map((m) => (m.id === "1" ? { ...m, actions: undefined } : m)),
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => (
    <View>
      {item.sender === "ai" ? (
        <>
          <AiMessageBubble message={item} />
          {item.actions && (
            <ActionButtons actions={item.actions} onAction={handleAction} />
          )}
        </>
      ) : (
        <UserMessageBubble message={item} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ChatHeader />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
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
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        <InputBar
          value={inputText}
          onChange={setInputText}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
