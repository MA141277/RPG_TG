# AI Mod Draft UI Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an in-editor AI generation panel that creates a Script Editor project from a topic without command-line use.

**Architecture:** Keep semantic generation and deterministic conversion in `src/application/ai-mod-draft`. The Script Editor landing UI only collects temporary credentials/topic input, calls the application helper, and opens the resulting project through the existing workspace state path.

**Tech Stack:** TypeScript application helper, existing `MainUiFlow` JavaScript UI, existing Script Editor CSS, Node test runner.

## Global Constraints

- Do not persist API keys.
- Do not write API keys into generated project data.
- Do not generate or execute JavaScript, regex scripts, or free-form runtime logic.
- Do not bypass the existing Script Editor workspace, preview, validation, and export flow.
- Keep AI semantic generation separate from runtime execution.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-20`
- Current Focus: `AI Mod Draft landing-page UI integration complete.`
- Next Step: `Use Script Editor landing -> AI 生成项目 for manual testing.`
- Verification: `npm run lint:blueprints; npm run lint:plans; npm run typecheck; npm run build; npm test`
- Notes: `Implemented after operator approved the recommended landing-page panel approach.`

## Progress Log

- 2026-07-20
  - Summary: `Added RED tests for UI integration, implemented the application helper and Script Editor landing panel, and preserved the non-persistent API key boundary.`
  - Verification: `npm run build:test and node --test tests/ai-mod-draft.test.cjs passed for focused coverage; npm run lint:blueprints, npm run lint:plans, npm run typecheck, npm run build, and npm test passed for closeout.`
  - Next: `None.`
- 2026-07-20
  - Summary: `Fixed AI-generated project handoff when model output contains non-string nested fields by sanitizing AI draft world, narrative, and scenario-profile mapping before workspace render.`
  - Verification: `Browser mock generation with dirty nested AI fields opened the Script Editor workspace; npm run build:test and node --test tests/ai-mod-draft.test.cjs passed; npm run typecheck passed.`
  - Next: `None.`
- 2026-07-20
  - Summary: `Fixed wrapped AI JSON responses that put the requested draft under fields like draft/data/result, which previously surfaced as missing top-level id and title diagnostics.`
  - Verification: `npm run build:test and node --test tests/ai-mod-draft.test.cjs passed; npm run typecheck passed; npm test passed.`
  - Next: `None.`
- 2026-07-20
  - Summary: `Fixed generated drafts that omit top-level id and title by deriving stable draft identity from the requested topic before normalization.`
  - Verification: `npm run build:test and node --test tests/ai-mod-draft.test.cjs passed; npm run typecheck, npm test, npm run build, npm run lint:blueprints, and npm run lint:plans passed.`
  - Next: `None.`
- 2026-07-20
  - Summary: `Added browser console diagnostics for the AI generation chain, including raw model JSON, extracted draft payload, normalized draft summary, and converted Script Editor project summary.`
  - Verification: `npm run build:test and node --test tests/ai-mod-draft.test.cjs passed; npm run typecheck passed.`
  - Next: `Use browser DevTools console to inspect whether empty workspaces originate from sparse model output or conversion loss.`
- 2026-07-20
  - Summary: `Rejected AI draft shells that would create empty editor projects and strengthened the generation prompt with minimum editable content counts.`
  - Verification: `RED-GREEN verified with npm run build:test and node --test tests/ai-mod-draft.test.cjs; npm run typecheck passed.`
  - Next: `Regenerate from the Script Editor landing UI; sparse model output should now fail with explicit missing-content diagnostics instead of opening an empty workspace.`
- 2026-07-20
  - Summary: `Accepted common model alias fields for world and entity structures, and strengthened the prompt to require exact editable field paths.`
  - Verification: `RED-GREEN verified with npm run build:test and node --test tests/ai-mod-draft.test.cjs; npm run typecheck passed.`
  - Next: `Regenerate from the Script Editor landing UI; aliases like locations/protagonist/npcs should now materialize into buildings/player/people.`
- 2026-07-21
  - Summary: `Made AI-generated editor projects runtime-previewable by keeping AI story-node relations out of unsupported lowering fields and normalizing AI event binding triggers to runtime-supported after:* actions.`
  - Verification: `RED-GREEN verified with npm run build:test and node --test tests/ai-mod-draft.test.cjs; targeted script editor runtime export and event-binding tests passed. npm run typecheck is currently blocked by unrelated untracked src/content/scenario-packs/er imports.`
  - Next: `Regenerate the AI project and use runtime preview from the Script Editor toolbar.`

---

## Tasks

### Task 1: Application Helper

**Files:**
- Create: `src/application/ai-mod-draft/ai-mod-draft-ui-flow.ts`
- Modify: `tests/ai-mod-draft.test.cjs`

- [x] **Step 1: Write RED test for injected model output conversion**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement `generateScriptEditorProjectFromAiTopic`**
- [x] **Step 4: Verify GREEN**

### Task 2: Landing UI

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/styles/script-editor.css`
- Modify: `tests/ai-mod-draft.test.cjs`

- [x] **Step 1: Write RED source guard for the landing AI panel**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Add panel, action handler, project handoff, and responsive styles**
- [x] **Step 4: Verify GREEN**

## Exit Check

- [x] Landing page exposes topic, API key, base URL, model, and generate action.
- [x] API key field is password type.
- [x] UI calls the application helper instead of reimplementing conversion.
- [x] Generated project opens in the Script Editor workspace.
- [x] API key is not persisted in local storage or serialized project files.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Focused verification recorded
