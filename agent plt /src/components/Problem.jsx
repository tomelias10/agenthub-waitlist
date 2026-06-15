import './Problem.css'

const POINTS = [
  {
    t: 'Saves you hours, every day',
    d: 'Hands off the operational busywork so your team focuses on real work.',
  },
  {
    t: 'Responds in seconds',
    d: 'Answers leads and customers instantly, day or night — never a missed message.',
  },
  {
    t: 'Handles leads & customers end to end',
    d: 'Qualifies, follows up, books, and updates your records — without being prompted.',
  },
  {
    t: 'Works across every channel',
    d: 'Email, phone, WhatsApp, and your CRM — one employee, all your tools.',
  },
  {
    t: 'A real employee, not a chatbot',
    d: 'Trained on your business, acts on its own, and checks with you before anything sensitive.',
  },
]

export default function Problem() {
  return (
    <section className="section section--line why" id="why">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Why Orynval</span>
          <h2>Built to do the work, not just talk about it.</h2>
        </div>

        <ul className="why__list reveal">
          {POINTS.map((p) => (
            <li key={p.t} className="why__item">
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
