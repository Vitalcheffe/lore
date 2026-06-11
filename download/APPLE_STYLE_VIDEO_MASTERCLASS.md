# THE ULTIMATE APPLE-STYLE PRODUCT LAUNCH VIDEO MASTERCLASS

## What This Is

This is a **universal, project-agnostic master guide** for generating a cinematic product launch video in MP4 format. Whether you're building a SaaS tool, a mobile app, a dev platform, an AI product, or literally anything else — this guide tells you exactly HOW to make the video feel like a trillion-dollar company produced it.

**Target output**: MP4, 1920×1080, 60fps, minimum 3 minutes.
**Vibe**: Apple WWDC keynote. Tesla launch event. Not a slide deck. Not a screen recording. A **film**.

---

## THE 5 LAWS OF A PERFECT PRODUCT FILM

### Law 1: The 3-Second Hook
The first 3 seconds decide if someone keeps watching. Create a moment so visually arresting that it's physically uncomfortable to look away. Not loud. Not chaotic. **Arresting.** A single point of light in absolute darkness. A shape forming from nothing. A breath before the storm.

### Law 2: The Rhythm of Revelation
A great product film is music. It has:
- **Verses** (problem, context, buildup) — slower, atmospheric, tension-building
- **Chorus** (the product, the features, the wow) — faster, brighter, energy release
- **Bridge** (comparison, social proof) — shift in tone, unexpected angle
- **Coda** (closing CTA) — everything resolves, emotional peak

The pace should NEVER be flat. It breathes. It accelerates. It pulls back. It drops.

### Law 3: Show, Don't Tell
Every claim must be **visible**. Don't write "AI-powered" — show the AI thinking. Don't write "fast" — show things moving fast. Don't write "connected" — show connections forming in real-time. The medium IS the message.

### Law 4: The Impossibility Moment
Every great product film has at least one moment where the viewer thinks "How did they do that?" or "That's not possible." This is the moment they share. The moment they remember. Build toward it. Earn it. Deliver it.

### Law 5: Magical But Credible
The magic must serve the product, not distract from it. Every stunning visual must communicate a real feature, a real benefit, a real reason to believe. Pretty without purpose is decoration. Pretty with purpose is **design**.

---

## VISUAL IDENTITY SYSTEM (Universal Rules)

### Background & Atmosphere
- **Primary background**: Deep space black `#09090B` — not just dark, but **infinite**. Add ultra-subtle noise texture (2% opacity film grain) to prevent banding and add organic depth.
- **NEVER** use flat solid backgrounds. Always add at least ONE of these: dot-grid pattern, particle field, subtle radial gradient, or noise texture.
- The background should feel like a STAGE, not a void.

### Color Rules
- **Pick ONE primary accent color** — this is your brand color. Use it for ALL emphasis, highlights, CTAs, and key moments. Everything else is neutral.
- **Accent palette**: 3–4 secondary colors used ONLY for data types, categories, or feature groupings. Never randomly.
- **Gradient rule**: Your primary color should NEVER appear flat. Always use a gradient (lighter shade → base shade) and always add a glow/bloom effect.
- **Text**: White `#FAFAFA` for primary, muted gray `#A1A1AA` for secondary, dim gray `#71717A` for tertiary.
- **Surfaces**: Glass morphism — `backdrop-filter: blur(20-24px)`, borders at `rgba(255,255,255,0.06)`. NOT flat cards. NOT solid rectangles. **Glass. Depth. Dimension.**

### Typography
- **Font**: Inter (or equivalent clean geometric sans-serif). Weights 300–900.
- **Headlines**: Weight 700–900, tracking `-0.03em`, size 48px+.
- **Subheads**: Weight 400–500, secondary color, 20–28px.
- **Labels**: Weight 600–700, uppercase, letter-spacing `0.08em`, 11–13px.
- **Body**: Weight 400, 14–16px, line-height 1.5–1.6.
- Gradient text effect for key moments: `background-clip: text` with your primary gradient.

