# Zhuyuanzhang Pack Migration Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `src/content/scenario-packs/zhuyuanzhang/` onto the canonical manifest-plus-split-table path for its first migration slice.

**Architecture:** Keep runtime behavior unchanged while adding pack-local JSON tables for the zhuyuanzhang scenario entry and migrating code to consume those pack-local files. Limit phase 1 to manifest shape and core scenario tables, not the entire historical dataset.

**Tech Stack:** TypeScript, JSON modules, Node test runner

## Execution State

- Status: `unknown`
- Last Updated: `2026-06-26`
- Current Focus: `Inspect completed checkboxes and current code state before resuming.`
- Next Step: `Resume from the first unchecked checkbox.`
- Verification: `Check latest progress entry and rerun required commands before continuing.`
- Notes: `Historical progress before this tracking block may be incomplete.`

## Progress Log

- 2026-06-26
  - Summary: `Added standardized progress-tracking sections to this plan.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Resume from the first unchecked checkbox.`

---

### Scope

Phase 1 migrates:

- `pack.json` to canonical `scenario-pack` manifest shape
- `scenario-profile.json`
- `activities.json`
- `events.json`
- `scenes.json`
- `text-entries.json`

Phase 1 does not yet migrate:

- `historical-characters`
- `historical-city-rosters`
- full `prototype-world` derivatives such as all city npc pools and all house refusal rules

## Completion Checklist

- [ ] Reconcile this legacy phase-1 plan against the current repository state
- [ ] Mark superseded scope explicitly if later plans have replaced the remaining work
