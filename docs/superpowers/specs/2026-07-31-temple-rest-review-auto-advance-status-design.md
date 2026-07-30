# Temple Rest Review Auto Advance Status Design

## Goal

Add a read-only status window during the temple mainline `休至评定日` fast-forward flow so the player can see that time is currently skipping toward the review date and can inspect the current temple-state summary while the skip runs.

This is a mechanism extension on top of the existing house auto-advance flow, not a one-off hardcoded scene patch.

## Current Context

The current temple module already supports these rest actions:

- `休息一日`
- `指定天数`
- `休至评定日`
- `休至体力恢复`

All of them currently run through `runTempleRestPlan()` and then hand snapshot playback to the shared `start-map-auto-advance` side effect. The shared runtime stores this as `AppState.autoAdvanceState`, and `main.ts` advances through the snapshots until completion.

Current gaps:

- The player sees time skipping, but there is no dedicated fast-forward status panel explaining what is happening.
- The temple module has a red nine-grid modal style already, but that style is only used for ordinary house overlays, not for the global auto-advance state.
- The current `autoAdvanceState` only carries generic transport fields such as `intervalId`, `label`, `targetHouseId`, `snapshots`, and `completion`.
- The temple mainline status data already exists in gameplay state, but no global presenter/view currently projects it into a read-only fast-forward window.

Relevant existing ownership:

- Temple rest business flow: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Shared auto-advance app state: `src/application/app-shell.ts`
- Auto-advance orchestration and completion handling: `src/main.ts`
- App rendering and global overlay composition: `src/ui/app-render.ts`
- Temple modal visual language: `src/ui/views/house/temple-house-view.ts`

This work must not add new temple business rules to `src/main.ts`. Any new `main.ts` wiring must remain shell-level playback of already-computed state.

## User-Facing Behavior

When the player chooses `休至评定日` in the temple during the Zhu Yuanzhang monk storyline, the game enters the existing fast-forward flow and also shows a persistent read-only status window.

The window:

- uses the existing red nine-grid temple modal look
- has no confirm button, cancel button, or close affordance
- stays visible while auto-advance snapshots are being consumed
- updates its displayed values every in-game day as snapshots advance
- disappears automatically once auto-advance finishes

The window title is fixed as `休至评定日`.

The body shows a compact current-state summary:

- `当前：寺中静修`
- `评定：距离评定 X 天 / 今日评定 / 评定逾期 X 天`
- `体力：Y / 100`
- `贡献：N / 30` only when the monk-stage contribution system is active
- `周次：第 W 周` only when the monk-stage week system is active
- `差事：<current task>` only when a meaningful current task label exists

This panel is informational only. The player cannot interrupt fast-forward from this panel.

## Recommended Architecture

Use the shared auto-advance state as the single source of truth for fast-forward UI, and pass a view-ready status payload from the temple module into that shared state only for the `休至评定日` case.

Recommended ownership:

- Temple module decides whether a fast-forward status panel is needed and builds its semantic content.
- `AppState.autoAdvanceState` stores the optional status payload during playback.
- The global app renderer displays the payload through a reusable read-only modal renderer.
- `main.ts` continues to own only snapshot stepping and completion wiring. It must not compute temple-specific display content.

This keeps the business condition in the temple owner and keeps the shell responsible only for running the already-prepared playback state.

## Data Contract

Extend `AppState.autoAdvanceState` with an optional status panel field. The exact name can be implementation-driven, but the shape should be equivalent to:

```ts
type AutoAdvanceStatusPanel = {
  variant: "temple-review-rest";
  title: string;
  lines: string[];
};
```

`autoAdvanceState` then becomes conceptually:

```ts
type AutoAdvanceState = {
  intervalId: string;
  label: string;
  targetHouseId: string;
  snapshots: MapAutoAdvanceSnapshot[] | null;
  completion: HouseMapAutoAdvanceCompletion | null;
  statusPanel?: AutoAdvanceStatusPanel | null;
};
```

