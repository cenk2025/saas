# ClarityAI - AI-Powered SaaS Platform

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   This project uses PostgreSQL + Prisma.
   - Ensure you have a PostgreSQL database running.
   - Update `.env` with your `DATABASE_URL`.
   - Run migrations (Prisma 7):
     ```bash
     npx prisma migrate dev
     ```
   - Seed the database (admin/users):
     ```bash
     npx prisma db seed
     ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Login Credentials (Seed Data)

- **Admin**: `admin@clarity.ai` / `password123`
- **Manager (Company A)**: `manager1@corpA.com` / `password123`
- **Employee (Company A)**: `emp1@corpA.com` / `password123`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (v4)
- **AI**: OpenAI GPT-4 Turbo
