# DeepSeek AI Integration

This project supports both OpenAI and DeepSeek AI APIs for business analysis and advisory features.

## Why DeepSeek?

- **Cost-Effective**: DeepSeek is significantly cheaper than OpenAI GPT-4
- **Compatible**: Uses OpenAI-compatible API format
- **Performance**: Competitive quality for business analysis tasks

## Setup

1. Get your DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com)
2. Add to your `.env` file:
   ```bash
   DEEPSEEK_API_KEY="sk-your-key-here"
   ```

## Priority

The system checks for API keys in this order:
1. `DEEPSEEK_API_KEY` (if set, uses DeepSeek)
2. `OPENAI_API_KEY` (fallback to OpenAI)
3. Mock data (if neither is set)

## Models Used

- **DeepSeek**: `deepseek-chat` (when DEEPSEEK_API_KEY is set)
- **OpenAI**: `gpt-4-turbo-preview` (when OPENAI_API_KEY is set)

## Features Using AI

1. **Diagnostic Analysis** (`/api/analyze`): Analyzes company questionnaire responses
2. **AI Advisor Chat** (`/api/chat`): Interactive business advisory chatbot
