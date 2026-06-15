import './Pricing.css'

const PLANS = [
  {
    name: 'Launch',
    tagline: 'For small teams automating their first workflow',
    setup: '$1,490',
    monthly: '$590',
    features: [
      'One core workflow, built for you',
      'Up to 3 tool integrations',
      'Email, calendar &amp; CRM handling',
      'Daily activity summaries',
      'Email support &amp; monthly tuning',
    ],
    cta: 'Book a Demo',
    featured: false,
  },
  {
    name: 'Growth',
    tagline: 'For growing teams that run on operations',
    setup: '$2,990',
    monthly: '$1,290',
    features: [
      'Multiple workflows, fully built',
      'Up to 6 core tool integrations',
      'Inbox, follow-ups, scheduling &amp; CRM',
      'Custom rules, approvals &amp; tone of voice',
      'Priority support &amp; continuous improvement',
      'Dedicated implementation manager',
    ],
    cta: 'Book a Demo',
    featured: true,
  },
  {
    name: 'Scale',
    tagline: 'For multi-team and high-volume operations',
    setup: 'Custom',
    monthly: 'Custom',
    features: [
      'Multi-department Orynval employees',
      'Bespoke integrations &amp; systems',
      'Advanced workflows &amp; routing',
      'SLA, onboarding &amp; training for your team',
      'Hands-on account management',
    ],
    cta: 'Talk to us',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="section-head pricing__head reveal">
          <span className="eyebrow">Pricing</span>
          <h2>Less than a hire. More than a tool.</h2>
          <p>
            A one-time build fee to set up your Orynval employee, then a flat
            monthly fee while we run and improve it for you. Simple monthly
            pricing after implementation.
          </p>
        </div>

        <div className="pricing__grid">
          {PLANS.map((p, i) => (
            <article
              key={p.name}
              className={`price ${p.featured ? 'price--featured' : ''} reveal`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {p.featured && <span className="price__badge">Most popular</span>}
              <h3 className="price__name">{p.name}</h3>
              <p
                className="price__tag"
                dangerouslySetInnerHTML={{ __html: p.tagline }}
              />

              <div className="price__amount">
                <span className="price__monthly">{p.monthly}</span>
                {p.monthly !== 'Custom' && (
                  <span className="price__per">/ month</span>
                )}
              </div>
              <p className="price__setup">
                {p.setup === 'Custom' ? 'Custom build fee' : `${p.setup} one-time build`}
              </p>

              <a
                href="#demo"
                className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} price__cta`}
              >
                {p.cta}
              </a>

              <ul className="price__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <span dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="pricing__fine">
          Prices in USD ($), excluding tax. Final pricing is confirmed after a
          short discovery call.
        </p>
      </div>
    </section>
  )
}
