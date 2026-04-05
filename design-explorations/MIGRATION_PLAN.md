# Enterprise Premium Migration Plan

**Target**: Migrate `ui-prototype/` from default shadcn/ui styling to the "Enterprise Premium" direction (Stripe/Mercury/Ramp-inspired).

**Reference designs**: `design-explorations/02-enterprise-premium.html` (Home desktop), `02-mobile-home.html` (mobile), `02-task-review.html` (Task Review desktop).

**Strategy**: Token-first, then layout shell, then pages in priority order. Each phase is independently deployable — you can stop after any phase and still have a coherent app.

---

## Design System Specification

### Typography
- **Body/UI**: Inter + Noto Sans JP (replaces Geist)
- **Mono/Numerals**: ui-monospace / SFMono-Regular (for metrics, IDs, timestamps)
- **Tabular numerals**: applied to all metric values via `font-variant-numeric: tabular-nums`

### Color Tokens (OKLCH, written for `src/index.css`)

| Token | Light Value | Role |
|---|---|---|
| `--background` | `oklch(0.985 0.002 250)` | Canvas off-white `#F8F9FA` |
| `--foreground` | `oklch(0.205 0.03 250)` | slate-800 body text |
| `--card` | `oklch(1 0 0)` | Pure white surfaces |
| `--muted` | `oklch(0.97 0.004 250)` | bg-slate-50 |
| `--muted-foreground` | `oklch(0.55 0.02 250)` | slate-500 |
| `--border` | `oklch(0.93 0.004 250)` | slate-200 |
| `--primary` | `oklch(0.52 0.22 275)` | indigo-600 `#4F46E5` |
| `--primary-foreground` | `oklch(1 0 0)` | white |
| `--accent` | `oklch(0.96 0.04 275)` | indigo-50 |
| `--accent-foreground` | `oklch(0.48 0.22 275)` | indigo-700 |
| `--destructive` | `oklch(0.62 0.22 20)` | rose-500 |
| `--ring` | `oklch(0.58 0.2 275)` | focus ring indigo |
| `--sidebar` | `oklch(1 0 0)` | white |
| `--sidebar-accent` | `oklch(0.96 0.04 275)` | indigo-50 (gradient base) |
| `--sidebar-accent-foreground` | `oklch(0.48 0.22 275)` | indigo-700 |
| `--radius` | `0.875rem` | 14px base (was 10px) |

**New non-shadcn semantic tokens** (for direct Tailwind use):
- Success: use `emerald-{50,500,600,700}`
- Warning: use `amber-{50,500,600,700}` + `amber-{100,200}` for stronger variants
- Info/Brand: `indigo-{50,500,600,700}` and `violet-500/600` (for gradients)

### Shadows (add as Tailwind `boxShadow` extensions)

```js
'card': '0 1px 3px rgba(15,23,42,0.02), 0 4px 12px rgba(15,23,42,0.03)',
'card-hover': '0 2px 6px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
'premium-soft': '0 2px 10px -2px rgba(15,23,42,0.03)',
'float': '0 12px 32px -8px rgba(15,23,42,0.08)',
'glow-brand': '0 0 20px rgba(99,102,241,0.2)',
'cta': '0 4px 14px 0 rgba(99,102,241,0.25)',
```

### Radius scale
- `rounded-md` = 8px (small controls, badges)
- `rounded-lg` = 10px (inputs, secondary buttons)
- `rounded-xl` = 14px (primary buttons, list items, icon boxes)
- `rounded-2xl` = 18px (hero cards, modal surfaces)

### Reusable Component Patterns (document as you build)

**P1 — KPI card** (`src/components/patterns/KpiCard.tsx`): white surface, rounded-xl, shadow-card, 1px border slate-200/60; icon circle top-left (w-8 h-8 bg-{color}-50 text-{color}-600); large tabular-num value (text-2xl/3xl font-semibold tracking-tight); uppercase label; optional trend pill or sparkline SVG background.

**P2 — List row card** (queue items, corrections, tasks): white rounded-xl shadow-premium-soft border-slate-200/80; left icon-box (w-10 h-10 rounded-xl colored bg); stacked title + metadata; right-side confidence badge + timestamp; hover:shadow-card-hover active:scale-[0.98] on mobile.

**P3 — Primary CTA gradient button**: `bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-cta rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all`. Apply to 承認 Approve, Submit, New Task actions.

