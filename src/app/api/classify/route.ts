import { NextRequest, NextResponse } from "next/server";

// ─── Configuration ─────────────────────────────────────────
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// ─── Crisis Keywords (hardcoded, deterministic) ────────────
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", "can't take this anymore",
  "want it all to end", "no reason to live", "better off dead", "hurt myself",
  "self-harm", "overdose", "jump off", "slit my", "hang myself",
  "end it all", "give up on life", "not worth living", "suicidal",
  "thinking about death", "don't want to be alive", "take my own life",
  "domestic violence", "being abused", "raped", "sexual assault",
  "child abuse", "human trafficking", "help me escape",
  "hits me", "beats me", "husband hits", "wife hits", "partner hits",
];

// ─── Classification Labels ─────────────────────────────────
const LABELS = [
  "Housing Assistance",
  "Food Assistance",
  "Mental Health",
  "Employment Services",
  "Legal Aid",
  "Healthcare",
  "Substance Abuse",
  "Senior Services",
];

// ─── Crisis Detection ──────────────────────────────────────
function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

// ─── Classification via HuggingFace ────────────────────────
async function classifyWithHF(text: string): Promise<Array<{ label: string; score: number }>> {
  if (!HF_API_KEY || HF_API_KEY === "hf_xxxxx") {
    return simulateClassification(text);
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: LABELS,
          multi_label: true,
        },
      }),
    });

    if (!response.ok) {
      console.error("HF API error:", response.status, await response.text());
      return simulateClassification(text);
    }

    const result = await response.json();

    // BART-large-MNLI zero-shot returns { labels: string[], scores: number[] }
    if (result.labels && result.scores) {
      return result.labels.map((label: string, i: number) => ({
        label,
        score: result.scores[i],
      }));
    }

    return simulateClassification(text);
  } catch (error) {
    console.error("Classification error:", error);
    return simulateClassification(text);
  }
}

// ─── Simulated Classification (fallback for demo) ──────────
function simulateClassification(text: string): Array<{ label: string; score: number }> {
  const lower = text.toLowerCase();
  const results: Array<{ label: string; score: number }> = [];

  const labelKeywords: Record<string, string[]> = {
    "Housing Assistance": ["housing", "rent", "shelter", "homeless", "eviction", "apartment", "mortgage", "section 8", "home"],
    "Food Assistance": ["food", "hungry", "groceries", "snap", "meals", "eat", "feeding", "food bank", "ebt"],
    "Mental Health": ["mental", "depression", "anxiety", "therapy", "counseling", "ptsd", "stress", "emotional", "feelings", "emotions", "mood"],
    "Employment Services": ["job", "employment", "work", "unemployed", "training", "career", "fired", "laid off", "resume", "workforce"],
    "Legal Aid": ["legal", "lawyer", "immigration", "court", "custody", "divorce", "deportation", "rights"],
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain", "medication", "insulin"],
    "Substance Abuse": ["addiction", "drugs", "alcohol", "rehab", "detox", "sober", "overdose", "substance"],
    "Senior Services": ["senior", "elderly", "aging", "medicare", "social security", "retirement", "old age", "grandparent"],
  };

  for (const [label, keywords] of Object.entries(labelKeywords)) {
    let score = 0;
    let matchCount = 0;

    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matchCount++;
        score += 0.3;
      }
    }

    if (matchCount > 0) {
      score = Math.min(0.95, 0.5 + score);
      if (label === "Mental Health" && matchCount <= 1) {
        score *= 0.7;
      }
    } else {
      score = 0.1 + Math.random() * 0.15;
    }

    results.push({ label, score: Math.round(score * 100) / 100 });
  }

  results.sort((a, b) => b.score - a.score);
  return results.filter((r) => r.score > 0.3);
}

// ─── Optional DB save (non-blocking) ──────────────────────
async function saveToDatabase(data: {
  text: string;
  isCrisis: boolean;
  categories: Array<{ label: string; score: number }>;
  topConfidence: number;
  topCategory: string;
  crisisLines?: Array<{ name: string; action: string; call?: string }>;
  conversationId?: string | null;
  userId?: string | null;
}): Promise<string | null> {
  try {
    const { db } = await import("@/lib/db");

    const conversation = await db.conversation.create({
      data: {
        userId: data.userId || null,
        title: data.text.substring(0, 60) + (data.text.length > 60 ? "..." : ""),
        preview: data.text.substring(0, 100),
        category: data.topCategory,
        categoryColor: data.isCrisis ? "#dc2626" : "#3b82f6",
        confidence: data.topConfidence,
        isCrisis: data.isCrisis,
        isGuest: !data.userId,
      },
    });

    await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        text: data.text,
        isCrisis: data.isCrisis,
      },
    });

    return conversation.id;
  } catch (error) {
    console.error("DB save failed (non-blocking):", error);
    return null;
  }
}

