# Certificate Tracker — App

SaaS-Anwendung zur Verwaltung ablaufender Mitarbeiter-Zertifikate.
SvelteKit + TypeScript, Supabase (Postgres + Auth), Resend (Mails),
Deployment via Vercel.

> **Status:** Foundation. UI-Shell mit Mock-Daten ist anfassbar
> (`npm install && npm run dev`). Echte Supabase-Anbindung, Auth, Mail-Cron
> und PDF-Export folgen in den nächsten Sessions.

## Was schon drin ist

- SvelteKit 2 mit TypeScript, Vercel-Adapter
- Routen: `/` (Dashboard), `/employees`, `/certificates`,
  `/certificates/new`, `/settings`, `/login`
- Design-System (Plex Serif/Sans/Mono, Papierweiß, gedämpftes Grün) —
  visuell konsistent mit der Marketing-Site
- Mock-Daten für 4 Mitarbeiter / 5 Zertifikate, damit das UI realistisch
  aussieht
- Datenmodell als TypeScript-Types (`src/lib/types.ts`)
- Vollständige Postgres-Migration mit RLS-Policies
  (`supabase/migrations/0001_initial.sql`)

## Was noch fehlt (nächste Sessions)

- Supabase-Client + Auth-Flow (Sign up, Sign in, Magic Link)
- Echte CRUD-Form-Actions für Employees und Certificates
- Cron-Job (Supabase `pg_cron` oder Vercel Cron) für Reminder-Mails
- Resend-Template für die fünf Erinnerungs-Stufen
- PDF-Export der Compliance-Übersicht (z. B. `@react-pdf/renderer` oder
  serverseitig via Playwright)
- Onboarding-Flow für neue Organisationen

## Lokal entwickeln

```bash
cd app
npm install
npm run dev
# http://localhost:5173 öffnen
```

`npm install` zieht ~250 MB `node_modules`. Erstes `npm run dev` startet
in 1–2 Sekunden, danach Hot-Reload.

## Setup der externen Services

### 1. Supabase

1. Account auf <https://supabase.com> anlegen
2. Neues Projekt — **Region: Central EU (Frankfurt)** für DSGVO,
   Datenbank-Passwort sicher merken
3. Im Dashboard: **SQL Editor** → New query → den Inhalt von
   `supabase/migrations/0001_initial.sql` einfügen → **Run**
4. Im Dashboard: **Project Settings → API** kopieren:
   - `Project URL` → in `.env` als `PUBLIC_SUPABASE_URL`
   - `anon public` Key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` Key (klick auf „Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
     (**nur server-seitig** verwenden, niemals in Client-Code!)

### 2. Resend (transaktionale Mails)

1. Account auf <https://resend.com> anlegen
2. **Domains → Add Domain → `saaslyde.org`** → die drei vorgegebenen
   DNS-Records (SPF, DKIM, MX) beim Domain-Provider eintragen
3. Nach Verifizierung (≤ 1 h): **API Keys → Create API Key** →
   `re_…` Key kopieren → `.env` als `RESEND_API_KEY`
4. Sender-Adresse z. B. `reminders@saaslyde.org` setzen
   → `RESEND_FROM`

### 3. Vercel (Deployment)

1. Account auf <https://vercel.com>, GitHub verknüpfen
2. **New Project → Import** dieses Repository
3. **Root Directory** auf `app` setzen (nicht `/`, weil die Marketing-Site
   im Root liegt)
4. **Environment Variables**: die fünf Werte aus den vorigen Schritten
   eintragen (Supabase URL/Anon/Service-Role, Resend Key/From)
5. Deploy

Für lokale Entwicklung: `.env.example` nach `.env` kopieren, Werte
eintragen. `.env` ist git-ignoriert.

## Architektur-Entscheidungen, kurz

- **SvelteKit statt Next.js:** kompakter, weniger Boilerplate für
  CRUD-Forms (Form Actions sind first-class), kleinere Bundles.
- **Supabase statt eigenes Backend:** Postgres ist neutral und
  exportierbar, Auth + RLS spart Wochen, EU-Region erfüllt DSGVO.
- **Resend statt Postmark/Sendgrid:** sauberere API, vernünftiger
  Free-Tier (3 000 Mails/Monat).
- **Vercel statt Cloudflare Pages:** SvelteKit-Adapter ist bei Vercel
  am stabilsten, Cron-Jobs sind im Free-Tier dabei.
- **Multi-Tenancy via `organization_id` + RLS:** jede Tabelle hat
  `organization_id`, die `current_org()`-Funktion liest sie aus dem
  Profil des eingeloggten Users, RLS filtert. Saubere Isolation ohne
  Anwendungs-Code.

## Lizenz

Die WOFF2-Dateien in `static/fonts/` sind IBM Plex (SIL Open Font
License). Der eigene Code ist proprietär.
