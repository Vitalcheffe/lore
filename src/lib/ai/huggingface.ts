// ═══════════════════════════════════════════════════════════
// ClearPath AI — HuggingFace Inference API Integration
// Uses facebook/bart-large-mnli for zero-shot classification
// ═══════════════════════════════════════════════════════════

import type { CategoryScore } from '@/types/classification';

const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const TIMEOUT_MS = 15000;

/**
 * Known placeholder patterns that indicate an unconfigured API key.
 */
function isPlaceholderKey(key: string): boolean {
  const lowered = key.toLowerCase();
  return (
    lowered.includes('xxxxx') ||
    lowered.includes('your_') ||
    lowered.includes('placeholder') ||
    lowered.includes('replace_') ||
    lowered.includes('example') ||
    key.length < 10
  );
}

/**
 * Classify text against candidate labels using HuggingFace Inference API
 * with the BART-large-MNLI zero-shot classification model.
 *
 * Throws descriptive errors for rate limits (429), model loading (503),
 * missing/invalid API keys, and network timeouts.
 */
export async function classifyWithHuggingFace(
  text: string,
  labels: string[],
): Promise<CategoryScore[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey || isPlaceholderKey(apiKey)) {
    throw new Error(
      'HuggingFace API key is missing or appears to be a placeholder. ' +
      'Set HUGGINGFACE_API_KEY in your environment to use AI classification.',
    );
  }

  if (labels.length === 0) {
    throw new Error('At least one label is required for classification.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: labels,
          multi_label: true,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          'HuggingFace API rate limit exceeded. Please wait and try again, ' +
          'or the fallback keyword classifier will be used.',
        );
      }

      if (response.status === 503) {
        throw new Error(
          'HuggingFace model is currently loading. Please retry in a few seconds, ' +
          'or the fallback keyword classifier will be used.',
        );
      }

      throw new Error(
        `HuggingFace API returned status ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // BART-large-MNLI returns { labels: string[], scores: number[] }
    if (
      !data ||
      !Array.isArray(data.labels) ||
      !Array.isArray(data.scores) ||
      data.labels.length !== data.scores.length
    ) {
      throw new Error(
        'Unexpected response format from HuggingFace API. ' +
        'Expected { labels: string[], scores: number[] }.',
      );
    }

    const results: CategoryScore[] = data.labels.map(
      (label: string, index: number) => ({
        label,
        score: Number(data.scores[index]),
      }),
    );

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        `HuggingFace API request timed out after ${TIMEOUT_MS / 1000} seconds. ` +
        'The fallback keyword classifier will be used.',
      );
    }

    // Re-throw errors we've already formatted
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      'An unexpected error occurred while calling the HuggingFace API.',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