### Light & Shadow (This Is What Separates Amateur From Pro)
1. **Every element has a light source** — top-left, slightly warm. Consistent shadows and highlights.
2. **Primary-colored elements EMIT light** — they GLOW. Not just color, but actual luminous bloom. When an accent-colored button appears, the surrounding darkness should subtly brighten.
3. **Depth of field** — foreground sharp, background subtly blurred. This creates REALISM.
4. **Reflections** — key UI elements should have a faint reflection below them (8px offset, 30% opacity, slight blur). This sells the "floating in space" look.
5. **Ambient occlusion** — where elements meet surfaces, a subtle dark gradient grounds objects in space.

---

## MOTION PHYSICS (Critical — This Makes or Breaks It)

### Easing
- **Default easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) — starts fast, decelerates smoothly. This is Apple's signature.
- **Secondary easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quart) — for softer movements.
- **NEVER** use linear easing for UI elements. NEVER.
- **NEVER** use bouncy/elastic easing — this isn't a cartoon.

### Enter Animations
- Default: `scale(0.92) → scale(1.0)` + `opacity 0 → 1` + `translateY(20px) → 0`
- Duration: 0.5–0.7s
- Each element enters ONE AT A TIME or in small groups — never everything simultaneously.

### Exit Animations
- Reverse of enter, but 30% faster. Duration: 0.3–0.4s.
- Elements can also dissolve into particles for dramatic exits.

### Stagger
- Siblings: 0.07s delay between each. Not 0.1s (too slow), not 0.04s (too uniform). 0.07s creates organic rhythm.
- Groups: 0.15–0.25s between major groups.

### Spring Physics
- For "settling" animations (card drops, button presses): stiffness 300, damping 25. The element should slightly overshoot and settle. This feels ALIVE.

### Continuous Ambient
- EVERY "static" frame must have at least 2 ambient animations:
  - Subtle particle drift
  - Gentle glow pulse (opacity 0.3 → 0.6 → 0.3 over 3–4s cycles)
  - Slow parallax shift
  - Breathing scale (1.0 → 1.02 → 1.0 over 5s)
- If a frame has ZERO motion for more than 0.5s, it's a failure.

### Camera & Composition
- **Rule of thirds** — key elements on third lines, not dead center (unless deliberate "hero" moment).
- **Parallax layers** — background at 0.3x speed, midground at 0.6x, foreground at 1.0x. Creates real depth.
- **Zoom transitions** — instead of cross-dissolves between some scenes, zoom INTO an element and emerge into the next scene. Creates infinite depth.
- **Rack focus** — shift focus from foreground to background to reveal information. Cinematic.
- **Aspect ratio tricks** — occasionally pillarbox (black bars) for dramatic emphasis, then expand back for energy release.
- **NO dutch angles.** This isn't a music video.

---

## POST-PRODUCTION EFFECTS (What Separates "Good" From "How Is This Possible")

### Bloom / Glow
- Every primary-colored element gets bloom: soft, bright glow extending 15–30px beyond the edge.
- Glow should pulse subtly (opacity 0.3 → 0.6 → 0.3) over 3–4s cycles.
- When a NEW primary-colored element appears, bloom flashes bright (opacity 1.0) then settles to 0.4 over 0.8s.

### Light Rays / God Rays
- For dramatic reveals (logo, product name): subtle light rays emanating from behind (4–6 rays, 30% opacity, rotating slowly).
- Use SPARINGLY. Once or twice in the entire video. Earned, not gratuitous.

### Particle Systems (Present in EVERY Scene)
- **Ambient particles**: Tiny (1–3px) dots in your primary color that drift upward slowly, like embers. Present at 10–15% opacity in ALL scenes. Creates atmosphere of "alive."
- **Connection particles**: When two graph/network nodes connect, 3–5 particles travel along the edge from source to target over 0.8s. Makes connections feel ACTIVE.
- **Dissolve particles**: When elements disappear, they break into 20–30 tiny particles that drift and fade over 1.2s. Not just "fade out." **Dissolve.**
- **Celebration particles**: For milestone moments (first user action, achievement unlock), a burst of 40–50 particles from a central point.

