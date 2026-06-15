import { useEffect, useState } from 'react'
import './PrivacyModal.css'

/** Event the footer / cookie banner dispatches to open this modal. */
export const OPEN_PRIVACY = 'open-privacy'

const CONTACT_EMAIL = 'saar.medan@gmail.com'
const LAST_UPDATED = 'June 8, 2026'

export default function PrivacyModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(OPEN_PRIVACY, show)
    return () => window.removeEventListener(OPEN_PRIVACY, show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="privacy" onClick={() => setOpen(false)}>
      <div
        className="privacy__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Privacy Policy"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="privacy__close" onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>

        <div className="privacy__body">
          <h2>Privacy Policy</h2>
          <p className="privacy__updated">Last updated: {LAST_UPDATED}</p>

          <p>
            This Privacy Policy explains how Orynval collects, uses, and protects
            information when you visit our website. By using the site, you agree to
            the practices described below.
          </p>

          <h3>1. Information we collect</h3>
          <ul>
            <li>Details you submit through forms (such as name, email, and company when booking a demo).</li>
            <li>Usage data such as pages visited, referrer, browser type, device, and IP address.</li>
            <li>Visitor identification data — see the next section.</li>
          </ul>

          <h3>2. Website visitor analytics (Apollo.io)</h3>
          <p>
            We use{' '}
            <a href="https://www.apollo.io/" target="_blank" rel="noopener noreferrer">
              Apollo.io
            </a>{' '}
            visitor tracking to understand which organizations engage with our site.
            When you visit our pages, a script loads from Apollo and processes:
          </p>
          <ul>
            <li>your IP address, which Apollo may match to a company (available globally);</li>
            <li>in the United States only, information used to identify an individual visitor;</li>
            <li>page URLs, referrer, and an identifier used to recognize returning visitors.</li>
          </ul>
          <p>
            This data is processed by Apollo on our behalf. See the{' '}
            <a href="https://www.apollo.io/privacy-policy" target="_blank" rel="noopener noreferrer">
              Apollo Privacy Policy
            </a>
            . You can opt out at any time using &ldquo;Cookie settings&rdquo; in the footer.
          </p>

          <h3>3. How we use information</h3>
          <ul>
            <li>To operate, maintain, and improve the site.</li>
            <li>To respond to demo requests and inquiries.</li>
            <li>To understand engagement and reach relevant businesses.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h3>4. Cookies and tracking</h3>
          <p>
            We and our providers (including Apollo) use cookies and similar
            technologies. Analytics start when you arrive on the site. You can opt
            out at any time by choosing &ldquo;Decline&rdquo; in the cookie banner or
            &ldquo;Cookie settings&rdquo; in the footer, or by controlling cookies
            through your browser.
          </p>

          <h3>5. Your rights</h3>
          <p>
            Depending on your location, you may have rights to access, correct, or
            delete your personal data, and to object to or restrict certain
            processing (for example under the GDPR or CCPA). To exercise these
            rights, contact us below.
          </p>

          <h3>6. Data sharing</h3>
          <p>
            We do not sell your personal data. We share information only with service
            providers (such as Apollo and our hosting providers) who process it on
            our behalf, or where required by law.
          </p>

          <h3>7. Contact</h3>
          <p>
            Questions about this policy or your data? Contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