**P4 — Status badge**: `bg-{color}-50 border-{color}-200 text-{color}-700 rounded-md px-1.5 py-0.5 text-[10px] font-bold` with 1.5px dot prefix. Variants: emerald (success/high-confidence), amber (warning), rose (danger/missed), indigo (info/brand-flagged), slate (neutral).

**P5 — Section header**: `text-sm font-bold text-slate-800 flex items-center gap-2` + optional count pill (`bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full`) + right-aligned link button.

**P6 — Sidebar nav item (active)**: `bg-gradient-to-r from-indigo-50 to-transparent text-indigo-700 border-l-2 border-indigo-500` with filled icon; inactive uses slate-600 + outline icons, hover:bg-slate-50.

**P7 — Mobile bottom tab bar**: fixed bottom, 4 tabs, `bg-white/90 backdrop-blur-lg border-t border-slate-200/60 pt-2 pb-[env(safe-area-inset-bottom)]`; active tab has gradient-filled icon + brand-600 label + 1px indicator dot below; inactive tabs opacity-60.

**P8 — Warning row variant** (P2 with amber tint): border-amber-200, `bg-gradient-to-r from-amber-50/30 to-transparent`, left 4px amber-500 stripe, warning-circle icon inline with title.

---

## Phase Execution Plan

### Phase 0 — Design System Foundation
**Goal**: All primitives render in new aesthetic before touching pages.

**Files**:
- `ui-prototype/src/index.css` — replace OKLCH tokens, radius, add custom shadow classes via `@theme` block
- `ui-prototype/package.json` — add `@fontsource-variable/inter` and `@fontsource/noto-sans-jp` (optional weights 400/500/600/700); keep geist for now for fallback
- `ui-prototype/src/main.tsx` or `index.css` — import Inter + Noto Sans JP
- `ui-prototype/tailwind.config.*` or `@theme` inline — add `fontFamily.sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif']`, `fontFamily.mono`, custom shadow tokens

**Verification**: `npm run dev` loads with new fonts + off-white canvas; existing pages look different but not broken.

**Estimated touch**: 2 files, small diffs.

---

### Phase 1 — Layout Shell
**Goal**: Sidebar, TopBar, mobile drawer, and new mobile bottom-tab bar are in new aesthetic.

**Files to modify**:
- `src/components/layout/Sidebar.tsx`
  - Width: `w-56` → `w-[260px]` (bit wider)
  - Logo area: add gradient icon box (`bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg`)
  - Brand text: "Backoffice AI" → retain, style as `font-bold text-slate-800 tracking-tight text-sm` + `font-medium text-slate-400` split
  - Nav items: apply P6 pattern — active uses gradient+border-l-2, inactive uses slate-600 + text-slate-400 icons
  - Add count-pill badges on active items (e.g. "12" on Tasks)
  - Footer user avatar: p-4 border-t with hover bg-slate-50
- `src/components/layout/TopBar.tsx`
  - Height: `h-14` keep
  - Add breadcrumb pattern: `Home > section > [current]` with slate-100 pill for current
  - Right: elapsed time (where applicable), status pill (amber/emerald/brand), avatar, notifications icon
  - Remove team Badge from avatar area OR redesign as subtle slate-500 text
  - Mobile: keep Menu button, hide breadcrumbs, show only page title + avatar
- `src/components/layout/AppLayout.tsx`
  - Change `bg-background` → add canvas texture if needed (optional `bg-dots` pattern for empty areas)
  - Mobile drawer: keep, but restyle drawer sidebar with new token colors
  - **Add conditional mobile bottom-tab-bar rendering** below `md:hidden` (see new component below)
  - Adjust main padding: `pb-24 md:pb-6` (extra bottom space for mobile tab bar)

