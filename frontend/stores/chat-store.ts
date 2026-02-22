import { create } from "zustand";
import { ChatMessagePayload } from "@/lib/api/ai";

// ─── Types ──────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: "ai" | "user" | "system";
  text: string;
  timestamp: string;
  isNew?: boolean; // triggers typewriter animation
  provider?: string; // "openai" | "openrouter"
  error?: boolean; // marks error messages
  actions?: { label: string; type: "confirm" | "dismiss" }[];
}

interface ChatStore {
  messages: ChatMessage[];
  conversationHistory: ChatMessagePayload[];
  isLoading: boolean;
  error: string | null;

  addUserMessage: (text: string) => void;
  addAiMessage: (text: string, provider?: string) => void;
  addErrorMessage: (text: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markMessageSeen: (id: string) => void;
  clearChat: () => void;
  getConversationHistory: () => ChatMessagePayload[];
}

// ─── Helpers ────────────────────────────────────────────────────────

const MAX_HISTORY_MESSAGES = 20;

function getTimeString(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const mm = m < 10 ? `0${m}` : m;
  return `Today, ${h12}:${mm} ${ampm}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Store ──────────────────────────────────────────────────────────

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  conversationHistory: [],
  isLoading: false,
  error: null,

  addUserMessage: (text: string) => {
    const message: ChatMessage = {
      id: generateId(),
      sender: "user",
      text,
      timestamp: getTimeString(),
    };

    const historyEntry: ChatMessagePayload = {
      role: "user",
      content: text,
    };

    set((state) => ({
      messages: [...state.messages, message],
      conversationHistory: [...state.conversationHistory, historyEntry].slice(
        -MAX_HISTORY_MESSAGES,
      ),
      error: null,
    }));
  },

  addAiMessage: (text: string, provider?: string) => {
    const message: ChatMessage = {
      id: generateId(),
      sender: "ai",
      text,
      timestamp: getTimeString(),
      isNew: true,
      provider,
    };

    const historyEntry: ChatMessagePayload = {
      role: "assistant",
      content: text,
    };

    set((state) => ({
      messages: [...state.messages, message],
      conversationHistory: [...state.conversationHistory, historyEntry].slice(
        -MAX_HISTORY_MESSAGES,
      ),
    }));
  },

  addErrorMessage: (text: string) => {
    const message: ChatMessage = {
      id: generateId(),
      sender: "system",
      text,
      timestamp: getTimeString(),
      error: true,
    };

    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  markMessageSeen: (id: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isNew: false } : m,
      ),
    }));
  },

  clearChat: () =>
    set({
      messages: [],
      conversationHistory: [],
      isLoading: false,
      error: null,
    }),

  getConversationHistory: () => get().conversationHistory,
}));
