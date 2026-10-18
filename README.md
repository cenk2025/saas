# Voon Business – AI workspace for SMEs

business.voon.fi is the business service of VOON IQ. It gives small and medium-sized
companies a secure AI co-worker in Finnish, Swedish and English.

## Features

- **AI tools** (`/tools`): quote writer, email assistant, social media posts, customer
  feedback analysis, job ad & interview kit, meeting minutes, automation finder, funding
  finder, contract review and an EU AI Act & GDPR check. Results stream in real time and
  can be saved to the shared library.
- **AI advisor** (`/advisor`): a chat that knows the company profile and the latest health check.
- **Business health check** (`/test`, `/results/[id]`): 12 questions, scores for five areas,
  three recommendations and a PDF report.
- **Company profile** (`/company`): context that every AI request uses.
- **Library** (`/library`): AI documents saved by the team.
- Languages: `fi` (default), `sv`, `en` via next-intl (`messages/*.json`).

Tool definitions live in `lib/ai/tool-catalog.ts` (fields, shared with the browser) and
`lib/ai/tool-prompts.ts` (server-only prompts). Adding a tool = one catalog entry, one prompt
and its labels in the three message files.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the Supabase, NextAuth and OpenAI values.
   Without `OPENAI_API_KEY` the app runs in demo mode with placeholder answers.
3. Database: run `supabase/schema.sql`, then `supabase/business_workspace.sql`
   (adds `companies.profile` and the `ai_documents` table used by the library).
4. `npm run dev`

## Tech stack

Next.js 16 (App Router, `proxy.ts`), TypeScript, Tailwind CSS v4, Supabase (Postgres + Auth),
NextAuth, OpenAI, Resend (contact form, see CONTACT_FORM.md), next-intl, Recharts, jsPDF.