### Chromatic Aberration (SUBTLE)
- On fast-moving transitions: 1–2px RGB channel offset. Sells speed and impact.
- MUST be subtle. Felt, not seen. If it's noticeable, it's too much.

### Film Grain
- Ultra-subtle animated noise overlay at 2–3% opacity across the ENTIRE video.
- Prevents color banding on dark gradients.
- Adds organic texture.
- Makes it feel like FILM, not screen recording.

### Lens Flare
- ONE subtle lens flare for the BIGGEST reveal (product name/logo). Anamorphic horizontal streak, tinted with primary color, 0.6s duration.
- ONLY ONE in the entire video. This makes it special.

### Volumetric Light
- For "warm" scenes (morning, welcome, optimism): a volumetric light cone from above-left, as if sunlight streaming through a window. Dust particles float in the beam.
- Use once or twice for emotional contrast.

### Screen Capture Realism
- When showing app UI, it should look like a REAL app — not a mockup, not a wireframe:
  - Realistic browser chrome (subtle, dark theme)
  - Actual cursor movement (smooth bezier path, NOT linear)
  - Scroll behavior with momentum
  - Real hover states that activate as the cursor passes
  - Keyboard shortcuts briefly highlighted
  - Loading states, transitions between screens

---

## THE UNIVERSAL 15-SCENE STRUCTURE

This structure works for ANY product. Adapt the content to your project, but follow the emotional arc:

---

### SCENE 1: THE VOID (0:00 – 0:16)
**Energy**: Zero → One. The birth of something.
**Purpose**: Hook the viewer in 3 seconds. Create visual tension. Establish the aesthetic.

1. Pure black. Hold 2s. Film grain only. Anticipation.
2. A single point of light appears (in your primary color). Pulses once. A ripple ring expands outward.
3. The point splits. A connection draws between them — traveling like a spark along a wire.
4. Network grows organically — nodes appear with micro-ripples, connections spark into existence. This should feel like neurons forming. Bioelectric. Alive.
5. Camera slowly pushes in (zoom 1.0x → 1.3x over 3s) as the network grows. Parallax depth.
6. The network begins to strain — connections stretch, subtle glitch effects (1px position offsets, opacity dips).
7. The network SHATTERS — connections snap one by one, cascade failure. Each snap = micro-flash. Nodes drift into darkness. Beautiful destruction.
8. Near-darkness. A few orphaned nodes drift.
9. Your MANIFESTO/LINE appears — words materializing from colored particles that swirl and condense, one word at a time. The last word lands with a subtle camera shake.
10. Below: your tagline in primary color with soft glow.
11. Cross-dissolve to Scene 2.

---

### SCENE 2: THE CHAOS (0:16 – 0:36)
**Energy**: Tension, disorder, frustration.
**Purpose**: Make the viewer FEEL the problem. Don't describe it — show it.

1. Scattered fragments across the viewport — glass-morphism cards, each representing a tool/concept/fragment of the user's scattered workflow. Each has an icon and label. They float gently with sinusoidal drift, different phases. Beautiful individually, chaotic together. NO connections. NO order.
2. Fragments move faster, more erratic. Overlapping increases.
3. Headline materializes center-screen, pushing fragments aside: **"Your [workflow/knowledge/data/process] is scattered across [N]+ tools"** — the number in your primary color with glow.
4. Fragments start GLITCHING:
   - Random 2px position jumps every 0.3s
   - Brief opacity dips to 0.3
   - Text labels briefly corrupt
   - Connection attempt lines flash between fragments but FAIL (draw 20% then snap)
5. Headline changes: **"None of them talk to each other."** — hits harder because we just SAW the connection attempts fail.
6. Everything FREEZES. Then slowly all fragments shrink and dim, converging toward center.
7. Just before meeting, they DISSOLVE into particles that drift upward and fade.
8. Beat of silence. Cross-dissolve to Scene 3.

