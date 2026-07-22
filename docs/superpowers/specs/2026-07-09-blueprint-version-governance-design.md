# Blueprint Version Governance Design

## 1. Goal

Add one explicit Blueprint governance version contract so the repository can detect when active governance queue documents no longer match the current Blueprint rules, then reconcile those queue documents in a controlled way.

The target outcome is:

- one authoritative Blueprint governance version source
- one deterministic way to detect queue governance drift
- one explicit `check` action for visibility and CI enforcement
- one explicit `sync` action for controlled queue document reconciliation
- no automatic rewriting of historical evidence text
- no hidden coupling where `lint` both validates and mutates governance documents

## 2. Scope

This design applies to:

- `docs/blueprints/blueprint.md` as the current Blueprint truth entry
- current live version-governor documents that determine the active governance chain
- governance queue documents under `docs/blueprints/queues/*.md` that still participate in live decision-making
- Blueprint governance tooling and tests that must understand version-driven queue reconciliation

This design does not require:

- automatic rewrites of historical closed-queue narrative text
- automatic rewrites of `tools/`, `tests/`, or template files by the queue sync command
- bulk mutation of every queue document in the repository regardless of governance state
- introducing a second queue truth source outside the existing Blueprint truth chain

## 3. Why This Exists

Blueprint governance already depends on a live truth chain:

`project-progress -> blueprint -> version plan -> active queue -> active task`

After governance rules change, queue documents can remain discoverable while still carrying stale control-block structure, stale terminology, or stale Blueprint contract metadata.

Without an explicit governance version:

- active or promotable queue documents can silently drift away from the live Blueprint contract
- `lint` can only reject some structural problems, but cannot express whether a queue follows the current governance contract generation
- there is no controlled repository mechanism for upgrading live governance queue documents after a Blueprint governance update

This design adds explicit version-driven queue governance without changing the meaning of the truth chain itself.

## 4. Core Design

### 4.1 Blueprint Version Truth

The authoritative governance version must live only in:

- `docs/blueprints/blueprint.md`

The Control Block must define:

- `blueprint_version`

This field is the only top-level governance version truth for queue reconciliation.

Rules:

- queue reconciliation must compare against `docs/blueprints/blueprint.md`
- no queue document may define its own competing governance version source
- no template or test may become the runtime source of Blueprint governance version truth

### 4.2 Governed Queue Set

The system must not treat every queue file as a live reconciliation target.

The governed queue set is derived from the current live truth chain:

- the current active queue from the live version plan, if not `none`
- queue ids currently referenced by live review or promotion control fields such as `review_subject_id` or `proposed_queue_id`
- queue documents still treated as candidate or admission-relevant by the live Blueprint/version governance state

The system must not auto-sync:

- queue documents that are closed and now serve only as historical evidence
- queue documents that are no longer reachable from the current live governance chain
- queue documents whose state cannot be classified safely from live governance truth

If a queue file exists but is outside the governed queue set, `check` may report that it is outside current governance scope, but `sync` must skip it.

### 4.3 Queue Governance Shell

Each governed queue document must carry a minimal governance shell in its Control Block.

Required governance fields:

- `blueprint_version`
- `governance_last_synced_at`
- `governance_sync_source`

Term alignment rules:

- queue ownership must use `belongs_to_version`
- governed queue docs must not keep `belongs_to_target`

The queue reconciliation tool may update only governance-shell fields and directly related structural terminology needed to satisfy the current Blueprint contract.

The queue reconciliation tool must not rewrite:

- historical snapshots
- closeout prose
- review narrative
- operator-authored evidence text
- support-spec narrative content

### 4.4 Tool Split

This capability should live in a dedicated tool:

- `tools/blueprint-version-governance.mjs`

The tool exposes two explicit actions:

- `check`
- `sync`

`tools/lint-blueprints.mjs` remains a validator only.

Reason:

- queue governance reconciliation has controlled side effects
- validation and mutation should not hide behind one command
- future governance expansion should not turn the lint script into a repository-wide mutation tool

## 5. Command Behavior

### 5.1 `check`

`check` reads:

- current Blueprint truth from `docs/blueprints/blueprint.md`
- current live version-governor truth needed to resolve the governed queue set
- governed queue documents

`check` must detect:

- queue `blueprint_version` differs from current Blueprint version
- required governance-shell fields are missing
- governed queue docs still use forbidden legacy governance terms
- governed queue docs are structurally incompatible with the current Blueprint governance contract

`check` output should stay compact:

- queue id or file path
- reason the queue needs reconciliation

Exit behavior:

- `0` when all governed queue docs already match the current Blueprint contract
- non-zero when any governed queue requires reconciliation or cannot be evaluated safely

### 5.2 `sync`

`sync` uses the same governed queue resolution as `check`.

`sync` may update:

- queue `blueprint_version`
- `governance_last_synced_at`
- `governance_sync_source`
- explicit governance-shell terminology required by the current Blueprint contract

`sync` must not update:

- historical narrative sections
- human-authored evidence prose
- queue closeout conclusions
- non-governance support-spec content

Safety rules:

- `sync` must skip queue files outside the governed queue set
- `sync` must fail closed if live Blueprint truth is ambiguous
- `sync` must validate each rewritten queue document before reporting success
- `sync` must return non-zero if any governed queue cannot be reconciled safely

Output should report:

- updated queue files
- skipped queue files
- blocked queue files with reasons

## 6. Lint Responsibilities

`tools/lint-blueprints.mjs` should gain only repository guardrails related to the new version-governance contract.

Lint should enforce:

- `docs/blueprints/blueprint.md` declares `blueprint_version`
- live governance docs do not define conflicting Blueprint version truth
- governed queue docs use current governance terminology
- legacy governed queue ownership fields such as `belongs_to_target` are rejected

Lint should not:

- auto-rewrite queue docs
- infer hidden reconciliation intent
- become the only mechanism that tells the repository a queue is outdated

## 7. Test Coverage

Tests should cover behavior rather than only string presence.

Required coverage:

- `check` reports governed queues whose `blueprint_version` is behind the current Blueprint version
- `check` ignores queue files outside the governed set
- `sync` updates only allowed governance-shell fields
- `sync` does not rewrite historical narrative sections
- `sync` fails closed when the live Blueprint version truth is missing or ambiguous
- lint rejects governed queue docs that keep forbidden legacy ownership fields
- lint rejects live Blueprint governance state that omits the top-level `blueprint_version`

Test structure should prefer fixtures/helpers so future Blueprint governance renames do not require brittle string edits across unrelated tests.

## 8. Rollout Order

Implementation should follow this order:

1. Add the dedicated version-governance tool with fixture-backed tests.
2. Extend Blueprint lint with version-governance guardrails.
3. Update live Blueprint docs and governed queue docs to the new governance shell.
4. Re-run repository verification until the governance tool, lint, and tests agree on one contract state.

This rollout keeps the runtime truth chain stable while introducing explicit queue reconciliation.

## 9. Non-Goals And Constraints

This design does not change the truth-chain semantics.

It keeps:

- `project-progress -> blueprint -> version plan -> active queue -> active task`

This design is a governance contract upgrade, not a semantic Blueprint workflow rewrite.

It also must not introduce long-lived drift by:

- creating a second version registry outside the Blueprint entry
- mutating historical evidence queues as if they were still live controllers
- letting automatic sync rewrite human governance evidence
