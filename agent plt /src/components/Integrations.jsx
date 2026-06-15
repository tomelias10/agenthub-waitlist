import './Integrations.css'
import { INTEGRATIONS, TOOL } from './toolIcons'

export default function Integrations() {
  return (
    <section className="section integ section--line" id="integrations">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">One employee. Every tool.</span>
          <h2>
            One AI employee.
            <br />
            Connected to your entire business.
          </h2>
          <p>
            Orynval works inside the tools your team already uses — email,
            calendars, CRMs, documents, spreadsheets, messaging apps, databases
            and more.
          </p>
        </div>

        <div className="integ__stage reveal">
          <span className="integ__badge">
            <span className="integ__badge-dot" />
            1,000+ supported integrations
          </span>

          <div className="orb">
            <span className="orb__avatar">AE</span>
            <div className="orb__meta">
              <span className="orb__name">Orynval · Main agent</span>
              <span className="orb__status">
                <span className="orb__dot" /> Connected · delegating tasks
              </span>
            </div>
          </div>

          <span className="integ__stem" aria-hidden="true" />

          <div className="integ__cloud">
            {INTEGRATIONS.map((k) => {
              const t = TOOL[k]
              const Icon = t.Icon
              return (
                <div className="integ__pill" key={k}>
                  <span
                    className="integ__ico"
                    style={{ color: t.color }}
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                  {t.name}
                </div>
              )
            })}
            <div className="integ__pill integ__pill--more">+1,000 more tools</div>
          </div>

          <p className="integ__line">
            Connects with Gmail, Slack, Notion, HubSpot, Google Workspace,
            Microsoft 365 and 1,000+ more tools through secure integrations.
          </p>

          <a href="#demo" className="btn btn-primary btn-lg integ__cta">
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  )
}
