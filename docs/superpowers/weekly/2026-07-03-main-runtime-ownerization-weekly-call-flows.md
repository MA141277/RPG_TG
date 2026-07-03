# Main Runtime Ownerization Weekly Call Flows

**Week Of:** `2026-07-03`

## Purpose

Capture the main-shell runtime-business flows owned by the fresh weekly set.

## Flow 1: Startup Session Apply After Child 24

### Narrative

`Child 23` still left session apply business orchestration in `main.ts`. Child 24 moves that covered apply path behind `main-runtime-orchestrator`.

### Call Chain

```text
MainUiFlow shell action -> startup-session-coordinator -> main.ts applyActivatedModSession() -> main-runtime-orchestrator(apply-startup-session) -> active content sync -> app-state bootstrap -> house runtime recreation -> render scheduling
```

## Flow 2: Covered Navigation / Time Follow-Up After Child 24

### Narrative

Covered navigation/time requests still use shared runtime commit paths, but the covered story timing handoff for `city-enter` no longer calls story runtime helpers directly from `main.ts`.

### Call Chain

```text
shell event -> main.ts commitRuntimeRequest(routeNavigationRuntime/routeTimeRuntime) -> main-runtime-orchestrator(trigger-story-events when covered) -> state mutation / render scheduling
```

## Flow 3: Story / Event / Scene Progression After Child 24

### Narrative

Scene progression and story choice handling now enter through shell-local functions in `main.ts`, but the runtime-business decision path is owned by `main-runtime-orchestrator`.

### Call Chain

```text
shell event -> main.ts shell handler -> main-runtime-orchestrator(advance-story-scene / choose-story-option) -> story runtime helper -> app-state mutation -> render scheduling
```

## Flow 4: Passive Story Trigger Sync After Child 24

### Narrative

Passive `indoor-screen-shown` story trigger sync is no longer embedded inside the pure render frame. `main.ts` now invokes one explicit orchestration sync step before the frame render is built.

### Call Chain

```text
render scheduling -> main-runtime-orchestrator(sync-passive-story-triggers) -> renderAppFrame() -> createAppPresenterOutput() -> render markup
```

## Flow 5: Fixed Boundary Answers

### Narrative

Child 24 fixes the ownerization answers for this weekly set.

### Call Chain

```text
request entry: shell input / DOM / MainUiFlow
runtime decision owner: src/application/runtime/main-runtime-orchestrator.ts
follow-up owner: main-runtime-orchestrator for covered startup apply, story timing, scene progression, and passive trigger sync
write-back sink: covered runtime requests still settle through state-sync-runtime commit paths; Child 24 does not fork a second covered runtime commit sink
```