---

### SCENE 3: THE COST (0:36 – 0:58)
**Energy**: Heavy, then rising urgency.
**Purpose**: Quantify the pain. Make it undeniable with data.

1. Dark screen with subtle particles drifting upward (representing lost things).
2. First stat: Giant number counter **0 → [N]** over 2s. Enormous — filling ~40% of screen height. Rendered in primary gradient with bloom. Each digit change creates a subtle screen pulse. Below: label in muted text.
3. Hold 0.8s. First stat drifts and shrinks to the left third.
4. Second stat: Counter **0 → [N]%** over 2s. Same treatment. Below: label.
5. Hold 0.8s. Second stat drifts right.
6. Third stat: Counter **$0 → $[N]M** over 2.5s. The currency symbol appears first, then numbers roll. The suffix lands last with a subtle camera shake.
7. All three stats visible simultaneously, arranged horizontally. They pulse once together — shared heartbeat.
8. The stats CRACK — fracture lines appear (like breaking glass), and through the cracks, primary-colored light glows from behind.
9. The cracked stats SHATTER (glass-shard particle explosion, 40–50 shards per number, each reflecting colored light). Shards tumble and fade.
10. Black screen. Cross-dissolve to Scene 4.

---

### SCENE 4: THE REVEAL (0:58 – 1:18)
**Energy**: Revelation. Birth. The "one more thing" moment.
**Purpose**: This is the hero moment. The product appears. Make it unforgettable.

1. Black screen. A HORIZONTAL STREAK of primary-colored light SWEEPS across the entire screen (0.6s). Not just a line — a band of light ~100px tall with bright core and soft falloff, like a scanner. As it passes, it REVEALS a subtle dot-grid pattern (1px dots, spaced 40px, at 8% opacity). They were always there. The light just showed them.
2. Grid pulses once — all dots brighten to 20% opacity for 0.3s then return to 8%.
3. Center screen: The PRODUCT LOGO forms:
   - Step 1: Main shape/circle fades in from center outward, like a ripple becoming solid. Subtle inner gradient for 3D curvature.
   - Step 2: Internal details DRAW themselves — SVG stroke-dashoffset animation. Each stroke has a bright "leading edge" — a brighter point at the tip.
   - Step 3: Accent details pop in with spring physics (overshoot to 1.15x, settle to 1.0x). Staggered 0.07s. Each pop emits a tiny ripple.
   - Step 4: Connecting elements draw themselves. Sparks travel along completed paths.
4. Logo pulses once — scale 1.0 → 1.06 → 1.0, glow brightens → dims. The ONE lens flare of the video: anamorphic horizontal streak, tinted primary, 0.6s.
5. Below the logo: the PRODUCT NAME appears via reveal — a bright line sweeps across the text from left to right, letters REVEALED behind it. Huge text (80px+), weight 900, tracking -0.05em, white.
6. Let the name breathe. Its presence is commanding.
7. Subtitle types out character by character: **[Your tagline]** — 0.03s per character. Tiny cursor blinks at the end, blinks twice more, then fades. Text in your lighter primary shade.
8. Logo pulses again. Grid brightens. Everything alive.
9. Beat of stillness. Then camera PUSHES IN toward the logo (zoom 1.0x → 2.5x over 1.5s). As we pass through, we emerge into Scene 5. Zoom transition.

---

### SCENE 5: CORE FEATURE 1 — THE "ALIVE" FEATURE (1:18 – 1:44)
**Energy**: Alive, expanding, wondrous.
**Purpose**: Show the product's most visual/dynamic feature. This is the "wow" feature.

**Adapt this to your product.** Examples:
- Knowledge app → knowledge graph forming
- Design tool → canvas elements connecting
- Data tool → visualizations drawing themselves
- Dev tool → code flowing and compiling
- AI tool → neural network activating

