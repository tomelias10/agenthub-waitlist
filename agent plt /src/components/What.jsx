import { useEffect, useState } from 'react'
import './What.css'
import { ToolIcon } from './toolIcons'

const CATS = [
  {
    k: 'Communication',
    teaser: 'Email, Slack, Teams, calls & follow-ups',
    tools: ['gmail', 'slack', 'teams', 'outlook'],
    d: 'Reads and replies across email, Slack, and Microsoft Teams, places and summarises calls, and keeps every follow-up on track.',
  },
  {
    k: 'Calendar & Scheduling',
    teaser: 'Booking, reminders, rescheduling',
    tools: ['gcal', 'outlook'],
    d: 'Books, reschedules, and sends reminders across Google Calendar and Outlook — and prepares you for the day ahead.',
  },
  {
    k: 'CRM & Sales',
    teaser: 'Pipeline, leads & customer notes',
    tools: ['hubspot', 'airtable'],
    d: 'Updates HubSpot and Airtable, logs customer notes, chases leads, and keeps your pipeline current.',
  },
  {
    k: 'Documents & Knowledge',
    teaser: 'Drive, Docs, Notion — search & summaries',
    tools: ['drive', 'docs', 'notion'],
    d: 'Searches Google Drive, Docs, and Notion, drafts documents, and turns long threads into clean summaries.',
  },
  {
    k: 'Data & Operations',
    teaser: 'Sheets, Supabase, Airtable, reports',
    tools: ['sheets', 'supabase', 'airtable'],
    d: 'Reads and updates Google Sheets, Supabase, and Airtable, compiles reports, and runs routine internal updates.',
  },
  {
    k: 'Product & Engineering',
    teaser: 'Jira, Linear, GitHub — issue routing',
    tools: ['jira', 'linear', 'github'],
    d: 'Creates and routes issues in Jira and Linear, tracks GitHub activity, and keeps tasks moving.',
  },
]

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default function What() {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (open === null) return
    const onDown = (e) => {
      if (!e.target.closest('.cap')) setOpen(null)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section className="section section--line caps" id="what">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Capabilities</span>
          <h2>Everything your team handles. Connected in one place.</h2>
          <p>
            Orynval can read, write, update, schedule, organize and trigger
            actions across your business stack.
          </p>
        </div>

        <div className="caps__grid reveal">
          {CATS.map((c, i) => (
            <div className={`cap ${open === i ? 'cap--open' : ''}`} key={c.k}>
              <div className="cap__top">
                <span className="cap__label">{c.k}</span>
                <button
                  className="cap__btn"
                  aria-expanded={open === i}
                  aria-label={`More about ${c.k}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <PlusIcon />
                </button>
              </div>
              <p className="cap__teaser">{c.teaser}</p>
              <div className="cap__logos">
                {c.tools.map((t) => (
                  <ToolIcon key={t} k={t} size={17} />
                ))}
              </div>

              {open === i && (
                <div className="cap__pop" role="dialog" aria-label={c.k}>
                  <button
                    className="cap__pop-x"
                    aria-label="Close"
                    onClick={() => setOpen(null)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                  <span className="cap__pop-title">{c.k}</span>
                  <p>{c.d}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
