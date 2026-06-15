# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> The product spec / PRD lives further down under **"CLAUDE.md — Agent Employee Website PRD"**. That section is the source of truth for copy, positioning, sections, and pricing. The guide below describes how the code is actually built. Read both.

## Commands

```bash
npm run dev       # start Vite dev server (HMR) at localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint over the whole project
```

There is no test suite. Verification is visual: run `npm run dev` and confirm the page renders with no console errors.

## Stack

- **Vite 8 + React 19**, plain JSX (no TypeScript), `type: module`.
- **No UI/icon/animation libraries.** Despite the PRD mentioning lucide-react / framer-motion / Tailwind, none are installed. Icons are inline SVG/emoji, animation is CSS, styling is hand-written CSS. Keep it that way unless explicitly asked — do not add dependencies.

## Architecture

Single-page marketing site. Everything renders from [src/App.jsx](src/App.jsx), which composes the page as a flat, ordered list of section components:

```
Nav → Hero → Problem → What → HowItWorks → UseCases → Comparison → Pricing → DemoForm → Footer
```

Each section is a self-contained component in [src/components/](src/components/) with a **co-located CSS file** of the same name (e.g. `Hero.jsx` + `Hero.css`, imported at the top of the JSX). There is no shared component library — sections are independent. To add or reorder a section, edit the JSX list in `App.jsx`.

### Conventions that span files

- **Design tokens** live as CSS custom properties in [src/index.css](src/index.css) `:root` (surfaces, borders, text, the single green `--accent`, radii, shadows, `--maxw`, fonts). Use these tokens rather than hardcoding colors. Dark theme only. The ambient page glow is a fixed `body::before` gradient.
- **Layout primitives** also in `index.css`: `.container` (centered, `--maxw`), `.section`, `.eyebrow`, `.btn` / `.btn-primary` / `.btn-ghost` / `.btn-lg`. Reuse these classes instead of restyling per section.
- **Scroll reveal animation**: add the class `reveal` to any element; [src/hooks/useReveal.js](src/hooks/useReveal.js) (called once in `App.jsx`) uses an IntersectionObserver to add an `in` class as it enters the viewport, driving a CSS fade/slide. Presentational only.
- **In-page nav** is anchor-based: `Nav` links point at section `id`s (`#what`, `#how`, `#use-cases`, `#compare`, `#pricing`, `#demo`) and `html { scroll-behavior: smooth }` handles scrolling. When adding a section that nav links to, give it the matching `id`.
- **Content as data**: list-style sections keep their content in a module-level array at the top of the component (e.g. `PLANS` in `Pricing.jsx`, `LINKS` in `Nav.jsx`, `INDUSTRIES`/`POINTS` in `DemoForm.jsx`) and `.map()` over it. Edit copy by editing those arrays. Note these strings use HTML entities like `&amp;`.

### Waitlist / demo form

[src/components/DemoForm.jsx](src/components/DemoForm.jsx) is the conversion form. It is **frontend-only**: a `status` state machine (`idle → submitting → success | error`) with client-side validation and a simulated 900ms submit. The real backend hook is a `// TODO` comment inside `handleSubmit` — wire a `fetch` there to connect a CRM/endpoint. No secrets in frontend code.

### SEO

Meta tags, Open Graph, fonts (Inter + JetBrains Mono via Google Fonts), and theme-color are in [index.html](index.html), not injected at runtime.

---

# CLAUDE.md — Agent Employee Website PRD

## Project Name

Agent Employee

## Project Type

Premium marketing website for a done-for-you custom AI Operations Employee service.

This is NOT a voice agent product.
This is NOT a generic chatbot.
This is NOT a cheap self-serve AI helper marketplace.
This is NOT a SaaS dashboard yet.

This website sells a premium managed service where we build, connect, monitor, and improve a custom AI employee for each business.

---

## Current Technical Context

The project is already created with:

- Vite
- React
- JavaScript / JSX
- CSS

The current folder structure includes:

- index.html
- src/App.jsx
- src/App.css
- src/index.css
- src/main.jsx
- public/
- package.json
- vite.config.js
- CLAUDE.md

Build inside this existing Vite React project.

Do not convert to Next.js.
Do not create a new project.
Do not delete the existing Vite setup unless necessary.
Do not use backend/server code in version 1 unless explicitly requested.

