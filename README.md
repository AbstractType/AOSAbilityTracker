# AOS Ability Tracker

A phase-by-phase ability tracker for Age of Sigmar 4th edition. Paste your BattleScribe roster JSON, step through the game's eight phases, and tick off abilities as you use them.

**Status:** Alpha v0.1 — web only, single-device, no backend. See [Status](#status-alpha-v01) for the honest list of what works and what doesn't.

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
- **Save armies.** When "signed in," you can keep up to 3 rosters in your browser so you don't have to re-paste JSON each session.
- **Responsive.** Phones (portrait + landscape), tablets, and desktop. Wide screens use a masonry layout so cards of different heights don't leave empty cells.

## Status: Alpha v0.1

**What works:**
- Everything in the feature list above.
- Web build, deployed to GitHub Pages.

**What is intentionally a stub:**
- **"Login" has no backend.** Any email + any non-empty password signs you in. The email is just used as a `localStorage` namespace key for saved armies. There is no server, no auth, no password storage. See [How accounts actually work](#how-accounts-actually-work).
- **No cross-device sync.** Saved armies live in `window.localStorage` in the browser you saved them in. Clear your browser data and they're gone.
- **No PWA / offline mode yet.**
- **Native iOS/Android builds not shipped.** The codebase is Expo, so native targets are reachable — but they're deferred. See [Roadmap](#roadmap).

**Known limitations:**
- Pinned to **Expo SDK 48**, which is past end-of-life. Works fine in the browser today but blocks native builds and some modern Expo features. SDK upgrade is on the v0.2 list.
- **BattleScribe JSON parsing** is opinionated to the format used by AoS armies in BattleScribe 2.0+. Other roster export formats are not supported.

## Try it locally

Requires Node 18+ and npm.

```bash
npm install
npm run web        # opens the dev server (usually http://localhost:19006)
```

Produce a production web bundle:

```bash
npm run build:web  # writes to ./web-build/
```

Native targets (untested in v0.1 — listed for completeness):

```bash
npm run android    # requires Android Studio + emulator/device
npm run ios        # requires Xcode (macOS only)
```

## Deploy

The web build deploys to GitHub Pages automatically on every push to `main` via [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

**One-time repo setup:**
1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions** (not the default "Deploy from a branch").

After that:
- Push to `main` → workflow builds + deploys.
- Live at https://abstracttype.github.io/AOSAbilityTracker/.

**If you fork this repo** to a different `owner/name`, update `GITHUB_PAGES_BASE` in [`webpack.config.js`](./webpack.config.js) to match `/your-repo-name/`. Without that change every asset URL in the built bundle 404s because Pages serves at a subpath, not at root.

## How accounts actually work

There is no backend. The flow:

1. You enter an email + any password in the Login modal.
2. The app accepts it without verification and treats the email string as a key.
3. Saved armies are stored at `window.localStorage["aos-tracker-armies::<email>"]` as JSON.
4. Signing out clears the in-memory user, but the `localStorage` entry stays put — so signing back in with the same email rehydrates the same list.

This is deliberate for the alpha: it lets us prototype the saved-armies UX without standing up a backend. v0.2 will revisit this with a real auth provider.

## Project structure

```
src/
  components/
    atoms/         Reusable primitives (Badge, Button, Divider, ...)
    molecules/     Small composites (PhaseButton, SearchBar, BurgerMenu, ...)
    organisms/     Self-contained sections (AppHeader, AbilityList, LoginModal, ...)
    templates/     Page-level layouts that compose organisms
  screens/         Top-level screens (LandingScreen, AbilityTrackerScreen)
  utils/           jsonParser, responsive, savedArmies (localStorage wrapper)
  theme/           Color / spacing / typography tokens
  types.ts         Ability + Phase types
  types/           Per-feature type modules (user, army)
App.tsx            Root: screen routing, global modals, auth + saved-army state
webpack.config.js  Sets publicPath for GitHub Pages subpath
```

Atomic design: lower layers know nothing about higher ones. Templates take fully-resolved data + callbacks; screens own the state.

## Roadmap

**v0.2 (next)**
- Upgrade Expo SDK 48 → SDK 50+
- Real authentication (likely Supabase or Firebase)
- Cross-device sync of saved armies
- PWA manifest + offline support
- Cover more BattleScribe roster edge cases

**v0.3+**
- Native iOS + Android via EAS Build (TestFlight + Play Internal Testing before public release)
- Per-turn history / undo
- Shared phase tracker for two-player games (longer term)

**v1.0**
- Public iOS / Android store release after playtester feedback

## Tech stack

- Expo SDK 48 (React Native 0.71)
- TypeScript
- React Native Web (webpack-based — SDK 48 default)
- `window.localStorage` for client-side persistence
- GitHub Actions + GitHub Pages for hosting

## Contributing

This is an alpha — APIs, UI, and data shapes will change without warning. If you're using it day-to-day and run into a roster-parsing edge case or layout bug, open an issue with:
- The relevant chunk of BattleScribe JSON (anonymized if needed).
- What you expected to see.
- What you actually saw (screenshot helps).
