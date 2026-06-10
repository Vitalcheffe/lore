// ═══════════════════════════════════════════════════════════
// ClearPath AI — App Constants
// ═══════════════════════════════════════════════════════════

export const APP_NAME = 'ClearPath AI';
export const APP_DESCRIPTION = 'Community resource navigator with calibrated transparency';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const MAX_FREE_CLASSIFICATIONS_PER_DAY = 5;
export const CLASSIFICATION_RATE_LIMIT_PER_MINUTE = 10;
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const RESOURCE_VERIFICATION_INTERVAL_DAYS = 90;

export const MAX_INPUT_LENGTH = 1000;
export const MIN_INPUT_LENGTH = 3;

export const CRISIS_RESPONSE_MAX_MS = 200;
export const CLASSIFICATION_TIMEOUT_MS = 15000;

export const RESOURCE_CATEGORIES = [
  'Housing Assistance',
  'Food Assistance',
  'Mental Health',
  'Employment Services',
  'Legal Aid',
  'Healthcare',
  'Substance Abuse',
  'Senior Services',
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const BCRYPT_SALT_ROUNDS = 12;
