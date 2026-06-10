// ═══════════════════════════════════════════════════════════
// ClearPath AI — Auth Configuration
// ═══════════════════════════════════════════════════════════

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    verifyRequest: '/login',
    newUser: '/signup',
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  providers: {
    credentials: {
      enabled: true,
    },
    google: {
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    facebook: {
      enabled: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    },
    apple: {
      enabled: !!(process.env.APPLE_ID && process.env.APPLE_TEAM_ID),
    },
  },
} as const;
