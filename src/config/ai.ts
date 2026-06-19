// ═══════════════════════════════════════════════════════════
// ClearPath AI — AI Configuration
// ═══════════════════════════════════════════════════════════

export const CLASSIFICATION_LABELS = [
  'Housing Assistance',
  'Food Assistance',
  'Mental Health',
  'Employment Services',
  'Legal Aid',
  'Healthcare',
  'Substance Abuse',
  'Senior Services',
] as const;

export type ClassificationLabel = typeof CLASSIFICATION_LABELS[number];

// ═══════════════════════════════════════════════════════════
// Crisis Keywords — DETERMINISTIC, HARDCODED, NEVER AI
// ═══════════════════════════════════════════════════════════

export const CRISIS_KEYWORDS = {
  suicide: [
    'suicide', 'kill myself', 'end my life', 'want to die', 'want to end it',
    "can't take this anymore", 'want it all to end', 'no reason to live',
    'better off dead', 'end it all', 'give up on life', 'not worth living',
    'suicidal', 'thinking about death', "don't want to be alive",
    'take my own life', 'thinking of killing', 'plan to end',
    'going to kill myself', 'ready to die', 'want to disappear forever',
    'life has no meaning', "can't go on like this", 'world without me',
    'no point in living', 'death sounds peaceful',
  ],
  selfHarm: [
    'hurt myself', 'self-harm', 'self harm', 'cutting myself',
    'cut myself', 'burn myself', 'harm myself', 'punish myself',
    'inflict pain', 'self injury', 'self-injury',
  ],
  domesticViolence: [
    'domestic violence', 'being abused', 'my partner hits me',
    'abusive relationship', 'my spouse beats me', 'being beaten',
    'physically abused', 'emotionally abused', 'trapped in my marriage',
    'afraid of my partner', 'my partner threatens me',
    'being controlled by my partner', 'financial abuse',
  ],
  substanceCrisis: [
    'overdose', "can't stop drinking", 'drug emergency',
    'overdosing', 'alcohol poisoning', 'withdrawal emergency',
    'need help with addiction now', 'relapsed badly',
  ],
  childAbuse: [
    'child abuse', 'abusing my child', 'hurting my child',
    'my child is being abused', 'neglecting my child',
    "can't stop hurting my kid", 'child in danger',
  ],
  humanTrafficking: [
    'human trafficking', 'being trafficked', 'forced to work',
    'held against my will', 'help me escape', 'being held captive',
    'forced into sex work', 'my passport was taken',
  ],
  immediateDanger: [
    'emergency shelter', 'nowhere to sleep tonight', 'on the street tonight',
    'being evicted today', 'being kicked out', 'no food for my kids today',
    'about to be homeless', 'freezing outside', 'danger right now',
  ],
} as const;

export type CrisisKeywordCategory = keyof typeof CRISIS_KEYWORDS;

// ═══════════════════════════════════════════════════════════
// Confidence Thresholds
// ═══════════════════════════════════════════════════════════

export const CONFIDENCE_THRESHOLDS = {
  high: 85,       // Green: confident result
  medium: 70,     // Yellow: acceptable but show alternatives
  low: 50,        // Orange: clarification needed
  veryLow: 30,    // Red: human escalation recommended
} as const;

export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' | 'veryLow' {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) return 'high';
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
  if (confidence >= CONFIDENCE_THRESHOLDS.low) return 'low';
  return 'veryLow';
}

export function getConfidenceColor(confidence: number): string {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high': return '#10b981';    // emerald
    case 'medium': return '#f59e0b';  // amber
    case 'low': return '#f97316';     // orange
    case 'veryLow': return '#ef4444'; // red
  }
}

export function getConfidenceLabel(confidence: number): string {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high': return 'High confidence';
    case 'medium': return 'Moderate confidence';
    case 'low': return 'Low confidence — clarification recommended';
    case 'veryLow': return 'Very low confidence — talk to a navigator';
  }
}

// ═══════════════════════════════════════════════════════════
// Source Quality Scores
// ═══════════════════════════════════════════════════════════

export const SOURCE_QUALITY_SCORES: Record<string, number> = {
  government: 0.95,
  nonprofit: 0.85,
  community: 0.70,
  ai_generated: 0.50,
};

// ═══════════════════════════════════════════════════════════
// Bias Dampening Factors
// ═══════════════════════════════════════════════════════════

export const BIAS_DAMPENING: Record<string, number> = {
  'Mental Health': 0.7,      // Model over-classifies into mental health
  'Substance Abuse': 0.8,    // Moderate over-classification
  'Healthcare': 0.9,         // Slight over-classification when stress mentioned
};

// ═══════════════════════════════════════════════════════════
// Complexity Indicators
// ═══════════════════════════════════════════════════════════

export const COMPLEXITY_INDICATORS = {
  simple: ['need', 'want', 'looking for', 'searching for', 'where can i find'],
  moderate: ['also', 'and', 'plus', 'additionally', 'as well as', 'both'],
  complex: ['but', 'however', 'situation', 'multiple', 'several issues', 'complicated'],
  critical: ['emergency', 'urgent', 'crisis', 'immediately', 'right now', 'desperate'],
} as const;

