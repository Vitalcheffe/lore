# ClearPath AI — USAII Global AI Hackathon 2026 Submission

## Team
- Amine Harch El Korane
- Harshit Singh

## Track
Community Track (High School)

## Problem
73% of community resource searches lead to dead ends. Search engines give confident answers. Directories give long lists. Neither asks what you actually need.

## AI Solution
ClearPath AI classifies needs across multiple categories with calibrated confidence scores. When confidence is low, it asks clarifying questions instead of guessing. Crisis detection is hardcoded — AI cannot override it.

## Responsible AI
- Hardcoded crisis detection (not AI-powered)
- Calibrated confidence scores with transparency
- Clarification questions when confidence < 70%
- Human escalation to 211 navigators
- No personal data stored without consent

## Architecture
1. Free-text Input → 2. Crisis Detection → 3. Multi-label Classification → 4. Clarification Questions → 5. Transparent Results → 6. Human Escalation

## Human-in-the-Loop
- Users confirm or correct AI classifications
- Confidence thresholds trigger human escalation
- Crisis situations always route to human professionals

## Tools & Data Disclosure
- See ATTRIBUTIONS.md for full list
- AI coding assistant used (permitted by rules)
- Public datasets only (211 taxonomies, SAMHSA guidelines)

## Demo
- Live app: [deployed on Vercel]
- Pitch video: public/videos/pitch.mp4
- Pitch animation: public/pitch/
