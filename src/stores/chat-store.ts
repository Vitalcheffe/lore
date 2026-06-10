// ═══════════════════════════════════════════════════════════
// ClearPath AI — Chat Store (Zustand)
// ═══════════════════════════════════════════════════════════

import { create } from 'zustand';
import type { ChatMessage, ClassificationResult, CrisisResource } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isProcessing: boolean;
  currentConversationId: string | null;

  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  addUserMessage: (content: string) => string;
  addAssistantMessage: (data: {
    content: string;
    classification?: ClassificationResult;
    isCrisis?: boolean;
    crisisResources?: CrisisResource[];
  }) => void;
  addLoadingMessage: () => string;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  setProcessing: (processing: boolean) => void;
  setConversationId: (id: string | null) => void;
}

let messageCounter = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++messageCounter}`;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isProcessing: false,
  currentConversationId: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  addUserMessage: (content) => {
    const id = generateId();
    const message: ChatMessage = {
      id,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return id;
  },

  addAssistantMessage: ({ content, classification, isCrisis, crisisResources }) => {
    const id = generateId();
    const message: ChatMessage = {
      id,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      classification,
      isCrisis,
      crisisResources,
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return id;
  },

  addLoadingMessage: () => {
    const id = generateId();
    const message: ChatMessage = {
      id,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return id;
  },

  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),

  clearMessages: () => set({ messages: [], currentConversationId: null }),

  setProcessing: (processing) => set({ isProcessing: processing }),

  setConversationId: (id) => set({ currentConversationId: id }),
}));
