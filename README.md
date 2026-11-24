<div align="center">

# MSOL — Maharashtra Skilling Outcomes Ledger

**From certificate to livelihood: consent-based, longitudinal outcome tracking for Maharashtra's skilling ecosystem.**

![Smart India Hackathon 2026](https://img.shields.io/badge/SIH%202026-SIH26135-orange)
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![DPDP Aligned](https://img.shields.io/badge/Privacy-DPDP%20Act%202023-green)
![Status](https://img.shields.io/badge/Status-Prototype-blue)

</div>

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Key Features](#key-features)
- [MSOL Sahayak: AI Career Assistant](#msol-sahayak-ai-career-assistant)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Judge's 3-Minute Walkthrough](#judges-3-minute-walkthrough)
- [Seed Data Stories](#seed-data-stories)
- [Privacy and DPDP Compliance](#privacy-and-dpdp-compliance)
- [Roadmap](#roadmap)
- [Organisation](#organisation)
- [Disclaimer](#disclaimer)

---

## Overview

**MSOL** is a prototype built for **Smart India Hackathon 2026 (Problem Code: SIH26135)**. It is an *outcomes layer* that sits on top of existing training MIS systems and answers the questions that enrolment and certification data cannot:

> Did the trainee get a job? Are they still employed after 90 days? What do they earn? Why did they leave?

## The Problem

India's skilling ecosystem tracks **inputs**: enrolment, attendance, and certification. Almost nobody tracks **outcomes** in a systematic, verified way.

As a result:

- Placement numbers reported on paper are rarely verified against reality.
- Institutes with inflated claims look identical to honest ones.
- Curriculum gaps stay invisible to policymakers.
- Students who drop off after placement receive no support.

In our seed data, one engineering college reports **82% placement** but only **41% verified 90-day retention**. That gap is exactly what MSOL is designed to expose.

## Our Solution

MSOL adds a **verified, consent-based, longitudinal ledger** of what happens to a trainee after training:

1. **Capture** outcomes (job, self-employment, apprenticeship) at placement.
2. **Verify** with employers through magic-link confirmation.
3. **Follow up** at 30/90-day intervals via surveys, WhatsApp, and IVR (mocked in the prototype).
4. **Analyse** paper vs verified placement gaps, skill gaps, and institute performance.
5. **Act** through auto-generated policy briefs and personalised student roadmaps.

All of this runs under explicit trainee consent aligned with the **DPDP Act, 2023**.

## Key Features

| Area | What it does |
| --- | --- |
| **Role-aware dashboards** | Tailored KPI views for State Admin, District Officer, Training Provider, Employer, Counsellor, and Trainee |
| **Student 360° view** | Complete timeline of a trainee: placement, employer confirmation, follow-ups, escalations |
| **Institute scorecards** | Compares TPO "paper" placement vs verified 90-day retention for each engineering college |
| **Skill gaps heatmap** | Branch × skill matrix with remedial course cards |
| **Follow-up queue** | 30/90-day survey workflow with WhatsApp and IVR mocks |
| **Employer verification** | Magic-link flow for employers to confirm placement and retention |
| **Outcome capture** | Record job, self-employment, or apprenticeship outcomes |
| **Analytics** | Charts and filters with a "verified only" toggle |
| **Policy brief** | Auto-generated evidence brief for the Directorate of Technical Education (DTE) |
| **Skill Passport** | Unified, APAAR-linked passport with remedial matching and internship matches |
| **DPDP consent and privacy** | Multi-step consent onboarding, granular controls, and withdrawal |
| **Bilingual UI** | English and Marathi labels |

## MSOL Sahayak: AI Career Assistant

**MSOL Sahayak (सहायक)** is a privacy-first, offline-capable career assistant for engineering students in Maharashtra.

- **Role-gated:** available only to authenticated trainees (`/me/chat` and a floating widget). Other roles are redirected to `/dashboard`.
- **Grounded in official records:** answers come from the student's live MSOL record, including profile, TPO claim, employer confirmation status, missing competencies, next follow-up, and consent settings.
- **Zero paid LLM dependency:** uses deterministic intent extraction and local store evaluation. `npm run build` succeeds without any API keys or environment variables.
- **Branch-aware:** understands CSE (DSA, SQL, Persistent Systems), Mechanical (SolidWorks, GD&T, Tata Motors), and Civil (AutoCAD Civil, L&T).
- **DPDP compliant:** masks phone numbers and APAAR IDs, respects consent settings, and rejects out-of-scope queries.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| State management | Zustand |
| Icons | Lucide React |
| Data | Seeded in-memory (no backend in the prototype) |
| Deployment | Render (`render.yaml`) |

## Project Structure

```
.
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Login with 6 demo roles
│   │   ├── about/              # Problem statement and Phase 2
│   │   └── (app)/              # Protected app shell
│   │       ├── dashboard/      # Role-aware KPI dashboard
│   │       ├── trainees/       # Registry and [id] 360° view
│   │       ├── follow-ups/     # Queue, survey, WhatsApp/IVR mock
│   │       ├── employers/      # List and verify/[token] magic link
│   │       ├── outcomes/       # Capture job / self-employment / apprenticeship
│   │       ├── analytics/      # Charts, filters, verified toggle
│   │       ├── skill-gaps/     # Branch x skill heatmap, remedial cards
│   │       ├── providers/      # College scorecards and [id] detail
│   │       ├── policy/         # Auto-generated evidence brief for DTE
│   │       ├── consent/        # Multi-step DPDP onboarding
│   │       ├── privacy/        # DPDP notice and revoke
│   │       ├── me/             # Trainee self-service (passport, gaps, jobs, chat)
│   │       └── settings/       # Language and demo reset
│   ├── components/
│   │   ├── layout/             # Header, Sidebar, GuidedDemo
│   │   └── trainee/            # SahayakChat, SahayakFab
│   ├── lib/
│   │   ├── ai/                 # Sahayak assistant and rule-based matcher
│   │   ├── types.ts            # TypeScript data model
│   │   ├── seed.ts             # Colleges, employers, trainees
│   │   ├── store.ts            # Zustand store
│   │   ├── utils.ts            # Helpers
│   │   └── i18n.ts             # English / Marathi labels
│   └── styles/
│       └── globals.css         # Design system and animations
├── server.js
├── render.yaml                 # Render deployment config
├── next.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (version pinned in [`.node-version`](.node-version))
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohit-Sable/Maharashtra-Skilling-Outcomes-Ledger.git
cd Maharashtra-Skilling-Outcomes-Ledger

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Production Build

```bash
npm run build
```

No environment variables or external API keys are required.

## Demo Accounts

All demo accounts use the password **`demo123`**.

| Role | Email |
| --- | --- |
| State Admin | `admin@msol.demo` |
| District Officer | `district@msol.demo` |
| Training Provider | `provider@msol.demo` |
| Employer | `employer@msol.demo` |
| Counsellor | `counsellor@msol.demo` |
| Trainee | `trainee@msol.demo` |

> **Trainee OTP:** any 6-digit number works.

## Judge's 3-Minute Walkthrough

1. **Landing page:** see SIH26135 and the **80% → 42%** placement-to-retention punchline.
2. **Login as Admin:** use the quick-login button and view the paper vs verified placement gap across engineering colleges.
3. **Institute Scorecard:** open *Pune Valley College of Engineering* (82% TPO paper vs 41% verified 90-day retention).
4. **Student 360°:** open student `MSOL-MH-0005`, who vacated the hostel, changed phone, and triggered a counsellor escalation.
5. **Skill Gaps Heatmap:** Mechanical graduates lack SolidWorks and GD&T; CSE students lack SQL and DSA.
6. **Student login** (`trainee@msol.demo`): meet Rahul Kamble (B.E. Computer Engineering, Pune).
7. **MSOL Sahayak:** ask *"What skills am I missing for an SDE / campus IT role?"* and follow the link to `/me/roadmap`.
8. **Skill Passport and Roadmaps:** APAAR-linked passport, NPTEL remedial matching, and a Persistent Systems GET internship match.
9. **Privacy and DPDP:** granular consent controls and the withdrawal mechanism.

## Seed Data Stories

| # | Story | Insight |
| --- | --- | --- |
| 1 | **Pune Valley College of Engineering** | Paper 82%, verified 90-day retention 41%, unverified campus staffing leads |
| 2 | **Government College of Engineering, Nashik** | Paper 61%, verified 58%: an honest institute with strong employer retention |
| 3 | **Rahul Kamble** (B.E. CSE, `MSOL-MH-0001`) | High syntax aptitude, gaps in production SQL and DSA; matched to Persistent Systems SDE Intern |
| 4 | **Mechanical curriculum gap** | 55% of non-placed mechanical graduates lack SolidWorks and GD&T tolerance skills |

## Privacy and DPDP Compliance

MSOL is designed around the principles of the **Digital Personal Data Protection Act, 2023**:

- Explicit, multi-step **consent** before any outcome tracking.
- **Granular controls** over what is shared and with whom.
- Easy **withdrawal** of consent.
- **Masking** of sensitive identifiers (phone numbers, APAAR IDs).
- Purpose-limited AI assistant that refuses out-of-scope queries.

## Roadmap

- [ ] Replace in-memory seed data with a persistent database
- [ ] Integrate with live training MIS and APAAR
- [ ] Real WhatsApp / IVR follow-up delivery
- [ ] Employer onboarding at scale
- [ ] Expand beyond engineering colleges to ITIs and other skilling programmes
- [ ] Full Marathi localisation

## Organisation

**Government of Maharashtra** — Maharashtra State Innovation Society (MSINS)
Department of Skills, Employment, Entrepreneurship and Innovation

## Disclaimer

This is a **prototype built for SIH 2026**. No real government data is used. All names, institutions, and figures are fictional seed data. Privacy principles are aligned with the DPDP Act, 2023.

---

<div align="center">

Built for Smart India Hackathon 2026

</div>
