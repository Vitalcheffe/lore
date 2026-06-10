// ═══════════════════════════════════════════════════════════
// ClearPath AI — Transparency Layers Module
// Implements all 6 mandatory transparency layers (RULE 5):
//   1. Confidence Score
//   2. Source Quality
//   3. Bias Check
//   4. Complexity Level
//   5. Alternative Views
//   6. Verification Status
// ═══════════════════════════════════════════════════════════

import { BIAS_DAMPENING, LABEL_KEYWORDS, COMPLEXITY_INDICATORS, SOURCE_QUALITY_SCORES } from '@/config/ai';
import type { CategoryScore, TransparencyLayer, SourceQuality, VerificationStatus, ComplexityLevel, BiasInfo, AlternativeView } from '@/types/classification';
import { calibrateConfidence } from './calibration';

/**
 * Determine source quality based on category.
 * Government-related categories → 'government' (0.95)
 * Community org categories → 'nonprofit' (0.85)
 * General resources → 'community' (0.70)
 * AI-only / no clear source → 'ai_generated' (0.50)
 */
function getSourceQuality(category: string): { quality: SourceQuality; score: number } {
  const governmentCategories = [
    'Housing Assistance',
    'Healthcare',
    'Legal Aid',
    'Senior Services',
  ];

  const nonprofitCategories = [
    'Mental Health',
    'Substance Abuse',
    'Food Assistance',
  ];

  if (governmentCategories.includes(category)) {
    return { quality: 'government', score: SOURCE_QUALITY_SCORES.government };
  }

  if (nonprofitCategories.includes(category)) {
    return { quality: 'nonprofit', score: SOURCE_QUALITY_SCORES.nonprofit };
  }

  return { quality: 'community', score: SOURCE_QUALITY_SCORES.community };
}

/**
 * Determine verification status based on source quality.
 */
function getVerificationStatus(sourceQuality: SourceQuality): VerificationStatus {
  switch (sourceQuality) {
    case 'government':
      return 'verified';
    case 'nonprofit':
      return 'partially_verified';
    case 'community':
      return 'unverified';
    case 'ai_generated':
      return 'unverified';
    default:
      return 'unverified';
  }
}

/**
 * Check for biases: dampened categories, short/ambiguous input, multi-category overlap.
 */
function performBiasCheck(
  category: string,
  text: string,
  allScores: CategoryScore[],
): BiasInfo {
  const types: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';
  const explanations: string[] = [];

  // Check if category has known over-classification bias
  if (BIAS_DAMPENING[category] !== undefined) {
    types.push('category_overclassification');
    explanations.push(
      `"${category}" is prone to over-classification by AI models and has been dampened.`,
    );
    severity = 'medium';
  }

  // Check for short input — less signal, more uncertainty
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount < 10) {
    types.push('short_input');
    explanations.push(
      'Input is very short, which reduces classification confidence.',
    );
    severity = 'medium';
  }

  // Check for ambiguous input — top-2 categories close in score
  if (allScores.length >= 2) {
    const sorted = [...allScores].sort((a, b) => b.score - a.score);
    const topScore = sorted[0].score;
    const secondScore = sorted[1].score;

    if (topScore - secondScore <= 0.15) {
      types.push('category_ambiguity');
      explanations.push(
        `Top categories "${sorted[0].label}" and "${sorted[1].label}" have similar scores, ` +
        'making classification less certain.',
      );
      severity = 'high';
    }
  }

  // Check for multi-category overlap (3+ categories with score > 0.3)
  const significantCategories = allScores.filter((s) => s.score > 0.3);
  if (significantCategories.length >= 3) {
    types.push('multi_category_overlap');
    explanations.push(
      'Multiple categories scored above threshold, indicating complex or overlapping needs.',
    );
    severity = 'high';
  }

  // Check if only 1 keyword match for the top category (weak signal)
  const keywords = LABEL_KEYWORDS[category];
  if (keywords && keywords.length > 0) {
    const lowerText = text.toLowerCase();
    let matchCount = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchCount++;
        if (matchCount > 1) break;
      }
    }
    if (matchCount === 1) {
      types.push('weak_keyword_signal');
      explanations.push(
        `Only one keyword matched for "${category}", which is a weak signal.`,
      );
      severity = severity === 'low' ? 'medium' : severity;
    }
  }

  return {
    detected: types.length > 0,
    types,
    severity,
    explanation: explanations.length > 0
      ? explanations.join(' ')
      : 'No significant biases detected.',
  };
}

