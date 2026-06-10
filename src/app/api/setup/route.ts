import { sql } from '@vercel/postgres'

export async function GET() {
  const results: { table: string; status: string; error?: string }[] = []

  const tables = [
    {
      name: 'User',
      create: sql`CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "username" TEXT,
        "passwordHash" TEXT,
        "plan" TEXT NOT NULL DEFAULT 'free',
        "stripeCustomerId" TEXT,
        "stripeSubscriptionId" TEXT,
        "stripePriceId" TEXT,
        "stripeCurrentPeriodEnd" TIMESTAMP(3),
        "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`,
      ],
    },
    {
      name: 'Account',
      create: sql`CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,
      ],
    },
    {
      name: 'Session',
      create: sql`CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,
      ],
    },
    {
      name: 'VerificationToken',
      create: sql`CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`,
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`,
      ],
    },
    {
      name: 'KnowledgeNode',
      create: sql`CREATE TABLE IF NOT EXISTS "KnowledgeNode" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL DEFAULT '',
        "type" TEXT NOT NULL DEFAULT 'concept',
        "color" TEXT NOT NULL DEFAULT '#4F46E5',
        "icon" TEXT,
        "source" TEXT,
        "tags" TEXT,
        "isFavorite" BOOLEAN NOT NULL DEFAULT false,
        "x" DOUBLE PRECISION,
        "y" DOUBLE PRECISION,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'KnowledgeEdge',
      create: sql`CREATE TABLE IF NOT EXISTS "KnowledgeEdge" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "sourceId" TEXT NOT NULL,
        "targetId" TEXT NOT NULL,
        "label" TEXT,
        "type" TEXT NOT NULL DEFAULT 'related',
        "strength" INTEGER NOT NULL DEFAULT 5,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "KnowledgeEdge_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "KnowledgeEdge_sourceId_targetId_label_key" ON "KnowledgeEdge"("sourceId", "targetId", "label")`,
      ],
    },
    {
      name: 'Digest',
      create: sql`CREATE TABLE IF NOT EXISTS "Digest" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "keyInsights" TEXT NOT NULL,
        "connections" TEXT,
        "mood" TEXT,
        "focusAreas" TEXT,
        "aiComment" TEXT,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Digest_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "Digest_userId_date_key" ON "Digest"("userId", "date")`,
      ],
    },
    {
      name: 'Note',
      create: sql`CREATE TABLE IF NOT EXISTS "Note" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL DEFAULT '',
        "type" TEXT NOT NULL DEFAULT 'note',
        "category" TEXT,
        "tags" TEXT,
        "pinned" BOOLEAN NOT NULL DEFAULT false,
        "aiSummary" TEXT,
        "sourceUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'ChatConversation',
      create: sql`CREATE TABLE IF NOT EXISTS "ChatConversation" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "title" TEXT NOT NULL,
        "preview" TEXT NOT NULL DEFAULT '',
        "pinned" BOOLEAN NOT NULL DEFAULT false,
        "category" TEXT,
        "categoryColor" TEXT,
        "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "isCrisis" BOOLEAN NOT NULL DEFAULT false,
        "isGuest" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'ChatMessage',
      create: sql`CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" TEXT NOT NULL,
        "conversationId" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "category" TEXT,
        "confidence" DOUBLE PRECISION,
        "isCrisis" BOOLEAN NOT NULL DEFAULT false,
        "resources" TEXT,
        "alternatives" TEXT,
        "why" TEXT,
        "also" TEXT,
        "warning" TEXT,
        "metadata" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'UserSettings',
      create: sql`CREATE TABLE IF NOT EXISTS "UserSettings" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "theme" TEXT NOT NULL DEFAULT 'light',
        "language" TEXT NOT NULL DEFAULT 'en',
        "digestTime" TEXT NOT NULL DEFAULT '08:00',
        "digestEnabled" BOOLEAN NOT NULL DEFAULT true,
        "digestEmailNotif" BOOLEAN NOT NULL DEFAULT true,
        "includeAIComment" BOOLEAN NOT NULL DEFAULT true,
        "graphLayout" TEXT NOT NULL DEFAULT 'force',
        "graphShowLabels" BOOLEAN NOT NULL DEFAULT true,
        "nodeSize" TEXT NOT NULL DEFAULT 'medium',
        "edgeStyle" TEXT NOT NULL DEFAULT 'solid',
        "animationSpeed" TEXT NOT NULL DEFAULT 'normal',
        "chatModel" TEXT NOT NULL DEFAULT 'default',
        "chatStreamResponses" BOOLEAN NOT NULL DEFAULT true,
        "showSources" BOOLEAN NOT NULL DEFAULT true,
        "confidenceThreshold" INTEGER NOT NULL DEFAULT 70,
        "memoryAutoTag" BOOLEAN NOT NULL DEFAULT true,
        "memoryAutoLink" BOOLEAN NOT NULL DEFAULT true,
        "sidebarPosition" TEXT NOT NULL DEFAULT 'left',
        "fontSize" TEXT NOT NULL DEFAULT 'normal',
        "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
        "emailNotifs" BOOLEAN NOT NULL DEFAULT true,
        "weeklySummary" BOOLEAN NOT NULL DEFAULT true,
        "newFeatures" BOOLEAN NOT NULL DEFAULT true,
        "digestReminders" BOOLEAN NOT NULL DEFAULT true,
        "twoFactor" BOOLEAN NOT NULL DEFAULT false,
        "dataRetention" TEXT NOT NULL DEFAULT '90',
        "developerMode" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "UserSettings_userId_key" ON "UserSettings"("userId")`,
      ],
    },
    {
      name: 'Team',
      create: sql`CREATE TABLE IF NOT EXISTS "Team" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "plan" TEXT NOT NULL DEFAULT 'free',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "Team_slug_key" ON "Team"("slug")`,
      ],
    },
    {
      name: 'TeamMember',
      create: sql`CREATE TABLE IF NOT EXISTS "TeamMember" (
        "id" TEXT NOT NULL,
        "teamId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'viewer',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId")`,
      ],
    },
    {
      name: 'TeamInvitation',
      create: sql`CREATE TABLE IF NOT EXISTS "TeamInvitation" (
        "id" TEXT NOT NULL,
        "teamId" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'viewer',
        "message" TEXT,
        "token" TEXT NOT NULL,
        "accepted" BOOLEAN NOT NULL DEFAULT false,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "TeamInvitation_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "TeamInvitation_token_key" ON "TeamInvitation"("token")`,
      ],
    },
    {
      name: 'SavedResource',
      create: sql`CREATE TABLE IF NOT EXISTS "SavedResource" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "categoryColor" TEXT NOT NULL DEFAULT '#3b82f6',
        "confidence" INTEGER NOT NULL DEFAULT 0,
        "verifiedDate" TEXT,
        "action" TEXT,
        "detail" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SavedResource_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'CommunityResource',
      create: sql`CREATE TABLE IF NOT EXISTS "CommunityResource" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "services" TEXT,
        "lastVerified" TEXT,
        "distance" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CommunityResource_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'ContactSubmission',
      create: sql`CREATE TABLE IF NOT EXISTS "ContactSubmission" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "organization" TEXT,
        "subject" TEXT,
        "urgency" TEXT NOT NULL DEFAULT 'medium',
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'new',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'Resource',
      create: sql`CREATE TABLE IF NOT EXISTS "Resource" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "services" TEXT NOT NULL DEFAULT '[]',
        "languages" TEXT NOT NULL DEFAULT '[]',
        "phone" TEXT,
        "address" TEXT,
        "hours" TEXT,
        "eligibility" TEXT,
        "url" TEXT,
        "zip" TEXT,
        "lastVerified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [],
    },
    {
      name: 'BlogPost',
      create: sql`CREATE TABLE IF NOT EXISTS "BlogPost" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "excerpt" TEXT,
        "coverImage" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "publishedAt" TIMESTAMP(3),
        "tags" TEXT NOT NULL DEFAULT '[]',
        "authorId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug")`,
      ],
    },
    {
      name: 'NewsletterSubscription',
      create: sql`CREATE TABLE IF NOT EXISTS "NewsletterSubscription" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
      )`,
      indexes: [
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email")`,
      ],
    },
  ]

  // Create tables first (no foreign keys yet)
  for (const table of tables) {
    try {
      await table.create
      // Create indexes
      for (const idx of table.indexes) {
        try {
          await idx
        } catch {
          // Index might already exist, that's fine
        }
      }
      results.push({ table: table.name, status: 'created' })
    } catch (e: any) {
      results.push({ table: table.name, status: 'error', error: e.message })
    }
  }

  // Add foreign keys (after all tables exist)
  const foreignKeys = [
    `ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Digest" ADD CONSTRAINT "Digest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "SavedResource" ADD CONSTRAINT "SavedResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  ]

  const fkResults: { constraint: string; status: string; error?: string }[] = []
  for (const fk of foreignKeys) {
    try {
      await sql.query(fk)
      fkResults.push({ constraint: fk.split('ADD CONSTRAINT ')[1].split(' FOREIGN')[0], status: 'created' })
    } catch (e: any) {
      // Constraint might already exist
      if (e.message?.includes('already exists')) {
        fkResults.push({ constraint: fk.split('ADD CONSTRAINT ')[1].split(' FOREIGN')[0], status: 'already_exists' })
      } else {
        fkResults.push({ constraint: fk.split('ADD CONSTRAINT ')[1].split(' FOREIGN')[0], status: 'error', error: e.message })
      }
    }
  }

  const hasErrors = results.some(r => r.status === 'error')

  return Response.json({
    success: !hasErrors,
    message: hasErrors
      ? 'Some tables had errors. Check the results.'
      : 'All tables created successfully! Your database is ready. You can now sign up and log in.',
    tables: results,
    foreignKeys: fkResults,
  })
}
