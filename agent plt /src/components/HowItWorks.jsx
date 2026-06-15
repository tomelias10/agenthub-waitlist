import './HowItWorks.css'

const STEPS = [
  {
    n: '01',
    tag: 'Week 1',
    title: 'We map your operations',
    body: 'A working session to learn your tools, workflows, and the tasks that eat your time. You talk; we listen.',
  },
  {
    n: '02',
    tag: 'Week 1–2',
    title: 'We build your employee',
    body: 'Built and configured from scratch — trained on your business and tone, connected to your email, CRM, calendar, and tools.',
  },
  {
    n: '03',
    tag: 'Week 2–3',
    title: 'We test it with you',
    body: 'It runs on real tasks alongside you. We refine its judgment until it works like a reliable teammate.',
  },
  {
    n: '04',
    tag: 'Ongoing',
    title: 'We run it for you',
    body: 'It goes live and works every day. We monitor, improve, and support it — you get the output, not the upkeep.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2>Done-for-you, from first call to fully running.</h2>
          <p>
            You don’t build, configure, or maintain anything. We handle the
            entire implementation and keep it running.
          </p>
        </div>

        <ol className="how__steps reveal">
          {STEPS.map((s) => (
            <li key={s.n} className="how__step">
              <div className="how__num">
                <span>{s.n}</span>
              </div>
              <span className="how__tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
