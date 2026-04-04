# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AIによるバックオフィスオペレーション自動化フレームワーク。Claude Desktop (computer use) を活用し、バックオフィス担当者のPC上で定型業務を自動化する。

This repo is primarily a **specification and data repository** (procedures, guardrails, knowledge, proposals — currently scaffolding only). The one runnable piece is `ui-prototype/`, a React SPA that mocks the management interface and is deployed to GitHub Pages on every push to `main`.

## Key Documents

- `docs/architecture.md` — Full technical spec (tier model, procedure schemas, knowledge pipeline, agent architecture, bootstrap process)
- `docs/ui-prototype.md` — Management interface mockups, approval workflow, and responsive/mobile design spec (ASCII art screens)
- `knowledge/error_taxonomy.md` — 5-category feedback classification that routes corrections to the right tier

## Domain Architecture

### Two-Tier Data Model

- **Tier 1 — Knowledge** (`knowledge/`): Context learned from human corrections. Real-time reflection, no approval needed.
- **Tier 2 — Procedures + Guardrails** (`procedures/`, `guardrails/`): Executable steps and validation rules. All changes require human approval via proposals (`proposals/pending/` → `approved/` | `rejected/`).

### Trust Level Progression

Procedures graduate: **supervised** (all steps approved) → **checkpoint** (flagged steps only) → **autonomous** (post-execution review). High-risk procedures never reach autonomous.

### Knowledge Pipeline

`knowledge/corrections/` → `knowledge/staging/` (real-time, low weight) → `knowledge/compiled/` (verified, high weight). Changes impacting Tier 2 auto-generate proposals in `proposals/pending/`.

### Procedure Schema (3-layer)

1. **goal + expected_state** — invariant business logic (survives UI changes)
2. **hints** — UI navigation helpers (may become outdated)
3. **checkpoint** flags — where human approval is required

## File Conventions (Spec Data)

- Index files (`_index.md`) in `procedures/`, `guardrails/`, `knowledge/compiled/` are auto-generated with `<!-- auto-generated -->` comment
- Procedure definitions: `{domain}/{name}.md` (human-readable) + `{domain}/{name}.schema.yaml` (machine-readable)
- Guardrails: YAML with `severity` (error/warning) and `source_knowledge` references
- Knowledge articles: Markdown with YAML frontmatter (`id`, `created`, `affects`, `confidence`)
- Corrections: `{timestamp}_{procedure}_{run_id}.md`
- Runs: `runs/{YYYY-MM}/{run_id}/` containing plan, execution log, screenshots, approval, feedback

## ui-prototype/ (React SPA)

Working directory for all commands: `ui-prototype/`.

```bash
npm install          # install deps
npm run dev          # Vite dev server (HMR)
npm run build        # tsc -b && vite build → dist/
npm run lint         # eslint .
npm run preview      # serve built dist/
```

### Stack

React 19, Vite 8, TypeScript, Tailwind v4 (via `@tailwindcss/vite`; no typography plugin — write explicit classes), shadcn/ui components, react-router-dom v7, lucide-react icons, recharts. Markdown rendered with `react-markdown` + `remark-gfm`.

### Routing

Router `basename` is `/backofficeAI/` (matches GitHub Pages project URL). Key routes in `src/App.tsx`:

- `/` → `OverviewPage` (project pitch — landing page)
- `/home` → `HomePage` (operator daily dashboard)
- `/how-it-works`, `/repository` — marketing/info pages
- `/tasks/:id`, `/tasks/:id/comment` — operator approval flow
- `/proposals`, `/learning`, `/upgrade` — manager pages

"Back to home" buttons across the app navigate to `/home` (operator dashboard), **not** `/` (Overview).

### State

Global state via `src/context/AppContext.tsx`; all data is mock data from `src/data/`. `currentRole` defaults to `manager` so all sidebar links render (role toggle UI was intentionally removed from `TopBar`).

### Architecture doc embed

`OverviewPage` imports `../../../docs/architecture.md?raw` and renders it with `ReactMarkdown` (custom `components` prop for per-element Tailwind styling since Tailwind v4 `prose` classes are unavailable). Updates to `docs/architecture.md` flow through automatically on next build.

## Deployment

GitHub Pages is configured with Source = "GitHub Actions". The only Pages workflow is `.github/workflows/deploy.yml`:

1. Runs on push to `main` (and `workflow_dispatch`)
2. `cd ui-prototype`, `npm ci`, `npm run build`
3. Uploads `ui-prototype/dist/` as the Pages artifact

**Important**: `npm ci` fails hard on lockfile drift. If you add/update deps, always re-run `npm install` so `package-lock.json` stays in sync before pushing.

Live site: `https://shinjif1002.github.io/backofficeAI/`

## Bootstrap Process (Spec Side, Not Yet Started)

1. Import manuals into `manuals/raw/`, LLM structures them into `manuals/parsed/`
2. Generate procedure drafts, batch human review via proposals
3. Supervised execution with feedback to build knowledge base
