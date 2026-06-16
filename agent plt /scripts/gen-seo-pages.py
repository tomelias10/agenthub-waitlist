#!/usr/bin/env python3
"""Generate new static SEO landing pages matching the existing public/<slug>/index.html template."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
BASE = "https://orynval.netlify.app"

STYLE = (
    "body{margin:0;background:#08080a;color:#fff;font-family:Inter,Arial,sans-serif;line-height:1.62}"
    ".wrap{max-width:980px;margin:0 auto;padding:72px 22px}"
    ".eyebrow{color:#9dff70;text-transform:uppercase;letter-spacing:.12em;font-size:13px;font-weight:800}"
    "h1{font-size:clamp(42px,7vw,78px);line-height:1.02;margin:18px 0;letter-spacing:-.05em}"
    "h2{font-size:32px;margin-top:58px;letter-spacing:-.03em}"
    ".lead{font-size:22px;color:#c7cad4;max-width:780px}"
    ".card{background:#111217;border:1px solid #2b2d35;border-radius:24px;padding:28px;margin:22px 0}"
    ".grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}"
    ".cta{display:inline-block;margin-top:28px;background:#9dff70;color:#08080a;padding:16px 24px;border-radius:999px;text-decoration:none;font-weight:800}"
    ".muted{color:#a7abb7}li{margin:10px 0}a{color:#9dff70}"
    ".nav{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:42px}.nav a{color:#c7cad4;text-decoration:none}.nav a:hover{color:#fff}"
    ".small{font-size:14px;color:#858a98}"
)

TRACK = """<script>
(function(){
  if(navigator.doNotTrack==='1'||navigator.globalPrivacyControl)return;
  function send(type,payload){
    try{
      var body=JSON.stringify(Object.assign({type:type,path:location.pathname,title:document.title,referrer:document.referrer||''},payload||{}));
      if(navigator.sendBeacon&&navigator.sendBeacon('/api/track',new Blob([body],{type:'application/json'})))return;
      fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:body,keepalive:true}).catch(function(){});
    }catch(e){}
  }
  send('pageview',{meta:{section:'static_seo_page'}});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="#demo"],a[href="/"]');
    if(a)send('cta_click',{name:'static_page_cta',meta:{placement:'static_seo_page',label:(a.textContent||'').trim().slice(0,80)}});
  },{capture:true});
})();
</script>"""

CARDS = """<div class="grid">
          <div class="card"><strong>Lead response</strong><p class="muted">Reply faster, ask the right qualifying questions, and move warm prospects to the next step automatically.</p></div>
          <div class="card"><strong>Follow-ups</strong><p class="muted">Keep every conversation alive without forcing your team to remember each manual nudge.</p></div>
          <div class="card"><strong>CRM and records</strong><p class="muted">Update statuses, notes, tasks, reminders, and summaries in the systems your team already uses.</p></div>
          <div class="card"><strong>Scheduling and reminders</strong><p class="muted">Handle booking, rescheduling, confirmations, and next-action reminders end to end.</p></div>
        </div>"""

RELATED = [
    ("/ai-operations-employee/", "AI operations employee"),
    ("/lead-follow-up-automation/", "Lead follow-up automation"),
    ("/crm-automation-for-small-business/", "CRM automation for small business"),
    ("/ai-inbox-assistant-for-business/", "AI inbox assistant for business"),
    ("/done-for-you-ai-automation/", "Done-for-you AI automation"),
]

PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <link rel="canonical" href="{base}/{slug}/" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:image" content="{base}/og-image.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <style>{style}</style>
  <script type="application/ld+json">{{"@context":"https://schema.org","@type":"Service","name":"{h1}","provider":{{"@type":"Organization","name":"Orynval","url":"{base}/"}},"description":"{desc}","url":"{base}/{slug}/"}}</script>
</head>
<body><main class="wrap">
  <nav class="nav"><a href="/">Orynval</a><a href="/solutions/">Solutions</a><a href="/#demo">Free workflow audit</a></nav>
  <p class="eyebrow">{eyebrow}</p>
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>
  <a class="cta" href="/#demo">Get a free workflow audit</a>
  <section class="card"><h2>Who this is for</h2><p class="muted">{who}</p></section>

        <h2>What Orynval can automate first</h2>
        {cards}
        <h2>Why this brings warmer leads</h2>
        <p class="muted">{why}</p>
        <h2>Related Orynval solutions</h2>
        <ul>
          {related}
        </ul>

  <section class="card"><h2>Get a practical automation plan</h2><p class="muted">If this workflow is costing time, leads, or consistency, request a free workflow audit. Orynval will map the first AI employee worth building for your business.</p><a class="cta" href="/#demo">Request the audit</a></section>
  <p class="small">&copy; Orynval &middot; Custom AI operations employees</p>
</main>
{track}
</body>
</html>
"""

