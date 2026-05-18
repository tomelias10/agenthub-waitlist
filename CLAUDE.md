# CLAUDE.md

## Project
Build a high-quality landing page for **AgentHub** — a collaborative cloud platform for building, running, versioning, and sharing AI agent projects.

This site should explain the product clearly, make the vision feel credible, and convert visitors into a waitlist.

The visual reference is **Conductor**: clean, premium, technical, minimal, dark, polished, and product-first. The site should feel inspired by that level of taste and execution, but it must not copy Conductor's branding, layout verbatim, or text.

## Primary Goal
The main goal is to create a landing page that:
- Explains what AgentHub is in simple language.
- Makes the product feel real, modern, and technically ambitious.
- Captures user interest through a waitlist form.
- Feels like a serious startup product page, not a template.

## Product Positioning
AgentHub is:
- A cloud workspace for building AI agent projects.
- A collaborative environment where humans and agents work together.
- A product that combines ideas from coding-agent orchestration, project collaboration, and AI-native app creation.

Simple positioning lines to keep in mind while writing:
- "GitHub for AI agent projects"
- "Conductor in the cloud, with collaboration and sharing"
- "A collaborative operating system for AI agents"

Do not overuse all three lines. Use one as the hero direction and keep the others as support language.

## Audience
Target visitors are:
- AI builders
- technical founders
- developers using Claude Code / Codex / agent workflows
- teams building internal or customer-facing agents
- early adopters of AI-native tooling

Write for a technical but busy audience. Keep the copy sharp, concrete, and confident.

## Deliverable
Create a single polished landing page with:
- hero section
- product explanation section
- feature/value section
- "how it works" section
- social-proof / credibility placeholder section if needed
- waitlist CTA section
- footer

If useful, include sticky header navigation and subtle product mockup sections.

## Waitlist Requirement
The page must include a visible waitlist capture flow.

Preferred implementation:
- A clean email input + submit button in hero.
- A larger CTA/waitlist section later on the page.
- Success/error state handling in UI.

If no backend exists yet, implement the waitlist as a polished frontend form with a clear placeholder action and a TODO comment showing where to connect the real endpoint later.

## Design Direction
Art direction:
- dark background
- premium technical feel
- restrained color palette
- subtle contrast and depth
- clean typography
- strong spacing rhythm
- minimal but elegant motion
- product UI aesthetic, not generic SaaS illustration style

Avoid:
- generic AI gradients
- purple neon blobs
- cheesy "future" visuals
- template-like 3-column feature grids with icon circles
- overexplaining with too much text
- bright marketing fluff

The page should feel like a serious product company.

## Visual Reference Rules
Use Conductor only as a quality and taste reference.

Allowed:
- similar level of polish
- dark minimal style
- product-first layout
- refined spacing and hierarchy
- screenshot or app-frame style presentation

Not allowed:
- copying their exact copy
- cloning their exact layout section-by-section
- reusing their brand language
- making a lookalike clone

This project should feel adjacent in quality, not derivative.

## Copywriting Rules
The copy must be:
- concise
- specific
- technical but understandable
- startup-quality
- credible, not hypey

Do:
- explain the product in plain English
- make the workflow obvious
- emphasize collaboration, cloud execution, versions, runs, and sharing
- write headlines that sound like a real startup

Do not:
- use vague slogans like "revolutionize your workflow"
- say "unlock the power of AI"
- use filler buzzwords
- write giant paragraphs

## Suggested Messaging Structure
### Hero
Goal: explain product + create curiosity + drive waitlist.

Possible direction:
- headline about building AI agent projects collaboratively in the cloud
- subheadline about runs, versions, sharing, and multi-agent workflows
- primary CTA for waitlist
- secondary CTA for product preview / how it works

### Problem
Show that current workflows are fragmented:
- coding tools are separate
- agent tooling is fragmented
- collaboration is weak
- local execution is limiting

### Solution
Explain AgentHub as the system that brings together:
- project workspace
- multi-agent runs
- versions
- logs
- sharing
- cloud execution

### How It Works
Keep this practical and visual:
1. Create a project.
2. Configure agents and tools.
3. Run agents in the cloud.
4. Review runs, logs, and versions.
5. Share or iterate with your team.

### Waitlist CTA
Final section should make joining feel exclusive but believable.

## UX Rules
- Prioritize clarity over decoration.
- Keep one main CTA visible above the fold.
- Make waitlist interaction obvious.
- Ensure the site looks excellent on mobile.
- Use subtle hover states and transitions.
- If adding animations, keep them smooth and minimal.

## Technical Requirements
- Build as a clean static site unless explicitly asked otherwise.
- Prefer simple, maintainable structure.
- If using HTML/CSS/JS, keep files readable and organized.
- If using React or another framework, keep the component structure simple.
- Do not add unnecessary dependencies.
- Do not add a backend unless explicitly requested.

## Quality Standard
Before saying the page is done, verify:
- the page exists on disk
- the main file is created
- all referenced assets exist
- the waitlist UI works visually
- copy is polished and not generic
- layout looks good on desktop and mobile
- no placeholder lorem ipsum remains
- no broken buttons or dead sections remain

## Working Style
Always follow this workflow:
1. Read existing files first.
2. Check whether assets and screenshots already exist.
3. Plan the page structure briefly before coding.
4. Build in stages.
5. After each meaningful stage, summarize what changed.
6. Do not claim completion unless the files actually exist.

## Important Guardrails
- Never claim a page or feature is complete if it has not been written to disk.
- Never summarize imaginary files or fake build results.
- Always prefer concrete implementation over narrative updates.
- If something is missing, say exactly what is missing.
- If the waitlist backend does not exist, state that clearly and provide a graceful placeholder.

## Output Preference
When implementing, prioritize:
1. high-quality visual result
2. clear product messaging
3. strong waitlist conversion
4. maintainable code
5. fast iteration