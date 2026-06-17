// Supabase Edge Function: send-challenge-email
//
// Triggered by a Database Webhook on INSERT into public.challenges. When the
// new challenge has an `opponent_email`, it emails that address a join link
// (<APP_URL>?challenge=<invite_token>) via Resend. Username-targeted and
// link-only challenges (no opponent_email) are ignored.
//
// Deploy + configure entirely from the Supabase Dashboard — see
// supabase/functions/send-challenge-email/README.md for the step-by-step.
//
// Required function secrets (Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY  – your Resend API key
//   WEBHOOK_SECRET  – a random string; the webhook must send it as the
//                     `x-webhook-secret` header (prevents this function from
//                     being used as an open email relay)
// Optional:
//   APP_URL         – deployed app URL (default: the GitHub Pages URL)
//   EMAIL_FROM      – From header (default: onboarding@resend.dev sender)

interface ChallengeRecord {
  opponent_email?: string | null;
  invite_token?: string | null;
  challenger_username?: string | null;
}

interface WebhookPayload {
  type?: string;
  record?: ChallengeRecord;
}

const DEFAULT_APP_URL = 'https://abstracttype.github.io/AOSAbilityTracker/';
const DEFAULT_FROM = 'AOS Tracker <onboarding@resend.dev>';

function joinUrl(token: string): string {
  const base = (Deno.env.get('APP_URL') ?? DEFAULT_APP_URL).replace(/\/?$/, '/');
  return `${base}?challenge=${encodeURIComponent(token)}`;
}

function emailHtml(challenger: string, url: string): string {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0B1220;padding:32px;color:#F8F9FB">
    <div style="max-width:480px;margin:0 auto;background:#15203A;border:1px solid #22324A;border-radius:12px;overflow:hidden">
      <div style="background:#0F1A30;padding:18px 24px;border-bottom:1px solid #22324A">
        <div style="font-size:12px;letter-spacing:.5px;text-transform:uppercase;color:#7A8BA4;font-weight:600">War Room Challenge</div>
        <div style="font-size:20px;font-weight:700;margin-top:4px">@${challenger} challenges you</div>
      </div>
      <div style="padding:24px">
        <p style="color:#A3B1C2;font-size:14px;line-height:20px;margin:0 0 20px">
          You've been challenged to an Age of Sigmar war room. Open the link, pick one of your
          saved armies, and join to compare abilities live.
        </p>
        <a href="${url}" style="display:inline-block;background:#3F66D6;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:8px">
          Join the war room
        </a>
        <p style="color:#7A8BA4;font-size:12px;line-height:18px;margin:20px 0 0">
          Or paste this link into the app:<br>
          <a href="${url}" style="color:#5BA9FF;word-break:break-all">${url}</a>
        </p>
        <p style="color:#677793;font-size:11px;margin:20px 0 0">
          The invite expires after an hour. If you didn't expect this, you can ignore it.
        </p>
      </div>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  // Only this app's Database Webhook (which knows the shared secret) may call
  // this — otherwise it would be an open email relay.
  const provided = req.headers.get('x-webhook-secret');
  const expected = Deno.env.get('WEBHOOK_SECRET');
  if (!expected || provided !== expected) {
    return new Response('unauthorized', { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('bad request', { status: 400 });
  }

  const record = payload.record ?? {};
  const email = record.opponent_email?.trim();
  const token = record.invite_token?.trim();
  const challenger = (record.challenger_username ?? 'A player').trim();

  // No email target (username or link challenge) → nothing to do, success.
  if (!email || !token) {
    return new Response(JSON.stringify({ skipped: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    return new Response('missing RESEND_API_KEY', { status: 500 });
  }

  const url = joinUrl(token);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: Deno.env.get('EMAIL_FROM') ?? DEFAULT_FROM,
      to: [email],
      subject: `@${challenger} challenged you to a war room`,
      html: emailHtml(challenger, url),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(JSON.stringify({ error: 'resend_failed', detail }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ sent: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
