# Shiloflow AI Website

Premium SaaS landing website and early-access request flow for Shiloflow AI, the AI workspace for global ministries.

## Positioning

Shiloflow AI is designed for churches, pastors, ministries, and multilingual media teams. The website presents a premium AI SaaS platform with:

- Translation Center
- AI Sermon Builder
- Media Studio
- Analytics Dashboard
- Integrations
- Reports
- Settings
- Login and dashboard previews
- Early-access request form

Supported languages highlighted throughout the site:

- English
- Haitian Creole
- Spanish
- French

## Brand and design

The official Shiloflow AI logo is stored at:

```text
assets/shiloflow-logo.jpeg
```

The logo is used in the navbar, loading screen, dashboard preview, Translation Center, AI Sermon Builder, login page, early-access CTA, footer, favicon, and social metadata.

The visual system uses a dark premium SaaS style: matte black backgrounds, deep purple glow accents, subtle gold highlights, widescreen dashboard composition, glass panels, and modern SaaS typography.

## Key files

```text
index.html      Main one-page SaaS website
style.css       Premium Shiloflow AI visual system and responsive layout
app.js          Loading screen, scroll header, reveal animation, tabs, form submission
api_server.py   FastAPI + SQLite lead-capture backend
assets/         Official logo and legacy generated assets
```

## Local preview

Start the backend:

```bash
cd /home/user/workspace/ai-church-media-director-site
python api_server.py
```

Start the static site:

```bash
cd /home/user/workspace/ai-church-media-director-site
python -m http.server 5173
```

Open:

```text
http://localhost:5173
```

## Deployment

Start the backend on port 8000:

```bash
pplx-tool start_server <<'JSON'
{"command":"python api_server.py","project_path":"/home/user/workspace/ai-church-media-director-site","port":8000,"log_file":"/tmp/shiloflow_ai_leads.log"}
JSON
```

Deploy the static site:

```bash
pplx-tool deploy_website <<'JSON'
{"project_path":"/home/user/workspace/ai-church-media-director-site","site_name":"Shiloflow AI","entry_point":"index.html","should_validate":true}
JSON
```

## QA performed

- Desktop browser check at 1440px.
- Mobile browser check at 390px.
- Confirmed no horizontal overflow.
- Confirmed old AI Church Media branding is removed.
- Confirmed all major sections exist.
- Confirmed official Shiloflow AI logo appears throughout the site.
- Confirmed early-access form submits against the backend and shows success.

## Current limitations

- The website is a premium SaaS marketing and product-preview experience, not a fully built authenticated SaaS app.
- Login, dashboard, analytics, Translation Center, Media Studio, Reports, and Settings are visual/product previews.
- Lead submissions persist through the existing FastAPI/SQLite backend.
- No production email, payment, auth, or third-party integrations are connected yet.
