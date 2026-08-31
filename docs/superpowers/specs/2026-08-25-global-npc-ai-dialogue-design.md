# Global NPC AI Dialogue Design

## 1. Goal

Add a shared NPC AI dialogue mechanism that works across any building roster in the existing house
UI. The player flow must be:

1. enter any building,
2. click a left-side NPC avatar,
3. open the existing NPC interaction menu,
4. choose `谈话`,
5. enter an AI-driven multi-turn dialogue panel that shows exactly three generated options plus one
   custom-input path,
6. continue the conversation for as many turns as needed,
7. persist the resulting conversation into that NPC's memory log,
8. exit at any time and switch to another building or another NPC.

The user explicitly wants a reserved interface for the team's internal AI. The two reference zip
projects and the earlier TXT narrative work are protocol references only; this request is broader
than the temple-only `txt-narrative-place` host and must become a reusable building-wide mechanism.

## 2. Current Context And Mismatch

Current repository reality:

1. `npcInteractionSession.mode === "dialogue"` currently renders only a static placeholder line
   (`你与 X 简短交谈。`) plus `继续/关闭`.
2. There is no persistent per-NPC conversation memory log under unified runtime state.
3. NPC interaction click routing still lives partly in `src/main.ts`, so adding more business logic
   there would worsen main-shell drift.
4. The earlier uncommitted `txt-narrative-place` slice already added:
   - a TXT marker/parser/provider seam,
   - async provider lifecycle handling inside `createHouseRuntimeBridge(...)`,
   - a deterministic placeholder provider,
   but that work is tied to a dedicated parallel house host and cannot satisfy "any building / any
   NPC" by itself.
5. Many building modules already expose clickable left-side rosters through
   `renderHouseStandbyRoster(...)`, but fallback non-module house rendering still shows static cards
   instead of the shared NPC interaction trigger.

That means this feature should not be implemented as a temple patch, a per-house copy, or an
incremental expansion of the static placeholder dialogue renderer.

## 3. Approved Behavior Contract

### 3.1 Scope

- The existing left-avatar NPC interaction entry remains.
- The existing menu remains.
- Choosing default `谈话` opens the new AI dialogue panel.
- The first slice must work for any building NPC surfaced through:
  - module house standby rosters,
  - fallback non-module house rosters.
- The first slice stores NPC memory logs in runtime state.
- The first slice does not need a separate player-facing "memory log viewer" UI.

### 3.2 Dialogue Panel Contract

The AI dialogue panel must show:

- an accumulated transcript,
- the current NPC portrait/name when a dialogue line belongs to that NPC,
- exactly three generated AI options when the turn completes,
- a custom text input + submit action,
- explicit exit/close control,
- recoverable error state if the provider fails.

Each player reply path is valid:

- click generated option,
- submit custom input,
- exit the panel.

### 3.3 Persistence Contract

Every completed dialogue exchange must append structured entries into the target NPC's persistent
memory log. The log must survive:

- closing the panel,
- leaving the building,
- entering another building,
- talking to another NPC.

Persistent memory data must flow through unified `GameState.runtime` ownership rather than top-level
globals, renderer-local state, or ad hoc caches.

### 3.4 Provider Boundary

The internal AI adapter must be replaceable behind a reserved provider seam modeled after:

- the reference zip's stream/continue architecture,
- the existing TXT narrative marker + typed-step boundary.

The game code, not the model, owns:

- persistent memory writes,
- validation that the turn ended with exactly three generated options,
- stale-request cancellation,
- state transitions,
- any future side effects.

### 3.5 Out Of Scope

- A standalone memory-log screen.
- City/street/scene NPC AI dialogue outside buildings.
- Replacing special house business actions such as `工作`, `喝酒`, `调查`, etc.
- Direct integration of the real internal AI client in this slice.

## 4. Architecture

## 4.1 Shared Runtime Instead Of House-Owned Business

This feature is a shared NPC interaction mechanism, not a concrete house module.

