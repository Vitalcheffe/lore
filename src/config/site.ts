// ═══════════════════════════════════════════════════════════
// LORE — Site Configuration
// ═══════════════════════════════════════════════════════════

export const siteConfig = {
  name: 'LORE',
  description: 'Your team\'s memory, alive. Lore gives your team a shared memory that\'s structured, always consistent, and available everywhere. Powered by Aurora DSQL.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  tagline: 'Your Team\'s Memory, Alive',

  navLinks: [
    { label: 'Features', href: '/#features' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Architecture', href: '/architecture' },
    { label: 'About', href: '/about' },
  ] as const,

  appNavLinks: [
    { label: 'Dashboard', href: '/app', icon: 'LayoutDashboard' },
    { label: 'Knowledge Graph', href: '/app/graph', icon: 'Network' },
    { label: 'Morning Digest', href: '/app/digest', icon: 'Sun' },
    { label: 'AI Chat', href: '/app/chat', icon: 'MessageSquare' },
    { label: 'Memory', href: '/app/memory', icon: 'BookOpen' },
    { label: 'Settings', href: '/app/settings', icon: 'Settings' },
  ] as const,

  footerLinks: {
    product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Architecture', href: '/architecture' },
      { label: 'Changelog', href: '/changelog' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { label: 'Documentation', href: '/architecture' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },

  socialLinks: {
    github: 'https://github.com/Vitalcheffe/lore',
    twitter: 'https://twitter.com/lore_app',
    linkedin: 'https://linkedin.com/company/lore-app',
  },

  stripe: {
    starterPriceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    proPriceId: process.env.STRIPE_PRO_PRICE_ID || '',
    enterprisePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
  },

  features: {
    knowledgeGraph: {
      name: 'Knowledge Graph',
      description: 'See every connection in your team\'s knowledge. Interactive, visual, always up to date.',
      icon: 'Network',
    },
    morningDigest: {
      name: 'Morning Digest',
      description: 'Start every day with clarity. AI-powered summaries of what changed, what matters, and what\'s next.',
      icon: 'Sun',
    },
    aiChat: {
      name: 'AI Chat',
      description: 'Ask anything about your team\'s knowledge. Get answers grounded in your own data, not hallucinations.',
      icon: 'MessageSquare',
    },
    structuredMemory: {
      name: 'Structured Memory',
      description: 'Notes, bookmarks, insights — all organized and connected. Never lose a thought again.',
      icon: 'BookOpen',
    },
  },
} as const;

export type NavLink = typeof siteConfig.navLinks[number];
export type AppNavLink = typeof siteConfig.appNavLinks[number];
