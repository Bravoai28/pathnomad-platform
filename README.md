# PATH NOMAD Platform

Merged company profile + Creative Nomads membership site.

## Design system (editorial theme)

The site uses a quiet, gallery-like journal style defined in `css/editorial.css` (no CSS framework, no build step):

- **Palette:** warm paper background `#F4F1ED`, ink `#111111`, muted taupe text `#5E594F`, taupe footer `#66604F`; the PATH NOMAD lime (`#A8D65A`) is kept for the logo and small decorative accents.
- **Type:** *Cormorant Garamond* (light display serif) for headings, *Jost* (geometric sans) for body text and small uppercase meta labels. Both load from Google Fonts.
- **Layout:** split navigation with a centred wordmark, narrow reading columns, image pairs/trios with simple `Name | Place` captions, numbered journal-style entries, generous whitespace.
- **Accessibility:** semantic landmarks and headings, skip link, labelled form fields, keyboard-friendly modal (focus trap + Esc), `aria-pressed` billing toggle, WCAG AA text contrast, reduced-motion support.

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
- `css/editorial.css` — shared editorial theme for all pages
- `js/site.js` — navigation, reveal-on-scroll and toast helpers
- `js/pathnomad-members.js` — applications & membership (localStorage)
- `assets/logo.jpg` · `assets/logo-full.jpg` — branding from PDF (`assets/logo-wordmark.jpg` is a tight crop of `logo.jpg` used in the header)
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