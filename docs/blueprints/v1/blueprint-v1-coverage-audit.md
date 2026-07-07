# Blueprint v1 Coverage Audit

## Intent

This audit separates:

- what the current Blueprint already does well enough to preserve
- what should be removed or downgraded in v1
- what v1 still lacks and must add

## Keep

| Current Function | Why It Stays | V1 Form |
| --- | --- | --- |
| Canonical resume entry | The repo still needs one restart path after interruption. | `project-progress -> blueprint -> target -> execution queue` |
| Single-writer live truth | Prevents state drift across docs. | Keep, but with fewer owners and fewer fields |
| Single active execution slot | Still the right default for this repo's execution style. | Keep as a hard invariant |
| Target-level scope and acceptance boundary | The system still needs a version-level contract. | Move into one live `target` doc |
| Queue-level executable work container | The system still needs a bounded execution container. | Keep as `execution queue` |
| Candidate routing before execution | New work still needs to be staged before activation. | Keep, but simplify into `candidate_queues` |
| Fail-closed bias | Prevents direct implementation drift. | Keep, but express it through candidate + execution slot rules |
| Historical vs live separation | Prevents closed prose from impersonating current truth. | Keep |
| Lint-based static consistency checks | Still the cheapest governance enforcement layer. | Keep and retarget to v1 fields |

## Remove Or Downgrade

| Current Function | Why It Should Shrink | V1 Disposition |
| --- | --- | --- |
| Target spec + target plan split | Two target-level docs create duplicated semantics and sync work. | Collapse into one live `target` owner |
| Thick admission workflow fields | `review_subject_*`, `proposed_queue_id`, `review_basis`, `admission_status`, and related prose are too heavy for routine intake. | Replace with lighter candidate records inside target |
| Separate classification rule layer as a thick spec | Routing is needed, but a full secondary control spec is too heavy. | Downgrade to Blueprint rule references plus target-local candidate rules |
| `next_decision` plus `next_action` | Dual next-step fields create avoidable drift. | Prefer one decisive next-step semantic in v1 live truth |
| Thick blocked state model | The old blocked model stops flow too early and adds dead-end prose. | Replace with reschedule, candidate return, target absorption, or transition queue |
| Queue promotion ledger prose | Useful historically, noisy as live truth. | Retire as live truth; keep only minimal candidate pool state |
| Candidate recovery ledger prose | Useful for history, too heavy as target live burden. | Replace with lightweight candidate metadata |
| User-facing questions about governance internals | Humans should not be asked to operate Blueprint mechanics. | Remove |
| Repeated optional change-log mirror language | Historical mirroring is not part of the minimal execution model. | Downgrade out of core v1 behavior |
| Thick task governance blocks | Tasks carry too much authoring overhead today. | Replace with minimal executable task semantics |

## Add Or Upgrade

| Missing Or Weak Capability | Why V1 Needs It | V1 Form |
| --- | --- | --- |
| Automatic queue continuation | Current spec requires it, but the workflow does not truly execute it. | Execution engine behavior anchored by target + execution queue truth |
| Prepared candidate state | Current Blueprint has candidates but no explicit ready-to-activate intermediate stage. | `candidate -> prepared -> active` |
| Transition queue model | The current system can describe a gap, but does not formalize one unique bridge queue. | One optional `transition_queue` bound to explicit candidates |
| Artifact-driven transition creation | Current transition reasoning is mostly prose. | `artifact_rules` in target formally justify transition queue creation |
| Queue completion visibility plus non-stop continuity | The current model can close a queue but does not center "done yet continue". | Explicit v1 completion + auto-continue rule |
| Human-question boundary in plain language | Current docs discuss this, but not in the exact v1 form required. | Natural-language-only question rule |
| Minimal templates for candidate and transition queue | Current template set only covers the old thick queue model. | Dedicated v1 queue variants |
| Migration map from old owners to v1 owners | Needed to migrate gradually without confusion. | Formal mapping document |

## Not Covered Yet

The following are intentionally not solved by this first v1 documentation batch:

1. live document migration of the current repo state
2. lint rule upgrades for v1 fields
3. execution engine implementation
4. scenario validation against migrated live truth

Those items belong to the next implementation phase after these v1 documents are accepted.
