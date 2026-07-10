# Blueprint Closure Judgement And Residue Routing Design

**Goal:** Strengthen Blueprint's closure-oriented governance so queue completion, topic closure, and same-family residue continuation are judged from structured truth that stays closer to real code-state completion instead of stopping at governance-action completion.

## 1. Why This Design Exists

Blueprint already handles intake, candidate recording, admission routing, active-queue execution, and queue closeout reasonably well.

The remaining weakness is not ordinary task execution. It is closure-oriented governance.

Recent closeout work exposed three recurring failures:

1. Queue completion and topic closure are still too easy to confuse.
   - A queue can land the intended migration slice, write closeout truth, and complete sync work while the covered code family still retains:
     - old production paths
     - legacy bridges
     - compatibility residue
     - default-privilege dependencies
     - shell or owner residue
2. Governance state can advance ahead of code-state convergence.
   - `done` and `closed` can describe governance progress while the implementation has only reached a bounded migration checkpoint.
3. Closure chains still break back out into prose decision-making.
   - After queue closeout, Blueprint can notice residue, but it does not yet reliably convert same-family residue into the next lawful internal routing result.

The result is a trust gap:

- Blueprint proves that governance happened
- but it does not yet reliably prove that the covered code theme has actually closed

This design closes that gap without making human intake more governance-shaped.

## 2. Scope And Non-Authority Boundary

This document is a design proposal, not live Blueprint truth.

It applies to:

- `docs/blueprints/blueprint-workflow-spec.md`
- current Blueprint templates
- Blueprint lint and Blueprint governance tests
- current live Blueprint docs only where the new structure becomes mandatory

It does not itself:

- authorize queue creation
- authorize queue admission
- rewrite the live Blueprint truth chain
- make `docs/superpowers/**` into live Blueprint truth

It also does not change the current authoritative resume chain:

`project-progress -> blueprint -> version plan -> active queue -> active task`

## 3. Design Goals

1. Preserve plain-language human intake.
2. Distinguish execution completion from actual topic closure.
3. Make queue and version state better reflect real code convergence rather than only governance completion.
4. Let same-family residue continue through internal routing by default.
5. Ask humans only when multiple mutually exclusive lawful continuations exist.
6. Keep closure truth structured, lintable, and resumable.

## 4. Non-Goals

- adding a second live resume chain
- moving closure truth into `project-progress.md` or `blueprint.md`
- turning `docs/change-log.md` into live routing truth
- requiring humans to manually define residue families, queue identities, or closeout boundaries during intake
- converting version specs into live closeout controllers

## 5. Core Design Principle

Blueprint must stop treating these two statements as equivalent:

- `this queue finished its execution slice`
- `this queue's covered topic is actually closed`

The new model therefore separates:

- **execution closeout**
  - whether the queue completed its intended execution work
- **topic closure**
  - whether the code theme covered by the queue is actually converged enough to count as closed

Execution completion is necessary for topic closure, but it is not sufficient.

## 6. Governance Layering

The live truth chain remains:

`project-progress -> blueprint -> version plan -> active queue -> active task`

This design adds a closure-oriented interpretation layer without changing that chain.

### 6.1 Queue Doc Responsibility

The queue doc becomes the only live owner for queue-level closure judgement.

It answers:

- did the queue complete its execution slice
- is the covered topic really closed
- does residue remain
- is the residue still same-family
- is the next continuation uniquely routable

### 6.2 Version Plan Responsibility

The version plan becomes the only live owner for version-level residue routing after queue closeout.

It answers:

- which closed queue's residue result is currently being reviewed
- whether that residue belongs to a same-family continuation or a broader version review
- whether Blueprint already has a unique next lawful queue recommendation
- whether the next routing step can continue automatically without human choice

### 6.3 Upstream Documents Stay Narrow

`project-progress.md` must remain repository entry truth only.

`blueprint.md` must remain version-registry and execution-mode truth only.

`docs/change-log.md` must remain historical summary only.

