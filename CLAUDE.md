# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AIによるバックオフィスオペレーション自動化フレームワーク。Claude Desktop (computer use) を活用し、バックオフィス担当者のPC上で定型業務を自動化する。

This repo is primarily a **specification and data repository** (procedures, guardrails, knowledge, proposals — currently scaffolding only). The one runnable piece is `ui-prototype/`, a React SPA that mocks the management interface and is deployed to GitHub Pages on every push to `main`.

**Audience for `ui-prototype/`**: AI 推進部の中間管理職 (non-technical). Every screen must be legible in ≤3 seconds; technical details belong in collapsible sections or dedicated governance pages. UI copy is **JP-only** — English strings (workflow names, step names, check names) are treated as bugs.

## Key Documents

- `docs/architecture.md` — Full technical spec (tier model, procedure schemas, knowledge pipeline, agent architecture, bootstrap process). The executive summary section (top of file) is authored for middle-management and is embedded into `OverviewPage` at runtime.
- `docs/ui-prototype.md` — Management interface mockups, approval workflow, and responsive/mobile design spec (ASCII art screens)
- `knowledge/error_taxonomy.md` — 5-category feedback classification that routes corrections to the right tier

## Domain Architecture

### Two-Tier Data Model

- **Tier 1 — Knowledge** (`knowledge/`): Context learned from human corrections. Real-time reflection, no approval needed.
- **Tier 2 — Procedures + Guardrails** (`procedures/`, `guardrails/`): Executable steps and validation rules. All changes require human approval via proposals (`proposals/pending/` → `approved/` | `rejected/`).

### Trust Level Progression

Procedures graduate: **supervised** (all steps approved) → **checkpoint** (flagged steps only) → **autonomous** (post-execution review). High-risk procedures never reach autonomous. Accuracy falling below threshold (90%) or UI-drift detection triggers **automatic demotion** back to supervised.

**Important**: trust-level enum values in code (`TrustMode` in `ui-prototype/src/data/types.ts`) are `'supervised' | 'checkpoint' | 'autonomous'` — these match `architecture.md §4` exactly. Do not reintroduce legacy names (`full-step`, `post-check`).

### Knowledge Pipeline

`knowledge/corrections/` → `knowledge/staging/` (real-time, low weight) → `knowledge/compiled/` (verified, high weight). Changes impacting Tier 2 auto-generate proposals in `proposals/pending/`.

### Procedure Schema (3-layer)

1. **goal + expected_state** — invariant business logic (survives UI changes)
2. **hints** — UI navigation helpers (may become outdated)
3. **checkpoint** flags — where human approval is required

### Error Taxonomy (5 categories → routing)

Per `architecture.md §9`, corrections are classified and routed:
- `misunderstanding`, `ui_change` → Tier 2 (procedure/hint update proposal)
- `edge_case`, `judgment_gap` → Tier 1 (knowledge) + may generate Tier 2 proposal
- `data_error` → log-only (not the AI's fault)

`CommentPage` uses this taxonomy as a required structured field and previews the routing outcome to the operator.

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

Router `basename` is `/backofficeAI/` (matches GitHub Pages project URL). Routes in `src/App.tsx`:

**Public / entry pages**
- `/` → `OverviewPage` (project pitch, flywheel diagram, POC phase tracker — landing page)
- `/how-it-works` → `HowItWorksPage` (system mechanics explainer)

**Operator flow**
- `/home` → `HomePage` (operator daily dashboard)
- `/tasks/:id` → `ExecuteReviewPage` (approve/send-back)
- `/tasks/:id/comment` → `CommentPage` (structured correction capture)

**Manager flow**
- `/proposals`, `/learning`, `/upgrade` — Tier 2 approval, learning metrics, trust-level promotion
- `/runs` — execution history with audit trail
- `/guardrails` — active check rules
- `/agents` — AI agent configurations
- `/repository` — data governance (audit story, not folder paths)

"Back to home" buttons across the app navigate to `/home` (operator dashboard), **not** `/` (Overview).

### State

Global state via `src/context/AppContext.tsx`; all data is mock data from `src/data/`. `currentRole` defaults to `manager` so all sidebar links render (role toggle UI was intentionally removed from `TopBar`). Staff-only views can be exercised by reading from `currentRole` but there is currently no UI entry point to switch roles.

### Mock data model (`src/data/types.ts` + `src/data/mockData.ts`)

The data model is designed to match `architecture.md` concepts 1:1. Key fields the UI depends on:

- `Task`: `category: ProcedureCategory`, `confidence: number` (0-100), `keyData: {label, value}[]` (procedure-specific context like amount/vendor), `elapsedLabel`, `runId`
- `Comment`: `errorCategory`, `ruleScope: 'one_off' | 'rule_change'`, optional `before`/`after`
- `Proposal`: `changeType`, `diff: { pathJp, before[], after[] }`, `impactAnalysis`, `sourceCorrectionIds`, `reviewMode: 'individual' | 'batch'`
- `Workflow`: `jpName`, `category`, `riskLevel`, `recommendation` (structured discriminated union), `driftDetected`, cost fields
- `Step`: `goal` + `expectedState` (the architecture.md §4 invariants, displayed in `DetailPanel`)
- Separate arrays: `guardrails`, `runHistory`, `agents`, `learningMetrics` (weekly), `costMetrics` (monthly), `pocPhases`, `batchProposals`

When adding a new field to a type, update all mock entries — the type system enforces this.

### Shared UI components (`src/components/shared/`)

Reusable domain components used across multiple pages:
- `FlywheelDiagram` — the 修正コメント → ナレッジ → 提案 → 承認済手順 learning loop. Appears on Overview, HowItWorks, Learning.
- `POCPhaseBadge` — POC progress marker (strip or detailed variant)
- `LearningStrip` — compact "今週、AI は N 件のコメントから学習" banner linking to `/learning`
- `CategoryIcon` — per-procedure-category colored icon box
- `ConfidenceBadge` — 90%+ emerald / 70-90% amber / <70% rose

When a visual concept appears on more than one page, add it here rather than duplicating JSX.

### Architecture doc embed

`OverviewPage` imports `../../../docs/architecture.md?raw` and renders it inside a collapsible section with `ReactMarkdown` (custom `components` prop for per-element Tailwind styling since Tailwind v4 `prose` classes are unavailable). Middle-management viewers shouldn't see this by default — it's expand-on-demand. Updates to `docs/architecture.md` flow through automatically on next build.

## Deployment

GitHub Pages is configured with Source = "GitHub Actions". The only Pages workflow is `.github/workflows/deploy.yml`:

1. Runs on push to `main` (and `workflow_dispatch`)
2. `cd ui-prototype`, `npm ci`, `npm run build`
3. Uploads `ui-prototype/dist/` as the Pages artifact

**Important**: `npm ci` fails hard on lockfile drift. If you add/update deps, always re-run `npm install` so `package-lock.json` stays in sync before pushing.

Live site: `https://shinjif1002.github.io/backofficeAI/`

## Bootstrap Process (Spec Side, Not Yet Started)

1. Import manuals into `manuals/raw/`, LLM structures them into `manuals/parsed/`
2. Generate procedure drafts, batch human review via proposals (`reviewMode: 'batch'`)
3. Supervised execution with feedback to build knowledge base