---

## Main Business Positioning

Agent Employee installs custom AI operations employees into service businesses.

The customer is not buying software.
The customer is buying an implemented AI employee that works inside their business workflow.

Core positioning:

“We don’t sell another AI tool. We install a custom AI operations employee into your business.”

Hebrew meaning:

“אנחנו לא מוכרים עוד כלי AI. אנחנו מתקינים בעסק שלך עובד AI שמכיר את התהליך, מתחבר לכלים שלך ומבצע עבודה יומיומית.”

---

## Strategic Differentiation

Important competitors and alternatives:

- Sintra
- Lindy
- ChatGPT
- Claude
- Relevance AI
- Ema
- TeamDay
- Artisan
- 11x
- Local automation agencies
- Freelancers
- Internal employees using ChatGPT

The website must clearly explain why Agent Employee is different.

### Generic AI Tools

Generic AI tools are:

- Self-serve
- Require the user to configure everything
- Require prompts
- Usually disconnected from the real workflow
- Give generic outputs
- Do not take responsibility for the result
- Often feel like “another tool to manage”

### Agent Employee

Agent Employee is:

- Done-for-you
- Custom-installed
- Connected to the client’s actual tools
- Based on the client’s workflow
- Trained on business context and procedures
- Monitored and improved over time
- Managed as an ongoing service
- Focused on real operational work, not just chat

Use this key distinction throughout the website:

“Generic AI tools wait for prompts. Agent Employee gets work done.”

---

## What We Are Building

Build a high-converting premium landing website for Agent Employee.

The site should look modern, premium, slightly futuristic, and trustworthy.

It should be inspired by the idea of AI employees / digital workers, but it must not copy Sintra’s exact design, wording, characters, layout, images, icons, names, or branding.

The concept should be original:

## Visual Concept

“Your Custom AI Operations Employee”

A premium digital operations employee that connects to the business tools and handles recurring work.

The visual style should feel:

- Premium
- Clean
- Dark mode
- Business-focused
- Slightly playful but not childish
- Suitable for law firms, clinics, agencies, real estate companies, consultants, and service businesses
- More serious and custom than Sintra
- More personal and done-for-you than Lindy or ChatGPT

---

## Brand Direction

### Brand Name

Agent Employee

### Suggested Tagline

Custom AI Operations Employees for Service Businesses

### Main Hero Headline

Install a Custom AI Operations Employee Into Your Business

### Main Hero Subheadline

We build, connect, monitor, and improve your AI employee so it can handle follow-ups, emails, meetings, CRM updates, tasks, and daily operations — without you managing another tool.

### Primary CTA

Book a Demo

### Secondary CTA

See How It Works

### Alternative CTA

Build My AI Employee

---

## Audience

Primary audience:

- Small and medium service businesses
- Law firms
- Real estate agencies
- Clinics
- Agencies
- Consultants
- Financial service businesses
- Local businesses with many inbound leads
- Founders and business owners who are overwhelmed with operations

First vertical focus:

Law firms and professional service businesses.

Important:
For law firms, do NOT position this as “AI Lawyer”.
Do NOT claim legal advice.
Do NOT claim legal document expertise beyond operational support.
Position it as an operations employee for law firms.

Correct legal positioning:

- Client intake
- Follow-ups
- Scheduling
- CRM updates
- Task creation
- Meeting summaries
- Client reminders
- Document organization
- Internal admin support
- Drafting operational emails, not legal advice

---

## Core Offer

Agent Employee builds a custom AI operations employee that can:

- Read business context
- Understand company procedures
- Draft emails
- Handle follow-ups
- Summarize meetings
- Create and update tasks
- Coordinate schedules
- Update CRM
- Prepare daily or weekly reports
- Search internal knowledge
- Work through approved tools
- Notify the business owner when human approval is needed

This is a text-first AI employee.

It can operate through:

- Email
- WhatsApp
- Telegram
- Trello
- CRM
- Calendar
- Internal dashboard later

It is NOT a voice agent in version 1.

---

## Real Stack Behind The Service

The website should mention integrations and workflow capabilities, but do not overexplain technical infrastructure to customers.

Internal stack direction:

- Antigravity for building and maintaining the product
- Claude Code / Codex for coding assistance
- Hermes Agent as the runtime AI agent
- Orgo as the cloud computer / agent workspace
- Composio as the integration and authentication layer
- AgentMail as the optional agent inbox layer
- Obsidian as the business memory / second brain
- Granola for meeting notes
- Trello for client request boards
- Loom for async update videos
- Calendly for booking onboarding and review calls

Customer-facing language:

- Connected to your tools
- Business memory
- Request board
- Weekly improvements
- Workflow automation
- Human approval when needed
- Monitored and maintained

Avoid showing too much of the technical stack in the hero.
Technical details can be shown lower on the page in an “How it works behind the scenes” or “Built around your tools” section.

---

## Main Website Goal

The goal of the website is to convert visitors into demo calls.

Every major section should guide the user toward:

- Booking a demo
- Applying for an AI Employee
- Understanding pricing
- Understanding the difference between self-serve AI tools and Agent Employee

Primary conversion action:

Book a Demo

Secondary conversion action:

Apply for AI Employee

---

## Required Website Structure

Build a single-page landing website first.

Sections required in order:

1. Navbar
2. Hero Section
3. Problem Section
4. Solution Section
5. AI Employee Roles Section
6. How It Works Section
7. Use Cases Section
8. Integrations Section
9. Comparison Section
10. Pricing Section
11. Example Workflow Section
12. Trust / Why Us Section
13. FAQ Section
14. Final CTA Section
15. Footer

---

## Section Details

## 1. Navbar

Navbar items:

- Home
- How It Works
- Use Cases
- Pricing
- FAQ
- Book a Demo

Navbar requirements:

- Sticky top navbar
- Dark background with subtle blur
- Agent Employee logo text
- CTA button on desktop
- Mobile responsive menu or clean stacked layout
- Smooth scroll to sections

Logo text:

Agent Employee

Optional small label:

Custom AI Ops

---

## 2. Hero Section

Hero must immediately communicate:

- This is custom
- This is installed into the business
- This is not another AI tool
- This handles operations

Hero headline:

Install a Custom AI Operations Employee Into Your Business

Hero subheadline:

We build, connect, monitor, and improve your AI employee so it can handle follow-ups, emails, meetings, CRM updates, tasks, and daily operations — without you managing another tool.

CTA buttons:

- Book a Demo
- See How It Works

Hero visual:

Create a custom premium dashboard mockup.

Dashboard should show:

- AI employee status: Online
- Current workflow: Follow-up sequence running
- Connected tools: Email, Calendar, CRM, Trello, WhatsApp
- Today’s completed work:
  - 12 follow-ups drafted
  - 4 meetings prepared
  - 8 CRM records updated
  - 3 client reminders sent
- Human approval needed:
  - 2 emails waiting for approval

Use cards, glowing gradients, icons, and a clean dark interface.

Do not use external copyrighted screenshots.
Build the mockup with HTML/CSS only.

---

## 3. Problem Section

Headline:

Your business does not need another AI tool. It needs work to actually get done.

Explain that business owners lose time and money because:

- Leads are not followed up
- Client messages are forgotten
- Meeting notes are not turned into tasks
- CRM is not updated
- Emails wait too long
- Owners manage too many small operational tasks
- Tools exist, but nobody has time to operate them properly

Create 6 problem cards:

1. Missed Follow-ups
2. Unanswered Emails
3. Messy CRM
4. Meetings Without Action
5. Manual Admin Work
6. Too Many Tools

Each card should include a short explanation.

---

## 4. Solution Section

Headline:

Meet your custom AI operations employee.

Body:

Agent Employee is a done-for-you service. We map your workflow, build your AI employee, connect your tools, create the business memory, monitor performance, and improve it every week.

Key points:

- Built around your business
- Connected to your tools
- Uses your procedures
- Works through approved workflows
- Escalates when human approval is needed
- Improves over time

Visual idea:

Show a simple pipeline:

Business Workflow → Custom AI Employee → Connected Tools → Completed Work

---

## 5. AI Employee Roles Section

Headline:

Start with one employee. Expand into an AI operations team.

Do not position this like Sintra’s “12 helpers”.
The point is not a cheap library of helpers.
The point is one custom employee first, then expansion.

Show 6 possible AI employee roles:

### 1. Lead Intake Employee

Handles new inquiries, captures details, organizes lead information, and prepares the next step.

Tasks:
- Collect lead information
- Qualify incoming requests
- Prepare follow-up messages
- Route leads to the right person

### 2. Follow-up Employee

Makes sure no lead or client falls through the cracks.

Tasks:
- Draft follow-up emails
- Prepare WhatsApp follow-ups
- Remind the owner about stuck deals
- Track who needs a response

### 3. Calendar Employee

Coordinates meetings and prepares the business owner.

Tasks:
- Schedule meetings
- Prepare daily agenda
- Remind about upcoming calls
- Summarize next steps

### 4. CRM Employee

Keeps pipeline and client records updated.

Tasks:
- Update lead status
- Add notes
- Create tasks
- Flag missing information

### 5. Operations Employee

Turns meetings, messages, and decisions into organized tasks.

Tasks:
- Create Trello tasks
- Summarize meetings
- Track open loops
- Prepare weekly reports

### 6. Client Communication Employee

Drafts clear and professional messages using the business tone.

Tasks:
- Draft replies
- Prepare client updates
- Create status messages
- Escalate sensitive messages for approval

Each card should include:

- Icon
- Role name
- Short explanation
- Example tasks
- CTA microcopy: “Can be customized to your workflow”

---

## 6. How It Works Section

Headline:

How we install your AI employee

Create 5 steps:

### Step 1: Map Your Workflow

We learn how your business handles leads, emails, meetings, follow-ups, CRM, and daily operations.

### Step 2: Build Your Business Memory

We create a structured knowledge base with your procedures, tone of voice, services, FAQs, workflows, and client communication rules.

### Step 3: Connect Your Tools

We connect the AI employee to the tools you already use, such as email, calendar, Trello, CRM, WhatsApp, Notion, or Google Drive.

### Step 4: Launch With Human Approval

The AI employee starts working with safe approval flows, so sensitive actions wait for human confirmation.

### Step 5: Monitor and Improve

We review performance, fix issues, add new workflows, and improve the AI employee every week or month.

---

## 7. Use Cases Section

Headline:

Built for service businesses that cannot afford to miss another follow-up.

Use case cards:

### AI Employee for Law Firms

Operational AI employee for intake, follow-ups, scheduling, task creation, and client reminders.

Important:
Do not claim legal advice.

### AI Employee for Real Estate Agencies

Handles buyer/seller follow-ups, meeting preparation, lead organization, and CRM updates.

### AI Employee for Clinics

Handles intake organization, appointment coordination, reminders, and admin follow-ups.

Important:
Do not claim medical advice.

### AI Employee for Agencies

Handles client updates, meeting summaries, task boards, follow-ups, and weekly reports.

### AI Employee for Consultants

Handles email drafting, scheduling, research, client notes, and daily operational support.

### AI Employee for Local Businesses

Handles messages, reminders, lead follow-up, basic admin, and customer communication.

---

## 8. Integrations Section

Headline:

Works inside the tools your business already uses.

Show integration badges/cards for:

- Gmail
- Outlook
- Google Calendar
- WhatsApp
- Telegram
- Trello
- Monday
- HubSpot
- Notion
- Google Drive
- Slack
- Airtable
- Calendly
- Obsidian
- Loom

Do not claim every integration is production-ready.
Use careful wording:

“Common tools we can connect depending on your workflow.”

---

## 9. Comparison Section

Headline:

Why not just use ChatGPT, Sintra, or Lindy?

Create comparison table.

Columns:

1. Generic AI Tools
2. Agent Employee

Rows:

### Setup

Generic AI Tools:
You configure everything yourself.

Agent Employee:
We install and configure it for your business.

### Workflow

Generic AI Tools:
Usually prompt-based and manual.

Agent Employee:
Built around your recurring business processes.

### Business Context

Generic AI Tools:
Limited or generic context.

Agent Employee:
Uses your business memory, rules, documents, and procedures.

### Tool Connections

Generic AI Tools:
May require manual setup.

Agent Employee:
Connected to your actual tools and workflows.

### Accountability

Generic AI Tools:
You manage the tool.

Agent Employee:
We monitor, maintain, and improve the system.

### Best For

Generic AI Tools:
Individuals who want to experiment.

