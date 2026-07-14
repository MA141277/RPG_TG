# Spine Unit Dropdown Design

## Goal

Replace the current hard-coded top-right unit buttons in `tools/spine-node-timeline-editor.html`
with a scalable unit picker that:

- fixes the current garbled button labels
- supports many unit types without adding more toolbar buttons
- reads portrait / Spine JSON sources directly from the same live unit assets the game is currently using
- keeps unit-specific tooling grouped by unit type
- prevents accidental in-memory project overwrite during unit switches

## Scope

### In Scope

- replace the top-right unit button group with a single unit select control
- drive the select options from `SPINE_UNIT_CONFIGS`
- keep the registry aligned to the unit assets already used by the battle runtime
- require confirmation before every unit switch attempt
- preserve the existing per-unit feature-group visibility rules
- add regression tests for the new selector and switch behavior

### Out Of Scope

- adding new battle units or new art assets
- inventing search, grouping, or filtering in the picker
- changing the project JSON schema
- adding persistence for the user's last selected unit
- redesigning the rest of the Spine editor toolbar

## Current Problems

The current implementation has two issues:

1. The top-right labels are encoded incorrectly in the HTML, so the visible button text is garbled.
2. The UI model is not scalable because each unit requires a dedicated toolbar button and dedicated event wiring.

There is already a useful runtime registry, `SPINE_UNIT_CONFIGS`, and a current-unit state,
`state.currentUnitType`, but the top toolbar still behaves like a fixed two-button prototype.

## Recommended Approach

Use a single native `<select>` control in the toolbar, populated from `SPINE_UNIT_CONFIGS`,
and source the registry entries from the same swordsman / archer project files already used by
the in-game battle runtime.

### Why

- native select is the lowest-risk way to support many units
- the active unit remains visible at all times
- the UI becomes data-driven instead of growing more hard-coded buttons
- using the live battle asset paths avoids editor/runtime drift between the tool and the game
- this keeps the existing unit-context runtime model intact instead of replacing it

### Rejected Alternatives

#### Custom dropdown menu

This would allow richer presentation, but it adds unnecessary state, focus handling,
open/close behavior, and click-outside logic for a problem the native select already solves.

#### Dedicated side panel for unit selection

This is visually heavier than needed and spends screen space on a control the user only
needs occasionally.

## Runtime Model

### Unit Registry

`SPINE_UNIT_CONFIGS` becomes the single source of truth for toolbar unit options.
Each entry must support at least:

```js
{
  label: "剑士",
  projectUrl: "/src/faxian/leg/swordsman/project.json",
  enabled: true,
  featureGroups: ["swordsman"]
}
```

Rules:

- `label` is the human-readable name shown in the picker
- `projectUrl` points at the same live project file currently used by the game battle runtime
- `enabled` remains available as runtime metadata, but the current picker only exposes configured live units
- the initial live registry is `swordsman -> /src/faxian/leg/swordsman/project.json` and `archer -> /src/faxian/leg/archer/project.json`

### Current Unit State

`state.currentUnitType` remains the active runtime selector.

It continues to drive:

- which project file is loaded
- which feature groups are visible
- which unit-specific binding controls are available

## UI Design

### Toolbar Control

Replace the two hard-coded buttons with:

- a label such as `Unit`
- a single select element such as `unitTypeSelect`

Behavior:

- the select always shows the current unit
- every enabled registry entry appears as a selectable option
- option labels are rendered from runtime config, not duplicated in static HTML

### Confirmation Rule

Every attempted switch to a different enabled unit must show a confirmation prompt before loading.

Prompt intent:

- warn that switching units will replace the current in-memory project state
- allow the user to cancel and remain on the current unit

Rules:

- selecting the current unit should remain a no-op
- canceling the confirmation must restore the select value to the current unit
- non-configured future entries, if reintroduced later, must not reach confirmation or load

## Switching Behavior

When the user selects a different enabled unit:

1. detect that the target differs from `state.currentUnitType`
2. show confirmation
3. if canceled, reset the select to the current unit and stop
4. if confirmed, load the target `projectUrl`
5. only after successful load, apply project data and update `state.currentUnitType`
6. rerender unit-specific groups and the rest of the editor

Failure rules:

- if load fails, keep the current project state unchanged
- if load fails, keep the current unit unchanged
- if load fails, reset the select back to the current unit
- show an error toast describing the failed target unit

## Feature Group Rules

The existing unit-specific visibility model stays in place.

Required behavior:

- swordsman-only controls remain hidden in non-swordsman contexts
- archer-only controls remain hidden in non-archer contexts
- shared controls stay visible regardless of unit type

This change only replaces the top-level unit selection mechanism; it does not flatten or remove
the dedicated unit feature groups already added in the previous work.

## Testing Strategy

Add or update tests to verify:

- the toolbar uses a select-based unit picker instead of dedicated swordsman/archer buttons
- picker options are rendered from `SPINE_UNIT_CONFIGS`
- the picker registry matches the current live swordsman / archer project assets used by the game
- selecting the current unit remains a no-op
- selecting a different unit triggers confirmation before loading
- canceling confirmation restores the current select value and skips load
- confirming a switch loads the target project and then updates `state.currentUnitType`
- load failure keeps both the current unit and current project unchanged
- unit-specific feature groups still follow `state.currentUnitType`

## Acceptance Criteria

This work is complete when all of the following are true:

- the garbled top-right unit buttons are gone
- the toolbar shows a single unit picker
- the picker is populated from `SPINE_UNIT_CONFIGS`
- the picker reads the currently active in-game swordsman / archer project files directly
- switching to another unit always requires confirmation
- canceling or failed loads do not mutate the active unit or active project
- existing unit-specific feature-group behavior still works
- regression tests cover the new picker and switch flow
