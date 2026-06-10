import { NextRequest, NextResponse } from "next/server";

// ─── Input Sanitization ───────────────────────────────────
function sanitizeInput(text: string): string {
  let sanitized = text.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/script\s*:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  return sanitized;
}

// ─── Crisis Detection (deterministic, no AI, no network calls) ───
// Uses regex patterns for robust matching — handles case, spacing, punctuation.
// Must complete in <200ms.

interface CrisisResource {
  name: string;
  action: string;
  available: string;
  note: string | null;
}

interface CrisisCategory {
  patterns: RegExp[];
  resources: CrisisResource[];
  category_note: string | null;
}

const CRISIS_CATEGORIES: Record<string, CrisisCategory> = {
  suicide_self_harm: {
    patterns: [
      /suicid/i,
      /kill\s+myself/i,
      /end\s+it\s+all/i,
      /end\s+my\s+life/i,
      /end\s+it\b/i,                       // "maybe I will end it" — CRITICAL
      /want\s+to\s+die/i,
      /take\s+my\s+life/i,
      /can'?t\s+take\s+(this|it)/i,
      /want\s+it\s+all\s+to\s+end/i,
      /ending\s+it/i,
      /harm\s+myself/i,
      /self[- ]?harm/i,
      /cutting\s+myself/i,
      /hurt\s+myself/i,
      /want\s+to\s+hurt\s+myself/i,
      /don'?t\s+want\s+to\s+live/i,
      /no\s+(reason|point)\s+to\s+live/i,
      /better\s+off\s+dead/i,
      /can'?t\s+go\s+on/i,
      /give\s+up\s+on\s+life/i,
      /overdose/i,
      /take\s+pills/i,
      /jump\s+off/i,
      /hang\s+myself/i,
      /slit\s+my\s+wrists/i,
      /not\s+worth\s+living/i,
      /no\s+point\s+in\s+living/i,
      /world\s+without\s+me/i,
      /life\s+(means|has)\s+nothing/i,     // "my life means nothing" — CRITICAL
      /nothing\s+(to\s+)?live\s+for/i,
      /don'?t\s+want\s+to\s+exist/i,
      /want\s+to\s+disappear/i,
      /want\s+to\s+fall\s+asleep\s+(and\s+)?never/i,
      /i'?m\s+dying\b(?!\s+(for|to|of|from))/i,
      /i\s+am\s+dying\b(?!\s+(for|to|of|from))/i,
      /i'?m\s+going\s+to\s+die\b(?!\s+(from|of|for))/i,
      /i\s+am\s+going\s+to\s+die\b(?!\s+(from|of|for))/i,
      /help\s+me\s+i'?m\s+dying/i,
      /i\s+can'?t\s+breathe/i,
    ],
    resources: [
      { name: "988 Suicide & Crisis Lifeline", action: "Call or text 988", available: "24/7", note: null },
      { name: "Crisis Text Line", action: "Text HOME to 741741", available: "24/7", note: null },
      { name: "Emergency Services", action: "Call 911", available: "24/7", note: "If in immediate danger" },
    ],
    category_note: null,
  },
  domestic_violence: {
    patterns: [
      /domestic\s+violen/i,
      /domestic\s+abuse/i,
      /(husband|wife|partner|boyfriend|girlfriend|spouse)\s+(hits?|beats?|hurts?|chokes?|strangles?)/i,
      /beats?\s+me/i,
      /hitting\s+me/i,
      /physical\s+abuse/i,
      /emotional\s+abuse/i,
      /threaten(ing)?\s+me/i,
      /controlling\s+me/i,
      /won'?t\s+let\s+me\s+leave/i,
      /trapped\s+in\s+my\s+relationship/i,
      /afraid\s+of\s+my\s+partner/i,
      /scared\s+of\s+my\s+(husband|wife)/i,
      /being\s+beaten/i,
      /being\s+abused/i,
      /abused\s+by\s+my\s+partner/i,
      /choking\s+me/i,
      /strangling\s+me/i,
      /stalking\s+me/i,
      /threatening\s+to\s+kill/i,
    ],
    resources: [
      { name: "National Domestic Violence Hotline", action: "1-800-799-7233", available: "24/7", note: null },
      { name: "Crisis Text Line", action: "Text LOVEIS to 22522", available: "24/7", note: null },
    ],
    category_note: "Your immigration status does not prevent you from getting help. You have rights regardless of your status.",
  },
  substance_abuse: {
    patterns: [
      /overdos/i,
      /took\s+too\s+many\s+pills/i,
      /alcohol\s+poisoning/i,
      /drug\s+overdose/i,
      /meth\s+overdose/i,
      /opioid\s+overdose/i,
      /fentanyl/i,
      /heroin/i,
      /cocaine\s+overdose/i,
      /need\s+rehab/i,
      /can'?t\s+stop\s+drinking/i,
      /can'?t\s+stop\s+using/i,
      /withdrawal\s+symptoms/i,
    ],
    resources: [
      { name: "SAMHSA National Helpline", action: "1-800-662-4357", available: "24/7", note: null },
      { name: "Poison Control", action: "1-800-222-1222", available: "24/7", note: null },
      { name: "988 Suicide & Crisis Lifeline", action: "Call or text 988", available: "24/7", note: null },
      { name: "Emergency Services", action: "Call 911", available: "24/7", note: "If in immediate danger" },
    ],
    category_note: null,
  },
  child_abuse: {
    patterns: [
      /child\s+abuse/i,
      /abusing\s+my\s+child/i,
      /hurting\s+my\s+child/i,
      /neglecting\s+my\s+children/i,
      /afraid\s+i'?ll\s+hurt\s+my\s+child/i,
      /child\s+protective\s+services/i,
      /\bcps\b/i,
      /foster\s+care/i,
    ],
    resources: [
      { name: "Childhelp National Child Abuse Hotline", action: "1-800-422-4453", available: "24/7", note: null },
      { name: "Emergency Services", action: "Call 911", available: "24/7", note: "If a child is in immediate danger" },
    ],
    category_note: null,
  },
  sexual_assault: {
    patterns: [
      /sexual\s+assault/i,
      /\braped?\b/i,
      /sexual\s+abuse/i,
      /assaulted\s+me/i,
      /touched\s+me\s+without\s+consent/i,
      /nonconsensual/i,
    ],
    resources: [
      { name: "RAINN National Sexual Assault Hotline", action: "1-800-656-4673", available: "24/7", note: null },
      { name: "Emergency Services", action: "Call 911", available: "24/7", note: null },
    ],
    category_note: "You are not alone. What happened is not your fault.",
  },
  human_trafficking: {
    patterns: [
      /human\s+trafficking/i,
      /forced\s+to\s+work/i,
      /forced\s+into\s+sex\s+work/i,
      /being\s+trafficked/i,
      /trafficking/i,
      /held\s+against\s+my\s+will/i,
      /passport\s+taken/i,
      /can'?t\s+leave\s+my\s+employer/i,
    ],
    resources: [
      { name: "National Human Trafficking Hotline", action: "1-888-373-7888", available: "24/7", note: null },
      { name: "Text HOTLINE", action: "Text 233733", available: "24/7", note: null },
      { name: "Emergency Services", action: "Call 911", available: "24/7", note: null },
    ],
    category_note: null,
  },
};

