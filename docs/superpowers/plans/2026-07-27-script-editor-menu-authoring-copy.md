# Script Editor Menu Authoring Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让剧本编辑器菜单 tab 只展示中文创作字段，不再把运行时 id 和英文技术键暴露给作者。

**Architecture:** 保持现有 `menuResources/menuInstances/MenuEntryDefinition` 存储契约不变，只在 authoring 默认值与主界面渲染层增加 creator-facing 中文映射。菜单更新仍走现有 `updateScriptEditorLocationMenuEntryField` 回写通路。

**Tech Stack:** JavaScript, TypeScript, Node test runner

## Execution State

- Status: `closed`
- Last Updated: `2026-07-27`
- Current Focus: `Closed after the creator-facing menu tab cleanup landed.`
- Next Step: `No further action in this plan; historical record only.`
- Verification: `npm.cmd run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor menu authoring defaults use Chinese creator-facing copy|script editor menu tab hides runtime ids and english protocol fields from creators|default scenario city menu resources keep Chinese menu copy"`
- Notes: `Backfilled governance sections so the historical plan remains lint-valid after implementation completion.`

## Progress Log

- 2026-07-27
  - Summary: `Completed the Script Editor menu-tab creator-facing copy cleanup, removed visible runtime ids from the authoring tab, and restored Chinese default menu copy for authoring and runtime resources.`
  - Verification: `npm.cmd run build:test; node --test tests/robustness.test.cjs --test-name-pattern "script editor menu authoring defaults use Chinese creator-facing copy|script editor menu tab hides runtime ids and english protocol fields from creators|default scenario city menu resources keep Chinese menu copy"`
  - Next: `None. Historical plan only.`

## Global Constraints

- 不改动运行时菜单数据结构。
- 作者面不得显示 `instanceId`、`resourceId`、`entry.id`。
- 作者面不得直接显示英文 `menuFamily`、`targetFamily`、目标选项 `(...id)`。

---

### Task 1: Lock The Authoring-Surface Regression

**Files:**
- Modify: `D:/workspace/project/RPG_TG/tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `src/ui/main-ui/main-ui-flow.js`, `src/application/script-editor/menu-authoring.ts`
- Produces: source guards for creator-facing menu copy and default Chinese menu authoring values

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
- [ ] **Step 4: Run test to verify it passes**

### Task 2: Convert Menu Tab To Creator-Facing Chinese Copy

**Files:**
- Modify: `D:/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js`
- Modify: `D:/workspace/project/RPG_TG/src/application/script-editor/menu-authoring.ts`

**Interfaces:**
- Consumes: existing menu authoring update functions and menu bundle listing
- Produces: creator-facing menu-tab rendering that keeps internal runtime values hidden

- [ ] **Step 1: Add Chinese label mappers and creator-facing target option resolution**
- [ ] **Step 2: Hide id fields and replace English fields with Chinese selects**
- [ ] **Step 3: Switch default menu titles/labels to Chinese**
- [ ] **Step 4: Run targeted tests**

### Task 3: Verify And Record

**Files:**
- Modify: `D:/workspace/project/RPG_TG/docs/change-log.md`

**Interfaces:**
- Consumes: implemented UI/authoring change
- Produces: change-log record for the creator-facing menu tab cleanup

- [ ] **Step 1: Update change log**
- [ ] **Step 2: Run `npm.cmd run build:test`**
- [ ] **Step 3: Run targeted node tests**

## Child Closeout

- Closed Child: `docs/superpowers/plans/2026-07-27-script-editor-menu-authoring-copy.md`
- Parent Task: `ACC-FORMAT-006 creator-facing contradiction repair`
- Parent Stage: `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance`
- Closeout Status: `closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `none`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `success`
- Push Commit: `c72f4f6e`
- Resume From: `historical record only`
