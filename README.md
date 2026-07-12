# StudyFlow

Your notes, compiled clean. Paste messy notes, turn them into tidy bullets, sort them into folders, and export to Markdown or PDF. Everything lives in your browser — no account, no backend, no cost.

Live site: https://kashik09.github.io/studyflow-landing/

## Features

- **Note Compiler** — paste raw notes and compile them into de-duplicated bullet points.
- **Folders + library** — organize notes into folders, search within a folder.
- **Export** — download any note as `.md` or print to PDF.
- **Local-first** — notes are stored in `localStorage`, so they stay on your device and persist across refreshes.
- **Contact form** — opens the visitor's email app by default, or wire it to Formspree for a real inbox (see below).

## Tech

Vite + React + React Router (HashRouter) + Tailwind CSS. Data layer is a small `localStorage` wrapper in `src/lib/storage.js`.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Deploy (GitHub Pages, free)

Deployment is automated with GitHub Actions (`.github/workflows/deploy.yml`). On every push to `main` or `gh-pages`, the site builds and publishes to Pages.

One-time setup:

1. In the repo on GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Commit and push. The workflow builds and deploys automatically.

The site serves from a subpath, so `vite.config.js` sets `base: "/studyflow-landing/"`. If you rename the repo or use a custom domain, update `base` to match.

> Note: the old `npm run deploy` script (git subtree) won't work here because `dist/` is gitignored. Use the Actions workflow above instead.

## Optional: real contact form

By default the contact form opens the visitor's email app. To collect messages in a dashboard instead, create a free form at [formspree.io](https://formspree.io) and paste its URL into `FORMSPREE_ENDPOINT` at the top of `src/pages/contact.jsx`.

## Notes on data

Notes and folders are stored under the `sf_notes_v2` key in `localStorage`. Clearing browser data for this site will erase them. Use the per-note `.md` / PDF export to keep backups.
