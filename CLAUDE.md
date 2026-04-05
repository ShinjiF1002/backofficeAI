# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AIによるバックオフィスオペレーション自動化フレームワーク。Claude Desktop (computer use) を活用し、バックオフィス担当者のPC上で定型業務を自動化する。

This repo is primarily a **specification and data repository** (procedures, guardrails, knowledge, proposals — currently scaffolding only). The one runnable piece is `ui-prototype/`, a React SPA that mocks the management interface and is deployed to GitHub Pages on every push to `main`.

**Audience for `ui-prototype/`**: AI 推進部の中間管理職 (non-technical). Every screen must be legible in ≤3 seconds; technical details belong in collapsible sections or dedicated governance pages. UI copy is **JP-only** — English strings (workflow names, step names, check names) are treated as bugs.

## Working Principles (for `ui-prototype/` work)

When making changes, these rules override general best-practices:

1. **`architecture.md` is the source of truth.** Every concept (trust levels, tier model, flywheel stages, error categories) ties back to a specific section. Never rename enums or reshuffle locked colors (see §Design System, §Trust Level Progression).
2. **Middle-management legibility beats completeness.** Hide technical detail behind collapsible sections or dedicated governance pages (`/repository`, `/agents`, `/guardrails`). Page titles + subtitles must answer "what is this and what do I do" in ≤3 seconds. No engineer-facing jargon on operator/manager surfaces.
3. **Enterprise Premium is the only visual system.** All colors/shadows/spacing come from `src/index.css` tokens or `components/shared/*`. No raw hex in `.tsx`. No ad-hoc className color stacks on primitives — use variants (see §Primitive variant conventions). Reference: [design-explorations/02-enterprise-premium.html](design-explorations/02-enterprise-premium.html).
4. **Share when it repeats; don't abstract for hypotheticals.** If a pattern appears on ≥2 pages, extract to `components/shared/`. If it's a one-off, keep it inline. Don't build configurability for unused dimensions (see §Shared UI components).
5. **Clean over clever, simple over extensible.** Replace className override stacks with typed variants. Delete dead code (the pre-existing `.dark` block was one such footgun). No speculative "future-proof" props, no abstractions serving a single caller. Three similar lines beat a premature generalization.
6. **JP + mobile layout integrity is non-negotiable.** Test every change at 390×844. Never `tracking-tight` on JP text (use `tracking-normal leading-[1.4]` on headings). Wrap numerics in `<Num>` to prevent Inter/Noto baseline jitter. Paired action buttons use `size="tap"` (`min-w-[120px]`) to absorb JP label width variance. Sticky bars use `env(safe-area-inset-bottom)`.

## Key Documents

- `docs/architecture.md` — Full technical spec (tier model, procedure schemas, knowledge pipeline, agent architecture, bootstrap process). The executive summary section (top of file) is authored for middle-management and is embedded into `OverviewPage` at runtime inside a collapsible section.
- `docs/ui-prototype.md` — Management interface mockups, approval workflow, and responsive/mobile design spec (ASCII art screens)
- `knowledge/error_taxonomy.md` — 5-category feedback classification that routes corrections to the right tier
- `design-explorations/02-enterprise-premium.html` — Source-of-truth for the visual system (Stripe/Mercury-inspired tokens, shadows, atmospheric utilities)

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

1. **goal + expected_state** — invariant business logic (survives UI changes). Displayed in `DetailPanel` during task review.
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

**Permitted lint errors**: 3 pre-existing `react-refresh/only-export-components` warnings on `ui/button.tsx`, `ui/badge.tsx`, `context/AppContext.tsx`. These are due to CVA/context exports co-located with components and are accepted. If adding a new file with exported constants + components, put the constants in a separate sibling file (see `shared/flywheel-colors.ts` next to `shared/FlywheelDiagram.tsx`).

### Stack

React 19, Vite 8, TypeScript, Tailwind v4 (via `@tailwindcss/vite`; no typography plugin — write explicit classes), shadcn/ui components, react-router-dom v7, lucide-react icons, recharts. Markdown rendered with `react-markdown` + `remark-gfm`. Fonts: Inter Variable + Noto Sans JP Variable (japanese subset, via `@fontsource-variable/*`).

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

### Mobile navigation

