import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

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

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", "can't take this anymore",
  "want it all to end", "no reason to live", "better off dead", "hurt myself",
  "self-harm", "overdose", "jump off", "slit my", "hang myself",
  "end it all", "give up on life", "not worth living", "suicidal",
  "thinking about death", "don't want to be alive", "take my own life",
  "gonna kill", "going to kill", "gonna shoot", "going to shoot",
  "kill him", "kill her", "kill them", "kill someone",
  "shoot him", "shoot her", "shoot them", "shoot someone",
  "stab", "murder", "hurt someone", "harm someone",
  "threaten", "weapon", "gun", "knife attack",
  "domestic violence", "being abused", "raped", "sexual assault",
  "child abuse", "human trafficking", "help me escape",
  "hits me", "beats me", "husband hits", "wife hits", "partner hits",
];

function keywordFallback(text: string): Array<{ label: string; confidence: number }> {
  const lower = text.toLowerCase();
  const labelKeywords: Record<string, string[]> = {
    "Housing Assistance": ["housing", "rent", "shelter", "homeless", "eviction", "apartment", "mortgage", "home", "place to stay"],
    "Food Assistance": ["food", "hungry", "groceries", "snap", "meals", "eat", "feeding", "food bank", "ebt", "starving"],
    "Mental Health": ["mental", "depression", "anxiety", "therapy", "counseling", "ptsd", "stress", "emotional", "feelings", "overwhelmed", "angry", "afraid", "trauma"],
    "Employment Services": ["job", "employment", "work", "unemployed", "training", "career", "fired", "resume", "workforce"],
    "Legal Aid": ["legal", "lawyer", "immigration", "court", "custody", "divorce", "deportation", "rights", "police"],
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain", "medication"],
    "Substance Abuse": ["addiction", "drugs", "alcohol", "rehab", "detox", "sober", "overdose", "substance"],
    "Senior Services": ["senior", "elderly", "aging", "medicare", "social security", "retirement"],
  };

  const results: Array<{ label: string; confidence: number }> = [];
  for (const [label, keywords] of Object.entries(labelKeywords)) {
    const matched = keywords.filter((kw) => lower.includes(kw)).length;
    if (matched > 0) {
      results.push({ label, confidence: Math.min(95, 40 + matched * 20) });
    }
  }
  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}

function parseHFResult(result: any): Array<{ label: string; confidence: number }> {
  if (!result) return [];

  // Format 1: { labels: [...], scores: [...] }
  if (result.labels && result.scores) {
    return result.labels.map((label: string, i: number) => ({
      label,
      confidence: Math.round(result.scores[i] * 100),
    }));
  }

  // Format 2: [{ label: "...", score: 0.8 }, ...]
  if (Array.isArray(result)) {
    return result.map((item: any) => ({
      label: item.label || item.class,
      confidence: Math.round((item.score || item.confidence || 0) * 100),
    }));
  }

  return [];
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    // 1. Crisis check
    const lower = text.toLowerCase().trim();
    const isCrisis = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));

    if (isCrisis) {
      return NextResponse.json({
        isCrisis: true,
        crisisLines: [
          { name: "988 Suicide & Crisis Lifeline", action: "Free. Confidential. 24/7.", call: "988" },
          { name: "Crisis Text Line", action: "Text HOME to 741741", call: "Text" },
          { name: "National Domestic Violence Hotline", action: "1-800-799-7233", call: "1-800-799-7233" },
          { name: "Local Crisis Center", action: "Talk to a real person now", call: "211" },
        ],
        categories: [],
      });
    }

    // 2. Call HuggingFace API
    let categories: Array<{ label: string; confidence: number }> = [];
    let usedAPI = false;

    if (HF_API_KEY) {
      try {
        const response = await fetch(HF_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: text,
            parameters: { candidate_labels: LABELS, multi_label: true },
          }),
          signal: AbortSignal.timeout(30_000),
        });

        if (response.status === 503) {
          const body = await response.json() as { estimated_time?: number };
          await new Promise((r) => setTimeout(r, Math.min((body.estimated_time || 10) * 1000, 20000)));
          const retry = await fetch(HF_API_URL, {
            method: "POST",
            headers: { Authorization: `Bearer ${HF_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: text, parameters: { candidate_labels: LABELS, multi_label: true } }),
            signal: AbortSignal.timeout(30_000),
          });
          if (retry.ok) {
            categories = parseHFResult(await retry.json());
            if (categories.length > 0) usedAPI = true;
          }
        } else if (response.ok) {
          categories = parseHFResult(await response.json());
          if (categories.length > 0) usedAPI = true;
        }
      } catch (err) {
        console.error("[classify] HF error:", err);
      }
    }

    // 3. Fallback to keywords if HF didn't return results
    if (categories.length === 0) {
      categories = keywordFallback(text);
    }

    // 4. Keep only high-confidence results: top 2, minimum 40% confidence
    categories = categories
      .filter((c) => c.confidence >= 40)
      .slice(0, 2);

    return NextResponse.json({
      isCrisis: false,
      categories,
      source: usedAPI ? "huggingface" : "keywords",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    model: HF_MODEL,
    apiKeySet: !!HF_API_KEY,
  });
}
