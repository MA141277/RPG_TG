---
name: playable-governance
description: Use when the task involves adding, modifying, reviewing, scoping, or integrating a playable, minigame, QTE, or story-battle flow in RPG_TG, including house-hosted playable work, playable runtime changes, playable integration changes, gameplay-loop refactors that touch playable ownership, or questions about playable governance and project impact.
---

# Playable Governance

Use this skill before proposing or implementing playable-related work in this repository.

## Read Order

1. Read `references/playable-doc-index.md`.
2. Read `references/playable-governance-core.md`.
3. Then choose the task-specific reference:
   - add a new playable -> `references/playable-change-checklist.md`
   - modify an existing playable -> `references/playable-change-checklist.md`
   - assess project impact -> `references/playable-impact-matrix.md`
   - check ambiguous trigger wording -> `references/playable-trigger-examples.md`
   - update this governance skill -> `references/playable-update-protocol.md`

## Required Classification

Classify the request before proposing changes:

- new playable
- existing playable modification
- shared playable contract change
- house-hosted playable integration
- playable governance question only

If the task could fit more than one class, bias toward `shared playable contract change` until current evidence proves the work is local-only.

## Required Behavior

- Treat playable work as shared mechanism work by default, not as a one-off house patch.
- Do not add playable-specific business branches in `src/main.ts`.
- Do not bypass the shared playable runtime with ad hoc local lifecycle ownership.
- If the work touches a house host, also follow `docs/special-house-interface.md`.
- Keep `SKILL.md` stable and push evolving rules into `references/`.

## Required First Response Pattern

Before implementation, first state:

- affected playable or mechanic
- task classification
- whether the change is local-only or shared-contract level
- whether house-hosted contract rules also apply
- which reference files are governing the task

## Required Output

Before implementation, state:

- which playable or mechanic is affected
- whether the change is local-only or shared-contract level
- which layers are allowed to change
- what project areas may be impacted

## Stop And Escalate If

- the work needs a new top-level playable `family`
- the work needs a new owner kind or return-policy pattern
- the work requires playable lifecycle ownership to move into house-local code
- the work cannot proceed without changing shared registry or runtime contracts
- the work claims to be local-only but touches multiple playable families or integrations

## Guardrails

- Do not invent a new top-level playable family unless the repository-level contract is explicitly updated.
- Do not encode host identity or scenario identity into `playableId`.
- Do not treat UI overlay code as the owner of playable lifecycle or settlement.
