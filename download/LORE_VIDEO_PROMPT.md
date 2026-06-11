# LORE — PRODUIT LAUNCH VIDEO MASTER BRIEF
## "Make it look like a trillion-dollar company made this."

---

## 🎬 WHAT THIS IS

You are producing a **cinematic product launch film** for **Lore**, a next-generation knowledge management platform. This is NOT a slide presentation. This is NOT a screen recording. This is a **film** — the kind of film Apple plays at WWDC, the kind Tesla plays at launch events, the kind that makes the audience go silent and then erupt.

**Duration**: Minimum 3 minutes. Target: 4 minutes.
**Format**: MP4, 1920×1080, 60fps, H.264 high bitrate.
**Feel**: If Apple and Netflix had a baby, and that baby grew up to make product films.

---

## 🧠 PSYCHOLOGY OF A PERFECT PRODUCT FILM

Before you animate a single pixel, understand these laws:

### LAW 1: THE 3-SECOND HOOK
The first 3 seconds decide if someone keeps watching. You must create a moment so visually arresting that it's physically uncomfortable to look away. Not loud. Not chaotic. **Arresting.** A single point of light in absolute darkness. A shape forming from nothing. A breath before the storm.

### LAW 2: THE RHYTHM OF REVELATION
A great product film is music. It has:
- **Verses** (problem, context, buildup) — slower, atmospheric, tension-building
- **Chorus** (the product, the features, the wow) — faster, brighter, energy release
- **Bridge** (comparison, social proof) — shift in tone, unexpected angle
- **Coda** (closing CTA) — everything resolves, emotional peak

The pace should NEVER be flat. It breathes. It accelerates. It pulls back. It drops.

### LAW 3: SHOW, DON'T TELL
Every single claim must be **visible**. Don't write "AI-powered" — show the AI thinking. Don't write "connected" — show connections forming in real-time. Don't write "fast" — make the video itself feel fast. The medium IS the message.

### LAW 4: THE IMPOSSIBILITY MOMENT
Every great product film has at least one moment where the viewer thinks "How did they do that?" or "That's not possible." This is the moment they share. This is the moment they remember. Build toward it. Earn it. Deliver it.

### LAW 5: MAGICAL BUT CREDIBLE
The magic must serve the product, not distract from it. Every stunning visual must communicate a real feature, a real benefit, a real reason to believe. Pretty without purpose is decoration. Pretty with purpose is **design**.

---

## 🎨 VISUAL IDENTITY SYSTEM

### The Lore Look
- **Background**: Deep space black `#09090B` — not just dark, but **infinite**. Add ultra-subtle noise texture (2% opacity film grain) to prevent banding and add organic depth.
- **Primary**: Emerald `#059669` — but never flat. Always with a gradient (`#10B981 → #059669`), always with a glow, always alive.
- **Accent palette**: Blue `#3B82F6`, Violet `#8B5CF6`, Orange `#F59E0B`, Pink `#EC4899` — used ONLY for data types and feature categories, never randomly.
- **Typography**: Inter. Weights 300–900. Headlines at 800–900 weight with `-0.03em` tracking. Body at 400–500.
- **Surfaces**: Glass morphism — `backdrop-filter: blur(24px)`, borders at `rgba(255,255,255,0.06)`, subtle inner glow. NOT flat cards. NOT solid rectangles. **Glass. Depth. Dimension.**

### Light & Shadow Rules
1. **Every element has a light source** — top-left, slightly warm. This creates consistent shadows and highlights.
2. **Emerald elements emit light** — they GLOW. Not just color, but actual luminous bloom. When an emerald button appears, the surrounding darkness should subtly brighten.
3. **Depth of field exists** — foreground elements are sharp, background elements have subtle blur. This creates REALISM.
4. **Reflections** — key UI elements should have a faint reflection below them (8px offset, 30% opacity, slight blur). This sells the "floating in space" look.
5. **Ambient occlusion** — where elements meet surfaces, there's a subtle dark gradient. This grounds objects in space.

### Motion Physics
- **Default easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) — starts fast, decelerates smoothly. This is Apple's signature easing.
- **Enter animations**: `scale(0.92) → scale(1.0)` + `opacity 0 → 1` + `translateY(20px) → 0`. Duration: 0.6s.
- **Exit animations**: Reverse of enter, but 30% faster. Duration: 0.4s.
- **Stagger**: 0.07s between siblings. Not 0.1s (too slow), not 0.04s (too uniform). 0.07s creates organic rhythm.
- **Spring physics**: For "settling" animations (card drops, button presses), use spring: `stiffness: 300, damping: 25`. The element should slightly overshoot and settle.
- **Continuous ambient**: Every "static" frame must have at least 2 ambient animations: subtle particle drift, gentle glow pulse, slow parallax shift, or breathing scale.

