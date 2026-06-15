const TRACK_URL = '/api/track'
const ALLOWED_META_KEYS = new Set(['placement', 'plan', 'section', 'label', 'result'])

function trackingDisabled() {
  if (typeof window === 'undefined') return true
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return true
  if (navigator.globalPrivacyControl) return true
  return false
}

function cleanMeta(meta = {}) {
  return Object.fromEntries(
    Object.entries(meta)
      .filter(([key]) => ALLOWED_META_KEYS.has(key))
      .map(([key, value]) => [key, String(value).slice(0, 120)]),
  )
}

export function track(type, payload = {}) {
  if (trackingDisabled()) return

  const event = {
    type,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || '',
    name: payload.name ? String(payload.name).slice(0, 120) : undefined,
    form: payload.form ? String(payload.form).slice(0, 80) : undefined,
    meta: cleanMeta(payload.meta),
  }

  const body = JSON.stringify(event)
  const blob = new Blob([body], { type: 'application/json' })

  if (navigator.sendBeacon && navigator.sendBeacon(TRACK_URL, blob)) return

  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

export function trackPageView(meta = {}) {
  track('pageview', { meta })
}

export function trackCta(name, meta = {}) {
  track('cta_click', { name, meta })
}
