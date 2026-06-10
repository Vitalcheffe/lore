// ═══════════════════════════════════════════════════════════
// ClearPath AI — Main Classification Orchestrator
// Entry point that coordinates crisis detection, AI classification,
// fallback classification, calibration, transparency, and clarification.
//
// CRITICAL: Crisis detection runs FIRST, before any AI call.
// Crisis detection is NEVER AI-dependent.
// ═══════════════════════════════════════════════════════════

import { CLASSIFICATION_LABELS, CONFIDENCE_THRESHOLDS } from '@/config/ai';
import type { ClassificationResponse, CategoryScore } from '@/types/classification';
import { detectCrisis } from './crisis-detection';
import { classifyWithHuggingFace } from './huggingface';
import { classifyWithKeywords } from './fallback-classifier';
import { calibrateConfidence } from './calibration';
import { calculateTransparencyLayers } from './transparency';
import { generateClarificationQuestion } from './clarification';

/** Minimum input length (characters) */
const MIN_INPUT_LENGTH = 3;
/** Maximum input length (characters) */
const MAX_INPUT_LENGTH = 1000;

/**
 * Generate a deterministic classification ID from timestamp and text hash.
 * Uses a simple hash for uniqueness without external dependencies.
 */
function generateClassificationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `clf_${timestamp}_${random}`;
}

/**
 * Classify user text and return a complete ClassificationResponse.
 *
 * Pipeline order:
 * 1. Validate input (min 3 chars, max 1000)
 * 2. Run detectCrisis() → if crisis, return crisis response immediately (skip all AI)
 * 3. Try classifyWithHuggingFace() → if success, use those scores
 * 4. If HF fails, fall back to classifyWithKeywords()
 * 5. Run calibrateConfidence() on top result
 * 6. Run calculateTransparencyLayers()
 * 7. Generate clarification question if confidence < 0.70
 * 8. Return complete ClassificationResponse
 */
export async function classifyText(
  text: string,
  userId?: string,
): Promise<ClassificationResponse> {
  // ── Step 1: Validate input ──
  const trimmedText = text.trim();

  if (trimmedText.length < MIN_INPUT_LENGTH) {
    return {
      isCrisis: false,
      categories: [],
      needsClarification: true,
      clarificationMessage: 'Your input is too short. Please describe what kind of help you need in a few words.',
      clarificationQuestion: 'Could you tell me more about what kind of help you need?',
      model: 'none',
      note: `Input must be at least ${MIN_INPUT_LENGTH} characters.`,
    };
  }

  if (trimmedText.length > MAX_INPUT_LENGTH) {
    return {
      isCrisis: false,
      categories: [],
      needsClarification: true,
      clarificationMessage: `Your input is too long (max ${MAX_INPUT_LENGTH} characters). Please try a shorter description.`,
      clarificationQuestion: 'Could you summarize what kind of help you need in a shorter message?',
      model: 'none',
      note: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters.`,
    };
  }

  // ── Step 2: CRISIS DETECTION (FIRST, before any AI) ──
  // SACRED RULE: Crisis detection is hardcoded, deterministic, NEVER AI-dependent.
  const crisisResult = detectCrisis(trimmedText);

  if (crisisResult.isCrisis) {
    // Crisis detected — return immediately, bypass all AI classification
    const crisisNote = crisisResult.severity === 'critical'
      ? 'We detected a crisis in your message. Please reach out to the resources below — you are not alone, and help is available right now.'
      : 'We detected a situation that may need urgent attention. The resources below can help.';

    return {
      isCrisis: true,
      categories: [],
      crisisLines: crisisResult.resources,
      note: crisisNote,
      needsClarification: false,
      clarificationMessage: null,
      clarificationQuestion: null,
      model: 'crisis-detection-hardcoded',
      classificationId: generateClassificationId(),
    };
  }

  // ── Step 3 & 4: Classification (AI with fallback) ──
  const labels = [...CLASSIFICATION_LABELS];
  let categories: CategoryScore[];
  let modelUsed: string;

  try {
    // Try HuggingFace first
    categories = await classifyWithHuggingFace(trimmedText, labels);
    modelUsed = 'facebook/bart-large-mnli';
  } catch {
    // Fallback to deterministic keyword classifier
    categories = await classifyWithKeywords(trimmedText, labels);
    modelUsed = 'keyword-fallback';
  }

  if (categories.length === 0) {
    return {
      isCrisis: false,
      categories: [],
      needsClarification: true,
      clarificationMessage: 'We couldn\'t classify your request. Could you provide more detail?',
      clarificationQuestion: 'Could you tell me more about what kind of help you need?',
      model: modelUsed,
      classificationId: generateClassificationId(),
      note: 'No categories matched the input text.',
    };
  }

  // ── Step 5: Calibrate confidence on top result ──
  const topCategory = categories[0];
  const calibratedScore = calibrateConfidence(
    topCategory.score,
    topCategory.label,
    trimmedText,
    categories,
  );

  // Update the top category score with the calibrated value
  const calibratedCategories: CategoryScore[] = categories.map((cat, idx) =>
    idx === 0 ? { ...cat, score: calibratedScore } : cat,
  );

  // ── Step 6: Calculate transparency layers ──
  const transparencyLayers = calculateTransparencyLayers({
    category: topCategory.label,
    confidence: calibratedScore,
    allScores: calibratedCategories,
    text: trimmedText,
  });

  // ── Step 7: Generate clarification question if confidence < 0.70 ──
  const needsClarification = calibratedScore < CONFIDENCE_THRESHOLDS.medium;
  const clarificationQuestion = generateClarificationQuestion(
    trimmedText,
    topCategory.label,
    calibratedScore,
  );

  let clarificationMessage: string | null = null;
  if (needsClarification && calibratedScore < CONFIDENCE_THRESHOLDS.veryLow) {
    clarificationMessage = 'We\'re not very confident in this result. We recommend talking to a navigator who can better understand your needs.';
  } else if (needsClarification) {
    clarificationMessage = 'We\'d like to better understand your needs. Could you answer the question below?';
  }

  // ── Step 8: Return complete response ──
  return {
    isCrisis: false,
    categories: calibratedCategories,
    needsClarification,
    clarificationMessage,
    clarificationQuestion,
    model: modelUsed,
    transparencyLayers,
    classificationId: generateClassificationId(),
  };
}