/**
 * Determine complexity level based on word count, number of significant
 * categories, and complexity indicator words.
 */
function getComplexity(
  text: string,
  allScores: CategoryScore[],
): { level: ComplexityLevel; explanation: string } {
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const significantCategories = allScores.filter((s) => s.score > 0.3).length;

  // Check for critical indicators first (highest priority)
  for (const indicator of COMPLEXITY_INDICATORS.critical) {
    if (lowerText.includes(indicator)) {
      return {
        level: 'critical',
        explanation: `Input contains urgent language ("${indicator}") and likely requires immediate, multi-faceted assistance.`,
      };
    }
  }

  // Check for complex indicators
  for (const indicator of COMPLEXITY_INDICATORS.complex) {
    if (lowerText.includes(indicator)) {
      return {
        level: 'complex',
        explanation: `Input suggests a complicated situation ("${indicator}") with potentially overlapping needs across ${significantCategories} categories.`,
      };
    }
  }

  // Check for moderate indicators
  for (const indicator of COMPLEXITY_INDICATORS.moderate) {
    if (lowerText.includes(indicator)) {
      return {
        level: 'moderate',
        explanation: `Input mentions multiple needs ("${indicator}"), spanning ${significantCategories} categories.`,
      };
    }
  }

  // Fallback: use word count and category count
  if (significantCategories >= 3 || wordCount > 50) {
    return {
      level: 'moderate',
      explanation: `Input involves ${significantCategories} categories and ${wordCount} words, suggesting moderate complexity.`,
    };
  }

  if (significantCategories >= 2) {
    return {
      level: 'moderate',
      explanation: `Input spans ${significantCategories} categories, suggesting moderate complexity.`,
    };
  }

  return {
    level: 'simple',
    explanation: `Input is straightforward, focused on a single primary need with ${wordCount} words.`,
  };
}

/**
 * Build the top 3 alternative views from allScores, excluding the primary category.
 */
function getAlternatives(allScores: CategoryScore[], primaryCategory: string): AlternativeView[] {
  return allScores
    .filter((s) => s.label !== primaryCategory)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => ({
      category: s.label,
      confidence: s.score,
      reason: `Scored ${(s.score * 100).toFixed(0)}% in classification as a potential alternative.`,
    }));
}

/**
 * Calculate all 6 transparency layers for a classification result.
 *
 * Required layers (RULE 5):
 * 1. Confidence Score (0-100%)
 * 2. Source Quality (government/nonprofit/community/ai_generated)
 * 3. Bias Check (detected biases + severity)
 * 4. Complexity Level (simple/moderate/complex/critical)
 * 5. Alternative Views (top-3 alternatives with scores)
 * 6. Verification Status (verified/partially_verified/unverified/disputed)
 */
export function calculateTransparencyLayers(data: {
  category: string;
  confidence: number;
  allScores: CategoryScore[];
  text: string;
}): TransparencyLayer {
  const { category, confidence, allScores, text } = data;

  // Layer 1: Confidence (calibrated)
  const calibratedConfidence = calibrateConfidence(confidence, category, text, allScores);

  // Layer 2: Source Quality
  const { quality: sourceQuality, score: sourceQualityScore } = getSourceQuality(category);

  // Layer 3: Bias Check
  const biasCheck = performBiasCheck(category, text, allScores);

  // Layer 4: Complexity Level
  const { level: complexity, explanation: complexityExplanation } = getComplexity(text, allScores);

  // Layer 5: Alternative Views
  const alternatives = getAlternatives(allScores, category);

  // Layer 6: Verification Status
  const verification = getVerificationStatus(sourceQuality);

  // If bias severity is high and source quality was community, downgrade to ai_generated
  let finalSourceQuality: SourceQuality = sourceQuality;
  let finalSourceQualityScore = sourceQualityScore;
  if (biasCheck.severity === 'high' && sourceQuality === 'community') {
    finalSourceQuality = 'ai_generated';
    finalSourceQualityScore = SOURCE_QUALITY_SCORES.ai_generated;
  }

  return {
    confidence: calibratedConfidence,
    sourceQuality: finalSourceQuality,
    sourceQualityScore: finalSourceQualityScore,
    biasCheck,
    complexity,
    complexityExplanation,
    alternatives,
    verification,
    lastVerified: verification === 'verified' ? new Date().toISOString() : null,
  };
}
