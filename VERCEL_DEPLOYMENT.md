# Vercel Deployment Guide

## Environment Variables Setup

This application requires the following environment variables to be configured in Vercel:

### Required Variables

1. **Supabase Configuration**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Database (Supabase PostgreSQL)**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres
   ```

3. **NextAuth**
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```
   Generate a secure secret with: `openssl rand -base64 32`

4. **OpenAI API (GPT-4o-mini)**
   ```
   OPENAI_API_KEY=sk-your-openai-api-key
   ```
   Get your API key from: https://platform.openai.com/api-keys

### Optional Variables

5. **Stripe (for billing features)**
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add each variable:
   - **Key**: Variable name (e.g., `OPENAI_API_KEY`)
   - **Value**: Your actual value
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
5. Click **Save**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add OPENAI_API_KEY
# Then paste your API key when prompted

# Add for production
vercel env add OPENAI_API_KEY production

# Add for preview
vercel env add OPENAI_API_KEY preview
```

### Method 3: Import from .env file

1. Create a `.env.production` file locally with all your variables
2. In Vercel Dashboard → Settings → Environment Variables
3. Click **Add New** → **Import .env**
4. Upload your `.env.production` file

## Important Security Notes

⚠️ **NEVER commit API keys to Git**
- The `.env.local` file is already in `.gitignore`
- Always use environment variables for sensitive data
- Use different API keys for development and production

⚠️ **OpenAI API Key Security**
- Only add the `OPENAI_API_KEY` in Vercel (production)
- Do NOT add it to your local `.env.local` for development
- The app will use mock data when no API key is present (development mode)

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Remove DeepSeek, use OpenAI GPT-4o-mini"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click **Add New Project**
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all required environment variables (see above)
   - Make sure to add `OPENAI_API_KEY` for production

4. **Deploy**
   - Click **Deploy**
   - Vercel will automatically build and deploy your app

5. **Verify Deployment**
   - Test the diagnostic feature
   - Check that AI analysis works correctly
   - Monitor Vercel logs for any errors

## AI Model Information

This application uses **OpenAI GPT-4o-mini** for:
- Business diagnostic analysis (`/api/analyze`)
- AI advisory chat (`/api/chat`)

**Why GPT-4o-mini?**
- ✅ Cost-effective (90% cheaper than GPT-4)
- ✅ Fast response times
- ✅ High quality for business analysis
- ✅ JSON mode support
- ✅ Good reasoning capabilities

**Estimated Costs:**
- Diagnostic analysis: ~$0.001-0.003 per analysis
- Chat messages: ~$0.0001-0.0005 per message

## Monitoring API Usage

Monitor your OpenAI API usage at:
https://platform.openai.com/usage

Set up usage limits to prevent unexpected charges:
https://platform.openai.com/account/billing/limits

## Troubleshooting

### "Unauthorized" error
- Check that `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL

### "Failed to submit analysis" error
- Verify `OPENAI_API_KEY` is correctly set in Vercel
- Check OpenAI API key has sufficient credits
- Review Vercel function logs for detailed errors

### Database connection errors
- Verify all Supabase environment variables are correct
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
- Ensure database URL includes the correct password

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- OpenAI API Docs: https://platform.openai.com/docs
- Supabase Docs: https://supabase.com/docs
