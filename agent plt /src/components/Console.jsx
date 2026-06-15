import './Console.css'

const METRICS = [
  { label: 'Emails handled', value: '128', delta: '+19' },
  { label: 'Meetings booked', value: '14', delta: '+3' },
  { label: 'CRM updates', value: '96', delta: '+24' },
  { label: 'Follow-ups sent', value: '42', delta: '+11' },
]

const FEED = [
  { text: 'Replied to 5 new leads and sent intake details', tag: 'Gmail', time: '09:42' },
  { text: 'Booked a product demo for Thursday 14:00', tag: 'Calendar', time: '09:38' },
  { text: 'Updated 8 opportunities and logged call notes', tag: 'HubSpot', time: '09:31' },
  { text: 'Chased an overdue invoice — payment confirmed', tag: 'Email', time: '09:20' },
  { text: 'Sent follow-ups to 12 stalled conversations', tag: 'WhatsApp', time: '08:54' },
]

const REPORT = [
  '128 emails handled, 14 meetings booked',
  '96 CRM records updated, 42 follow-ups sent',
  'Every routine request answered on time',
]

// ----- tiny smooth-area chart (no deps) -----
const SERIES = [10, 26, 20, 38, 33, 55, 48, 70, 84, 96]
const X_LABELS = ['8a', '9a', '10a', '11a', '12p', '1p']
const W = 600
const H = 150
const PAD_T = 16
const PAD_B = 12

function buildChart(data) {
  const max = Math.max(...data)
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - PAD_B - (v / max) * (H - PAD_T - PAD_B),
  ])
  // Catmull-Rom → cubic bezier for a smooth line
  let line = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    line += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`
  }
  const area = `${line} L ${W} ${H} L 0 ${H} Z`
  return { line, area, last: pts[pts.length - 1] }
}

const CHART = buildChart(SERIES)

export default function Console() {
  return (
    <section className="section console-sec" id="console">
      <div className="container">
        <div className="section-head console-sec__head reveal">
          <span className="eyebrow">The product</span>
          <h2>Your operations, running on their own.</h2>
          <p>A live workspace that completes real work, logs everything, and reports back.</p>
        </div>

        <div className="console reveal">
          {/* App chrome */}
          <header className="console__chrome">
            <div className="console__id">
              <span className="console__dots">
                <i /> <i /> <i />
              </span>
              <span className="console__app">Orynval — Operations</span>
            </div>
            <div className="console__live">
              <span className="console__live-dot" />
              Active · Tue, 09:43
            </div>
          </header>

          {/* Metric tiles */}
          <div className="console__metrics">
            {METRICS.map((m) => (
              <div key={m.label} className="metric">
                <span className="metric__label">{m.label}</span>
                <span className="metric__value">
                  {m.value}
                  <span className="metric__delta">{m.delta}</span>
                </span>
                <span className="metric__bar" aria-hidden="true">
                  <span className="metric__bar-fill" />
                </span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="console__chart chart">
            <div className="chart__head">
              <div className="chart__title">
                <span className="chart__label">Work completed</span>
                <span className="chart__value">
                  284 <span className="chart__unit">tasks today</span>
                </span>
              </div>
              <span className="chart__trend">▲ 32% vs. yesterday</span>
            </div>
            <div className="chart__plot">
              <svg
                className="chart__svg"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="orynFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((g) => (
                  <line
                    key={g}
                    className="chart__grid"
                    x1="0"
                    x2={W}
                    y1={H * g}
                    y2={H * g}
                  />
                ))}
                <path className="chart__area" d={CHART.area} fill="url(#orynFill)" />
                <path className="chart__line" d={CHART.line} />
                <circle
                  className="chart__pt"
                  cx={CHART.last[0]}
                  cy={CHART.last[1]}
                  r="3.5"
                />
              </svg>
              <div className="chart__x">
                {X_LABELS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Body: live feed + daily report */}
          <div className="console__body">
            <div className="console__feed">
              <div className="console__col-head">
                <span>Live activity</span>
                <span className="console__col-meta">today</span>
              </div>
              <ul>
                {FEED.map((f, i) => (
                  <li
                    key={i}
                    className="feed-item"
                    style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                  >
                    <span className="feed-item__text">{f.text}</span>
                    <span className="feed-item__tag">{f.tag}</span>
                    <span className="feed-item__time">{f.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="console__side">
              <div className="report">
                <div className="report__head">
                  <span className="report__title">Daily report</span>
                  <span className="report__sent">sent 08:00</span>
                </div>
                <ul className="report__list">
                  {REPORT.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="approval">
                <div className="approval__top">
                  2 actions waiting for your approval
                </div>
                <p className="approval__sub">
                  Sensitive emails and changes pause here until you say go.
                </p>
                <span className="approval__cta">Review &amp; approve</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
