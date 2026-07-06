# AI Classification Rule Layer Spec

## Control Block

- layer_id: `classification-layer.rpg-tg`
- status: `active`
- applies_to_blueprint: `blueprint.rpg-tg`
- compatible_with:
  - `project-progress -> blueprint -> target -> queue -> task -> execution artifacts`
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
- escalation_required_for:
  - `queue-candidate`
  - `future-target-candidate`
  - `uncertain-needs-review`
- human_role_mode: `rules_define_and_review_conflicts_only`

## Human Context

### Goal

Add a classification layer on top of the AI-first Blueprint system so that AI can classify new work items before they are promoted into:

- current target work
- future target work
- queue candidate work
- content or asset pipeline work
- uncertain work requiring human review

This layer exists to reduce human burden in large-content projects.

### Core Principle

When a new issue, request, residue item, content addition, asset task, or framework need appears, AI must not immediately guess that it belongs to the current active queue.

AI must first classify it through an explicit rule layer.

### Classification Outputs

Every new item must be classified into exactly one of these buckets:

- `current-target-item`
- `future-target-candidate`
- `queue-candidate`
- `content-pipeline-item`
- `asset-pipeline-item`
- `uncertain-needs-review`
- `historical-residue`
- `out-of-scope`

If AI cannot classify with enough confidence, it must use:

- `uncertain-needs-review`

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

### Classification Record

For each classified item, AI should emit:

```md
## Classification Record

- item_id: `item.name`
- item_type: `code|content|asset|ui|framework|runtime|authoring`
- classify_as: `queue-candidate`
- confidence: `high|medium|low`
- matched_rules:
  - `R2`
- why:
  - `requires framework capability not currently owned by existing queue`
- escalate_if:
  - `changes current target scope`
  - `needs new queue promotion`
- reject_if:
  - `can be completed inside existing pipeline without framework change`
```

### Confidence Rule

AI must always provide confidence:

- `high`
- `medium`
- `low`

If confidence is `low`, the item automatically becomes:

- `uncertain-needs-review`

unless a stronger written override rule explicitly allows automatic classification.

### Escalation Rule

Classification alone does not automatically create a queue or target.

The classification layer only answers:

- what kind of item this is
- which governance layer it most likely belongs to

If an item is classified as:

- `queue-candidate`
- `future-target-candidate`
- `uncertain-needs-review`

AI must not automatically begin implementation.

### Content And Asset Handling Rule

#### Content Pipeline Item

Use this when:

- work fits existing framework
- work uses existing schema
- work uses existing runtime path
- work does not require new queue or new target
- work is primarily data or content authoring

Examples:

- new playable content under existing scaffold
- filling existing JSON/config content
- new dialogue/content pack entries under supported path

#### Asset Pipeline Item

Use this when:

- work is asset replacement or asset addition
- no framework behavior changes are required
- naming/path rules already exist
- the task is primarily art or UI resource work

Examples:

- replacing portraits
- replacing UI images
- adding art assets under an existing asset contract

### Queue-Candidate Rule

Use `queue-candidate` only when the work requires:

- a new bounded execution topic
- a new framework capability
- a new owner-line closure effort
- a new acceptance story different from current queue scope

This classification must not be used for ordinary content or asset fill-in.

### Current Target Item Rule

Use `current-target-item` only when:

- the work affects completion of the current version target
- the work fits the current target boundary
- the work does not require redefining the target itself

If the work would redefine the version goal, it requires target review instead of normal current-target execution.

### Future Target Candidate Rule

Use `future-target-candidate` when:

- the work has real value
- but it is not required for the current version's acceptance
- and forcing it into the current target would widen scope improperly

### Historical Residue Rule

Use `historical-residue` when:

- the issue reflects accepted old structure
- it does not block the current target
- it should remain recorded but not reactivated automatically

### Uncertain Rule

Use `uncertain-needs-review` when:

- confidence is low
- multiple rules conflict
- evidence is incomplete
- promotion impact is large
- the item may change target boundary

This is a legal and expected result.

### Integration Points

- Blueprint may contain classification rule references and default fallback behavior.
- Target may contain target-specific classification overrides.
- Queue may declare which classified item kinds are allowed inside it.
- Task execution must reject items whose classification is incompatible with queue scope.

### Anti-Bloat Rule

The classification layer must reduce governance overhead, not increase it.

It must not require:

- a full new queue for every content item
- human approval for every asset task
- rewriting Blueprint for every classified item

Its purpose is triage and routing, not bureaucracy.

### Success Condition

The classification layer is successful only when:

- AI can classify most new items automatically
- humans no longer need to manually boundary-classify every new issue
- content and asset work can be routed without inflating queue governance
- only uncertain or high-impact items escalate to human review
- current target and queue scope become easier to protect in a large-content project