1. Emerge from zoom transition into vast dark space. A single primary-colored node/element sits center-screen. Pulses gently.
2. A second element appears with spring physics. Connection draws between them (0.3s), traveling like a spark. When complete, tiny particles travel along the connection.
3. More elements appear — each with ripple + spring entrance, each with different category colors. Connections form with traveling particles. The visualization is GROWING.
4. Growth accelerates — elements appear 2–3 at a time, connections form rapidly. Camera slowly PULLS BACK to accommodate. Parallax depth.
5. The visualization has reached impressive scale (~30+ elements). It fills ~60% of screen.
6. A cursor appears — small white dot with colored trail. Moves on smooth bezier path. As it approaches elements, they grow (1.0 → 1.1x) and brighten. Cursor has AWARENESS — moves with purpose.
7. Cursor hovers over an element. A PREVIEW/DETAIL CARD pops out:
   - Glass morphism background
   - Title, type badge, content preview, metadata
   - Slides out with spring physics, slightly overshooting and settling
8. Cursor moves on. Card closes. Visualization continues to pulse.
9. Headline fades in top-center: **"[Feature headline] — [key word] in [primary color]."** Positioned in top 15% — doesn't cover the visualization.
10. Subtext below headline.
11. Visualization continues alive — new elements, connections, particles. Then zoom INTO an element (1.0x → 8x over 1.5s). We pass through and emerge into Scene 6.

---

### SCENE 6: CORE FEATURE 2 — THE "SMART" FEATURE (1:44 – 2:04)
**Energy**: Warm, clarifying, intelligent.
**Purpose**: Show AI/automation/intelligence. Something that thinks for you.

**Adapt this to your product.** Examples:
- Knowledge app → morning digest
- Design tool → AI layout suggestions
- Data tool → automated insights
- Dev tool → AI code review
- Productivity app → smart summaries

1. A warm glow rises from the bottom (volumetric light, amber/golden tint). Not solid — a light cone as if sunlight through a window. Dust particles float in the beam.
2. Headline: **"[Feature headline] — [key word] in primary color."** Text appears in the lit area, as if the light reveals it.
3. A card/interface materializes — rising from below with spring physics. Glass-dark card containing:
   - Header with label (uppercase, small, primary color)
   - AI-generated content appearing line by line (filling gradient bars that represent text, OR actual typing animation)
   - 2–3 insight/action cards sliding in from the right with stagger, each with colored left-border accent
   - Optional: progress indicators, status badges, mood indicators
4. Subtext: "[Feature description.]"
5. The card gently scales down and moves to one side, making room for Scene 7's feature to slide in. SMOOTH TRANSITION — both features briefly coexist, creating continuity.

---

### SCENE 7: CORE FEATURE 3 — THE "CONVERSATIONAL" FEATURE (2:04 – 2:28)
**Energy**: Intelligent, responsive, almost magical.
**Purpose**: Show the product responding to user input in real-time. Chat, search, query, command.

**Adapt this to your product.** Examples:
- Knowledge app → AI chat
- Design tool → natural language to design
- Data tool → query interface
- Dev tool → AI pair programming
- Any app → command palette

1. Scene 6's card has slid to one side. The other side is now occupied by your conversational interface.
2. Headline center-top: **"Ask anything. [Product] knows."** — "[Product] knows" in primary color.
3. User input slides in from the right: a message/command/query in a primary-colored bubble, white text. Enters with translateX + spring.
4. AI/Response appears: dark surface element, and text streams in **word by word** (0.035s per word) with a blinking cursor:
   - Key terms should appear in primary color as they type, then settle to white with colored underline
   - This shows the AI is pulling from SPECIFIC knowledge, not generating generic text
5. After text completes: **source/reference badges** pop in below (staggered 0.1s) — small pills with category colors, each with a tiny pulse. Optional: tiny connection-line animations drawing from badges to relevant text portions.
6. A reaction/feedback icon appears (thumbs up, checkmark, etc.) — subtly pulsing.
7. Subtext: "[Feature description.]"
8. Both features (Scene 6 + 7) scale down. Cross-dissolve to Scene 8.

---

