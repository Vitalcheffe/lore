# LORE — Apple-Style Product Launch Video Prompt

## OUTPUT REQUIREMENT
Generate a **minimum 3-minute MP4 video** (1920×1080, 60fps) in the style of an Apple Keynote product reveal. The video must be a cinematic, auto-playing promo for **Lore**, a knowledge management app. Every frame should feel premium — dark backgrounds, smooth motion, emerald accents, dramatic pacing. Think Apple WWDC keynote meets a SaaS launch film.

---

## BRAND IDENTITY

| Element | Value |
|---|---|
| **Name** | LORE |
| **Tagline** | "Your Team's Memory, Alive." |
| **Manifesto** | "Inconsistent memory is misinformation." |
| **Primary color** | Emerald green `#059669` |
| **Accent gradient** | `#10B981 → #059669` |
| **Secondary accents** | Blue `#3B82F6`, Violet `#8B5CF6`, Orange `#F59E0B`, Pink `#EC4899` |
| **Background** | Pure black `#09090B` (90% of video) |
| **Font** | Inter (clean, geometric sans-serif) |
| **Logo** | Brain/knowledge icon — two brain hemispheres (white neural folds) inside an emerald green circle, with small connected dots and lines representing knowledge nodes |

---

## VISUAL DIRECTION — APPLE KEYNOTE STYLE