It should therefore live under shared NPC interaction ownership:

- session-local state under `gameState.ui.npcInteractionSession`,
- persistent memory under a new dedicated runtime branch,
- async provider orchestration in a shared NPC dialogue runtime bridge,
- shell-only dependency injection in `src/main.ts`.

No per-house AI dialogue branch should be added to `src/main.ts`, and no concrete house module
should become the only owner of this dialogue loop.

### 4.2 New Runtime State

Add a dedicated persistent branch, tentatively:

```ts
type NpcDialogueMemoryRuntimeState = {
  memoriesByCharacterId: Record<
    CharacterId,
    {
      characterId: CharacterId;
      entries: NpcDialogueMemoryEntry[];
      updatedAtRequestId: string | null;
    }
  >;
};

type NpcDialogueMemoryEntry = {
  id: string;
  requestId: string;
  contextType: "house";
  houseId: string | null;
  placeName: string | null;
  speaker: "player" | "npc" | "narration";
  speakerId?: string;
  speakerName?: string;
  text: string;
};
```

This branch should be initialized alongside other runtime state in
`src/application/state/create-initial-state.ts`.

### 4.3 New NPC Session Shape

Upgrade `NpcInteractionSession` from a flat `mode` switch to a typed union that can hold
conversation state:

```ts
type NpcInteractionSession =
  | {
      context: NpcInteractionContext;
      targetCharacterId: CharacterId;
      mode: "menu";
    }
  | {
      context: NpcInteractionContext;
      targetCharacterId: CharacterId;
      mode: "ai-dialogue";
      dialogue: NpcAiDialogueSessionState;
    }
  | {
      context: NpcInteractionContext;
      targetCharacterId: CharacterId;
      mode: "gift-select";
    }
  | null;
```

`NpcAiDialogueSessionState` owns only session-local data:

- current transcript for this open panel,
- pending generated options,
- custom input draft value,
- current request id / request sequence,
- streaming / awaiting-choice / error / idle state,
- status and error notices.

### 4.4 Shared Provider Contract

Introduce a dedicated shared provider seam for NPC talk, separate from the house-module-only TXT
host seam but intentionally shaped the same way:

```ts
type NpcAiDialogueProviderRequest = {
  requestId: string;
  system: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  metadata: {
    contextType: "house";
    houseId?: string;
    placeName?: string;
    npcId: string;
    npcName: string;
    inputType: "start_talk" | "select_option" | "custom_input" | "reactivate";
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    customInputText?: string;
  };
};

type NpcAiDialogueStep =
  | { type: "narration"; text: string }
  | { type: "dialogue"; speakerId: string; speakerName: string; text: string }
  | { type: "choice"; prompt?: string; options: NpcAiDialogueOption[] };

type NpcAiDialogueProviderEvent =
  | { type: "start"; requestId: string }
  | { type: "step"; requestId: string; step: NpcAiDialogueStep }
  | {
      type: "complete";
      requestId: string;
      rawText: string;
      allSteps: NpcAiDialogueStep[];
    }
  | { type: "error"; requestId: string; message: string };

type NpcAiDialogueProvider = {
  stream(
    request: NpcAiDialogueProviderRequest,
    onEvent: (event: NpcAiDialogueProviderEvent) => void | Promise<void>
  ): void | Promise<void>;
  cancel?(requestId: string): void | Promise<void>;
};
```

The implementation may reuse the existing TXT marker parser and related prompt-building patterns to
avoid inventing a second protocol from scratch. That reuse is encouraged, but the runtime ownership
must stay with the shared NPC dialogue mechanism rather than `txt-narrative-place`.

### 4.5 Shared Runtime Bridge

Add a new shared runtime bridge, for example:

```ts
type NpcInteractionRuntimeBridge = {
  dispatch(request: NpcInteractionRuntimeRequest): void;
  closeActiveRequest(): void;
};
```

Responsibilities:

