// ═══════════════════════════════════════════════════════════
// ClearPath AI — Pricing Configuration
// ═══════════════════════════════════════════════════════════

import type { Plan } from '@/types/user';

export interface PricingTier {
  name: string;
  plan: Plan;
  price: number;
  yearlyPrice: number | null;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  badge?: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    plan: 'FREE',
    price: 0,
    yearlyPrice: null,
    period: 'forever',
    description: 'Get started with basic resource navigation and crisis detection.',
    features: [
      '5 classifications per day',
      'Basic transparency layers (Confidence + Verification)',
      'Crisis detection (always on)',
      'Community resources directory',
      'Talk to a navigator (211)',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    plan: 'PRO',
    price: 9.99,
    yearlyPrice: 99.99,
    period: '/month',
    description: 'Unlimited access to all transparency layers and advanced features.',
    features: [
      'Unlimited classifications',
      'All 6 transparency layers',
      'Search history & analytics',
      'Saved resources & collections',
      'Clarification conversations',
      'Priority support',
      'Export classification reports',
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    plan: 'ENTERPRISE',
    price: 0,
    yearlyPrice: null,
    period: 'custom',
    description: 'For organizations that need custom resource databases and team management.',
    features: [
      'Everything in Pro',
      'REST API access',
      'Custom resource database',
      'Team management & roles',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
      'SSO/SAML integration',
    ],
    cta: 'Contact Sales',
    href: '/contact?subject=Enterprise',
    highlighted: false,
  },
];

export const FREE_TIER_LIMITS = {
  maxClassificationsPerDay: 5,
  maxSavedResources: 10,
  transparencyLayers: 2 as const, // Confidence + Verification only
} as const;

export const PRO_TIER_LIMITS = {
  maxClassificationsPerDay: Infinity,
  maxSavedResources: Infinity,
  transparencyLayers: 6 as const,
} as const;