Agent Employee:
Businesses that want done-for-you operational execution.

Add a strong line below:

“Self-serve tools help you think. Agent Employee helps your business operate.”

---

## 10. Pricing Section

Headline:

Start with one AI employee. Scale when the workflow proves value.

Important:
Do not price like Sintra.
Do not sell 12 helpers for a cheap monthly fee.
This is a premium managed service.

Show 3 packages plus custom enterprise.

Prices should be visible and professional.

### Package 1: AI Ops Pilot

Best for:
Small businesses that want to automate one operational workflow first.

Setup:
₪5,000–₪8,000

Monthly:
₪1,500–₪2,500 / month

Includes:

- 1 custom AI operations employee
- 1 primary workflow
- 1 communication channel
- Basic business memory
- Calendar or task-board connection
- Trello request board
- Weekly or monthly review
- Human approval flow
- Basic support

CTA:
Start Pilot

### Package 2: Managed AI Employee

Mark as “Most Popular”.

Best for:
Service businesses that want a managed AI employee for daily operations.

Setup:
₪10,000–₪18,000

Monthly:
₪3,000–₪5,500 / month

Includes:

- 1 custom AI operations employee
- Business memory setup
- Email + Calendar + Task board
- CRM or Trello integration
- Follow-up workflow
- Meeting summary workflow
- Weekly Loom updates
- Monthly optimization
- Monitoring and fixes
- Human approval system
- Priority support

CTA:
Book a Demo

### Package 3: AI Operations Partner

Best for:
High-ticket service businesses with multiple workflows and higher operational load.

Setup:
₪20,000–₪35,000

Monthly:
₪7,000–₪12,000+ / month

Includes:

- Advanced AI operations employee
- Multiple workflows
- Multiple integrations
- CRM updates
- Internal knowledge base
- Weekly optimization
- Monitoring and alerts
- Custom reports
- Approval workflows
- Priority implementation
- Support and continuous improvement

CTA:
Apply for Partner Plan

### Package 4: Custom AI Workforce

Best for:
Larger companies with multiple departments or custom requirements.

Setup:
Custom

Monthly:
Custom

Includes:

- Multiple AI employees
- Multiple workspaces
- Advanced security requirements
- Custom integrations
- Dedicated support
- SLA options
- Custom reporting
- Expansion roadmap

CTA:
Talk to Us

Pricing note:

“Final pricing depends on workflow complexity, number of integrations, required support level, and monthly usage.”

---

## 11. Example Workflow Section

Headline:

Example: From missed follow-up to booked meeting

Show a visual workflow:

1. New lead arrives by email or WhatsApp
2. AI employee captures and organizes lead details
3. AI employee checks business rules and context
4. AI employee drafts a personalized reply
5. Human approves if needed
6. AI employee creates a task
7. AI employee updates CRM
8. AI employee prepares the meeting
9. AI employee sends daily/weekly report

Use a timeline or connected cards.

Make it very clear that sensitive actions can require human approval.

---

## 12. Trust / Why Us Section

Headline:

Built as a managed service, not a toy automation.

Explain:

Most AI tools are easy to start but hard to operationalize.
Agent Employee is built with a service-first approach: workflow mapping, business memory, tool connections, monitoring, and ongoing improvement.

Trust points:

- Done-for-you implementation
- Workflow-first design
- Human approval for sensitive actions
- Weekly or monthly improvements
- Clear request board
- Business memory
- Tool connections
- Built for real operational work

Optional trust stats placeholders:

- “Built for service businesses”
- “Designed for daily operations”
- “Human-in-the-loop by default”
- “Workflow-first implementation”

Do not invent fake customer numbers, reviews, logos, or results.

---

## 13. FAQ Section

Questions and answers:

### Is this a voice agent?

No. Agent Employee is currently a text-first AI operations employee. It focuses on emails, follow-ups, scheduling, CRM updates, tasks, reports, and internal operations.

### Is this a chatbot?

No. A chatbot waits for questions. Agent Employee is built around workflows and can help execute recurring operational tasks through connected tools.

### Is this like ChatGPT?

No. ChatGPT is a general AI tool. Agent Employee is custom-installed, connected to your tools, based on your business memory, and managed as an ongoing service.

