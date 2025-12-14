# Comprehensive SaaS Implementation Plan

## Phase 1: Billing & Subscriptions (Stripe)
- [ ] **Data Model**: Add `Subscription` and `Plan` models to Prisma.
- [ ] **Stripe Setup**: Configure Stripe Webhooks and Checkout sessions.
- [ ] **Pricing Page**: Create a pricing page with Free, Pro, and Enterprise tiers.
- [ ] **Gating**: Limit diagnostics/reports based on plan (e.g., Free = 1 report/month).

## Phase 2: Team & Multi-tenancy
- [ ] **Invitation System**: Allow admins to invite users via email (using Resend/SMTP).
- [ ] **Role Management**: Granular permissions (Viewer, Editor, Admin).
- [ ] **Company Settings**: Upload logo, change company name, billing email.

## Phase 3: Advanced Reporting & AI
- [ ] **Deep Analysis**: Use AI to compare current report vs previous month.
- [ ] **PDF Export**: Enhance PDF with charts and detailed branding.
- [ ] **History View**: Timeline view of all diagnostics.

## Phase 4: UX Polish
- [ ] **Onboarding Wizard**: Step-by-step setup for new companies.
- [ ] **Sidebar Navigation**: Replace top nav with a robust dashboard sidebar.
- [ ] **Notifications**: In-app notifications for new reports/invites.

## Architecture Updates
- **Database**: Add `Subscription`, `Invitation` tables.
- **Emails**: Integrate an email provider (Resend recommended).
- **Storage**: Supabase Storage for company logos.
