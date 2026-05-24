# Shiloflow AI Website

Premium SaaS landing website and early-access request flow for Shiloflow AI, an AI Operating System for Global Ministries.

## Positioning

Shiloflow AI is designed for churches, pastors, ministries, missionaries, global outreach organizations, and multilingual media teams. The website presents a premium AI SaaS platform that helps ministries create, translate, repurpose, publish, analyze, schedule, and distribute multilingual ministry content.

Core message:

```text
Transform one sermon into a complete multilingual ministry ecosystem.
```

The expanded website includes:

- Cinematic hero section
- Floating dashboard preview
- Built For Global Ministries section
- More Than A Sermon Generator / Why Shiloflow AI section
- Platform Dashboard Preview section with sidebar, sermon workspace, translation queue, subtitle exports, analytics, uploads, publishing, and asset library
- How Shiloflow Works connected workflow
- Real Ministry Outputs showcase
- Watch Shiloflow In Action premium video section
- Security & Ministry Trust section
- Sermon to Content Pipeline signature visual
- Translation Center
- AI Sermon Workspace
- Media Studio
- Analytics Dashboard
- Reports
- Settings
- Team Collaboration
- Integrations
- Mobile app preview
- Watch Demo section
- Responsible AI section
- Why Shiloflow Exists founder vision section
- Ministry workflow use cases
- Premium post-submit early-access confirmation screen
- Working mobile navigation
- Coming Soon modal for unfinished tools
- Loading states for platform actions and request form
- Standalone About, Contact, Terms, Privacy, AI Usage Policy, Support, and Platform Status pages
- Connected professional SaaS footer links
- Testimonials
- SaaS pricing with Free, Creator, Ministry Pro, and Enterprise plans
- Login and dashboard previews
- Early-access request form

Supported languages highlighted throughout the site:

- English
- Haitian Creole
- Spanish
- French
- Portuguese
- Brazilian Portuguese
- Italian
- German
- Dutch
- Swahili
- Arabic
- Mandarin Chinese
- Hindi
- Korean
- Japanese
- Russian
- Tagalog
- Yoruba
- Igbo
- Amharic

## Brand and design

The official Shiloflow AI logo is stored at:

```text
assets/shiloflow-logo.jpeg
```

The logo is used in the navbar, loading screen, dashboard preview, Translation Center, AI Sermon Builder, login page, early-access CTA, footer, favicon, and social metadata.

The visual system uses a dark premium SaaS style: matte black backgrounds, deep purple glow accents, subtle gold highlights, widescreen dashboard composition, glass panels, floating product visuals, and modern SaaS typography inspired by Perplexity, Notion, Stripe, Linear, and current AI SaaS ecosystems.

## Key files

```text
index.html      Main one-page SaaS website
style.css       Premium Shiloflow AI visual system and responsive layout
app.js          Loading screen, smooth scroll, mobile nav, modals, tabs, form submission
api/leads.js    Vercel serverless placeholder for lead/waitlist submissions
api/_integration-placeholders.js  Future Supabase, OpenAI, and Stripe config placeholders
.env.example    Environment variable template for production integrations
vercel.json     Vercel deployment headers and clean URL settings
assets/         Official logo and legacy generated assets
```

## Local preview

Use any static file server, for example:

```bash
cd /home/user/workspace/ai-church-media-director-site
npx serve .
```

The form posts to the relative endpoint:

```text
/api/leads
```

If `/api/leads` is unavailable during a static preview, `app.js` shows the premium success confirmation and stores a temporary in-memory browser-session copy. Connect `/api/leads` to Supabase, a CRM, or email automation before launch.

## Vercel deployment

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add environment variables from `.env.example` when Supabase, OpenAI, or Stripe are connected.
4. Deploy. Vercel will serve the static website and the `/api/leads` serverless function.

## Perplexity preview deployment

```bash
pplx-tool deploy_website <<'JSON'
{"project_path":"/home/user/workspace/ai-church-media-director-site","site_name":"Shiloflow AI","entry_point":"index.html","should_validate":true}
JSON
```

## QA performed

- Desktop browser check at 1440px.
- Mobile browser check at 390px.
- Confirmed no horizontal overflow.
- Confirmed prior product branding is removed.
- Confirmed all major sections exist, including Translation Center, Sermon Workspace, Media Studio, Analytics, Reports, Settings, Team Collaboration, Integrations, Watch Demo, Mobile Preview, Pricing, and Request Access.
- Confirmed updated pricing plans, comparison table, Book Live Demo CTA, Responsible AI, founder vision, and ministry workflow use cases exist.
- Confirmed Platform Dashboard Preview, How Shiloflow Works, Real Ministry Outputs, Watch Shiloflow In Action, Security & Ministry Trust, and premium footer links exist.
- Confirmed early-access form opens the premium confirmation screen after submission.
- Confirmed Coming Soon popups work for unfinished tools.
- Confirmed mobile navigation opens, closes, and scrolls to sections.
- Confirmed About, Privacy, Terms, Contact, AI Usage Policy, Support, and Status pages return 200 locally.
- Confirmed `app.js` has no machine-local or port-specific form dependency.
- Confirmed Vercel `/api/leads` placeholder exists.
- Confirmed official Shiloflow AI logo appears throughout the site.
- Confirmed early-access form has a safe production fallback if no real backend is connected.
- Confirmed the safe fallback stores a temporary in-memory browser-session copy without forbidden browser storage APIs.

## Current limitations

- The website is a premium SaaS marketing and product-preview experience, not a fully built authenticated SaaS app.
- Login, dashboard, analytics, Translation Center, Media Studio, Reports, and Settings are visual/product previews.
- `/api/leads` is a Vercel placeholder that validates requests and returns success, but does not persist to a real database yet.
- Supabase auth, Supabase database, OpenAI API, and Stripe payment placeholders are present but not connected.
- No production email, CRM, payment, auth, or third-party integrations are connected yet.
