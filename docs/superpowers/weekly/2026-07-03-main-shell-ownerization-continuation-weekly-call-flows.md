# Main Shell Ownerization Continuation Weekly Call Flows

**Week Of:** `2026-07-03`

## Purpose

Capture the residual `main.ts` shell-boundary flows that justify the fresh continuation queue after Child 24 closed.

## Flow 1: Covered Navigation Follow-Up Still Targeted By Child 25

### Narrative

Child 24 already extracted the first orchestration seam, but some covered navigation outcomes still lead into shell-adjacent continuation behavior. Child 25 exists to remove that shell-owned post-settlement step.

### Call Chain

```text
shell event -> main.ts request dispatch -> navigation runtime settlement -> shell-adjacent covered follow-up -> render scheduling
```

### Target Shape

```text
shell event -> main.ts request dispatch -> navigation runtime settlement -> explicit follow-up owner -> render scheduling
```

## Flow 2: Covered Time Follow-Up Still Targeted By Child 25

### Narrative

Some covered time/day-start outcomes still require continuation that should not remain shell-owned. Child 25 addresses the shell-owned post-settlement step without reopening the already-closed Child 24 orchestration boundary.

### Call Chain

```text
shell event or timer -> main.ts request dispatch -> time runtime settlement -> shell-adjacent covered follow-up -> render scheduling
```

### Target Shape

```text
shell event or timer -> main.ts request dispatch -> time runtime settlement -> explicit follow-up owner -> render scheduling
```

## Flow 3: Render Purity Candidate After Child 25

### Narrative

Once Child 25 stabilizes follow-up timing, Child 26 will treat render as a display-only phase. Render purity is tracked separately so it does not become a hidden compensating mechanism for incorrect upstream follow-up ownership.

### Call Chain

```text
settled state -> presenter -> render
```

## Flow 4: Startup Story Bootstrap Candidate After Child 26

### Narrative

Child 27 is queued later because startup-family selection is already closed, but startup story bootstrap still remains a distinct later ownerization edge.

### Call Chain

```text
startup request -> startup/bootstrap owner -> bootstrap-complete session/result -> shell consumption
```

## Flow 5: Active Content And Legacy Startup Candidates

### Narrative

Child 28 and Child 29 remain candidate-only in the current queue phase. They are recorded now so continuation remains bounded and visible rather than speculative.

### Call Chain

```text
startup/mod activation -> content composition owner -> content snapshot/context -> shell consumption
builtin/mod startup request -> unified bootstrap contract -> startup result -> shell consumption
```

## Flow 6: Fixed Queue Answers For This Continuation Set

### Narrative

The continuation queue answers three governance questions explicitly.

### Call Chain

```text
active executable child: Child 25
immediate queued follow-up: Child 26
locked follow-up child: Child 27
candidate-only later work: Child 28, Child 29
```
