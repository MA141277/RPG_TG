# AI Classification Rule Layer Spec

## Control Block

- layer_id: `classification-layer.rpg-tg`
- status: `active`
- applies_to_blueprint: `blueprint.rpg-tg`
- canonical_resume_chain:
  - `project-progress`
  - `blueprint`
  - `target-plan`
  - `active-queue`
  - `active-task`
- default_low_confidence_classification: `uncertain-needs-review`
- classification_outputs:
  - `current-target-item`
  - `future-target-candidate`
  - `queue-candidate`
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `uncertain-needs-review`
  - `historical-residue`
  - `out-of-scope`
- escalation_types:
  - `governance_escalation`
  - `human_escalation`

## Human Context

### Goal

- `Classify new work before queue admission, target widening, or pipeline routing.`
- `Protect the single-writer Blueprint model by keeping routing separate from execution truth.`

### Placement In The Governance Stack

- `Classification is a routing layer, not a live execution controller.`
- `Current execution truth still comes only from project-progress -> blueprint -> version plan -> active queue -> active task.`
- `Classification may recommend queue admission, but it cannot create an active queue by itself.`
- `User scope approval may narrow the candidate boundary, but it cannot create admission truth by itself.`

### Core Rules

1. `Classify first, route second, promote later.`
2. `Do not infer current execution truth from classification history.`
3. `Do not use change-log, old docs/superpowers/**, or closed queue prose as classification authority unless they are cited as historical evidence only.`
4. `If active_queue = none, classification returns control to the current version plan for promotion-review or idle-open handling.`
5. `Low confidence always falls back to uncertain-needs-review unless a stronger written override exists.`
6. `If classification concludes queue-candidate, fresh implementation must stop until target-plan admission truth and the admitted queue doc both exist.`
7. `Conversation-only classification that would change active truth is invalid until the version plan is synchronized.`
8. `A previously recorded queue-candidate must resume from its admission record by default unless new material evidence invalidates the old basis.`
9. `If another queue is already active under single-active-task mode, classification may record a fresh candidate but must not activate a second queue.`

### Classification Outputs

- `current-target-item`
  - `Fits the current version boundary and may affect current-version acceptance, but does not automatically start execution.`
- `queue-candidate`
  - `Requires a new bounded execution topic, a new shared capability, a new owner-line closure, or a new acceptance story outside the current queue scope.`
- `content-pipeline-item`
  - `Fits existing schema and runtime path and does not require new governance structure.`
- `asset-pipeline-item`
  - `Fits existing naming/path/contract rules and does not require behavior change.`
- `future-target-candidate`
  - `Valuable, but not required for the current version acceptance.`
- `historical-residue`
  - `Accepted older structure that should remain recorded but must not silently reactivate execution.`
- `uncertain-needs-review`
  - `Evidence is incomplete, rules conflict, or impact is too large to auto-route safely.`
- `out-of-scope`
  - `Outside current repository governance.`

### Classification Rules

- rule_id: `R1`
  condition:
    - `affects_current_target_acceptance`
    - `fits_current_target_boundary`
    - `does_not_redefine_target_goal`
  classify_as: `current-target-item`

- rule_id: `R2`
  condition:
    - `requires_new_framework_capability`
    - `or_requires_new_owner_line_closure`
    - `or_requires_new_acceptance_story_outside_existing_queue_scope`
  classify_as: `queue-candidate`

- rule_id: `R3`
  condition:
    - `only_replaces_assets_under_existing_contract`
    - `no_framework_behavior_change_required`
  classify_as: `asset-pipeline-item`

- rule_id: `R4`
  condition:
    - `fills_content_or_config_under_existing_supported_schema`
    - `uses_existing_runtime_path`
    - `does_not_require_new_queue_or_target`
  classify_as: `content-pipeline-item`

- rule_id: `R5`
  condition:
    - `valuable_but_not_required_for_current_target_acceptance`
    - `forcing_it_into_current_target_widens_scope`
  classify_as: `future-target-candidate`

- rule_id: `R6`
  condition:
    - `reflects_accepted_old_structure`
    - `does_not_block_current_target`
  classify_as: `historical-residue`

- rule_id: `R7`
  condition:
    - `insufficient_evidence`
    - `or_multiple_rules_conflict`
    - `or_promotion_impact_is_large`
  classify_as: `uncertain-needs-review`