### SCENE 8: CORE FEATURE 4 — THE "ORGANIZATION" FEATURE (2:28 – 2:44)
**Energy**: Organized, colorful, satisfying.
**Purpose**: Show how the product organizes/manages content. Cards, lists, categories, types.

**Adapt this to your product.** Examples:
- Knowledge app → typed notes grid
- Design tool → asset library
- Data tool → dataset manager
- Dev tool → project files
- Any app → categorized content

1. Headline: **"Capture everything. [Key promise.]"** — key promise in primary color.
2. Subtext: "[N] types, smart categorization, instant search."
3. A grid of cards appears. Each card does a **3D FLIP** reveal — starting face-down, rotating on Y-axis to reveal content. Staggered 0.1s apart. Use perspective (800px) for realistic 3D.
4. Each card has: colored left border (3px), type badge (uppercase, 11px), title (14px bold), preview (12px muted), tag pill. Different types = different colors.
5. After all cards revealed: tags gently float upward 5px and settle (spring physics).
6. A search bar appears. A cursor types a query (0.08s per character). As each character types, the grid FILTERS in real-time — non-matching cards dim and scale down, matching cards brighten and scale up.
7. Search clears. All cards return to full visibility with spring animation.
8. Cross-dissolve to Scene 9.

---

### SCENE 9: ANALYTICS / HEALTH / METRICS (2:44 – 2:58)
**Energy**: Data-driven, measurable, satisfying.
**Purpose**: Show that the product gives measurable results. Scores, charts, numbers.

**Adapt this to your product.** Examples:
- Knowledge app → health score
- Design tool → design system coverage
- Data tool → data quality score
- Dev tool → code health metrics
- Any app → usage analytics

1. Headline: **"Measure [what matters]."** — "what matters" in primary color.
2. Center-left: A CIRCULAR GAUGE appears. Arc draws from top (clockwise) to ~87% over 2 seconds. Leading edge has bright glow. Inside: number **0 → [N]** counts up simultaneously (2s), rendered in weight 900, size 56px, primary gradient text.
3. Center-right: 3–4 progress bars fill up with stagger (0.12s):
   - Each bar has: label above (uppercase, 11px, muted), bar itself (6px, rounded), value counting up
   - Different colors per bar
4. Below: a mini AREA CHART draws itself — 7-day sparkline. Line draws left-to-right (1s), then gradient fill fades in below it (0.5s). Primary color gradient, like a heartbeat monitor.
5. Subtext: "[Metric description.]"
6. Cross-dissolve to Scene 10.

---

### SCENE 10: COMPETITIVE COMPARISON (2:58 – 3:18)
**Energy**: Confident, definitive, undeniable.
**Purpose**: Show why THIS product wins. Not by talking trash — by being objectively better.

1. Headline: **"Not just another [competitor category]."** — category in primary color with subtle glow suggesting "we're beyond this."
2. A comparison table RISES from bottom. Glass-dark surface with subtle grid lines. Columns: [Feature] | [Your Product] | [Competitor 1] | [Competitor 2]
3. Header row appears first — your product's column header in primary with glow, others in muted white.
4. Feature rows stagger in one by one (0.25s apart). Each slides in from right with translateX:
   - Your product column: ✓ (primary color, spring pop + glow pulse per checkmark)
   - Competitor columns: ✗ (muted/dim) or △ (orange, partial)
   - Pick 5–6 features where your product genuinely wins
5. Your product's column gets a SUBTLE primary-color background gradient that sweeps down through all rows (0.5s). Other columns dim slightly (opacity 0.7).
6. Your column header briefly scales up (1.0 → 1.15 → 1.0) with bright glow flash. Mic-drop moment.
7. Hold. Cross-dissolve to Scene 11.

---

### SCENE 11: TEAM / COLLABORATION (3:18 – 3:32)
**Energy**: Multiplying, alive, powerful together.
**Purpose**: Show the product working for groups. Multiple users. Shared value.

