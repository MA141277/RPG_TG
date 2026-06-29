# Engine Runtime Boundary Design

## 1. Goal

This design defines the first stable `mod-first` boundary for the project.

The target is to extract:

- engine boot and composition
- runtime dispatch and settlement
- cross-module contracts
- presenter, layout, and authoring seams

from the current `main.ts`-centered orchestration model.

The design assumes:

- `src/core` is the home for engine/runtime infrastructure
- `src/application` remains the home for gameplay/domain services during migration
- `src/ui` renders player-facing views
- `src/modding` provides authoring-facing schemas, presets, and validators

This design is not a full gameplay migration plan.

It is the structural boundary that later migration plans must follow.

## 2. Why This Boundary Is Needed

The project already has partial content-pack composition, but it does not yet have a stable engine boundary.

Current problems:

- `src/main.ts` still owns too much boot, navigation, interaction, and render orchestration
- runtime mutation is still distributed across feature modules without one stable dispatch path
- UI rendering still inspects feature-specific runtime data directly
- there is no formal mod manifest and capability boundary for future mods
- there is no schema-driven UI/layout authoring contract for mod creators

Without fixing this boundary first, converting content to JSON would only create data files on top of a still-coupled runtime.

## 3. Scope

This design covers:

- `src/core` directory structure
- engine responsibilities
- runtime responsibilities
- registry and contract boundaries
- UI and layout schema boundaries
- mod authoring schema boundaries
- migration rules for legacy modules

This design does not cover:

- full house migration
- full minigame migration
- full event/task DSL details
- full text externalization
- final visual design of all UI screens

Those belong in later subsystem specs and plans.

## 4. Top-Level Architecture

The project should converge on five layers:

### Layer A: Core

Owns:

- stable contracts
- engine boot
- runtime dispatch
- registry composition
- save envelope
- mod activation

Does not own:

- concrete story content
- concrete house behavior
- concrete minigame internals
- DOM rendering

### Layer B: Application

Owns:

- gameplay/domain services during migration
- adapters from legacy feature modules into core contracts
- presenter assembly from runtime data into render models

### Layer C: UI

Owns:

- layout rendering
- screen routing
- reusable player-facing components
- theme resolution

### Layer D: Modding

Owns:

- authoring presets
- JSON/schema validators
- starter templates
- examples for mod creators

### Layer E: Content

Owns:

- builtin mod content
- shared data assets
- future externalized JSON packs

## 5. Target Directory Tree

```text
src/
  core/
    contracts/
      core-state.ts
      engine-context.ts
      mod-manifest.ts
      runtime-request.ts
      runtime-result.ts
      effect.ts
      navigation.ts
      event.ts
      task.ts
      interactive.ts
      presenter.ts
      layout-schema.ts
      dialogue-schema.ts
      ui-block-schema.ts
      theme-schema.ts

    engine/
      engine-bootstrap.ts
      engine-factory.ts
      engine-session.ts
      engine-capability-guard.ts
      engine-mod-activation.ts

    runtime/
      runtime-dispatch.ts
      runtime-router.ts
      runtime-settlement.ts
      runtime-context.ts
      navigation-runtime.ts
      event-runtime.ts
      task-runtime.ts
      interactive-runtime.ts
      time-runtime.ts

    registry/
      engine-registry.ts
      mod-registry.ts
      content-registry.ts
      event-registry.ts
      task-registry.ts
      interactive-registry.ts
      house-registry.ts
      story-registry.ts
      layout-registry.ts
      component-preset-registry.ts

    mods/
      mod-loader.ts
      mod-activation.ts
      mod-content-index.ts
      mod-capabilities.ts
      mod-dependency-resolver.ts

    save/
      save-envelope.ts
      save-loader.ts
      save-writer.ts
      save-migrations.ts

    adapters/
      legacy-main-adapter.ts
      legacy-story-adapter.ts
      legacy-house-adapter.ts
      legacy-interactive-adapter.ts
      legacy-layout-adapter.ts

  application/
    presenter/
      app-presenter.ts
      screen-presenters/
      overlay-presenters/

  ui/
    app-render.ts
    layout-renderer.ts
    screen-router.ts
    overlays/
    layouts/
    components/
    theme/

  modding/
    authoring/
      component-presets/
      layout-presets/
      dialogue-presets/
      starter-templates/
      schema-validators/
      manifest-validators/
```

