# AOS Ability Tracker

A phase-by-phase ability tracker for Age of Sigmar 4th edition. Paste your BattleScribe roster JSON, step through the game's eight phases, and tick off abilities as you use them — solo, or live against another player in a shared **War Room**.

**Status:** Alpha v0.4 — web only. Adds a synced game clock, initiative picker, unit cards with combat stats and live wound tracking, a damage prediction modal, and phase-gated weapon profiles. See [Status](#status-alpha-v04) for the full picture.

**Live:** https://abilitytracker.co.uk

---

## What it does

### Solo tracker
- **Paste a BattleScribe roster JSON** on the landing page. The app extracts every ability, spell, prayer, and unit from your roster and groups them by game phase.
- **Walk through eight phases** — Deployment, Start of Turn, Hero, Movement, Shooting, Charge, Combat, End of Turn — or jump to one.
- **Tap an ability card to mark it used** (used cards dim). **Complete Deployment** once at game start (it then hides); **Next Turn** at End of Turn resets used marks.
- **Wizards / Priests** sections with casting/chanting power totals; **live search** across name, source, keywords, timing, and description; **Keywords** reference modal.
- **Unit cards** — each unit shows its Move/Health/Save/Control/Ward stats, keyword tags, and weapon profiles. Tap a card to flip it and see attack stats (Atk/Hit/Wnd/Rnd/Dmg) scaled to the surviving model count. Weapons are filtered to the active phase — ranged only in Shooting Phase, melee only in Combat Phase.
- **Responsive** — phones (portrait + landscape), tablets, desktop. Wide screens use a masonry layout so uneven card heights don't leave gaps.

### Accounts
- **Register with email + password**, click the verification link, sign in across any device.
- **Forgot / change password** flows (reset email + in-account change).
- **Save up to 3 armies** per account — no re-pasting JSON, no loss when you clear your browser.

### Customize your abilities (per account, synced)
- **Long-press any ability card** for a menu: **add a note** (shown on the card), or **hide** an ability you've memorized.
- **Reorder mode** (header toggle): cards wiggle and become **drag-to-reorder within their phase**; the order persists to your account.
- **Show Hidden** toggle brings hidden abilities back so you can un-hide them.

### War Room (real-time multiplayer)
- **Claim a username**, then **challenge another player** three ways: an **in-app alert** (if they're online), a **shareable link** (WhatsApp/Discord/etc.), or an **email invite**.
- The opponent **accepts by picking a saved army**; both land in a shared room.

**Initiative picker** — before any phase begins, both players see a pre-game screen to decide who takes the first turn: pick a side or tap "Roll dice — let fate decide". Either player can choose; the first to confirm wins the race (first-writer-wins guard in the DB).

**Shared game clock** — a "Next phase →" and "Pass turn ⇄" control advances the shared clock for *both* players simultaneously via Supabase Realtime. The current phase and turn number are always in sync.

**Unit cards in both columns** — wounds, destroyed/summoned state, charged toggle, hit/save modifiers, and unit categorisation (Unique Heroes / Heroes / Cavalry / Infantry / Manifestations / Terrain) visible for both your army and your opponent's.

**Manifestation visibility** — un-summoned manifestations only appear in Hero Phase; in other phases only already-summoned ones are shown.

**Phase-gated weapons and units:**
- Ranged weapon profiles shown only in Shooting Phase; melee only in Combat Phase.
- Active player's ranged units visible in Shooting Phase. Inactive player's ranged units are hidden unless they've activated a shooting ability (e.g. **Covering Fire**) — marking it used reveals their archers with a "Select to shoot" button.
- Combat Phase shows all units.

**Combat / Shooting Prediction modal** — select one of your units ("Select to shoot" in Shooting Phase / "Select for combat" in Combat Phase), then pick a target from the opponent's full roster. A modal shows:
- Expected damage using phase-appropriate weapons only (ranged or melee)
- Expected HP remaining on the target; "Likely destroyed" if damage ≥ remaining HP
- Models-survive estimate for multi-model units
- Active modifiers summary (charged bonus, hit/save modifiers)

**Ability sync** — used-state syncs live between both players. A role filter shows each army's abilities appropriate to the current turn: active player sees their on-turn abilities, inactive player sees reactions and responses.

**One active challenge at a time** with a **2-minute response timer** (auto-declines on timeout); **leave/disconnect notifications** when your opponent goes.

**Stats screen** — most-used and never-used abilities across all your war rooms, plus time-per-phase breakdown for each session.

**PWA** — installable on desktop and mobile (Add to Home Screen), with a service worker for fast repeat loads.

---

## Status: Alpha v0.4

**What works:**
- Everything above. Auth, customization, and multiplayer all run on Supabase (Postgres + Row Level Security + Realtime).
- Web build, auto-deployed to GitHub Pages / custom domain, with Supabase env vars injected at build time.
- PWA manifest + service worker.

**Known limitations:**
- Pinned to **Expo SDK 48** (past end-of-life) — fine in the browser, but blocks native builds. SDK upgrade is on the roadmap.
- **Timing classification** for the war room's turn filter is a heuristic on free-text timing strings (`your` / `enemy` / `reaction`); unusual phrasings may misclassify.
- **BattleScribe JSON parsing** targets the format exported by BattleScribe 2.0+ for AoS armies. Other exporters aren't supported.
- **Email invites** require the Edge Function deployed separately (see below). In-app and link invites work without it.

---

## Try it locally

Requires Node 20+ and npm.

```bash
git clone https://github.com/AbstractType/AOSAbilityTracker.git
cd AOSAbilityTracker
npm install
cp .env.example .env
# Fill in your Supabase project URL + anon key (see below)
npm run web        # dev server at http://localhost:19006
```

Production web bundle:

```bash
npm run build:web  # writes ./web-build/
```

---

## Setting up your own Supabase project

1. **Create a project** at https://supabase.com (free tier is plenty).
2. **Apply the schema** — open the SQL Editor and run each migration in [`supabase/migrations/`](./supabase/migrations) **in order**. All migrations are idempotent (safe to re-run):

   | File | What it creates |
   |------|----------------|
   | `0001_profiles.sql` | Usernames + user search RPC |
   | `0002_war_room.sql` | Challenges + war rooms + accept RPC |
   | `0003_war_room_state.sql` | Live ability used-state sync |
   | `0004_invite_links.sql` | Invite-link claim/peek RPCs |
   | `0005_challenge_limits.sql` | One-active-challenge rule + stale cleanup |
   | `0006_war_room_clock.sql` | Shared turn/phase clock + phase-time log |
   | `0007_war_room_unit_state.sql` | Per-unit wounds/destroyed/charged state |

3. **Realtime** — migrations add all synced tables to the `supabase_realtime` publication and set `REPLICA IDENTITY FULL`. Confirm Realtime is enabled under **Database → Replication**.
4. **Auth redirect URLs** — **Authentication → URL Configuration**: Site URL = your deployed URL; add redirect URLs for your domain and `http://localhost:19006/**`. Ensure **Confirm email** is on under Providers → Email.
5. **Credentials** — Project Settings → API → Project URL + anon key. Local: into `.env`. CI: GitHub Actions secrets `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

The anon key is **safe in client code** — RLS ensures one user can never read or modify another's rows. The `service_role` key bypasses RLS and must never ship to the client.

### War Room email invites (optional)

Email invites need one Edge Function + [Resend](https://resend.com). Full steps are in [`supabase/functions/send-challenge-email/README.md`](./supabase/functions/send-challenge-email/README.md) — deploy the function, set `RESEND_API_KEY` + `WEBHOOK_SECRET` secrets, and add a Database Webhook on `challenges INSERT`. In-app and link invites work without this.

---

## Deploy

The web build auto-deploys to GitHub Pages on every push to `main` via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

**One-time:** set GitHub Actions secrets `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. The workflow auto-enables Pages and sets the custom domain via a `CNAME` file.

A separate daily workflow ([`.github/workflows/keep-warm.yml`](./.github/workflows/keep-warm.yml)) pings Supabase so the free-tier project doesn't auto-pause after 7 days idle.

---

## How accounts + data work

1. **Register** → Supabase hashes the password and creates an `auth.users` row.
2. A **verification email** confirms the account; until then, account-bound features (save, customize, multiplayer) are gated.
3. **Sign in** anywhere — armies, customizations, and stats follow you.

Everything is protected by **Row Level Security** — every query and every realtime change event is filtered to rows the signed-in user is allowed to see. Cross-user actions (creating a war room as the *other* player on accept, joining by invite token) go through `SECURITY DEFINER` RPCs that verify the caller before acting.

---

## Project structure

```
src/
  components/
    atoms/         Primitives (Badge, ...)
    molecules/     Small composites (PhaseButton, SearchBar, SavedArmyPicker, ...)
    organisms/     Sections + modals (AppHeader, AbilityList, AbilityCard,
                   ReorderableAbilityList, AbilityContextMenu, NoteEditorModal,
                   UnitCard, UnitSection, CombatPredictionModal,
                   UsernamePromptModal, IncomingChallengeModal, JoinByLinkModal,
                   LoginModal, KeywordsModal, WizardSection, PriestSection)
    templates/     Page layouts (TrackerTemplate, LandingTemplate)
  screens/         LandingScreen, AbilityTrackerScreen, WarRoomLobbyScreen,
                   WarRoomScreen, StatsScreen
  lib/             supabase.ts (client singleton)
  utils/           jsonParser, responsive, savedArmies, customizations,
                   profiles, challenges, warRoom, warRoomState, warRoomUnitState,
                   warRoomClock, units, abilities, stats, masonry
  theme/           Design tokens (colors, radii, typography)
  types.ts         Ability + Phase types
  types/           user, army, customization, profile, warRoom, unit
App.tsx            Root: routing, global modals, Supabase session +
                   realtime challenge-inbox + invite-link deep-linking
supabase/
  migrations/      SQL schema (0001–0007), all idempotent
  functions/       send-challenge-email Edge Function (Deno + Resend)
webpack.config.js  Pages publicPath + Supabase env injection + PWA assets
```

Atomic design: lower layers know nothing about higher ones; screens own state, templates receive resolved data + callbacks.

---

## Roadmap

**Shipped in v0.4:**
- Synced game clock (Next phase / Pass turn controls, both players stay in lockstep)
- Initiative picker (pre-game who-goes-first screen with dice roll option)
- Unit cards — stats, keywords, weapon profiles, flip for attack stat view scaled to surviving models
- Per-unit wound/destroyed/summoned/charged/modifier tracking synced via Supabase Realtime
- Phase-gated weapon profiles (ranged ↔ melee) and unit filtering
- Covering Fire mechanic (inactive player ranged units gated on used ability)
- Combat/Shooting prediction modal with phase-accurate damage math
- Manifestation phase visibility
- Time-per-phase stats (phase log table + clock integration)
- PWA manifest + service worker

**Next**
- Upgrade **Expo SDK 48 → 50+** (past end-of-life; blocks native builds).
- More BattleScribe roster edge cases and broader exporter support.

**Later**
- Native iOS + Android via EAS Build.
- Per-turn history / undo; OAuth providers if there's demand.

**v1.0** — public store release after playtester feedback.

---

## Tech stack

- Expo SDK 48 (React Native 0.71) + TypeScript
- React Native Web (webpack — SDK 48 default)
- Supabase: Postgres + Auth + **Realtime** (presence + Postgres-change subscriptions) + one **Edge Function** (Deno, for email)
- GitHub Actions + GitHub Pages / custom domain for hosting

---

## Contributing

Alpha — APIs, UI, and data shapes change without warning. If you hit a roster-parsing edge case or a bug, open an issue with the relevant (anonymized) BattleScribe JSON, what you expected, and what happened (screenshots help).
