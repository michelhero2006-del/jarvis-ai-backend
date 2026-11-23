# JARVIS AI Backend

Cloudflare Worker backend using OpenAI for chat and fal.ai for image/video generation.

## Cloudflare deployment
1. Connect this GitHub repository to Cloudflare Workers.
2. This is a plain Worker project. Leave Build command empty and set Deploy command to `npx wrangler deploy`.
3. Add Worker secrets `OPENAI_API_KEY` and `FAL_KEY` in Settings → Variables and Secrets.
4. Redeploy after saving secrets.

## Endpoints
- GET / or /health — health check
- POST /api/chat — JSON { "message": "Hello", "history": [] }
- POST /api/image — JSON { "prompt": "A futuristic city" }
- POST /api/video — JSON { "prompt": "A cinematic flying car" }

Optional variable: FAL_VIDEO_MODEL selects a fal.ai queue model. Verify model availability and pricing in your fal.ai account.

Never commit API keys or .env files. API use may incur charges. Android app integration and end-to-end testing are still required.