1. A visualization from Scene 5 reappears — LARGER and more complex. It pulses with life.
2. THREE cursors appear simultaneously — different colors, different team members. They move INDEPENDENTLY on smooth bezier paths.
3. Each cursor creates new elements where it "clicks." But here's the magic: **connections automatically form between different-team-members' elements** — visualizing the core promise: the product connects work ACROSS team members automatically.
4. When cross-team connections form, a BRIGHT spark travels along the connection, and both connected elements pulse simultaneously. This is the "impossibility moment" — work finding work.
5. Headline: **"Built for [teams/groups/collaboration]."** — key word in primary color.
6. Subtext: "[Collaboration promise.]"
7. Visualization zooms OUT to show full scale. Awe. Cross-dissolve to Scene 12.

---

### SCENE 12: SECURITY / ARCHITECTURE / TRUST (3:32 – 3:46)
**Energy**: Solid, impenetrable, enterprise-grade.
**Purpose**: Show that the product is serious, reliable, and trustworthy.

1. Center screen: A STYLIZED GLOBE assembles from wireframe circles. Three orbital rings at different angles, in low-opacity primary color. Small dots represent regions/nodes. Globe rotates slowly.
2. A SHIELD/LOCK ICON draws itself center-screen (SVG stroke animation, primary color, 0.8s). Internal detail (checkmark/key) draws after outer shape completes. Shape fills with subtle primary gradient.
3. Data channels animate around the globe — thin lines tracing paths between region dots. When a line reaches a dot, that dot pulses.
4. Headline: **"[Trust headline.] [Key promise] in primary color."**
5. Subtext: "[Architecture/security description.]"
6. Optional: technology/provider name in primary color with glow.
7. Hold. Cross-dissolve to Scene 13.

---

### SCENE 13: SOCIAL PROOF (3:46 – 4:02)
**Energy**: Trust, warmth, validation from peers.
**Purpose**: Real people, real results. Make the viewer think "if it works for them, it works for me."

1. Three testimonial cards slide in from alternating sides (left, right, left), staggered 0.3s:
   - Each card: glass-dark, avatar circle with initials, name + role, ★★★★★ (stars pop one by one 0.08s), italic quote
   - Highlight key metrics in quotes with primary color ("3 weeks → 3 days", "30 minutes saved")
   - Different accent colors per card border
2. Below: A row of company/team names fades in: muted text, spaced evenly, suggesting real organizations trust this product.
3. Hold. Cross-dissolve to Scene 14.

---

### SCENE 14: PRICING (4:02 – 4:18)
**Energy**: Simple, confident, no tricks.
**Purpose**: Show that the product is accessible. Remove friction.

1. Headline: **"Simple, transparent [pricing/plans]."** — "pricing/plans" in primary color.
2. Three pricing cards RISE from below (translateY 60px → 0, spring physics, staggered 0.12s):
   - **Free/Starter**: Basic features, secondary CTA button
   - **Pro/Standard** (FEATURED): Primary-color border with GLOW, "Most Popular" badge, primary CTA button, best value features
   - **Enterprise/Custom**: All features, secondary CTA button
3. Feature list items stagger in per card (0.04s per item).
4. Featured card's CTA button pulses with glow (0.3 → 0.7 → 0.3, 2s cycle).
5. Hold. Cross-dissolve to final scene.

---

### SCENE 15: THE FINALE (4:18 – 4:36)
**Energy**: Powerful, emotional, decisive. The standing ovation moment.
**Purpose**: Seal the deal. Make them ACT.