## 6. Engine Responsibilities

`src/core/engine` owns long-lived composition and stability boundaries.

It must be responsible for:

- booting the game
- selecting and activating the current mod
- composing registries
- creating initial state
- restoring saves
- enforcing capabilities
- exposing one engine session/context to runtime consumers
- deciding what state is engine-owned vs runtime-owned vs mod-owned

It must not be responsible for:

- deciding whether a story event should trigger today
- running a house gameplay loop
- dispatching battle-specific internal actions
- directly rendering UI
- directly mutating the DOM

### 6.1 Engine Files

- `engine-bootstrap.ts`
  - browser-safe boot entry
  - accepts selected mod id, registries, and optional save payload
- `engine-factory.ts`
  - constructs engine session objects
- `engine-session.ts`
  - owns selected mod, current state, and active registries
- `engine-capability-guard.ts`
  - rejects mods that require unsupported capabilities
- `engine-mod-activation.ts`
  - activates content and module availability for the selected mod

## 7. Runtime Responsibilities

`src/core/runtime` owns in-session orchestration.

It must be responsible for:

- receiving a stable request union
- routing requests
- invoking navigation/event/task/interactive/time runtimes
- applying settlement effects
- returning runtime results
- preparing runtime-owned data for presenters

It must not be responsible for:

- manifest parsing
- save schema definition
- registry initialization
- UI rendering
- content file discovery

### 7.1 Runtime Files

- `runtime-dispatch.ts`
  - single public runtime entrypoint
- `runtime-router.ts`
  - delegates by request kind and active state
- `runtime-settlement.ts`
  - applies `Effect[]` to engine/runtime state
- `runtime-context.ts`
  - typed dependency bundle used by runtimes
- `navigation-runtime.ts`
  - view transitions
- `event-runtime.ts`
  - event selection and execution
- `task-runtime.ts`
  - task lifecycle changes
- `interactive-runtime.ts`
  - dialogue/minigame/battle session orchestration
- `time-runtime.ts`
  - time advancement and periodic trigger coordination

## 8. Registry Responsibilities

Registries exist so engine/runtime never depend on concrete feature imports inside `main.ts`.

Required registries:

- `mod-registry`
- `content-registry`
- `event-registry`
- `task-registry`
- `interactive-registry`
- `house-registry`
- `story-registry`
- `layout-registry`
- `component-preset-registry`

### Registry Rule

Core code may depend on registries.

Core code must not depend on:

- concrete tavern files
- concrete campaign files
- concrete battle files
- concrete DOM component files

except through adapter modules during migration.

## 9. Core State Boundary

The project should converge on a state shape that clearly separates:

- engine-owned state
- runtime-owned state
- mod-owned state

Recommended shape:

```ts
export type CoreGameState = {
  engine: EngineState;
  runtime: RuntimeState;
  modState: Record<string, unknown>;
};

export type EngineState = {
  selectedModId: string;
  version: string;
  currentView: ViewName;
};

export type RuntimeState = {
  flags: Record<string, boolean>;
  variables: Record<string, string | number>;
  activeEventId: string | null;
  activeTaskIds: string[];
  interactiveSession: InteractiveSession | null;
};
```

### State Rules

- `engine` must contain only engine-owned session metadata
- `runtime` must contain only orchestration state needed while the game runs
- `modState` must hold mod-specific persistent payload
- future feature modules must not create ad hoc top-level state roots outside these buckets

## 10. Core Contracts

