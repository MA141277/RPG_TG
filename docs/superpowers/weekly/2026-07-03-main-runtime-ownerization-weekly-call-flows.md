# Main Runtime Ownerization Weekly Call Flows

**Week Of:** `2026-07-03`

## Purpose

Capture the main-shell runtime-business flows owned by the fresh weekly set.

## Flow 1: Startup Session Apply Before Child 24

### Narrative

`Child 23` extracted startup-family request selection, but `main.ts` still owns session apply business orchestration after the coordinator returns.

### Call Chain

```text
MainUiFlow shell action -> startup-session-coordinator -> main.ts applyActivatedModSession() -> syncActivatedContentSource() -> app-state bootstrap -> house runtime recreation -> render path
```

## Flow 2: Covered Navigation / Time Follow-Up Before Child 24

### Narrative

Covered navigation/time requests already use sub-runtimes, but `main.ts` still stitches follow-up such as story trigger and council handling around those runtime calls.

### Call Chain

```text
shell event -> main.ts commitRuntimeRequest(routeNavigationRuntime/routeTimeRuntime) -> main.ts follow-up chain -> state mutation / render scheduling
```

## Flow 3: Story / Event / Scene Progression Before Child 24

### Narrative

`main.ts` still directly invokes covered story progression helpers and therefore remains a business owner for scene progression and choice handling.

### Call Chain

```text
shell event -> main.ts advanceStorySceneStep()/chooseStorySceneOption()/runStoryTriggerRuntime() -> app-state mutation -> render path
```

## Flow 4: Passive Render-Time Trigger Before Child 24

### Narrative

The current render path still mutates gameplay state through passive trigger sync before presenter output is created.

### Call Chain

```text
renderApp() -> syncPassiveStoryTriggers() -> state mutation -> createAppPresenterOutput() -> render markup
```

## Flow 5: Target Child 24 End State

### Narrative

After ownerization, `main.ts` should only package shell input, invoke one orchestration seam, and schedule render after orchestration/write-back completes.

### Call Chain

```text
shell input -> main.ts shell entry -> main-runtime-orchestrator -> covered sub-runtime / follow-up -> state-sync write-back sink -> main.ts render scheduling
```