### Is this like Sintra or Lindy?

Those are self-serve AI platforms. Agent Employee is a done-for-you managed service where we build, connect, monitor, and improve the AI employee for your business.

### Can it connect to WhatsApp?

Depending on your workflow, yes. We can design workflows that use WhatsApp or other communication channels, with human approval where needed.

### Can it connect to my CRM?

Usually yes, depending on your CRM and the workflow. Common options include HubSpot, Monday, Airtable, Trello, and custom workflows.

### Can it work for law firms?

Yes, but as an operations employee, not as a lawyer. It can help with intake, follow-ups, scheduling, task organization, reminders, and internal admin workflows. It does not replace legal judgment.

### How long does setup take?

A basic pilot can usually be planned and built in days to a few weeks depending on complexity, integrations, and access to business information.

### Do I need technical knowledge?

No. The service is done-for-you. We handle the setup, connections, workflow design, and improvements.

### Will the AI take actions without approval?

Sensitive actions can be configured to require human approval before anything is sent or changed.

### What happens after launch?

We monitor, fix issues, add improvements, and optimize the AI employee based on real usage.

---

## 14. Final CTA Section

Headline:

Ready to install your first AI operations employee?

Subheadline:

Start with one workflow. Prove the value. Then scale into a full AI operations system.

CTA buttons:

- Book a Demo
- Apply for AI Employee

---

## 15. Footer

Footer columns:

### Product

- AI Operations Employee
- How It Works
- Use Cases
- Pricing

### Use Cases

- Law Firms
- Agencies
- Clinics
- Real Estate
- Consultants

### Company

- About
- Contact
- Book Demo

### Legal

- Privacy Policy
- Terms
- Disclaimer

Footer note:

Agent Employee builds custom AI operations workflows for businesses. It does not provide legal, medical, financial, or professional advice.

---

## Design Requirements

Use a premium dark SaaS style.

Visual style:

- Dark background
- Deep navy / black base
- Blue, cyan, violet, and subtle green accents
- Glassmorphism cards
- Rounded 2xl corners
- Soft glowing gradients
- Clean typography
- Large hero headline
- Smooth scrolling
- Subtle motion
- High contrast CTA buttons
- Responsive layout for mobile and desktop

Avoid:

- Childish cartoon style
- Copying Sintra characters
- Copying Sintra layout exactly
- Too much clutter
- Overly colorful design
- Generic AI robot clichés
- Fake testimonials
- Fake logos
- Fake numbers

---

## UI Components To Build

Create clean reusable React components where appropriate:

- Navbar
- HeroSection
- DashboardMockup
- ProblemCard
- SolutionSection
- AgentRoleCard
- HowItWorksStep
- UseCaseCard
- IntegrationBadge
- ComparisonTable
- PricingCard
- WorkflowTimeline
- TrustSection
- FAQAccordion
- CTASection
- Footer

---

## Suggested File Organization

Use this structure if helpful:

src/
  components/
    Navbar.jsx
    HeroSection.jsx
    DashboardMockup.jsx
    ProblemSection.jsx
    SolutionSection.jsx
    AgentRolesSection.jsx
    HowItWorksSection.jsx
    UseCasesSection.jsx
    IntegrationsSection.jsx
    ComparisonSection.jsx
    PricingSection.jsx
    WorkflowSection.jsx
    TrustSection.jsx
    FAQSection.jsx
    CTASection.jsx
    Footer.jsx
  data/
    pricing.js
    agents.js
    faqs.js
    integrations.js
    useCases.js
  App.jsx
  App.css
  index.css
  main.jsx

If the project is small, it is acceptable to keep some components in App.jsx initially, but prefer clean component separation.

---

## Dependencies

Use only what is needed.

Recommended:

- lucide-react for icons
- framer-motion for subtle animations

Optional:

- tailwindcss if not already installed

If Tailwind is not configured, either:
1. configure Tailwind properly, or
2. build a polished design using regular CSS in App.css and index.css.

Do not break the Vite build.

Before finishing, run:

npm run dev

and ensure the site loads without errors.

---

## Content Rules

Tone:

- Premium
- Direct
- Clear
- Confident
- Business-focused
- Not too hype
- Not too technical

Do not say:

