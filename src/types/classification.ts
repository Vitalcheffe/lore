// ═══════════════════════════════════════════════════════════
// ClearPath AI — Classification Types
// ═══════════════════════════════════════════════════════════

export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified' | 'disputed';
export type SourceQuality = 'government' | 'nonprofit' | 'community' | 'ai_generated';
export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'critical';
export type CrisisType = 'suicide' | 'self_harm' | 'domestic_violence' | 'substance_crisis' | 'child_abuse' | 'human_trafficking' | 'immediate_danger' | null;

export interface CategoryScore {
  label: string;
  score: number;
}

export interface CrisisResource {
  name: string;
  action: string;
  call: string;
  url?: string;
}

export interface BiasInfo {
  detected: boolean;
  types: string[];
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface AlternativeView {
  category: string;
  confidence: number;
  reason: string;
}

export interface TransparencyLayer {
  /** Layer 1: Confidence Score (0-100) */
  confidence: number;
  /** Layer 2: Source Quality */
  sourceQuality: SourceQuality;
  sourceQualityScore: number;
  /** Layer 3: Bias Check */
  biasCheck: BiasInfo;
  /** Layer 4: Complexity Level */
  complexity: ComplexityLevel;
  complexityExplanation: string;
  /** Layer 5: Alternative Views */
  alternatives: AlternativeView[];
  /** Layer 6: Verification Status */
  verification: VerificationStatus;
  lastVerified: string | null;
}

export interface MatchedResource {
  id: string;
  name: string;
  description: string;
  category: string;
  url?: string;
  phone?: string;
  address?: string;
  eligibility?: string;
  hours?: string;
  sourceQuality: SourceQuality;
  verificationStatus: VerificationStatus;
  lastVerified: string | null;
}

export interface ClassificationResult {
  id: string;
  userId: string | null;
  inputText: string;
  category: string;
  confidence: number;
  allScores: CategoryScore[];
  sourceQuality: SourceQuality;
  biasCheck: BiasInfo;
  complexityLevel: ComplexityLevel;
  alternativeCategories: AlternativeView[];
  verificationStatus: VerificationStatus;
  isCrisis: boolean;
  crisisType: CrisisType;
  modelUsed: string;
  clarificationQuestion: string | null;
  matchedResources: MatchedResource[];
  transparencyLayers: TransparencyLayer;
  createdAt: string;
}

export interface ClassificationRequest {
  text: string;
  userId?: string;
  sessionId?: string;
}

export interface ClassificationResponse {
  isCrisis: boolean;
  categories: CategoryScore[];
  crisisLines?: CrisisResource[];
  note?: string;
  needsClarification: boolean;
  clarificationMessage?: string | null;
  clarificationQuestion?: string | null;
  model: string;
  transparencyLayers?: TransparencyLayer;
  matchedResources?: MatchedResource[];
  classificationId?: string;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  type: CrisisType;
  severity: 'critical' | 'high' | 'medium';
  matchedKeywords: string[];
  resources: CrisisResource[];
}
