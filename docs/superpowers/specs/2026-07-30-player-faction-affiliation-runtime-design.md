# 2026-07-30 Player Faction Affiliation Runtime Design

## Context

The current player faction display is split across three incompatible sources:

- `character.clanId` drives the character detail view's current "所属" field.
- `character.affiliationLabel` is patched directly by some story flows.
- `gameState.runtime.factionMemberships` stores faction-internal rank state for review flows.

This creates a broken progression for Zhu Yuanzhang's opening:

- game start shows no stable player faction affiliation
- entering Huangjue Temple clears `affiliationLabel`
- joining Guo Zixing's camp later patches `affiliationLabel` again
- the character detail view still reads `clanId`, so the visible "所属" field does not follow story progression

The repository already has a valid shared contract for faction merit and faction-internal rank progression. That contract should remain focused on review/rank logic and should not be stretched into a global "current affiliation" source.

## Goals

- Introduce a single global runtime source for a character's current faction affiliation.
- Allow story progression to change faction affiliation without hardcoding new business branches in `src/main.ts`.
- Keep faction affiliation separate from faction merit/rank membership.
- Make the player's visible faction name update correctly at these story beats:
  - first entering Huangjue Temple -> `皇觉寺`
  - after the Haozhou return encounter and being retained by Guo Zixing -> `红巾军`
- Provide a reusable runtime mechanism for later faction transitions beyond this one story line.

## Non-Goals

- Replacing the existing `runtime.factionMemberships` review contract.
- Reworking all clan, house, or superior relationships into faction state.
- Rewriting all old UI surfaces in one batch if a compatibility bridge can keep them correct.
- Changing house review rank tables or council logic.

## Current Mismatch

The current codebase has a semantic mismatch:

- `runtime.factionMemberships` means "active rank inside a faction review system"
- `character.affiliationLabel` means "freeform visible affiliation prose"
- `character.clanId` is used in some places as a fallback for "所属"

Those three concepts are not equivalent. Temple entry needs a faction affiliation before the first temple review writes rank data. That is why `runtime.factionMemberships` alone cannot be the single source of truth for visible affiliation.

## Recommended Approach

Add a dedicated runtime affiliation state plus a single owner class:

- new runtime state: `gameState.runtime.factionAffiliations`
- new owner: `FactionAffiliationRuntime`

`FactionAffiliationRuntime` becomes the only write path for active faction affiliation changes. Story callbacks, scene effects, and future shared mechanisms call this runtime rather than mutating `character.affiliationLabel` or relying on `clanId`.

`runtime.factionMemberships` remains responsible only for faction-internal rank identity such as `杂役`, `沙弥`, or `亲兵`.

## Data Model

Add a dedicated domain contract, for example in `src/domain/faction-affiliation.ts`:

```ts
export type FactionAffiliationState = {
  factionId: string;
  factionName: string;
  status: "active" | "left";
  joinedBy: string;
  joinedOn: {
    year: number;
    month: number;
    day: number;
  };
  sourceEventId?: string;
  leftOn?: {
    year: number;
    month: number;
    day: number;
  };
};

export type FactionAffiliationsState = Record<CharacterId, FactionAffiliationState>;
```

Add the new state to `GameState.runtime`:

```ts
factionAffiliations: FactionAffiliationsState;
```

Initialize it to `{}` in `createInitialState()`.

## Runtime Owner

Create a single class in an application/runtime owner layer, for example:

- `src/application/faction/faction-affiliation-runtime.ts`

Responsibilities:

- read the active faction affiliation for a character
- join a faction
- leave a faction
- resolve the best visible faction display name
- optionally sync `character.affiliationLabel` as a temporary compatibility projection

Suggested public surface:

```ts
class FactionAffiliationRuntime {
  readActiveFaction(state: GameState, characterId: CharacterId): FactionAffiliationState | null;
  joinFaction(input: {
    state: GameState;
    characterDefinitions: CharacterDefinition[];
    characterId: CharacterId;
    factionId: string;
    factionName: string;
    joinedBy: string;
    sourceEventId?: string;
    syncCharacterLabel?: boolean;
  }): {
    state: GameState;
    characterDefinitions: CharacterDefinition[];
  };
  leaveFaction(...): { state: GameState; characterDefinitions: CharacterDefinition[] };
  getDisplayName(input: {
    state: GameState;
    character: CharacterDefinition;
  }): string | null;
}
```

The class must not own any DOM or rendering logic.

## Integration Points

### 1. Temple Entry