**New files**:
- `src/components/layout/MobileTabBar.tsx` — P7 pattern; 4 tabs filtered by role:
  - Staff: Home (/home), Tasks (/home#pending), Activity (/home#corrections), Profile
  - Manager: Home (/home), Proposals (/proposals), Learning (/learning), Profile
- `src/components/layout/PageHeader.tsx` (optional new reusable): title + subtitle + right-slot actions area, enforces consistent page top structure

**Icon library decision**: current uses `lucide-react`. Option 2 references use `phosphor-icons`. **Recommendation**: keep lucide-react (already installed) but select more expressive variants (solid/filled where Phosphor would use `ph-fill`). Lucide has most equivalents. Avoid adding new dep.

**Verification**: Navigation feels premium on desktop; mobile shows bottom tab bar; old drawer still works as secondary menu.

**Estimated touch**: 3 modified files, 1-2 new files.

---

### Phase 2 — Operator Home (`/home`)
**Goal**: First page operators see matches Option 2 reference exactly.

**Files to modify**:
- `src/pages/HomePage.tsx`
  - Replace current title h-block with greeting pattern: "おはようございます、{name}さん" (large) + date line above
  - Structure: greeting header → KPI grid (4-col desktop, 2x2 mobile) → 2-col lg grid (Pending left-wide, Running right) → full-width Recent Corrections
  - Remove `max-w-4xl` constraint; use `max-w-[1400px]` for executive density
- `src/components/home/KpiCards.tsx`
  - Apply P1 pattern; retain the 4 KPIs (pending/running/done/accuracy)
  - Add sparkline SVG to Pending (primary KPI) — small inline chart using mock trend data
  - Add trend pill to Accuracy KPI (+0.4% emerald pill)
  - Remove existing "目標: xx" target subtitle OR redesign as subtitle slate-400
- `src/components/home/PendingQueue.tsx`
  - Replace Table → P2 list-row cards (stacked, not table)
  - Each row: colored icon-box (different color per procedure type: blue=請求書, violet=支払, amber=経費 warning, emerald=ベンダー), title + subtitle (vendor/file), confidence badge right, timestamp
  - Click → navigate to `/tasks/:id`
  - Show top 4-5; add "すべて見る" button below with arrow
- `src/components/home/RunningTasks.tsx`
  - Replace flex items with Option 2 running-task-card pattern: icon + title + step pill (N/M steps) + gradient progress bar + subtitle status message
  - Add shimmer animation to progress bar (see reference CSS `@keyframes progressSweep`)
- `src/components/home/WarningBanner.tsx`
  - Keep purpose (flag repeat issues) but restyle: white card with amber-500 left stripe (4px) instead of full amber bg; title "繰り返し発生: N件" + list of issues with date/author
  - OR fold into Recent Corrections section (decide during implementation)
- **New section component**: `src/components/home/RecentCorrections.tsx`
  - Compact timeline: vertical line + dots + entries showing manual corrections with before→after diff pills (e.g. `¥50,000 → ¥55,000` with strikethrough)
  - Reuses mock `comments` data

**Verification**: Open `/home`, matches `02-enterprise-premium.html` layout & feel.

**Estimated touch**: 5 modified, 1 new file.

---

### Phase 3 — Task Review Flow (`/tasks/:id`, `/tasks/:id/comment`)
**Goal**: Operator's main work surface matches `02-task-review.html`.

**Files to modify**:
- `src/pages/ExecuteReviewPage.tsx`
  - Restructure to 60/40 split: left = screenshot viewer with toolbar, right = stacked info cards + sticky bottom action bar
  - Add hero header above split: title + PAY-## id pill + meta row (created date, proc id, assignee) + right-aligned AI Confidence big number
  - Breadcrumb in TopBar: `Home > Tasks > #4093 Payment Approval`
- `src/components/review/StepProgress.tsx`
  - Move to top toolbar of screenshot viewer as tabs (`Original | AI Extraction | Routing Logic`); step circles stay as alternate display
  - Active tab: white bg, brand-600 text, shadow-sm
- `src/components/review/DetailPanel.tsx` → effectively becomes the right-side panel
  - Refactor to stacked cards: AI Extraction Results → Validation Checks → Knowledge Applied (chips)
- `src/components/review/ChecksList.tsx`
  - Apply slate-50 rounded-lg rows with emerald/amber/rose icon-filled indicators (P4 semantic colors)
  - Warning item expands inline to show progress bar (e.g., budget % utilized)
- `src/components/review/CheckFailedAlert.tsx`
  - Restyle as amber-tinted warning card (Option 2 amber variant of P2)
- `src/components/review/ScreenshotPlaceholder.tsx`
  - Add toolbar frame: Original/AI Extraction/Routing tabs + zoom controls (see ref)
  - Support AI bounding-box overlays (new prop `boundingBoxes?: Array<{top, left, w, h, label}>`)
  - Background: `bg-dots` pattern (radial-gradient)
- `src/components/review/ReviewActions.tsx`
  - Sticky bottom action bar (P3 gradient CTA for 承認, secondary outline for 差し戻し)
  - Remove current inline h-10 md:h-8 sizing; standardize to h-12 (larger tap targets)
- `src/pages/CommentPage.tsx`
  - Retain layout but restyle Cards, use new Card component pattern
  - Redesign SimilarNote as chip list (P4 style)
- `src/components/comment/CommentForm.tsx` — Input/Textarea use new focus-ring (indigo-500/20) styling
- `src/components/comment/AiJudgmentDisplay.tsx` — restyle as P4 info card
- `src/components/comment/SimilarNote.tsx` — chip/card hybrid

**Verification**: Review flow on desktop matches reference; mobile: stacks vertically (screenshot first, then info cards, then sticky bottom action bar above mobile tab bar).

**Estimated touch**: 8 modified files.

---

### Phase 4 — Manager Pages (`/proposals`, `/learning`)
**Goal**: Manager workflow matches Enterprise Premium system.

**Files to modify**:
- `src/pages/ProposalReviewPage.tsx`
  - Hero: title + 4 status summary pills (pending/approved/rejected/held counts) using P4 variants
  - Replace slate-50 Alert with white card + indigo-500 left border + info icon
- `src/components/proposal/ProposalCard.tsx`
  - Restyle risk badges to P4 pattern (emerald=low, amber=med, rose=high)
  - Diff visualization: upgrade red-50/emerald-50 blocks to have 1px borders, slate-900 monospace text, `font-mono text-xs`
  - Impact grid: 2-col with icon+metric pairs
  - Voices list: each as P2 mini list-row with user avatar initial
  - Admin action area: Textarea with focus ring, gradient Approve + outline Reject + ghost Hold
- `src/pages/LearningStatusPage.tsx`
  - Highlights card: white w/ emerald-500 left stripe (replace emerald-50 bg)
  - Add section headers using P5 pattern
- `src/components/learning/LearningKpi.tsx`
  - Apply P1 KPI pattern; restyle Database/TrendingUp/BookOpen icon colors to indigo-500, emerald-500, violet-500 in new alpha bgs
- `src/components/learning/AccuracyChart.tsx`
  - Update hardcoded Recharts colors: line `#4F46E5` (indigo-600), reference line `#F59E0B` (amber-500), grid stroke `#E2E8F0` (slate-200), axis text `#64748B` (slate-500)
  - Add area-fill below line with `url(#gradient)` stop-color indigo-500 alpha 0.1
  - Custom Tooltip component styled as P4 card
- `src/components/learning/WorkflowTable.tsx`
  - Option: keep table on desktop but restyle header (slate-500 uppercase tracking-wider), zebra-stripe rows with hover:bg-slate-50
  - Mode badge: P4 pattern (slate=post-check, indigo=checkpoint, emerald=full-step)
  - "Ready to upgrade" button: small gradient CTA
- `src/components/learning/CommentImpact.tsx` — apply P1 or small bar chart with indigo gradient

**Verification**: Manager pages feel consistent with operator pages; charts use new palette.

**Estimated touch**: 7 modified files.

---

### Phase 5 — Upgrade, Overview, HowItWorks, Repository
**Goal**: Marketing & system pages consistent.

**Files to modify**:
- `src/pages/UpgradePage.tsx` — emerald-50 checklist card → white w/ emerald-500 stripe; mode comparison grid uses P1 card pattern
- `src/pages/OverviewPage.tsx` — restyle What/Problem/Solution cards; "Safety Principles" 2-col grid → P1 pattern; architecture markdown section: keep styles but update link colors to indigo
- `src/pages/HowItWorksPage.tsx` — 4-step Core Cycle cards: restyle backgrounds (blue-50/violet-50/emerald-50/amber-50) to use brand-50 + tinted icon-box per step; teal-50 "two-tier" boxes → replace teal with indigo accent
- `src/pages/RepositoryPage.tsx` — restyle FolderItem tree (border-l slate-200 → slate-100, icons → Lucide with new colors); Tier 1/2 badges → P4 pattern
- `src/components/upgrade/ModeComparison.tsx`, `UpgradeDetail.tsx` — apply P1 cards and P4 badges

**Verification**: Whole app has consistent feel when navigating between sections.

**Estimated touch**: 6-7 modified files.

---

### Phase 6 — Mobile Refinement
**Goal**: Mobile UX matches `02-mobile-home.html`.

**Cross-cutting mobile tasks**:
- Touch targets: audit all buttons/links — minimum 44x44px (use `h-11` min)
- Safe area insets: `pb-[env(safe-area-inset-bottom)]` on bottom bars; `pt-[env(safe-area-inset-top)]` on fixed headers
- Active states: add `active:scale-[0.98] transition-transform` to tappable list rows
- Remove hover-only affordances; ensure all info visible without hover
- Disable double-tap zoom: `touch-manipulation` + viewport meta is already set
- Add `-webkit-tap-highlight-color: transparent` globally in index.css

**Mobile-specific components to verify/adjust**:
- `MobileTabBar.tsx` — route-aware active state, JP labels
- `HomePage.tsx` — test 2x2 KPI grid; verify WarningBanner doesn't overflow
- `ExecuteReviewPage.tsx` — screenshot viewer on mobile: full-width, action buttons stick to bottom ABOVE tab bar (adjust z-index + bottom offset)
- `PendingQueue.tsx` items — swipe-to-approve gesture (optional stretch: use framer-motion or base-ui swipe primitive)

**Verification**: Test in browser DevTools at 390x844 (iPhone 14); navigate all pages; every action reachable with thumb.

**Estimated touch**: Cross-cutting adjustments; no new files except optional swipe wrapper.

---

### Phase 7 — Polish & QA
**Goal**: Ship-ready finish.

**Checklist**:
- [ ] Empty states: every list/queue/timeline renders a friendly empty state (icon + message + optional CTA)
- [ ] Loading states: add skeleton pulses for Card surfaces using `bg-slate-100 animate-pulse rounded-xl`
- [ ] Error states: design a consistent error card (rose-500 stripe + retry button)
- [ ] Focus visible: all interactive elements have `focus-visible:ring-2 focus-visible:ring-indigo-500/30`
- [ ] Keyboard nav: tab order is logical, Esc closes drawer/modals
- [ ] Dark mode: decide scope — defer OR update .dark tokens in index.css (Option 2 is light-first; recommend deferring dark mode to later sprint)
- [ ] Color contrast: run axe or Lighthouse; ensure slate-400 on white meets AA (4.5:1) for body text
- [ ] JP font fallback: verify Noto Sans JP loads; fallback to system sans
- [ ] Responsive sweep: test 375, 768, 1024, 1440, 1920 widths
- [ ] Build: `npm run build` + `npm run preview` passes
- [ ] Lint: `npm run lint` clean
- [ ] Lockfile: `npm install` run locally to refresh `package-lock.json` before push (CI uses `npm ci`)

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| shadcn token changes break existing components | Token shift is mostly cosmetic (all refs via CSS variables). Smoke-test after Phase 0. |
| Recharts colors hardcoded, hard to theme | Centralize chart colors in a `src/lib/chart-theme.ts` constants file; import in every chart |
| Mobile tab bar clashes with drawer | Decide: bottom tabs replace drawer primary nav; drawer kept for secondary items (settings, logout). Document in CLAUDE.md. |
| Phosphor icons in reference vs Lucide in code | Lucide has 95% equivalents. Keep Lucide. Only install Phosphor if specific icon missing. |
| Font load flash (FOUT) | Use `font-display: swap` (default for @fontsource) + preload primary weight |
| Build size increases from added fonts | Load only weights used (400/500/600/700); Noto Sans JP is large — consider CDN vs bundle |
| Many files = long review | Each phase is independent; open PRs per phase for reviewability |

---

## Estimated Scope

- **Files modified**: ~30
- **New files**: 2-3 (MobileTabBar, optional PageHeader, optional chart-theme.ts)
- **Phases**: 7
- **Each phase**: ships green — `npm run build` passes after every phase

## Deployment

- GitHub Pages deploys on push to `main` via `.github/workflows/deploy.yml`
- Each phase can merge independently to `main` and deploy
- Recommend PR-per-phase to keep review surface manageable
- Remember to run `npm install` locally if deps change so `package-lock.json` stays in sync (CI uses `npm ci` which fails on drift)

---

## Reference Files

- `design-explorations/02-enterprise-premium.html` — desktop Home reference (source of truth for KPI/queue/running task patterns)
- `design-explorations/02-mobile-home.html` — mobile Home + bottom tab bar reference
- `design-explorations/02-task-review.html` — desktop Task Review (screenshot viewer, right panel, sticky actions)

Keep these files in the repo as design-time artifacts. Do not bundle into the app build.
