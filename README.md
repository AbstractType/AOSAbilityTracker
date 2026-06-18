# AOS Ability Tracker

A phase-by-phase ability tracker for Age of Sigmar 4th edition. Paste your BattleScribe roster JSON, step through the game's eight phases, and tick off abilities as you use them — solo, or live against another player in a shared "War Room".

**Status:** Alpha v0.3 — web only. Adds per-account ability customization (notes / hide / drag-reorder), password reset, and a real-time multiplayer **War Room**. See [Status](#status-alpha-v03) for the honest list of what works and what doesn't.

**Live:** https://abstracttype.github.io/AOSAbilityTracker/

<!-- Add a screenshot here once the alpha is live. -->

## What it does

### Solo tracker
- **Paste a BattleScribe roster JSON** on the landing page. The app extracts every ability and groups them by game phase.
- **Walk through eight phases** — Deployment, Start of Turn, Hero, Movement, Shooting, Charge, Combat, End of Turn — or jump to one. Phase selection is constrained to the current/next phase so you can't skip ahead.
- **Tap an ability card to mark it used** (used cards dim). **Complete Deployment** once at game start (it then hides); **Next Turn** at end-of-turn resets everything except Deployment.
- **Wizards / Priests** sections, **live search** (name / source / keyword / timing / description), and a **Keywords** reference modal.
- **Responsive** — phones (portrait + landscape), tablets, desktop. Wide screens use a masonry layout so uneven card heights don't leave gaps.

### Accounts
- **Register with email + password**, click the verification link, sign in across any device.
- **Forgot / change password** flows (reset email + in-account change).
- **Save up to 3 armies** per account (stored in Supabase) — no re-pasting JSON, no loss when you clear your browser.

### Customize your abilities (per account, synced)
- **Long-press any ability card** for a menu: **add a note** (shown on the card), or **hide** an ability you've memorized.
- **Reorder mode** (header toggle): cards wiggle and become **drag-to-reorder within their phase**; the order persists to your account.
- **Show Hidden** toggle brings hidden abilities back so you can un-hide them.

### War Room (real-time multiplayer)
- **Claim a username**, then **challenge another player** three ways: an **in-app alert** (if they're online), a **shareable link** (WhatsApp/Discord/etc.), or an **email invite**.
- The opponent **accepts by picking a saved army**; both land in a shared room.
- **Both armies, grouped by phase** — side-by-side on wide screens, tabbed on phones, with a tracker-style phase selector on top.
- **Ability "used" state syncs live** between both players, with an **opponent-online** presence dot.
- A **"whose turn"** toggle filters each army to what's usable now — your *on-turn* abilities ("Your Hero Phase") vs. the opponent's *reactive* ones ("Enemy Movement Phase", "Reaction: …").
- **One active challenge at a time** with a **2-minute response timer** (auto-declines on timeout); **leave/disconnect notifications** when your opponent goes.
- **Stats screen** — most-used and never-used abilities across all your war rooms.

## Status: Alpha v0.3

**What works:**
- Everything above. Auth, customization, and multiplayer all run on Supabase (Postgres + Row Level Security + Realtime).
- Web build, auto-deployed to GitHub Pages, with Supabase env vars injected at build time.

**Intentionally minimal in v0.3:**
- **The "whose turn" toggle is local**, not synced — each player controls their own view.
- **No time-per-phase stats yet** — that needs the room to gain a synced turn/phase clock (Next-phase / Next-turn controls + timestamping), which is a feature of its own. Ability-usage stats are in; phase timing is parked.
- **Email invites require the Edge Function deployed** (see [War Room email setup](#war-room-email-invites-optional)). In-app + link invites work with no extra infra.
- **Email + password only** — no OAuth / usernames-as-login.
- **No PWA / offline mode; native iOS/Android not shipped.**

**Known limitations:**
- Pinned to **Expo SDK 48** (past end-of-life) — fine in the browser, but blocks native builds and some modern Expo features. SDK upgrade is on the roadmap.
- **Timing classification** for the war room's turn filter is a heuristic on free-text timing strings (`your` / `enemy` / `reaction` / `any`); unusual phrasings may misclassify.
- **BattleScribe JSON parsing** targets the format used by AoS armies in BattleScribe 2.0+. Other exports aren't supported.

## Try it locally

Requires Node 20+ and npm.

```bash
git clone https://github.com/AbstractType/AOSAbilityTracker.git
cd AOSAbilityTracker
npm install
cp .env.example .env
# Fill in your Supabase project URL + anon key (see below)
npm run web        # dev server, usually http://localhost:19006
```

Production web bundle:

```bash
npm run build:web  # writes ./web-build/
```

Native targets (untested — listed for completeness): `npm run android`, `npm run ios`.

## Setting up your own Supabase project

If you fork or self-host, you'll need your own Supabase project.

1. **Create a project** at https://supabase.com (free tier is plenty).
2. **Apply the schema** — open the SQL Editor and run each migration in
   [`supabase/migrations/`](./supabase/migrations) **in order**:
   - `0001_profiles.sql` — usernames + user search
   - `0002_war_room.sql` — challenges + war rooms + accept RPC
   - `0003_war_room_state.sql` — live used-state sync
   - `0004_invite_links.sql` — invite-link claim/peek RPCs
   - `0005_challenge_limits.sql` — one-active-challenge rule + timer cleanup
   - (The original `armies` and `ability_customizations` tables predate this folder — their SQL is reproduced in the git history / earlier releases. If starting fresh, see the inline schema in the `v0.2` README tag or ask.)
3. **Realtime** — migrations `0002`/`0003` add `challenges` and `war_room_state` to the `supabase_realtime` publication. Confirm Realtime is enabled under **Database → Replication**.
4. **Auth redirect URLs** — **Authentication → URL Configuration**: Site URL = your deployed URL; add redirect URLs for `https://<you>.github.io/<repo>/**` and `http://localhost:19006/**`. Ensure **Confirm email** is on under Providers → Email.
5. **Credentials** — Project Settings → API → Project URL + anon key. Local: into `.env`. CI: GitHub Actions secrets `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

The anon key is **safe in client code** — RLS enforces that one user can never read or modify another's rows (including the realtime change feed). The `service_role` key bypasses RLS and must never ship to the client.

### War Room email invites (optional)

Email invites need one Edge Function + [Resend](https://resend.com). Full Dashboard-only steps are in
[`supabase/functions/send-challenge-email/README.md`](./supabase/functions/send-challenge-email/README.md) — create the function, set `RESEND_API_KEY` + `WEBHOOK_SECRET` secrets, and add a Database Webhook on `challenges` INSERT. In-app and link invites work without this.

## Deploy

The web build auto-deploys to GitHub Pages on every push to `main` via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

**One-time:** set GitHub Actions secrets `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (both safe to be public — the anon key is for client use; they're secrets so rotation needs no code change). The workflow auto-enables Pages.

**If you fork** to a different `owner/name`, update `GITHUB_PAGES_BASE` in [`webpack.config.js`](./webpack.config.js) to `/your-repo-name/`, or asset URLs 404 (Pages serves at a subpath).

A separate daily workflow ([`.github/workflows/keep-warm.yml`](./.github/workflows/keep-warm.yml)) pings Supabase so the free-tier project doesn't auto-pause after 7 days idle.

## How accounts + data work

1. **Register** → Supabase hashes the password and creates an `auth.users` row.
2. A **verification email** (magic link) confirms the account; until then, account-bound features (save, customize, multiplayer) are gated.
3. **Sign in** anywhere with the same credentials; your armies, customizations, and stats follow you.

Everything is protected by **Row Level Security** — every query (and every realtime change event) is filtered to rows the signed-in user is allowed to see. Cross-user actions that RLS can't express directly (creating a war room as the *other* player on accept, joining by invite token) go through `security definer` RPCs that verify the caller first. There's no client-side way to read or modify another user's data, even with a valid anon key.

## Project structure

```
src/
  components/
    atoms/         Primitives (Badge, Button, ...)
    molecules/     Small composites (PhaseButton, SearchBar, SavedArmyPicker, ...)
    organisms/     Sections + modals (AppHeader, AbilityList, LoginModal,
                   ReorderableAbilityList, AbilityContextMenu, NoteEditorModal,
                   UsernamePromptModal, IncomingChallengeModal, JoinByLinkModal)
    templates/     Page layouts (TrackerTemplate, LandingTemplate)
  screens/         LandingScreen, AbilityTrackerScreen, WarRoomLobbyScreen,
                   WarRoomScreen, StatsScreen
  lib/             supabase.ts (client)
  utils/           jsonParser, responsive, savedArmies, customizations,
                   profiles, challenges, warRoom, warRoomState, stats
  theme/           Design tokens
  types.ts         Ability + Phase types
  types/           user, army, customization, profile, warRoom
App.tsx            Root: routing, global modals, Supabase session + realtime
                   challenge-inbox subscription, invite-link deep-linking
supabase/
  migrations/      SQL applied in the Dashboard (0001–0005)
  functions/       send-challenge-email Edge Function (Resend)
webpack.config.js  Pages publicPath + Supabase env injection
```

Atomic design: lower layers know nothing about higher ones; screens own state, templates take resolved data + callbacks.

## Roadmap

**Shipped since v0.2:** ability customization (notes / hide / drag-reorder), password reset + change, the full War Room (usernames, in-app / link / email challenges, live used-sync, turn-role filtering, leave notifications), and usage stats.

**Next**
- **Time-per-phase stats** — needs a synced turn/phase clock in the war room (Next-phase / Next-turn controls + timestamping).
- Upgrade **Expo SDK 48 → 50+**.
- **PWA** manifest + offline (cached read-only access to loaded armies).
- More BattleScribe roster edge cases.

**Later**
- Native iOS + Android via EAS Build (TestFlight + Play Internal Testing).
- Per-turn history / undo; OAuth providers if there's demand.

**v1.0** — public store release after playtester feedback.

## Tech stack

- Expo SDK 48 (React Native 0.71) + TypeScript
- React Native Web (webpack — SDK 48 default)
- Supabase: Postgres + Auth + **Realtime** (presence + Postgres-change subscriptions) + one **Edge Function** (Deno, for email)
- GitHub Actions + GitHub Pages for hosting

## Contributing

Alpha — APIs, UI, and data shapes change without warning. If you hit a roster-parsing edge case or a bug, open an issue with the relevant (anonymized) BattleScribe JSON, what you expected, and what happened (screenshots help).
