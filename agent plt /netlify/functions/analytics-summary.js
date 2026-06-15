import { getStore } from '@netlify/blobs'

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

function dateKey(value) {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return new Date().toISOString().slice(0, 10)
}

function increment(map, key, by = 1) {
  const safeKey = key || 'unknown'
  map[safeKey] = (map[safeKey] || 0) + by
}

function top(map, limit = 10) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }))
}

function assertAdmin(event) {
  const token = process.env.ANALYTICS_ADMIN_TOKEN
  if (!token) return true
  const header = event.headers?.authorization || ''
  const query = event.queryStringParameters?.token || ''
  return header === `Bearer ${token}` || query === token
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' })
  if (!assertAdmin(event)) return json(401, { error: 'Unauthorized' })

  const date = dateKey(event.queryStringParameters?.date)
  const store = getStore('orynval-analytics')
  const summary = {
    date,
    generatedAt: new Date().toISOString(),
    pageviews: 0,
    ctaClicks: 0,
    formStarts: 0,
    formSubmits: 0,
    formSuccesses: 0,
    formErrors: 0,
    events: 0,
    topPages: [],
    topReferrers: [],
    topCtas: [],
    forms: {},
  }
  const pages = {}
  const referrers = {}
  const ctas = {}
  const forms = {}

  try {
    const prefix = `events/${date}/`
    const listed = await store.list({ prefix })
    for (const blob of listed.blobs || []) {
      const record = await store.get(blob.key, { type: 'json' }).catch(() => null)
      if (!record || !record.type) continue
      summary.events += 1
      if (record.type === 'pageview') {
        summary.pageviews += 1
        increment(pages, record.path || '/')
        increment(referrers, record.referrer || 'direct')
      }
      if (record.type === 'cta_click') {
        summary.ctaClicks += 1
        increment(ctas, record.name || record.meta?.placement || 'unknown')
      }
      if (record.form) forms[record.form] ||= { starts: 0, submits: 0, successes: 0, errors: 0 }
      if (record.type === 'form_start') {
        summary.formStarts += 1
        if (record.form) forms[record.form].starts += 1
      }
      if (record.type === 'form_submit') {
        summary.formSubmits += 1
        if (record.form) forms[record.form].submits += 1
      }
      if (record.type === 'form_success') {
        summary.formSuccesses += 1
        if (record.form) forms[record.form].successes += 1
      }
      if (record.type === 'form_error') {
        summary.formErrors += 1
        if (record.form) forms[record.form].errors += 1
      }
    }

    summary.topPages = top(pages)
    summary.topReferrers = top(referrers)
    summary.topCtas = top(ctas)
    summary.forms = forms

    await store.setJSON(`summary/${date}.json`, summary)
    await store.setJSON('summary/latest.json', summary)
    return json(200, summary)
  } catch (err) {
    console.error('[analytics-summary]', err.message)
    return json(500, { error: 'Failed to summarize analytics' })
  }
}
