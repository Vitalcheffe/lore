// ═══════════════════════════════════════════════════════════
// ClearPath AI — Resource Types
// ═══════════════════════════════════════════════════════════

import type { VerificationStatus, SourceQuality } from './classification';

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string | null;
  phone: string | null;
  address: string | null;
  eligibility: string | null;
  hours: string | null;
  lastVerified: string | null;
  verificationStatus: VerificationStatus;
  sourceQuality: SourceQuality;
  geographicCoverage: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  resourceCount: number;
}

export interface SavedResource {
  id: string;
  userId: string;
  resourceId: string;
  resource: Resource;
  notes: string | null;
  createdAt: string;
}
