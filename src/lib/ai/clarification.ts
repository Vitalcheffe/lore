// ═══════════════════════════════════════════════════════════
// ClearPath AI — Clarification Question Generator
// Generates follow-up questions when confidence is below threshold.
// Per RULE 3: Low confidence (< 70%) triggers clarification questions.
// ═══════════════════════════════════════════════════════════

import { CLARIFICATION_QUESTIONS, CONFIDENCE_THRESHOLDS } from '@/config/ai';

/**
 * Generate a clarification question when classification confidence is low.
 *
 * - If confidence >= 0.70, return null (no clarification needed)
 * - If confidence < 0.70, pick the first clarification question for the category
 * - If category not found in CLARIFICATION_QUESTIONS, return a generic fallback
 */
export function generateClarificationQuestion(
  text: string,
  category: string,
  confidence: number,
): string | null {
  // High enough confidence — no clarification needed
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) {
    return null;
  }

  // Look up category-specific clarification questions
  const questions = CLARIFICATION_QUESTIONS[category];

  if (questions && questions.length > 0) {
    return questions[0];
  }

  // Generic fallback when category has no specific questions
  return 'Could you tell me more about what kind of help you need?';
}