- start provider streams when the player enters AI dialogue,
- cancel superseded or closed requests,
- ignore stale provider events,
- feed provider events back into state reducers,
- render after state transitions,
- remain independent from house-module dispatch so fallback houses still work.

### 4.6 State Reducers And Selectors

Shared NPC interaction reducers/selectors should own:

- creating the AI dialogue session from the current target NPC,
- applying field updates,
- applying provider `start/step/complete/error` events,
- validating that a completed turn exposes exactly three generated options,
- appending structured transcript entries,
- writing persistent memory entries to the target NPC runtime log,
- mapping the current session to a typed AI dialogue view model.

### 4.7 Prompt Builder

Add a dedicated provider request builder for NPC talk that uses:

- current building/place name,
- target NPC identity,
- recent transcript summary,
- recent memory log summary for that NPC.

The request builder should keep the actual provider payload stable so the internal AI adapter can be
swapped later without reopening rendering or runtime code.

### 4.8 Placeholder Provider

Ship a deterministic placeholder provider for local verification. Its responsibilities:

- generate a short NPC reply,
- emit exactly three options,
- accept both structured option continuation and free-text continuation,
- echo enough context to prove memory and context threading works.

This placeholder is a test harness only. The real internal AI will replace it behind the provider
port.

### 4.9 UI And Rendering

The existing NPC menu renderer stays in place.

The dialogue renderer becomes a real typed panel that reads from the AI dialogue session:

- transcript scroll/body,
- three generated option buttons,
- custom input field + submit,
- close / exit control,
- status and error notices.

The panel should continue to live in the global NPC overlay layer, not as a house overlay.

### 4.10 Fallback House Coverage

Fallback non-module house rendering must stop using non-interactive roster cards and instead emit
the same `data-npc-target` / `data-npc-context` trigger seam used by module rosters so any building
can open the shared NPC interaction menu.

## 5. Interaction Flow

### 5.1 Start

1. Player clicks a building roster avatar.
2. Existing NPC menu opens.
3. Player clicks `谈话`.
4. Shared NPC interaction runtime:
   - upgrades the session to `mode: "ai-dialogue"`,
   - initializes the AI dialogue session,
   - starts the provider request.

### 5.2 Streaming

- `start` -> set session status to streaming.
- `step` -> append incremental transcript steps when available.
- `complete` -> finalize transcript, persist memory entries, and expose exactly three generated
  options plus custom input.
- `error` -> keep the panel recoverable and allow exit or retry/reactivate.

### 5.3 Continue

- Generated option -> append the player's selected line to transcript + memory, start the next
  request.
- Custom input -> append the player's text to transcript + memory, start the next request.
- Exit -> close the session and cancel any active request.

### 5.4 Switch NPC Or Building

- Leaving the building or opening another NPC session must cancel the old active provider request.
- Persistent memory stays intact.
- Session-local transcript state may close with the panel.

## 6. Testing And Verification

Implementation must prove:

1. `谈话` no longer opens a static placeholder and instead opens a typed AI dialogue session.
2. The shared NPC dialogue runtime starts provider streams and ignores stale events after close.
3. Completed turns persist memory entries under the target NPC's runtime log.
4. The AI dialogue renderer emits transcript, three generated choices, custom input, and exit.
5. Fallback non-module house rosters now emit shared NPC interaction triggers.
6. `src/main.ts` changes stay shell-only dependency injection / dispatch plumbing, not new
   building-specific dialogue branches.

Minimum verification:

- targeted NPC runtime/dialogue tests,
- targeted fallback house roster/view contract tests,
- relevant existing NPC interaction sound/contract tests,
- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`.

## 7. Exit Conditions

This child is complete only when:

- any building roster NPC can open the shared AI talk flow through the existing menu,
- the dialogue panel shows three generated options plus custom input,
- the player can exit at any time,
- each completed exchange persists into that NPC's memory log,
- fallback non-module houses are covered,
- the internal AI seam is reserved behind a replaceable provider interface,
- no new building-specific business branch lands in `src/main.ts`,
- shared docs are updated when implementation lands.
