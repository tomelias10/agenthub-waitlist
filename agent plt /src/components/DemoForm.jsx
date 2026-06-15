import { useState } from 'react'
import './DemoForm.css'
import { track } from '../lib/analytics'

const INDUSTRIES = [
  'Sales / SaaS',
  'Agency / consultancy',
  'Professional services (law, accounting…)',
  'Clinic / healthcare',
  'Real estate',
  'Ecommerce / retail',
  'Other',
]

const POINTS = [
  'A practical audit of the repetitive work costing you leads or hours',
  'A clear first-agent plan based on your tools and workflow',
  'No generic AI pitch — only workflows that can realistically be automated',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function DemoForm() {
  const [started, setStarted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    notes: '',
    company_website: '', // honeypot — real users leave this empty
  })
  const [status, setStatus] = useState('idle') // idle | error | submitting | success
  const [error, setError] = useState('')

  const update = (key) => (e) => {
    if (!started && key !== 'company_website') {
      setStarted(true)
      track('form_start', { form: 'free_workflow_audit', meta: { placement: 'demo_form' } })
    }
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      setStatus('error')
      setError('Please enter your name.')
      track('form_error', { form: 'free_workflow_audit', meta: { result: 'missing_name' } })
      return
    }
    if (!EMAIL_RE.test(form.email)) {
      setStatus('error')
      setError('Please enter a valid work email.')
      track('form_error', { form: 'free_workflow_audit', meta: { result: 'invalid_email' } })
      return
    }
    if (!form.company.trim()) {
      setStatus('error')
      setError('Please add your company name.')
      track('form_error', { form: 'free_workflow_audit', meta: { result: 'missing_company' } })
      return
    }

    setStatus('submitting')
    setError('')
    track('form_submit', { form: 'free_workflow_audit', meta: { placement: 'demo_form' } })

    try {
      // Posts to the Netlify function, which creates a lead on monday.com.
      // The monday API token stays server-side (see netlify/functions/demo.js).
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'orynval-landing' }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      track('form_success', { form: 'free_workflow_audit', meta: { result: 'monday_created' } })
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again or email us directly.')
      track('form_error', { form: 'free_workflow_audit', meta: { result: 'network_or_server' } })
    }
  }

  return (
    <section className="section demo" id="demo">
      <div className="container demo__inner">
        <div className="demo__copy reveal">
          <span className="eyebrow">Free workflow audit</span>
          <h2>Find the first AI employee your business should install.</h2>
          <p className="demo__lead">
            Tell us where leads, customers, inboxes, CRM updates, or daily tasks
            get stuck. We’ll map the highest-value automation and show what your
            first Orynval employee should handle.
          </p>
          <ul className="demo__points">
            {POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="demo__card reveal">
          {status === 'success' ? (
            <div className="demo__success" role="status">
              <h3>Request received.</h3>
              <p>
                Thanks, {form.name.split(' ')[0] || 'there'} — we’ll be in touch
                within one business day to schedule your demo.
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setForm({
                    name: '',
                    email: '',
                    company: '',
                    industry: '',
                    notes: '',
                    company_website: '',
                  })
                  setStatus('idle')
                }}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form className="demo__form" onSubmit={handleSubmit} noValidate>
              <h3 className="demo__form-title">Request your free workflow audit</h3>

              {/* Honeypot — hidden from real users, catches bots */}
              <input
                className="demo__hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.company_website}
                onChange={update('company_website')}
              />

              <div className="demo__row">
                <label className="field">
                  <span>Full name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Jane Cooper"
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>Work email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="jane@company.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="demo__row">
                <label className="field">
                  <span>Company</span>
                  <input
                    type="text"
                    value={form.company}
                    onChange={update('company')}
                    placeholder="Acme Inc."
                    autoComplete="organization"
                  />
                </label>
                <label className="field">
                  <span>Industry</span>
                  <select value={form.industry} onChange={update('industry')}>
                    <option value="">Select…</option>
                    {INDUSTRIES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field">
                <span>
                  What repetitive work is costing you time, leads, or money?
                </span>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={update('notes')}
                  placeholder="e.g. new leads wait too long, CRM is never updated, follow-ups are manual, invoices are chased by hand, meetings take too much coordination…"
                />
              </label>

              {status === 'error' && (
                <p className="demo__error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg demo__submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Get My Free Workflow Audit'}
              </button>

              <p className="demo__privacy">
                No spam. We’ll only use your details to arrange your demo.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
