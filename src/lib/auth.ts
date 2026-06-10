// ═══════════════════════════════════════════════════════════
// LORE — NextAuth Configuration
// ═══════════════════════════════════════════════════════════

import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { db } from '@/lib/db';

// ── Extend NextAuth Types ──────────────────────────────
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    plan: string;
    onboardingComplete?: boolean;
  }
  interface Session {
    user: User & {
      id: string;
      plan: string;
      onboardingComplete?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    plan: string;
    onboardingComplete?: boolean;
  }
}

// ── OAuth Find-or-Create Helper ────────────────────────
async function oauthFindOrCreate(params: {
  provider: string;
  providerAccountId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const { provider, providerAccountId, email, name, image } = params;

  const existingAccount = await db.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    await db.account.create({
      data: {
        userId: existingUser.id,
        type: 'oauth',
        provider,
        providerAccountId,
      },
    });
    return existingUser;
  }

  const newUser = await db.user.create({
    data: {
      email,
      name: name ?? null,
      image: image ?? null,
      accounts: {
        create: { type: 'oauth', provider, providerAccountId },
      },
    },
  });

  // Create default UserSettings for new OAuth users
  await db.userSettings.create({
    data: { userId: newUser.id },
  });

  return newUser;
}

// ── Auth Options ───────────────────────────────────────
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password');
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan,
          onboardingComplete: user.onboardingComplete,
        };
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || 'free';
        token.onboardingComplete = (user as any).onboardingComplete ?? false;
      }

      if (account && user && account.type === 'oauth') {
        const dbUser = await oauthFindOrCreate({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user.email!,
          name: user.name,
          image: user.image,
        });
        token.id = dbUser.id;
        token.plan = dbUser.plan;
        token.onboardingComplete = dbUser.onboardingComplete;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.onboardingComplete = token.onboardingComplete;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
