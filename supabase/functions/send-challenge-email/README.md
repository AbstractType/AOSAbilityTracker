# send-challenge-email

Emails an opponent a war-room join link when a challenge is created with an
`opponent_email`. Triggered by a Database Webhook on `challenges` INSERT and
sends via [Resend](https://resend.com). Everything below is done in the
**Supabase Dashboard** — no CLI required.

## One-time setup

### 1. Resend account + API key
1. Sign up at https://resend.com (free tier is plenty).
2. **API Keys → Create API Key** → copy it (starts with `re_…`).
3. (Optional, recommended later) Verify a domain under **Domains** so email
   sends from your address instead of `onboarding@resend.dev` (the default
   sender works for testing but often lands in spam).

### 2. Create the function
Supabase Dashboard → **Edge Functions → Deploy a new function** (the in-browser
editor). Name it exactly `send-challenge-email` and paste the contents of
`index.ts` from this folder. Deploy.

### 3. Function secrets
Dashboard → **Edge Functions → (the function) → Secrets** (or Project Settings →
Edge Functions secrets). Add:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | your `re_…` key |
| `WEBHOOK_SECRET` | any long random string you make up (e.g. a UUID) |
| `APP_URL` | `https://abstracttype.github.io/AOSAbilityTracker/` (optional; this is the default) |
| `EMAIL_FROM` | optional, e.g. `AOS Tracker <noreply@yourdomain>` once you've verified a domain |

`WEBHOOK_SECRET` keeps this function from being used as an open email relay —
only the webhook (which sends the matching header) can trigger a send.

### 4. Database Webhook
Dashboard → **Database → Webhooks → Create a new hook**:
- **Table:** `public.challenges`
- **Events:** `INSERT` only
- **Type:** HTTP Request → **POST**
- **URL:** your function URL,
  `https://<project-ref>.supabase.co/functions/v1/send-challenge-email`
- **HTTP Headers:** add `x-webhook-secret` = the same value you used for the
  `WEBHOOK_SECRET` secret above.

That's it. Creating an email-targeted challenge in the app now emails the
opponent a `?challenge=<token>` link, which runs the existing Phase-4 join flow.

## Notes
- Username-targeted and link-only challenges have no `opponent_email`, so the
  function returns `{ skipped: true }` and sends nothing.
- The email link expires with the challenge (1 hour for email/link invites).
- `RESEND_API_KEY` lives only in Supabase function secrets — never in the
  client bundle or `EXPO_PUBLIC_*`.
