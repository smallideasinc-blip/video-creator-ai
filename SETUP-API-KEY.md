# API Key Setup Guide

## Getting Your Claude API Key

1. Go to https://console.anthropic.com/
2. Sign in with your Anthropic account (create one if needed)
3. Navigate to the **API Keys** section
4. Click **Create Key** or copy an existing key
5. Copy the key (starts with `sk-ant-`)

## Adding the Key to .env

1. Open `.env` file in this directory
2. Replace the placeholder:
   ```
   CLAUDE_API_KEY=your-api-key-here-from-console.anthropic.com
   ```
   with your actual key:
   ```
   CLAUDE_API_KEY=sk-ant-... (your copied key)
   ```
3. Save the file
4. **Do NOT commit this file to git** — it contains sensitive credentials

## Verify the Setup

Run the server and test:
```bash
npm start
```

Visit http://localhost:3000 and click "Générer Script" to verify the API key works.

## Troubleshooting

- **401 authentication_error**: The API key is invalid or expired. Double-check it was copied correctly.
- **Rate limit errors**: Your API key may have exceeded its quota. Check console.anthropic.com for usage details.
- **503 error**: CLAUDE_API_KEY is not configured. Make sure it's in your .env file.
