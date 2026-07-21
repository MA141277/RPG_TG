# AI Mod Draft Editor Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal deterministic AI Mod Draft pipeline that can generate or read an `ai-mod-draft.json` and convert it into a full Script Editor project package.

**Architecture:** Keep AI inference separate from deterministic conversion. The AI client only creates draft JSON from a topic using environment-variable configuration; converter modules validate, normalize, map to `ScriptEditorProjectDefinition`, and serialize through the existing Script Editor project save path.

**Tech Stack:** TypeScript, Node.js CLI scripts, existing Script Editor domain/application modules, Node test runner, `npm run build:test`, focused `node --test`, `npm run typecheck`, `npm test`.

## Global Constraints

- Do not commit or print API keys.
- Read AI configuration only from `AI_MOD_DRAFT_API_KEY`, `AI_MOD_DRAFT_BASE_URL`, and `AI_MOD_DRAFT_MODEL`.
- Do not generate or execute JavaScript, regex scripts, or free-form runtime logic from AI output.
- AI output must be validated and converted by deterministic code before it becomes an editor project package.
- Unsupported semantics must be preserved as editor-only residue under `storyPack.aiDraftResidue`.
- First implementation supports only `first-stage-only` generation.
- Events should lower to dialogue destinations for v1.
- Runtime export support remains owned by existing Script Editor export code.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-20`
- Current Focus: `AI Mod Draft editor-project foundation complete.`
- Next Step: `Use the generated editor project package path for manual editing, or admit a future queue for browser UI/richer semantic generation.`
- Verification: `npm run lint:blueprints; npm run lint:plans; npm run typecheck; npm test`
- Notes: `Blueprint queue queue.ai-mod-draft-editor-project-foundation was admitted, implemented, verified, and closed.`

## Progress Log

- 2026-07-20
  - Summary: `Created implementation plan for AI Mod Draft editor project generation after user approved the generic format and converter approach.`
  - Verification: `Not run`
  - Next: `Admit a Blueprint queue before code implementation.`
- 2026-07-20
  - Summary: `Implemented schema, normalizer, deterministic Script Editor project conversion, package-writing CLI, env-only AI generation client, one-shot generation CLI, and focused regression coverage.`
  - Verification: `npm run lint:blueprints; npm run lint:plans; npm run typecheck; npm test`
  - Next: `No active implementation queue remains; future work should be routed through Blueprint admission.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-20-ai-mod-draft-editor-project-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Current repository governance:
  - `docs/blueprints/project-progress.md`

## Baseline Recheck

- Recheck result: `pending`
- Notes:
  - `Subagent read-only review confirmed canonical Script Editor package files and current lowering risks.`
  - `Implementation must use existing serializeScriptEditorProjectToFiles, loadScriptEditorProjectFromFiles, and validateScriptEditorProjectForRuntimeExport boundaries.`

## Implementation Scope

### In Scope

- AI Mod Draft v1 TypeScript schema.
- deterministic validator/normalizer with diagnostics.
- conversion to `ScriptEditorProjectDefinition`.
- package writer CLI for converting an existing draft.
- AI-compatible client and prompt builder using env vars.
- CLI for generating draft from topic.
- CLI for topic-to-editor-project one-shot generation.
- focused tests.

### Still Out Of Scope

- browser UI integration.
- runtime execution of arbitrary AI logic.
- minigame generation.
- full multi-stage game generation.
- API key storage.
- automatic runtime-pack export as the primary AI output.

## File Map

### Existing files to modify

- `package.json`
  - Add optional npm scripts only if useful after the CLI files exist.
- `tests/robustness.test.cjs`
  - Add focused tests if existing project conventions favor this file for Script Editor coverage.

### New files to create

- `src/application/ai-mod-draft/ai-mod-draft-schema.ts`
  - Draft types and constants.
- `src/application/ai-mod-draft/ai-mod-draft-diagnostics.ts`
  - Shared diagnostic shape and helpers.