// Priority order: suicide > DV > substance > child > assault > trafficking
const CATEGORY_PRIORITY = [
  "suicide_self_harm",
  "domestic_violence",
  "substance_abuse",
  "child_abuse",
  "sexual_assault",
  "human_trafficking",
];

function detectCrisis(userInput: string): {
  crisis_detected: true;
  crisis_category: string;
  crisis_resources: CrisisResource[];
  category_note: string | null;
  allow_continue: true;
} | null {
  for (const category of CATEGORY_PRIORITY) {
    const data = CRISIS_CATEGORIES[category];

    // Regex-based matching — handles case-insensitivity, punctuation, spacing
    const match = data.patterns.some(pattern => pattern.test(userInput));

    if (match) {
      return {
        crisis_detected: true,
        crisis_category: category,
        crisis_resources: data.resources,
        category_note: data.category_note,
        allow_continue: true,
      };
    }
  }

  return null;
}

// ─── POST Handler ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_input } = body;

    if (
      !user_input ||
      typeof user_input !== "string" ||
      user_input.trim().length === 0 ||
      user_input.trim().length > 2000
    ) {
      return NextResponse.json(
        { error: "user_input is required and must be 1-2000 characters" },
        { status: 400 }
      );
    }

    const sanitizedInput = sanitizeInput(user_input.trim());
    const crisisResult = detectCrisis(sanitizedInput);

    if (crisisResult) {
      return NextResponse.json(crisisResult);
    }

    return NextResponse.json({
      crisis_detected: false,
      crisis_category: null,
      crisis_resources: [],
      category_note: null,
      allow_continue: true,
    });
  } catch (error) {
    // FAIL-SAFE: If crisis check fails, assume crisis may be present.
    // It is safer to show crisis resources unnecessarily than to miss a real crisis.
    console.error("Crisis check error (assuming crisis for safety):", error);
    return NextResponse.json({
      crisis_detected: true,
      crisis_category: "unknown",
      crisis_resources: [
        { name: "988 Suicide & Crisis Lifeline", action: "Call or text 988", available: "24/7", note: null },
        { name: "Crisis Text Line", action: "Text HOME to 741741", available: "24/7", note: null },
        { name: "Emergency Services", action: "Call 911", available: "24/7", note: "If in immediate danger" },
      ],
      category_note: "Our safety system encountered an error. Crisis resources are shown as a precaution.",
      allow_continue: true,
    });
  }
}
