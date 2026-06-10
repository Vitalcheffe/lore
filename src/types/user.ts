// ═══════════════════════════════════════════════════════════
// ClearPath AI — User Types
// ═══════════════════════════════════════════════════════════

export type UserRole = 'USER' | 'ADMIN' | 'NAVIGATOR';
export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  organization: string | null;
  plan: Plan;
  role: UserRole;
  emailVerified: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  privacyMode: boolean;
}

export interface UserStats {
  totalClassifications: number;
  averageConfidence: number;
  topCategory: string;
  savedResources: number;
  plan: Plan;
  classificationsRemaining: number;
}