- `src/application/ai-mod-draft/ai-mod-draft-normalizer.ts`
  - Validate/normalize draft records and references.
- `src/application/ai-mod-draft/ai-draft-world-mapper.ts`
  - Map world/person/building data into Script Editor records.
- `src/application/ai-mod-draft/ai-draft-narrative-mapper.ts`
  - Map dialogues, text entries, events, and event bindings.
- `src/application/ai-mod-draft/ai-draft-residue.ts`
  - Preserve unsupported semantics under editor-only residue.
- `src/application/ai-mod-draft/ai-draft-to-script-editor-project.ts`
  - Build complete `ScriptEditorProjectDefinition`.
- `src/application/ai-mod-draft/ai-mod-draft-prompts.ts`
  - Topic-to-draft prompt construction.
- `src/application/ai-mod-draft/ai-mod-draft-openai-client.ts`
  - OpenAI-compatible HTTP client using environment variables.
- `tools/convert-ai-mod-draft.mjs`
  - Convert existing draft JSON to an editor project package.
- `tools/generate-ai-mod-draft.mjs`
  - Call configured model and write `ai-mod-draft.json`.
- `tools/generate-script-editor-project-from-topic.mjs`
  - Generate draft and convert it in one command.
- `tests/ai-mod-draft.test.cjs`
  - Focused tests for normalization, conversion, and package loadability.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/ai-mod-draft.test.cjs`
- Required commands before completion:
  - `npm run typecheck`
  - `npm test`

## Task 1: Schema And Normalizer

**Files:**
- Create: `src/application/ai-mod-draft/ai-mod-draft-schema.ts`
- Create: `src/application/ai-mod-draft/ai-mod-draft-diagnostics.ts`
- Create: `src/application/ai-mod-draft/ai-mod-draft-normalizer.ts`
- Test: `tests/ai-mod-draft.test.cjs`

**Interfaces:**
- Produces: `normalizeAiModDraft(input: unknown): { draft: AiModDraft | null; diagnostics: AiModDraftDiagnostic[] }`
- Produces: `AiModDraftDiagnostic` with `severity`, `path`, and `message`.

- [x] **Step 1: Write RED tests for missing id/title and minimal valid draft**

Add tests that import `.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js` after `npm run build:test`.

- [x] **Step 2: Verify RED**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- test fails because the module does not exist.

- [x] **Step 3: Implement schema, diagnostics, and normalizer**

Implement only validation/defaulting needed by the tests:

- require `schemaVersion = 1`
- require `kind = "ai-mod-draft"`
- require non-empty `id`
- require non-empty `title`
- require `generationScope.mode = "first-stage-only"`
- default absent arrays to empty arrays where v1 supports it.

- [x] **Step 4: Verify GREEN**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- focused tests pass.

## Task 2: Deterministic Project Conversion

**Files:**
- Create: `src/application/ai-mod-draft/ai-draft-world-mapper.ts`
- Create: `src/application/ai-mod-draft/ai-draft-narrative-mapper.ts`
- Create: `src/application/ai-mod-draft/ai-draft-residue.ts`
- Create: `src/application/ai-mod-draft/ai-draft-to-script-editor-project.ts`
- Modify: `tests/ai-mod-draft.test.cjs`

**Interfaces:**
- Consumes: `AiModDraft`
- Produces: `convertAiModDraftToScriptEditorProject(draft: AiModDraft): { project: ScriptEditorProjectDefinition; diagnostics: AiModDraftDiagnostic[] }`

- [x] **Step 1: Write RED test for school-comeback draft conversion**

Test that the converter returns a project with:

- `kind = "script-editor-project"`
- all canonical project arrays/objects present.
- one player person.
- one city.
- buildings from `worldScale.buildings`.
- dialogue text entries generated from dialogue nodes.
- event destination `family = "dialogue"`.
- `storyPack.aiDraftResidue` preserves unsupported residue.

- [x] **Step 2: Verify RED**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- converter import fails or conversion assertions fail.

- [x] **Step 3: Implement minimal conversion**

Build a complete `ScriptEditorProjectDefinition` with default empty arrays/objects for all canonical families. Map v1 records only.

- [x] **Step 4: Verify GREEN**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- conversion tests pass.

## Task 3: Package Serialization CLI

**Files:**
- Create: `tools/convert-ai-mod-draft.mjs`
- Modify: `tests/ai-mod-draft.test.cjs`

**Interfaces:**
- CLI: `node tools/convert-ai-mod-draft.mjs --input <draft.json> --out <directory>`

- [x] **Step 1: Write RED test for writing a complete editor package**

Use a temp directory, write a draft JSON, run the CLI with `node`, and assert `project.json`, `story-pack.json`, `people.json`, `events.json`, `event-bindings.json`, `dialogues.json`, and `text-entries.json` exist.

- [x] **Step 2: Verify RED**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- CLI file missing.

- [x] **Step 3: Implement CLI**

Read JSON, normalize, convert, serialize with `serializeScriptEditorProjectToFiles`, and write files under `--out`.

- [x] **Step 4: Verify GREEN**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- CLI package-writing test passes.

## Task 4: AI Draft Client And Generation CLI

**Files:**
- Create: `src/application/ai-mod-draft/ai-mod-draft-prompts.ts`
- Create: `src/application/ai-mod-draft/ai-mod-draft-openai-client.ts`
- Create: `tools/generate-ai-mod-draft.mjs`
- Create: `tools/generate-script-editor-project-from-topic.mjs`
- Modify: `tests/ai-mod-draft.test.cjs`

**Interfaces:**
- `buildAiModDraftPrompt(topic: string): string`
- `generateAiModDraftFromTopic(input: { topic: string; apiKey: string; baseUrl: string; model: string }): Promise<unknown>`
- CLI reads env vars, never CLI key args.

- [x] **Step 1: Write RED tests for prompt constraints and missing env handling**

Test prompt includes:

- `schemaVersion`
- `kind`
- `first-stage-only`
- no JS/regex/free-form executable logic instruction

Test CLI missing env exits non-zero without printing secret-like values.

- [x] **Step 2: Verify RED**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- modules or CLI files missing.

- [x] **Step 3: Implement prompt, client, and CLIs**

Use `fetch` against OpenAI-compatible `/v1/chat/completions`. Parse assistant content as JSON. Do not log API keys.

- [x] **Step 4: Verify GREEN**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- prompt and env tests pass.

## Task 5: End-To-End Sample Generation Without Network

**Files:**
- Modify: `tests/ai-mod-draft.test.cjs`
- Optional create: `generated/drafts/.gitkeep` only if needed and ignored by repo policy.

**Interfaces:**
- The one-shot CLI can be tested with a fixture draft path or mocked client injection only if production code remains clean.

- [x] **Step 1: Write RED test that converts the school sample into loadable editor files**

After CLI conversion, load files with `loadScriptEditorProjectFromFiles` and assert it opens as a Script Editor project.

- [x] **Step 2: Verify RED**

Run:

```powershell
npm run build:test
node --test tests/ai-mod-draft.test.cjs
```

Expected:

- loadability assertion fails until CLI and converter write all required files correctly.

- [x] **Step 3: Fix conversion/load compatibility**

Adjust only converter serialization and required default fields.

- [x] **Step 4: Run final verification**

Run:

```powershell
npm run typecheck
npm test
```

Expected:

- all checks pass.

## Exit Check

- [x] `ai-mod-draft.json` v1 schema exists in TypeScript.
- [x] Draft normalization returns deterministic diagnostics.
- [x] Converter produces a full Script Editor project package.
- [x] CLI converts an existing draft to an editor project directory.
- [x] AI client reads only env vars.
- [x] One-shot topic generation CLI exists.
- [x] Focused tests pass.
- [x] Full required verification is recorded.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
