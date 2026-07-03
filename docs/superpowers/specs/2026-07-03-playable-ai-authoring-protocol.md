# Playable AI Authoring Protocol

## 1. Goal

Define a practical protocol for future AI-assisted playable creation so AI follows the repository playable contract instead of improvising file placement, reward logic, or runtime glue.

This is a doc-only protocol draft. It does not authorize code generation yet.

## 2. Core Principle

AI must not be treated as “the whole framework.”  
AI should operate inside three bounded roles:

- `playable/mechanic author AI`
- `scenario/integration author AI`
- `framework/runtime maintainer AI`

These roles may be handled by one model session later, but their outputs must remain separated.

## 3. Mechanic Author AI Contract

### 3.1 Inputs It Should Receive

- approved concept brief
- assigned `playableId`
- assigned `family`
- target mechanic style
- allowed metrics to expose
- content and asset constraints

### 3.2 Outputs It Should Produce

- `Playable Mechanic Brief`
- mechanic-facing content/config draft
- metric declaration draft
- asset list draft
- unresolved mechanic questions list if the concept is underspecified

### 3.3 What It Must Not Decide

- trigger conditions
- owner kind / owner id
- success / failure / cancelled semantics
- rewards / punishments
- return policy
- final directory layout
- registry install points
- `main.ts` wiring

## 4. Integration Author AI Contract

### 4.1 Inputs It Should Receive

- approved `playableId`
- approved scenario use site
- assigned `integrationId`
- owner context requirements
- trigger requirements
- victory / failure / cancel conditions
- reward / punishment policy
- handoff policy

### 4.2 Outputs It Should Produce

- `Playable Integration Brief`
- integration config draft
- trigger definition draft
- outcome config draft
- handoff config draft

### 4.3 What It Must Not Decide

- mechanic reducer behavior
- playable-specific core rules if they are not part of the approved mechanic brief
- ad hoc runtime shortcuts around the shared playable shell

## 5. Framework Maintainer AI Contract

### 5.1 Inputs It Should Receive

- approved child plan or approved implementation task
- current repository contract docs
- current file placement rules
- current scaffold / validator / CI expectations

### 5.2 Outputs It Should Produce

- framework-owned file placement
- registry updates
- runtime glue changes
- validator updates
- migration-safe compatibility work

### 5.3 What It Must Not Do

- invent missing mechanic semantics
- invent missing integration semantics
- silently ship placeholder config as if it were complete

## 6. Required Prompt Sequence For Future AI Work

For a new playable, the minimum protocol should be:

1. assign or approve `playableId`
2. collect `Playable Mechanic Brief`
3. assign or approve `integrationId`
4. collect `Playable Integration Brief`
5. run scaffold path
6. generate or edit code/config only inside scaffolded paths
7. run validation
8. reject incomplete or contradictory outputs rather than guessing

## 7. Missing-Information Behavior

If required information is missing:

- mechanic AI should stop and list missing mechanic requirements
- integration AI should stop and list missing integration requirements
- framework AI should not guess defaults that the playable spec marks as fail-closed

Examples:

- missing victory condition
  - integration AI must not infer one from score labels
- missing owner return policy
  - framework AI must not invent a route from view state
- missing reward config
  - may only use explicit empty fallback where the shared spec allows it

## 8. Recommended Artifact Checklist For AI

Before an AI-generated playable is treated as ready, the repository should be able to point to:

- one `playableId`
- one `family`
- one mechanic brief
- one or more `integrationId` values
- one integration brief per use site
- one validator result
- one plan or migration child that owns the change

## 9. Red-Flag Behaviors To Reject

Reject AI output if it:

- edits `src/main.ts` to add a concrete playable branch without owning an approved compatibility seam
- hardcodes rewards or win conditions into mechanic code when they belong to integration config
- places files in ad hoc folders
- introduces a new top-level runtime family like `debate` or `gamble`
- invents return behavior from current UI context
- merges mechanic and integration artifacts into one blob

## 10. Minimal Prompt Frames

### 10.1 Mechanic AI Prompt Frame

```text
You are acting only as the playable/mechanic author.
You may define mechanic rules, exposed metrics, content structure, and asset needs.
You must not define trigger rules, owner routing, rewards, punishments, or runtime glue.
Return:
1. mechanic brief
2. metric list
3. content/config draft
4. asset list
5. unresolved questions
```

### 10.2 Integration AI Prompt Frame

```text
You are acting only as the scenario/integration author.
You may define trigger, owner context, outcome rules, rewards/punishments, and handoff semantics for one integrationId.
You must not redefine mechanic reducer behavior or repository glue.
Return:
1. integration brief
2. trigger draft
3. outcome config draft
4. reward/handoff draft
5. unresolved questions
```

### 10.3 Framework AI Prompt Frame

```text
You are acting only as the framework/runtime maintainer.
You may place files, wire registries, adapt runtime seams, and preserve compatibility during migration.
You must not invent missing mechanic or integration semantics.
Return:
1. file map
2. runtime/registry changes
3. validation impact
4. compatibility notes
```

## 11. Relationship To Human Roles

This protocol assumes:

- concept proposer can be human
- screenplay/integration editor can be human
- framework maintainer can be human
- any of the above may delegate drafting to AI

But the repository should still preserve the same separation in stored artifacts and review flow.

## 12. Forward Rule

Later scaffold/validator implementation should be designed so AI-generated output is reviewed against repository artifacts, not against informal chat promises.
