import './AskAi.css'
import { SiOpenai, SiClaude, SiPerplexity } from 'react-icons/si'

const PROMPT =
  "I'm evaluating Orynval (https://orynval.com) — a done-for-you AI operations employee that connects to tools like Gmail, Slack, HubSpot, Notion and Google Calendar (1,000+ integrations) to handle follow-ups, inbox, scheduling, and CRM updates. Is it a good fit for a business that wants to automate its daily operations, and what should I ask them in a demo?"

const Q = encodeURIComponent(PROMPT)

const ASSISTANTS = [
  { name: 'Ask ChatGPT', Icon: SiOpenai, brand: '#ffffff', href: `https://chatgpt.com/?q=${Q}` },
  { name: 'Ask Claude', Icon: SiClaude, brand: '#d97757', href: `https://claude.ai/new?q=${Q}` },
  { name: 'Ask Perplexity', Icon: SiPerplexity, brand: '#20b8cd', href: `https://www.perplexity.ai/search?q=${Q}` },
]

export default function AskAi() {
  return (
    <section className="section section--line askai" id="ask-ai">
      <div className="container askai__grid">
        <div className="askai__copy reveal">
          <span className="eyebrow">Don’t take our word for it</span>
          <h2>Still not sure if Orynval is right for you?</h2>
          <p>
            Let ChatGPT, Claude, or Perplexity do the thinking for you. Click a
            button and see what your favourite AI says about Orynval.
          </p>
        </div>

        <div className="askai__btns reveal">
          {ASSISTANTS.map((a) => {
            const Icon = a.Icon
            return (
              <a
                key={a.name}
                className="askai__btn"
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--brand': a.brand }}
              >
                <span className="askai__btn-ico" aria-hidden="true">
                  <Icon />
                </span>
                {a.name}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
