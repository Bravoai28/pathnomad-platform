# PATH NOMAD Platform

Merged company profile + Creative Nomads membership site. Branding matches the official PDF: white background, charcoal typography, lime-green logo accent (`#A8D65A`).

## Membership

- **R350 / month** — monthly billing (ZAR)
- **R3,500 / year** — annual option (save R700)

## Sendable PDF

**`/Users/hayiki/Downloads/pathnomad-platform/PATH-NOMAD-Platform-Sendable.pdf`** (~3.3 MB)

Company profile overview: about, exhibitions, dinners, Nelson Makamo, Porsche, TIME, R350 membership. Ready to email or AirDrop.

Regenerate after edits:

```bash
cd "/Users/hayiki/Downloads/pathnomad-platform" && node generate-pdf.mjs
```

Copies for sharing: `~/Desktop/PATH-NOMAD-Platform-Sendable.pdf` · `~/Downloads/PATH-NOMAD-Platform-Sendable.pdf` · `~/Downloads/PATH-NOMAD-Platform-Sendable.zip`

Source layout: `edit for export-for-pdf.html`

## Open the site

```bash
open "/Users/hayiki/Downloads/pathnomad-platform/index.html"
```

## Structure

- `index.html` — public site (profile + subscription)
- `portal.html` — **approved member** sign-in & archive
- `admin.html` — approve applications, issue access codes
- `js/pathnomad-members.js` — applications & membership (localStorage)
- `assets/logo.jpg` · `assets/logo-full.jpg` — branding from PDF
- `assets/portfolio/` — images from company profile PDF

## Member flow

1. User applies on `index.html` (R350/mo)
2. Admin opens `admin.html` → PIN: `pathnomad-admin-2026` → **Approve**
3. Admin shares the **access code** with the member
4. Member signs in at `portal.html` (email + access code)

**Demo member:** `demo@pathnomad.co` / `DEMO2026`

## Content sections (from PDF)

About & leadership · 44 Stanley · Exhibitions · Collectors dinners (multi-image) · Nelson Makamo 3-month exhibition · Brand development · Special projects · R350 membership

## Contact (from PDF)

- WORK@PATHNOMAD.CO
- PATHNOMAD.CO
- 060 6464 064