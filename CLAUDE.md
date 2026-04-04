# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AIによるバックオフィスオペレーション自動化フレームワーク。Claude Desktop (computer use) を活用し、バックオフィス担当者のPC上で定型業務を自動化する。

This is a **specification and data repository** — no runnable code, build system, or package manager exists yet. The repo contains architectural specs, directory scaffolding, and will be populated with procedures, knowledge, and agent configs.

## Key Documents

- `docs/architecture.md` — Full technical spec (tier model, procedure schemas, knowledge pipeline, agent architecture, bootstrap process)
- `docs/ui-prototype.md` — Management interface mockups and approval workflow (ASCII art screens)
- `knowledge/error_taxonomy.md` — 5-category feedback classification that routes corrections to the right tier

## Architecture

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

## File Conventions

- Index files (`_index.md`) in `procedures/`, `guardrails/`, `knowledge/compiled/` are auto-generated with `<!-- auto-generated -->` comment
- Procedure definitions: `{domain}/{name}.md` (human-readable) + `{domain}/{name}.schema.yaml` (machine-readable)
- Guardrails: YAML with `severity` (error/warning) and `source_knowledge` references
- Knowledge articles: Markdown with YAML frontmatter (`id`, `created`, `affects`, `confidence`)
- Corrections: `{timestamp}_{procedure}_{run_id}.md`
- Runs: `runs/{YYYY-MM}/{run_id}/` containing plan, execution log, screenshots, approval, feedback

## Bootstrap Process (Not Yet Started)

1. Import manuals into `manuals/raw/`, LLM structures them into `manuals/parsed/`
2. Generate procedure drafts, batch human review via proposals
3. Supervised execution with feedback to build knowledge base
