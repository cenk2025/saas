# Contact Form Configuration

## Overview
The Business VoonIQ platform includes a professional contact form with **AI-powered auto-response** using n8n workflow automation and Brevo email service.

## Features
- **Modern Design**: Glassmorphism effect with gradient backgrounds
- **Bilingual Support**: Finnish and English translations
- **AI Auto-Response**: Gemini AI generates personalized responses in Finnish
- **Dual Email System**: 
  - Customer receives AI-generated response
  - Admin receives notification with form details
- **Form Validation**: Required fields with proper error handling
- **Status Feedback**: Success and error messages
- **Responsive Layout**: Works on all device sizes

## Architecture

```
Contact Form → Next.js API → n8n Webhook → Gemini AI → Brevo Email
```

### Workflow Steps:
1. User submits contact form
2. Next.js API validates and forwards to n8n webhook
3. n8n triggers Gemini AI to generate personalized Finnish response
4. n8n sends two emails via Brevo:
   - AI response to customer
   - Notification to admin (info@voon.fi)

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local` file:

```bash
N8N_WEBHOOK_URL="https://vooniq.app.n8n.cloud/webhook/contact-form-ai"
```

**Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

### 2. For Vercel Deployment

When deploying to Vercel, add the environment variable:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `N8N_WEBHOOK_URL`
   - **Value**: `https://vooniq.app.n8n.cloud/webhook/contact-form-ai`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## n8n Workflow Configuration

### Workflow Structure:
```
[Webhook] → [Gemini AI] → [Brevo Email 1 - Customer]
                        → [Brevo Email 2 - Admin]
```

### Webhook Node:
- **URL**: `https://vooniq.app.n8n.cloud/webhook/contact-form-ai`
- **Method**: POST
- **Authentication**: None (public webhook)

### Gemini AI Node:
- **Model**: Gemini 1.5 Flash
- **Prompt**: Generates personalized Finnish response based on customer message
- **Output**: Professional email content in HTML format

### Brevo Email Nodes:

#### Email 1 (Customer):
- **From**: `info@voon.fi` (Business VoonIQ)
- **To**: Customer's email from form
- **Subject**: "Thank you for contacting Business VoonIQ"
- **Content**: AI-generated response in Finnish

#### Email 2 (Admin):
- **From**: `info@voon.fi`
- **To**: `info@voon.fi`
- **Subject**: "New Contact: [Customer Name]"
- **Content**: Form details (name, email, company, message)

## Email Configuration

### Brevo Setup:
1. Create account at https://www.brevo.com/
2. Verify sender email: `info@voon.fi`
3. Generate API key
4. Configure in n8n Brevo nodes

### Current Settings:
- **Sender**: `info@voon.fi` (Business VoonIQ)
- **Admin Recipient**: `info@voon.fi`
- **Customer Recipient**: Dynamic (from form submission)

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
  "message": "Message sent successfully. You will receive an AI-powered response shortly.",
  "success": true
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

1. Ensure `N8N_WEBHOOK_URL` is set in `.env.local`
2. Navigate to `http://localhost:3000/fi` or `http://localhost:3000/en`
3. Scroll down to the "Business VoonIQ" contact form
4. Fill out the form and submit
5. Check email for:
   - AI-generated response (to your email)
   - Admin notification (to info@voon.fi)

### Test Data
```
Name: Test User
Email: info@voon.fi
Company: Test Company
Message: Haluaisin tietää lisää AI-ratkaisuistanne.
```

## Troubleshooting

### Email Not Sending

**Check 1**: Verify n8n webhook URL is set
```bash
# In your terminal:
echo $N8N_WEBHOOK_URL
```

**Check 2**: Check server logs for errors
```bash
# Look for "n8n webhook error:" in the terminal where npm run dev is running
```

**Check 3**: Verify n8n workflow is active
- Log in to n8n dashboard
- Check workflow status (should be green/active)
- Test workflow manually

**Check 4**: Check Brevo sender verification
- Log in to Brevo dashboard
- Verify `info@voon.fi` is verified
- Check email delivery logs

### Form Not Appearing

**Check 1**: Verify component is imported
```tsx
// In app/[locale]/page.tsx
import ContactForm from '@/components/ContactForm'
```

**Check 2**: Check for console errors
- Open browser DevTools (F12)
- Look for errors in the Console tab

### n8n Webhook Not Responding

**Check 1**: Verify workflow is published and active
- n8n workflows must be both saved AND activated
- Check the toggle switch in n8n dashboard

**Check 2**: Test webhook directly
```bash
curl -X POST https://vooniq.app.n8n.cloud/webhook/contact-form-ai \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

## Security Considerations

- ✅ No API keys in client-side code
- ✅ Server-side webhook forwarding only
- ✅ Input validation on both client and server
- ✅ n8n webhook is public but only accepts POST requests
- ⚠️ Rate limiting recommended for production (not yet implemented)

### Recommended: Add Rate Limiting

For production, consider adding rate limiting to prevent spam:

```bash
npm install @upstash/ratelimit @upstash/redis
```

## Component Location

- **Contact Form Component**: `/components/ContactForm.tsx`
- **API Route**: `/app/api/contact/route.ts`
- **Landing Page**: `/app/[locale]/page.tsx`
- **n8n Workflow**: `Contact Form AI Auto-Response` (n8n cloud)

## Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0"
  }
}
```

**Note**: No additional npm packages required. Email sending is handled by n8n + Brevo.

## n8n Workflow Maintenance

### Updating AI Prompt:
1. Open n8n workflow
2. Click on "Message a model" (Gemini AI) node
3. Edit the system prompt
4. Save and publish

### Changing Email Templates:
1. Open n8n workflow
2. Click on Brevo email nodes
3. Edit HTML content or subject
4. Save and publish

### Monitoring:
- n8n dashboard shows execution history
- Brevo dashboard shows email delivery logs
- Check both for troubleshooting

## Support

For issues with:
- **n8n Workflow**: Check n8n execution logs
- **Brevo Email**: Visit [Brevo Dashboard](https://app.brevo.com/)
- **Contact Form**: Check this documentation or server logs
- **AI Responses**: Adjust Gemini AI prompt in n8n workflow
