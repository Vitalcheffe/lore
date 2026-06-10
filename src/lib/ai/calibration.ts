// ═══════════════════════════════════════════════════════════
// ClearPath AI — Confidence Calibration Module
// Adjusts raw confidence scores to account for bias, short inputs,
// ambiguity, and ensures scores are never 100% or 0%.
// ═══════════════════════════════════════════════════════════

import { BIAS_DAMPENING, LABEL_KEYWORDS } from '@/config/ai';

/**
 * Calibrate a raw confidence score by applying adjustments in order:
 *
 * 1. Category dampening: If category is in BIAS_DAMPENING AND text has only
 *    1 matching keyword for that category, multiply by dampening factor.
 * 2. Short input penalty: If text has < 10 words, multiply by 0.85.
 * 3. Ambiguity detection: If allScores provided and top-2 scores are
 *    within 0.15 of each other, reduce top score by 0.1.
 * 4. Cap at 0.98 (never show 100% confidence).
 * 5. Floor at 0.05 (never show 0% confidence).
 * 6. Round to 2 decimal places.
 */
export function calibrateConfidence(
  rawScore: number,
  category: string,
  text: string,
  allScores?: { label: string; score: number }[],
): number {
  let calibrated = rawScore;

  // ── Step 1: Category dampening ──
  const dampeningFactor = BIAS_DAMPENING[category];
  if (dampeningFactor !== undefined) {
    // Check if text has only 1 matching keyword for this category
    const keywords = LABEL_KEYWORDS[category];
    if (keywords && keywords.length > 0) {
      const lowerText = text.toLowerCase();
      let matchCount = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          matchCount++;
          if (matchCount > 1) break; // No need to count further
        }
      }
      if (matchCount === 1) {
        calibrated = calibrated * dampeningFactor;
      }
    }
  }

  // ── Step 2: Short input penalty ──
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount < 10) {
    calibrated = calibrated * 0.85;
  }

  // ── Step 3: Ambiguity detection ──
  if (allScores && allScores.length >= 2) {
    // Sort by score descending to find top 2
    const sorted = [...allScores].sort((a, b) => b.score - a.score);
    const topScore = sorted[0].score;
    const secondScore = sorted[1].score;

    // If this category is the top one and top-2 are close, reduce confidence
    if (
      sorted[0].label === category &&
      topScore - secondScore <= 0.15
    ) {
      calibrated = calibrated - 0.1;
    }
  }

  // ── Step 4: Cap at 0.98 ──
  calibrated = Math.min(calibrated, 0.98);

  // ── Step 5: Floor at 0.05 ──
  calibrated = Math.max(calibrated, 0.05);

  // ── Step 6: Round to 2 decimal places ──
  calibrated = Math.round(calibrated * 100) / 100;

  return calibrated;
}