// ═══════════════════════════════════════════════════════════
// Clarification Questions Per Category
// ═══════════════════════════════════════════════════════════

export const CLARIFICATION_QUESTIONS: Record<string, string[]> = {
  'Housing Assistance': [
    'You mentioned housing — is this about rent, eviction, or shelter?',
    'Are you currently homeless, or at risk of losing your housing?',
    'Do you need emergency shelter tonight or longer-term housing assistance?',
  ],
  'Food Assistance': [
    'Are you looking for immediate food assistance or ongoing nutrition programs?',
    'Do you have children who need school meal programs?',
    'Are you eligible for SNAP/EBT benefits, or do you need a food bank?',
  ],
  'Mental Health': [
    'You mentioned emotional distress — would you like counseling, crisis support, or ongoing therapy?',
    'Is this an immediate crisis, or are you looking for longer-term support?',
    'Would you prefer in-person counseling or telehealth options?',
  ],
  'Employment Services': [
    'Are you currently unemployed, or looking for better job training?',
    'Do you need help with resume writing, interview skills, or job placement?',
    'Are you interested in vocational training or education programs?',
  ],
  'Legal Aid': [
    'What type of legal help do you need — immigration, housing, family, or criminal?',
    'Do you have an upcoming court date or legal deadline?',
    'Are you facing eviction, custody issues, or immigration proceedings?',
  ],
  'Healthcare': [
    'Do you need immediate medical care or help with insurance and prescriptions?',
    'Are you looking for a free clinic, Medicaid enrollment, or prescription assistance?',
    'Is this for you or a family member?',
  ],
  'Substance Abuse': [
    'Are you seeking detox, rehab, or ongoing support groups?',
    'Is this for yourself or someone you care about?',
    'Do you need immediate help, or are you exploring options?',
  ],
  'Senior Services': [
    'Are you looking for meal delivery, in-home care, or benefits enrollment?',
    'Do you need help with Medicare, Social Security, or transportation?',
    'Is this for you or an elderly family member?',
  ],
};

// ═══════════════════════════════════════════════════════════
// Keyword-based Classification Labels
// ═══════════════════════════════════════════════════════════

export const LABEL_KEYWORDS: Record<string, string[]> = {
  'Housing Assistance': [
    'housing', 'rent', 'shelter', 'homeless', 'eviction', 'apartment', 'mortgage',
    'section 8', 'home', 'housing assistance', 'affordable housing', 'transitional housing',
    'emergency shelter', 'rental assistance', 'housing voucher', 'public housing',
    'foreclosure', 'utilities', 'water bill', 'electric bill', 'gas bill',
  ],
  'Food Assistance': [
    'food', 'hungry', 'groceries', 'snap', 'meals', 'eat', 'feeding', 'food bank',
    'ebt', 'wic', 'nutrition', 'school lunch', 'food pantry', 'free food',
    'food stamps', 'hunger', 'starving', 'can\'t afford food', 'no food',
    'meals on wheels', 'soup kitchen', 'community garden',
  ],
  'Mental Health': [
    'mental', 'depression', 'anxiety', 'therapy', 'counseling', 'ptsd',
    'stress', 'emotional', 'feelings', 'emotions', 'mood', 'panic',
    'trauma', 'grief', 'loss', 'sad', 'hopeless', 'overwhelmed',
    'mental health', 'psychiatrist', 'psychologist', 'coping', 'breakdown',
  ],
  'Employment Services': [
    'job', 'employment', 'work', 'unemployed', 'training', 'career', 'fired',
    'laid off', 'resume', 'workforce', 'hiring', 'job search', 'vocational',
    'skills training', 'job placement', 'career counseling', 'interview',
    'underemployed', 'part-time', 'gig work', 'freelance',
  ],
  'Legal Aid': [
    'legal', 'lawyer', 'immigration', 'court', 'custody', 'divorce',
    'deportation', 'rights', 'attorney', 'legal aid', 'lawsuit',
    'criminal', 'civil', 'tenant rights', 'disability rights',
    'bankruptcy', 'guardianship', 'name change', 'naturalization',
  ],
  'Healthcare': [
    'medical', 'health', 'doctor', 'insurance', 'prescription', 'hospital',
    'clinic', 'sick', 'pain', 'medicaid', 'medicare', 'dental',
    'vision', 'mental health', 'checkup', 'vaccination', 'telehealth',
    'free clinic', 'community health', 'prenatal', 'disability',
  ],
  'Substance Abuse': [
    'addiction', 'drugs', 'alcohol', 'rehab', 'detox', 'sober', 'overdose',
    'substance', 'recovery', 'aa meeting', 'na meeting', 'drinking problem',
    'drug problem', 'withdrawal', 'relapse', 'sober living',
    'treatment center', 'counseling', 'support group',
  ],
  'Senior Services': [
    'senior', 'elderly', 'aging', 'medicare', 'social security', 'retirement',
    'old age', 'grandparent', 'aged', 'older adult', 'senior center',
    'meals on wheels', 'in-home care', 'caregiver', 'assisted living',
    'nursing home', 'eldercare', 'mobility', 'fall prevention',
  ],
};
// Updated responsible AI configuration