None of those documents may own closure-family live truth.

## 7. Queue-Level Closure Judgement Model

Queue closeout must no longer rely on one coarse `closeout_status` alone.

Every queue closeout must distinguish between execution completion and topic closure.

### 7.1 Required Queue Closeout Fields

Queue docs should extend their closeout structure with these fields:

- `execution_closeout_status`
  - `done | partial | blocked`
- `topic_closure_status`
  - `closed | open-residue | blocked`
- `closure_basis`
  - one-line structured statement of the governing closeout basis
- `residue_remaining`
  - `yes | no`
- `residue_family`
  - `same-family | cross-family | accepted-residue | none`
- `residue_routing_status`
  - `auto-routable | needs-version-review | needs-human-decision | none`
- `next_family_candidate`
  - `queue.xxx | item.xxx | none`
- `auto_continue_eligible`
  - `true | false`

These fields belong to queue-level truth because they depend on the queue's own bounded implementation surface and closeout evidence.

### 7.2 Meaning Of Each Field

- `execution_closeout_status`
  - says whether the queue completed the intended bounded execution slice
- `topic_closure_status`
  - says whether the covered topic is actually closed in code-state terms
- `closure_basis`
  - records why the topic is considered closed, still open with residue, or blocked
- `residue_remaining`
  - states whether any post-closeout residue still exists
- `residue_family`
  - says whether remaining residue is:
    - a direct continuation of the same closure chain
    - a broader or different family
    - explicitly accepted residue that no longer blocks this queue's topic closure
- `residue_routing_status`
  - says whether Blueprint can route the residue automatically or must return to broader review
- `next_family_candidate`
  - names the next queue or item candidate if a lawful continuation already exists
- `auto_continue_eligible`
  - says whether Blueprint should continue routing automatically without human choice

## 8. Execution Completion Versus Topic Closure

This design makes the following rule explicit:

`execution_closeout_status = done` must not imply `topic_closure_status = closed`.

Blueprint must judge closure in three layers.

### 8.1 Layer 1: Migration Or Execution Slice Landed

This means:

- the intended bounded slice was implemented
- the covered path can use the new owner, seam, or structure
- the queue's verification confirms that bounded slice

This supports:

- `execution_closeout_status = done`

It does not by itself support:

- `topic_closure_status = closed`

### 8.2 Layer 2: Old Structure No Longer Blocks The Covered Topic

Blueprint must then determine whether the covered topic still retains live residue in the same bounded family.

Examples of blocking residue include:

- old production paths still owning covered behavior
- legacy bridges still acting as effective owners
- compatibility helpers still carrying current production responsibility
- default-privilege dependencies still serving the covered owner line
- shell or owner residue still preventing true topic closure

If any of those still remain inside the queue's frozen theme boundary, the topic cannot be marked closed.

### 8.3 Layer 3: Topic Closure

Only after Blueprint has both:

- confirmed the new structure is established
- and confirmed no still-blocking same-family residue remains

may it write:

- `topic_closure_status = closed`

If execution finished but residue remains, Blueprint must instead write:

- `execution_closeout_status = done`
- `topic_closure_status = open-residue`

That distinction is the design's primary guardrail.

## 9. Residue Classification Rules

Queue closeout must classify remaining residue into one of three buckets.

### 9.1 Same-Family Residue

Use `same-family` only when all are true:

- the residue still belongs to the same already-frozen topic semantics
- the next cut is a continuation of the same closure chain rather than a new topic invention
- the work remains in the same version boundary
- the next lawful continuation can be reasoned from current closeout evidence

This residue should not return to the human as a fresh open-ended design question.

### 9.2 Cross-Family Residue

Use `cross-family` when remaining work:

- crosses into a broader owner family
- changes the topic boundary
- belongs to another queue family
- or requires new version-level scoping rather than same-chain continuation

This residue must return to version-level review instead of being auto-treated as same-queue continuation.

### 9.3 Accepted Residue