`AppLayout` renders a fixed **BottomNav** (`md:hidden`, `z-40`) with 5 tabs: `ホーム`, `承認待ち` (→ `/home#pending` anchor), `変更提案`, `学習`, `メニュー` (opens the Sidebar drawer). It's **auto-hidden on `/tasks/:id*`** — those pages have sticky CTA bars (approve/send-back) that own the bottom of the screen in focused-task mode. The hide logic lives in `AppLayout.tsx` (`pathname.startsWith('/tasks/')`), which also drives `main`'s `pb-*`.

**Sticky footer rule:** focused-task pages use `z-40` (matches BottomNav) and horizontal inset `-mx-4 md:-mx-6 xl:-mx-8` that must match `AppLayout`'s content padding (`px-4 md:px-6 xl:px-8`). Always include `pb-[max(0.75rem,env(safe-area-inset-bottom))]`.

### Layout conventions

- **Page max-width**: Dashboard pages fill 1280px (Home, Learning, Runs, Guardrails, Agents, Repository). Reading/form pages use `max-w-4xl` for ~36 JP chars per line (Overview, HowItWorks, Upgrade, Proposal, Execute, Comment).
- **Grid breakpoints**: 3+ column grids must use `lg:` (1024px), never `sm:` or `md:` — JP text collapses in narrow 3-col layouts. 2-col grids may use `sm:`. HomePage's 3-col dashboard layout gates at `xl:` (1280px) because the left column needs ≥700px to avoid truncating `¥2,450,000 / 株式会社…` rows. Grep guard: `grep -rEn "(sm|md):grid-cols-[3-9]" src/pages` should return 0.
- **JP label dictionaries** (`src/data/types.ts`): `trustModeLabels`, `errorCategoryLabels`, `guardrailSeverityLabels`, `riskLevelLabels`, `changeTypeLabels`, `categoryLabels`. **Never** render raw enum values (`'supervised'`, `'error'`, `'tier2'` etc.) to the UI — route through these maps. Status tones map to `StatusPillTone` via a local file-scoped `const severityTone: Record<..., StatusPillTone>` record.

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

### Design System (Enterprise Premium)

Tokens live in `src/index.css` `:root` + `@theme inline`. Key tokens:

- `--background: #F8F9FA` (canvas) via `.bg-canvas` utility (includes subtle noise texture)
- `--primary: oklch(0.52 0.23 275)` (indigo-600) + `--primary-gradient-to` (violet-600) for brand gradients
- Semantic: `--success` (emerald), `--warning` (amber), `--danger` (rose)
- Architecture concept colors (**LOCKED, do not reshuffle**): `--tier-1` (teal, Tier-1 knowledge) / `--tier-2` (slate, Tier-2 procedures+guardrails)
- Shadows: `--shadow-premium-sm/md/lg` + `--shadow-cta`
- Utilities: `.glass-panel`, `.hover-lift`, `.progress-shimmer-bar`, `.animate-pulse-ring`, `.text-gradient-brand`
- Respects `prefers-reduced-motion` globally

**Flywheel stage colors are locked** in `src/components/shared/flywheel-colors.ts`: amber=corrections, teal=knowledge, violet=proposals, emerald=approved. Any new surface visualizing the learning loop must import from this file.

