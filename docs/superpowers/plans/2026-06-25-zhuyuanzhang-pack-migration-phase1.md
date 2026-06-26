# Zhuyuanzhang Pack Migration Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `src/content/scenario-packs/zhuyuanzhang/` onto the canonical manifest-plus-split-table path for its first migration slice.

**Architecture:** Keep runtime behavior unchanged while adding pack-local JSON tables for the zhuyuanzhang scenario entry and migrating code to consume those pack-local files. Limit phase 1 to manifest shape and core scenario tables, not the entire historical dataset.

**Tech Stack:** TypeScript, JSON modules, Node test runner

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

