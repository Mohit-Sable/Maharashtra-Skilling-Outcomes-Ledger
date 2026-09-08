# MSOL — Maharashtra Skilling Outcomes Ledger

> **SIH 2026 — Problem Code SIH26135**  
> *From certificate to livelihood — consent-based, longitudinal outcome tracking.*

## Problem

India's skilling ecosystem tracks **inputs** — enrolment, attendance, certification. But nobody systematically tracks **outcomes**: Did the trainee get a job? Are they still employed after 90 days? What do they earn? Why did they leave?

**MSOL is the outcomes layer** on top of existing training MIS.

## How to Run

```bash
cd msol
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Logins

| Role | Email | Password |
|------|-------|----------|
| State Admin | admin@msol.demo | demo123 |
| District Officer | district@msol.demo | demo123 |
| Training Provider | provider@msol.demo | demo123 |
| Employer | employer@msol.demo | demo123 |
| Counsellor | counsellor@msol.demo | demo123 |
| Trainee | trainee@msol.demo | demo123 |

**Trainee OTP:** Any 6-digit number works.

## Judge's 3-Minute Path

1. **Landing page** → See SIH26135, the 80%→42% placement-to-retention punchline
2. **Login as Admin** → Quick login button, paper vs verified placement gap across engineering colleges
3. **Institute Scorecard** → Open Pune Valley College of Engineering: 82% TPO paper vs 41% verified 90-day retention
4. **Student 360°** → See student MSOL-MH-0005 who vacated hostel, changed phone, and triggered counsellor escalation
5. **Skill Gaps Heatmap** → Mechanical graduates lack SolidWorks/GD&T; CSE students lack SQL/DSA
6. **Student Login (`trainee@msol.demo`)** → Rahul Kamble (B.E. Computer Engineering, Sinhagad Road Pune)
7. **MSOL Sahayak (AI Career Assistant)** → Ask "What skills am I missing for an SDE / campus IT role?" → Sahayak retrieves his live CSE gaps (DSA & SQL) from his MSOL record and links to `/me/roadmap`
8. **Skill Passport & Roadmaps** → Unified APAAR-linked passport, NPTEL remedial matching, and Persistent Systems GET internship match
9. **Privacy & DPDP** → Granular consent controls and withdrawal mechanism

## MSOL Sahayak (सहायक) — Student Career Assistant

MSOL Sahayak is a privacy-first, offline-capable AI career assistant built exclusively for engineering students in Maharashtra.

- **Role Gated**: Accessible only to authenticated trainees (`/me/chat` and floating action widget across trainee views). Non-trainees are automatically redirected to `/dashboard`.
- **Grounded in Official Records**: Rahul doesn't need to check 7 screens. Sahayak queries his live profile, college TPO claim, employer confirmation status, missing CSE competencies, next 30/90-day follow-up, and DPDP consent settings.
- **Zero Paid LLM Dependency**: Operates entirely offline using deterministic intent extraction and local MSOL store evaluation. `npm run build` succeeds without external API keys or environment variables.
- **Branch-Aware**: Understands CSE (DSA, SQL, Persistent), Mechanical (SolidWorks, GD&T, Tata Motors), and Civil (AutoCAD Civil, L&T).
- **DPDP Compliant**: Masks sensitive phone numbers and APAAR IDs; respects student consent settings and rejects out-of-scope queries.

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── login/              # Login with 6 demo roles
│   ├── about/              # Problem statement + Phase 2
│   └── (app)/              # Protected app shell
│       ├── dashboard/      # Role-aware KPI dashboard
│       ├── trainees/       # Registry + [id] 360° view
│       ├── follow-ups/     # Queue + survey + WhatsApp/IVR mock
│       ├── employers/      # List + verify/[token] magic link
│       ├── outcomes/       # Capture job/self-emp/apprentice
│       ├── analytics/      # Charts, filters, verified toggle
│       ├── skill-gaps/     # Branch x skill heatmap + remedial cards
│       ├── providers/      # Engineering college scorecards + [id] detail
│       ├── policy/         # Auto-generated evidence brief for DTE
│       ├── consent/        # Multi-step DPDP onboarding
│       ├── privacy/        # DPDP notice + revoke
│       ├── me/             # Trainee self-service (passport, gaps, jobs, chat)
│       │   └── chat/       # MSOL Sahayak full-screen assistant
│       └── settings/       # Language + demo reset
├── components/
│   ├── layout/             # Header, Sidebar, GuidedDemo
│   └── trainee/            # SahayakChat, SahayakFab
├── lib/
│   ├── ai/                 # Sahayak AI assistant & rule-based matcher
│   ├── types.ts            # Full TypeScript engineering data model
│   ├── seed.ts             # Engineering colleges, employers, trainees
│   ├── store.ts            # Zustand state management
│   ├── utils.ts            # Helpers
│   └── i18n.ts             # English/Marathi labels
└── styles/
    └── globals.css          # Design system + animations
```

## Tech Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** v4
- **Recharts** for data visualisation
- **Zustand** for demo state management
- **Lucide React** for icons
- No backend — all data seeded in-memory

## Key Engineering Seed Data Stories

1. **Pune Valley College of Engineering (Pune)** — Paper 82%, verified 90-day retention 41%, unverified campus staffing leads
2. **Government College of Engineering (Nashik)** — Paper 61%, verified 58%, honest institute with strong employer retention
3. **Rahul Kamble (B.E. CSE, MSOL-MH-0001)** — High syntax aptitude, gap in production SQL and DSA; matched to Persistent Systems SDE Intern
4. **Mechanical Engineering Curriculum Gap** — 55% of non-placed mechanical graduates lack SolidWorks and GD&T tolerance skills

## Organisation

**Government of Maharashtra** — Maharashtra State Innovation Society (MSINS)  
Department of Skills, Employment, Entrepreneurship and Innovation

---

*Prototype disclaimer: This is a demo for SIH 2026. No real government data is used. Privacy principles are aligned with DPDP Act, 2023.*