**JP typography rules** enforced in `@layer base`:
- `html { font-feature-settings: "palt" 1 }` for proportional kana kerning
- `.tabular-nums` overrides palt to keep Latin digit alignment
- `em` reset to `font-style: normal; font-weight: 600` (JP fonts don't italicize cleanly)
- Page H1s use `tracking-normal leading-[1.4]` — never `tracking-tight` on JP content
- Numerics are wrapped in `<Num>` component (Inter + tabular-nums + tracking-tighter) to prevent Inter/Noto baseline jitter in mixed strings

### Shared UI components (`src/components/shared/`)

Reusable domain components used across multiple pages:
- `PageHeader` — JP-safe H1 + optional subtitle (enforces `tracking-normal leading-[1.4]`). Used on 10 pages (`ExecuteReviewPage` intentionally keeps its breadcrumb + hero-card layout).
- `FlywheelDiagram` — the 修正コメント → ナレッジ → 提案 → 承認済手順 learning loop (Overview, HowItWorks, Learning)
- `POCPhaseBadge` — POC progress marker (strip + detailed variants)
- `LearningStrip` — compact weekly learning banner on HomePage
- `CategoryIcon` — per-procedure-category colored icon tile
- `ConfidenceBadge` — 90%+/70-90%/<70% tri-color pill (delegates to `StatusPill`)
- `KpiTile` — KPI card (icon + value + label + optional `children` slot for mini-viz)
- `ListRowCard` — unified icon+title+subtitle+trailing row pattern
- `CorrectionDiff` — before→after pill for correction timelines
- `TrustModeBadge` — trust-mode label with locked semantic colors
- `Num` — numeric wrapper forcing Inter + tabular-nums

When a visual concept appears on more than one page, add it here rather than duplicating JSX. **One-off tint patterns stay inline**: pages that need `border-{tone}-200/60 bg-{tone}-50/40` tile tints declare a local `const tintClasses = { emerald: '...', amber: '...', ... } as const` at the top of the file — don't create a shared `InfoTile` component.

### Primitive variant conventions

- `<Button>`: `variant="brand"` (gradient CTA) / `"brand-soft"` + `size="cta"` / `"tap"` for primary actions and mobile-safe paired bars. Never use raw `className="h-10 md:h-9"` — use `size="tap"`.
- `<Card>`: `variant="default"` / `"featured"` (shadow-premium-md) / `"tinted"` (brand gradient bg, **primary tone only**) / `"interactive"` (hover-lift + cursor-pointer). `size="sm"` tightens internal padding/gap for dense lists of tiles. Non-primary tints use `<Card size="sm" className={tintClasses.emerald}>` (see Shared UI components).
- `<Alert>`: `variant="info"` / `"warning"` / `"success"` (plus existing `default`/`destructive`). **Never** add className color overrides to Alert. Alert implies "something needs attention" — don't use it for explanatory content (use a tinted Card instead).
- `<StatusPill>` (in `ui/status-pill.tsx`): dot-prefixed semantic pill with `tone` prop. Don't add `icon?` slots — if a chip needs an icon, render it inline next to StatusPill or use plain tinted span with matching tone tokens.
- Prop-name disambiguation: Card uses `variant`, StatusPill uses `tone`, ListRowCard uses `accent`
- **Button-selector a11y pattern** (CommentPage etc.): wrap a group of toggle `<button>` elements with `role="radiogroup" aria-label="..."` and set `role="radio" aria-checked={selected}` on each button. Don't reach for a `SelectableCard` abstraction.

### Architecture doc embed

`OverviewPage` imports `../../../docs/architecture.md?raw` and renders it inside a collapsible section with `ReactMarkdown` (custom `components` prop for per-element Tailwind styling since Tailwind v4 `prose` classes are unavailable). Middle-management viewers shouldn't see this by default — it's expand-on-demand. Updates to `docs/architecture.md` flow through automatically on next build.

## Deployment

GitHub Pages is configured with Source = "GitHub Actions". The only Pages workflow is `.github/workflows/deploy.yml`:

1. Runs on push to `main` (and `workflow_dispatch`)
2. `cd ui-prototype`, `npm ci`, `npm run build`
3. Uploads `ui-prototype/dist/` as the Pages artifact

**Lockfile gotcha** (repeat offender — bit the repo at least twice, see commits d9c1200 and `fix-emnapi-lockfile`): `npm ci` fails hard on lockfile drift. `@napi-rs/wasm-runtime` declares `@emnapi/core` and `@emnapi/runtime` as **optional** peer deps. npm on macOS/Windows omits them from `package-lock.json`; GitHub Actions (Linux) expects them and fails. Both are pinned as explicit `devDependencies` in `ui-prototype/package.json` to force lockfile inclusion. If you see `Missing: @emnapi/* from lock file` in CI, run `npm install` locally to refresh — do not remove the devDep entries.

Live site: `https://shinjif1002.github.io/backofficeAI/`

## Bootstrap Process (Spec Side, Not Yet Started)

1. Import manuals into `manuals/raw/`, LLM structures them into `manuals/parsed/`
2. Generate procedure drafts, batch human review via proposals (`reviewMode: 'batch'`)
3. Supervised execution with feedback to build knowledge base