These interfaces must be defined before major runtime extraction proceeds.

### 10.1 Mod Manifest

```ts
export type ModCapability =
  | "navigation"
  | "events"
  | "tasks"
  | "interactive"
  | "story-battle"
  | "houses"
  | "markets"
  | "ui-layouts";

export type GameModManifest = {
  id: string;
  version: string;
  title: string;
  entryContentPackIds: string[];
  capabilities: ModCapability[];
  dependencies?: string[];
  defaultStart?: {
    mapId?: string;
    cityId?: string;
    sceneId?: string;
  };
};
```

### 10.2 Runtime Request

```ts
export type RuntimeRequest =
  | { type: "action"; actionId: string; payload?: Record<string, unknown> }
  | { type: "tick"; tickId: string }
  | { type: "external"; eventId: string; payload?: Record<string, unknown> };
```

### 10.3 Runtime Result

```ts
export type PresenterHint = {
  focusOverlayId?: string;
  requestedLayoutId?: string;
};

export type RuntimeResult = {
  state: CoreGameState;
  effects: Effect[];
  navigation?: NavigationTarget | null;
  presenterHint?: PresenterHint | null;
};
```

### 10.4 Effect

```ts
export type Effect =
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "setVariable"; key: string; value: string | number }
  | { type: "changeMoney"; amount: number }
  | { type: "advanceTime"; hours?: number; days?: number }
  | { type: "startTask"; taskId: string }
  | { type: "advanceTask"; taskId: string; objectiveId?: string; amount?: number }
  | { type: "completeTask"; taskId: string }
  | { type: "failTask"; taskId: string }
  | { type: "startInteractive"; moduleId: string; config?: unknown }
  | { type: "jumpScene"; sceneId: string };
```

### 10.5 Navigation

```ts
export type NavigationTarget =
  | { view: "map"; mapId?: string }
  | { view: "city"; cityId: string }
  | { view: "house"; houseId: string }
  | { view: "scene"; sceneId: string }
  | { view: "interactive"; moduleId: string };
```

### 10.6 Event

```ts
export type EventTrigger =
  | "onGameStart"
  | "onDayStart"
  | "onEnterCity"
  | "onEnterHouse"
  | "onTalkNpc"
  | "onTaskCompleted"
  | "onRandomTick";

export type EventCondition = {
  type: string;
  params?: Record<string, unknown>;
};

export type EventDefinition = {
  id: string;
  type: "story" | "routine" | "npc" | "incident";
  trigger: EventTrigger;
  priority?: number;
  repeatable?: boolean;
  cooldownDays?: number;
  conditions?: EventCondition[];
  effects?: Effect[];
  layoutId?: string;
};
```

### 10.7 Task

```ts
export type TaskObjective = {
  id: string;
  type: string;
  target?: number;
};

export type TaskDefinition = {
  id: string;
  category: "main" | "side" | "commission";
  objectives: TaskObjective[];
  rewards?: Effect[];
  failConditions?: EventCondition[];
};

export type TaskState = {
  taskId: string;
  status: "inactive" | "active" | "completed" | "failed";
  progress: Record<string, number | boolean | string>;
};
```

### 10.8 Interactive

```ts
export type InteractiveSession = {
  moduleId: string;
  category: "dialogue" | "minigame" | "battle";
  state: unknown;
};

export type InteractiveModuleContract<Config, SessionState, ViewModel> = {
  id: string;
  category: "dialogue" | "minigame" | "battle";
  createSession(input: {
    state: CoreGameState;
    config: Config;
  }): SessionState;
  dispatch(input: {
    state: CoreGameState;
    sessionState: SessionState;
    request: RuntimeRequest;
    config: Config;
  }): {
    state: CoreGameState;
    sessionState: SessionState;
    result?: RuntimeResult | null;
  };
  buildViewModel(input: {
    state: CoreGameState;
    sessionState: SessionState;
    config: Config;
  }): ViewModel;
};
```

