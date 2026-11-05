# HR Verse – AI-Powered Human Resource Management LMS

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20SSR%20Auth-3ecf8e?logo=supabase)](https://supabase.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20API-Llama%203.1%2070B-f55036)](https://groq.com/)
[![Resend](https://img.shields.io/badge/Resend-Email%20Automation-000000)](https://resend.com/)

**HR Verse** is a full-stack, enterprise-grade AI-powered Human Resource Management Learning Management System. Engineered for aspiring people leaders and HR executives, it bridges the gap between academic theory, empirical organizational research, and strategic workplace execution.

---

## 🌟 Key Application Experiences

The platform provides three distinct, decoupled role-based user experiences:

### 1. Public Marketing Website `(marketing)`
- **Hero & Value Proposition**: Overview of the 8-week executive CHRMP certification.
- **Curriculum Roadmap**: Comprehensive week-by-week syllabus breakdown derived from empirical reference materials.
- **About the Program**: Educational philosophy, SHRM / HRCI / WorldatWork alignment, and AI-enabled pedagogy.
- **Authentication**: Modern, validated login, student registration, and password recovery.

### 2. Student Learning Application `(student)` — `/dashboard`
- **Dashboard**: Real-time progress percentage, completed modules, quiz score averages, and active streak.
- **Interactive Course Roadmap**: Visual milestone timeline across the 8-week curriculum.
- **Learning Workspace (`/learn`)**: Rich-text modular lesson viewer with headings, paragraphs, callout boxes, definitions, and examples.
- **Quiz Engine (`/quizzes`)**: Timed, multiple-choice knowledge checks with instant server-side scoring, pass/fail thresholds (70%), and in-depth explanations.
- **Case Assessments (`/assessments`)**: Written scenario turnaround briefs (e.g., *ApexLogix Technologies 12-Month HR Roadmap*, *NovaHealth Clinical Retention Crisis*) with standardized rubrics.
- **Capstone Portfolios (`/projects`)**: Real-world executive deliverables (*HR Compliance & Equal Pay Audit*, *Digital HR Transformation & People Analytics Blueprint*).
- **Performance Analytics (`/analytics`)**: Recharts visualizations for quiz trajectories, study hours, and instant AI-generated diagnostic recommendations.
- **Groq-Powered AI Mentor**: Floating 24/7 AI learning assistant trained on strategic HRM concepts (Schmidt & Hunter validity, STAR interviewing, compa-ratios, BARS, ADDIE, Knowles' andragogy).

### 3. Administrative Content Management System — `/admin`
- **Executive Admin Dashboard**: Real-time telemetry populated strictly from actual database records (total students, active learners, completion rates, quiz pass rates, students falling behind, and activity trends).
- **Student Management (`/admin/students`)**: Search and filter students by progress tier, view individual performance dossiers, and generate Groq AI pedagogical diagnosis.
- **Course & Module Management (`/admin/courses`, `/admin/modules`)**: Full CRUD over courses, modules, parts, and publication toggles.
- **Rich-Text Lesson Editor (`/admin/lessons/[id]/edit`)**: Author and modify lessons with modular blocks (Headings, Paragraphs, Lists, Callouts, Definitions, Examples). Updates preserve existing student progress.
- **Reference Content Ingestion Engine**: Automated parser ingesting raw TXT course materials from `reference-content/` into structured database lessons.
- **Quiz & Assessment Configuration (`/admin/quizzes`, `/admin/assessments`)**: Configure passing thresholds, attempt limits, question pools, and rubrics.
- **Grading & Evaluation Queue (`/admin/submissions`)**: Evaluate submitted student case analyses and capstones, assign scores (0-100), and write qualitative feedback.
- **Automated Email Reminders (`/admin/emails`)**: Resend-powered campaign dispatcher for due dates, pending quizzes, and inactivity re-engagement.
- **Platform Settings (`/admin/settings`)**: Configure academic policies, pass thresholds, and monitor infrastructure health.

---

## 🏗️ Architecture & Security Model

```
HR-VERSE/
├── reference-content/          # Comprehensive HR course text files
│   ├── COURSE_OVERVIEW.txt
│   ├── COURSE_ROADMAP.txt
│   ├── WEEK_01/
│   │   ├── MODULE_01_INTRODUCTION_TO_HRM.txt
│   │   ├── MODULE_02_HR_PLANNING.txt
│   │   ├── MODULE_03_RECRUITMENT.txt
│   │   └── QUIZ_WEEK_01.txt
│   ├── WEEK_02/
│   │   ├── MODULE_04_COMPENSATION.txt
│   │   ├── MODULE_05_PERFORMANCE_MGMT.txt
│   │   ├── MODULE_06_TRAINING.txt
│   │   └── QUIZ_WEEK_02.txt
│   ├── ASSESSMENTS/
│   │   ├── ASSESSMENT_01_HR_STRATEGY.txt
│   │   └── ASSESSMENT_02_CASE_STUDY.txt
│   └── PROJECTS/
│       ├── PROJECT_01_HR_AUDIT.txt
│       └── PROJECT_02_HR_TRANSFORMATION.txt
│
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Public website routes
│   │   ├── (auth)/             # Login, register, forgot-password
│   │   ├── (student)/          # Student learning workspace & dashboards
│   │   ├── admin/              # Role-gated administrative suite
│   │   └── api/                # Groq AI, email automation, ingestion APIs
│   │
│   ├── actions/                # Authenticated Next.js Server Actions
│   │   ├── auth.ts
│   │   ├── learning.ts
│   │   └── admin.ts
│   │
│   ├── components/
│   │   ├── ui/                 # 30+ shadcn/ui accessible components
│   │   └── layout/             # Navigation bars, sidebars, AI modal
│   │
│   ├── lib/
│   │   ├── supabase/           # Server, Client, Admin & Proxy handlers
│   │   ├── groq/               # Groq SDK AI completions
│   │   ├── resend/             # Resend email client
│   │   ├── analytics/          # Database metric aggregators
│   │   └── content/            # Reference content parser & ingestion
│   │
│   ├── proxy.ts                # Next.js 16 Proxy (auth session refresh)
│   └── types/                  # Strict TypeScript schemas
│
└── supabase/
    ├── migrations/             # Full PostgreSQL schema with RLS policies
    └── seed.sql                # Seed data with courses, modules, lessons, quizzes
```

### Security Highlights
- **Server-Side Authentication**: Implements `@supabase/ssr` with secure cookie session rotation.
- **Server-Side Authorization**: Role-based access control (`student` vs. `admin`). Admin privileges cannot be acquired via public registration. Every administrative Server Action and API endpoint asserts admin credentials server-side.
- **Supabase Row Level Security (RLS)**: Enforced across all 14 database tables. Students can only read and mutate their own progress, submissions, and attempts.
- **Zero Client Credential Leakage**: Service role keys, Groq API keys, and Resend credentials execute strictly in isolated server environments.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- pnpm 10+
- Supabase project (PostgreSQL + Auth)
- Groq Cloud API Key
- Resend API Key

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Subroto-Datta/hrverse.git
cd hrverse

# Install dependencies
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Groq Cloud AI
GROQ_API_KEY=gsk_your_groq_api_key

# Resend Email
RESEND_API_KEY=re_your_resend_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Execute the migration and seed files in your Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql` (Creates all tables, indexes, triggers, and RLS policies)
2. `supabase/seed.sql` (Seeds the CHRMP course, 2 modules, 4 parts, 6 lessons, 2 quizzes, 2 assessments, and 2 capstones)

### 5. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Educational Accreditation & Syllabus Alignment
- **SHRM BASK**: Strategic Knowledge, People Strategy, Total Rewards, Employee Relations.
- **HRCI PHR/SPHR**: Business Management, Workforce Planning, Talent Development.
- **WorldatWork**: Total Rewards Model, Point-Factor Job Evaluation, Compa-Ratio Structures.
- **Instructional Design**: ADDIE Framework, Malcolm Knowles' Andragogy, Kirkpatrick Levels 1-4, Jack Phillips ROI.
