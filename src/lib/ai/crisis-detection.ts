// ═══════════════════════════════════════════════════════════
// ClearPath AI — Crisis Detection Module
// SACRED RULE: This is HARDCODED, DETERMINISTIC, NEVER AI-dependent.
// If crisis keywords are detected, AI classification is BYPASSED ENTIRELY.
// ═══════════════════════════════════════════════════════════

import { CRISIS_KEYWORDS } from '@/config/ai';
import type { CrisisDetectionResult, CrisisType, CrisisResource } from '@/types/classification';

/**
 * Map each crisis category from config to the typed CrisisType.
 * Config uses camelCase keys (e.g. selfHarm) while CrisisType uses snake_case (e.g. self_harm).
 */
const CATEGORY_TO_CRISIS_TYPE: Record<string, CrisisType> = {
  suicide: 'suicide',
  selfHarm: 'self_harm',
  domesticViolence: 'domestic_violence',
  substanceCrisis: 'substance_crisis',
  childAbuse: 'child_abuse',
  humanTrafficking: 'human_trafficking',
  immediateDanger: 'immediate_danger',
};

/**
 * Determine severity for a given crisis type.
 * - suicide/self_harm/human_trafficking/immediate_danger → critical
 * - domestic_violence/child_abuse/substance_crisis → high
 * - Multiple matches escalate severity.
 */
function getSeverity(types: CrisisType[]): 'critical' | 'high' | 'medium' {
  if (types.length === 0) return 'medium';

  const criticalTypes: Set<CrisisType> = new Set([
    'suicide',
    'self_harm',
    'human_trafficking',
    'immediate_danger',
  ]);

  const hasCritical = types.some((t) => criticalTypes.has(t));
  const multipleMatches = types.length > 1;

  if (hasCritical || multipleMatches) {
    return 'critical';
  }

  return 'high';
}

/**
 * Map each crisis type to specific hotlines and resources.
 */
function getResourcesForType(type: CrisisType): CrisisResource[] {
  switch (type) {
    case 'suicide':
      return [
        { name: '988 Suicide & Crisis Lifeline', action: 'Call now', call: '988', url: 'https://988lifeline.org' },
        { name: 'Crisis Text Line', action: 'Text for help', call: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
        { name: 'Local Crisis Center', action: 'Call for local resources', call: '211', url: 'https://www.211.org' },
      ];
    case 'self_harm':
      return [
        { name: '988 Suicide & Crisis Lifeline', action: 'Call now', call: '988', url: 'https://988lifeline.org' },
        { name: 'Crisis Text Line', action: 'Text for help', call: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
        { name: 'Local Crisis Center', action: 'Call for local resources', call: '211', url: 'https://www.211.org' },
        { name: 'SAMHSA National Helpline', action: 'Call for treatment referral', call: '1-800-662-4357', url: 'https://www.samhsa.gov/find-help/national-helpline' },
      ];
    case 'domestic_violence':
      return [
        { name: 'National Domestic Violence Hotline', action: 'Call now', call: '1-800-799-7233', url: 'https://www.thehotline.org' },
        { name: 'Crisis Text Line', action: 'Text for help', call: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
        { name: 'Local Crisis Center', action: 'Call for local resources', call: '211', url: 'https://www.211.org' },
      ];
    case 'substance_crisis':
      return [
        { name: 'SAMHSA National Helpline', action: 'Call for treatment referral', call: '1-800-662-4357', url: 'https://www.samhsa.gov/find-help/national-helpline' },
        { name: '988 Suicide & Crisis Lifeline', action: 'Call now', call: '988', url: 'https://988lifeline.org' },
        { name: 'Poison Control Center', action: 'Call for poisoning emergency', call: '1-800-222-1222', url: 'https://www.poison.org' },
      ];
    case 'child_abuse':
      return [
        { name: 'Childhelp National Child Abuse Hotline', action: 'Call now', call: '1-800-422-4453', url: 'https://www.childhelp.org' },
        { name: 'Emergency Services', action: 'Call if child is in immediate danger', call: '911' },
      ];
    case 'human_trafficking':
      return [
        { name: 'National Human Trafficking Hotline', action: 'Call now', call: '1-888-373-7888', url: 'https://humantraffickinghotline.org' },
        { name: 'Emergency Services', action: 'Call if in immediate danger', call: '911' },
      ];
    case 'immediate_danger':
      return [
        { name: 'Emergency Services', action: 'Call now', call: '911' },
        { name: 'Local Crisis Center', action: 'Call for local resources', call: '211', url: 'https://www.211.org' },
        { name: '988 Suicide & Crisis Lifeline', action: 'Call for crisis support', call: '988', url: 'https://988lifeline.org' },
      ];
    default:
      return [
        { name: '988 Suicide & Crisis Lifeline', action: 'Call now', call: '988', url: 'https://988lifeline.org' },
        { name: 'Emergency Services', action: 'Call for emergencies', call: '911' },
      ];
  }
}

/**
 * Detect crisis indicators in user text.
 *
 * This function is PURELY DETERMINISTIC — it uses only hardcoded keyword
 * matching against the lowercased input. No AI model is involved, ever.
 *
 * Performance target: < 200ms (RULE 13).
 */
export function detectCrisis(text: string): CrisisDetectionResult {
  const lowerText = text.toLowerCase();

  const matchedKeywords: string[] = [];
  const matchedTypes: CrisisType[] = [];
  const allResources: CrisisResource[] = [];

  // Check each crisis category from the hardcoded config
  for (const [category, keywords] of Object.entries(CRISIS_KEYWORDS)) {
    const crisisType = CATEGORY_TO_CRISIS_TYPE[category];
    if (!crisisType) continue;

    const categoryMatches: string[] = [];

    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        categoryMatches.push(keyword);
      }
    }

    if (categoryMatches.length > 0) {
      matchedKeywords.push(...categoryMatches);
      matchedTypes.push(crisisType);
      allResources.push(...getResourcesForType(crisisType));
    }
  }

  if (matchedTypes.length === 0) {
    return {
      isCrisis: false,
      type: null,
      severity: 'medium',
      matchedKeywords: [],
      resources: [],
    };
  }

  // Use the first (most specific) crisis type as the primary type
  const primaryType = matchedTypes[0];
  const severity = getSeverity(matchedTypes);

  // Deduplicate resources by name
  const seenNames = new Set<string>();
  const uniqueResources = allResources.filter((r) => {
    if (seenNames.has(r.name)) return false;
    seenNames.add(r.name);
    return true;
  });

  return {
    isCrisis: true,
    type: primaryType,
    severity,
    matchedKeywords,
    resources: uniqueResources,
  };
}
