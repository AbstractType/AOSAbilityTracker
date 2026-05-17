# AOS Ability Tracker

A phase-by-phase ability tracker for Age of Sigmar 4th edition. Paste your BattleScribe roster JSON, step through the game's eight phases, and tick off abilities as you use them.

**Status:** Alpha v0.2 — web only, real accounts with email verification, cross-device army sync. See [Status](#status-alpha-v02) for the honest list of what works and what doesn't.

**Live:** https://abstracttype.github.io/AOSAbilityTracker/

<!-- Add a screenshot here once the alpha is live. -->

## What it does

- **Paste a BattleScribe roster JSON** on the landing page. The app extracts every ability and groups them by game phase.
- **Walk through eight phases in order** — Deployment, Start of Turn, Hero, Movement, Shooting, Charge, Combat, End of Turn — or jump straight to one. Phase selection is constrained to the current phase and the next one so you can't accidentally skip ahead.
- **Tap an ability card to mark it used.** Used cards dim so you can see at a glance what's still available.
- **Complete Deployment** once at game start. The Deployment phase then hides for the rest of the game (those abilities only fire once).
- **Next Turn** at end-of-turn resets every ability's used state — except Deployment abilities.
- **Wizards / Priests** sections show your casters and their spell counts, parsed from the roster JSON.
- **Search** in the header filters the ability list live across name, source, keyword, timing, and description. Phase sections with zero matches disappear so you only see what you're looking for.
- **Keywords** modal lists rules-text definitions for army keywords that need them.
- **Real accounts.** Register with email + password, click the verification link, sign in across any device — your saved armies follow you.
- **Save armies.** Up to 3 rosters per account, stored in Supabase. No more re-pasting JSON every session, and no data loss if you clear your browser.
- **Responsive.** Phones (portrait + landscape), tablets, and desktop. Wide screens use a masonry layout so cards of different heights don't leave empty cells.

## Status: Alpha v0.2

**What works:**
- Everything in the feature list above.
- Real email/password auth via Supabase, with email verification gating the save feature.
- Cross-device sync of saved armies (any verified account; up to 3 armies per user).
- Web build, deployed to GitHub Pages, with Supabase env vars injected at build time.

**What is intentionally minimal in v0.2:**
- **Email + password only.** No display name, no username, no OAuth (Google/Apple/GitHub). Add later if there's a real ask.
- **No password reset flow yet.** If you forget your password, the workaround is to register again with a different email. Real reset is on the v0.3 list.
- **Magic-link verification.** Click the link in the signup email to verify; we don't do OTP codes.
- **No PWA / offline mode yet.**
- **Native iOS/Android builds not shipped.** The codebase is Expo, so native targets are reachable — but they're deferred. See [Roadmap](#roadmap).

**Known limitations:**
- Pinned to **Expo SDK 48**, which is past end-of-life. Works fine in the browser today but blocks native builds and some modern Expo features. SDK upgrade is on the roadmap.
- **BattleScribe JSON parsing** is opinionated to the format used by AoS armies in BattleScribe 2.0+. Other roster export formats are not supported.

## Try it locally

Requires Node 20+ and npm.

```bash
git clone https://github.com/AbstractType/AOSAbilityTracker.git
cd AOSAbilityTracker
npm install
cp .env.example .env
# Edit .env to fill in your Supabase project URL + anon key
#   (see "Setting up your own Supabase project" below)
npm run web        # opens the dev server (usually http://localhost:19006)
```

Produce a production web bundle:

```bash
npm run build:web  # writes to ./web-build/
```

Native targets (untested — listed for completeness):

```bash
npm run android    # requires Android Studio + emulator/device
npm run ios        # requires Xcode (macOS only)
```

## Setting up your own Supabase project

If you fork or self-host this app you'll need your own Supabase project. The official one only accepts auth + writes from `abstracttype.github.io`.

1. **Create a project** at https://supabase.com (free tier is plenty for an alpha).
2. **Apply the schema** — open the SQL Editor and paste [`docs/schema.sql`](./docs/schema.sql) (also reproduced below).
3. **Configure auth redirect URLs** under **Authentication → URL Configuration**:
   - Site URL: your deployed URL (e.g. `https://<your-username>.github.io/<your-repo>/`)
   - Redirect URLs (add each):
     - `https://<your-username>.github.io/<your-repo>/**`
     - `http://localhost:19006/**` (dev)
4. **Confirm email is enabled** — Authentication → Providers → Email → ensure "Confirm email" is on.
5. **Copy your credentials** — Project Settings → API → Project URL + anon/public key.
   - Local dev: paste into `.env`.
   - CI: add as GitHub Actions secrets `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

The anon key is **safe to embed in client code** — Row Level Security on the `armies` table enforces that one user can't read or modify another user's rows. The `service_role` key, on the other hand, bypasses RLS and must never appear in the client.

### Schema

```sql
create table public.armies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  json text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index armies_user_id_idx on public.armies(user_id);

alter table public.armies enable row level security;
create policy "armies_select_own" on public.armies for select using (auth.uid() = user_id);
create policy "armies_insert_own" on public.armies for insert with check (auth.uid() = user_id);
create policy "armies_update_own" on public.armies for update using (auth.uid() = user_id);
create policy "armies_delete_own" on public.armies for delete using (auth.uid() = user_id);

create or replace function public.enforce_army_limit()
returns trigger language plpgsql security definer as $$
begin
  if (select count(*) from public.armies where user_id = new.user_id) >= 3 then
    raise exception 'User has reached the 3-army limit' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger armies_limit_trigger
  before insert on public.armies
  for each row execute function public.enforce_army_limit();
```

## Deploy

The web build deploys to GitHub Pages automatically on every push to `main` via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

**One-time repo setup** (only needed when first standing up a deploy — the workflow auto-enables Pages via the `enablement: true` param on `actions/configure-pages`):
1. Add the two GitHub Actions secrets used at build time:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   Both are safe to be "public" — the anon key is designed for client use. They're stored as secrets so that rotating them later doesn't require a code change.

After that:
- Push to `main` → workflow builds + deploys.
- Live at https://abstracttype.github.io/AOSAbilityTracker/.

**If you fork this repo** to a different `owner/name`, update `GITHUB_PAGES_BASE` in [`webpack.config.js`](./webpack.config.js) to match `/your-repo-name/`. Without that change every asset URL in the built bundle 404s because Pages serves at a subpath, not at root.

## How accounts actually work

Real auth this time (no stub). The flow:

1. **Register** with email + password. Supabase hashes the password (bcrypt) and creates an `auth.users` row.
2. Supabase **sends a verification email** with a magic link pointing back at our deployed site.
3. Until you click that link, `email_confirmed_at` is null on your user record. The Account modal shows a banner: "Verify your email to save armies" with a Resend button. The save UI is hidden.
4. **Click the link** → the SDK detects the auth tokens in the URL hash and completes the session. `email_confirmed_at` flips to a timestamp. The Account modal refreshes to show the Army Lists section.
5. **Sign in** from any device with the same email/password. Your armies (stored server-side in Postgres) appear immediately.

Saved armies are protected by **Row Level Security**: every query is automatically filtered to rows where `user_id = auth.uid()`. There is no client-side way to read or modify another user's data, even with a valid anon key.

## Project structure

```
src/
  components/
    atoms/         Reusable primitives (Badge, Button, Divider, ...)
    molecules/     Small composites (PhaseButton, SearchBar, BurgerMenu, ...)
    organisms/     Self-contained sections (AppHeader, AbilityList, LoginModal, ...)
    templates/     Page-level layouts that compose organisms
  screens/         Top-level screens (LandingScreen, AbilityTrackerScreen)
  lib/             External-service clients (supabase.ts)
  utils/           jsonParser, responsive, savedArmies (Supabase wrapper)
  theme/           Color / spacing / typography tokens
  types.ts         Ability + Phase types
  types/           Per-feature type modules (user, army)
App.tsx            Root: screen routing, global modals, Supabase session sub
webpack.config.js  publicPath for Pages subpath + Supabase env var injection
.env.example       Template for local Supabase credentials (copy to .env)
```

Atomic design: lower layers know nothing about higher ones. Templates take fully-resolved data + callbacks; screens own the state.

## Roadmap

**v0.3 (next)**
- Password reset flow ("Forgot password" link → reset email)
- Upgrade Expo SDK 48 → SDK 50+
- PWA manifest + offline support (cached read-only access to already-loaded armies)
- Cover more BattleScribe roster edge cases

**v0.4+**
- Native iOS + Android via EAS Build (TestFlight + Play Internal Testing before public release)
- Per-turn history / undo
- Shared phase tracker for two-player games (longer term)
- OAuth providers (Google / Apple) if there's user demand

**v1.0**
- Public iOS / Android store release after playtester feedback

## Tech stack

- Expo SDK 48 (React Native 0.71)
- TypeScript
- React Native Web (webpack-based — SDK 48 default)
- Supabase (Postgres + Auth) for accounts + persistent army storage
- GitHub Actions + GitHub Pages for hosting

## Contributing

This is an alpha — APIs, UI, and data shapes will change without warning. If you're using it day-to-day and run into a roster-parsing edge case or layout bug, open an issue with:
- The relevant chunk of BattleScribe JSON (anonymized if needed).
- What you expected to see.
- What you actually saw (screenshot helps).
