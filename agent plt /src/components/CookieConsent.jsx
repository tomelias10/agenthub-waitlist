import { useEffect, useState } from 'react'
import './CookieConsent.css'

const CONSENT_KEY = 'orynval-cookie-consent'
const APOLLO_APP_ID = '6993377bbfe8500011f337fa'

/** Event the footer dispatches to re-open the banner. */
export const OPEN_COOKIE_SETTINGS = 'open-cookie-settings'

let apolloLoaded = false

function loadApollo() {
  if (apolloLoaded || window.trackingFunctions) return
  apolloLoaded = true
  const n = Math.random().toString(36).substring(7)
  const o = document.createElement('script')
  o.src = `https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=${n}`
  o.async = true
  o.defer = true
  o.onload = () => window.trackingFunctions.onLoad({ appId: APOLLO_APP_ID })
  document.head.appendChild(o)
}

/**
 * Cookie consent banner that gates the Apollo.io visitor tracking script.
 * Apollo only loads after the visitor explicitly accepts. The choice is
 * stored in localStorage so the banner doesn't reappear on every visit.
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState(undefined) // undefined = not read yet

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    setConsent(stored)
    // Opt-out model: load Apollo for everyone except visitors who declined.
    if (stored !== 'declined') loadApollo()

    const reopen = () => setConsent(null)
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen)
  }, [])

  const decide = (choice) => {
    localStorage.setItem(CONSENT_KEY, choice)
    setConsent(choice)
    if (choice === 'accepted') {
      loadApollo()
    } else if (apolloLoaded) {
      // Apollo already loaded this session — reload so it's gone for a decline.
      window.location.reload()
    }
  }

  // Hide while reading storage, or once a choice exists.
  if (consent === undefined || consent === 'accepted' || consent === 'declined') {
    return null
  }

  return (
    <div className="cookie" role="dialog" aria-label="Cookie consent">
      <p className="cookie__text">
        We use cookies and visitor analytics to understand site engagement and
        improve Orynval. See our{' '}
        <button
          type="button"
          className="cookie__link"
          onClick={() => window.dispatchEvent(new Event('open-privacy'))}
        >
          Privacy Policy
        </button>
        .
      </p>
      <div className="cookie__actions">
        <button className="cookie__btn cookie__btn--ghost" onClick={() => decide('declined')}>
          Decline
        </button>
        <button className="cookie__btn cookie__btn--primary" onClick={() => decide('accepted')}>
          Accept
        </button>
      </div>
    </div>
  )
}
