# Skill Issue

A therapeutic service for job seekers who prefer to skip the wait for rejection.

Enter a company name, job title, and your email. Click "I Have Hope." Receive a corporate-parody rejection email 2-48 hours later.

## Stack

- Cloudflare Workers (API + scheduled jobs)
- Cloudflare D1 (SQLite database)
- Cloudflare Pages (static frontend)
- Resend (email)

## Local Development

```bash
# Install dependencies
bun install

# Create local D1 database
bunx wrangler d1 execute skill-issue-db --local --file=schema.sql

# Set up environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your Resend API key

# Run dev server (syncs design-system CSS into public/css first)
bun run dev

# Test scheduled job (sends pending emails)
# Visit http://localhost:8787/__scheduled
```

## Deployment

```bash
# Create D1 database
bunx wrangler d1 create skill-issue-db
# Update database_id in wrangler.toml

# Apply schema to production
bunx wrangler d1 execute skill-issue-db --file=schema.sql

# Set Resend API key
bunx wrangler secret put RESEND_API_KEY

# Deploy (syncs design-system CSS into public/css first)
bun run deploy
```

## Email Setup

Resend requires a verified domain to send from a custom address. For testing, use `onboarding@resend.dev` as the from address in `src/email.ts`.