// ─── POST Handler ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    // Try to get authenticated user (non-blocking)
    let userId: string | null = null;
    try {
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch {
      // No session — guest user (this is fine for a demo)
    }

    // Layer 1: Crisis Detection (hardcoded, deterministic)
    const isCrisis = detectCrisis(text);

    if (isCrisis) {
      const crisisLines = [
        { name: "988 Suicide & Crisis Lifeline", action: "Free. Confidential. 24/7.", call: "988" },
        { name: "Crisis Text Line", action: "Text HOME to 741741", call: "Text" },
        { name: "National Domestic Violence Hotline", action: "1-800-799-7233", call: "1-800-799-7233" },
        { name: "Local Crisis Center", action: "Talk to a real person now", call: "211" },
      ];

      // Try to save to DB (non-blocking)
      const conversationId = await saveToDatabase({
        text,
        isCrisis: true,
        categories: [],
        topConfidence: 99,
        topCategory: "Crisis",
        crisisLines,
        userId,
      });

      return NextResponse.json({
        isCrisis: true,
        conversationId,
        crisisLines,
        categories: [],
        note: "Crisis keyword detected — AI classification bypassed entirely",
      });
    }

    // Layer 2: AI Classification
    const classifications = await classifyWithHF(text);

    // Layer 3: Confidence-gated response with smart filtering
    const topResult = classifications[0];
    const topConfidence = topResult ? Math.round(topResult.score * 100) : 0;

    // Smart filtering: separate into high/moderate/low confidence tiers
    const HIGH_THRESHOLD = 70;
    const MODERATE_THRESHOLD = 40;
    const DISPLAY_THRESHOLD = 25;

    const highConfidence = classifications.filter(c => Math.round(c.score * 100) >= HIGH_THRESHOLD);
    const moderateConfidence = classifications.filter(c => {
      const pct = Math.round(c.score * 100);
      return pct >= MODERATE_THRESHOLD && pct < HIGH_THRESHOLD;
    });
    const lowConfidence = classifications.filter(c => {
      const pct = Math.round(c.score * 100);
      return pct >= DISPLAY_THRESHOLD && pct < MODERATE_THRESHOLD;
    });

    const displayCategories = classifications.filter(c => Math.round(c.score * 100) >= DISPLAY_THRESHOLD);

    const needsClarification = (topResult && topResult.score < 0.5) || highConfidence.length === 0;

    const topCategory = topResult?.label || "General";

    // Try to save to DB (non-blocking)
    const conversationId = await saveToDatabase({
      text,
      isCrisis: false,
      categories: classifications,
      topConfidence,
      topCategory,
      userId,
    });

    return NextResponse.json({
      isCrisis: false,
      conversationId,
      categories: displayCategories.map((c) => ({
        label: c.label,
        confidence: Math.round(c.score * 100),
      })),
      confidenceTiers: {
        high: highConfidence.map(c => ({ label: c.label, confidence: Math.round(c.score * 100) })),
        moderate: moderateConfidence.map(c => ({ label: c.label, confidence: Math.round(c.score * 100) })),
        low: lowConfidence.map(c => ({ label: c.label, confidence: Math.round(c.score * 100) })),
        hidden: classifications.filter(c => Math.round(c.score * 100) < DISPLAY_THRESHOLD).length,
      },
      needsClarification,
      clarificationMessage: needsClarification
        ? highConfidence.length === 0
          ? "I found some possible matches but I'm not very confident — could you share more details?"
          : "Your top match is below 50% confidence — a few more details would help"
        : null,
      model: HF_API_KEY && HF_API_KEY !== "hf_xxxxx" ? "BART-large-MNLI (live)" : "BART-large-MNLI (simulated)",
    });
  } catch (error) {
    console.error("Classification API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET Handler (health check) ────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ClearPath AI Classification API",
    version: "1.0.0",
    model: "facebook/bart-large-mnli",
    crisisDetection: "hardcoded (deterministic)",
    labels: LABELS,
  });
}