### Core Principles
1. **One idea per scene** — Never cram. Each scene has ONE message.
2. **Breathe** — 0.5–1s of stillness between animation sequences. Silence = power.
3. **Smooth easing** — All motion uses ease-in-out curves (ease-out-quart: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`). NEVER linear or bouncy.
4. **Scale from center** — Elements grow/shrink from their natural position.
5. **Stagger reveals** — Lists/groups appear one item at a time, 0.08–0.12s apart.
6. **Glass morphism** — Frosted glass cards with `backdrop-filter: blur(20px)`, subtle white borders.
7. **Gradient accents** — Emerald gradients for visual pop on key elements.
8. **Generous whitespace** — Let elements breathe. No clutter.
9. **Ambient motion** — Even "static" scenes have subtle particle drift or glow pulses.
10. **Dark cinematic** — Nearly all scenes on black/dark background. White text. High contrast.

### Motion Language
- **Element enter**: Fade up + slight scale (0.95 → 1.0), duration 0.5–0.7s
- **Text reveal**: Clip-reveal or fade-up word-by-word, not instant
- **Number counters**: Animate from 0 to target over 1.5–2.5s
- **Scene transitions**: Smooth cross-dissolve (0.6–0.8s) or directional wipe
- **Stagger**: Sibling elements delay 0.08–0.12s each
- **Breathing pauses**: 0.8–1.5s of calm between major beats
- **Highlight moment**: Brief scale pulse (1.0 → 1.05 → 1.0) with glow increase

### Anti-Patterns (DO NOT DO)
- NO jarring hard cuts between scenes
- NO text-heavy slides (max: headline + one subline)
- NO small fonts (min 24px body, 48px+ headlines)
- NO static scenes without ambient motion
- NO emoji in the video
- NO generic stock footage
- NO rushed openings — the first 10 seconds set the tone
- NO abrupt endings — always a powerful closing with CTA
- NO chaotic simultaneous animations — sequence everything
- NO clip-art or cheap icons — use clean geometric/CSS-style visuals

---

## SCENE-BY-SCENE BREAKDOWN

### SCENE 1: COLD OPEN (0:00 – 0:14)
**Mood**: Cinematic, mysterious, dramatic

1. Pure black screen. Hold 1.5s.
2. A single emerald dot appears in the center, pulsing gently (glow expanding/contracting).
3. The dot expands — splitting into 5–8 smaller dots that spread outward, connected by thin emerald lines. A mini network forms.
4. More dots appear, more connections form — the network grows organically, like neurons firing.
5. The network fades to the background as text reveals, one word at a time (each word fading up with 0.15s delay):
   - "Inconsistent"
   - "memory"
   - "is"
   - "misinformation."
6. Hold 1s on the manifesto.
7. Below, fades in: **"Lore — Your Team's Memory, Alive."** in emerald green.
8. Cross-dissolve to Scene 2.

---

### SCENE 2: THE PROBLEM (0:14 – 0:32)
**Mood**: Chaotic, fragmented, disorienting

1. Dark screen. Scattered knowledge fragments float in — glass-morphism cards labeled: "Notes", "Docs", "Chats", "Meetings", "Emails", "Wiki", "Slack", "Tasks". Each has a colored icon.
2. The fragments drift slowly in random directions. No connections between them. They feel isolated.
3. As more fragments appear, they start overlapping, slightly rotating, creating visual chaos.
4. Big headline fades up center: **"Your team's knowledge is scattered across 12+ tools"** — "12+ tools" in emerald.
5. The fragments start glitching — brief opacity flickers, slight position jumps — visualizing broken knowledge.
6. Everything freezes simultaneously. Then slowly fades to black.
7. Cross-dissolve to Scene 3.

---

### SCENE 3: THE COST (0:32 – 0:52)
**Mood**: Heavy, impactful, urgent

1. Dark screen with subtle particles drifting upward and dissolving (representing lost knowledge).
2. First stat slides up from below, center of screen:
   - Giant number counter animates **0 → 47** (takes 2s)
   - Below: "minutes" in smaller text
   - Below: "wasted daily searching for information" in muted text
3. Hold 0.8s. First stat fades down.
4. Second stat slides up:
   - Counter animates **0 → 73%** (takes 2s)
   - Below: "of knowledge lost when people leave"
5. Hold 0.8s. Second stat fades down.
6. Third stat slides up:
   - Counter animates **$0 → $5.2M** (takes 2.5s)
   - Below: "annual cost of knowledge fragmentation"
7. Hold 1s. All three stats briefly reappear simultaneously (smaller, in a row) then fade together.
8. Cross-dissolve to Scene 4.

---

### SCENE 4: INTRODUCING LORE (0:52 – 1:10)
**Mood**: Revelation, elegant, confident

1. A horizontal emerald light sweep crosses the screen left to right (subtle glow, 0.8s).
2. Behind the sweep, a dot-grid pattern materializes in very low-opacity emerald.
3. Center screen: The Lore logo draws itself — the emerald circle fades in, then the brain hemispheres draw as SVG paths (stroke-dashoffset animation), then the knowledge node dots appear and connecting lines draw between them.
4. Below the logo: **"LORE"** text reveals with a light-sweep effect (a bright highlight passes across the text from left to right).
5. Hold 0.5s.
6. Subtitle types out character by character: **"Your Team's Memory, Alive."**
7. The logo pulses once (scale 1.0 → 1.08 → 1.0 with emerald glow increase).
8. Hold 1s. Cross-dissolve to Scene 5.

---

### SCENE 5: KNOWLEDGE GRAPH (1:10 – 1:32)
**Mood**: Connected, alive, intelligent

1. Dark screen. A single emerald node (circle) appears center-left with a subtle ripple effect.
2. A second node appears — a line draws between them.
3. More nodes appear one by one (0.2s apart), each with a different color:
   - Concept = emerald green
   - Person = blue
   - Project = violet
   - Resource = orange
   - Idea = pink
4. Lines connect them, forming an organic knowledge graph that grows to fill ~60% of the screen.
5. Headline fades up top-center: **"Your knowledge, connected."** — "connected" in emerald.
6. Subtext fades in below: "See relationships you never knew existed."
7. The graph continues to gently pulse — nodes glow subtly, edges shimmer — it looks ALIVE.
8. A user cursor (small white dot) moves across the graph, hovering a node, and a preview card pops up briefly.
9. Hold 1s. Cross-dissolve to Scene 6.

---

### SCENE 6: MORNING DIGEST (1:32 – 1:50)
**Mood**: Warm, clear, optimistic

1. A warm amber glow rises from the bottom of the screen (sunrise gradient, very subtle).
2. Headline: **"Start every day with clarity."** — "clarity" in emerald.
3. A dark glass card slides up from below center, containing:
   - Header: "Morning Digest — Today" in emerald, uppercase, small
   - Three horizontal bars (content placeholders) that fill from left to right with emerald gradient (0% → varying widths over 1.5s)
   - Two insight cards that slide in from the right (0.15s stagger):
     - "Key Insight: API redesign discussion reached consensus" (emerald border)
     - "Action Needed: Review Sarah's architecture proposal" (blue border)
   - A "Productive" mood badge pulses gently in the corner
4. Subtext: "AI-powered morning digest, tailored to you."
5. Hold 1s. Cross-dissolve to Scene 7.

---

### SCENE 7: AI CHAT (1:50 – 2:12)
**Mood**: Smart, responsive, conversational

1. Headline: **"Ask anything. Lore knows."** — "Lore knows" in emerald.
2. A chat interface appears (dark glass panel, center screen):
3. User message bubble slides in from the right: "What's our current API rate limiting strategy?" — emerald green bubble, white text.
4. AI response bubble appears (dark surface bubble), and text streams in WORD BY WORD (0.04s per word) with a blinking emerald cursor:
   "Based on your knowledge base, your current strategy uses a token bucket algorithm with a sliding window fallback. The limit is set at 100 requests/minute for standard endpoints..."
5. After streaming completes, two source badges pop in with a pulse: "API Docs" and "Backend Architecture" — small pills with emerald/blue borders.
6. A thumbs-up icon appears briefly in the bottom-right of the AI bubble.
7. Subtext: "Your knowledge base, conversational."
8. Hold 1s. Cross-dissolve to Scene 8.

---

### SCENE 8: MEMORY & NOTES (2:12 – 2:28)
**Mood**: Organized, colorful, comprehensive

1. Headline: **"Capture everything. Forget nothing."** — "Forget nothing" in emerald.
2. Subtext: "6 note types, smart categorization, instant search."
3. A 3×2 grid of note cards appears, each card doing a **3D flip** to reveal itself (staggered 0.1s apart):
   - **Note** (emerald border): "API Rate Limiting" — "Current strategy uses token bucket..." — tag: backend
   - **Bookmark** (blue border): "REST Best Practices" — "Microsoft API design guide..." — tag: reference
   - **Insight** (violet border): "Token Bucket vs Leaky" — "Token bucket allows bursts..." — tag: architecture
   - **Snippet** (orange border): "Rate Limiter Middleware" — "const limiter = rateLimit({...});" — tag: code
   - **Meeting** (pink border): "Backend Sync — Feb 28" — "Decided on sliding window..." — tag: team
   - **Idea** (emerald-light border): "Adaptive Rate Limits" — "Adjust limits based on load..." — tag: exploration
4. Tags float up slightly from each card.
5. A search bar at the top briefly shows a typing animation, and cards filter/highlight.
6. Hold 1s. Cross-dissolve to Scene 9.

---

### SCENE 9: KNOWLEDGE HEALTH (2:28 – 2:44)
**Mood**: Data-driven, measurable, satisfying

1. Headline: **"Measure what matters."** — "what matters" in emerald.
2. A circular gauge appears center-left — an emerald arc that draws from 0° to ~313° (87%), with the number **0 → 87** counting up inside (2s animation). The arc has a gradient from emerald-500 to emerald-400.
3. To the right, four progress bars fill up simultaneously (staggered 0.15s):
   - **Nodes**: 0% → 82% (emerald fill)
   - **Connections**: 0% → 68% (blue fill)
   - **Diversity**: 0% → 75% (violet fill)
   - **Activity**: 0% → 91% (orange fill)
4. Below, stats count up: "247 Nodes | 182 Connections | 12 Day Streak | 89 AI Queries"
5. Subtext: "Knowledge Health Score — your team's memory, quantified."
6. Hold 1s. Cross-dissolve to Scene 10.

---

### SCENE 10: COMPETITIVE ADVANTAGE (2:44 – 3:04)
**Mood**: Bold, undeniable, superior

1. Headline: **"Not just another note app."** — "note app" in emerald.
2. A comparison table slides in from below. Four columns: Feature | Lore | Notion | Obsidian
3. The header row appears first. "Lore" column header in emerald, others in muted white.
4. Feature rows stagger in one by one (0.2s apart):
   - Knowledge Graph: ✓ (emerald) | ✗ (muted) | ✗ (muted)
   - AI Morning Digest: ✓ | ✗ | ✗
   - Connected AI Chat: ✓ | △ (orange, partial) | ✗
   - Health Score: ✓ | ✗ | ✗
   - Auto-classification: ✓ | △ | ✗
5. As each checkmark appears for Lore, it pulses once with emerald glow.
6. The Lore column gets a subtle emerald background highlight.
7. Hold 1s. Cross-dissolve to Scene 11.

---

### SCENE 11: TEAM COLLABORATION (3:04 – 3:18)
**Mood**: Collaborative, alive, multiplying

1. A knowledge graph appears (similar to Scene 5 but larger).
2. Three different colored cursors appear simultaneously — representing different team members — moving across the graph.
3. Each cursor lands on different spots, and new nodes appear where they click (emerald for one, blue for another, violet for the third).
4. Connection lines form between nodes created by different team members — visualizing cross-team knowledge sharing.
5. Headline: **"Built for teams."** — "teams" in emerald.
6. Subtext: "Shared memory that stays consistent, always."
7. The graph pulses with energy — more alive than ever.
8. Hold 1s. Cross-dissolve to Scene 12.

---

### SCENE 12: SECURITY & ARCHITECTURE (3:18 – 3:32)
**Mood**: Secure, enterprise, trustworthy

1. Center screen: A stylized globe appears (wireframe circles at different angles, emerald, low opacity).
2. A shield icon draws itself in the center (SVG path animation, emerald stroke, then fills with subtle emerald tint).
3. A checkmark draws inside the shield.
4. Small data-channel lines animate flowing around the globe (representing multi-region replication).
5. Headline: **"Enterprise-grade. Zero data drift."** — "Zero data drift" in emerald.
6. Subtext: "Multi-region architecture. Your knowledge, always consistent."
7. Below: "Powered by Aurora DSQL" in small emerald text, with a subtle glow.
8. Hold 1s. Cross-dissolve to Scene 13.

---

### SCENE 13: SOCIAL PROOF (3:32 – 3:48)
**Mood**: Trust, credibility, validation

1. Three testimonial cards slide in alternately (left, right, left — 0.3s stagger):
   - **Sarah Kim, CTO at Meridian Labs** (emerald avatar): ★★★★★ — "Lore turned our scattered Notion docs into a living knowledge base. Our onboarding time dropped from 3 weeks to 3 days."
   - **Marcus Rivera, VP Engineering at Cascade** (blue avatar): ★★★★★ — "The knowledge graph is a game-changer. I discovered connections between projects I never would have found manually."
   - **Aisha Laurent, Engineering Lead at Prism** (violet avatar): ★★★★★ — "Morning Digest alone saves me 30 minutes every day. It's like having a research assistant who knows everything."
2. Star ratings animate in (each star pops sequentially, 0.08s apart).
3. Below the testimonials: A row of company logos fades in: MERIDIAN | CASCADE | PRISM | VERTEX | HELIX
4. Hold 1s. Cross-dissolve to Scene 14.

---

### SCENE 14: PRICING (3:48 – 4:06)
**Mood**: Simple, transparent, confident

1. Headline: **"Simple, transparent pricing."** — "pricing" in emerald.
2. Three pricing cards rise up from below (staggered 0.15s):
   - **Free** — $0 forever — Up to 100 nodes, Basic graph, 5 notes/day, Community support — "Get Started" (secondary button)
   - **Pro** (FEATURED — emerald border glow, "Most Popular" badge on top) — $12/user/month — Unlimited nodes, AI Digest, AI Chat, Health Score, Priority support — "Start Free Trial" (emerald gradient button)
   - **Enterprise** — Custom — Everything in Pro, SSO & SAML, Aurora DSQL, Dedicated support, Custom integrations — "Contact Sales" (secondary button)
3. Feature list items stagger in per card (0.04s per item).
4. The Pro card's CTA button pulses with emerald glow.
5. Hold 1.5s. Cross-dissolve to Scene 15.

---

### SCENE 15: THE CLOSE (4:06 – 4:30)
**Mood**: Powerful, decisive, inspiring

1. The full knowledge graph fades in as a background — dozens of nodes pulsing gently, connections shimmering. It feels ALIVE and MASSIVE.
2. The Lore logo fades in center (small, elegant).
3. First line fades up: **"Stop losing knowledge."** — white, large.
4. Hold 1.2s of silence.
5. Second line fades up below: **"Start building Lore."** — EMERALD, large. More impactful than the first.
6. Hold 0.5s.
7. A large CTA button fades in: **"Get started free →"** — emerald gradient, white text, subtle shadow.
8. Below: **"lore.app"** in muted text.
9. The CTA button pulses once with emerald glow.
10. The logo pulses once (scale 1.0 → 1.1 → 1.0).
11. Hold 2s.
12. Slow fade to black over 1.5s.

---

## TECHNICAL SPECIFICATIONS

| Spec | Value |
|---|---|
| **Resolution** | 1920×1080 (Full HD) |
| **Frame rate** | 60fps |
| **Duration** | Minimum 3 minutes (target: 4 min 30 sec) |
| **Format** | MP4 (H.264, high quality) |
| **Background** | `#09090B` (near-black) for 90% of scenes |
| **Primary font** | Inter (weights: 300–900) |
| **Primary color** | Emerald `#059669` |
| **Accent gradient** | `#10B981 → #059669` |
| **Text color** | White `#FAFAFA` on dark, with `#A1A1AA` for secondary |
| **All animations** | Smooth easing (ease-out-quart or ease-in-out) |
| **Transitions** | Cross-dissolve 0.6–0.8s between scenes |

## COLOR PALETTE REFERENCE

| Color | Hex | Usage |
|---|---|---|
| Emerald-700 | `#047857` | Deep accents |
| Emerald-600 | `#059669` | Primary, buttons, highlights |
| Emerald-500 | `#10B981` | Gradients, accents |
| Emerald-400 | `#34D399` | Light accents, text highlights |
| Emerald-300 | `#6EE7B7` | Glow effects |
| Blue-500 | `#3B82F6` | Person nodes, tech features |
| Violet-500 | `#8B5CF6` | Project nodes, AI features |
| Orange-500 | `#F59E0B` | Resource nodes, warnings, stars |
| Pink-500 | `#EC4899` | Idea nodes, meeting features |
| Dark BG | `#09090B` | Main background |
| Surface | `#0F0F12` | Card backgrounds |
| Surface-2 | `#18181B` | Secondary surfaces |
| White | `#FAFAFA` | Primary text |
| Muted | `#A1A1AA` | Secondary text |
| Dim | `#71717A` | Tertiary text |

## APP SCREEN REFERENCE (for UI mockup scenes)

When showing the app UI (Scenes 5–9), use these design patterns:

- **Sidebar**: Dark `#0F0F12`, 260px wide, with Lore logo top, nav items with emerald active states
- **Main content**: `#09090B` background, cards on `#0F0F12` with `rgba(255,255,255,0.06)` borders
- **Cards**: Rounded corners (16px), subtle borders, hover shadow elevation
- **Chat bubbles**: User = emerald gradient (rounded 16px 16px 4px 16px), AI = dark surface (rounded 16px 16px 16px 4px)
- **Note cards**: Colored left border (3px) per type, type badge uppercase
- **Progress bars**: Rounded (3px), emerald/blue/violet/orange fills on dark track
- **Buttons**: Primary = emerald gradient with shadow, Secondary = dark surface + border
