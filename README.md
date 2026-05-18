# AgentHub Landing

Static landing page + email waitlist that writes leads into a monday.com board.

Two deployment modes share the same frontend:
- **Local dev** — Express server (`server.js`) serves `index.html` and exposes `/api/leads` + `/api/health`.
- **Production (Netlify)** — `index.html` is served as a static file; `/api/leads` and `/api/health` are Netlify Functions. The frontend stays unchanged because `netlify.toml` rewrites `/api/*` to `/.netlify/functions/*`.

## Project structure

```
.
├── index.html                       # landing page (uses fetch('/api/leads'))
├── server.js                        # local Express dev server
├── netlify.toml                     # Netlify build + rewrite rules
├── netlify/functions/
│   ├── leads.js                     # POST /api/leads → creates monday item
│   └── health.js                    # GET  /api/health
├── scripts/board-debug.js           # discovers monday column IDs
├── .env.example                     # copy to .env for local dev
└── package.json
```

## Local development

```bash
npm install
cp .env.example .env       # fill in MONDAY_API_TOKEN
npm run dev                # Express on http://localhost:3000
```

Open `http://localhost:3000` (not the `file://` path — the form's `fetch('/api/leads')` needs a server).

To test Netlify Functions locally with the same `/api/*` routing as production:
```bash
npm install -g netlify-cli      # one-time
npm run netlify:dev             # http://localhost:8888
```

### Discover monday column IDs

```bash
npm run debug:board
```
Paste the returned column IDs into `.env` (and later into Netlify env vars).

## Deploy to Netlify

### 1. Push to GitHub

```bash
cd "/Users/tom/waiting list"
git init
git add .
git commit -m "AgentHub landing + Netlify functions"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

Verify `.env` is **not** in the commit (it's in `.gitignore`).

### 2. Create the Netlify site

1. Go to https://app.netlify.com → **Add new site → Import an existing project**.
2. Connect GitHub and pick your repo.
3. Build settings — Netlify reads these from `netlify.toml`, but confirm:
   - **Build command:** leave empty (no build step)
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`
4. Click **Deploy**.

### 3. Add environment variables

In the Netlify site dashboard → **Site settings → Environment variables → Add a variable**:

| Key | Value |
|---|---|
| `MONDAY_API_TOKEN` | your real monday API token |
| `MONDAY_BOARD_ID` | `5096679020` |
| `MONDAY_COL_EMAIL` | from `npm run debug:board` |
| `MONDAY_COL_SOURCE` | from `npm run debug:board` (optional) |
| `MONDAY_COL_STATUS` | from `npm run debug:board` (optional) |
| `MONDAY_COL_CREATED_AT` | from `npm run debug:board` (optional) |
| `MONDAY_STATUS_LABEL` | `New Lead` |

Trigger a redeploy after adding them (**Deploys → Trigger deploy → Deploy site**) so the functions pick up the new env vars.

### 4. Verify the deployment

Replace `<your-site>` with your Netlify URL (e.g. `agenthub.netlify.app`):

```bash
# Health check
curl https://<your-site>/api/health
# → {"ok":true,"message":"Server is running"}

# Submit a real lead
curl -X POST https://<your-site>/api/leads \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# → {"ok":true,"item":{"id":"...","name":"test@example.com"}}
```

Then open `https://<your-site>` in a browser and submit the waitlist form. The item should appear in monday board **5096679020**.

### 5. Connect a custom domain

1. **Netlify side** — Site settings → **Domain management → Add a domain** → enter your domain (e.g. `agenthub.com`). Netlify shows the DNS records you need.
2. **At your DNS provider** (Namecheap, Cloudflare, GoDaddy, etc.):
   - **Apex domain (`agenthub.com`)** — add an `A` record pointing to Netlify's load balancer (Netlify shows the exact IP — currently `75.2.60.5`).
   - **`www` subdomain** — add a `CNAME` record pointing to `<your-site>.netlify.app`.
   - Alternatively use Netlify DNS — change your domain's nameservers to the ones Netlify lists. Simpler but moves DNS control to Netlify.
3. Wait for DNS propagation (minutes to a few hours).
4. Netlify will auto-issue a Let's Encrypt cert. Enable **Force HTTPS** under Domain management once the cert is live.

## Security

- `.env` is gitignored — never committed.
- `MONDAY_API_TOKEN` lives only in `process.env`, both locally and on Netlify. It never appears in `index.html` or any client-shipped code.
- The token never gets logged. Function logs show only whether `hasToken` is `true`/`false`.
- Honeypot field (`company_website`) silently drops bot submissions.
- Email validation + length caps reject malformed payloads.

## Troubleshooting

- **`Couldn't connect to server` from the browser** — you opened `index.html` via `file://`. Use `http://localhost:3000` (Express) or `http://localhost:8888` (`netlify dev`).
- **`MONDAY_API_TOKEN is not set` on Netlify** — env var missing in Netlify dashboard, or site wasn't redeployed after adding it.
- **Item created but columns empty** — `MONDAY_COL_*` env vars are missing. Run `npm run debug:board` locally to get them, paste into Netlify env vars, redeploy.
- **`monday API error: ... ColumnValueException`** — a column ID points to a column of the wrong type. The `MONDAY_COL_EMAIL` must be an email-type column; `STATUS` must be a status column; etc.
