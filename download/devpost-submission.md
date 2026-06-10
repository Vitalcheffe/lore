# ClearPath AI — Devpost Submission Materials

## 1. Project Description (2-3 paragraphs)

Every year, 211 receives over 14 million contacts from people seeking help — and millions more never reach them because they don't know the system exists. Navigating community resources is confusing, stigmatizing, and often impossible when you're already in crisis. Existing AI chatbots make this worse by hallucinating resources that don't exist, showing every answer with the same confidence, and having no protocol for crisis situations.

ClearPath AI solves this by classifying — not generating — community resource recommendations. We use BART-large-MNLI, a zero-shot natural language inference model, to match plain-language descriptions of need against 8 verified service categories (Housing, Food, Mental Health, Employment, Legal, Healthcare, Crisis Support, and Senior Services). Every result includes a calibrated confidence score, a plain-English explanation of why the AI made that classification, and a list of alternative categories considered. When confidence drops below 70%, we ask a clarifying question instead of guessing. When it drops below 50%, we escalate to a human 211 navigator.

Our 6-layer transparency pipeline runs every query through: (1) Free text input, (2) Hardcoded crisis detection that bypasses AI entirely, (3) Multi-label classification via BART-large-MNLI, (4) Confidence-gated clarification, (5) Transparent display with reasoning and alternatives, and (6) One-click human escalation to 211.org. We store zero data — no accounts, no logs, no tracking. When you close the tab, your data ceases to exist.

---

## 3. AI System Explanation

### How BART-large-MNLI Works