Use `accepted-residue` when residue still exists historically or compatibly but no longer blocks topic closure for the covered queue boundary.

This category exists so Blueprint can say:

- the residue exists
- but it is not still part of the queue's blocking closeout surface

Accepted residue must still be explained by `closure_basis`; it must not become a silent hand-wave.

## 10. Version-Level Residue Routing Model

Once queue closeout has produced closure judgement, the version plan must absorb the routing result.

The version plan must not repeat queue-level implementation evidence. It must only carry routing truth for what happens next.

### 10.1 Required Version-Level Closure Routing Fields

The version plan should gain:

- `closure_review_subject`
  - `queue.xxx | none`
- `closure_review_status`
  - `none | evaluating | routed | blocked`
- `residue_candidate_id`
  - `item.xxx | none`
- `residue_candidate_family`
  - `same-family | cross-family | accepted-residue | none`
- `routing_basis`
  - one-line structured explanation of the routing result
- `next_lawful_queue_recommendation`
  - `queue.xxx | none`
- `auto_admission_ready`
  - `true | false`

### 10.2 Ownership Rules

These fields belong only to the version plan.

They must not migrate to:

- `project-progress.md`
- `blueprint.md`
- version spec queue portfolio
- `docs/change-log.md`

The version plan is the correct owner because residue routing affects version-level next-step truth but does not itself re-open queue-level implementation evidence.

## 11. Continuous Same-Family Routing Rules

Queue closeout must no longer stop at "residue exists."

Blueprint must continue through a fixed routing sequence.

### 11.1 Required Post-Closeout Sequence

After queue closeout reaches `execution_closeout_status = done`, Blueprint must:

1. read queue-level closure judgement
2. determine whether residue remains
3. determine whether that residue is same-family, cross-family, accepted-residue, or none
4. decide whether the next lawful continuation is unique
5. write version-level routing truth accordingly

### 11.2 Same-Family Auto-Routing

If all are true:

- `topic_closure_status = open-residue`
- `residue_family = same-family`
- the next lawful cut is unique
- the work stays within the same version
- no resource, boundary, or governance conflict blocks continuation

then Blueprint should:

- record the residue as the next structured candidate
- write `next_lawful_queue_recommendation`
- write `auto_admission_ready = true`
- avoid returning to the human with an open-ended "what next" question

### 11.3 Return-To-Version-Review Cases

Blueprint must return residue to version review instead of same-family auto-continuation when:

- `residue_family = cross-family`
- the residue crosses a version boundary
- the next lawful cut is not unique
- the remaining work introduces a new queue family or queue boundary
- governance or resource conflicts make continuation non-unique

### 11.4 Accepted-Residue Handling

If `residue_family = accepted-residue`, Blueprint may still close the topic if `closure_basis` proves that accepted residue no longer blocks the queue's bounded closure contract.

But accepted residue must not silently become:

- same-family continuation
- or erased history

It must remain explicit.

## 12. Human Confirmation Constraint For Closure Chains

This design strengthens the existing "only ask when necessary" rule.

Blueprint may ask a human decision question after queue closeout only when all are true:

- multiple mutually exclusive lawful next routes exist
- current docs and code-state do not uniquely decide between them
- choosing one route would change active truth

Blueprint must not ask when:

- same-family residue is uniquely routable
- the next lawful queue recommendation is already uniquely supported
- closeout, version review, or routing writes are the only legal next step
- the system merely wants reassurance before continuing

The following should be treated as forbidden default questions:

- `which queue should we do next?`
- `should this residue continue?`
- `should we close out now?`
- `should this stay in the same family?`

If the rules and written evidence already yield a unique result, Blueprint must continue automatically.

## 13. Workflow Spec Changes Required

`docs/blueprints/blueprint-workflow-spec.md` should be updated to codify:

1. queue execution completion is not equivalent to topic closure
2. queue closeout must produce closure judgement before topic closure can be declared
3. same-family residue should be routed internally by default
4. version plans own version-level residue routing truth after queue closeout
5. human confirmation is forbidden when the next closure-chain step is unique
6. queue closeout must classify residue as:
   - `same-family`
   - `cross-family`
   - `accepted-residue`
   - `none`

## 14. Template Changes Required

### 14.1 Execution Queue Template

`docs/blueprints/templates/execution-queue-template.md` should gain the queue-level closure judgement fields:

- `execution_closeout_status`
- `topic_closure_status`
- `closure_basis`
- `residue_remaining`
- `residue_family`
- `residue_routing_status`
- `next_family_candidate`
- `auto_continue_eligible`

Its closeout guidance must explicitly prohibit treating execution completion as automatic topic closure.

### 14.2 Version Plan Template

`docs/blueprints/templates/target-plan-template.md` should gain the version-level closure routing fields:

- `closure_review_subject`
- `closure_review_status`
- `residue_candidate_id`
- `residue_candidate_family`
- `routing_basis`
- `next_lawful_queue_recommendation`
- `auto_admission_ready`

The template should also explain that these fields exist to absorb post-closeout residue routing without creating a second resume chain.

## 15. Lint Changes Required

`tools/lint-blueprints.mjs` should be extended to reject at least:

1. queue docs whose closeout block claims completion without the required closure-judgement fields
2. queue docs where:
   - `topic_closure_status = closed`
   - and `residue_remaining = yes`
3. queue docs where:
   - `residue_family = same-family`
   - but `next_family_candidate = none`
4. queue docs where:
   - `auto_continue_eligible = true`
   - but no next-family continuation is named
5. version plans that carry closure routing without the full routing field set
6. version plans where:
   - `residue_candidate_family = same-family`
   - but `next_lawful_queue_recommendation = none`
7. version plans where:
   - `auto_admission_ready = true`
   - but no structured residue candidate or recommendation exists
8. queue or version docs that contradict themselves by claiming both closure and still-blocking same-family residue

Lint should remain structural where possible, but these contradictions are low-cost and must be fail-closed.

## 16. Test Changes Required

Blueprint governance tests should cover:

1. valid queue closeout structures that distinguish execution completion from topic closure
2. rejection of queue closeout docs that claim `closed` while residue still remains
3. rejection of same-family residue docs that omit the next continuation
4. valid version-plan routing shapes for same-family residue continuation
5. rejection of version-plan routing that claims auto-continuation readiness without a recommendation
6. rejection of documents that silently collapse `done` into `closed`

Tests should prefer fixture-backed contradictions rather than brittle string-only checks.

## 17. Remaining Governance Debt

Static lint cannot fully prove conversation behavior.

After this design lands, the remaining higher-order governance debt should explicitly include:

1. detecting sessions that still ask humans to choose the next queue when same-family routing is already unique
2. detecting queue closeout that stops at prose residue discussion without version-level routing writes
3. detecting sessions that still treat governance completion as proof of implementation closure
4. detecting auto-routable same-family residue that still falls back into open-ended human queue selection

Those are next-stage automation goals, not blockers for this design.

## 18. Migration Order

This design should land in this order:

1. update `docs/blueprints/blueprint-workflow-spec.md`
2. update the relevant Blueprint templates
3. extend Blueprint lint for closure-judgement and residue-routing contradictions
4. extend Blueprint governance tests
5. minimally synchronize current live Blueprint docs only where the new rules require structural fields
6. mirror the change in `docs/change-log.md`

This preserves the current live truth chain while upgrading closure-oriented governance.

## 19. Acceptance Criteria

This design is successful only when:

- Blueprint can record queue execution completion without pretending the topic is already closed
- queue docs structurally distinguish real topic closure from open residue
- same-family residue no longer defaults back to human prose routing
- version plans can record the next lawful same-family continuation as structured truth
- humans are asked only when multiple lawful continuations remain genuinely unresolved
- Blueprint's notion of success moves closer to actual code-state closure rather than governance-event completion alone
