# Task: Build Settings Page, Privacy Page, and Terms Page

## Summary
Built three comprehensive pages for the LORE knowledge management platform:

### 1. Settings Page — `src/app/app/settings/page.tsx`
- Comprehensive settings with 8 sections: Profile, Subscription & Billing, Knowledge Graph, Morning Digest, AI Chat, Notifications, Privacy & Security, Appearance
- Left sidebar navigation with emerald green active states
- Framer Motion fade transitions between sections
- All form controls using shadcn/ui components (Switch, Select, RadioGroup, Slider, Checkbox, Input, Textarea, AlertDialog)
- Profile section with avatar initials, name/email/username/bio inputs, save button
- Subscription section with plan badge, features summary, upgrade button (calls /api/stripe/checkout), manage billing (calls /api/stripe/portal), usage stats with progress bars (nodes 24/50, AI queries 12/10 with upgrade prompt, storage 42/100MB)
- Knowledge Graph with layout radio group (Force/Radial/Tree), labels toggle, node size select, edge style select, auto-link toggle, animation speed select
- Morning Digest with enabled toggle, time input, email toggle, AI comment toggle, focus area checkboxes
- AI Chat with model select, stream toggle, sources toggle, confidence threshold slider
- Notifications with 4 toggle switches
- Privacy & Security with 2FA (disabled/coming soon), data retention select, download data button, danger zone with delete account confirmation dialog
- Appearance with light theme (locked), font size select, sidebar position toggle, reduced motion toggle
- Settings persist to /api/user/settings with debounced updates

### 2. Privacy Policy Page — `src/app/privacy/page.tsx`
- 12 sections with 150+ words each, professional legal content
- Sticky sidebar table of contents on desktop
- Sections: Introduction, Information We Collect (3 subsections: Personal, Usage, Knowledge), How We Use Your Information, Data Storage & Security (Aurora DSQL encryption), Data Sharing, Your Rights (access, deletion, portability), Data Retention, Cookies, Third-Party Services, Children's Privacy, Changes to This Policy, Contact Us
- Emerald green accent for section numbers and highlights
- Navbar and Footer included
- Framer Motion fade-in animations

### 3. Terms of Service Page — `src/app/terms/page.tsx`
- 14 sections with 150+ words each, professional legal content
- Same sticky sidebar design as Privacy page
- Sections: Acceptance of Terms, Description of Service (LORE description), Account Registration, Acceptable Use, User Content, Intellectual Property, Payment Terms (Stripe integration), Termination, Disclaimer of Warranties, Limitation of Liability, Indemnification, Governing Law, Changes to Terms, Contact Information
- Emerald green accent matching Privacy page style
- Navbar and Footer included

### Design Consistency
- Emerald green (#059669) primary accent throughout all pages
- Light theme only with white backgrounds (#FFFFFF), soft gray cards (#F9FAFB), warm borders (#E5E7EB)
- All pages are responsive (mobile-first design)
- shadcn/ui components used consistently
- Framer Motion animations for smooth transitions
- All pages compile without TypeScript errors
