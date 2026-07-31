# Playable Test Strategy

## 1. Goal

Define a phased test strategy for the first playable-runtime migration queue so later Child 30-34 work adds the right evidence at the right phase.

This is a doc-only planning artifact.

## 2. Strategy Principles

- test the shared shell before broad migration
- preserve parity while migrating concrete playables
- separate mechanism tests from integration tests
- treat owner return behavior as a first-class regression target
- keep battle-family assertions distinct from minigame-family assertions

## 3. Test Layers

### 3.1 Contract Tests

Use for:

- shared types and registry presence
- launch normalization
- `integrationId` uniqueness and lookup
- handoff and recovery rule enforcement

Primary phase:

- `Child 30`

### 3.2 Migration Parity Tests

Use for:

- concrete playable launch/action/completion parity
- preservation of existing user-visible behavior
- regression against accidental feature loss during migration

Primary phases:

- `Child 31`
- `Child 32`
- `Child 33`

### 3.3 Host Integration Tests

Use for:

- house / scene / story host still returns to correct owner
- trigger owner and settlement owner remain correct

Primary phases:

- `Child 32`
- `Child 33`

### 3.4 Enforcement Tests

Use for:

- scaffold command exists
- validator command exists
- obsolete direct branches are actually removed

Primary phase:

- `Child 34`

## 4. Child-by-Child Test Focus

### 4.1 Child 30

Must prove:

- playable contract family exists
- playable definition registry exists
- playable integration registry exists
- launch normalizes to one `integrationId` or fails explicitly
- current compatibility paths still function while concrete migrations are deferred

Suggested robustness patterns:

- `"playable runtime skeleton"`
- `"playable registry"`
- `"integration registry"`
- `"playable launch normalization"`

### 4.2 Child 31

Must prove:

- `activity-qte` routes through the playable runtime
- `city-begging` routes through the playable runtime
- `city-begging` variants remain internal
- covered completion and closeout behavior are preserved

Suggested robustness patterns:

- `"activity qte playable"`
- `"city begging playable"`
- `"covered minigame parity"`

### 4.3 Child 32

Must prove:

- `grain-accounting` is no longer mechanic-owned by grain-shop house module
- `medicine-compounding` is no longer mechanic-owned by medicine-house house module
- host houses still return to the correct owner/session
- shared house contract remains valid if launch/return boundaries moved

Suggested robustness patterns:

- `"grain accounting playable"`
- `"medicine compounding playable"`
- `"house playable return"`

### 4.4 Child 33

Must prove:

- `story-battle` routes through the shared playable runtime
- `story-battle` keeps its explicit battle semantics without relying on a shared-contract `family` field
- battle-specific command and presenter semantics remain intact
- post-battle return remains correct

Suggested robustness patterns:

- `"story battle playable"`
- `"battle family"`
- `"post battle handoff"`

### 4.5 Child 34

Must prove:

- scaffold command exists
- integration scaffold command exists
- validator command exists
- obsolete direct branches are gone where closeout claims they are gone
- still-needed compatibility seams remain explicit

Suggested robustness patterns:

- `"playable scaffold"`
- `"playable validator"`
- `"playable legacy closeout"`

## 5. Assertion Categories

Every migrated playable should eventually have assertions for:

- launch owner
- active state carrier
- fact-result emission
- outcome resolution path
- settlement owner
- handoff owner
- return target

## 6. Current-State To Future-Test Mapping

### 6.1 `activity-qte`

Current weak points to lock:

- concrete action ids in `main.ts`
- direct exit ownership
- no formal `integrationId`

### 6.2 `city-begging`

Current weak points to lock:

- state lives in `state.app.beggingMiniGameState`
- launch is external-style, not integration-normalized
- return currently closes without formal owner context

### 6.3 `grain-accounting`

Current weak points to lock:

- house overlay owns mechanic session
- reward logic still lives in house-local closeout
- no shared handoff path

### 6.4 `medicine-compounding`

Current weak points to lock:

- house overlay owns mechanic session
- stamina and result write-back still close locally
- no shared handoff path

### 6.5 `story-battle`

Current weak points to lock:

- action routing still depends on `interactive.story-battle.action`
- active state still lives in `state.core.storyBattle`
- return still depends on `enterHouseId -> reenter-house`

## 7. Recommended Test Ownership

- `tests/robustness.test.cjs`
  - queue-phase regression and ownerization checks
- later `tests/playables/<playableId>.test.*`
  - focused mechanic and presenter checks after the shell stabilizes

Rule:

- do not wait for the final cleanup child to start testing
- each child should land its own targeted assertions

## 8. Manual Verification Focus

Later implementation batches should also manually verify:

- visible launch and closeout for migrated playables
- host-house recovery after accounting/compounding close
- post-battle return path
- no obvious UI regressions during shell migration

## 9. Non-Goals

This strategy does not yet define:

- exact test framework migration
- exact split between unit tests and integration tests
- performance benchmarking

It only defines the evidence shape required to safely execute Child 30-34 later.