BART-large-MNLI is a natural language inference (NLI) model fine-tuned on the Multi-Genre Natural Language Inference corpus. It determines whether a given premise (the user's input) entails, contradicts, or is neutral toward a hypothesis (each candidate category label). In zero-shot classification mode, the model receives the user's text and a list of candidate labels, then scores each label based on how likely the text entails that category.

Unlike generative models (GPT, Claude, etc.) which produce text that sounds plausible but may be factually wrong, BART-large-MNLI is a classification model — it can only select from the labels you give it. This means it cannot hallucinate resources, invent phone numbers, or fabricate services. It can only match your description to pre-verified categories.

### What the 6 Layers Do

**Layer 1 — Free Text Input**: The user describes their situation in their own words. No forms, no dropdowns, no categories to pick from. This removes the burden of knowing the "right" term for what they need.

**Layer 2 — Hardcoded Crisis Detection**: Before any AI model runs, we check the input against a deterministic list of crisis keywords (suicide, self-harm, domestic violence, etc.). If any keyword is detected, the AI classification layer is completely bypassed. The user sees 988, 741741, and 911 immediately. This is not a soft filter or a moderation layer — it's a hardwired safety net that always takes priority over AI.

**Layer 3 — Multi-Label Classification**: The sanitized text is sent to BART-large-MNLI with 8 candidate labels. The model returns a probability distribution across all labels, and we surface all categories scoring above 40%. Multi-label classification means a single query like "I lost my job and can't pay rent" correctly matches both Employment Services and Housing Assistance.

**Layer 4 — Confidence-Gated Clarification**: If the top category scores below 70% confidence, the system asks a clarifying question instead of showing resources. The question is tailored to the top category (e.g., "Are you currently without a place to stay tonight?" for Housing). This prevents the system from giving wrong recommendations when it's unsure.

**Layer 5 — Transparent Display**: Every result card shows: the confidence score (as a number and visual ring), a "Why" explanation of which keywords triggered the classification, a list of alternative categories that were also considered, and the verified resources matching that category. Users can see exactly what the AI considered and why it chose the primary category.

**Layer 6 — Human Escalation**: A "Talk to a Navigator" button is always visible, linking to 211.org where real human navigators are available 24/7. The 988 crisis line button is fixed on-screen at all times. We believe some conversations need a person, not a prompt.

### Data Flow

```
User types text
  → Input sanitization (strip HTML, scripts, normalize whitespace)
  → Crisis keyword check (deterministic, <5ms)
    → If crisis detected: Return 988/741741/911 immediately. STOP.
  → BART-large-MNLI classification (or keyword-based fallback)
    → Returns: [{ label, score, why, resources }]
  → Confidence gate:
    → score >= 70%: Show resources with confidence ring
    → score 50-70%: Show resources + clarification question
    → score < 50%: Show clarification question + "Talk to Navigator" button
  → Display to user with all metadata (confidence, alternatives, source, verified date)
  → Discard all data (zero retention)
```

---

## 4. Tools, Data, and AI Disclosure

### Technologies Used

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Next.js 16 (App Router) | React framework with server-side API routes |
| Styling | Tailwind CSS 4 | Utility-first CSS framework |
| UI Components | shadcn/ui | Accessible, composable component library |
| Animations | Framer Motion | Smooth, accessible micro-interactions |
| AI Model | BART-large-MNLI (facebook/bart-large-mnli) | Zero-shot text classification via HuggingFace Inference API |
| Hosting | Vercel | Deployment and edge functions |

### AI Disclosure

- **Model**: BART-large-MNLI (406M parameters), a sequence-to-sequence model fine-tuned for natural language inference
- **Provider**: HuggingFace Inference API (free tier)
- **Mode**: Zero-shot classification — no fine-tuning on our data
- **Fallback**: Keyword-based classification when the API is unavailable
- **AI does NOT**: Generate text, create resources, make decisions, or detect crises
- **Crisis detection**: Hardcoded keyword matching (deterministic, no AI involved)
- **AI coding assistant**: Used for code generation and scaffolding (GitHub Copilot / similar)

### Data Sources

- **Community Resources**: 18 verified resources for the Houston metro area, sourced from United Way 211 database
- **Crisis Keywords**: Compiled from SAMHSA guidelines, 988lifeline.org, and crisis intervention best practices
- **No user data collected**: Zero-retention architecture — queries processed in-memory and discarded

### What We Built vs. What We Used

- **Built from scratch**: 6-layer transparency pipeline, confidence gating system, crisis detection layer, chat interface, resource database, clarification flow, all UI/UX
- **Used as-is**: BART-large-MNLI model (via API), Next.js framework, Tailwind CSS, shadcn/ui components, Vercel hosting

---

## 5. Demo Link

https://clearpath-ai-prod.vercel.app/app

---

## 6. Demo Video Script (3 minutes)

**[0:00-0:30] Introduction**
"Hi, I'm [name] and this is ClearPath AI, built for the USAII Global AI Hackathon 2026. ClearPath AI connects people with verified community resources — showing calibrated confidence instead of hiding uncertainty."

**[0:30-1:15] Test A: Normal Classification**
"I'm going to type: 'I can't pay my rent and my kids need food.' Watch what happens."
[Type the query, show the processing animation, then the results]
"As you can see, the system classified this as Housing Assistance at 82% confidence and Food Assistance at 63% confidence. Each category shows real, verified resources from the United Way 211 database — with addresses, eligibility requirements, and application times. No hallucinated services."

**[1:15-2:00] Test B: Crisis Detection**
"Now watch what happens when I type: 'I want to kill myself.'"
[Type the query, show crisis detection bypassing AI]
"The AI never even runs. Our hardcoded crisis layer detects the keyword and immediately shows 988, the Crisis Text Line, and 911. This is deterministic — not AI — and it always takes priority."

**[2:00-2:40] Test C: Low Confidence / Clarification**
"Finally, what if I just type: 'I need help'?"
[Type the query, show the clarification panel]
"The AI isn't confident enough to give resources — so instead of guessing, it asks a clarifying question. This is confidence gating. When the AI doesn't know, it says so. That's what calibrated transparency means."

**[2:40-3:00] Closing**
"ClearPath AI: Classified, not generated. Honest AI for the moments that matter most. Thank you."