PAGES = [
    {
        "slug": "ai-operations-employee",
        "title": "AI Operations Employee for Service Businesses — Orynval",
        "desc": "An AI operations employee that handles follow-ups, inbox, CRM updates, scheduling and reporting 24/7. Built, connected and managed for you. Less than a hire.",
        "eyebrow": "AI operations employee",
        "h1": "The AI operations employee your business should have hired last year",
        "lead": "It never takes a sick day, never forgets a follow-up, and works around the clock. An AI operations employee from Orynval handles the repetitive work eating your team's best hours — for less than a part-time hire, fully built and managed for you.",
        "who": "Best for founders and operations leaders at service businesses with 5–50 people who lose time or leads to manual follow-ups, inbox overload, and out-of-date CRMs.",
        "why": "People search for an ‘AI operations employee’ when they are actively choosing between hiring another person and automating the busywork. This page meets that decision moment and moves the visitor into a free workflow audit.",
    },
    {
        "slug": "ai-receptionist-for-small-business",
        "title": "AI Receptionist for Small Business — Orynval",
        "desc": "An AI receptionist that answers inquiries instantly, qualifies leads, books appointments and routes messages 24/7 — done-for-you and managed, with approvals on anything sensitive.",
        "eyebrow": "AI receptionist",
        "h1": "An AI receptionist that never misses an inquiry",
        "lead": "Every missed call, slow reply, or unanswered form is a customer handed to a competitor. Orynval installs a managed AI receptionist that responds instantly, qualifies the lead, books the appointment, and keeps your records updated — around the clock.",
        "who": "Best for small service businesses, clinics, and local companies that lose leads after hours or when the front desk is busy.",
        "why": "Owners search for an ‘AI receptionist’ when phone tag and slow replies are already costing them bookings. This page matches that intent and converts it into a free workflow audit.",
    },
    {
        "slug": "ai-agent-for-accountants",
        "title": "AI Agent for Accountants & Accounting Firms — Orynval",
        "desc": "A managed AI operations employee for accountants: automate client follow-ups, document requests, reminders, inbox triage and CRM updates — with human approval on sensitive actions.",
        "eyebrow": "Accounting firms",
        "h1": "A managed AI operations employee for accountants and accounting firms",
        "lead": "Accounting teams lose billable hours chasing documents, sending reminders, and answering the same client questions. Orynval automates those operational workflows while keeping every sensitive action under your control.",
        "who": "Best for accounting and bookkeeping firms that spend too much time on client follow-up, document collection, and administrative coordination.",
        "why": "Accountants search for AI help when deadline-season admin is overwhelming their team. This page meets that pain and moves the visitor into a free workflow audit.",
    },
    {
        "slug": "ai-agent-for-sales-teams",
        "title": "AI Agent for Sales Teams — Orynval",
        "desc": "An AI operations employee for sales teams: instant lead follow-up, automatic CRM updates, scheduling and reporting so reps sell instead of doing admin. Done-for-you and managed.",
        "eyebrow": "Sales teams",
        "h1": "An AI operations employee that lets your sales team actually sell",
        "lead": "Reps spend up to a third of their week logging activity, updating the CRM, and chasing follow-ups. Orynval automates that operational layer so your team spends time on conversations that close — with approvals on anything sensitive.",
        "who": "Best for sales teams and revenue leaders who want faster lead response, a clean CRM, and reps focused on selling instead of data entry.",
        "why": "Sales leaders search for AI help when slow follow-up and CRM hygiene are quietly costing them pipeline. This page matches that intent and converts it into a free workflow audit.",
    },
]


def related_html(current_slug):
    items = [f'<li><a href="{href}">{label}</a></li>' for href, label in RELATED if href.strip("/") != current_slug]
    return "\n          ".join(items)


def main():
    written = []
    for p in PAGES:
        html = PAGE.format(
            title=p["title"], desc=p["desc"], slug=p["slug"], base=BASE,
            style=STYLE, h1=p["h1"], eyebrow=p["eyebrow"], lead=p["lead"],
            who=p["who"], cards=CARDS, why=p["why"],
            related=related_html(p["slug"]), track=TRACK,
        )
        out = PUBLIC / p["slug"]
        out.mkdir(parents=True, exist_ok=True)
        (out / "index.html").write_text(html, encoding="utf-8")
        written.append(p["slug"])
        print("wrote", out / "index.html")
    print("\nDone:", len(written), "pages")


if __name__ == "__main__":
    main()
