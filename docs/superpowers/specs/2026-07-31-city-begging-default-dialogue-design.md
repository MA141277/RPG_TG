# City Begging Default Dialogue Design

## Goal

Build a beta-safe default version of the Haozhou city begging flow using fixed, pre-generated dialogue data instead of live AI generation. The player enters from the city screen, chooses one of three begging locations, sees a fixed encounter, chooses one of three fixed options, sees a fixed fortune result through the card-draw presentation, then receives fixed narrative and structured settlement effects.

## Current Context

The repository already has a `city-begging` playable, but it is currently a numeric minigame under `src/application/minigames/city-begging-minigame.ts` and `src/application/playables/city-begging/city-begging-definition.ts`. It also has a temporary city card-draw test path wired through `src/main.ts` and `CardDrawAnimator`.

The new flow must not add new city-begging business branches to `src/main.ts`. The city entry belongs in the city UI/action layer, and the gameplay lifecycle belongs under the `city-begging` playable/application owner. The temporary card-draw test can be used as a visual reference, but the production flow must have its own state and action boundary.

## User-Facing Flow

The city screen shows a `化缘` entry below the location buttons in the city locations menu. Selecting it opens a dialogue-style city begging screen instead of the old arcade minigame.

The player first chooses one of three Haozhou locations:

- `dongshi_mishi`: 城东米市街, encounter tone `凶`, commercial street/grain shop background.
- `xicheng_guanyin`: 城西观音巷, encounter tone `平`, town alley background.
- `beicheng_ciji`: 城北慈济庵, encounter tone `吉`, temple/nunnery background.

After a location is chosen, the screen shows the fixed encounter text for that location and three fixed options. The player does not provide custom input in the beta default version.

After an option is chosen, the UI shows a card-draw/fortune animation for the fixed result `吉`, `凶`, or `平`. The result is not random in the default version. After the draw, the dialogue area shows an `AI推理中` state for 2-3 seconds while the dialogue text rotates or animates, then shows the fixed outcome narrative and settlement summary.

## Default Data Contract

Default data is a structured content table, not code branches. Each location record contains:

- `locationId`: `dongshi_mishi`, `xicheng_guanyin`, or `beicheng_ciji`.
- `title`: player-facing location title.
- `baselineResult`: fixed encounter baseline `ji`, `xiong`, or `ping`.
- `backgroundId`: resource id for the matching scene background.
- `npc`: display name and optional portrait/resource id.
- `encounterText`: the fixed encounter paragraph.
- `closingText`: the fixed location wrap-up line.
- `options`: exactly three fixed option records.

Each option record contains:

- `optionId`: stable id unique within the location.
- `optionText`: player-facing choice text.
- `fixedResult`: `ji`, `xiong`, or `ping`.
- `outcomeText`: fixed narrative after the draw and thinking delay.
- `effects`: structured settlement effects.

Effects use named effect objects so the beta content can later share a contract with AI-generated materialized results. Required effect kinds for this default set:

- `add_item`: adds an item or food object to unified inventory when a concrete item id exists.
- `add_grain`: adds grain using the existing player grain inventory unit.
- `mod_attr`: records a player attribute/status adjustment when the target attribute is available.
- `add_bond`: records relationship/bond changes with a named NPC.
- `set_flag`: stores branch flags in unified runtime variables/flags.
- `injure`: applies a stamina or injury/status consequence.
- `mod_weight`: records temporary result weighting, such as wet clothing increasing later bad outcomes, as a runtime variable/status marker.
- `restore_stamina`: restores stamina for immediate food or lodging outcomes.

If a specific item or attribute is not yet represented by a closed domain model, the effect applier must keep the effect structured and persist the supported part through runtime state rather than using ad hoc globals.

## Default Content

The default content contains the nine fixed branches provided by the user:

- 城东米市街: three `凶` branches for loud alms request, silent waiting, and seeking a small shop.
- 城西观音巷: two `平` branches and one `吉` branch for honest request, silent waiting, and helping mend nets.
- 城北慈济庵: two `吉` branches and one `平` branch for explaining travel history, lodging and copying sutras, and only asking for one bowl.

The exact Chinese encounter, option, outcome, and settlement copy from the user request should be preserved in the default data table.

## Runtime State

The `city-begging` playable session needs a dialogue state instead of only the old minigame state:

- `mode`: `default-dialogue`.
- `phase`: `location-select`, `encounter`, `fortune-draw`, `thinking`, `outcome`, or `completed`.
- `selectedLocationId`: nullable location id.
- `selectedOptionId`: nullable option id.
- `fixedResult`: nullable `ji`, `xiong`, or `ping`.
- `thinkingUntil`: nullable timestamp used for the 2-3 second `AI推理中` delay.
- `settlementApplied`: boolean guard to avoid duplicate effects.

The old numeric minigame may remain available behind legacy code while this default mode becomes the city entry path. New default-dialogue behavior must not depend on pointer updates or arcade result payloads.

## UI And Presentation

The city locations menu owns the `化缘` entry placement. The button appears below the location buttons, visually grouped with the location list but clearly separated as a city action.

The begging screen follows the existing story/dialogue presentation style: background, speaker/portrait area, dialogue text, and choice buttons. It should use resource ids such as `liangpu`, `chengzhen`, and temple/nunnery equivalents through the existing resource resolver or manifest boundary. Business data must not import asset file paths directly.

The fortune draw presentation reuses `CardDrawAnimator` behavior but supplies a result formatter for `吉`, `凶`, and `平`. The default branch result is fixed from the selected option, so the animator resolver must return the selected option result rather than rolling randomly.

## Settlement

Settlement happens once, after the outcome is shown or confirmed. Persistent changes must flow through unified game state structures:

- Grain-like rewards use existing grain inventory where possible.
- Concrete items such as fish jerky and steamed buns should enter the unified backpack/item inventory if item definitions exist; otherwise the implementation must add minimal content definitions or record structured runtime inventory variables as an explicit transitional path.
- Stamina loss, stamina restoration, flags, bonds, and supported attributes use existing runtime/state helpers when available.
- Unsupported attributes remain structured records and are not written into ad hoc top-level globals.

## Testing

Use TDD for implementation. The first tests should fail before production code is added.

Required coverage:

- Default data has exactly three locations and exactly three options per location.
- Location baselines and option fixed results match the requested `凶/平/吉` table.
- City locations UI includes the `化缘` entry after the location buttons, not inside unrelated city panels.
- Launching the city begging default flow creates a `city-begging` playable session in `default-dialogue` mode.
- Selecting a location advances to the fixed encounter and exposes exactly three options.
- Selecting an option stores the fixed result and the fortune display uses `吉/凶/平`, not `1-6`.
- Confirming the outcome applies effects once and clears/completes the session.
- `src/main.ts` does not gain new city-begging business branches for the default dialogue flow.

## Deferred AI Version

The beta version is a pure lookup flow. Later AI integration should attach before runtime execution:

1. Generate or select semantic encounter data.
2. Materialize the same structured location/option/outcome/effects schema.
3. Let runtime and UI consume only the materialized schema.

Runtime must not infer outcome meaning from text strings or keywords. It should read structured `fixedResult` and `effects` fields.
