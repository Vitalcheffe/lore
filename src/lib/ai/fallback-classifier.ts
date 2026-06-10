// ═══════════════════════════════════════════════════════════
// ClearPath AI — Fallback Keyword Classifier
// DETERMINISTIC — no Math.random(), no Date.now(), no non-determinism.
// Used when HuggingFace API is unavailable or misconfigured.
// ═══════════════════════════════════════════════════════════

import { LABEL_KEYWORDS, BIAS_DAMPENING } from '@/config/ai';
import type { CategoryScore } from '@/types/classification';

/**
 * Count how many keywords for a given label match the input text (case-insensitive).
 */
function countKeywordMatches(text: string, label: string): number {
  const keywords = LABEL_KEYWORDS[label];
  if (!keywords || keywords.length === 0) return 0;

  const lowerText = text.toLowerCase();
  let matchCount = 0;

  for (const keyword of keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      matchCount++;
    }
  }

  return matchCount;
}

/**
 * Classify text against labels using deterministic keyword matching.
 *
 * Scoring logic:
 * - If matches > 0: score = min(0.95, 0.5 + matchCount * 0.15)
 * - If matches == 0: score = 0.05 + (text.length > 20 ? 0.05 : 0)
 * - Apply BIAS_DAMPENING from config for categories with only 1 keyword match
 *
 * CRITICAL: This function is purely deterministic. No random values, no timestamps.
 */
export async function classifyWithKeywords(
  text: string,
  labels: string[],
): Promise<CategoryScore[]> {
  const results: CategoryScore[] = [];

  for (const label of labels) {
    const matchCount = countKeywordMatches(text, label);

    let score: number;

    if (matchCount > 0) {
      score = Math.min(0.95, 0.5 + matchCount * 0.15);

      // Apply bias dampening for categories that tend to be over-classified
      // Only dampen when there's a weak signal (just 1 keyword match)
      const dampeningFactor = BIAS_DAMPENING[label];
      if (dampeningFactor !== undefined && matchCount === 1) {
        score = score * dampeningFactor;
      }
    } else {
      // No keyword matches — give a minimal score
      // Slightly higher for longer inputs (more context = slightly more plausible)
      score = 0.05 + (text.length > 20 ? 0.05 : 0);
    }

    results.push({ label, score });
  }

  // Sort by score descending (deterministic — same input always produces same order)
  results.sort((a, b) => b.score - a.score);

  return results;
}
