import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'

const ALLOWED_TYPES = new Set([
  'pageview',
  'cta_click',
  'form_start',
  'form_submit',
  'form_success',
  'form_error',
])
const ALLOWED_META_KEYS = new Set(['placement', 'plan', 'section', 'label', 'result'])

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  }
}

function cleanString(value, max = 200) {
  return String(value || '').trim().slice(0, max)
}

function cleanPath(value) {
  const path = cleanString(value || '/', 300)
  if (!path.startsWith('/')) return '/'
  return path.replace(/[?#].*$/, '') || '/'
}

function referrerOrigin(value) {
  const raw = cleanString(value, 500)
  if (!raw) return 'direct'
  try {
    const url = new URL(raw)
    return url.origin
  } catch {
    return 'unknown'
  }
}

function cleanMeta(meta = {}) {
  const out = {}
  for (const [key, value] of Object.entries(meta || {})) {
    if (ALLOWED_META_KEYS.has(key)) out[key] = cleanString(value, 120)
  }
  return out
}

function visitorHash(event) {
  const salt = process.env.ANALYTICS_SALT
  if (!salt) return undefined
  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || event.headers['x-forwarded-for'] || ''
  const ua = event.headers['user-agent'] || ''
  return crypto.createHash('sha256').update(`${ip}|${ua}|${salt}`).digest('hex').slice(0, 24)
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  const headers = event.headers || {}
  if (headers.dnt === '1' || headers['sec-gpc'] === '1') return json(204, {})

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const type = cleanString(body.type, 40)
  if (!ALLOWED_TYPES.has(type)) return json(400, { error: 'Invalid event type' })

  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const record = {
    type,
    ts: now.toISOString(),
    date,
    path: cleanPath(body.path),
    title: cleanString(body.title, 200),
    referrer: referrerOrigin(body.referrer),
    name: cleanString(body.name, 120),
    form: cleanString(body.form, 80),
    meta: cleanMeta(body.meta),
    country: cleanString(headers['x-nf-geo'] || headers['x-country'] || '', 20),
    visitor: visitorHash(event),
  }

  try {
    const store = getStore('orynval-analytics')
    const random = crypto.randomBytes(6).toString('hex')
    const key = `events/${date}/${Date.now()}-${random}-${type}.json`
    await store.setJSON(key, record)
    return json(200, { ok: true })
  } catch (err) {
    console.error('[track]', err.message)
    return json(202, { ok: false })
  }
}
