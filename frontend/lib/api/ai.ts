import { post } from "@/lib/api/client";

// ─── Types ──────────────────────────────────────────────────────────

export interface ChatMessagePayload {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessagePayload[];
}

export interface ChatResponse {
  role: string;
  content: string;
  any: {
    source: string;
  };
}

export interface ChatErrorResponse {
  error_type: string;
  detail: string;
}

// ─── API ────────────────────────────────────────────────────────────

/**
 * Send a conversation to the AI assistant and get a single reply.
 * The backend enriches the request with health context automatically.
 *
 * @param messages - The full conversation history in `{role, content}` format
 * @returns The AI assistant's reply with provider info
 */
export async function sendChatMessage(
  messages: ChatMessagePayload[],
): Promise<ChatResponse> {
  const response = await post<ChatResponse, ChatRequest>("/ai/chat", {
    messages,
  });
  return response;
}
