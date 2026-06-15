import { useEffect, useState } from 'react'
import './Nav.css'

const LINKS = [
  { href: '#what', label: 'Capabilities' },
  { href: '#console', label: 'Product' },
  { href: '#why', label: 'Why us' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label="Orynval home">
          <span className="nav__word">Orynval</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__cta">
          <a href="#demo" className="btn btn-primary nav__book">
            Free Audit
          </a>
          <button
            className="nav__burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="#demo"
            className="btn btn-primary"
            onClick={() => setOpen(false)}
          >
            Free Audit
          </a>
        </div>
      )}
    </header>
  )
}