Temple entry should set player faction affiliation to `皇觉寺` through the shared runtime owner.

Recommended implementation path:

- add a structured scene effect such as `set-faction-affiliation`
- let the existing scene/effect pipeline route that effect through `FactionAffiliationRuntime`

This keeps the affiliation transition data-driven instead of embedding a one-off temple branch in callback code.

Temple entry payload for the player should use:

- `factionId: "temple"`
- `factionName: "皇觉寺"`

This is intentionally separate from later temple review rank assignment such as `temple.laborer`.

### 2. Guo Zixing Recruitment

The existing `story.zhu_yuanzhang.join-guo-zixing-camp` callback should stop directly treating `character.affiliationLabel` as the source of truth.

Instead it should call `FactionAffiliationRuntime.joinFaction(...)` with:

- `factionId: "red_turban"`
- `factionName: "红巾军"`
- `joinedBy: "story.zhu_yuanzhang.join-guo-zixing-camp"`

This keeps the visible affiliation aligned with the user requirement while still allowing the keep review system to use Red Turban rank tables.

### 3. Faction Membership Review Flows

Temple and keep review flows continue to use:

- `runtime.factionMerit`
- `runtime.factionMemberships`

They do not become the primary visible affiliation source.

If a review flow needs to ensure a missing affiliation exists before rank settlement, it may call `FactionAffiliationRuntime.joinFaction(...)`, but the ownership remains explicit and separate.

## Presentation Contract

Any UI rendering a character's visible faction affiliation should stop choosing directly between `clanId` and `affiliationLabel`.

Instead it should use a shared resolver backed by `FactionAffiliationRuntime`, for example:

1. active runtime faction affiliation
2. compatibility `character.affiliationLabel`
3. final fallback such as `character.clanId`

For this task, the minimum required migrated reader is the player character detail view. That view currently shows the broken "所属" field and is the directly reported bug surface.

Recommended follow-up readers to keep consistent if touched in the same batch:

- leader residence character info rows
- any shared character summary presenter that labels a character's affiliation

## Compatibility Strategy

`character.affiliationLabel` should remain as a compatibility projection for now, not as the source of truth.

During the migration period:

- `FactionAffiliationRuntime.joinFaction(...)` updates runtime affiliation state
- the same runtime path also mirrors the display string into `character.affiliationLabel`
- direct story or scene code should stop patching `affiliationLabel` by hand for faction ownership changes

This keeps old surfaces stable while new readers move to the runtime source.

## File Ownership

Likely touched files:

- `src/domain/game-state.ts`
- `src/application/state/create-initial-state.ts`
- new `src/domain/faction-affiliation.ts`
- new `src/application/faction/faction-affiliation-runtime.ts`
- scene effect application or story callback integration files
- `src/application/story/story-callbacks.ts`
- `src/ui/app-render.ts`
- any migrated UI display readers

No new faction business logic should be added to `src/main.ts`.

## Error Handling

- reading an unknown faction affiliation returns `null`, not a thrown error
- joining the same faction again replaces stale active state idempotently
- leaving a faction that does not exist becomes a no-op
- readers must tolerate missing compatibility labels during migration

## Testing Strategy

Follow TDD and add failing tests before implementation.

Required behavior coverage:

1. initial state contains empty `runtime.factionAffiliations`
2. temple entry transition writes active player faction affiliation `皇觉寺`
3. Guo Zixing callback writes active player faction affiliation `红巾军`
4. player character detail view resolves "所属" from runtime faction affiliation before `clanId`
5. legacy compatibility label remains synchronized after faction joins
6. existing temple review membership tests still pass and continue to assert rank data in `runtime.factionMemberships`

Regression coverage:

- temple affiliation exists before first temple review rank settlement
- Guo Zixing callback no longer depends on `character.affiliationLabel` as primary storage

## Implementation Notes

- Prefer a shared structured effect for temple entry instead of creating a second one-off callback solely for this beat.
- Keep faction IDs stable and machine-oriented, display names localized and player-facing.
- Do not infer visible affiliation from faction rank labels like `杂役` or `亲兵`; rank identity and faction affiliation are separate axes.

## Acceptance Criteria

- the player has one global runtime faction affiliation source
- entering Huangjue Temple changes visible faction to `皇觉寺`
- joining Guo Zixing changes visible faction to `红巾军`
- the character detail "所属" field reflects that source
- story code no longer relies on ad hoc `affiliationLabel` mutation as the primary mechanism
- `runtime.factionMemberships` remains dedicated to review/rank logic