## 11. UI, Layout, and Authoring Boundary

The project should separate:

- runtime UI data contracts
- player-facing render components
- creator-facing layout/component presets

These are not the same subsystem.

### 11.1 `core/contracts`

Must define:

- `PresenterOutput`
- `LayoutSchema`
- `DialogueNodeSchema`
- `UIBlockSchema`
- `ThemeSchema`

This layer describes data only.

It must not render DOM.

### 11.2 `ui`

Must own:

- `layout-renderer.ts`
- screen router
- overlays
- layouts
- reusable components
- theme resolution

This layer renders player-facing UI from schemas and presenter output.

### 11.3 `modding`

Must own:

- authoring presets
- validators
- starter templates
- examples

This layer exists for creators, not players.

It must validate and constrain what creators can declare.

### 11.4 Schema-Driven UI Rule

Mods must not inject arbitrary HTML or JavaScript into the player UI.

Mods must configure UI through schemas and presets.

Recommended base block union:

```ts
export type DialogueChoice = {
  id: string;
  labelTextId: string;
  nextNodeId?: string;
};

export type UIBlockSchema =
  | { type: "text"; textId: string }
  | { type: "speaker"; characterId: string }
  | { type: "portrait"; characterId: string }
  | { type: "choices"; options: DialogueChoice[] }
  | { type: "image"; assetId: string }
  | { type: "stats"; fields: string[] }
  | { type: "rewards"; rewardIds: string[] }
  | { type: "task-summary"; taskId: string }
  | { type: "custom-preset"; presetId: string; props?: Record<string, unknown> };
```

Recommended layout shape:

```ts
export type LayoutSchema = {
  id: string;
  frame: "dialogue" | "event-card" | "scene" | "full-screen-panel" | "sidebar";
  slots: {
    header?: UIBlockSchema[];
    body: UIBlockSchema[];
    footer?: UIBlockSchema[];
    aside?: UIBlockSchema[];
  };
};
```

Recommended theme shape:

```ts
export type ThemeSchema = {
  id: string;
  tokens: Record<string, string>;
};
```

## 12. Interaction Rules Between Core and Other Modules

Core must interact with the rest of the application through four mechanisms:

- registry
- contract
- capability
- adapter

### 12.1 Registry

Core looks up modules through registries.

### 12.2 Contract

Core calls modules only through stable contracts.

### 12.3 Capability

Core verifies whether a mod may use a category of runtime service.

### 12.4 Adapter

Legacy code may temporarily be wrapped in adapters while migration proceeds.

### Interaction Rule

Feature modules should not directly mutate shared runtime state.

They should instead return:

- `Effect[]`
- `RuntimeResult`
- module-local view models

for core settlement and presenter assembly.

## 13. Migration Rules

### 13.1 `main.ts` Rule

`main.ts` should shrink into:

- browser boot wiring
- DOM event binding
- render loop coordination

It must stop owning:

- concrete story dispatch
- concrete minigame orchestration
- concrete battle branches
- concrete content activation

### 13.2 Legacy Compatibility Rule

During migration it is acceptable to keep:

- legacy story callbacks
- legacy house modules
- legacy interactive paths
- legacy layout assembly

but only behind adapters.

These must be treated as transitional shims.

### 13.3 No Parallel Architecture Drift

Once `src/core/contracts` is introduced:

- new runtime paths must use the new contract names
- new UI/layout authoring work must use schema-driven boundaries
- new mod attachment points must go through registries

## 14. Done Condition

This design is realized when:

- `src/main.ts` is a thin browser bootstrap adapter
- `src/core/engine` owns boot and mod activation
- `src/core/runtime` owns dispatch and settlement
- `src/core/contracts` defines stable cross-module boundaries
- `src/ui` renders from presenter and layout schemas rather than feature internals
- `src/modding` provides creator-facing presets and validators
- the builtin game runs as the first consumer of the extracted structure
