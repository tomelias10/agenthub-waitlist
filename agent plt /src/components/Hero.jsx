import './Hero.css'
import { trackCta } from '../lib/analytics'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <video
        className="hero__bg"
        src="/hero-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <h1 className="hero__title">
          Stop losing leads to
          <br />
          <span className="hero__accent">slow follow-ups</span>
        </h1>

        <p className="hero__sub">
          Orynval installs a custom AI operations employee into your business.
          It replies to new leads, follows up, books meetings, updates your CRM,
          and handles daily operations — built, connected, and managed for you.
        </p>

        <div className="hero__actions">
          <a
            href="#demo"
            className="btn btn-primary btn-lg"
            onClick={() => trackCta('hero_free_workflow_audit', { placement: 'hero' })}
          >
            Get a Free Workflow Audit
          </a>
          <a
            href="#how"
            className="btn btn-ghost btn-lg"
            onClick={() => trackCta('hero_see_how_it_works', { placement: 'hero' })}
          >
            See how it works
          </a>
        </div>

        <p className="hero__trust">
          Built for service businesses, agencies, clinics, real estate teams, and operators with too much manual work
        </p>
      </div>

      <a href="#console" className="hero__scroll" aria-label="Scroll to product">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </a>
    </section>
  )
}
