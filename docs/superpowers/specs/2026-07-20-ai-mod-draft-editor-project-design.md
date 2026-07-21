# AI Mod Draft Editor Project Design

## Goal

Create a deterministic AI-assisted mod authoring path where an AI model generates a structured `ai-mod-draft.json`, repository code validates and converts that draft into a Script Editor project package, and the existing Script Editor remains responsible for save, validation, preview, and runtime-pack export.

## User Workflow

```text
topic prompt
-> AI generates ai-mod-draft.json
-> converter validates and normalizes the draft
-> converter writes a full Script Editor project package
-> user opens the package with 剧本编辑器 -> 打开草稿
-> user edits, validates, previews, and exports runtime pack
```

The first supported generation mode is `first-stage-only`. It creates one playable authoring slice rather than a full game.

## Architecture

The AI layer and conversion layer must stay separate.

- AI generation infers topic semantics and writes a bounded draft schema.
- Deterministic converter code validates IDs, references, and supported semantics.
- Runtime export remains owned by existing Script Editor export code.
- Unsupported semantics are preserved as editor-only residue under `storyPack.aiDraftResidue`.
- No generated JavaScript, regex scripts, or free-form runtime logic may be accepted as executable behavior.

## API Configuration

The AI client must read configuration only from environment variables:

- `AI_MOD_DRAFT_API_KEY`
- `AI_MOD_DRAFT_BASE_URL`
- `AI_MOD_DRAFT_MODEL`

The implementation must not commit API keys, print API keys, or write API keys to generated project files.

## Draft Schema V1

Top-level fields:

- `schemaVersion`: `1`
- `kind`: `"ai-mod-draft"`
- `id`: draft id
- `title`: user-facing title
- `generationScope`: generation mode and selected stage
- `themeFrame`: genre and long-arc design notes
- `statMapping`: five-slot Taiko-style stat mapping
- `skillMapping`: small skill mapping list
- `worldScale`: region/city/building authoring skeleton
- `stages`: stage progression and review-cycle metadata
- `entities`: player and NPC definitions
- `actionLoops`: repeatable gameplay-loop ideas
- `dialogues`: dialogue records
- `events`: event records
- `bindings`: event binding records
- `draftResidue`: unsupported or future system ideas

## V1 System Model

The first version models a Taiko-like loop using these stable concepts:

- topic frame
- first stage
- five stats
- three skills
- one city-scale location
- three to five buildings
- player plus three to six NPCs
- study/work/training action-loop descriptions
- one review-cycle description
- dialogue-backed events
- building/city/story event bindings

The converter must not try to implement a full ranking simulation, QTE, economy, or dynamic scheduler in v1.

## Conversion Contract

The converter produces a complete `ScriptEditorProjectDefinition` and serializes it with the existing Script Editor save path.

Required output package files:

- `project.json`
- `story-pack.json`
- `maps.json`
- `people.json`
- `cities.json`
- `buildings.json`
- `city-entries.json`
- `events.json`
- `event-bindings.json`
- `scenes.json`
- `quests.json`
- `activities.json`
- `cards.json`
- `valuables.json`
- `city-npc-pools.json`
- `house-access-refusal-rules.json`
- `house-module-defaults.json`
- `city-portraits.json`
- `historical-characters.json`
- `historical-city-rosters.json`
- `historical-character-id-map.json`
- `dialogues.json`
- `minigames.json`
- `story-nodes.json`
- `text-entries.json`
- `condition-groups.json`
- `effect-bundles.json`

Minimum useful first-stage project:

- `storyPack.scenarioProfile` with `id`, `playerCharacterId`, `chapterId`, and initial city location.
- one player person record.
- one city record.
- three to five building records.
- dialogue text entries.
- dialogue records with nodes referencing text entries.
- events that use dialogue destinations.
- event bindings limited to currently exportable owner/trigger/condition semantics.

## Runtime-Lowering Boundary

The converter may lower only supported semantics. These remain editor-only residue in v1:

- event/minigame destinations that are not dialogue-backed.
- expression/custom/binding-context conditions.
- dialogue follow-up graph semantics beyond the current minimal materializer.
- action-loop effects that do not map to supported task inputs.
- ranking simulation, phone temptation, exam scoring, and similar systems.
- minigame settlement behavior.

## Diagnostics

The converter returns diagnostics with:

- `severity`: `"error"` or `"warning"`
- `path`: draft path
- `message`: user-facing explanation

Errors block project generation. Warnings allow project generation and explain what was preserved as residue.

## CLI

Provide three commands:

```powershell
node tools/generate-ai-mod-draft.mjs --topic "学渣在二中逆袭" --out generated/drafts/school.json
node tools/convert-ai-mod-draft.mjs --input generated/drafts/school.json --out generated/script-editor-projects/school
node tools/generate-script-editor-project-from-topic.mjs --topic "学渣在二中逆袭" --out generated/script-editor-projects/school
```

## Verification

Required verification for implementation:

- focused unit tests for draft normalization and conversion.
- a test proving generated package files can be loaded by `loadScriptEditorProjectFromFiles`.
- a test proving generated project export diagnostics are deterministic.
- `npm run typecheck`
- `npm test`

## Out Of Scope

- runtime support for arbitrary AI-generated logic.
- generated JS, regex, or executable script snippets.
- full-game multi-stage generation.
- browser UI for invoking the generator.
- storing or managing API keys.
- automatic JSON-start runtime-pack export from AI output without the Script Editor project layer.
