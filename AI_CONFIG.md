# AI Configuration

## Current AI Provider: OpenAI GPT-4o-mini

This application uses **OpenAI's GPT-4o-mini** model for all AI-powered features.

### Features Using AI

1. **Business Diagnostic Analysis** (`/api/analyze`)
   - Analyzes company diagnostic test responses
   - Generates comprehensive business health reports
   - Provides category scores, strengths, weaknesses, and recommendations
   - Model: `gpt-4o-mini`
   - Response format: JSON

2. **AI Business Advisory Chat** (`/api/chat`)
   - Interactive chat with AI business advisor
   - Context-aware responses based on diagnostic reports
   - Personalized business guidance
   - Model: `gpt-4o-mini`

### Why GPT-4o-mini?

- **Cost-Effective**: ~90% cheaper than GPT-4 Turbo
  - Input: $0.150 per 1M tokens
  - Output: $0.600 per 1M tokens
- **Fast**: Low latency responses
- **Capable**: Excellent for business analysis and advisory tasks
- **Reliable**: Supports JSON mode for structured outputs

### Configuration

Set the OpenAI API key as an environment variable:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

**For Production (Vercel):**
- Add `OPENAI_API_KEY` in Vercel Dashboard → Settings → Environment Variables
- Never commit API keys to Git

**For Development:**
- The app will use mock data when no API key is present
- This allows development without API costs

### API Usage Estimates

**Per Diagnostic Analysis:**
- Average tokens: ~2,000-3,000 total
- Cost: ~$0.001-0.003 per analysis

**Per Chat Message:**
- Average tokens: ~500-1,000 total
- Cost: ~$0.0001-0.0005 per message

**Monthly estimates (for 1,000 users):**
- 1,000 diagnostic tests: ~$2-3
- 5,000 chat messages: ~$0.50-2.50
- **Total: ~$2.50-5.50/month**

### Monitoring & Limits

**Monitor Usage:**
https://platform.openai.com/usage

**Set Usage Limits:**
https://platform.openai.com/account/billing/limits

**Recommended Limits:**
- Soft limit: $50/month
- Hard limit: $100/month

### Error Handling

The application gracefully handles API errors:
- If API key is missing: Uses mock data (development mode)
- If API call fails: Returns appropriate error message
- If rate limited: Returns 429 status with retry message

### Security Best Practices

✅ **DO:**
- Store API key in environment variables only
- Use different keys for dev/staging/prod
- Monitor usage regularly
- Set spending limits
- Rotate keys periodically

❌ **DON'T:**
- Commit API keys to Git
- Share API keys in chat/email
- Use production keys in development
- Expose keys in client-side code

### Alternative Models (Future)

If you want to switch models in the future, update these files:
- `/app/api/analyze/route.ts` (line 53)
- `/app/api/chat/route.ts` (line 55)

Available OpenAI models:
- `gpt-4o-mini` (current, recommended)
- `gpt-4o` (more capable, more expensive)
- `gpt-4-turbo` (legacy, being phased out)
- `gpt-3.5-turbo` (cheaper, less capable)

### Support

- OpenAI API Documentation: https://platform.openai.com/docs
- OpenAI API Status: https://status.openai.com
- OpenAI Support: https://help.openai.com
