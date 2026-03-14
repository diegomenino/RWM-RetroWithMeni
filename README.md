# RWM — Retro With Meni

A real-time collaborative retrospective tool for agile teams. Create a session, invite your team via a link, and run structured retrospectives together — live, in the browser.

---

## Features

- **Real-time collaboration** — cards, votes, and phase changes sync instantly across all participants via WebSockets
- **Multiple retro formats** — choose the structure that fits your team
- **Facilitator mode** — one person drives the session through phases
- **Anonymous card writing** — cards are hidden from others during the write phase, revealed all at once
- **Dot voting** — each participant gets a fixed number of votes to prioritize topics
- **Discussion mode** — facilitator spotlights cards one at a time for focused discussion
- **Synchronized countdown timer** — shared timer visible to all participants
- **SSO authentication** — Google, Microsoft Azure AD, or email-only login
- **Export** — download session results as JSON
- **Docker-ready** — single container with embedded SQLite database

---

## Retrospective Formats

| Format | Columns |
|--------|---------|
| **Start / Stop / Continue** | 🚀 Start · 🛑 Stop · ✅ Continue |
| **4Ls** | ❤️ Liked · 📚 Learned · ⚠️ Lacked · 🌟 Longed For |
| **Mad / Sad / Glad** | 😡 Mad · 😢 Sad · 😊 Glad |
| **Went Well / Improve / Actions** | 👍 Went Well · 🔧 Improve · 📋 Actions |

---

## Session Phases

```
✍️ Write  →  🗳️ Vote  →  💬 Discuss  →  ✅ Done
```

1. **Write** — participants add cards anonymously; other people's cards are hidden
2. **Vote** — all cards are revealed; each participant votes on what matters most
3. **Discuss** — facilitator spotlights cards one by one for the team to talk through
4. **Done** — session complete; facilitator can export results

---

## Running with Docker

### 1. Configure environment

Edit `docker-compose.yml` and fill in the required values:

```yaml
- NEXTAUTH_SECRET=        # generate with: openssl rand -base64 32
- NEXTAUTH_URL=http://your-server:8011
```

Add SSO credentials if needed (see [Authentication](#authentication) below).

### 2. Build and start

```bash
docker compose up --build
```

The app will be available at **http://localhost:8011**

### Other useful commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove the database
docker compose down -v
```

---

## Authentication

RWM supports three authentication modes, configured via environment variables in `docker-compose.yml`.

### Google SSO

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client
2. Set redirect URI: `http://your-server:8011/api/auth/callback/google`
3. Add to `docker-compose.yml`:

```yaml
- GOOGLE_CLIENT_ID=your-client-id
- GOOGLE_CLIENT_SECRET=your-client-secret
```

### Microsoft Azure AD

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations → New registration
2. Set redirect URI: `http://your-server:8011/api/auth/callback/azure-ad`
3. Create a client secret under **Certificates & secrets**
4. Add to `docker-compose.yml`:

```yaml
- AZURE_AD_CLIENT_ID=your-client-id
- AZURE_AD_CLIENT_SECRET=your-client-secret
- AZURE_AD_TENANT_ID=your-tenant-id   # use "common" for any Microsoft account
```

### Email-only (no SSO)

If neither Google nor Azure AD is configured, the sign-in page automatically shows an **email login form** — no password required. Users enter their email and are signed in immediately. Their display name is derived from the email address.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Real-time | Socket.io |
| Database | SQLite (better-sqlite3) |
| Auth | NextAuth.js v4 |
| Styling | Tailwind CSS |
| Runtime | Node.js 20 |
| Container | Docker |

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at **http://localhost:3000** in development.

> **Note:** Requires `NEXTAUTH_SECRET` to be set even in development. Create a `.env.local` file:
> ```
> NEXTAUTH_SECRET=any-random-string-for-dev
> NEXTAUTH_URL=http://localhost:3000
> ```

---

## Project Structure

```
app/
├── page.tsx                    # Home — create a session
├── layout.tsx                  # Root layout with AuthProvider
├── auth/signin/                # Custom sign-in page
├── api/
│   ├── auth/[...nextauth]/     # NextAuth handler
│   ├── sessions/               # Session CRUD
│   └── sessions/[id]/export/   # JSON export
└── session/[sessionId]/        # Board page

components/
├── board/                      # RetroBoard, Column, Card, VoteButton
├── session/                    # PhaseControls, CountdownTimer, ParticipantList
└── providers/                  # SocketProvider, AuthProvider

lib/
├── auth.ts                     # NextAuth config
├── db.js                       # SQLite connection
├── db-queries.js               # Database helpers
└── retro-formats.js            # Column definitions per format

socket/
└── handlers.js                 # Socket.io event handlers

server.js                       # Custom Node.js server (Next.js + Socket.io)
```

---

## License

MIT
