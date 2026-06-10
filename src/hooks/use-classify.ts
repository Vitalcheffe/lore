'use client';

import { useMutation } from '@tanstack/react-query';
import { useChatStore } from '@/stores/chat-store';

interface ClassifyResult {
  isCrisis: boolean;
  categories: Array<{ label: string; confidence: number }>;
  crisisLines?: Array<{ name: string; action: string; call: string }>;
}

export function useClassify() {
  const { addUserMessage, addLoadingMessage, updateMessage, setProcessing } = useChatStore();

  return useMutation({
    mutationFn: async (text: string): Promise<ClassifyResult> => {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Classification failed' }));
        throw new Error(error.error || 'Classification failed');
      }
      return response.json();
    },

    onMutate: async (text) => {
      setProcessing(true);
      addUserMessage(text);
      const loadingId = addLoadingMessage();
      return { loadingId };
    },

    onSuccess: async (data, _text, context) => {
      if (!context?.loadingId) return;

      if (data.isCrisis) {
        updateMessage(context.loadingId, {
          isLoading: false,
          content: 'Crisis keyword detected — showing emergency resources.',
          isCrisis: true,
          crisisResources: data.crisisLines,
        });
      } else {
        updateMessage(context.loadingId, {
          isLoading: false,
          content: '',
          classification: data as any,
        });
      }
    },

    onError: (error, _text, context) => {
      if (context?.loadingId) {
        updateMessage(context.loadingId, {
          isLoading: false,
          isError: true,
          errorMessage: error.message || 'Something went wrong.',
          content: `Error: ${error.message}`,
        });
      }
    },

    onSettled: () => {
      setProcessing(false);
    },
  });
}
