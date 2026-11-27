import type { IncomingMessage, ServerResponse } from 'node:http'

interface ContactPayload {
  fullName?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
  website?: unknown
  elapsedMs?: unknown
}

interface ServerlessRequest extends IncomingMessage {
  body?: unknown
}

interface ServerlessResponse extends ServerResponse {
  status?: (code: number) => ServerlessResponse
  json?: (payload: Record<string, unknown>) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RECENT_SUBMISSIONS = new Map<string, number>()
const DEDUPE_WINDOW_MS = 60_000
const MIN_HUMAN_FILL_MS = 1_200

function sendJson(res: ServerlessResponse, statusCode: number, body: Record<string, unknown>) {
  if (typeof res.status === 'function') {
    const next = res.status(statusCode)
    if (typeof next?.json === 'function') {
      next.json(body)
      return
    }
  }
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

async function readJsonBody(req: ServerlessRequest): Promise<ContactPayload | null> {
  if (req.body && typeof req.body === 'object') {
    return req.body as ContactPayload
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as ContactPayload
    } catch {
      return null
    }
  }

  const chunks: Buffer[] = []
  let totalBytes = 0
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    totalBytes += buf.length
    if (totalBytes > 32_768) {
      return null
    }
    chunks.push(buf)
  }

  if (chunks.length === 0) return null
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as ContactPayload
  } catch {
    return null
  }
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    sendJson(res, 405, { ok: false, message: 'Method not allowed. Use POST.' })
    return
  }

  const payload = await readJsonBody(req)
  if (!payload) {
    sendJson(res, 400, { ok: false, message: 'Invalid JSON request payload.' })
    return
  }

  // Honeypot anti-spam trap
  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    sendJson(res, 400, { ok: false, message: 'Submission rejected by spam protection.' })
    return
  }

  const elapsedMs = typeof payload.elapsedMs === 'number' ? payload.elapsedMs : 0
  if (elapsedMs > 0 && elapsedMs < MIN_HUMAN_FILL_MS) {
    sendJson(res, 429, {
      ok: false,
      message: 'Please take a moment to review your message before sending.',
    })
    return
  }

  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''

  if (fullName.length < 2 || fullName.length > 100) {
    sendJson(res, 422, { ok: false, message: 'Please enter your full name (2–100 characters).' })
    return
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    sendJson(res, 422, { ok: false, message: 'Please provide a valid email address.' })
    return
  }
  if (subject.length < 3 || subject.length > 140) {
    sendJson(res, 422, { ok: false, message: 'Please include a short subject (3–140 characters).' })
    return
  }
  if (message.length < 10 || message.length > 2500) {
    sendJson(res, 422, {
      ok: false,
      message: 'Please write a message between 10 and 2,500 characters.',
    })
    return
  }

  const now = Date.now()
  for (const [key, ts] of RECENT_SUBMISSIONS.entries()) {
    if (now - ts > DEDUPE_WINDOW_MS) {
      RECENT_SUBMISSIONS.delete(key)
    }
  }

  const fingerprint = `${email}|${subject.toLowerCase()}|${message.slice(0, 120).toLowerCase()}`
  const prevTs = RECENT_SUBMISSIONS.get(fingerprint)
  if (prevTs && now - prevTs < DEDUPE_WINDOW_MS) {
    sendJson(res, 429, {
      ok: false,
      message: 'A matching message was just sent. Please wait a minute before sending again.',
    })
    return
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.FORMSPREE_ENDPOINT || ''
  const resendApiKey = process.env.RESEND_API_KEY || ''
  const toEmail = process.env.CONTACT_TO_EMAIL || ''

  if (webhookUrl) {
    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          subject,
          message,
          submittedAt: new Date(now).toISOString(),
        }),
      })

      if (!upstream.ok) {
        sendJson(res, 502, {
          ok: false,
          message: 'Upstream contact service declined the submission. Please try again later.',
        })
        return
      }

      RECENT_SUBMISSIONS.set(fingerprint, now)
      sendJson(res, 200, {
        ok: true,
        id: `qb-${now}`,
        message: 'Your message has been delivered successfully.',
      })
      return
    } catch {
      sendJson(res, 502, {
        ok: false,
        message: 'Could not reach the upstream contact service. Please try again shortly.',
      })
      return
    }
  }

  if (resendApiKey && toEmail) {
    try {
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || 'Quran Bytes Contact <onboarding@resend.dev>'
      const upstream = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `[Quran Bytes Contact] ${subject}`,
          text: [
            `Name: ${fullName}`,
            `Email: ${email}`,
            `Subject: ${subject}`,
            '',
            message,
          ].join('\n'),
        }),
      })

      if (!upstream.ok) {
        sendJson(res, 502, {
          ok: false,
          message: 'Email relay rejected the submission. Please try again later.',
        })
        return
      }

      const data = (await upstream.json().catch(() => null)) as { id?: string } | null
      RECENT_SUBMISSIONS.set(fingerprint, now)
      sendJson(res, 200, {
        ok: true,
        id: data?.id || `qb-${now}`,
        message: 'Your message has been delivered successfully.',
      })
      return
    } catch {
      sendJson(res, 502, {
        ok: false,
        message: 'Could not reach the email delivery relay. Please try again shortly.',
      })
      return
    }
  }

  sendJson(res, 503, {
    ok: false,
    code: 'DELIVERY_NOT_CONFIGURED',
    message:
      'Contact delivery is not yet configured on this server (missing CONTACT_WEBHOOK_URL, FORMSPREE_ENDPOINT, or RESEND_API_KEY).',
  })
}
