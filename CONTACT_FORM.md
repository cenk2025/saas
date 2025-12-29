# Contact Form Configuration

## Overview
The Business VoonIQ platform now includes a professional contact form that sends emails using the Resend API.

## Features
- **Modern Design**: Glassmorphism effect with gradient backgrounds
- **Bilingual Support**: Finnish and English translations
- **Form Validation**: Required fields with proper error handling
- **Status Feedback**: Success and error messages
- **Responsive Layout**: Works on all device sizes
- **Email Notifications**: Sends formatted emails to info@voon.fi

## Setup Instructions

### 1. Add Resend API Key to Environment Variables

You need to add your Resend API key to your local environment file:

```bash
# Open your .env.local file (or create it if it doesn't exist)
# Add the following line:

RESEND_API_KEY="re_VCbkxcoV_9zW6hJub29uSPwPtL9gXXfLv"
```

**Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

### 2. For Vercel Deployment

When deploying to Vercel, add the environment variable:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_VCbkxcoV_9zW6hJub29uSPwPtL9gXXfLv`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Email Configuration

### Current Settings
- **From**: `Business VoonIQ <onboarding@resend.dev>`
- **To**: `info@voon.fi`
- **Subject**: `New Contact Form Submission from [Name]`

### Email Template
The email includes:
- Sender's name
- Sender's email (clickable mailto link)
- Company name (if provided)
- Message content
- Professional HTML formatting with Business VoonIQ branding

### Customizing the Email

To customize the email template, edit:
```
/app/api/contact/route.ts
```

You can modify:
- Email subject line
- HTML template styling
- Recipient email address
- From address (requires Resend domain verification)

## Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | Yes | Sender's full name |
| Email | Email | Yes | Sender's email address |
| Company | Text | No | Company name |
| Message | Textarea | Yes | Detailed message |

## API Endpoint

**POST** `/api/contact`

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "message": "I'm interested in your services..."
}
```

### Success Response (200)
```json
{
  "message": "Email sent successfully",
  "data": { ... }
}
```

### Error Response (400/500)
```json
{
  "error": "Error message"
}
```

## Translations

The contact form supports both Finnish and English. Translations are located in:
- `/messages/fi.json` - Finnish translations
- `/messages/en.json` - English translations

### Adding New Languages

1. Create a new translation file: `/messages/[locale].json`
2. Add the `contact` section with all required keys
3. Configure the locale in `next.config.ts`

## Testing the Form

### Local Testing

1. Ensure `RESEND_API_KEY` is set in `.env.local`
2. Navigate to `http://localhost:3000/fi` or `http://localhost:3000/en`
3. Scroll down to the "Business VoonIQ" contact form
4. Fill out the form and submit
5. Check `info@voon.fi` for the email

### Test Data
```
Name: Test User
Email: test@example.com
Company: Test Company
Message: This is a test message from the contact form.
```

## Troubleshooting

### Email Not Sending

**Check 1**: Verify API key is set
```bash
# In your terminal:
echo $RESEND_API_KEY
```

**Check 2**: Check server logs for errors
```bash
# Look for "Resend error:" in the terminal where npm run dev is running
```

**Check 3**: Verify Resend API key is valid
- Log in to [Resend Dashboard](https://resend.com/dashboard)
- Check API Keys section
- Ensure the key hasn't been revoked

### Form Not Appearing

**Check 1**: Verify component is imported
```tsx
// In app/[locale]/page.tsx
import ContactForm from '@/components/ContactForm'
```

**Check 2**: Check for console errors
- Open browser DevTools (F12)
- Look for errors in the Console tab

### Styling Issues

The form uses Tailwind CSS classes. If styles aren't applying:
1. Ensure Tailwind is properly configured
2. Check `tailwind.config.ts` includes the components directory
3. Restart the development server

## Security Considerations

- ✅ API key stored in environment variables (not in code)
- ✅ Server-side email sending (API key never exposed to client)
- ✅ Input validation on both client and server
- ✅ Rate limiting recommended for production (not yet implemented)

### Recommended: Add Rate Limiting

For production, consider adding rate limiting to prevent spam:

```bash
npm install @upstash/ratelimit @upstash/redis
```

## Component Location

- **Contact Form Component**: `/components/ContactForm.tsx`
- **API Route**: `/app/api/contact/route.ts`
- **Landing Page**: `/app/[locale]/page.tsx`

## Dependencies

```json
{
  "resend": "^latest"
}
```

## Support

For issues with:
- **Resend API**: Visit [Resend Documentation](https://resend.com/docs)
- **Contact Form**: Check this documentation or contact the development team
- **Email Delivery**: Check Resend dashboard for delivery logs
