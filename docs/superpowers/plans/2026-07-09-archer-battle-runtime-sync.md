# Archer Battle Runtime Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the in-game archer battle animation match the editor by porting the new arrow runtime rules, importing the new arrow image, and replacing the archer project data.

**Architecture:** Keep the battle runtime on the existing `prototypes/battle-demo/index.html` player path, but teach its Spine renderer to understand editor project fields that were added recently: `customImages`, `arrowVisibilityTracks`, `arrowParentTracks`, and parent-switch interpolation boundaries. Preserve the current project format so the editor and runtime can share the same project JSON.

**Tech Stack:** HTML + vanilla JS battle prototype, JSON animation assets under `src/faxian/leg/archer/`, PowerShell for asset copy, local browser verification, inline script syntax verification with Node.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-09`
- Current Focus: `Implementation finished; verification is recorded, but browser-process validation remains environment-limited.`
- Next Step: `Use a local browser session to visually confirm the embedded battle archer attack matches the editor timeline after the runtime parity patch.`
- Verification: `Battle demo inline script syntax passes; archer project JSON parses; custom arrow image path and arrow track data are present. Browser launch automation was blocked by local environment policy.`
- Notes: `This child was executed inline in the current session rather than handed off.`

## Progress Log

- 2026-07-09
  - Summary: `Created the plan and confirmed the battle runtime still lacks custom image loading, arrow visibility tracks, arrow parent tracks, and parent-switch interpolation handling.`
  - Verification: `Context inspection only`
  - Next: `Implement runtime parity in the battle demo renderer, then replace archer assets and verify the embedded battle page.`

- 2026-07-09
  - Summary: `Patched BattleSpineRenderer to load project custom images, honor arrow visibility / temporary parent tracks, anchor temporarily bound arrow carriers, and stop interpolating across parent-switch frames. Imported the new arrow PNG and replaced the archer project JSON with the updated editor export, rewriting the custom arrow source to the repository-local PNG path.`
  - Verification: `inline-script-syntax-ok; archer project JSON parse OK; custom arrow image src, arrow visibility tracks, and arrow parent tracks confirmed in repo asset`
  - Next: `Do a manual visual browser pass when a local browser launch path is available.`

---

## Based On Spec

- Primary spec:
  - `User-approved inline design in this thread for battle runtime / editor animation parity`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Extend the battle Spine renderer so it can play the new editor project fields.
- `src/faxian/leg/archer/project.json`
  - Replace the current archer animation with the new arrow-shot project data.

### New files to create

- `src/faxian/leg/archer/arrow.png`
  - Imported arrow image used by the updated archer project.

## Verification Plan

- Targeted verification:
  - `BattleSpineRenderer` accepts the updated archer project without errors and renders the new arrow animation path.
- Required commands:
  - `npm run lint:plans`
  - `node inline-script-syntax check for prototypes/battle-demo/index.html`
  - `browser check against /prototypes/battle-demo/index.html?embedded=1`

## Task 1: Runtime Parity And Asset Replacement

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Modify: `src/faxian/leg/archer/project.json`
- Create: `src/faxian/leg/archer/arrow.png`
- Read: `tools/spine-node-timeline-editor.html`

- [x] **Step 1: Add battle runtime support for editor-only arrow fields**

Port the editor-side runtime rules that are required for playback parity:
- custom image loading
- arrow visibility tracks
- arrow temporary parent tracks
- no interpolation across parent-switch boundaries

- [x] **Step 2: Replace the archer animation asset set**

Import the new arrow image into `src/faxian/leg/archer/arrow.png` and update `src/faxian/leg/archer/project.json` to the new editor project data, keeping the arrow image reference repository-local.

- [x] **Step 3: Verify syntax and local playback**

Run:

```bash
node <inline syntax check for prototypes/battle-demo/index.html>
```

Expected:

- `inline-script-syntax-ok`
- `Archer project JSON parses`
- `Battle demo runtime code contains the required custom-image / arrow-track hooks`

## Exit Check

- [x] Battle runtime can load editor project files with `customImages`.
- [x] Battle runtime respects `arrowVisibilityTracks` and `arrowParentTracks`.
- [ ] Updated archer attack playback matches the editor’s new arrow animation materially.
- [x] Verification results are recorded in the final report.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