1. The product's core visualization fills the entire screen — massive, pulsing with life. Particles drift through it. Sparks travel. It is ALIVE and EVERYWHERE. This is the culmination.
2. Visualization slowly dims to 25% opacity — becomes luminous background. The product logo fades in center (80px, completed version from Scene 4).
3. First line fades up (0.8s), large, white: **"Stop [core pain point]."** Hold 1.5s.
4. Second line fades up below, SAME SIZE, in PRIMARY COLOR WITH GLOW: **"Start [core action/product name]."** The glow expands, briefly brightening the background. This is the emotional peak.
5. A large CTA button materializes (spring physics): **"Get started free →"** — primary gradient, white text, 18px, with shadow creating a pool of primary light beneath it.
6. Below: **[product URL]** in muted text, 20px.
7. CTA button pulses once — glow brightens to 100% then settles (1s). Logo pulses in sync — scale 1.0 → 1.1 → 1.0 with glow.
8. Hold. Let it breathe. The background visualization continues its gentle pulse. Primary glow from text and button creates warm, inviting atmosphere.
9. SLOWLY — over 2 full seconds — everything fades to black. The primary glow is the LAST thing visible — it lingers like an afterimage.
10. Black. Film grain only. Hold 1s.
11. A single primary-colored dot appears center-screen for 0.5s — the same dot from Scene 1 — then fades. Full circle. The end.

---

## SOUND DESIGN GUIDE (if audio is supported)

| Moment | Sound |
|---|---|
| Scene 1 dot pulse | Soft bass hit, reverb tail |
| Connections forming | Tiny crystalline "tink" per connection |
| Network shattering | Glass break, reversed, lowpassed |
| Stat counters | Subtle digital tick per increment |
| Product logo reveal | Deep, resonant bass swell |
| Text typing | Soft key clicks, very muted |
| AI/Smart feature streaming | Gentle electronic hum |
| Comparison checkmarks | Satisfying "ding" |
| Closing CTA | Uplifting chord, major key |

**Background music**: Ambient electronic. Starts minimal/dark, builds through Scene 4, becomes hopeful through Scenes 5–9, drops to minimal for Scene 10 (comparison), builds again for closing. Artists for reference: Jon Hopkins, Olafur Arnalds, Nils Frahm.

---

## ANTI-PATTERNS (DO NOT DO THESE)

- NO jarring hard cuts between scenes — always smooth transitions
- NO text-heavy slides — max: headline + one subline
- NO small fonts — minimum 24px body, 48px+ headlines
- NO static scenes without ambient motion — if a frame has zero motion for >0.5s, it fails
- NO emoji anywhere in the video
- NO generic stock footage — use CSS/SVG-illustrated visuals
- NO rushed openings — the first 10 seconds set the tone
- NO abrupt endings — always a powerful closing with CTA
- NO chaotic simultaneous animations — sequence everything
- NO clip-art or cheap icons — clean geometric/CSS-style visuals
- NO bouncy/elastic easing — this isn't a cartoon
- NO linear easing on UI elements
- NO more than ONE lens flare in the entire video
- NO flat solid backgrounds — always textured/layered
- NO primary color appearing flat — always gradient + glow
- NO corporate jargon in text — speak human

---

## FINAL QUALITY CHECKLIST

Before delivering, verify EVERY item:

- [ ] Video is MINIMUM 3 minutes (180 seconds). Target: 4:18+.
- [ ] Every frame has at least ONE ambient animation (particle, glow, drift)
- [ ] No scene uses a hard cut — all transitions are smooth
- [ ] Primary accent color is used consistently — no random colors
- [ ] All text is readable at 1080p on a phone screen
- [ ] Number counters animate from 0 to target — never static
- [ ] At least 3 "impossibility moments" — things that make the viewer think "how?"
- [ ] The pacing has VARIETY — not all fast, not all slow. It breathes.
- [ ] The opening 3 seconds are visually arresting
- [ ] The closing 10 seconds create an emotional response
- [ ] No emoji anywhere
- [ ] Film grain overlay present throughout (2–3% opacity)
- [ ] Bloom/glow on ALL primary-colored elements
- [ ] Particle systems active in every scene
- [ ] The product logo reveal has the ONE lens flare
- [ ] Comparison scene makes the product look undeniable
- [ ] At least one zoom transition creating spatial depth
- [ ] Sound design matches visual energy (if audio supported)

---

## THE NORTH STAR

When someone watches this video, they should feel:

**"This is the future."**

Not "that's a nice app." Not "cool animations." Not "good design."

**"This is the FUTURE."**

Make them believe it.