- “Replace all employees”
- “Fully autonomous with no risk”
- “Legal AI lawyer”
- “Medical AI doctor”
- “Unlimited”
- “Guaranteed revenue”
- “100% automated everything”

Use phrases like:

- Custom AI operations employee
- Done-for-you implementation
- Connected to your tools
- Built around your workflow
- Human approval where needed
- Business memory
- Monitored and improved
- Handles recurring operational work
- Start with one workflow

---

## SEO Requirements

Even though this is a Vite single-page site, add basic SEO in index.html.

Update:

- title
- meta description
- Open Graph title
- Open Graph description
- Open Graph type
- viewport
- favicon if available

Suggested title:

Agent Employee | Custom AI Operations Employees for Service Businesses

Suggested meta description:

Agent Employee installs custom AI operations employees into your business to handle follow-ups, emails, meetings, CRM updates, tasks, and daily operations.

Suggested OG title:

Agent Employee — Custom AI Operations Employees

Suggested OG description:

We build, connect, monitor, and improve custom AI employees for service businesses.

Use semantic headings:

- Only one H1
- Clear H2 sections
- Clean readable structure

---

## Conversion Requirements

The site must make these points obvious within the first 10 seconds:

1. This is a custom AI operations employee.
2. It is installed into the business.
3. It connects to existing tools.
4. It handles real operational workflows.
5. It is managed and improved over time.
6. The next step is booking a demo.

CTA buttons should appear in:

- Navbar
- Hero
- Solution section
- Pricing section
- Final CTA

On mobile, include a clear CTA near the top.

---

## Form Requirement For Version 1

If building a contact/demo form in version 1, include:

Fields:

- Full name
- Business name
- Email
- Phone
- Business type
- What workflow do you want your AI employee to handle?
- Current tools used
- Preferred package
- Message

For now, if no backend is configured:

- Validate required fields
- Show success message on submit
- Store lead in local state or console log
- Make code ready for future Supabase or API integration

Do not hardcode real API keys.
Do not expose secrets in frontend code.

---

## Suggested Demo Form Copy

Headline:

Apply to Build Your AI Employee

Subheadline:

Tell us what you want your AI employee to handle. We’ll review your workflow and suggest the best starting point.

Submit button:

Request Demo

Success message:

Thanks. Your request was received. We’ll review your workflow and contact you with the next step.

---

## Legal / Safety Disclaimer

Add a small disclaimer in the footer or FAQ:

Agent Employee builds workflow automation and AI operations support systems. It does not provide legal, medical, financial, or other regulated professional advice. Human review and approval should be used for sensitive decisions.

---

## Important Implementation Instructions

1. Build the website inside the current Vite React project.
2. Keep the code clean and component-based.
3. Make the design premium and responsive.
4. Do not copy Sintra assets or wording.
5. Do not claim this is a voice agent.
6. Do not overemphasize the technical stack to customers.
7. Make the service feel premium and done-for-you.
8. Use real business operations language.
9. Include pricing in Israeli shekels.
10. Make the comparison with self-serve tools clear.
11. Make the “custom installed employee” concept very strong.
12. Ensure all CTAs are visible and consistent.
13. Use smooth scroll for anchor links.
14. Add hover states and subtle animations.
15. Ensure the site works on mobile.

---

## Acceptance Criteria

The website is complete when:

- It runs locally with `npm run dev`
- No console errors
- Responsive on desktop and mobile
- Hero clearly explains the offer
- Pricing section is visible and professional
- Comparison section explains why this is not Sintra/ChatGPT/Lindy
- Use cases include law firms without making legal-advice claims
- There is a clear CTA to book a demo
- Design is premium and modern
- Code is organized and maintainable
- No copyrighted competitor assets are used
- No fake testimonials or fake customer logos are used
- No voice-agent claims are made
- No secrets or API keys are exposed

---

## Final Build Request

Build a complete premium landing page for Agent Employee based on this PRD.

Use the existing Vite React project.

The final output should feel like a high-end SaaS/service website for a custom AI operations employee company.

Focus on:

- Strong positioning
- Premium UI
- Clear differentiation
- Service-business audience
- Pricing clarity
- Demo conversion
- Clean code
- Mobile responsiveness

Remember:

Agent Employee is not a tool.
Agent Employee is a custom AI operations employee installed into the business.