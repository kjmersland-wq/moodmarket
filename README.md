
# MoodMarket

MoodMarket er en moderne SaaS-inspirert webapp for tidlig oppdagelse av globale trender.

## MVP-innhold

- Dashboard med seksjoner:
	- Trendraketter
	- Tidlige signaler
	- Verdensoversikt
	- Mest overvaket
	- Nye signaler
- Trenddetaljer med vekst for 24t, 7d og 30d, kilder og AI-oppsummering
- Utforsk-side med sok og filtre for region og kategori
- Interaktivt verdenskart med klikkbare land og varmeindikator
- Global mockdata (ikke begrenset til Norge)

## Viktig om data

- Ingen API-tilknytninger er brukt i denne versjonen.
- All trenddata er lokal mockdata i `lib/mock-data.ts`.
- Scraper-moduler og signalfangst er forberedt som placeholders i:
	- `scraper/reddit`
	- `scraper/youtube`
	- `scraper/news`
	- `scraper/forums`
	- `scraper/trends`
	- `scraper/tiktok`
	- `scraper/x`
	- `scraper/podcasts`
	- `scraper/newsletters`
	- `scraper/github`
	- `scraper/marketplaces`

Kilder som na er klargjort for trendfangst:

- Reddit og nisjeforum
- YouTube og korte videoformater
- Nyheter og nyhetsbrev
- Trendmotorer og soketrender
- X for sanntidssignaler
- Podcasts og ekspertformat
- GitHub for utvikleradopsjon
- Markedsplasser for produktettersporsel

## Teknologi

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- UI-komponenter etter shadcn/ui-prinsipper
- Lucide ikoner
- Framer Motion
- PostgreSQL-klargjort schema i `db/schema.sql`

## Kom i gang

```bash
npm install
npm run dev
```

Aapne `http://localhost:3000`.

## Innlogging

Applikasjonen er beskyttet med registrering og innlogging.

1. Kopier `.env.example` til `.env.local`.
2. Sett verdier for:
	- `AUTH_SECRET`
	- `ALLOWED_EMAIL`

Passordflyt (anbefalt for rask oppstart):

1. Gaa til `/login`.
2. Velg `Registrer` for a opprette konto.
3. Bruk samme epost/passord i `Passord`-fanen for senere innlogging.

Valgfri epostkodeflyt (krever SMTP):
	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_USER`
	- `SMTP_PASS`
	- `SMTP_FROM`

1. Velg `Epostkode` i `/login`.
2. Skriv epost og velg "Send kode".
3. Bekreft koden fra Gmail for a fullfore innlogging.

Hvis `ALLOWED_EMAIL` er satt, er kun den eposten tillatt.

Ruter er beskyttet via `proxy.ts`, og brukeren sendes til `/login` uten gyldig session-cookie.

## Kom i gang med miljovariabler

```bash
copy .env.example .env.local
```

Aapne `http://localhost:3000`.

## Bygg for produksjon

```bash
npm run build
npm run start
```

## Struktur

```text
app/
	page.tsx
	utforsk/page.tsx
	trend/[id]/page.tsx
	verdenskart/page.tsx
components/
	moodmarket/
	ui/
lib/
	mock-data.ts
	trend-service.ts
	types.ts
scraper/
	reddit/
	youtube/
	news/
	forums/
	trends/
db/
	schema.sql
```