### Camera & Composition
- **Rule of thirds** — key elements land on third lines, not dead center (unless it's a deliberate "hero" moment).
- **Parallax layers** — background moves at 0.3x speed, midground at 0.6x, foreground at 1.0x. This creates REAL depth in a 2D medium.
- **Zoom transitions** — instead of cross-dissolves between some scenes, zoom INTO an element (a node, a pixel, a card) and emerge into the next scene. This creates a sense of infinite depth.
- **Rack focus** — occasionally shift focus from foreground to background, revealing new information. This is cinematic.
- **Dutch angles** — NEVER. This isn't a music video.
- **Aspect ratio tricks** — occasionally pillarbox (black bars top/bottom) for dramatic emphasis, then expand back to full frame for energy release.

---

## 🔥 POST-PRODUCTION EFFECTS (CRITICAL)

These are what separate "good" from "how is this possible":

### Bloom / Glow
- Every emerald element gets a bloom effect: a soft, bright glow that extends 15–30px beyond the element's edge.
- The glow should pulse subtly (opacity 0.3 → 0.6 → 0.3) over 3–4 second cycles.
- When a NEW emerald element appears, the bloom should flash bright (opacity 1.0) then settle to 0.4 over 0.8s.

### Light Rays / God Rays
- When the Lore logo appears (Scene 4), subtle emerald light rays should emanate from behind it (4–6 rays, 30% opacity, rotating slowly).
- Use for dramatic reveals: when "LORE" text appears, light rays push outward.

### Particle Systems
- **Knowledge particles**: Tiny (1–3px) emerald dots that drift upward slowly, like embers. Present in ALL scenes at very low opacity (10–15%). This creates an atmosphere of "living knowledge."
- **Connection particles**: When two graph nodes connect, 3–5 particles travel along the edge from source to target over 0.8s. This makes connections feel ACTIVE, not static.
- **Dissolve particles**: When elements disappear (Scene 2 → 3 transition), they should break into 20–30 tiny particles that drift and fade over 1.2s. Not just "fade out." **Dissolve.**

### Chromatic Aberration (SUBTLE)
- On fast-moving transitions, add 1–2px of chromatic aberration (RGB channel offset). This sells speed and impact.
- MUST be subtle. If it's noticeable, it's too much. It should be felt, not seen.

### Film Grain
- Add ultra-subtle animated noise overlay at 2–3% opacity across the ENTIRE video. This:
  - Prevents color banding on dark gradients
  - Adds organic texture
  - Makes it feel like FILM, not screen recording

### Lens Flare
- ONE subtle lens flare when the Lore logo first appears (Scene 4). Anamorphic horizontal streak, emerald tint, 0.6s duration. Earned, not gratuitous.

### Volumetric Light
- When the Morning Digest card appears (Scene 6), a warm amber volumetric light cone should shine down from above-left, as if morning sunlight is hitting the card. The card's surface should show the light gradient.

### Screen Capture Realism
- When showing app UI (Scenes 5–9), the UI should look like a REAL app running in a browser — not a mockup, not a wireframe. Include:
  - Realistic browser chrome (subtle, dark theme)
  - Actual cursor movement (smooth bezier path, NOT linear)
  - Scroll behavior with momentum
  - Real hover states that activate as the cursor passes
  - Keyboard shortcuts briefly highlighted

---

## 📐 SCENE-BY-SCENE — DETAILED BLUEPRINT

---

### SCENE 1: THE VOID (0:00 – 0:16)
**Energy**: Zero → One. The birth of something.

**Frame 0.0s**: Pure black. Not dark gray. BLACK. Hold 2 full seconds. The viewer should feel the emptiness. Subtle film grain is the only visual — creating anticipation.

**Frame 2.0s**: A single emerald point of light appears. Not a circle. A **point** — 2px, center screen. It pulses once (opacity 0.3 → 1.0 → 0.6 over 1s), and with each pulse, a tiny **ripple ring** expands outward and fades (like a stone dropped in water, but made of light).

**Frame 3.5s**: The point splits into two. A hairline emerald connection draws between them — not instantly, but TRAVELS from the first to the second over 0.4s, like a spark along a wire. When it reaches the second point, that point pulses.

**Frame 4.5s**: Both points split again. More connections. The network grows organically — each new node appears with a micro-ripple, each new connection travels as a spark. This should feel like watching neural pathways form in a brain. Bioelectric. Alive.

**Frame 7.0s**: The network has grown to ~25 nodes. It's beautiful — different node colors emerging (emerald, blue, violet, orange, pink). Connections cross and weave. The network is now large enough to be impressive but small enough to see individual connections.

**Frame 8.0s**: The camera SLOWLY pushes in (zoom 1.0x → 1.3x over 3s) as the network continues to grow. Parallax: background particles move slower than the main network. The zoom creates a sense of falling INTO the knowledge.

**Frame 9.5s**: As we push in, the network fragments begin to drift apart slightly — the connections stretch and strain. Subtle glitch effects: brief 1px position offsets on nodes, momentary opacity dips on connections. Something is wrong.

**Frame 11.0s**: The network SHATTERS. Not all at once — one connection snaps, then another, then a cascade. Nodes drift apart into the darkness, connections dissolving into particles. Each snap has a micro-flash of light. The destruction is beautiful and sad.

**Frame 12.5s**: We're back to near-darkness. A few orphaned nodes drift alone. Silence.

**Frame 13.0s**: Text begins to appear. Not all at once — word by word, each word materializing from emerald particles that swirl and condense:
  - **"Inconsistent"** — forms from particles, 0.5s
  - **"memory"** — forms, 0.5s
  - **"is"** — forms, 0.3s
  - **"misinformation."** — forms, 0.5s, and the period lands with a subtle camera shake (2px, 0.1s)

**Frame 15.0s**: Below, in emerald: **"Lore — Your Team's Memory, Alive."** fades up over 0.8s. The emerald text has a soft glow that brightens the darkness around it.

**Frame 16.0s**: Cross-dissolve to Scene 2 over 0.8s. The manifesto text should be the LAST thing to fade — it lingers.

---

### SCENE 2: THE CHAOS (0:16 – 0:36)
**Energy**: Tension, disorder, frustration.

**Frame 0.0s**: The screen is dark but NOT empty — scattered across the viewport are glass-morphism fragments, each a small card with an icon and label:
- "Notes" (emerald icon) — top-left area
- "Google Docs" (blue icon) — center-top
- "Slack" (purple icon) — top-right
- "Confluence" (blue icon) — center-left
- "Notion" (black/white icon) — center
- "Jira" (blue icon) — center-right
- "Email" (red icon) — bottom-left
- "Figma" (purple icon) — bottom-center
- "Meetings" (orange icon) — bottom-right
- "Trello" (blue icon) — far right
- "Wiki" (gray icon) — far left
- "Spreadsheets" (green icon) — mid-area

Each fragment floats gently (sinusoidal drift, different phases). They're beautiful individually but CHAOTIC together. No connections. No order. Just... stuff.

**Frame 3.0s**: The fragments begin to move faster. Their drift becomes more erratic. Some rotate slightly. Overlapping increases.

**Frame 5.0s**: A large headline materializes center-screen, pushing fragments aside: **"Your team's knowledge is scattered across 12+ tools"** — the number "12+" in emerald with a glow. The text has weight — it pushes the fragments away physically.

**Frame 7.0s**: The fragments start GLITCHING:
  - Random 2px position jumps (every 0.3s)
  - Brief opacity dips to 0.3
  - Text labels briefly corrupt into other tool names ("Notes" → "Nøtßs" → "Notes")
  - Connection attempt lines briefly flash between fragments but fail (draw 20% then snap)

**Frame 9.0s**: The headline changes — the old text dissolves downward and new text rises up: **"None of them talk to each other."** This hits harder because we just SAW the connection attempts fail.

**Frame 11.0s**: Everything FREEZES. Then slowly — over 2s — all fragments shrink and dim simultaneously, as if being sucked into a single point. They converge toward center-screen.

**Frame 13.0s**: Just before they all meet at center, they DISSOLVE into particles (each card explodes into 15–20 tiny embers that drift upward and fade). The screen goes dark.

**Frame 14.0s**: A single beat of silence. Then cross-dissolve to Scene 3.

---

### SCENE 3: THE COST (0:36 – 0:58)
**Energy**: Heavy, then rising urgency.

**Frame 0.0s**: Dark screen. Subtle particles drifting upward — these are the "dissolved fragments" from the previous scene, now representing lost knowledge. They drift slowly, sadly, fading before they reach the top of the screen.

**Frame 1.5s**: From the bottom of the screen, a large number begins to rise. It starts at 0 and counts up: **0 → 47** over 2 seconds. The number is ENORMOUS — filling ~40% of the screen height. It's rendered in emerald gradient with bloom glow. As it counts, each digit change creates a subtle screen pulse.

**Frame 3.5s**: The number settles at **47**. Below it, smaller text fades in: **"minutes wasted daily searching for information"** in `#A1A1AA`. The word "wasted" briefly flashes emerald.

**Frame 5.5s**: The "47" and its label slowly drift upward and shrink to 60% size, moving to the left third of the screen. As it moves, a new number begins counting up center-screen: **0 → 73%** over 2s. Same emerald treatment.

**Frame 7.5s**: Below **73%**: **"of institutional knowledge walks out the door when people leave"** — the word "walks" gets a subtle red flash.

**Frame 9.5s**: The "73%" drifts right and shrinks. The "47" is still visible on the left. Center-screen, the final number counts up: **$0 → $5.2M** over 2.5s. The dollar sign appears first, then the numbers roll. The "M" lands last with a subtle camera shake.

**Frame 12.0s**: Below **$5.2M**: **"annual cost of knowledge fragmentation per 200-person team"**

**Frame 13.5s**: All three stats are now on screen simultaneously, arranged horizontally (left / center / right). They pulse once together — a shared heartbeat — then all three begin to slowly CRACK. Literal fracture lines appear across the numbers (like breaking glass), and through the cracks, emerald light glows from behind.

**Frame 15.0s**: The cracked stats SHATTER (glass-shard particle explosion, 40–50 shards per number, each reflecting emerald light). The shards tumble and fade. Black screen.

**Frame 16.0s**: Cross-dissolve to Scene 4.

---

### SCENE 4: THE REVEAL (0:58 – 1:18)
**Energy**: Revelation. Birth. The "one more thing" moment.

**Frame 0.0s**: Black screen. Then — from the left edge — a HORIZONTAL STREAK of emerald light SWEEPS across the entire screen (0.6s). It's not just a line — it's a band of light ~100px tall, with a bright core and soft falloff, like a scanner passing over the darkness. As it passes, it leaves behind:

**Frame 0.6s**: A subtle dot-grid pattern across the entire screen. The dots are emerald, 1px each, spaced 40px apart, at 8% opacity. They were REVEALED by the light, not created by it. They were always there. The light just showed them.

**Frame 1.5s**: The grid pulses once — all dots brighten to 20% opacity for 0.3s then return to 8%. This establishes the grid as "alive."

**Frame 2.0s**: Center screen. The Lore logo begins to form:

  **Step 1 (0.5s)**: The emerald circle fades in — but from the center outward, like a ripple becoming solid. It has a subtle inner gradient (lighter at top-left, darker at bottom-right) to suggest 3D curvature.

  **Step 2 (1.0s)**: The brain hemisphere paths DRAW themselves — SVG stroke-dashoffset animation. The left hemisphere draws first (0.5s), then the right (0.5s). Each stroke has a bright "leading edge" — a brighter point of light at the tip of the drawing path.

  **Step 3 (0.4s)**: The knowledge node dots pop in with spring physics (overshoot to 1.15x scale, settle to 1.0x). Staggered 0.07s apart. Each pop emits a tiny ripple.

  **Step 4 (0.3s)**: The connecting lines between nodes draw themselves (stroke-dashoffset). Each line has a spark that travels along it when complete.

**Frame 4.2s**: The complete logo is on screen. It pulses once — scale 1.0 → 1.06 → 1.0, glow brightens → dims — like a heartbeat. A subtle LENS FLARE streaks horizontally across the logo (anamorphic, emerald tint, 0.6s). This is the ONE lens flare in the entire video. Use it wisely.

**Frame 5.0s**: Below the logo, the word **"LORE"** appears. Not a simple fade — a REVEAL. A bright emerald line sweeps across the text from left to right (like the earlier horizontal sweep), and as it passes, the letters are REVEALED behind it. The text is huge (80px+), weight 900, tracking -0.05em, white.

**Frame 6.5s**: The "LORE" text has a moment to breathe. Its presence is commanding.

**Frame 7.0s**: Below, the subtitle types out character by character: **"Your Team's Memory, Alive."** Each character appears with a 0.03s delay. A tiny emerald cursor blinks at the end. When complete, the cursor blinks twice more then fades. The text is in emerald-400 `#34D399`.

**Frame 9.0s**: The logo pulses again. The grid behind subtly brightens. Everything feels alive.

**Frame 10.0s**: A beat of stillness. Then the camera begins to PUSH IN toward the logo (zoom 1.0x → 2.5x over 1.5s). As we zoom INTO the logo, we pass through it and emerge into Scene 5. This is a ZOOM TRANSITION — we're diving INTO the knowledge.

---

### SCENE 5: THE KNOWLEDGE GRAPH (1:18 – 1:44)
**Energy**: Alive, expanding, wondrous.

**Frame 0.0s**: We emerge from the zoom transition into a vast dark space. A single emerald node sits center-screen. It pulses gently — glow expanding and contracting over 3s cycles.

**Frame 1.0s**: A second node appears (blue — "person" type) with spring physics. A connection line DRAWS between them (0.3s), and when it completes, 3 tiny particles TRAVEL along the edge from the first node to the second (0.6s). The particles glow and leave brief light trails.

**Frame 2.0s**: More nodes appear — each with a ripple + spring entrance:
  - Violet node ("project") — connects to the emerald node
  - Orange node ("resource") — connects to the blue node
  - Pink node ("idea") — connects to the violet node
  
  Each connection has traveling particles. The graph is GROWING.

**Frame 3.5s**: The graph accelerates its growth — nodes appear 2–3 at a time, connections form rapidly. The camera slowly PULLS BACK (zoom out) to accommodate the expanding graph. Parallax: the node labels move at 1.0x, the connections at 0.8x, and background particles at 0.3x.

**Frame 6.0s**: The graph has ~30 nodes, ~40 connections. It fills ~60% of the screen. It's beautiful — organic, colorful, interconnected.

**Frame 7.0s**: A cursor appears — a small white dot with a subtle emerald trail. It moves SMOOTHLY (bezier curve, NOT linear) across the graph. As it approaches nodes, they slightly grow (1.0 → 1.1x) and brighten. The cursor has AWARENESS — it's not random, it moves with purpose.

**Frame 8.5s**: The cursor hovers over a violet "project" node. A PREVIEW CARD pops out:
  - Glass morphism background
  - Node title: "API Redesign v2"
  - Type badge: "Project" in violet
  - Content preview: "Migrating from REST to GraphQL..."
  - Tags: "backend", "architecture"
  - Created: "2 days ago"
  The card slides out from the node with spring physics, slightly overshooting and settling.

**Frame 10.0s**: The cursor moves on. The preview card closes. The graph continues to pulse gently.

**Frame 11.5s**: Headline fades in TOP-CENTER: **"Your knowledge, connected."** — "connected" in emerald. The text should NOT cover the graph — position it in the top 15% of the screen.

**Frame 12.5s**: Subtext: "See relationships you never knew existed." in muted text below the headline.

**Frame 14.0s**: One more beat of the graph being alive — a new node appears, connections form, particles travel. Then: zoom INTO a specific node (pick any node, zoom 1.0x → 8x over 1.5s). As we pass through the node, we emerge into Scene 6. Another zoom transition — we're diving deeper.

---

### SCENE 6: MORNING DIGEST (1:44 – 2:04)
**Energy**: Warm, clarifying, like sunrise after a long night.

**Frame 0.0s**: We emerge from the zoom into a dark scene. Then — from the bottom of the screen — a WARM AMBER GLOW rises. It's not a solid color — it's a volumetric light cone, as if morning sunlight is streaming through an invisible window above-left. The light hits an invisible surface and creates a realistic light gradient. Dust particles float in the light beam (tiny warm dots drifting slowly).

**Frame 2.0s**: Headline: **"Start every day with clarity."** — "clarity" in emerald. The text appears in the lit area, as if the light is revealing it.

**Frame 3.5s**: A Digest card materializes center-screen — rising from below with spring physics (translateY 80px → -5px → 0px). It's a glass-dark card with:
  - **Header**: "MORNING DIGEST — TODAY" in emerald-400, uppercase, small (12px), letter-spacing 0.08em
  - **Mood badge**: A small pill reading "Productive" with an emerald dot, pulsing gently
  - **Summary section**: Three horizontal lines representing AI-generated text — they FILL from left to right with an emerald gradient over 1.5s, at different widths (100%, 85%, 60%). This mimics text being written.
  - **Divider**: Thin line at `rgba(255,255,255,0.06)`

**Frame 5.5s**: Two insight cards slide in from the right (0.12s stagger):
  1. **"Key Insight"** (emerald border, emerald label): "API redesign discussion reached consensus — 3 new decisions documented"
  2. **"Action Needed"** (blue border, blue label): "Review Sarah's architecture proposal before Friday's sync"
  
  Each card has a subtle left-border accent (3px, colored), glass background, and enters with `translateX(30px) → 0` + spring.

**Frame 7.5s**: A "Focus Areas" section appears below the insights — three progress bars filling up simultaneously:
  - "Backend Architecture" — 78% (emerald)
  - "API Design" — 62% (blue)
  - "Team Knowledge" — 91% (violet)
  
  The percentage numbers count up as the bars fill.

**Frame 9.5s**: Subtext: "AI-powered morning digest, tailored to you."

**Frame 11.0s**: The card has been on screen long enough to appreciate. Now it gently scales down and moves left, making room for Scene 7's chat interface to slide in from the right. This is a SMOOTH SCENE TRANSITION — the digest card is still visible (at 50% opacity) as the chat appears, creating a sense of continuity. The two features coexist.

---

### SCENE 7: AI CHAT (2:04 – 2:28)
**Energy**: Intelligent, responsive, almost magical.

**Frame 0.0s**: The Morning Digest card has slid to the left side of the screen. The right side is now occupied by a chat interface that has been sliding in.

**Frame 1.0s**: Headline center-top: **"Ask anything. Lore knows."** — "Lore knows" in emerald.

**Frame 2.0s**: A user message bubble slides in from the right side: **"What's our current API rate limiting strategy?"** — emerald gradient background, white text, rounded corners (16px 16px 4px 16px — the 4px corner indicates "sent by user"). The bubble enters with `translateX(40px) → 0` + spring.

**Frame 3.5s**: An AI response bubble appears below. It starts as just a dark surface card with a blinking emerald cursor. Then text streams in **word by word** (0.035s per word):
  "Based on your knowledge base, your current strategy uses a **token bucket algorithm** with a **sliding window fallback**. The limit is set at 100 requests/minute for standard endpoints and 1000/minute for internal services."
  
  Key terms ("token bucket algorithm", "sliding window fallback") should appear in emerald-400 as they type, then settle to white with emerald underline. This shows the AI is pulling from SPECIFIC knowledge, not generating generic text.

**Frame 7.0s**: After the text completes, the cursor blinks twice and disappears. Then **source badges** pop in below the text (staggered 0.1s):
  - "API Documentation" — emerald pill badge, with a tiny pulse
  - "Backend Architecture" — blue pill badge
  - "Team Decision — Feb 28" — violet pill badge
  
  Each badge has a tiny connection-line animation — a line briefly draws from the badge UP to the text, showing WHERE in the response this knowledge comes from.

**Frame 9.0s**: A thumbs-up icon appears in the bottom-right of the AI bubble, subtly pulsing as if inviting interaction.

**Frame 10.0s**: Subtext: "Your knowledge base, conversational."

**Frame 11.0s**: The chat interface and digest card both scale down slightly and move to a "dashboard" layout — we're about to see the full picture. Cross-dissolve to Scene 8.

---

### SCENE 8: MEMORY & NOTES (2:28 – 2:44)
**Energy**: Organized, colorful, satisfying.

**Frame 0.0s**: Headline: **"Capture everything. Forget nothing."** — "Forget nothing" in emerald. Subtext: "6 note types, smart categorization, instant search."

**Frame 2.0s**: A 3×2 grid of note cards appears. Each card does a **3D FLIP** reveal — starting face-down (showing a subtle back pattern), then rotating on the Y-axis to reveal its content. Staggered 0.1s apart. The flip should use perspective (800px) for realistic 3D:

  1. **Note** (emerald): "API Rate Limiting" / "Current strategy uses token bucket..." / tag: `backend`
  2. **Bookmark** (blue): "REST Best Practices" / "Microsoft API design guide..." / tag: `reference`
  3. **Insight** (violet): "Token Bucket vs Leaky" / "Token bucket allows bursts..." / tag: `architecture`
  4. **Snippet** (orange): "Rate Limiter Middleware" / "const limiter = rateLimit({...});" / tag: `code`
  5. **Meeting** (pink): "Backend Sync — Feb 28" / "Decided on sliding window..." / tag: `team`
  6. **Idea** (emerald-light): "Adaptive Rate Limits" / "Adjust limits based on load..." / tag: `exploration`

  Each card has: colored left border (3px), type badge (uppercase, 11px), title (14px bold), preview (12px muted), tag pill.

**Frame 5.0s**: After all cards are revealed, tags gently float upward 5px and settle (spring physics), as if they're "un-sticking" from the cards.

**Frame 6.0s**: A search bar appears at the top of the grid. A cursor clicks into it and types "rate" (0.08s per character). As each character types, the grid filters — non-matching cards dim to 30% opacity and scale to 0.95, while matching cards brighten and scale to 1.02. This happens in REAL-TIME as the user types.

**Frame 8.0s**: The search clears. All cards return to full visibility with a satisfying spring animation.

**Frame 9.5s**: Cross-dissolve to Scene 9.

---

### SCENE 9: KNOWLEDGE HEALTH (2:44 – 2:58)
**Energy**: Data-driven, measurable, deeply satisfying.

**Frame 0.0s**: Headline: **"Measure what matters."** — "what matters" in emerald.

**Frame 1.5s**: Center-left: A CIRCULAR GAUGE appears. It's a ring (8px stroke) on a dark track. An emerald gradient arc begins DRAWING from the top (clockwise), completing at 87% of the circle over 2 seconds. The leading edge of the arc has a bright glow. Inside the ring, the number **0 → 87** counts up simultaneously (2s), rendered in weight 900, size 56px, emerald gradient text.

**Frame 3.5s**: Center-right: Four progress bars fill up with stagger (0.12s between each):
  - **Nodes**: 0% → 82% (emerald fill) — label counts "0 → 247"
  - **Connections**: 0% → 68% (blue fill) — label counts "0 → 182"
  - **Diversity**: 0% → 75% (violet fill)
  - **Activity**: 0% → 91% (orange fill)
  
  Each bar has: a label above (uppercase, 11px, muted), the bar itself (6px height, rounded), and the current value that counts up as the bar fills.

**Frame 6.0s**: Below the health dashboard, a mini AREA CHRT draws itself — a 7-day activity sparkline. The line draws left-to-right (1s), then the gradient fill fades in below it (0.5s). It's emerald gradient, looking like a heartbeat monitor for knowledge.

**Frame 7.5s**: Subtext: "Knowledge Health Score — your team's memory, quantified."

**Frame 8.5s**: Cross-dissolve to Scene 10.

---

### SCENE 10: THE COMPARISON (2:58 – 3:18)
**Energy**: Confident, definitive, undeniable.

**Frame 0.0s**: Headline: **"Not just another note app."** — "note app" in emerald with a subtle glow that suggests "we're beyond this."

**Frame 1.5s**: A comparison table RISES from the bottom. It's a glass-dark surface with subtle grid lines. Four columns: [Feature] [Lore] [Notion] [Obsidian]

  The header row appears first — "Lore" column header in emerald with glow, others in muted white.

**Frame 3.0s**: Feature rows stagger in one by one (0.25s apart). Each row slides in from the right with `translateX(20px) → 0`:

  | Feature | Lore | Notion | Obsidian |
  |---------|------|--------|----------|
  | Knowledge Graph | ✓ | ✗ | ✗ |
  | AI Morning Digest | ✓ | ✗ | ✗ |
  | Connected AI Chat | ✓ | △ | ✗ |
  | Health Score | ✓ | ✗ | ✗ |
  | Auto-classification | ✓ | △ | ✗ |
  | Team Memory Sync | ✓ | ✗ | △ |

  Each ✓ in the Lore column appears with a spring pop + emerald glow pulse. Each ✗ appears with a subtle dim/red tint. Each △ appears in orange.

**Frame 6.0s**: The Lore column gets a SUBTLE emerald background gradient that sweeps down through all rows (0.5s). The other columns get a very subtle dim effect (opacity 0.7). The visual message is unmistakable.

**Frame 7.5s**: The "Lore" column header briefly scales up (1.0 → 1.15 → 1.0) with a bright glow flash. This is the mic-drop moment.

**Frame 8.5s**: The table holds for a beat, then cross-dissolves to Scene 11.

---

### SCENE 11: TEAM COLLABORATION (3:18 – 3:32)
**Energy**: Multiplying, alive, powerful together.

**Frame 0.0s**: A knowledge graph appears — similar to Scene 5 but LARGER and more complex (~50 nodes). It pulses with life.

**Frame 1.0s**: THREE cursors appear simultaneously — one white, one blue, one violet — each representing a different team member. They move INDEPENDENTLY on smooth bezier paths, exploring different parts of the graph.

**Frame 3.0s**: Each cursor creates a new node where it "clicks":
  - White cursor → emerald "concept" node
  - Blue cursor → blue "person" node
  - Violet cursor → violet "project" node
  
  Each new node appears with the signature ripple + spring. But here's the magic: **connections automatically form between the new nodes** — even though different people created them. This visualizes the core promise: Lore connects knowledge ACROSS team members automatically.

**Frame 5.0s**: The connections between different-team-members' nodes should have a SPECIAL animation — when they form, a BRIGHT emerald spark travels along the connection, and both connected nodes pulse simultaneously. This is the "magic moment" — knowledge finding knowledge.

**Frame 7.0s**: Headline: **"Built for teams."** — "teams" in emerald.
  Subtext: "Shared memory that stays consistent, always."

**Frame 8.5s**: The graph zooms OUT slightly to show its full scale — it's massive now. A subtle sense of awe. Then cross-dissolve to Scene 12.

---

### SCENE 12: SECURITY & ARCHITECTURE (3:32 – 3:46)
**Energy**: Solid, impenetrable, enterprise-grade.

**Frame 0.0s**: Center screen: A STYLIZED GLOBE assembles from wireframe circles. Three orbital rings at different angles (0°, 30°, 60°), all in low-opacity emerald. Small dots on the rings represent data centers / regions. The globe rotates slowly.

**Frame 2.0s**: A SHIELD ICON draws itself center-screen (SVG stroke animation, emerald, 0.8s). The shield has:
  - An outer shape (pentagon/crest)
  - A checkmark inside that draws after the shield completes (0.4s)
  - After both are drawn, the shield FILLS with a subtle emerald gradient (opacity 0 → 0.15 over 0.5s)

**Frame 3.5s**: Data channels animate around the globe — thin emerald lines that trace paths between the region dots. When a line reaches a dot, that dot pulses. This visualizes multi-region data replication in real-time.

**Frame 5.0s**: Headline: **"Enterprise-grade. Zero data drift."** — "Zero data drift" in emerald.
  Subtext: "Multi-region architecture. Your knowledge, always consistent."
  Below: **"Powered by Aurora DSQL"** in emerald-400, 14px, weight 600, with subtle glow.

**Frame 7.0s**: The globe, shield, and data channels continue their ambient animations. Everything feels SOLID and RELIABLE. Then cross-dissolve to Scene 13.

---

### SCENE 13: SOCIAL PROOF (3:46 – 4:02)
**Energy**: Trust, warmth, validation from peers.

**Frame 0.0s**: Three testimonial cards slide in from alternating sides (left, right, left), staggered 0.3s:

  1. **From left**: Sarah Kim, CTO at Meridian Labs
     - Emerald avatar circle with "SK" initials
     - ★★★★★ (stars pop in one by one, 0.08s each)
     - *"Lore turned our scattered Notion docs into a living knowledge base. Our onboarding time dropped from 3 weeks to 3 days."*
     - The "3 weeks → 3 days" part gets a subtle emerald highlight as it appears

  2. **From right**: Marcus Rivera, VP Engineering at Cascade
     - Blue avatar "MR"
     - ★★★★★
     - *"The knowledge graph is a game-changer. I discovered connections between projects I never would have found manually."*

  3. **From left**: Aisha Laurent, Engineering Lead at Prism
     - Violet avatar "AL"
     - ★★★★★
     - *"Morning Digest alone saves me 30 minutes every day. It's like having a research assistant who knows everything."*

  Each card is glass-dark with the person's accent color as a subtle border highlight.

**Frame 6.0s**: Below the testimonials, a row of company names fades in: MERIDIAN | CASCADE | PRISM | VERTEX | HELIX — in muted text, spaced evenly, suggesting these are real companies that trust Lore.

**Frame 8.0s**: Everything holds, then cross-dissolves to Scene 14.

---

### SCENE 14: PRICING (4:02 – 4:18)
**Energy**: Simple, confident, no tricks.

**Frame 0.0s**: Headline: **"Simple, transparent pricing."** — "pricing" in emerald.

**Frame 1.5s**: Three pricing cards RISE from below (translateY 60px → 0, spring physics, staggered 0.12s):

  **Free** ($0 / forever):
  - Up to 100 nodes
  - Basic knowledge graph
  - 5 notes per day
  - Community support
  - Secondary CTA button

  **Pro** — $12/user/month (FEATURED):
  - Emerald border with GLOW (box-shadow: 0 0 40px rgba(5,150,105,0.15))
  - "Most Popular" badge on top (emerald gradient pill)
  - Unlimited nodes
  - AI Morning Digest
  - Connected AI Chat
  - Knowledge Health Score
  - Priority support
  - Primary emerald CTA button

  **Enterprise** (Custom):
  - Everything in Pro
  - SSO & SAML
  - Aurora DSQL multi-region
  - Dedicated support
  - Custom integrations
  - Secondary CTA button

**Frame 4.0s**: Feature list items stagger in per card (0.04s per item, left-to-right across cards).

**Frame 6.0s**: The Pro card's CTA button pulses with emerald glow (opacity 0.3 → 0.7 → 0.3, 2s cycle). It's subtly saying "click me."

**Frame 8.0s**: Hold. Then cross-dissolve to the final scene.

---

### SCENE 15: THE FINALE (4:18 – 4:36)
**Energy**: Powerful, emotional, decisive. The standing ovation moment.

**Frame 0.0s**: We see the FULL knowledge graph — massive, 60+ nodes, 80+ connections, multiple colors, pulsing with life. It fills the entire screen. Particles drift through it. Connection sparks travel. It is ALIVE and it is EVERYWHERE. This is the culmination of everything we've shown.

**Frame 2.0s**: The graph slowly dims to 25% opacity — becoming a luminous background. The Lore logo fades in center-screen (80px, the completed logo from Scene 4).

**Frame 3.5s**: First line of text fades up (0.8s), weight 700, large: **"Stop losing knowledge."** — white on the dimmed graph. Hold 1.5s.

**Frame 5.0s**: Second line fades up below, SAME SIZE but in EMERALD with GLOW: **"Start building Lore."** — This hits harder because it's emerald. The glow expands, briefly brightening the graph behind it. This is the emotional peak.

**Frame 6.5s**: A large CTA button materializes (spring physics): **"Get started free →"** — emerald gradient, white text, large (18px, 16px 36px padding), with a box-shadow that creates a pool of emerald light beneath it.

**Frame 7.5s**: Below the button: **"lore.app"** in muted text, 20px, tracking 0.02em.

**Frame 8.0s**: The CTA button pulses once — glow brightens to 100% then settles to 40% (1s cycle). The logo pulses in sync — scale 1.0 → 1.1 → 1.0 with glow increase.

**Frame 9.0s**: Hold. Let it breathe. The graph behind continues its gentle pulse. The emerald glow from the text and button creates a warm, inviting atmosphere. This is the moment of decision.

**Frame 11.0s**: SLOWLY — over 2 full seconds — everything fades to black. Not a quick cut. A slow, dignified fade. The emerald glow is the last thing visible — it lingers like an afterimage.

**Frame 13.0s**: Black. Film grain only. Hold 1s.

**Frame 14.0s**: A single emerald dot appears center-screen for 0.5s — the same dot from Scene 1 — then fades. Full circle. The end.

---

## 🔊 SOUND DESIGN GUIDANCE (if audio is supported)

| Moment | Sound |
|---|---|
| Scene 1 dot pulse | Soft bass hit, reverb tail |
| Network connections forming | Tiny crystalline "tink" per connection |
| Network shattering | Glass break, reversed, lowpassed |
| Stat counters | Subtle digital tick per increment |
| Lore logo reveal | Deep, resonant bass swell |
| Text typing | Soft key clicks, very muted |
| Chat AI streaming | Gentle electronic hum |
| Comparison checkmarks | Satisfying "ding" |
| Closing CTA | Uplifting chord, major key |

Background music: Ambient electronic, starts minimal/dark, builds through Scene 4, becomes hopeful through Scenes 5–9, drops to minimal for Scene 10 (comparison), builds again for closing. Think: Jon Hopkins, Ólafur Arnalds, or Nils Frahm.

---

## ✅ FINAL QUALITY CHECKLIST

Before delivering, verify EVERY item:

- [ ] Video is MINIMUM 3 minutes (180 seconds). Target: 4:18+.
- [ ] Every single frame has at least ONE ambient animation (particle, glow, drift)
- [ ] No scene uses a hard cut — all transitions are smooth (cross-dissolve, zoom, slide)
- [ ] Emerald (#059669) is the ONLY accent color used for emphasis — no random colors
- [ ] All text is large enough to read at 1080p on a phone screen
- [ ] Number counters animate from 0 to target — never static
- [ ] At least 3 "impossibility moments" — things that make the viewer think "how?"
- [ ] The pacing has VARIETY — not all fast, not all slow. It breathes.
- [ ] The opening 3 seconds are visually arresting
- [ ] The closing 10 seconds create an emotional response
- [ ] No emoji anywhere in the video
- [ ] Film grain overlay is present throughout (2–3% opacity)
- [ ] Bloom/glow on ALL emerald elements
- [ ] Particle systems are active in every scene
- [ ] The Lore logo in Scene 4 has the ONE lens flare
- [ ] Scene 10 comparison makes Lore look undeniable
- [ ] The zoom transitions between Scenes 4→5 and 5→6 create spatial depth
- [ ] Sound design matches the visual energy (if audio supported)

---

## 🎯 THE NORTH STAR

When someone watches this video, they should feel one thing:

**"This is the future of how teams think."**

Not "that's a nice app." Not "cool animations." Not "good design."

**"This is the FUTURE."**

Make them believe it.