- rule_id: `R8`
  condition:
    - `outside_current_repository_governance_scope`
  classify_as: `out-of-scope`

### Escalation Rules

- `queue-candidate`
  - `governance_escalation`
  - `return control to target-plan promotion-review`
  - `no automatic human question`
- `future-target-candidate`
  - `governance_escalation`
  - `no automatic human question`
- `uncertain-needs-review`
  - `record and stop without asking if active truth would not change`
  - `human_escalation only when active truth would change and multiple mutually exclusive legal branches exist`

### Classification Record

Use this structure when classification needs to be recorded explicitly:

```md
## Classification Record

- item_id: `item.name`
- item_type: `code|content|asset|ui|framework|runtime|authoring|governance`
- classify_as: `queue-candidate`
- confidence: `high|medium|low`
- matched_rules:
  - `R2`
- escalation_type: `governance_escalation | human_escalation | none`
- why:
  - `requires framework capability not currently owned by an active queue`
- escalate_if:
  - `changes current version scope`
  - `needs queue admission`
- reject_if:
  - `can be completed inside an existing pipeline or current queue without widening scope`
```

### Version-Plan Review Sync

If a classification result would change active truth, it must be synchronized into the version plan before implementation continues.

Minimum required version-plan fields:

- `review_subject_id`
- `review_subject_classification`
- `proposed_queue_id`
- `review_basis`
- `admission_status`

Required behavior:

1. `queue-candidate + active_queue = none` must enter version-level admission review before implementation.
2. `scope approved by user` must be recorded only as boundary approval, not as admission truth.
3. `admission_status = admitted` requires the queue doc to exist before code implementation starts.
4. `rejected / deferred / blocked` outcomes must be written into version-plan truth, not left in prose-only replies.

### Queue-Candidate Startup Contract

For a fresh queue-candidate, the required startup order is:

1. `read the current truth chain first`
2. `check whether an active queue already exists`
3. `test whether the new item can be absorbed into the active queue without widening queue scope`
4. `classify the item`
5. `if the result is queue-candidate, return to target-plan admission review`
6. `sync version-plan review fields before any queue doc is activated`
7. `activate the queue only after version-plan review truth exists`
8. `start implementation only after the queue doc exposes active queue truth and a live active task`

Hard implications:

- `queue-candidate` routes into admission, not implementation
- `queue-candidate + active_queue = none` cannot jump directly into code work
- `queue-candidate + active_queue != none` cannot open a parallel active queue when Blueprint parallelism is disabled
- `user scope approval` may narrow the review boundary but cannot create queue admission truth

### Candidate Recovery Rule

If a queue-candidate was already structurally recorded, later sessions must resume from that record by default.

Only perform a full recheck when:

- new material evidence disproves the old classification
- new material evidence disproves the old review basis
- the current active queue can now absorb the item without widening scope
- the item no longer belongs to the current version

Otherwise:

- reuse the recorded `review_subject_id`
- reuse the recorded `review_subject_classification`
- reuse the recorded `proposed_queue_id`
- reuse the recorded `review_basis`
- continue from the latest written disposition instead of restarting from scratch

### Integration Points

- `project-progress` may point to the classification layer, but may not own classification history as live truth.
- `blueprint` may point to the authoritative classification rule file.
- `version spec` may define version-specific overrides.
- `version plan` decides whether a classified item becomes a promoted queue.
- `queue docs` declare which classifications are allowed inside them.
- `task execution` must stop if a new item is classified incompatibly with queue scope.
- `task execution` must also stop if a fresh item becomes `queue-candidate` before admission truth is written.

### Success Condition

This layer is successful only when:

- `most new items can be routed without reopening live governance truth upstream`
- `queue admission always remains a target-plan decision`
- `scope approval never masquerades as queue admission`
- `queue-candidate` defaults to governance escalation rather than human escalation
- `open + no active queue` remains legal and non-ambiguous
- `historical residue stays recorded without pretending to be active work`

### Blueprint Skill Routing Rules

<!-- blueprint-skill:routing-rules:start -->
- classify first, route second, promote later
- current execution truth still comes only from `project-progress -> blueprint -> version plan -> active queue -> active task`
- if classification concludes `queue-candidate`, return control to version-plan admission review before implementation
- route content or asset items through existing pipelines unless written evidence requires new governance structure
- low-confidence routing falls back to `uncertain-needs-review` unless a stronger written override exists
<!-- blueprint-skill:routing-rules:end -->
