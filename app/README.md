# MedInfo Academy

A training simulator and certification platform for Medical Information (MI) professionals.
Trainees work simulated inbound MI calls end to end — intake, inquiry handling, safety/AE
capture, response, and closure/routing — voice or text, against a persona engine that plays
the caller. A deterministic documentation validator plus an LLM evaluator score submissions
against a fixed rubric, and a certification workflow issues fresh, non-repeating case variants
for graded sittings. All products and cases referenced in the app and its seed data are
fictional.

Built with Next.js (App Router, TypeScript, Tailwind) and Supabase (Postgres, auth, RLS).

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in the required values (see below). `.env.local`
   is gitignored and does not exist in a fresh checkout.
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Testing

Run all of these from `app/` (never from the repo root):

```bash
npx vitest run     # unit tests
npx eslint .        # lint
npx tsc --noEmit    # type-check
npm run build       # production build
```

## Environment variables

See `.env.example` for the full list with inline comments. In short:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required, public Supabase client
  config.
- `SUPABASE_SERVICE_ROLE_KEY` — required, server-only; used by the evaluator and admin flows.
- `GROQ_API_KEY` — required; the default LLM/STT/TTS provider.
- `ANTHROPIC_API_KEY` / `LLM_PROVIDER=anthropic` — optional fallback provider.
- `ELEVENLABS_API_KEY` — optional, TTS A/B comparison only.

## Where the docs live

- `00-build/STATE.md` — current build state: what's shipped, test/migration/seed inventory,
  env keys, run order, and open gates by owner.
- `00-build/DECISIONS.md` — the merged decision/blocker log (chronological, newest first).
- `../RUNBOOK.md` — operational session playbook for build work on this repo.
- `../miacademycourse_prd_v1.md` — the product requirements document.
