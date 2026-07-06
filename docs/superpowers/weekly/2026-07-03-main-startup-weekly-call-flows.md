# Main Startup Weekly Call Flows

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


**Week Of:** `2026-07-03`

## Purpose

Capture the startup-family flows owned by the fresh weekly set.

## Flow 1: Builtin Startup Before Child 23

### Narrative

`src/main.ts` still directly owns the builtin startup entry path and the activation/bootstrap sequencing that follows it.

### Call Chain

```text
MainUiFlow start action -> main.ts startMainGameWithLoading() -> main.ts startMainGame() -> activateBuiltinDefaultMod() -> applyActivatedModSession() -> render path
```

## Flow 2: Continue / Restore Before Child 23

### Narrative

`src/main.ts` still directly owns continue-game save loading and restore routing before the startup-family extraction seam exists.

### Call Chain

```text
MainUiFlow continue action -> main.ts loadSaveData() -> main.ts startContinueGameWithLoading() -> main.ts startRestoredGameWithLoading() -> restoreModFromSave() -> applyActivatedModSession() -> render path
```

## Flow 3: Scenario Import / Start Before Child 23

### Narrative

Imported scenario starts still route through `src/main.ts` entry functions even though Child 22 already unified the downstream activation/bootstrap seam.

### Call Chain

```text
MainUiFlow import/start action -> main.ts startScenarioPackWithLoading()/startScenarioPackFilesWithLoading() -> loadScenarioPackFromUrl()/loadScenarioPackFromFiles() -> startLoadedScenarioPackWithLoading() -> applyActivatedModSession() -> render path
```

## Flow 4: Target Child 23 End State

### Narrative

After extraction, `src/main.ts` should only hand startup-family requests to one coordinator seam and then apply the returned bootstrap result to the existing render path.

### Call Chain

```text
MainUiFlow shell action -> main.ts shell entry -> startup-session-coordinator -> activation/bootstrap routing -> startup result -> existing render path
```

