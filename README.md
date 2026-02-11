# OpenRouter Traces Dashboard

A lightweight, full-stack dashboard for browsing and inspecting LLM traces stored in Cloudflare R2. Built on **Cloudflare Workers** with zero external dependencies.

![Light Theme](https://img.shields.io/badge/theme-light-white) ![Cloudflare Workers](https://img.shields.io/badge/runtime-Cloudflare%20Workers-F38020) ![R2](https://img.shields.io/badge/storage-Cloudflare%20R2-F38020) ![TypeScript](https://img.shields.io/badge/lang-TypeScript-3178C6)

---

## Features

- **Password-protected** — Single shared password stored as a Cloudflare secret (HMAC-signed tokens, 24h TTL)
- **Browse by date** — Traces are organized by date directories (`openrouter-traces/YYYY-MM-DD/`)
- **Paginated summaries** — See model, tokens, cost, duration, and finish reason at a glance
- **Search & filter** — Client-side filtering by model, API key, provider, or trace ID
- **Trace detail view** — Full conversation history, cost breakdown, tool definitions, token details, and raw JSON
- **Stats dashboard** — Total traces, cost, tokens, and average duration per page
- **Modern light UI** — Clean, responsive design with Inter font — no dark mode, no clutter
- **Zero build step** — Pure HTML/CSS/JS frontend served as static assets

## Architecture

```
┌──────────────────────────────────────┐
│         Cloudflare Worker            │
│                                      │
│  POST /api/login      → Auth         │
│  GET  /api/dates      → List dates   │
│  GET  /api/summaries  → Paginated    │
│  GET  /api/trace      → Full trace   │
│  GET  /*              → Static SPA   │
│                                      │
│  Bindings:                           │
│    TRACES_BUCKET  → R2 bucket        │
│    ASSETS         → Static files     │
│    DASHBOARD_PASSWORD → Secret       │
└──────────────────────────────────────┘
```

## R2 Bucket Structure

```
openrouter-logs/                          ← R2 bucket
  openrouter-traces/                      ← prefix
    2026-02-10/
      gen-xxx-abc-123456.json
      gen-yyy-def-789012.json
    2026-02-11/
      gen-zzz-ghi-345678.json
```

Each `.json` file contains a trace object with:
- **Trace metadata** — ID, timestamp, source, API key name
- **Input messages** — Full conversation (system, user, assistant, tool)
- **Output** — Completion text, reasoning, raw request config
- **Observations** — Model, tokens, cost, duration, provider, finish reason

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm i -g wrangler`)
- A Cloudflare account with an R2 bucket named `openrouter-logs`

### Install

```bash
git clone https://github.com/YOUR_USER/openrouter-r2-traces-frontend.git
cd openrouter-r2-traces-frontend
npm install
```

### Configure the secret

```bash
npx wrangler secret put DASHBOARD_PASSWORD
# Enter your desired dashboard password when prompted
```

### Local development

```bash
# Create a .dev.vars file for local secrets
echo DASHBOARD_PASSWORD=your-local-password > .dev.vars

npm run dev
# → http://localhost:8787
```

### Deploy

```bash
npm run deploy
```

### Generate types (after changing wrangler.jsonc)

```bash
npm run cf-typegen
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/login` | No | Authenticate with password, returns token |
| `GET` | `/api/dates` | Yes | List available date directories |
| `GET` | `/api/summaries?date=YYYY-MM-DD&page=1&pageSize=20` | Yes | Paginated trace summaries |
| `GET` | `/api/trace?key=openrouter-traces/...` | Yes | Full trace JSON |

All authenticated endpoints require `Authorization: Bearer <token>` header.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Storage**: Cloudflare R2
- **Language**: TypeScript (backend), Vanilla JS (frontend)
- **Styling**: Custom CSS with CSS variables, Inter font
- **Auth**: HMAC-SHA256 signed tokens
- **Build**: None — Wrangler handles everything

## License

MIT
