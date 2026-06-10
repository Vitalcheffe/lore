// ═══════════════════════════════════════════════════════════
// ClearPath AI — Chat Types
// ═══════════════════════════════════════════════════════════

import type { ClassificationResult, CrisisResource } from './classification';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  classification?: ClassificationResult;
  isCrisis?: boolean;
  crisisResources?: CrisisResource[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}
