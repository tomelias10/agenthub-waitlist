import './Footer.css'

const fire = (name) => () => window.dispatchEvent(new Event(name))

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'What it does', href: '#what' },
      { label: 'How it works', href: '#how' },
      { label: 'Use cases', href: '#use-cases' },
      { label: 'Comparison', href: '#compare' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Book a demo', href: '#demo' },
      { label: 'Contact', href: 'mailto:hello@orynval.com' },
      { label: 'Privacy', onClick: fire('open-privacy') },
      { label: 'Cookie settings', onClick: fire('open-cookie-settings') },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" className="footer__word">Orynval</a>
            <p className="footer__tagline">
              A done-for-you AI operations employee — built, trained, and run for
              your business.
            </p>
            <a href="#demo" className="btn btn-primary footer__cta">
              Book a Demo
            </a>
          </div>

          <div className="footer__cols">
            {COLS.map((col) => (
              <div key={col.title} className="footer__col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.onClick ? (
                        <button type="button" className="footer__linkbtn" onClick={l.onClick}>
                          {l.label}
                        </button>
                      ) : (
                        <a href={l.href}>{l.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Orynval. All rights reserved.</p>
          <p className="footer__loc">Custom AI operations employees · Israel</p>
        </div>
      </div>
    </footer>
  )
}