The payload should stay presentation-oriented and already localized. `main.ts` should not assemble lines from raw state.

Only the temple `休至评定日` action should set this field. Other fast-forward flows continue to omit it.

## Temple Status Content Builder

Add a small temple-owned helper that reads the current temple state and returns the fast-forward status panel payload.

That helper should derive:

- the review text from the existing review-date helpers, not from duplicated string logic
- stamina from the player character definition
- contribution and week only when monk-story stage systems are active
- current task text from the same temple task/work-plan source already used by the temple status card where practical

The helper should avoid direct UI markup and return only structured strings.

This status builder belongs under the temple module owner or an adjacent temple runtime helper, not in `main.ts` and not in generic UI code.

## Rendering Strategy

Render the status window in the global overlay layer during auto-advance whenever `autoAdvanceState.statusPanel` is present.

The renderer should:

- reuse the existing temple red modal classes and framing style from the temple house view
- render title and body lines only
- omit action rows entirely
- avoid direct coupling to temple business logic beyond consuming the already-built payload

The preferred implementation is a small reusable renderer near the house shared/temple view layer that accepts `{ title, lines }` and outputs the red nine-grid modal markup.

`src/ui/app-render.ts` should only decide whether to render this panel based on `appState.autoAdvanceState`.

## Playback Update Behavior

The panel must reflect the latest snapshot while fast-forward is in progress.

To keep that behavior stable:

- each snapshot application should preserve the active auto-advance status panel concept
- the status content should be recomputed from the latest post-snapshot state, not frozen from the initial day

The simplest acceptable implementation is:

1. seed `autoAdvanceState.statusPanel` when fast-forward starts
2. after each snapshot becomes the live app state, refresh `autoAdvanceState.statusPanel` from the latest state if the active auto-advance variant is `temple-review-rest`

This refresh step still belongs to shell-level playback wiring because it only says “if an auto-advance panel variant exists, rebuild it from the current state using its owner helper.” The shell must not contain the temple-specific line-generation logic itself.

If the implementation can avoid per-step rebuild by encoding enough semantic data and deriving in the presenter, that is also acceptable, but the ownership rule stays the same: temple semantics remain outside `main.ts`.

## Scope Guard

This change intentionally does not:

- add a stop/cancel button
- change `休息一日`, `指定天数`, or `休至体力恢复`
- affect non-temple houses
- affect the Huangcun opening flow
- replace the final temple rest completion overlay
- change the review trigger timing itself

Only the temple mainline `休至评定日` fast-forward path gains the new read-only status panel.

## Error Handling

If the status builder cannot derive an optional field, it should omit that line rather than fail the fast-forward flow.

Examples:

- if no current task label is available, omit the `差事` line
- if contribution or week is not meaningful for the current stage, omit those lines

The renderer should treat a missing or empty status panel as “render nothing” and must not block playback.

## Testing

Use TDD. The first tests must fail before production changes are added.

Required coverage:

- temple `休至评定日` produces an auto-advance state with the temple fast-forward status panel payload
- temple `休息一日`, `指定天数`, and `休至体力恢复` do not produce this panel
- the status builder includes review text and stamina, and conditionally includes contribution/week/task lines
- the global app render path outputs the red read-only status panel when `autoAdvanceState.statusPanel` is present
- the global app render path does not output the panel when `autoAdvanceState.statusPanel` is absent
- snapshot playback refreshes the status content as the live state changes
- `src/main.ts` does not gain temple-specific display string assembly
- Huangcun opening and the ordination-to-review reentry behavior remain unchanged

## Implementation Notes

The smallest reliable implementation likely touches:

- `src/application/app-shell.ts`
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
- a new temple status-panel helper if extraction improves clarity
- `src/ui/app-render.ts`
- one small renderer in `src/ui/views/house/` or adjacent shared UI code
- targeted source and behavior tests

Because `git` is not currently available in the local PATH or standard detected locations in this environment, the design document can be written and reviewed now, but the requested spec commit step is currently blocked by environment tooling.
