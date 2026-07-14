# 变更记录

用于持续记录项目结构、公共契约、功能能力和开发规则的变化。

`docs/change-log.md` 的正式定位是“历史记录 + 人类可读摘要”。
它不是当前 Blueprint / legacy superpowers 治理的 live execution truth，不作为 resume entry、promotion gate、closeout gate 或固定同步门。

## 2026-07-10 Script Editor Freeze Scope Clarification

## 2026-07-13 Script Editor Implementation Version Opening

## 2026-07-14 Script Editor PRD Alignment Version Closeout

### Changed
- 更新 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，将 `queue.script-editor-prd-workbench-ui-visual-alignment` 从 active 收口为 `done`，记录其 creator-first workbench visual convergence 已完成、无剩余 same-version residue，且仓库同步批次已由提交 `570bf9a5` 推送到 `origin/mod-first-dev`。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)，把 `target.script-editor-prd-alignment` 从 `open` 正式切换为 `done`，补齐 version closeout judgement、显式人工关闭确认、未来路由，以及最后一个 visual queue 的关闭历史真值。
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，移除旧 PRD alignment active queue 入口，把该 version 改写为关闭历史证据。

### Impact
- `target.script-editor-prd-alignment` 已正式关闭；在当前 Blueprint 下不再允许继续提升任何 same-version PRD 对齐 queue。
- 当前 script-editor 的 PRD 对齐成果现在完整沉淀为历史基线，后续工作必须从 successor version 推进，而不是回到已关闭的 PRD alignment version 内继续补丁式扩张。

## 2026-07-14 Script Editor Runtime Pack Unification Version Opening

### Changed
- 新增 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，将 `target.script-editor-runtime-pack-unification` 正式写成新的 live version plan，并记录 6 条候选 queue、首个 lawful recommendation `queue.script-editor-runtime-family-contract-alignment`，以及当前仓内仍存在的 admission basis：`compatibilityImport` 残留、`activities` 仍走 bounded compatibility path、`basePackId` 仍未形成显式继承契约、`src/content/pack-content-access.ts` 仍保留默认包直接导入。
- 更新 [docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md)，把它从“successor-candidate draft”改写为已于 `2026-07-14` 通过 Blueprint 指针提升的 live successor version truth。
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 live 入口切换到 `target.script-editor-runtime-pack-unification`，并明确当前没有 active queue、下一步应从新 version plan 发起 admission review。

### Impact
- Blueprint 当前 live version 已从“PRD 对齐”切换为“runtime pack 最终统一”；resume 链现在应从 `project-progress -> blueprint -> 2026-07-14 runtime-pack-unification version plan` 继续，而不是回到旧 queue。
- 后续 script-editor 工作的合法起点不再是 UI/PRD 细节补丁，而是 scenario-pack family contract、runtime-pack export、basePackId 继承、fixed-pack consumer deprivileging、compatibility retirement 这些收口型架构队列。

## 2026-07-14 Script Editor Runtime Family Contract Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md)，将 `queue.script-editor-runtime-family-contract-alignment` 写成当前 live queue truth，并把边界明确收敛在“mandatory runtime families / inheritable families / unsupported families / fail-closed obligations”的最终契约冻结，不允许顺手扩张到 export 实现、consumer rewiring 或 authoring 结构收口。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 `target.script-editor-runtime-pack-unification` 从 version-level `promotion-review` 切回 `active-execution`，并把当前入口同步到新 admitted queue。
- 同步 version plan 的 Queue Promotion Ledger、Candidate Classification Record、候选恢复说明与历史提升记录，使首个 queue 明确呈现为 `active` / `admitted + queue active`，并将“无 active queue”限定为 admission 前的历史启动状态。

### Impact
- Blueprint 当前不再停在 successor version 的空 version-review 状态；当前 live entry 已经收敛到 `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile`。
- 后续 script-editor runtime-pack 统一工作必须先冻结最终 family contract，再继续 authoring convergence、export unification、base-pack inheritance、fixed-pack deprivileging、compatibility retirement 这些后续 queue。

## 2026-07-14 Script Editor Runtime Family Contract Baseline Reconcile

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md)，将 `task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile` 标记为 completed，并把当前 active task 推进到 `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze`。
- 记录 baseline evidence：`activities` 仍作为 compatibility residue 保留、`compatibilityImport.unresolvedFamilies` 仍在 export 阶段 fail closed、`basePackId` 仍主要是 metadata passthrough、`src/content/pack-content-access.ts` 仍存在固定 builtin scenario-pack 直接导入，因此下一步仍应写 explicit runtime-family contract，而不是跳入 export implementation 或 consumer deprivileging。

### Impact
- 当前 runtime-family-contract queue 已正式越过 baseline reconcile，接下来只能在 bounded contract-writing 范围内冻结 mandatory / inheritable / unsupported family truth 和 fail-closed obligations。
- 后续 authoring convergence、runtime-pack export unification、base-pack inheritance governance、fixed-pack consumer deprivileging、compatibility retirement 仍保持候选队列，不得在当前任务内顺手实现。

## 2026-07-14 Script Editor Runtime Family Contract Freeze

### Changed
- 更新 [docs/scenario-pack-unified-format.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/scenario-pack-unified-format.md)，新增 Runtime Family Contract，明确 mandatory runtime families、explicitly inheritable runtime families、unsupported/transitional families 与 fail-closed obligations。
- 更新 [docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md)，把 unsupported/transitional families 与 fail-closed obligations 写入 active version spec，供后续 authoring/export/inheritance/consumer/compatibility 队列消费。
- 更新 [docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md)，将 `task.script-editor-runtime-family-contract-alignment.final-runtime-family-contract-freeze` 标记为 completed，并把 active task 推进到 `queue-closeout-and-handoff`。

### Impact
- 当前队列已经落下最终 family contract 文档真值；后续实现队列不得再用 silent empty arrays、hidden builtin defaults、compatibilityImport 或 private lowering dialect 绕开该契约。
- 剩余工作转入 queue closeout/handoff：验证契约、分类仍存在的 residue，并把后续候选路由交回 version review。

## 2026-07-14 Script Editor Runtime Family Contract Queue Closeout

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-contract-alignment-queue.md)，将 `queue.script-editor-runtime-family-contract-alignment` 从 active 收口为 `done`，记录 bounded contract-definition slice 已验证并关闭。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live version 从 active-execution 切回 promotion-review，清空 active_queue，并把 downstream recommendation 指向 `queue.script-editor-runtime-family-authoring-convergence`。

### Impact
- 当前 Blueprint 已无 active queue；后续必须从 runtime-pack-unification version plan 做下一条 downstream queue admission review，而不是继续在已关闭的 runtime-family-contract queue 内扩张。
- 剩余 residue 被分类为 cross-family：authoring convergence、export unification、base-pack inheritance、fixed-pack consumer deprivileging、compatibility retirement 仍按候选队列顺序推进。

## 2026-07-14 Script Editor Runtime Family Authoring Convergence Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md)，将 `queue.script-editor-runtime-family-authoring-convergence` 写成当前 live queue truth，并把范围收敛在作者面并行结构退场与 runtime 归一之前的最小 lawful 收口，不允许顺手扩张到 export unification、base-pack inheritance 或 consumer deprivileging。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live entry 从已关闭的 runtime-family-contract queue 切换到 authoring-convergence queue，并记录当前 active task。
- 补充 version plan 的 admission review record，明确 fresh evidence 来自 `src/domain/script-editor-project.ts`、`src/application/script-editor/runtime-pack-import.ts`、`src/application/script-editor/runtime-pack-export.ts`、`src/application/script-editor/workspace-shell.ts` 与 `src/ui/main-ui/main-ui-flow.js` 中仍然并存的 authoring-only 和 runtime family surface。

### Impact
- Blueprint 当前重新进入 active execution，但控制权已经从 contract freeze 转到 authoring convergence；后续代码/文档动作必须先收口作者面并行结构，再谈 export unification。
- 当前 active queue 文档已明确下一步任务序列，避免把 authoring convergence 误当成 exporter 或 consumer 的实现 queue。

## 2026-07-14 Script Editor Runtime Family Authoring Baseline Reconcile

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md)，将 `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile` 标记为 completed，并把当前 active task 推进到 `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map`。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录当前 queue 进展：作者面并行结构仍然存在，且该队列仍比 export unification、base-pack inheritance、fixed-pack consumer deprivileging、compatibility retirement 更窄。

### Impact
- 当前 authoring-convergence queue 已完成 baseline reconcile；下一步只能写 authoring-only parallel structure 的退场映射，不能提前进入导出实现或消费者改线。

## 2026-07-14 Script Editor Runtime Family Authoring Retirement Map

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md)，新增 Authoring Parallel Structure Retirement Map，明确 `people/cities/buildings/events/quests/textEntries` 可按 runtime-owned contract 收口，`dialogues/storyNodes/minigames` 必须交给后续 export unification 下沉，`conditionGroups/effectBundles` 只能作为 compiler input，`compatibilityImport.unresolvedFamilies` 必须从日常 authoring truth 退回迁移证据。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录 retirement-map task 完成，并把当前 active task 推进到 `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff`。

### Impact
- 当前 queue 已有明确的 authoring 结构退场图；剩余工作是 closeout/handoff，把仍需后续实现的 export、inheritance、consumer、compatibility residue 路由回版本级 review。

## 2026-07-14 Script Editor Runtime Family Authoring Queue Closeout

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md)，将 `queue.script-editor-runtime-family-authoring-convergence` 从 active 收口为 `done`，记录 bounded authoring-convergence slice 已完成并 verified。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live version 从 active-execution 切回 promotion-review，清空 active_queue，并把 downstream recommendation 指向 `queue.script-editor-runtime-pack-export-unification`。

### Impact
- 当前 Blueprint 再次无 active queue；后续必须从 runtime-pack-unification version plan 做 export-unification admission review，而不是继续在已关闭的 authoring-convergence queue 内扩张。
- 剩余 residue 被分类为 cross-family：export unification、base-pack inheritance governance、fixed-pack consumer deprivileging、compatibility retirement 仍按后续候选队列推进。

## 2026-07-14 Script Editor Runtime Pack Export Unification Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md)，将 `queue.script-editor-runtime-pack-export-unification` 写成当前 live queue truth，并把范围收敛在 formal startup-consumable scenario-pack export contract，不允许扩张进 basePackId inheritance、fixed-pack consumer deprivileging 或 compatibility retirement。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live entry 从 version-level promotion-review 切回 active-execution，并记录当前 active task。
- 记录 fresh evidence：`src/application/script-editor/runtime-pack-export.ts` 当前仍写空 `scenes.json`、未在 manifest 中输出 `activities`、对 `dialogues/minigames/storyNodes` fail closed，并且仍会因 `compatibilityImport.unresolvedFamilies` 阻塞 export；而 startup loader 已能消费 manifest-driven scenario-pack。

### Impact
- Blueprint 当前重新进入 active execution，但控制权已经从 authoring convergence 转到 runtime-pack export unification。
- 后续动作必须先冻结 formal startup-consumable export contract，再决定是否进入实现或 closeout；不能用空 scenes、缺失 activities 或 compatibility residue 作为最终 runtime truth。

## 2026-07-14 Script Editor Runtime Pack Export Baseline Reconcile

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md)，将 `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile` 标记为 completed，并把当前 active task 推进到 `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map`。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录当前 exporter 仍是 bounded partial seam：空 `scenes.json`、缺少 `activities` manifest 输出、对 `dialogues/minigames/storyNodes` fail closed，并且仍受 `compatibilityImport.unresolvedFamilies` 阻塞。

### Impact
- 当前 export-unification queue 已完成 baseline reconcile；下一步只能写 startup-consumable export contract map，不能提前扩张到 basePackId inheritance、consumer deprivileging 或 compatibility retirement。

## 2026-07-14 Script Editor Runtime Pack Export Contract Map

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md)，新增 Startup-Consumable Export Contract Map，明确 `scenarioProfile/characters/cities/houses/events/scenes/activities/tasks/textEntries` 的正式导出义务、当前 gap、queue decision，以及 export fail-closed rules。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录 export contract map 完成，并把当前 active task 推进到 `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff`。

### Impact
- 当前 queue 已有正式 startup-consumable export 契约图；后续实现不得再用空 `scenes`、缺失 `activities`、private export dialect 或 `compatibilityImport` 残留来宣称 runtime-pack export 成功。
- basePackId family overlay、fixed-pack consumer deprivileging、compatibility retirement 仍明确属于后续队列，不在当前 queue 内顺手实现。

## 2026-07-14 Script Editor Runtime Pack Export Queue Closeout

### Changed
- 更新 [docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md)，将 `queue.script-editor-runtime-pack-export-unification` 从 active 收口为 `done`，记录 bounded export-contract slice 已完成并 verified。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live version 从 active-execution 切回 promotion-review，清空 active_queue，并把 downstream recommendation 指向 `queue.script-editor-base-pack-inheritance-governance`。

### Impact
- 当前 Blueprint 已无 active queue；后续必须从 runtime-pack-unification version plan 做 base-pack inheritance governance admission review，而不是继续在已关闭的 export-unification queue 内扩张。
- 剩余 residue 被分类为 cross-family：base-pack inheritance governance、fixed-pack consumer deprivileging、compatibility retirement 仍按后续候选队列推进。

## 2026-07-14 Script Editor Base Pack Inheritance Governance Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md)，将 `queue.script-editor-base-pack-inheritance-governance` 写成当前 live queue truth，并把范围收敛在 `basePackId` 的 family-level overlay 与 fail-closed 继承契约，不允许扩张到 fixed-pack consumer deprivileging 或 compatibility retirement。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live entry 从 version-level promotion-review 切回 active-execution，并记录当前 active task。
- 更新 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，同步 active version registry 备注，避免继续把已关闭的 runtime-family-contract queue 描述成当前执行队列。

### Impact
- Blueprint 当前重新进入 active execution，但控制权已经从 export contract 转到 base-pack inheritance governance。
- 后续动作必须先写明确的 family overlay contract，不能把当前 builtin fallback、空输出或 metadata passthrough 当成正式继承语义。

## 2026-07-14 Script Editor Base Pack Inheritance Baseline Reconcile

### Changed
- 更新 [docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md)，将 `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile` 标记为 completed，并把当前 active task 推进到 `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map`。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录当前 baseline 证据：`runtime-pack-import.ts` 只保存 `rawPack.basePackId` / `manifest.basePackId` 元数据，`runtime-pack-export.ts` 只通过 `pickOptionalPackMetadata` 透传 `storyPack.basePackId`，尚未解析 mandatory 或 explicitly inheritable runtime families。

### Impact
- 当前 base-pack-inheritance queue 已完成 baseline reconcile；下一步只能写 family-level overlay contract map，不能提前进入 fixed-pack consumer rewiring 或 compatibility retirement。

## 2026-07-14 Script Editor Base Pack Inheritance Contract Map

### Changed
- 更新 [docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md)，新增 Family Overlay Contract Map，明确 mandatory runtime families 与 explicitly inheritable runtime families 的 overlay rule、inheritance source 与 failure rule。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录 family overlay contract map 完成，并把当前 active task 推进到 `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff`。

### Impact
- 当前 queue 已有正式 basePackId family overlay 契约图；后续实现不得再把 metadata passthrough、builtin hard import、空数组、hidden default 或 compatibility residue 当成 lawful inheritance resolution。
- fixed-pack consumer deprivileging 与 compatibility retirement 仍属于后续队列，不在当前 queue 内顺手实现。

## 2026-07-14 Script Editor Base Pack Inheritance Queue Closeout

### Changed
- 更新 [docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md)，将 `queue.script-editor-base-pack-inheritance-governance` 从 active 收口为 `done`，记录 bounded inheritance-governance slice 已完成并 verified。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live version 从 active-execution 切回 promotion-review，清空 active_queue，并把 downstream recommendation 指向 `queue.script-editor-fixed-pack-consumer-deprivileging`。

### Impact
- 当前 Blueprint 已无 active queue；后续必须从 runtime-pack-unification version plan 做 fixed-pack consumer deprivileging admission review，而不是继续在已关闭的 inheritance queue 内扩张。
- 剩余 residue 被分类为 cross-family：fixed-pack consumer deprivileging 与 compatibility retirement 仍按后续候选队列推进。

## 2026-07-14 Script Editor Fixed Pack Consumer Deprivileging Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md)，将 `queue.script-editor-fixed-pack-consumer-deprivileging` 写成当前 live queue truth，并把范围收敛在 covered consumers 从 fixed zhuyuanzhang/default-pack imports 转向 active scenario-pack content resolution。
- 更新 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，将 live entry 从 version-level promotion-review 切回 active-execution，并记录当前 active task。
- 记录 fresh evidence：`src/content/pack-content-access.ts` 仍直接导入 `zhuyuanzhang` 的 activities/events/scenes/text entries/home-house/keep-house JSON，`temple-house-active-content.ts`、`home-house-content.ts`、`keep-house-content.ts` 仍通过 default-pack facade 消费这些内容。

### Impact
- Blueprint 当前重新进入 active execution，但控制权已经从 base-pack inheritance governance 转到 fixed-pack consumer deprivileging。
- 后续动作必须先确认 covered consumer 边界并写 active-content-only route contract，不能把 hard-imported builtin JSON 当成正式 runtime-pack 继承或消费路径。

## 2026-07-14 Script Editor Fixed Pack Consumer Baseline Reconcile

### Changed
- 更新 [docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md)，将 `task.script-editor-fixed-pack-consumer-deprivileging.boundary-baseline-reconcile` 标记为 completed，并把当前 active task 推进到 `task.script-editor-fixed-pack-consumer-deprivileging.consumer-route-contract-map`。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录当前 baseline 证据：`src/content/pack-content-access.ts` 仍直接导入 `zhuyuanzhang` 的 activities/events/scenes/text entries/home-house/keep-house JSON，`temple-house-active-content.ts`、`home-house-content.ts`、`keep-house-content.ts` 仍通过 default-pack facade 消费这些内容。

### Impact
- 当前 fixed-pack-consumer queue 已完成 baseline reconcile；下一步只能写 active-content-only consumer route contract map，不能提前扩张到 compatibility retirement 或 broad startup policy。

## 2026-07-14 Script Editor Fixed Pack Consumer Route Contract Map

### Changed
- 更新 [docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md)，新增 Consumer Route Contract Map，明确 `src/content/pack-content-access.ts`、`src/application/content/default-pack-content.ts`、`temple-house-active-content.ts`、`home-house-content.ts`、`keep-house-content.ts` 的 active-content-only 路由义务和可保留基线。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md)，记录 consumer route contract map 完成，并把当前 active task 推进到 `task.script-editor-fixed-pack-consumer-deprivileging.queue-closeout-and-handoff`。

### Impact
- 当前 queue 已有正式 covered consumer route 契约图；后续实现不得再把 fixed zhuyuanzhang JSON imports 或 default-pack facade 作为 covered runtime truth。
- compatibility retirement 仍明确属于后续队列，不在当前 queue 内顺手实现。

## 2026-07-14 Script Editor Fixed Pack Consumer Queue Closeout

### Changed
- 更新 [docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-fixed-pack-consumer-deprivileging-queue.md)，将 `queue.script-editor-fixed-pack-consumer-deprivileging` 从 active 收口为 `done`，记录 bounded consumer-deprivileging slice 已完成并 verified。
- 更新 [docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，将 live version 从 active-execution 切回 promotion-review，清空 active_queue，并把 downstream recommendation 指向 `queue.script-editor-compatibility-boundary-retirement`。

### Impact
- 当前 Blueprint 已无 active queue；后续必须从 runtime-pack-unification version plan 做 compatibility-boundary retirement admission review，而不是继续在已关闭的 fixed-pack-consumer queue 内扩张。
- 剩余 residue 被分类为 cross-family：compatibility-boundary retirement 仍按后续候选队列推进。

## 2026-07-14 Script Editor Person Runtime Attribute Editing Alignment

### Changed
- 更新 [src/application/script-editor/person-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/person-authoring.ts)，让导入人物 JSON 中的 primitive runtime 字段自动并入 `extendedAttributes`，并在属性编辑、删除时把 `age`、`clanId`、`stats.*`、`skills.*` 等路径同步回写到人物记录，避免它们只停留在只读摘要里。
- 更新 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js) 与 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，把人物详情顶部的“当前人物 JSON 属性”区域从只读展示改为可直接 `新增 / 编辑 / 删除` 的属性键值编辑器，并移除下方重复的扩展属性编辑块。
- 继续更新 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/person-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/person-authoring.ts) 与 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)，为人物扩展属性补入创作者可见的 `label`，把导入的 runtime 字段映射成“年龄 / 所属 / 统率 / 武勇 / 智略 / 政务 / 魅力 / 名声”等属性名，并让顶部编辑区只暴露“属性名 + 属性值”，不再直接泄露内部 `key` 路径。
- 继续更新 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/person-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/person-authoring.ts) 与 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)，把 `cityId / houseId / portraitId / portraitVariantId` 从人物扩展属性里提升为固定人物字段，并在“属性”分栏中改成基于当前项目城市、建筑和现有人物立绘/立绘变体的下拉选择。
- 继续更新 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、[src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css) 与 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，把人物 JSON 属性区改成固定宽度的 6 列卡片网格，并将每页显示上限收敛为 18 个卡片（3 行），超出部分通过独立的上一页/下一页分页切换显示。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，补入两类回归：顶部属性区必须暴露现有属性编辑 action，以及导入的 runtime 人物字段必须被吸收到可编辑属性列表并支持值更新/属性删除。
- 更新 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，将这次人物 runtime 属性并入可编辑属性面的实现事实记录到当前 active visual queue，而不把它误记成新的并行队列。

### Impact
- 剧本编辑器中的人物详情现在会直接暴露导入角色卡里的 `age`、`clanId`、`stats.leadership`、`stats.martial`、`stats.intelligence`、`stats.politics`、`stats.charm`、`stats.fame` 等 runtime 字段，且可以在同一块区域内直接改值或删属性。
- 创作者在人物属性编辑区里看到的已经不再是原始 `stats.leadership` 这一类内部路径，而是可编辑的“属性名 + 属性值”形式；内部 `key` 只保留给回写映射使用，不再直接暴露到创作者视图。
- `cityId / houseId / portraitId / portraitVariantId` 不再混在自由扩展属性列表里，而是回到人物固定属性区并以受控下拉框编辑；其中建筑列表会跟随当前城市过滤，立绘变体下拉会优先读取当前人物已携带的 `portraitVariants` 元数据。
- 当人物属性过多时，顶部 JSON 属性区现在不会继续无限向下扩张；它会固定成每行 6 张卡片、每页最多 3 行的分页网格，新增属性时也会自动跳转到最后一页。
- 这次实现仍属于 `queue.script-editor-prd-workbench-ui-visual-alignment` 的同边界 creator-visible field convergence 批次；没有重开已关闭的人物作者面队列，也没有扩张到新的 schema owner。

## 2026-07-13 Script Editor Load Save Queue Admission

## 2026-07-13 Script Editor Export Queue Admission

## 2026-07-13 Script Editor Export Queue Closeout

## 2026-07-13 Script Editor Compatibility Import Queue Closeout

## 2026-07-13 Script Editor UI Shell Queue Closeout

## 2026-07-13 Script Editor Minimal Workflow Queue Closeout

## 2026-07-13 Shared Condition Effect Queue Admission

## 2026-07-13 Shared Condition Effect Queue Closeout

## 2026-07-13 Script Editor Implementation Version Closeout

## 2026-07-13 Script Editor PRD Alignment Version Opening

## 2026-07-13 Script Editor PRD Workspace Queue Admission

## 2026-07-13 Script Editor Project Selection And Responsive Workspace Candidate Recording

### Changed
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)，将“项目选择/管理与当前项目编辑职责拆分、独立剧本列表页、项目继续编辑/删除、删除确认、工作区多宽度适配”记录为 `item.script-editor-prd-project-selection-and-workspace-layout`，并写入新的候选队列 `queue.script-editor-prd-project-selection-and-workspace-layout-alignment`。
- 同步 version plan 的 intake 字段、候选队列清单、候选分类记录与历史记录，明确该需求当前只能以 `candidate-recorded` 形式保留，不能在 `queue.script-editor-prd-workspace-and-navigation-alignment` 仍处于 active 时并行提升。

### Impact
- Blueprint 现在已经把“独立剧本列表页 + 项目管理动作 + 响应式工作台布局”沉淀为正式候选，不会再丢失为会话口头结论。
- 当前 live execution 仍保持不变：执行入口继续停在 `queue.script-editor-prd-workspace-and-navigation-alignment`，后续只有在该 active queue 收口后，才可按版本级 review 决定是否提升这个新候选。

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-workspace-and-navigation-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workspace-and-navigation-alignment-queue.md)，将 `queue.script-editor-prd-workspace-and-navigation-alignment` 写成当前 live queue truth，并明确它只拥有 PRD 4.x 的工作台、中文导航、项目总览与编辑阶段路由，不得扩张进人物或后续对象家族编辑。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 从 version-level `promotion-review` 切回 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- Blueprint 当前不再停在“等待 queue admission review”的空转状态；当前 live entry 已经收敛到 `task.script-editor-prd-workspace-and-navigation-alignment.workspace-and-navigation-implementation`。
- 接下来的代码改动必须受该 queue 边界约束，只能先补齐 PRD 4.x 的工作台与导航对齐，不能直接越过到人物作者面或更深的对象家族编辑。

## 2026-07-13 Script Editor PRD Workspace Queue Closeout And Same-Family Promotion

## 2026-07-13 Script Editor Project Selection Queue Closeout

## 2026-07-13 Script Editor Person Authoring Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-person-authoring-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-person-authoring-alignment-queue.md)，将 `queue.script-editor-prd-person-authoring-alignment` 写成当前 live queue truth，并把队列边界明确收敛在 PRD 第 5 节的人物统一模型、人物列表/详情、结构化分栏、以及 bounded relation/capability 入口，不允许顺手扩张进城市/建筑或正式对话/事件页。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 从 version-level `promotion-review` 切回 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- 当前 live entry 不再停在 person-authoring 的 version review，而是正式进入 `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation`。
- 后续 script-editor PRD 对齐必须先在人物作者面内完成统一人物模型与结构化分栏首切，不能越过到城市/建筑/menu 或正式对话/事件页实现。

## 2026-07-13 Script Editor Person Authoring Queue Closeout

### Changed
- 新增 [src/application/script-editor/person-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/person-authoring.ts)，沉淀人物作者面的结构化 helper：统一人物记录归一化、默认人物草稿、基础字段更新、扩展属性增删改、对话/事件关联入口，以及交易绑定开关与条目写回。
- 更新 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/minimal-workflow.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/minimal-workflow.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、以及 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，将 `people` 从 generic minimal record 编辑切到 dedicated 人物作者面：人物列表/详情改为专用布局，详情补齐 `属性 / 对话 / 交易 / 事件` 四个结构化分栏，并接入 bounded relation/capability entrypoints。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增人物作者面对齐回归与 helper 归一化回归，覆盖人物详情分栏、bounded relation action id，以及交易绑定与关联列表的结构化写回。
- 更新 [docs/blueprints/queues/script-editor-prd-person-authoring-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-person-authoring-alignment-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-person-authoring-alignment` 从 active 收口为 `done`，并把 live PRD version 入口切回 promotion-review。

### Impact
- 当前 PRD alignment version 已经拥有第一版 dedicated 人物作者面：`people` 不再停留在 generic JSON/minimal record 编辑，而是具备统一人物模型、结构化详情分栏与 bounded relation/capability 入口。
- `queue.script-editor-prd-person-authoring-alignment` 已变为关闭历史证据；当前 live entry 不再停在该 queue 执行，而是回到 `target.script-editor-prd-alignment` 的 version-level promotion review。
- 当前记录的下一个 lawful candidate 是 `queue.script-editor-prd-city-building-and-menu-alignment`；后续若继续推进 PRD 对齐，应先基于 version plan 做城市/建筑/menu 绑定面 admission review，而不是重开已关闭的人物作者面队列。

## 2026-07-13 Script Editor City Building And Menu Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-city-building-and-menu-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-city-building-and-menu-alignment-queue.md)，将 `queue.script-editor-prd-city-building-and-menu-alignment` 写成当前 live queue truth，并把队列边界明确收敛在 PRD 第 6 节的城市/建筑容器关系、menu family 配置、进入条件与进入态分层、以及 building entry binding 面，不允许顺手扩张进正式对话/事件/剧情页。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 从 version-level `promotion-review` 切回 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- Blueprint 当前不再停在“等待 city/building queue admission review”的状态；当前 live entry 已经收敛到 `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation`。
- 接下来的 script-editor PRD 对齐必须先补齐城市/建筑 dedicated authoring surface、menu family 配置、进入态与 entry binding 首切，不能直接越过到正式 dialogue/event/story queue。

## 2026-07-13 Script Editor City Building And Menu Queue Closeout

### Changed
- 新增 [src/application/script-editor/city-building-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/city-building-authoring.ts)，沉淀城市/建筑作者面的结构化 helper：默认城市/建筑草稿、菜单项增删改、menu target 配置、进入态写回，以及建筑入口挂接字段写回。
- 更新 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/minimal-workflow.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/minimal-workflow.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、以及 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，将 `cities / buildings` 从隐藏或 generic editor 处理切到 dedicated 作者面：工作台现在直接暴露城市/建筑对象树，详情页补齐 `基础 / 菜单 / 进入态 / 入口` 结构化分栏，并接入 menu binding、access state、building entry binding 首切。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增城市/建筑作者面对齐回归与 helper 归一化回归，并将 minimal workflow 可见 family 断言扩展到 `cities / buildings`。
- 更新 [docs/blueprints/queues/script-editor-prd-city-building-and-menu-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-city-building-and-menu-alignment-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-city-building-and-menu-alignment` 从 active 收口为 `done`，并把 live PRD version 入口切回 promotion-review。

### Impact
- 当前 PRD alignment version 已经拥有第一版 dedicated 城市/建筑作者面：`cities / buildings` 不再停留在隐藏 family 或 generic JSON 编辑，而是具备 menu family 配置、access-state 以及 building entry binding 首切。
- `queue.script-editor-prd-city-building-and-menu-alignment` 已变为关闭历史证据；当前 live entry 不再停在该 queue 执行，而是回到 `target.script-editor-prd-alignment` 的 version-level promotion review。
- 当前记录的下一个 lawful candidate 是 `queue.script-editor-prd-dialogue-event-story-alignment`；后续若继续推进 PRD 对齐，应先基于 version plan 做剧情/对话/事件作者面 admission review，而不是重开已关闭的 city/building queue。

## 2026-07-13 Script Editor Dialogue Event Story Queue Admission

## 2026-07-13 Script Editor Dialogue Event Story Queue Closeout

### Changed
- 新增 [src/application/script-editor/story-dialogue-event-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/story-dialogue-event-authoring.ts)，沉淀剧情/对话/事件作者面的结构化 helper：默认草稿、字段归一化、剧情关联、对话节点/后续动作、以及事件条件组/去向/关联对象/预览摘要写回。
- 更新 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/minimal-workflow.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/runtime-pack-import.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、以及 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，将 `storyNodes / dialogues / events` 从 generic 或 deferred 处理切到 dedicated 作者面：工作台现在直接暴露剧情/对话/事件对象树，详情页补齐剧情 `基础 / 关联 / 摘要`、对话 `基础 / 节点 / 预览`、事件 `基础信息 / 条件 / 去向 / 关联对象 / 预览与校验` 结构化分栏，并把 runtime pack 导入适配到新的 bounded event authoring 记录形态。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增剧情/对话/事件作者面对齐回归与 helper 归一化回归，并把 minimal workflow 断言调整为“family 可见但 dialogue/story export 仍按 bounded policy defer”。
- 更新 [docs/blueprints/queues/script-editor-prd-dialogue-event-story-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-dialogue-event-story-alignment-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-dialogue-event-story-alignment` 从 active 收口为 `done`，并把 live PRD version 入口切回下一条 lawful continuation admission。

### Impact
- 当前 PRD alignment version 已经拥有第一版 dedicated 剧情/对话/事件作者面：`storyNodes / dialogues / events` 不再停留在 generic JSON 编辑或 deferred family，而是具备结构化事件区块与 bounded linkage/preview-summary 入口。
- `queue.script-editor-prd-dialogue-event-story-alignment` 已变为关闭历史证据；其 remaining same-family residue 已明确转移到 `queue.script-editor-prd-minigame-binding-alignment`。

## 2026-07-13 Script Editor Minigame Binding Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-minigame-binding-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-minigame-binding-alignment-queue.md)，将 `queue.script-editor-prd-minigame-binding-alignment` 写成当前 live queue truth，并把队列边界明确收敛在 PRD 第 10 节的 configuration-first minigame/playable binding surface、bounded launch/settlement 配置、以及 cross-object linkage 入口，不允许顺手扩张进 shared playable runtime contract 或 preview/export product 面。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 从 version-level promotion review 切回 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- Blueprint 当前不再停在“等待 minigame-binding queue admission review”的状态；当前 live entry 已经收敛到 `task.script-editor-prd-minigame-binding-alignment.minigame-binding-implementation`。
- 接下来的 script-editor PRD 对齐必须先补齐玩法绑定作者面与 bounded settlement 配置首切，不能直接越过到 preview/validation/export queue。

## 2026-07-13 Script Editor Preview Validation Export Queue Closeout

### Changed
- 更新 [src/application/script-editor/workspace-shell.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/workspace-shell.ts)、[src/ui/views/script-editor/script-editor-workspace-view.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/views/script-editor/script-editor-workspace-view.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、以及 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，将 script-editor 工作台右侧摘要扩成一个按需打开的统一辅助区：补齐结构预览、统一校验列表、问题回跳、以及当前对象的导出落点摘要。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增 preview queue 回归，覆盖辅助区模型、linked issue routing、toggle/jump action，以及工作台视图的中文文案与数据属性接缝。
- 更新 [docs/blueprints/queues/script-editor-prd-preview-validation-export-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-preview-validation-export-alignment-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-preview-validation-export-alignment` 从 active 收口为 `done`，并把 live PRD version 入口切回 promotion-review。

### Impact
- 当前 PRD alignment version 已经拥有第一版统一 preview/validation/export handoff surface：预览与校验不再散落在事件局部 notes 和 export-only diagnostics 里，而是可以在工作台内按需展开并直接回跳到对象家族与对应 tab。
- `queue.script-editor-prd-preview-validation-export-alignment` 已变为关闭历史证据；当前 live entry 不再停在该 queue 执行，而是回到 `target.script-editor-prd-alignment` 的 version-level promotion review。
- 当前记录的下一个 lawful candidate 是 `queue.script-editor-prd-workbench-ui-visual-alignment`；后续若继续推进 PRD 对齐，应先基于 version plan 做最终 creator-workbench 视觉收敛 admission review，而不是重开已关闭的 preview/export queue。

## 2026-07-13 Script Editor Preview Validation Export Queue Repository Sync

### Changed
- 更新 [docs/blueprints/queues/script-editor-prd-preview-validation-export-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-preview-validation-export-alignment-queue.md)，将关闭后的 `sync_status` 从 `pending` 补齐为 `done`，并记录提交 `04e79e6` 已成功推送到 `origin/mod-first-dev`。

### Impact
- 关闭后的 preview queue 现在不再缺少 repository sync 事实，队列关闭记录与远端开发母线状态保持一致。
- 后续 PRD 队列推进可以直接把 `queue.script-editor-prd-preview-validation-export-alignment` 当作已验证且已同步的历史基线使用。

## 2026-07-13 Script Editor Workbench UI Visual Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，将 `queue.script-editor-prd-workbench-ui-visual-alignment` 写成当前 live queue truth，并把队列边界明确收敛在 creator-first workbench shell convergence、warm-paper 视觉系统、以及首屏 creator-visible summary filtering，不允许顺手扩张回 project-selection 管理或任何已关闭结构队列。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 从 version-level promotion review 切回 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- Blueprint 当前不再停在“preview queue closeout 之后的 version review”状态；当前 live entry 已经收敛到 `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation`。
- 接下来的 script-editor PRD 对齐必须先完成 creator-first workbench shell 的最终视觉收敛和首屏创作语义清理，不能再回头重开已关闭的结构性队列。

## 2026-07-13 Script Editor Workbench UI Visual First Cut

### Changed
- 更新 [src/ui/views/script-editor/script-editor-workspace-view.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/views/script-editor/script-editor-workspace-view.ts)、[src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)、以及 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)，将工作台首屏从旧的深色 scaffold 摘要壳推进到第一版 warm-paper creator shell：顶部动作收敛为“返回项目列表 + 保存/校验/导出”，工作区不再常驻 open/import/project-entry 按钮，左侧对象区增加当前工作域引导，整体背景与卡片层级切到浅暖纸面方向。
- 更新 [src/application/script-editor/workspace-shell.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/workspace-shell.ts)，把工作台 badge、项目总览统计、以及对象摘要卡从 raw ID 导向调整为 creator-visible copy，减少首屏对 `id`/内部键值的直接暴露。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，补充 visual queue 首切回归，确认工作台视图已经暴露 `返回项目列表` 动作，且人物摘要卡不再把 raw `id` 作为主摘要文案。

### Impact
- 用户现在在“人物与世界”等对象工作区看到的将不再是上一个 dark scaffold 阶段的摘要板，而是更接近蓝图要求的 creator-first workbench shell。
- 当前首切先解决“视觉外壳 + 首屏摘要语义”问题；更深层的字段显隐与高级信息收口仍继续受 `queue.script-editor-prd-workbench-ui-visual-alignment` 约束推进。

## 2026-07-13 Script Editor Workspace Scroll Intake Routing

### Changed
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md) 与 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，将“剧本编辑器工作区没有滚动条、下方内容不可达”的新问题记录为 `item.script-editor-workspace-scroll-accessibility`，并明确按蓝图规范被当前 active 的 `queue.script-editor-prd-workbench-ui-visual-alignment` 吸收，而不是新建并行候选队列。

### Impact
- 当前蓝图没有被错误地分叉出第二条同家族工作台队列；滚动可达性问题现在归属于正在进行的 creator-workbench visual queue。
- 后续若主会话继续推进该 active queue，应在不越出既有视觉/布局边界的前提下，把工作区滚动可达性作为该队列的明确实现义务处理。

## 2026-07-13 Script Editor Advanced System Details Convergence

### Changed
- 更新 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js) 与 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，新增共享的 `高级设置与系统信息` 折叠块样式与渲染 helper，并把项目总览、人物、城市/建筑、剧情、对话、事件、玩法绑定等基础页签中的首屏系统字段收口到该折叠层，而不是继续把 `ID` / 挂接标识直接铺在作者首屏。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，补充 visual-alignment 回归，确保高级系统信息折叠 helper、样式类以及故事/对话/事件/玩法的字段显隐文案继续存在。
- 更新 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，把这一批实现记录进当前 active task 的队列事实，明确它属于 visual queue 的同一 bounded 首屏字段收敛批次。

### Impact
- 当前 script-editor 工作台已经不只是 warm-paper 外壳收敛，首屏字段显隐也开始符合 creator-first 要求：创作标题、摘要、描述留在主视图，系统标识转入统一折叠块。
- 该队列仍未 closeout；剩余工作继续集中在活跃 visual queue，包括工作区滚动可达性和任何尚未完成的同边界视觉/布局清理。

## 2026-07-13 Script Editor Workspace Scroll Recovery

### Changed
- 更新 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，让 `.c-main-ui-screen--script-editor-flow` 在固定的 main-ui shell 内自己承担纵向滚动：补充 `height: 100%`、`overflow-y: auto`、`overflow-x: hidden` 与 `overscroll-behavior-y: contain`，不再依赖被全局锁死的 `html/body/#app` 页面滚动。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增 script-editor 工作区滚动回归，确保 visual-alignment 队列不会再把固定壳中的工作台滚动能力回退掉。
- 更新 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，把这次滚动修复记入当前 active visual queue 的实现事实，而不是误记成新的并行队列。

### Impact
- 剧本编辑器现在在现有固定 main-ui/game-frame 约束下恢复了纵向可达性，下方被裁掉的工作台内容可以通过 screen 内滚动继续访问。
- 这仍然属于 `queue.script-editor-prd-workbench-ui-visual-alignment` 的同边界实现批次；队列尚未 closeout，后续仍需继续完成剩余视觉/布局清理与同步。

## 2026-07-13 Script Editor Central Editor Reflow

### Changed
- 更新 [src/ui/views/script-editor/script-editor-workspace-view.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/views/script-editor/script-editor-workspace-view.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js) 与 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，把真实的对象编辑面板从工作台外部下方的独立追加区块收回到 `.c-script-editor-shell__workspace` 的中央主列，并新增 `c-script-editor-shell__editor-stage` 容器，让当前对象详情优先停留在主编辑区顶部，摘要信息退到其下方。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增布局回归，确保 `renderScriptEditorWorkspaceView(workspace, this.renderScriptEditorEditorPanel())` 继续成立，避免详情面板再次被挂回工作台底部。
- 更新 [docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md)，把这次中央编辑列回流记入当前 active visual queue 的实现事实。

### Impact
- “人物详情”以及同类对象详情不再掉到整个工作台最下面，而是回到符合线框预期的中央主编辑区。
- 当前布局更接近蓝图中的“左侧导航/对象列表 + 中央主编辑区 + 右侧辅助区”结构，但该 visual queue 仍未 closeout。

## 2026-07-13 Script Editor Minigame Binding Queue Closeout

### Changed
- 新增 [src/application/script-editor/minigame-binding-authoring.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/minigame-binding-authoring.ts)，沉淀玩法绑定作者面的结构化 helper：默认绑定草稿、builtin playable / integration 选项、绑定字段归一化、launch payload 增删改、以及 outcome settlement route 写回。
- 更新 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/minimal-workflow.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/workspace-shell.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、以及 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，将 `minigames` 从 empty/deferred family 切到 dedicated binding 作者面：工作台现在直接暴露玩法绑定对象树，详情页补齐 `基础信息 / 触发与调用 / 结算与返回 / 引用关系` 结构化分栏，并接入 reverse-reference visibility。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增玩法绑定作者面对齐回归与 helper 归一化回归，并把 minimal workflow 可见 family 断言扩展到 `minigames`。
- 更新 [docs/blueprints/queues/script-editor-prd-minigame-binding-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-minigame-binding-alignment-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-minigame-binding-alignment` 从 active 收口为 `done`，并把 live PRD version 入口切回下一条 lawful continuation admission。

### Impact
- 当前 PRD alignment version 已经拥有第一版 dedicated 玩法绑定作者面：`minigames` 不再停留在 empty/deferred family，而是具备 bounded playable selection、launch payload、settlement route 与 reverse-reference visibility。
- `queue.script-editor-prd-minigame-binding-alignment` 已变为关闭历史证据；其 remaining same-family residue 已明确转移到 `queue.script-editor-prd-preview-validation-export-alignment`。

## 2026-07-13 Script Editor Preview Validation Export Queue Admission

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-preview-validation-export-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-preview-validation-export-alignment-queue.md)，将 `queue.script-editor-prd-preview-validation-export-alignment` 写成当前 live queue truth，并把队列边界明确收敛在 PRD 第 11-12 节的 structure preview、linked validation、以及 export handoff surface，不允许顺手扩张进 final workbench visual redesign 或 shared runtime/schema redesign。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 继续保持在 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- Blueprint 当前不再停在“minigame-binding closeout 之后的 version review”状态；当前 live entry 已经收敛到 `task.script-editor-prd-preview-validation-export-alignment.boundary-baseline-reconcile`。
- 接下来的 script-editor PRD 对齐必须先确认并补齐 preview / validation / export handoff 的 unified auxiliary surface，不能提前跳到最终 creator-first workbench visual convergence。

### Changed
- 新增 [docs/blueprints/queues/script-editor-prd-dialogue-event-story-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-dialogue-event-story-alignment-queue.md)，将 `queue.script-editor-prd-dialogue-event-story-alignment` 写成当前 live queue truth，并把队列边界明确收敛在 PRD 第 7-9 节的剧情/对话/事件 dedicated authoring surface、结构化事件区块、以及 bounded linkage/preview-summary 入口，不允许顺手扩张进 minigame runtime 或 preview/export product 面。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `target.script-editor-prd-alignment` 从 version-level `promotion-review` 切回 `active-execution`，并把当前入口同步到新 admitted queue。

### Impact
- Blueprint 当前不再停在“等待 dialogue/event/story queue admission review”的状态；当前 live entry 已经收敛到 `task.script-editor-prd-dialogue-event-story-alignment.dialogue-event-story-implementation`。
- 接下来的 script-editor PRD 对齐必须先补齐剧情/对话/事件 dedicated authoring surface 与结构化事件区块首切，不能直接越过到 minigame-binding 或 preview/export queue。

### Changed
- 更新 [src/application/script-editor/project-workspace-library.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/project-workspace-library.ts)、[src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)、以及 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，为剧本编辑器入口补齐 `项目选择与管理` 面：主入口现在维护 bounded in-memory 项目库，支持按项目 `继续编辑 / 删除项目 / 确认删除`，并将 landing 与项目卡片布局适配到宽/中/窄三档宽度。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增项目库 helper 与项目选择队列回归，覆盖 dedicated project list、continue/delete action id、delete confirmation，以及样式类存在性。
- 更新 [docs/blueprints/queues/script-editor-prd-project-selection-and-workspace-layout-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-project-selection-and-workspace-layout-alignment-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-project-selection-and-workspace-layout-alignment` 从 active 收口为 done，并把 live PRD version 入口切回 promotion-review。

### Impact
- 当前 PRD alignment version 已经把工作台 first-cut 之后的同家族 gap 收敛完毕：项目选择/管理不再和当前项目编辑混在同一入口态，且工作区/项目卡片已经具备多宽度适配。
- `queue.script-editor-prd-project-selection-and-workspace-layout-alignment` 已变为关闭历史证据；当前 live entry 不再停在 queue 执行，而是回到 `target.script-editor-prd-alignment` 的 version-level promotion review。
- 当前记录的下一个 lawful candidate 是 `queue.script-editor-prd-person-authoring-alignment`；后续若继续推进 PRD 对齐，应先基于 version plan 做人设作者面 admission review，而不是重开已关闭的 workbench/project-selection 队列。

### Changed
- 更新 [src/application/script-editor/workspace-shell.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/workspace-shell.ts)、[src/ui/views/script-editor/script-editor-workspace-view.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/views/script-editor/script-editor-workspace-view.ts)、以及 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)，把剧本编辑器工作台推进为 PRD 4.x 对齐的中文工作台：导航改为 `项目总览 / 对象导航 / 校验导出`，总览页补齐项目状态、创作进度、风险与阻塞、下一步建议，`storyPack` 中央编辑区也切成正式项目总览面而不是旧的 `Project` scaffold copy。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs) 与 [tests/blueprint-governance-lint.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/blueprint-governance-lint.test.cjs)，新增 PRD workspace/navigation 对齐回归，并将 live version plan 断言切到当前真实的 `target.script-editor-prd-alignment`。
- 更新 [docs/blueprints/queues/script-editor-prd-workspace-and-navigation-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-workspace-and-navigation-alignment-queue.md)，将 `queue.script-editor-prd-workspace-and-navigation-alignment` 从 active 收口为 `done`，并把剩余 same-family residue 路由到下一条 workbench continuation queue。
- 新增 [docs/blueprints/queues/script-editor-prd-project-selection-and-workspace-layout-alignment-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-prd-project-selection-and-workspace-layout-alignment-queue.md)，并同步更新 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-prd-project-selection-and-workspace-layout-alignment` 设为当前新的 active queue。

### Impact
- 当前 PRD alignment version 已经拥有正式的中文工作台和项目总览入口，不再把 script editor 当成 shell + raw JSON scaffold 的延伸。
- `queue.script-editor-prd-workspace-and-navigation-alignment` 已变为关闭历史证据；其 remaining same-family residue 不再停留在口头说明，而是被明确提升为新的 queue governor。
- 当前 live entry 已经推进到 `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation`；下一步 workbench 工作应先补脚本列表/项目管理与响应式布局，再进入人物作者面。

### Changed
- 新增 [docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md)，把新的 successor version 明确定义为“按 [docs/script-editor-prd.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/script-editor-prd.md) 对齐剧本编辑器产品面”的治理主轴，并写清它继承已关闭 implementation baseline、不得静默重开冻结契约、以及必须复用现有 runtime-compatible export path 的边界。
- 新增 [docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md)，将 `target.script-editor-prd-alignment` 作为 open successor version 建立起来，并记录六条 candidate-recorded PRD alignment queue 族，但暂不 admitted 任何 queue。
- 更新 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md) 与 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，把 live entry 从已关闭的 implementation version 切到新的 PRD alignment version；当前入口没有 active queue，下一步是 version-level admission review。

### Impact
- 剧本编辑器相关工作现在不再挂在已关闭的 `target.script-editor-implementation` 下面，而是进入一个新的 open successor version。
- 当前 Blueprint 已明确：下一步不是直接写代码，而是先对 `queue.script-editor-prd-workspace-and-navigation-alignment` 做 admission review，因为 PRD 把工作台本身列为第一优先级。

### Changed
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，将 `target.script-editor-implementation` 从 closeout-ready 的 `open` 正式切换为 `done`，并把 closeout confirmation、future routing、以及最终 prior promotion record 写成 version-level historical truth。
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，把当前 Blueprint 入口说明改成“最新 governed version 已关闭、暂无 open successor”的状态，而不是仍停在 implementation version 的 closeout-ready 描述。

### Impact
- `target.script-editor-implementation` 已正式关闭；在当前 Blueprint 下不再允许继续提升同 version queue。
- 若后续还要推进 script-editor 相关改进，必须先创建新 version，或做一次同等显式的 version-level reopen 决定，而不能直接复用已关闭的 implementation version。 

### Changed
- 新增 [src/application/script-editor/shared-rule-compiler.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/shared-rule-compiler.ts)，落地首个 bounded shared-rule compiler：对 `conditionGroups / effectBundles` 建索引、做共享 authoring 校验，并把支持的 task-host 条件/效果 lowering 到当前 `TaskDefinition` 契约。
- 更新 [src/application/script-editor/runtime-pack-export.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/runtime-pack-export.ts)，让 script-editor runtime export/validation 不再对整个 `conditionGroups / effectBundles` 家族一刀切 fail closed，而是复用 shared-rule compiler 输出 `tasks.json`，同时对缺引用或 unsupported lowering 保持显式阻塞。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增共享 task 条件/效果编译成功与 unsupported lowering fail-closed 回归覆盖，并收紧 workspace shell 阻塞 surfacing 断言以匹配当前真实阻塞来源。
- 更新 [docs/blueprints/queues/shared-condition-effect-authoring-integration-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/shared-condition-effect-authoring-integration-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，把 `queue.shared-condition-effect-authoring-integration` 从 active 收口为 done，并把 live version 入口切到无 active queue 的 version-closeout readiness。

### Impact
- 当前 implementation version 已拥有首个真正落地的 shared-rule authoring path：`conditionGroups / effectBundles` 不再只是 schema-placeholder，而是可以在 bounded task slice 上通过一个复用 compile/export seam 进入当前 runtime-compatible pack。
- 当前实现没有把 shared-rule 话题扩张成 broad host coverage；未覆盖的 host lowering 仍显式 fail closed，因此不会偷偷长出新的 feature-local rule dialect。
- `queue.shared-condition-effect-authoring-integration` 已变为关闭历史证据；当前 implementation version 没有 active queue，接下来只剩 version closeout truth 与一次显式人工确认。

### Changed
- 新增 [docs/blueprints/queues/shared-condition-effect-authoring-integration-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/shared-condition-effect-authoring-integration-queue.md)，把 `queue.shared-condition-effect-authoring-integration` 的 queue goal、task ledger、首条 bounded implementation slice、禁止扩张边界、以及 closeout/routing 规则写成 queue-level live truth。
- 更新 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将当前 implementation version 从 `promotion-review` 切换回 `active-execution`，并把 `queue.shared-condition-effect-authoring-integration` 设为单一 active queue。
- 将当前执行切口明确冻结为“shared authoring-rule validator / compiler / export integration”：只承接 `conditionGroups / effectBundles` 的共享 authoring 定义、验证、compile adapter、以及导出接入，不提前吸收 broad UI polish、完整 dialogue/minigame/story-node compile、或 runtime-schema redesign。

### Impact
- Blueprint 当前不再停在 minimal workflow closeout 之后的 version review；实现版已经重新进入 `active-execution`，恢复入口切到 `task.shared-condition-effect-authoring-integration.shared-rule-compiler-and-export-integration`。
- 当前 live queue 已明确先解决 `conditionGroups / effectBundles` 从 schema-placeholder 到 shared compile path 的缺口，而不是继续在已关闭的 minimal workflow queue 上扩张能力。
- 后续 shared-rule 实现会受 queue-level live truth 约束：支持的 bounded host 可以接入 compile/export，未覆盖的 host 仍需显式 fail closed，而不是默默生成新的 feature-local rule dialect。

### Changed
- 新增 [src/application/script-editor/minimal-workflow.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/minimal-workflow.ts)，把最小可用 workflow 的默认项目模板、可见 family 边界、以及 bounded record draft/upsert/remove helper 收口为单独应用层模块，供主菜单入口工作流直接复用。
- 更新 [src/ui/main-ui/main-ui-flow.js](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/main-ui/main-ui-flow.js)，把 `剧本编辑器` 主菜单入口、landing page 的 `新建/打开/导入` 动作、project-first workspace、最小对象编辑、以及 `保存 / 校验 / 导出` handoff 全部接入现有 overlay/action/file-input 流。
- 更新 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css) 与 [src/styles/app.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/app.css)，补齐 minimal workflow 的入口页、workspace chrome、notice、form grid、record list、以及 JSON editor 样式。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增 default minimal workflow project exportability、visible family filtering、以及 bounded record helper 的回归覆盖。
- 更新 [docs/blueprints/queues/script-editor-minimal-usable-workflow-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-minimal-usable-workflow-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-minimal-usable-workflow` 从 active 收口为 done，并把 live version 入口切回无 active queue 的 promotion review。

### Impact
- 当前 implementation version 已拥有第一个真正对用户可见的 script-editor workflow，而不是只有 persistence / export / compatibility / creator-shell 基底；用户现在可以从主菜单进入编辑器，创建或打开项目，并在同一路径里完成保存、校验和导出 handoff。
- `queue.script-editor-minimal-usable-workflow` 已变为关闭历史证据；后续恢复入口不再是 queue doc，而是 implementation version plan 的 promotion review。
- 当前版本里唯一仍被记录为 open 的实现候选重新回到 `queue.shared-condition-effect-authoring-integration`，后续若要继续扩大 script-editor 可编辑语义，需要先经过 version-level review，而不是在已关闭的 first-loop queue 上继续漂移。

### Changed
- 新增 [src/application/script-editor/workspace-shell.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/workspace-shell.ts)，落地首个 project-backed script-editor workspace shell view-model：在不进入主菜单工作流的前提下，统一汇总对象树分组、选中对象摘要、导出 handoff 状态，以及 compatibility residue 摘要。
- 新增 [src/ui/views/script-editor/script-editor-workspace-view.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/ui/views/script-editor/script-editor-workspace-view.ts) 与 [src/styles/script-editor.css](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/styles/script-editor.css)，补齐 creator-facing workspace shell、top navigation chrome、object-tree scaffold、inspector cards 与 handoff summary 的壳层表现。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增 script-editor workspace shell 的对象树 scaffold 与 export blocker / compatibility residue surfacing 回归覆盖。
- 新增 [docs/blueprints/queues/script-editor-ui-shell-and-core-workflow-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/script-editor-ui-shell-and-core-workflow-queue.md)，并同步更新 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.script-editor-ui-shell-and-core-workflow` 记为完成并把 live version 入口切回无 active queue 的 promotion review。

### Impact
- 当前 implementation version 已拥有可复用的 script-editor creator shell，而不是只有 persistence / export / import 底层 seam；后续 product-facing workflow 不需要再重建 editor chrome、对象树与 handoff 摘要。
- `queue.script-editor-ui-shell-and-core-workflow` 已变为关闭历史证据；后续恢复入口重新回到 implementation version plan 的 promotion review。
- 下一条更大的候选现在可以直接评估 `queue.script-editor-minimal-usable-workflow`，因为 creator-shell 基底已经落地，而 shared-rule/product scope 是否需要进一步前置约束也能在 version-level review 中继续裁定。

### Changed
- 更新 [src/application/script-editor/runtime-pack-import.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/runtime-pack-import.ts)，将 unresolved runtime-only families 从“导入时报错拒绝”推进为“导入时保留到 `storyPack.compatibilityImport` 的 `unresolvedFamilies` 与 `diagnostics`”，让现有 scenario pack 可以进入 editor project 而不丢失原始 runtime payload。
- 更新 [src/application/script-editor/runtime-pack-export.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/runtime-pack-export.ts)，当 imported compatibility residue 仍未被后续队列解析时，runtime export 会显式 fail closed，避免把保留下来的 runtime-only payload 静默丢出导出结果。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增 unresolved runtime-only family residue preservation 与 imported residue export fail-closed 的回归覆盖。
- 更新 [docs/blueprints/queues/compatibility-import-adapter-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/compatibility-import-adapter-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、[docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 `queue.compatibility-import-adapter` 从 active 收口为 done，并把 live version 入口切回无 active queue 的 promotion review。

### Impact
- 当前 implementation version 已满足 compatibility-import queue 的 bounded closeout：现有 runtime scenario pack 可以被非破坏性导入，未解析家族不会丢失，而且在后续 authoring/export 仍未支持前不会被误导出。
- `queue.compatibility-import-adapter` 已变为关闭历史证据；后续恢复入口不再是 queue doc，而是 implementation version plan 的 promotion review。
- script-editor 的三条上游 seam 现在都已落地：authoring-project persistence、runtime-pack export、以及 compatibility import。下一条 queue 需要由 version-level review 在 shared-rule / creator-shell / minimal-workflow 候选之间继续裁定。 

## 2026-07-13 Script Editor Compatibility Import Direct Slice

### Changed
- 新增 [src/application/script-editor/runtime-pack-import.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/runtime-pack-import.ts)，落地首个 bounded `scenario pack -> script-editor project` compatibility importer：只导入 frozen direct families，并保留 `pack.json` 中的 `basePackId` / `author` / `version` / `tags` 到 `storyPack` 侧元数据。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增 direct-family 导入成功与 unresolved runtime-only family fail-closed 诊断回归覆盖。
- 更新 [docs/blueprints/queues/compatibility-import-adapter-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/compatibility-import-adapter-queue.md) 与 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，将 `task.compatibility-import-adapter.direct-family-import-and-compatibility-diagnostics` 记为完成，并把当前 active task 推进到 queue closeout/handoff。

### Impact
- 当前 implementation version 已拥有真实的 compatibility-import seam：一个 manifest-driven runtime scenario pack 现在可以被解释成 bounded `ScriptEditorProjectDefinition`，而不是只停留在蓝图契约层。
- `scenes`、`activities` 以及其他 unresolved runtime-only families 不会再被静默丢弃；当前实现会用显式诊断拒绝导入，为后续 same-family residue routing 提供可验证真值。
- 当前 live queue 仍是 `queue.compatibility-import-adapter`，但代码实现任务已完成，下一步只剩队列 closeout、残留归类与后续 lawful continuation 的治理同步。 

## 2026-07-13 Script Editor Compatibility Import Queue Admission

### Changed
- 新增 [docs/blueprints/queues/compatibility-import-adapter-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/compatibility-import-adapter-queue.md)，把 `queue.compatibility-import-adapter` 的 queue goal、task ledger、禁止扩张边界、以及 closeout/routing 规则写成 queue-level live truth。
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、[docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)、以及 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，将当前 implementation version 从 `promotion-review` 切换回 `active-execution`，并把 `queue.compatibility-import-adapter` 设为单一 active queue。
- 将当前执行切口明确冻结为“manifest-driven runtime-pack compatibility import + unresolved-family diagnostics”，只承接 scenario-pack -> script-editor project 的 direct-family import 与显式兼容诊断，不提前吸收 export redesign、shared-rule integration 或 creator-facing UI workflow。

### Impact
- Blueprint 当前不再停在 export queue closeout 之后的 version review；实现版已经重新进入 `active-execution`，恢复入口切到 `task.compatibility-import-adapter.direct-family-import-and-compatibility-diagnostics`。
- 当前 live queue 已明确先解决“现有 scenario-pack 如何进入 editor project”这个 importer-first 入口，而不是提前把 shared-rule、UI 或第二轮 export 扩张混入同一条执行线。
- 最小可用 script-editor workflow 的默认 `导入现有剧本包` 前置路径现在已有独立 queue truth，后续兼容导入实现不需要再从会话 prose 重新整理边界。 

### Changed
- 新增 [src/application/script-editor/runtime-pack-export.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/runtime-pack-export.ts)，落地首个 bounded `script-editor project -> runtime-compatible scenario pack` 导出缝：直接映射 `storyPack -> pack.json/scenario-profile.json`、`people -> characters.json`、`cities -> cities.json`、`buildings -> houses.json`、`events -> events.json`、`quests -> tasks.json`、`textEntries -> text-entries.json`，并补齐运行时必需的空 `scenes.json`。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs)，新增导出成功、deferred family fail-closed、以及 opening scenario profile 缺失字段拒绝导出的回归覆盖。
- 更新 [docs/blueprints/queues/authoring-runtime-export-pipeline-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/authoring-runtime-export-pipeline-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、以及 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，把 `queue.authoring-runtime-export-pipeline` 从 active 收口为 done，并将 live version 入口切回无 active queue 的 promotion-review 状态。
- 将当前 version-level `next_lawful_queue_recommendation` 写为 `queue.compatibility-import-adapter`，因为 persistence 与 export 这两条上游 seam 已落地，后续可以从 frozen compatibility policy 出发检查 importer 是否成为最小下一切口。

### Impact
- 当前 script-editor implementation version 已拥有真实的 runtime-pack export handoff：作者项目不再只停留在 load/save substrate，而是可以导出首个 runtime-compatible scenario-pack artifact，并在不支持的 authoring family 上显式 fail closed。
- `queue.authoring-runtime-export-pipeline` 已变为关闭历史证据；后续恢复入口不再是 queue doc，而是 implementation version plan 的 promotion review。
- 最小可用 script-editor workflow 的前置条件又向前推进了一步：`save/reopen` 与 `real export` 现在都已具备，接下来只需由 version-level review 判断 compatibility import 或其他候选谁是下一条最小 lawful queue。

### Changed
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、[docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)、以及 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，将当前 implementation version 从 `promotion-review` 切换到 `active-execution`，并把 `queue.authoring-runtime-export-pipeline` 设为单一 active queue。
- 新增 [docs/blueprints/queues/authoring-runtime-export-pipeline-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/authoring-runtime-export-pipeline-queue.md)，把 queue goal、task ledger、active task、禁止扩张边界、以及 closeout/routing 规则写成 queue-level live truth。
- 将当前执行切口明确冻结为“authoring -> runtime export pipeline + bounded validator assembly”，只承接 frozen mapping contract 的 runtime-pack export 与 fail-closed validator 组装，不提前吸收 compatibility import、shared-rule integration 或 creator-facing UI workflow。

### Impact
- Blueprint 当前不再停在 export candidate 的 admission review；实现版已经重新进入 `active-execution`，恢复入口切到 `task.authoring-runtime-export-pipeline.boundary-baseline-reconcile`。
- 后续 script-editor 实现现在以 queue-level live truth 控制 export 队列，而不是继续停留在 version-level prose review。
- 当前 active queue 已明确把范围收紧到 export pipeline，本轮不会因 admission 同步而提前把 importer、shared-rule 或 UI 候选混入同一执行线。

## 2026-07-13 Script Editor Minimal Usable Workflow Candidate Clarification

### Changed
- 更新 [docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md) 与 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，将“最小可用剧本编辑器”从原 `queue.script-editor-ui-shell-and-core-workflow` 的范围说明中拆出，新增独立候选 `queue.script-editor-minimal-usable-workflow` / `item.script-editor-minimal-usable-workflow`。
- 在同一份 version plan 中补入新的 `Candidate Scope Notes`，明确 `queue.script-editor-ui-shell-and-core-workflow` 收窄为可复用 editor shell / workspace framing，而新的 `queue.script-editor-minimal-usable-workflow` 专门承接主界面 `剧本编辑器` 入口、编辑器首页 `新建/打开/导入` 三入口、项目优先的工作区骨架、最小对象树 `项目 / 人物 / 文本 / 剧情节点 / 事件`、以及 `校验 -> 导出` 的最短可用路径。
- 继续在同一份 version plan 中补入 `Candidate Admission Basis Notes`，将 `queue.script-editor-minimal-usable-workflow` 的 future admission prerequisite、required owned surfaces、minimum acceptance loop、以及 must-not-absorb 边界写成结构化候选依据，避免后续 promote 时再次退回会话 prose 整理。

### Impact
- “可用的最小剧本编辑器” 现在已经作为独立候选写入当前 implementation version truth，后续恢复时不需要再从会话 prose 重新整理入口、页面、最小对象范围以及最短用户路径。
- 当前 live admission 仍保持在 `queue.authoring-runtime-export-pipeline`；这次补充只扩展候选真值，不改变当前 pending admission subject，也不会把 editor shell 和最小可用产品闭环继续混成一个过宽候选。
- 后续若要正式 promote `queue.script-editor-minimal-usable-workflow`，Blueprint 已经拥有更接近 admission review 的结构化依据，可直接从 version truth 继续，而不需要再次让人工重述前置条件和最小闭环定义。

### Changed
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，将 `queue.editor-project-load-save-foundation` 从 pending admission review 提升为当前 implementation version 的单一 active queue。
- 新增 [docs/blueprints/queues/editor-project-load-save-foundation-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/editor-project-load-save-foundation-queue.md)，把 queue-goal、task ledger、active task、禁止扩张边界、以及 closeout/routing 规则写成 queue-level live truth。
- 将当前首个执行切口明确冻结为“manifest-driven editor project load/save + validation foundation”，只承接 authoring project manifest、split-table persistence、和 bounded validation，不提前吸收 runtime export、compatibility import、shared-rule integration 或 UI workflow。

### Impact
- Blueprint 当前不再停在“已有候选、尚未 admission”的状态；实现版已经正式进入 `active-execution`。
- 后续这条工作流的恢复入口不再是 version-level admission review，而是 active queue 下的 `task.editor-project-load-save-foundation.manifest-load-save-and-validation`。
- script editor implementation 的第一条执行线被收窄到一个可验证的基础设施切口，后续 export/import/UI 队列将建立在这一层稳定 authoring-project substrate 之上。

### Changed
- 新增 [src/domain/script-editor-project.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/domain/script-editor-project.ts)、[src/application/script-editor/editor-project-loader.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/editor-project-loader.ts)、以及 [src/application/script-editor/editor-project-save.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/script-editor/editor-project-save.ts)，正式落地 script-editor authoring project 的 manifest-driven split-table persistence seam。
- 更新 [tests/robustness.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs) 与 [tsconfig.test.json](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tsconfig.test.json)，为 script-editor project hydration / save-output / manifest validation 增加回归覆盖，并让新 `src/application/script-editor/**` 模块进入 `.test-dist` 测试编译。
- 更新 [docs/blueprints/queues/editor-project-load-save-foundation-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/editor-project-load-save-foundation-queue.md)、[docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)、以及 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)，把这条 queue 从 active 收口为 done，并将 live version 返回到无 active queue 的 promotion-review 状态。
- 将 `queue.authoring-runtime-export-pipeline` 设为当前 pending admission review subject，作为 persistence foundation 之后的下一条 lawful implementation queue。

### Impact
- 当前 script-editor implementation version 已拥有一个可执行的 authoring-project substrate：project manifest、canonical split-table registry、imported-directory hydration、save serialization、以及 bounded validation 均已具备。
- `queue.editor-project-load-save-foundation` 已变为关闭历史证据；后续实现不再需要重新发明 editor-project persistence，而是可以在这一层稳定 substrate 之上继续推进 export/import/UI 等下游 queue。
- Blueprint 当前已从首条 implementation queue 的 active execution 返回到 promotion review，下一步恢复入口重新回到 implementation version plan，而不是停留在已关闭 queue 上。

### Changed
- 新增 [docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-13-script-editor-implementation-target.md) 与 [docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-13-script-editor-implementation-target-plan.md)，把新的 successor version 正式定义为 `target.script-editor-implementation`。
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，将 Blueprint live 入口从已关闭的 `target.script-editor-contract-freeze` 切换到新的 implementation version。
- 新 version 以 `candidate-recorded` 形式预登记了 5 个 implementation queue，但保持 `active_queue = none`，未创建 queue doc，也未启动执行。
- 在同一份 implementation version plan 中把 `queue.editor-project-load-save-foundation` 选为当前 pending admission review subject，理由是 editor-project persistence 是冻结基线之上的最小上游实现切口。

### Impact
- Blueprint 当前已经拥有一个正式打开的 successor implementation version，后续 admission 和执行都不再需要回到已关闭的 contract-freeze version 上继续操作。
- 新 version 的职责被明确限制为“在冻结边界上实现编辑器并跑通链路”，不再把 authoring/mapping/compat/shared-rule/runtime-delta 边界重新混回实现治理。
- 当前已完成“先筛选出实现版第一条 queue”的治理动作，但仍停在 admission review：没有 queue doc、没有 active queue、也没有启动执行。

### Changed
- 更新 [docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-mainline-20260710/docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md)，把当前 script-editor freeze 需求正式收口为 5 个 bounded `queue-candidate`，分别对应 authoring contract、mapping contract、compatibility/import-export policy、shared condition/effect mechanism、以及 minimum runtime contract change audit。
- 将 `candidate_queue_ids` 从空集更新为这 5 个已记录候选队列，并同步补入对应 `item.xxx -> proposed_queue_id` 的 `Candidate Classification Record` 与 `Queue Promotion Ledger`。
- 在同一份 version plan 中把 `queue.editor-native-authoring-contract-freeze` 选为当前 pending admission review subject，理由是 creator-facing object model / ownership / naming / editor-only metadata 边界位于其余 mapping、compatibility、shared rule、minimum runtime delta 候选之前。
- 保持 `active_queue = none`、不创建 queue doc，只把当前 version 的下一个 lawful step 收口为“从已记录候选里选择一个进入 same-version admission review”。
- 更新 [docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-mainline-20260710/docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md)，把当前 version 的冻结边界明确拆成 `Must Freeze / Required Decisions / Deferred Work / Drift Guards` 四组。
- 在同一份 version spec 中新增 `Version Deliverables`，把当前 version 必须产出的契约成果显式收口为 authoring contract、mapping contract、compat/import-export policy、shared condition/effect mechanism、minimum runtime delta、gap classification matrix，以及 version-governance output 七类交付物。
- 明确当前 version 必须冻结的范围是：`editor-native authoring contract`、`authoring -> runtime mapping contract`、`compatibility / import-export policy`、`shared condition / effect mechanism`、以及 editor 落地所需的最小 runtime/schema delta。
- 明确当前 version 不承接完整 script-editor UI 交付、页面/组件细节、全仓库 script hardcode 清理、大规模 runtime consumer 重写或与冻结契约无直接关系的 modularization residue。

### Impact
- 当前 version 不再处于“只有 contract portfolio、没有 live candidate”的状态；这 5 个 script-editor freeze queue 已成为正式候选真值，但仍未 admission、未激活、未进入实现。
- 当前 version 已经完成“先筛选出下一条执行队列”的治理动作，但仍停在 admission review，不会因为这次同步就提前进入 queue activation 或代码实现。
- 后续 Blueprint 不需要再把同一份需求重新从零拆分，只需从当前 version plan 里记录好的 candidate ledger 恢复，并在其中选择一个 bounded queue 做 admission review。
- 后续 script-editor 相关 queue admission 不再只依赖宽泛 prose，而是要对照这份冻结清单判断事项属于“必须冻结”“需要决策”“暂不处理”还是“禁止漂移”。
- 当前 version 现在不只是“要冻结什么”，还明确写出了“最终必须产出什么”，后续 closeout 和 successor version handoff 可以直接对照 deliverables 校验，而不必再从 Scope / Acceptance Criteria 里反推交付物。
- 这使当前 version 更清楚地表达“先冻结设计/契约，再决定是否进入实现版本”，避免 bounded freeze queue admission 与 editor implementation scope 再次混淆。

## 2026-07-10 Blueprint Version Switch To Script Editor Contract Freeze

### Changed
- 更新 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 与 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)，把 Blueprint 主链从 `target.project-complete-modularization` 切换到新的 `target.script-editor-contract-freeze`。
- 更新 [docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md) 与 [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，把当前 modularization / runtime ownerization / shell closeout 主轴正式写成历史 closeout，并将 grain-shop helper-family residue 与 broader runtime-orchestration / house-session ownerization residue 路由为 post-closeout historical follow-up，而不是继续同 version admission。
- 新增 [docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-10-script-editor-contract-freeze-target.md) 与 [docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-10-script-editor-contract-freeze-target-plan.md)，把新 current version 收口为“剧本编辑器设计 / 契约冻结”，明确只记录 queue family，不创建 queue doc，也不顺带启动实现。

### Impact
- “剧本编辑器”议题不再继续吸收到旧 modularization version，而是作为一个独立 successor version 处理，避免把 editor 设计冻结和 runtime residue 收口混成同一条治理主线。
- 新 current version 现在只承载 `editor-native authoring contract`、`authoring -> runtime mapping contract`、`compatibility / import-export policy`、`shared condition / effect mechanism`、以及最小 `runtime contract changes` 的冻结目标，不默认吸纳主程式 shell 化、sub-runtimes 重构、全仓库硬编码迁移或完整 UI 落地。
- 本次切换没有创建新的 queue 文档，也没有推进任何实现代码改动；Blueprint 主链只完成了 version closeout / version opening 的治理切换。

## 2026-07-10 Blueprint Closure Judgement And Residue Routing Upgrade

### Changed
- 更新 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/docs/blueprints/blueprint-workflow-spec.md)，把 queue closeout 明确拆分为 `execution_closeout_status` 与 `topic_closure_status` 两层判断，并把 same-family residue routing 收口为 Blueprint 内部默认流程，而不是每次 closeout 后重新退回人工 prose 决策。
- 更新 [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/docs/blueprints/templates/target-plan-template.md) 与当前 live [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，新增 version-level closure routing 字段，使 `closure_review_subject / residue_candidate_family / next_lawful_queue_recommendation / auto_admission_ready` 成为结构化治理真值。
- 更新 [docs/blueprints/templates/execution-queue-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/docs/blueprints/templates/execution-queue-template.md)，把 queue-level closure judgement 字段收进唯一 `## Control Block`，避免 live truth 再次散落在 `Closeout Decision` 之类的 prose 区域。
- 更新 [tools/lint-blueprints.mjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/tools/lint-blueprints.mjs)、[tests/blueprint-governance-lint.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/tests/blueprint-governance-lint.test.cjs) 与 [tests/helpers/blueprint-governance-fixtures.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.worktrees/blueprint-governance-20260710/tests/helpers/blueprint-governance-fixtures.cjs)，把以下 fail-closed 规则纳入自动治理：
  - `topic_closure_status = closed` 不得与 `residue_remaining = yes` 并存
  - `residue_family = same-family` 时必须命名后继 continuation
  - `auto_continue_eligible = true` 与 `auto_admission_ready = true` 都必须绑定结构化 continuation truth
  - version-level residue routing 缺失 `closure_review_subject / closure_review_status / routing_basis` 时不得成立

### Impact
- Blueprint 现在能更稳定地区分“queue 执行动作完成”和“主题真实收口完成”，避免仅因治理动作发生就把 topic 误判为 closed。
- 同一 residue family 的后继步骤默认会在 Blueprint 内部继续路由，只有真的存在多路合法分叉时才需要人工决策。
- queue / candidate / closeout 的状态表达更接近代码真实完成度，而不是只反映文档同步或治理动作是否发生。

## 2026-07-09 Three.js Renderer Boundary

### Added
- 新增 `three` 运行时依赖，作为后续 3D / WebGL 表现层基础库。
- `docs/architecture.md` 记录 3D renderer 依赖边界：`three` 只能直接用于 `src/ui/**` 表现层，不能进入 `content`、`domain`、`application` 或 runtime 模块。

### Impact
- 后续 3D 场景、模型、特效、拾取和后处理可以复用 three.js 的现成渲染能力；玩法状态、探索、通行、事件、任务、house 会话和资源变化仍必须通过统一 game state / runtime 结构流转，不能藏进 three.js scene graph 或 `Object3D.userData`。

## 2026-07-08 Character Select Ink Feedback

### Changed
- 角色选择界面的墨点反馈从 DOM 矩形边缘采样改为图片 alpha 轮廓采样：`main-ui-flow.js` 会优先读取目标控件自身 CSS 背景图，按当前 `background-size` / `background-position` 计算实际绘制区域，再从透明像素边界提取轮廓点和外法线生成墨点。
- 角色选择界面初始化时会预热角色卡、书签、翻页按钮、返回按钮和开始按钮的轮廓缓存；无可采样图片或图片尚未加载时仍保留旧矩形采样兜底，避免 UI 反馈完全丢失。

### Impact
- 玩家在角色选择页悬浮或键盘聚焦控件时，墨点点选效果会贴近 UI 图片自身的不规则轮廓，而不是贴住控件外接方框；视觉资产仍由现有 CSS / 布局编辑器背景图维护。

## 2026-07-08 Campaign Map Interaction Stability

### Added
- 大地图新增可踏足 hex 悬浮反馈层：`map-view.ts` 生成 `data-campaign-hover-hex` SVG overlay，`main.ts` 根据当前 terrain 投影、探索状态、地形通行判定和寻路结果绘制白色六边形描边，`prototype.css` 将其放在云层之上且不接管鼠标事件。

### Changed
- 大地图 marker 和 marker summary 增加稳定 DOM 身份，`renderAppFrame()` 在地图重绘时像保活 terrain / actor / cloud canvas 一样移植旧 marker 节点，并只同步语义属性，保留 terrain 投影产生的位置样式，减少玩家移动结束时城市/建筑标识被销毁重建造成的刷新感。
- `docs/architecture.md` 同步大地图 marker 保活、可踏足 hex hover 反馈只读寻路结果、以及 hover 描边位于云层上方的层级契约。
- 云层 reveal mask 新增上一帧探索纹理与 `uRevealTransition` 过渡；新探索格开洞时按云噪声做溶解式切换，避免云层直接消失。
- 云层 shader 在已探索空洞内进一步衰减全图空气雾层和孤立云团残留，但不改变洞口边缘云壁的语义来源。
- 大地图通行网格改为按 `map_ground_types` 的水域材质语义生成，和 terrain shader 的陆地/水体渲染判断对齐；`map_heights` 不再负责寻路通行判定，避免低矮陆地被当成水体。
- 可踏足 hex 悬浮描边改为几何角点投影、高度锚定到当前 hex 中心，避免角点误采邻格高度导致六边形端点翘起或下陷。
- 云层空洞内的次级残留层同步衰减，减少已探索核心区里额外覆盖整层薄雾或外云团残影。
- 云层 reveal mask 的 hex 多边形同样改为角点投影、中心高度锚定，避免 mask 轮廓因角点误采邻格高度而变形。
- 大地图通行性收紧为 terrain shader 同款“hex 中心材质”语义，并直接使用 `map_ground_types` 原始尺寸采样；岸边水格不再因为角点陆地样本被放行。
- 云洞核心区的 inner wisp、云影与 outer puff 后叠层统一随空气雾层 keep mask 衰减到 0，避免洞内残留独立薄层。
- 云洞边缘扰动按视觉反馈恢复旧版单向 offset 采样路径，保留此前更强的云墙撕裂和融合效果。
- 云洞流动边缘恢复使用 reveal red 通道浅云层生成 `edgeBand` / `shallowZone` / `rimAlpha`；真正的硬六边形块改为从 raw `baseClear` 迁出，核心清空、空气雾和孤立云残留都改读 offset 后的有机 clear field，避免原始 mask 块作为独立透明度分区显露。

### Impact
- 玩家移动后地图标识节点保持稳定，地图 hover 反馈只提示当前实际可抵达的已探索陆地 hex；低矮陆地按渲染材质参与寻路，云层开图仍由探索状态驱动，视觉过渡更接近云层被逐步拨开的效果。

## 2026-07-07 Campaign Viewport Cloud Shader

### Added
- 新增大地图视口级云雾 overlay renderer `src/ui/views/map/campaign-cloud-webgl.ts`，通过独立 `data-campaign-map-cloud` canvas 渲染慢速动态云层。
- 新增 `campaign-cloud.vert.glsl` 与 `campaign-cloud.frag.glsl`，使用连续程序 FBM、billow 云雾变体与 `map_fog_noise` 轻量贴图扰动生成云体密度、明暗层次和轻微自阴影质感。
- 新增视口空间探索挖空 reveal mask：`map-view.ts` 将当前地图累计 `revealedHexKeys` 传给云层 canvas，`campaign-cloud-webgl.ts` 生成 `uRevealTexture`，`campaign-cloud.frag.glsl` 用它裁切云层 alpha。
- `campaign-terrain-webgl.ts` 新增只读投影 helper，将 terrain UV 投影到当前视口 client 坐标；云层 renderer 用它在完整视口云层上对齐地图 hex 挖空。
- `travel-to-coordinate.ts` 新增 `hexToCoordinatePolygon()`，让探索挖空复用 navigation 的尖顶 axial hex 几何。

### Changed
- 大地图初始相机改为以玩家当前坐标为屏幕中心，默认缩放改为 40x；地图 reset 会回到同一 home camera。
- `campaign-terrain-webgl.ts` 新增按地图坐标生成居中相机的 helper，避免 `main.ts` 复制 terrain 投影矩阵细节。
- 未探索 campaign marker 在 view model 层标记为不可交互，渲染时不再带 `data-map-node-id`，并通过 disabled / pointer-events 屏蔽点击和 hover 详情。
- campaign 地形通行网格从 hex 中心单点高度判定改为 hex 区域多点采样：中心为明确陆地或区域内有足够陆地样本才可通行，减少低矮陆地被误判为水体导致无法寻路的问题。
- `docs/architecture.md` 收敛为地图模块责任、数据流和层级契约，不再记录云层 shader 的噪声、距离场、阈值等实现细节。
- `map-view.ts` 在 `c-campaign-map` 视口内生成云雾 canvas，并把 marker 悬浮详情拆成独立 overlay；`prototype.css` 将云层限制在地图视口中，`pointer-events: none`，层级压过地图建筑点本体，但低于 marker 悬浮详情、debug 控件、全局 UI 和确认 modal。
- `campaign-terrain-webgl.ts` 的地形投影同步不再给 marker 本体或玩家写入深度排序高层级；marker、玩家 DOM sprite 和 actor canvas 固定在云层下方，只有 marker 悬浮详情固定在云层上方。
- 云雾 shader 重构为烟雾式密度场：云体主体形状、团块边界、明暗和 reveal 边缘撕裂由连续 FBM、billow 变体与贴图扰动主导，Worley/胞体距离场只保留为低权重团块破碎，不再形成可见细胞纹。
- 云雾 shader 移除导致屏幕斜向条纹的剪切雾丝层，改用各向同性的细粒度 puff / vapor breakup 扰动补充云面细节；最终 alpha 遮挡表达保持由 shader 末端统一控制。
- 云雾主密度噪声从单个低频 `coverage` 门控改为三组独立中频 puff field 的加权密度场，低频噪声只参与域扭曲和明暗；避免 `max()` 并集把整屏填成白雾，也避免通过常量保底掩盖采样不均。云层颜色同步调回偏亮白的云体反照率。
- 云雾密度拆成连续 `overcast` 覆盖层和 `cloudHeightField()` 高度层，屏幕覆盖由连续云幕维持，云团形状不再依赖透明度空洞。
- 云雾颜色层改为基于高度场梯度的近似法线光照：通过邻近采样估算坡度，再由 `slopeLight`、`ambientOcclusion`、`selfShadow` 和 `cloudHighlight` 生成亮面与软阴影，避免“白底叠黑块”或纯白无结构。
- 云雾光照继续加入沿光照方向的高度差采样：`upwindHeight` 产生云体投影式软阴影，`downwindHeight` 产生背光侧亮边，让满屏云幕内部出现可读的明暗起伏，而不是只有均匀白色。
- 云雾 shader 提高高度场细节和阴影动态范围：`microShadow` / `microHighlight` 参与 RGB 细节，阴影色加深但最终 alpha 遮挡表达保持不变。
- `campaign-cloud.frag.glsl` 顶部新增云层调参表，集中暴露 `CLOUD_SAMPLE_SCALE`、`CLOUD_FLOW_SPEED`、`CLOUD_TEXTURE_SAMPLE_SCALE`、细节/阴影/高光强度、reveal 距离场侵蚀和浅云参数，便于后续直接调整云团大小、噪声采样区域、流速和空洞形态。
- 云层动态从单纯移动噪声 offset 改为 `buildCloudSpace()` 平流采样坐标：低频风向、缓慢 curl 和 flow warp 共同驱动云体高度场、贴图细节和 reveal 边缘，使整片云层具有连续慢速流动。
- `campaign-terrain-webgl.ts` 新增只读 `getCampaignTerrainCamera()`，`campaign-cloud-webgl.ts` 每帧将当前地图相机作为 `uMapCamera` 传入云层 shader；云层采样空间按 `offset / scale` 的有效相机平移做弱反向采样偏移、按相机 scale 做部分缩放，保持气象层自身流动的同时响应地图拖拽和缩放，并避免单纯缩放因 offset 同步变化产生额外漂移。
- 探索空洞从单一 reveal alpha 裁切改为距离场驱动：`campaign-cloud-webgl.ts` 先栅格化已探索尖顶 hex 联合区域，再用边界距离场写入 `uRevealTexture`，shader 只负责用云阻力噪声侵蚀 `clearMask`，不再额外叠加完整云墙环。
- `campaign-cloud-webgl.ts` 的 reveal mask 不再通过核心/外肩/外圈多层 polygon alpha 与 canvas blur 生成；red 通道改为洞外距离带浅云近场，green 通道改为清空 signed-distance 场，texture alpha 固定为 255 以避免 canvas 预乘 alpha 吃掉语义通道。
- 云洞外侧浅云近场改为距离场语义：`CLOUD_REVEAL_FIELD_*_RATIO` 根据当前投影 hex 半径生成内清空、外清空和浅云距离带，`REVEAL_SHALLOW_*` 在 shader 中只把它解释为浅云区，外圈之外恢复当前深云层。
- 浅云层从“深云降透明度 / RGB 染色”改为独立稀疏云体：`sampleShallowCloudLayer()` 使用更高覆盖阈值、更小 puff 采样和自身明暗来生成少量浅云团；主合成在浅云语义区降低深云保留量，再叠加浅云层，避免形成均匀浅白盘或透明度锐减的假过渡。
- 浅云到深云、浅云到空洞的过渡改为 reveal 语义场与 `cloudResistance` 云阻力共同决定云体替换比例；边界处会按云团/细节噪声破碎，而不是只依赖 smoothstep 圆滑羽化。
- 修正浅云密度场过稀的问题：浅云层改用更符合当前高度场分布的成云阈值，并新增 `puffPresence` 云团存在场与干区削减场，让浅云区出现少量可见云团，而不是完全无云或只靠 alpha 提亮。
- 云洞边缘移除独立 `cloudWall` 合成层；边界厚度现在只能来自距离场 clear mask 被云阻力噪声局部侵蚀，以及浅云层对深云层的替换，避免截图中那种预制白色厚环。
- 云洞 shader 移除低 alpha `discard`，让透明边缘继续走正常 alpha blend，避免在云洞边界重新切出像素级硬边。
- 云洞边缘从“mask 加少量噪声扰动”改为“开洞压力与云阻力对抗”：`cloudResistance` 由大团块、billow 扇贝状云缘、细节纹理和云丝纹理组成，密云会咬住边界形成残留云壁，薄云才会被打开，确保 reveal 边缘能看到实际噪声轮廓。

### Impact
- 大地图云层、探索开洞和可踏足反馈的表现不再依赖简单 alpha 蒙版或一次性 DOM 重绘，视觉层和交互层的稳定性更接近持续运行的战役地图系统。

## 2026-07-08 Review Cadence Shared Mechanism Support Spec

### Added
- 新增 Blueprint 支撑规范 [docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md)，把“今日评定 / today's review”正式收口为当前 `queue.review-cadence-follow-up-contract-closure` 的共享机制设计依据，而不是 keep-house / temple-house 的私有功能补丁。
- 该规范明确区分三层边界：scenario-pack review 配置层、共享 review 机制层、宿主 house/UI 承载层，并明确当前阶段不通过新增 `review sub-runtime` 来承载此问题。
- 该规范冻结了统一 review 状态、触发源、visibility policy / review gate / host selector、配置声明边界、模块目录建议、迁移顺序、Blueprint admission 依据与结构性验收标准。

### Changed
- 更新 [docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md)，把 `queue.review-cadence-follow-up-contract-closure` 正式补入 current target 的 `Queue Contract Portfolio`，并把 admission rule 明确绑定到这份新的支撑规范。
- 更新当前 live [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，为既有 `item.review-cadence-follow-up-contract-closure` / `queue.review-cadence-follow-up-contract-closure` 补入 support spec 依据，明确本次设计任务沿用既有 queue candidate，而不是另起新的 same-target queue identity。

### Impact
- 后续若要推进“今日评定共享机制改造”，不需要再次从零解释为什么它不是单一 house feature，也不需要在 admission 讨论里重新发明 host/state/visibility/config 边界。
- Blueprint 当前对该问题的治理身份更清晰：它属于既有 `queue.review-cadence-follow-up-contract-closure` 的边界深化，而不是一个重复 candidate。
- 未来实施时，可以按共享规则 -> 统一状态 -> 触发收敛 -> 宿主适配 -> scenario-pack 数据化的顺序推进，而不是继续把逻辑散落在 house、runtime、time 与 UI 分支中。

## 2026-07-08 Blueprint Intake Minimal Input And Fixed Receipt Rule

### Changed
- 更新 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md)，把 fresh queue intake 的人工输入面正式收口为 `新需求 + 参考治理规范`，并明确 Blueprint 必须内部完成真值链读取、active-queue 吸收判断、候选收敛与 admission routing。
- 更新 [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-plan-template.md) 与当前 live [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，新增固定 operator receipt 契约，默认输出统一为 `处理结果 / 原因说明 / 当前执行情况 / 下一步` 四段回执，并显式写入 `人工操作：当前不需要 / 当前需要确认 xxx`。
- 更新 [docs/blueprints/templates/execution-queue-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/execution-queue-template.md)，要求 operator receipt 的 `当前执行情况` 直接取自 `queue_id`、`active_task` 与 `queue_goal`，避免队列可观测性继续依赖会话 prose。
- 更新 [tools/lint-blueprints.mjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/lint-blueprints.mjs) 与 [tests/blueprint-governance-lint.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/blueprint-governance-lint.test.cjs)，把 `intake_feedback_mode` 收口为单一 `fixed-receipt`，并增加对最小人工输入规则、固定回执契约和 operator snapshot contract 的静态校验。

### Impact
- 人工创建 fresh queue 相关需求时，不再需要手工命名 `item.xxx` 或填写 review/admission 内部字段。
- Blueprint 对人工的默认反馈不再漂移成长篇内部分析，而是固定返回同一张简洁回执，同时保留队列目标、任务数和当前任务的可见性来源。
- active queue 存在时，新增需求默认只会被吸收到当前队列或收敛为候选项；并行激活第二个 active queue 仍然被 fail-closed。 

## 2026-07-07 Playable Contribution Runtime Closure

### Changed
- 扩展 [src/core/contracts/gameplay-contribution.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/contracts/gameplay-contribution.ts) 与 [src/core/mods/mod-parser.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/mods/mod-parser.ts)，把 `playables` 与 `playableIntegrations` 提升为正式的 mod gameplay contribution 家族。
- 更新 [src/core/mods/mod-runtime.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/mods/mod-runtime.ts)，让 activated mod 在统一 contribution 安装阶段记录 playable ids / integration ids，而不是只覆盖 navigation / events / scenes / tasks / houses。
- 新增 [src/core/runtime/playable-runtime-registries.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/runtime/playable-runtime-registries.ts)，把默认 playable registry bundle 收口为显式 runtime seam，并允许它从 activated mod 进行配置，同时保留明确的 builtin first-party seed 安装。
- 更新 [src/core/runtime/playable-runtime.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/runtime/playable-runtime.ts)、[src/core/runtime/interactive-runtime.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/runtime/interactive-runtime.ts) 与 [src/main.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/main.ts)，让 covered playable runtime path 消费 activation-configurable default registries，而不是只依赖隐藏的 builtin registry fallback。
- 同步关闭 Blueprint queue [docs/blueprints/queues/playable-family-gap-audit-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/playable-family-gap-audit-queue.md)，并把当前 target 返回到 open + no-active-queue 的同 target admission review 状态。

### Impact
- playable family 现在正式进入统一的 mod contribution truth，后续新增或迁移 playable 时，不必再把它们留在 gameplay contribution contract 之外。
- runtime 默认 playable registries 不再只是隐式引用 builtin registry 常量；激活中的 mod 已经可以显式配置默认 playable 解析面。
- builtin playable 仍然保留 first-party seed 兼容路径，但它现在属于显式安装机制，而不是 generic runtime 的隐藏兜底。

## 2026-07-07 Zhuyuanzhang Scenario-Pack Integration Support Spec

### Added
- 新增 Blueprint 支撑规范 [docs/blueprints/specs/2026-07-07-zhuyuanzhang-scenario-pack-integration-support-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-07-zhuyuanzhang-scenario-pack-integration-support-spec.md)，把 `zhuyuanzhang` 在当前 complete-modularization target 下的目标终态正式收口为“一个 canonical scenario-pack，而不是 TS 装配 + 旧资源路径的混合体”。
- 该规范明确冻结了 `zhuyuanzhang` 的主从表模型：`pack.json` 作为唯一入口主表，`scenario-profile / events / scenes / tasks / maps / cities / houses / characters` 作为当前兼容主干表，`text-entries / city-portraits / city-entries / activities / house-access-refusal-rules / historical-*` 作为从表或补充映射表；`visual-assets` 被降格为共享契约升级后的计划扩展。
- 该规范把 `visual-assets.json` 明确收口为“共享 scenario-pack/content-pack contract、loader、validator 支持之后才能启用”的后续扩展，并要求剧本专属 CG、portrait、house/playable 插图在迁移时逐步进入 `src/content/scenario-packs/zhuyuanzhang/assets/**`，但在升级前继续走当前运行时支持的字段和映射。

### Changed
- 明确 `zhuyuanzhang` 剧本整合默认遵循“数据驱动 + shared loader seam”原则：`events` 只做触发与路由，`scenes` 只做演出与分支，`tasks` 只做进度状态机；文案与视觉资源改造都必须以当前共享契约能力为上限，超出现状的表或字段必须先走 shared loader seam 升级，不能由剧本包单方面发明。
- 明确共享 framework/UI baseline 不是 `zhuyuanzhang` 包内真值，不得为了追求表面自包含而把 layout-editor baseline、共享按钮/面板、或 shared skin 资源并入剧本包。
- 明确整合验证必须同时覆盖 `pack.json.files`、`textId` / `sceneId` / `taskId` / `eventId` / `assetId` 引用完整性、pack-local asset 存在性、以及迁移后的 source-path audit。

### Impact
- 后续若要推进 `zhuyuanzhang` 完整剧本包整合，不需要再次从零定义“哪些内容该进包、哪些不能进包、主从表如何拆、如何验收”；当前 Blueprint 已有一份可复用的正式支撑规范。

## 2026-07-07 Shared Contract Upgrade Governance Spec

### Added
- 新增治理规范 [docs/superpowers/specs/2026-07-07-shared-contract-upgrade-governance-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-07-shared-contract-upgrade-governance-spec.md)，单独冻结 shared `scenario-pack/content-pack` 契约链路的升级顺序、层级责任和验收门槛，并明确它不是 Blueprint/live truth。
- 该规范把 shared 能力升级固定为 `contract -> loader -> validator -> active-content -> consumer -> pack adoption -> cleanup` 七层链路，防止 pack 侧先偷跑字段、再倒逼 shared runtime 补洞。
- 该规范把当前最敏感的三类能力 `visualAssets`、任务 `textId`、更丰富的 `scene graph` 收口为 shared 上游 readiness 问题，而不是 `zhuyuanzhang` 包内可自行启用的问题。

### Impact
- 后续如果要推进 `visual-assets`、任务 `textId`、`rich scene graph` 这类能力，仓库现在已经有一份独立治理文档可直接作为上游升级门槛，不需要再把 pack-level 规划和 shared contract 扩展混写在同一份规范里。
- 该规范不会改变当前 active queue truth，也不会取代 target-plan/queue-doc 的 live execution authority；它只为未来同 target queue admission 和实施 closeout 提供稳定边界。

## 2026-07-07 Target Lifecycle Explicit-Open-Explicit-Close Rule

### Changed
- 更新 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md)，明确 target 生命周期不再由 queue 完成情况自动推断：
  - `open target` 在没有 explicit closeout confirmation 前持续保持 open
  - `active_queue = none` 只表示当前没有 active queue，不表示 target 自动关闭
  - 只要 target 仍是 `open`，就可以继续增加新的 same-target queue
  - `target_status` 从 `open` 变到 `done` 前，必须有一次明确的人类关闭确认
- 更新 [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-plan-template.md) 与 [docs/blueprints/templates/target-spec-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-spec-template.md)，把 explicit-open / explicit-close 规则和 “open target 仍可继续 admit 新 queue” 固化为模板默认语义。
- 更新当前 live [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md) 与 [docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md)，明确当前 modularization target 在没有 explicit human closeout confirmation 前保持 open，并允许继续承接新的 same-target queue。

### Impact
- target closeout 不再会被“所有 queue 都做完了”这类流程信号自动推导出来。
- 以后只要 current target 仍 open，就不需要为了继续同一时期工作而伪造 sibling target；可以直接在同一 target 下增加新的 queue。
- target closeout 现在从自动流程分支收口为“closeout-ready + 一次人工确认”。

## 2026-07-07 Queue Admission Startup Loop Closure

### Changed
- 更新 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md)，把“新增 Queue 的标准起手流程”正式写成硬规则：
  - fresh queue item 必须先读取当前真值链
  - 必须先检查是否已有 active queue 以及能否被当前 queue 吸收
  - `queue-candidate` 必须先进入 target-level admission，而不是先创建 queue doc 或先开始实现
  - queue activation 的固定顺序被写死为 `target-plan review sync -> queue doc activation -> target-plan active_queue sync -> implementation`
  - `execution_mode = single-active-task` 且 `allow_parallel = false` 时，禁止并行激活第二个 active queue
- 更新 [docs/blueprints/classification-rule-layer-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/classification-rule-layer-spec.md)，明确 `queue-candidate` 的默认去向是 admission，不是 implementation；并补入 recorded candidate 的 recovery rule，要求优先从既有 admission record 恢复。
- 更新 [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-plan-template.md)，加入：
  - admission startup rules
  - candidate recovery ledger
  - single-active-queue rule
- 更新 [docs/blueprints/templates/execution-queue-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/execution-queue-template.md)，去掉 `queue_status = candidate`，明确 queue doc 只承载 admitted queue truth，不再充当 pre-admission candidate 容器。
- 更新当前 live [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，补入 queue admission startup 与 candidate recovery 的当前期恢复规则。
- 更新 [tools/lint-blueprints.mjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/lint-blueprints.mjs) 与 [tests/blueprint-governance-lint.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/blueprint-governance-lint.test.cjs)，把以下低成本可静态拦截项纳入 lint：
  - queue doc 使用 `queue_status = candidate`
  - target plan 已写 `active_queue = none`，但 queue doc 已经先变成 `active`
  - target plan 已命名一个 `active_queue`，但 queue docs 没有唯一匹配的 active queue
  - active queue 已存在时，target plan 仍保留第二个 live admission review subject

### Impact
- 新增 queue 不再需要每次从头 full re-audit；只要 candidate 已经被结构化记录，后续默认从 admission record 恢复，只有 material recheck trigger 才允许重开 full audit。
- “未 admission 先建 queue / 先激活 queue / 先实现”的治理短路被进一步 fail-closed。
- 用户范围确认与 queue admission 的边界被继续硬化，避免 scope approval 再次漂移成执行授权。

## 2026-07-07 UI Runtime Contract Consumption Queue Closeout

### Changed
- 同步当前 live Blueprint 真值：
  - [docs/blueprints/queues/ui-runtime-contract-consumption-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/ui-runtime-contract-consumption-queue.md)
  - [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)
  - [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)
- `queue.ui-runtime-contract-consumption` 已从 `active` 收口为 `done`，其唯一 active task 已标记完成并补入 closeout decision 与 verification record。
- 当前 target 已从 `active-execution` 返回到 `open + idle-open`，当前无 active queue；下一合法执行点收口为“同 target 的 fresh work admission review 或显式 target closeout”。

### Impact
- 共享对话框提取与本轮限定替换点不再停留在代码已完成但治理未 closeout 的悬空状态。
- 后续若继续推进新的 UI 或 modularization 工作，必须重新经过 target-level classification / admission，而不能隐式复用已关闭 queue。

## 2026-07-07 Blueprint Admission And Closeout Fail-Closed Sealing

### Changed
- 更新 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md)，把以下漏洞提升为硬规则而非建议：
  - `queue-candidate` 不得在 `active_queue = none` 时跳过 admission 直接进入实现
  - 用户范围确认不等于 queue admission
  - 会改变 active truth 的 classification 不得停留在会话 prose，必须结构化写入 target plan
  - active task 验证通过且下一合法执行点唯一时，不得停在状态汇报，必须自动进入 auto-reconcile / closeout / target-review handoff
- 更新 [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-plan-template.md)，新增 admission review 承载字段：
  - `review_subject_id`
  - `review_subject_classification`
  - `proposed_queue_id`
  - `review_basis`
  - `admission_status`
- 更新 [docs/blueprints/templates/execution-queue-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/execution-queue-template.md)，把 queue doc 明确限制为“被 admission 后的执行真值载体”，不再允许 scope approval 直接替代 queue activation。
- 更新 [docs/blueprints/classification-rule-layer-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/classification-rule-layer-spec.md)，明确 classification layer 只能路由，不能自行授权实现；任何会改变 active truth 的 classification 都必须回写 target plan admission fields。
- 更新当前 live [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，补入 admission review 结构化字段，并将当前下一执行点从单纯 `resume-active-queue` 收口为 `auto-reconcile-active-task`，避免“验证完成却停在汇报”继续漂移。
- 更新 [tools/lint-blueprints.mjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/lint-blueprints.mjs) 与 [tests/blueprint-governance-lint.test.cjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/blueprint-governance-lint.test.cjs)，把当前可静态拦截的 admission / closeout 状态矛盾纳入 lint。

### Impact
- Blueprint 现在对 admission 的最小真值链是 fail-closed 的：没有 target-plan admission truth 和 admitted queue doc，就不能把 fresh `queue-candidate` 当作实现授权。
- target plan 不再只靠 prose 说明“正在审查什么”；当前 admission 审查对象已经有结构化承载位。
- “做完了是否继续 closeout / promotion review / 文档同步”这类低价值询问，在唯一合法分支已明确时被正式禁止。
- 当前 lint 已可直接拒绝多类静态治理短路，但仍把“会话执行顺序本身”的更强自动阻断列为明确治理债务，而不是继续留在口头提醒层。

## 2026-07-07 Blueprint Governance Model Hardening

### Changed
- 重写 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md)，把 Blueprint 恢复链正式收口为 `project-progress -> blueprint -> target plan -> active queue -> active task`，并把 `target plan` / `queue doc` 固定为 target 层与 queue 层的唯一 live governor。
- 重写 [docs/blueprints/classification-rule-layer-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/classification-rule-layer-spec.md)，让 classification layer 明确依附新的 single-writer Blueprint 模型，只负责路由，不再冒充 live execution controller。
- 将 P0/P1 Blueprint 约束草案正式落库：Control Block 独占执行真值，`decision_state`/`target_status` 从上游镜像中收口，`promotion_review_result` / `resume_gate` / `next_effect` 等字段改为结构化约束。
- 按 B 方案继续收紧 Blueprint 真值字段：`project-progress.next_step` 改为枚举 `entry_action`，`target plan.next_legal_action` 改为枚举 `next_action`，并移除 target plan 的 live `Current Decision` 解释区。
- 将 target spec / target-spec template 的 `Queue Portfolio` 改为 `Queue Contract Portfolio`，移除 `State` / `Source` 这类 runtime / history 混合列，收口为纯 contract 表。
- 新增 [tools/lint-blueprints.mjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/lint-blueprints.mjs) 与 `npm run lint:blueprints`，把 Blueprint 一致性检查从“人工遵守”推进到“脚本拒绝漂移”。
- 新增 [tools/validate-commit-message.mjs](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/validate-commit-message.mjs)、[.githooks/commit-msg](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.githooks/commit-msg) 与 [/.github/workflows/validate-commit-messages.yml](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.github/workflows/validate-commit-messages.yml)，把“每次 git 提交都必须带内容概述”从口头要求升级为仓库级 commit-msg / CI 双重门禁。
- 重写 Blueprint 模板族：
  - [docs/blueprints/templates/project-progress-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/project-progress-template.md)
  - [docs/blueprints/templates/blueprint-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/blueprint-template.md)
  - [docs/blueprints/templates/target-spec-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-spec-template.md)
  - [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-plan-template.md)
  - [docs/blueprints/templates/execution-queue-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/execution-queue-template.md)
- 重写当前 live 文档：
  - [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)
  - [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)
  - [docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md)
  - [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)
- 当前 modularization target 不再用“所有已知 queue 都关闭”来直接推导 `done`；现改为 `open + idle-open`，使当前 target 在 `active_queue = none` 时仍可通过 promotion-review 接纳新 queue。
- 清理关闭 queue 文档中的误导性 live/historical 混写：`Current Queue` 改为 `Historical Task Ledger`，关闭记录中的 `Resume ...` 改写为历史性 handoff 描述，不再冒充当前执行指令。
- `docs/change-log.md` 自身在治理模型中降级为历史镜像层，不再被 Blueprint 规范声明为 promotion / closeout gate。
- 进一步确认 `docs/change-log.md` 的正式定位为“历史记录 + 人类可读摘要”，并从 Blueprint 正式约束中移除它作为 fixed sync order 强制节点与治理必扫项的角色。
- 更新 [docs/superpowers/README.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/README.md) 与 [docs/superpowers/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/project-progress.md)，把它们显式标成 Blueprint 之后的 legacy / historical 入口。
- 批量修正多份 legacy `docs/superpowers/plans/**` 与 `docs/superpowers/specs/**` 顶部的恢复提示，避免单独打开旧文件时仍把 `docs/superpowers/project-progress.md` 误读成当前仓库的默认恢复入口。

### Impact
- 当前恢复执行不再需要从 `change-log`、旧 `docs/superpowers/**` 或关闭 queue 叙事中推断真值。
- `project-progress` 和 `blueprint` 已移除高漂移 completed registry 与 queue-local truth，live 状态只保留必要入口字段。
- task 完成后的自动动作、queue/target closeout、人工确认频率限制、以及 `mod-first-dev` 集成闭环都已经进入 Blueprint 规范与 target plan 的显式规则层。
- 当前仓库级 git 提交也不再允许只有标题没有正文概述；普通 commit 与 merge commit 都必须使用 `<type>: <brief title>` + `Summary:` bullets。

## 2026-07-06 Blueprint Workflow Spec

### Added
- 新增 [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md)，正式定义新的 Blueprint 工作流，作为后续仓库治理与执行恢复的唯一新流程来源。
- 新建 `docs/blueprints/` 目录，作为新工作流的规范根目录，预留 `project-progress.md`、`blueprint.md`、`queues/`、`specs/`、`plans/`、`templates/` 等后续标准位置。
- 新增 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md) 作为全局恢复入口，以及 [docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md) 作为单一当前 owner 文档。
- 新增 [docs/blueprints/queues/blueprint-workflow-bootstrap-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/blueprint-workflow-bootstrap-queue.md)，用于把新工作流从规则源文档引导到第一个真实 topic。
- 新增 [docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md)，把当前时期的正式 target 固定为项目“完全 Mod 化”，并显式写入 target 级验收标准。
- 新增 [docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md)，作为当前时期 target 的 target-level governor。
- 新增 [docs/blueprints/queues/core-production-integration-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/core-production-integration-queue.md)，作为单一 `mod化` target 下的首个真实迭代任务队列。
- 新增 Blueprint 模板族：
  - [docs/blueprints/templates/project-progress-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/project-progress-template.md)
  - [docs/blueprints/templates/blueprint-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/blueprint-template.md)
  - [docs/blueprints/templates/execution-queue-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/execution-queue-template.md)
  - [docs/blueprints/templates/target-spec-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-spec-template.md)
  - [docs/blueprints/templates/target-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/templates/target-plan-template.md)

### Changed
- 明确旧 `docs/superpowers/**` 工作流文档从现在起只作为历史参考，不再作为新执行的主治理入口。
- 新工作流术语收口为 `project-progress -> blueprint -> target spec -> target plan -> task queue -> execution artifacts`。
- Blueprint 允许跨不同时期存在多个 target，但同一时期只保留一个 current target；当前时期正式目标固定为项目“完全 Mod 化”，后续同时期迭代事项不再提升为 sibling target，而是进入不同 queue。
- 可执行单元从 Blueprint target 下沉为 queue task，状态模型固定为：`candidate`、`queued`、`active`、`blocked`、`done`、`dropped`。
- 当前“完全 Mod 化” target 已补入 phase 级验收框架：`Phase 1 Runtime Closure`、`Phase 2 Contribution Closure`、`Phase 3 Authoring Closure`、`Phase 4 Final Mod-First Acceptance`；phase 只作为 target 内部验收结构，不新增新的治理入口层。
- 当前 target plan 已为各 queue 家族补入轻量定义卡片，统一记录 `Goal / Promote when / Out of scope / Done when`，避免候选 queue 只有名称而缺少启动与关闭条件。
- `core-production-integration` queue 已从粗粒度任务列表补强为 task execution contract 结构，为每个正式 task 明确 `Purpose / Must examine / Required output / Done when / Verification / Failure mode`。
- `core-production-integration` 的 engine owner-line 已按实际代码状态收口为 retirement：删除了未接生产启动流的 `src/core/engine/**` 及其孤立 supporting types，并把回归从“engine skeleton 存在”改为“orphaned engine seam 已退役”。
- `core-production-integration` 的 save-envelope-cutover 已接出第一条真实浏览器存档链：新增 `src/core/save/browser-save-record.ts`，让 `main.ts` 通过 save envelope 读写 `selectedCharacterId / selectedModId / selectedModSource`，并在 startup-session apply 与 `beforeunload` 时写入浏览器存储。
- `core-production-integration` 的 runtime-ownership-closeout 已完成：当前不再需要单独提升 `state-sync-and-runtime-canonicalization`，因为 `commitRuntimeRequest() -> dispatchRuntimeRequest()` 仍是覆盖范围内的生产 write-back 主线，而剩余直接 `gameState`/view 切换更接近 shell-thinning residue。
- 已新增 [docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md) 作为新的 Phase 1 active queue，并按当前 `main.ts` 残余实况拆出第一版任务：view transition ownerization、travel/auto-advance ownerization、render-prepass ownerization、以及 queue closeout。
- 已新增 [src/application/runtime/city-view-transition.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/runtime/city-view-transition.ts)，把 `leave-city / enter-city-3d / leave-city-3d` 这组三段覆盖范围内的视图切换与 `world/ui` 清理从 `main.ts` 提取为独立 owner seam；对应 queue 已将 active task 推进到 `travel-and-auto-advance-ownerization`。
- 已新增 [src/application/runtime/campaign-travel-transition.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/runtime/campaign-travel-transition.ts)，把 `startCampaignTravel()` 中覆盖范围内的 travel-start 与 travel-completion app-state 变更从 `main.ts` 提取为独立 owner seam；`travel-and-auto-advance-ownerization` 任务当前仍保持 `active`，后续继续处理 map auto-advance residue。
- 已新增 [src/application/runtime/map-auto-advance-transition.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/runtime/map-auto-advance-transition.ts)，把 `startMapAutoAdvance()` 中覆盖范围内的启动态和 snapshot 应用态从 `main.ts` 提取为独立 owner seam；`travel-and-auto-advance-ownerization` 已完成，当前 active task 已推进到 `render-prepass-ownerization`。
- 已新增 [src/application/runtime/render-prepass-state.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/runtime/render-prepass-state.ts)，把 `renderAppFrame()` 中直接通过 `ensureCityNpcPoolsForCurrentDay()` 回写 `appState.gameState` 的 prepass mutation 提取为独立 seam；`render-prepass-ownerization` 已完成。
- `shell-thinning-and-final-ownerization` 已正式收口：当前 `main.ts` 剩余的直接写入主要属于 shell 级 UI/事件编排、startup-time app-state assembly、或极窄兼容 handoff，暂时不再单独提升 `state-sync-and-runtime-canonicalization` 或 `startup-builder-ownerization`。
- 已新增 [docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md)，作为新的 Phase 2 active queue，并按当前实况把 builtin-first 生产特权收口为第一版任务梯度：`baseline-reconcile -> builtin-registry-and-loader-audit -> runtime-consumer-deprivileging -> queue-closeout`。
- 当前 Phase 2 的实际打开依据已明确记录：builtin house/playable 仍通过静态 builtin registry seed 进入生产路径，startup 仍有 hardwired builtin-default activation，UI reserve / schema / layout / skin / asset catalog 仍以 builtin baseline 预载方式参与生产消费，因此先正式提升 `builtin-content-deprivileging-closeout`，而不是直接跳到 `unified-contribution-intake-closeout` 或 `first-party-mod-acceptance`。
- `builtin-content-deprivileging-closeout` 的 baseline-reconcile 已完成：当前第一优先级 blocker 已收口为 house/playable 静态 builtin registry seed、startup 直构 builtin loaded mod、以及默认 base-pack bootstrap；UI reserve layering 目前先按显式 framework baseline 处理，后续仅在更强证据出现时再升级为 blocker。
- 已更新 [src/main.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/main.ts)，把 builtin startup 与 builtin save-source reload 从 startup-time `createLoadedModFromManifest(...)` 直构切到共享 `mod.load-builtin + builtinModsById` loader seam，并为其补入新的 robustness 回归；当前 `builtin-registry-and-loader-audit` 仍继续，下一步聚焦静态 builtin house/playable registry seed。
- 已新增 [src/core/registry/builtin-house-module-registry.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/registry/builtin-house-module-registry.ts)、[src/core/registry/builtin-playable-definition-registry.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/registry/builtin-playable-definition-registry.ts)、[src/core/registry/builtin-playable-integration-registry.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/registry/builtin-playable-integration-registry.ts)，并把 builtin static seed ownership 从通用 core registry 文件中拆出到显式 builtin installer 模块；对应 runtime/presenter/view 消费方已改为通过这些显式 builtin seam 读取默认注册表，`builtin-registry-and-loader-audit` 因而可以收口并推进到 `runtime-consumer-deprivileging`。
- 已更新 [src/application/content/default-runtime-content.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/content/default-runtime-content.ts) 与 [src/main.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/main.ts)，让 default runtime content 不再自带 `createBaseGameContentPack()` builtin self-load，而是改为由 `main.ts` 显式注入当前默认 pack；这使 `runtime-consumer-deprivileging` 的第一条 builtin-preloaded consumer 路径已经收窄，后续重点转向 active-content bootstrap 与 UI reserve baseline 的剩余 disposition。
- 已更新 [src/core/mods/mod-runtime.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/core/mods/mod-runtime.ts)、[src/application/content/active-game-content.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/content/active-game-content.ts)、[src/application/startup/startup-session-coordinator.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/startup/startup-session-coordinator.ts) 与 [src/main.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/main.ts)，让 scenario activation 可以保留 `base + scenario` 的多 content source activation 结果，并把 active content context 的启动装配改成直接从 `activationResult.normalizedContentSources` 组装，而不再额外传入 `basePack`；这进一步收窄了 active-content/bootstrap 的 builtin handoff residue。
- `builtin-content-deprivileging-closeout` 已正式收口：经最新 source-path audit 确认，主 startup/runtime 路径并不会消费 `src/application/ui/ui-contract-registry.ts` 或 `src/content/ui/**` 这套 reserve family；当前真实 runtime `uiLayouts` 仍直接来自 [src/content/layout-editor-presets.ts](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/content/layout-editor-presets.ts) 的显式 baseline，因此 UI reserve layering 暂按 framework/editor baseline 记录，而不是继续作为 builtin-only 生产特权 blocker。
- Blueprint 全局入口链已同步到“当前无 active queue，等待下一次 target-level promotion 决策”的状态：`project-progress.md`、`blueprint.md`、当前 target plan 与 target spec 都改为以 `builtin-content-deprivileging-closeout` 的 closeout 记录作为最新 Phase 2 证据。
- Blueprint 工作流现已正式切到 AI-first 定义：`project-progress.md`、`blueprint.md`、当前 target spec/plan、以及当前仍承载 promotion 真值的关闭 queue 文档都新增了 `## Control Block`，并把 `active_queue = none`、`active_task = none`、`promotion-review` 这类执行真值结构化为机器可读状态。
- [docs/blueprints/blueprint-workflow-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint-workflow-spec.md) 已重写为 AI-first authoritative spec，正式定义 `Blueprint = execution index`、`Target = version delivery unit`、`Queue = execution decomposition unit`、`Task = smallest executable governance unit`，并补入 paused promotion、candidate gating、drift stop、remote integration 等规则。
- Blueprint 模板族已同步重构为 AI-first 形态：所有模板默认输出 `Control Block + Human Context`、结构化 task block、candidate gate 和 closeout decision block，避免新 queue 再退回 prose-first 文档。
- 已新增 [docs/blueprints/classification-rule-layer-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/classification-rule-layer-spec.md)，作为 AI-first Blueprint 之上的追加 classification layer，用规则驱动方式把新事项先路由到 `current-target-item / queue-candidate / content-pipeline-item / asset-pipeline-item / future-target-candidate / uncertain-needs-review / historical-residue / out-of-scope`，而不是默认塞进当前 queue。
- 当前 Blueprint、Project Progress、Target spec/plan 与 queue/template 结构都已挂接 classification layer：Blueprint 提供规则层入口和 low-confidence fallback，Target 提供 target-specific classification overrides，Queue/template 提供 allowed/reject item classifications，从而让 AI 先分类、再决定是否 promotion。
- 当前 target-level promotion review 已正式拒绝立即提升 `queue.unified-contribution-intake-closeout`：新鲜 intake audit 证明已审计的贡献家族仍通过共享 `gameplay contribution contract -> mod manifest contribution declaration -> mod runtime contribution installation -> shared registry families` 进入生产路径，因此该 queue 仅保留为 conditional fallback，治理下一步切换到 `Phase 3: Authoring Closure`，评审 `queue.authoring-entrypoint-and-fail-closed-closure` 是否真的需要提升。
- 已新增 [docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md)，并正式把它提升为当前 active Phase 3 queue：最新 authoring audit 确认 `playable` 已具备 scaffold/validator/CI 入口，但 `scenario-pack/default-pack/house-family` 仍依赖手工目录、catalog、builtin adapter 与 registration glue，因此当前 active work 切到 `scenario-pack-and-default-pack-entrypoint-closure`。
- `blueprint-workflow-bootstrap` 已从进行中 handoff queue 收口为 `done` 历史记录，当前仓库真实执行入口已经切到“单一 mod 化 target + active queue”模型。
- `core-production-integration` 已从错误的同时期 sibling target 回收为当前“完全 Mod 化” target 下的首个迭代任务队列。

### Impact
- 后续新治理文档、恢复入口和执行计划应落在 `docs/blueprints/**`，而不是继续在 `docs/superpowers/**` 中追加新的 weekly/queue 控制器。
- 仓库当前不再只是“新工作流规则源文档”落地，而是已经有真实当前时期“完全 Mod 化” target、target-level governor、显式 target 验收标准，以及可继续追加的 queue 结构，可从 `docs/blueprints/project-progress.md` 直接恢复执行。
- 当前 Blueprint 已不再要求 AI 先读长段历史再推断下一步；只读 Control Block 即可识别当前 target、当前无 active queue 的 promotion-review 状态、以及下一个合法决策点。
- 后续若要继续推进新的 queue family，应先在 target-level promotion note 中写明证据，再把对应 queue 从 candidate/conditional 正式提升，而不是直接从 narrative prose 进入执行。
- 后续新出现的 code/content/asset/UI/framework/runtime/authoring 事项，不应再默认归入当前 target 或当前 queue；应先走 classification record，再根据 confidence 与 matched rules 路由到 queue 候选、pipeline 项、未来 target 候选或人工复核。
- 旧 superpowers 文档仍保留供历史边界和验证脉络参考，但不会再被视为当前执行顺序的权威来源。

## 2026-07-07 Phase 4 Residue Closeout And Acceptance Promotion

### Added
- 新增 [docs/blueprints/queues/first-party-mod-acceptance-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/first-party-mod-acceptance-queue.md)，作为当前 active 的 Phase 4 acceptance-proof queue，用于收口 builtin content 是否已经能被诚实描述为 first-party mod production path。

### Changed
- [docs/blueprints/queues/historical-residue-disposition-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/historical-residue-disposition-queue.md) 已正式 closeout：shell residue、builtin framework baseline、legacy scenario-pack compatibility residue 与 later-acceptance review 现在统一沉淀为一份关闭记录，不再继续作为 active controller。
- Blueprint 入口链 [docs/blueprints/project-progress.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/project-progress.md)、[docs/blueprints/blueprint.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/blueprint.md)、当前 target spec/plan 已先后从 `queue.historical-residue-disposition` 切到 `queue.first-party-mod-acceptance`，并在 acceptance proof 写成后继续推进到 `task.first-party-mod-acceptance.queue-closeout`。
- 当前 target 的 Phase 4 解释也已收口为：残余处置完成，接下来先做 builtin-versus-first-party acceptance baseline，而不是直接跳到 final closeout 或重新打开更早期实现队列。
- 当前 Phase 4 acceptance-proof 记录也已补齐：共享 builtin loader、activationResult-driven active content assembly、显式 builtin registry seed、UI baseline residue 与 legacy builtin scenario-pack compatibility residue 现在都被写入同一份 acceptance matrix；`queue.first-party-mod-acceptance` 随后已正式 closeout，并把当前 active controller 推进到新建的 [docs/blueprints/queues/final-acceptance-closeout-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/final-acceptance-closeout-queue.md)。
- `queue.final-acceptance-closeout` 的 baseline-reconcile 现也已完成：target-level recheck 确认 required queues 的 closeout 证据仍然 coherent，且当前剩余工作已收窄为 target-level acceptance writing，而不是重新发现新的实现型 blocker。

### Impact
- 当前这轮 Phase 4 active work 曾从“历史残余同步”推进到“最终目标验收收口”，并一度进入 `queue.final-acceptance-closeout`。
- 当前 `queue.final-acceptance-closeout` 现也已正式 closeout：target 级 acceptance-ready 结论已经完成同步，`target.project-complete-modularization` 现已标记为 `done`，Blueprint 入口链也已回到合法的 `no-active-queue` promotion-review 状态。
- 后续若再出现新的仓库级 modularization 工作，应先回到 classification / promotion-review，而不是继续把工作塞回已经关闭的 final closeout queue。

## 2026-07-06 Fail-Closed Progress-Driven Governance Spec

### Added
- 新增仓库级治理 spec：[docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md)，把后续执行模型从 `weekly plan / weekly set / weekly orchestration` 切换为以 `项目进度文档` 为唯一续接真相源的 fail-closed 工作流。

### Changed
- 明确规定：如果 closeout 不能唯一推出 `next child / next action / next entry document`，则当前 child 或 task 不得标记为 `closed`。
- 明确规定：child closeout 必须同时满足结构化 closeout、项目进度同步、next child recheck/none、以及远端 push 成功等硬门禁，否则只能停留在 `running`、`blocked` 或 `completed-but-open`。
- 明确规定：旧 `weekly` 治理文档后续只作为历史记录保留，不再作为当前执行入口或当前队列控制器。
- `docs/superpowers/specs/plan-governance-spec.md`、`docs/superpowers/README.md`、`docs/superpowers/plans/_plan-template.md`、`docs/superpowers/plans/_playable-plan-template.md`、`AGENTS.md` 与 `tools/lint-superpowers-plans.mjs` 已同步切到新模型，避免 spec、入口说明、模板和结构化校验继续各说各话。
- 新增 `docs/superpowers/project-progress.md` 与 `docs/superpowers/templates/project-progress-template.md`、`child-closeout-template.md`、`task-closeout-template.md`，把唯一续接真相源与标准 closeout 输出格式正式落库。
- `docs/superpowers/templates/weekly-*.md` 现已显式标记为历史模板，避免后续再被误当成当前执行入口。
- `docs/superpowers/specs/weekly-orchestration-spec.md` 已显式降级为历史 spec，避免它继续和新治理 spec 形成并列入口。
- 第三轮去歧义清扫已为仍保留旧 `weekly` 术语的历史 child plan / design spec 批量补上 `Legacy Governance Context` 头注，明确这些文件只保留技术与历史语境，不再充当现行治理入口。

### Impact
- 后续治理重构将围绕 `docs/superpowers/project-progress.md`、child plan 模板、closeout 模板与 plan governance spec 展开，而不是继续修补旧 weekly 模型。
- 这次 spec 为正式弃用 weekly plan 提供了仓库内的第一份主规范，后续 README、模板、lint 约束与历史文档定位都将按它收敛。

## 2026-07-02 Spine Plugin Workflow Contract

### Added
- 新增 `docs/spine-plugin.md`，记录 Spine 节点时间轴/绑定管理工具的启动方式、绑定编辑规则、物块图片来源和 JSON 保存交接规则。
- 新增项目内 Codex skill `.codex/skills/start-spine-plugin/SKILL.md`，用于在用户输入“启动spine插件”等请求时自动启动 `tools/spine-node-timeline-editor.html` 对应的 Vite 服务并说明用法。

### Changed
- `AGENTS.md` 新增 Spine 插件触发规则，明确该请求不属于 house work，优先使用项目内 skill。
- Spine 工具协作约定收口为：新增物块图片必须位于 `src/faxian/leg/`，JSON 保存 `leg:` 图片引用和绑定数据，不再把新上传图片内嵌为 base64。

### Impact
- 后续拉取仓库的 Codex 会话可以通过“启动spine插件”进入固定启动流程。
- 复制/导出 JSON 适合提交给 Codex 修改骨骼、绑定、物块变换和动作数据；图片文件本体仍由项目目录管理。

## 2026-07-03 Child 34 Playable Enforcement And Legacy Closeout

### Added
- 新增 `tools/scaffold-playable.mjs`、`tools/scaffold-playable-integration.mjs` 与 `tools/validate-playables.mjs`，把新 playable mechanic、scenario/integration artifact 与仓库级 fail-closed 校验收口到统一 CLI。
- 新增 `.github/workflows/validate-playables.yml`，让 playable artifact 校验在 push / pull request 时进入独立 CI gate。
- 新增 Child 34 定向回归测试，锁定 `package.json` 必须暴露 `scaffold:playable` / `scaffold:playable-integration` / `validate:playables` 三个入口，并要求 scaffold 产出 canonical artifact 与 validator 能拒绝缺失 outcome 条件的 integration 配置。

### Changed
- `package.json` 现已提供 `npm run scaffold:playable`、`npm run scaffold:playable-integration` 与 `npm run validate:playables`，后续新增 playable 不再依赖人工分散找目录、文件名或校验入口。
- `src/core/runtime/interactive-runtime.ts` 删除了已无生产调用方的 `createLaunchInteractiveRequest()` helper；`activity-qte` 与 `city-begging` 的兼容 action id 仍然保留，避免在 Child 34 误删尚未退役的 compatibility seam。
- `src/main.ts` 与已有 robustness 回归已同步收窄到 Child 34 的真实 closeout 边界：只移除已废弃 launch helper，不把仍活跃的 covered compatibility path 伪装成“已完成迁移”。
- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md` 与 Child 34 / weekly orchestration 计划现已记录仓库实际采用的 artifact 目录、脚手架命令、validator 与 CI gate 路径。

### Impact
- 仓库现在对 playable 新增和迁移形成了真正闭环：创作者或 AI 不需要再决定“文件放哪、资源放哪、怎么接校验”，而是通过 framework-owned scaffold 进入统一位置，再由 validator/CI 守约。
- 第一轮 playable-runtime migration queue 至此闭合：`activity-qte`、`city-begging`、`grain-accounting`、`medicine-compounding`、`story-battle` 的统一 runtime proof 已完成，剩余兼容层只保留当前仍在生产路径上有调用方的 action seam。

## 2026-07-03 Child 33 Battle-Family Playable Migration

### Added
- 新增 `src/application/playables/story-battle/story-battle-definition.ts`，把 `story-battle` 的 battle-family launch、action、exit、settlement 与回返语义包进 shared playable wrapper，而不是继续让 `interactive-runtime` 直接持有 battle 业务。
- 新增 Child 33 定向回归测试，锁定 story callback 启动 battle 时必须写入 shared `runtime.playableSession`，并要求 story-battle 结算必须通过 playable-runtime 清空该 session 且返回正确的 keep-house reentry。

### Changed
- `src/application/story/story-callbacks.ts` 现已通过 battle-family playable wrapper 启动 `story-battle`，不再直接把 `storyBattle` 会话启动逻辑当作 story callback 的本地 owner。
- `src/core/runtime/playable-runtime.ts` 现已接管 `story-battle` 的 action/exit/settlement，并允许 battle-family completion 通过 shared runtime result 发出 `reenter-house` handoff。
- `src/core/runtime/interactive-runtime.ts` 对 `story-battle` 已收窄为 compatibility delegation layer；legacy `interactive.story-battle.action` 仍可用，但最终 owner 已切到 playable-runtime。
- `src/main.ts` 的 battle action dispatch 现已通过 `createPlayableActionRequest("story-battle", "battle-action")` 与 `runPlayableRuntime()` 进入 shared playable path，而不再把 `story-battle` 当成 interactive-runtime 专属业务分支。

### Impact
- 仓库现在已经完成 `activity-qte`、`city-begging`、`grain-accounting`、`medicine-compounding`、`story-battle` 五条既有 playable 路径的统一 runtime proof，并且明确保留了 `story-battle` 的 `family: "battle"` 边界。
- 后续 playable 迁移只剩 Child 34 的 enforcement / validator / legacy closeout；battle-family 本身不再需要继续停留在 `interactive-runtime` 的直接 owner line 上。

## 2026-07-03 Child 32 House-Local Mechanic Promotion

### Added
- 新增 `src/application/playables/house-playable-runtime-bridge.ts`，为 house module 提供 shared `gameState + houseSession -> RuntimeState` 桥接，避免 house-local playable 再造一套独立 runtime carrier。
- 新增 `src/application/playables/grain-accounting/grain-accounting-definition.ts` 与 `src/application/playables/medicine-compounding/medicine-compounding-definition.ts`，把粮铺算账与药铺配药的 launch/action/tick/settlement 收口到 shared playable definition 层。
- 新增 Child 32 定向回归测试，锁定 `grain-accounting` 与 `medicine-compounding` 的 launch 必须写入 shared `runtime.playableSession`，settlement 后必须清空该 session 且仍返回正确的 house result overlay。

### Changed
- `src/core/registry/playable-definition-registry.ts` 与 `src/core/registry/playable-integration-registry.ts` 现已纳入 `grain-accounting` 与 `medicine-compounding`，并为两条 house-owned mechanic 建立正式 `integrationId`。
- `src/core/runtime/playable-runtime.ts` 现已接管这两个 house-local mechanic 的 launch/action/finish/exit lifecycle，不再只覆盖 covered interactive playables。
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts` 与 `src/application/house-modules/medicine-house/medicine-house-house-module.ts` 已收窄为 host integration owner：它们继续决定何时触发、何时回到本 house，但具体 mechanic state progression 与 settlement 已委托给 shared playable runtime。
- `docs/special-house-interface.md` 现已明确：house-owned reusable playables 必须通过 shared playable runtime launch/settlement，而不是继续在单个 house module 内维持永久的私有 mechanic runtime。

### Impact
- 仓库现在已经证明 shared playable runtime 不只适用于 covered interactive 路径，也能承接 house-local mechanic，而不需要把 `main.ts` 或 house runtime 重新改回 concrete house business owner。
- `grain-accounting` 与 `medicine-compounding` 迁移完成后，下一条合法 promotion 路径只剩 `story-battle` 的 battle-family child；`Child 34` 仍必须保持 enforcement/legacy closeout 边界，不能被提前打开成 battle migration 的替代品。

## 2026-07-03 Child 31 Covered Interactive Playables Migration

### Added
- 新增 `src/application/playables/activity-qte/activity-qte-definition.ts` 与 `src/application/playables/city-begging/city-begging-definition.ts`，把 `activity-qte` 与 `city-begging` 的 launch/session/result state handler 正式包进 shared playable definition wrapper。
- 在 `src/domain/game-state.ts` 与 `src/application/state/create-initial-state.ts` 增加 shared `runtime.playableSession` carrier，作为 playable-runtime 拥有的统一 active session write-back 路径。
- 新增 Child 31 定向回归测试，锁定 covered activity-qte launch、activity-qte closeout、以及 city-begging settlement 都必须经过 shared playable session 和 playable-runtime lifecycle。

### Changed
- `src/application/activity/activity-runner.ts` 现在通过 playable definition wrapper 启动 generic activity QTE，不再直接把 concrete activity session 写进旧路径。
- `src/core/runtime/playable-runtime.ts` 现已接管 `activity-qte` 与 `city-begging` 的 covered lifecycle mutation、action dispatch、exit closeout 与 city-begging settlement。
- `src/core/runtime/interactive-runtime.ts` 对 `activity-qte` 和 `city-begging` 已收窄为 compatibility delegation layer；`story-battle` 仍保持原边界，等待后续 battle-family child 处理。

### Impact
- 仓库现在已经证明 shared playable runtime 不只是 launch skeleton，而是能真实承接短流程 minigame-family 的 session ownership、action routing 与 settlement write-back。
- `grain-accounting`、`medicine-compounding` 与 `story-battle` 仍未被这轮吞并；后续必须分别按 Child 32 和 Child 33 的边界推进，而不是回头继续扩大 Child 31。

## 2026-07-03 Child 30 Playable Runtime Skeleton And Integration Registry

### Added
- 新增 `src/core/contracts/playable-runtime.ts`，正式定义 `playableId / integrationId / ownerContext / launch / session / settlement` 这一组共享 playable skeleton contract。
- 新增 `src/core/registry/playable-definition-registry.ts` 与 `src/core/registry/playable-integration-registry.ts`，提供 builtin playable definition registry 和 scenario-owned integration-instance registry 的第一版安装面。
- 新增 `src/core/runtime/playable-runtime.ts`，提供 `createLaunchPlayableRequest()`、`resolvePlayableLaunchRequest()`、legacy compatibility session shell，以及统一的 launch normalization seam。
- 新增 Child 30 定向回归测试，锁定 playable contract、definition registry、integration ambiguity fail-closed 规则，以及 `interactive-runtime` 可以通过新的 playable launch seam 启动 covered session。

### Changed
- `src/core/contracts/interactive-runtime.ts` 现已为 active interactive session 补入 `playable` session shell，并要求 launch request 携带经过规范化的 `playableLaunch`。
- `src/core/runtime/interactive-runtime.ts` 不再只靠硬编码 launch/action branch 识别 covered playables；external launch 现在先经过 playable launch normalization，再回到当前兼容路径执行具体 city-begging/activity/story-battle 行为。
- `src/main.ts` 已把 city-begging 的启动入口从 concrete `interactive.city-begging.launch` 字符串收窄到 `createLaunchPlayableRequest("city-begging")`，为后续 Child 31 的 covered playable migration 提前建立 playableId-based intake。

### Impact
- 仓库现在第一次具备了统一 playable runtime 的真实代码骨架，而不再只有文档约束；后续 Child 31-34 可以在这条 skeleton 上继续迁移 covered playables、house-local mechanics 和 `story-battle`。
- 这轮仍然保持 compatibility-first：具体 reducer/presenter/settlement 逻辑还没有迁到 definition-driven playable modules，避免 Child 30 在同一批里膨胀成全量迁移。
- 后续若要继续推进 playable runtime，必须先对 Child 31 做 fresh baseline recheck，再显式 promotion，不能直接跳到 Child 32-34 或把 concrete migration 重新塞回 Child 30。

## 2026-07-03 Child 24 Main Runtime Orchestration Ownerization

### Added
- 新增 `src/application/runtime/main-runtime-orchestrator.ts`，为 `main.ts` 提供显式 `MainRuntimeOrchestratorRequest / Result` seam，把 startup session apply、story timing follow-up、scene progression / choice、以及 passive story trigger sync 收口到一个独立 orchestration owner。
- 新增 Child 24 ownership 回归测试，锁定 `main-runtime-orchestrator` 模块必须存在、`main.ts` 不得继续直接内联 startup apply / scene choice progression / render-time passive trigger 逻辑，并把 Child 15 / 16 / 23 的结构化 guard 放宽到接受新的 orchestrator seam。

### Changed
- `src/main.ts` 现在通过 `createMainRuntimeOrchestrator()` 委托 covered startup session apply，不再在 `applyActivatedModSession()` 本地持有 `syncActivatedContentSource()` + `createAppState()` + house runtime recreation 这一段业务编排。
- `src/main.ts` 现在通过 `main-runtime-orchestrator` 委托 covered story / event / scene follow-up：`city-enter` story handoff、scene advance、scene option choice 不再直接调用 `runStoryTriggerRuntime()`、`advanceStorySceneStep()` 或 `chooseStorySceneOption()`。
- `src/main.ts` 的 `renderApp()` 现已拆成 “显式 orchestration sync + 纯 render frame” 结构；被动 `indoor-screen-shown` story trigger 不再在 presenter pre-pass 中以内联 helper 形式修改 gameplay state。
- Child 24 没有重开 `state-sync-runtime.ts` 的 covered runtime commit sink；`commitRuntimeRequest()` 仍然是 covered runtime request 的正式 write-back 路径，本轮只把 shell 侧 follow-up owner 从 `main.ts` 移到了新的 orchestrator seam。

### Impact
- Child 24 已把这轮目标中的 `main.ts` runtime 编排权显式收窄：shell 仍负责输入和 render scheduling，但 covered startup/session apply、story timing follow-up、scene progression、以及 passive trigger sync 已不再由 `main.ts` 直接主导。
- 这轮没有扩张到 presenter/render redesign、`MainUiFlow` redesign、task/house contract 扩张、或 registry/mod manifest 新族；如果后续还要继续瘦 `main.ts`，必须从 fresh weekly review 重新证明那是不同问题类型。

## 2026-07-03 Child 23 Main Startup Orchestration Extraction

### Added
- 新增 `src/application/startup/startup-session-coordinator.ts`，把 builtin startup、continue/restore、以及 scenario import/start 的 request/result contract 收口到一个显式 coordinator seam，并为 `main.ts` 提供统一的 startup session bootstrap surface。
- 新增 Child 23 ownership 回归测试，锁定 startup coordinator 模块必须存在、`main.ts` 必须改为委托 `runStartupSessionCoordinator()`、以及 Child 22 的 continue/restore/bootstrap parity guard 不能在这轮抽离中退化。

### Changed
- `src/main.ts` 现已把 startup-family 的主决策树从本地 helper 中抽离出来：builtin startup、continue、restore、scenario summary import、scenario file import 都改为通过 `runStartupSessionCoordinator()` 解析 activation/bootstrap，再由 `main.ts` 只负责 loading shell 和最终 session 应用。
- `src/main.ts` 的 activated-session bootstrap helper 现已收口为直接消费 coordinator 返回的 `playerCharacterId + appState + activationResult`，不再在多个 startup entry 函数里各自拼装 fallback player/app-state 逻辑。
- `tests/robustness.test.cjs` 现已把 Child 22 的 continue guard 放宽到允许 direct coordinator delegation，确保新的 startup owner line 不会被旧 helper 名称绑定住。

### Impact
- Child 23 已把 `startup / continue / restore / scenario import` 的 primary orchestration owner 从 `src/main.ts` 挪到独立 coordinator seam，同时保持 `renderApp()`、runtime settlement、`MainUiFlow` 和后续 runtime follow-up 边界不变。
- 这轮没有继续扩张到 render orchestration redesign、save contract 新族、或更大的 `main.ts` thin-shell 改造；若还要继续拆主入口，必须从新的 weekly review 重新证明是不同问题类型。

## 2026-07-02 Child 21 Unified Gameplay Contribution Registry

### Added
- 新增 `src/core/contracts/gameplay-contribution.ts`，正式定义 mod-facing `GameplayContributionDeclaration` 与 activation-facing `GameplayContributionRegistry`，把 navigation / event / scene / task / house contribution families 收口到同一组 contract。
- 新增 Child 21 定向回归测试，锁定 manifest 可声明 `gameplayContributions`、`ActivatedMod` 必须暴露已安装 contribution registry、以及 activation 必须从 content source 安装 navigation / event / scene / task / house / house-module 贡献。

### Changed
- `src/core/contracts/mod-manifest.ts` 现已允许 mod manifest 显式声明 `gameplayContributions`；`src/core/mods/mod-parser.ts` 会校验并规范化这一字段。
- `src/core/contracts/mod-runtime.ts` 与 `src/core/mods/mod-runtime.ts` 现已在 activation output 中携带统一 `gameplayContributions`，并在激活时校验声明的 event / scene / task / house ids 必须真实存在于当前 content source 中。
- `src/core/registry/content-registry.ts` 不再停留在 `Record<string, unknown>` 占位类型，而是收口到稳定的 `ContentPackDefinition` registry typing，避免后续 Child 22 继续建立在 placeholder registry 上。

### Impact
- Child 21 已完成：mod activation 现在不只返回 manifest/source，还会产出一份经过安装和存在性校验的统一 gameplay contribution registry，后续 Child 22 可以围绕这条 activation output 做 builtin/imported/save-restore 的端到端闭环，而不必再重开 contribution contract 讨论。
- 本轮没有把 runtime play、save round-trip 或 presenter parity 吞进来；这些仍然属于 Child 22 的 end-to-end closure 边界。

## 2026-07-02 Child 22 End-to-End Mod-First Runtime Closure

### Changed
- `src/core/save/save-migrations.ts` 现在会把 `engineState.selectedModId` 归一到 envelope 的 `selectedModId`，避免读档后 engine/runtime 对当前激活 mod 的身份判断继续分叉。
- `src/core/save/save-envelope.ts`、`src/core/save/save-migrations.ts` 与 `src/core/save/save-loader.ts` 现在会持久化并恢复 `selectedModSource`，对 builtin save 自动补齐 builtin source，对 imported file/url save 保留可恢复的 source descriptor，而不是只保存 `selectedModId`。
- `src/main.ts` 新增 shared activated-session bootstrap helper，并让 builtin startup、scenario-pack startup、以及 continue/restore 路径都通过同一条 activation-result -> active-content sync -> app-state bootstrap 线路进入会话。
- `src/main.ts` 的 continue 流程不再在 restore 之后重新覆盖回 builtin startup；当存在已保存的 `selectedModId` 时，它现在优先走 restore-first 的 loading/startup 路径。
- `src/main.ts` 的 restore 路径现在会在 fresh page load 后优先按 `selectedModSource` 重新 load builtin/file/url mod source，而不是假定 imported mod 仍然残留在内存里的 `availableModsById` 中。

### Impact
- Child 22 现已完成：builtin startup、imported activation、save envelope、fresh restore 以及 covered runtime spine 现在组成一条更完整的 mod-first closure path，不再要求 imported mod restore 依赖旧内存中的 activation residue。
- 这轮没有继续扩到 editor/tooling/UI redesign；后续如果还要继续拆分，只能通过新的 weekly review 打开不同问题类型，而不是继续在 Child 22 上追加同类闭环 work。

## 2026-07-02 Child 20 House Runtime Mod Registration

### Added
- 新增 `src/core/registry/house-module-registry.ts`，定义共享 `HouseModuleRegistration` / `HouseModuleRegistry` seam，并提供 builtin fallback registry 装配点。
- 新增 `src/application/house-modules/builtin-house-module-registrations.ts` 与 `src/ui/views/house/builtin-house-module-renderers.ts`，把 builtin house module 与 renderer 贡献改为通过共享 registration seam 装配，而不是由 runtime / presenter / view 各自维护静态表。
- 新增 Child 20 定向回归测试，锁定 shared house registry seam、core runtime / presenter / renderer lookup 不再依赖 application 静态 registry，以及 `docs/special-house-interface.md` 必须明确 builtin 与 mod-owned house 共用同一条 registration path。

### Changed
- `src/core/runtime/house-runtime.ts` 与 `src/application/house/house-runtime.ts` 现已通过共享 `HouseModuleRegistry` 解析 house module，并支持后续以依赖注入方式替换 builtin registry。
- `src/application/presenter/stage-presenters.ts` 现已通过共享 `HouseModuleRegistry` 解析 house module view-model，而不再直接依赖 `src/application/house-modules/house-module-registry.ts`。
- `src/ui/views/house/house-module-view-registry.ts` 现已通过共享 `HouseModuleRegistry` 解析 renderer，而不再保留本地静态 renderer 表。
- `docs/special-house-interface.md` 现已明确：builtin houses 与 mod-owned houses 必须通过同一条 shared registration seam 进入 runtime / presenter / renderer 路径。

### Impact
- Child 20 当前批次已完成基线复核和 shared registry seam 首次落地；house runtime owner line 不再被 builtin application registry 直接绑定。
- 后续 Child 20 剩余工作应继续停留在 house registration boundary 内，避免把这轮实现扩张成 Child 21 的 generalized gameplay contribution registry redesign。

## 2026-07-02 Unified Minigame Contract Spec

### Added
- 新增仓库级 spec：[docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md)，统一定义小游戏的 registry、launch、session、command、presenter、result、settlement 与 owner handoff contract。

### Changed
- 明确后续小游戏工作不再视为 house-local 或 overlay-local 约定，而是统一纳入仓库级 runtime/presenter/settlement 边界。
- 明确现有 `activity-qte`、`city-begging`、`grain-accounting` 与 `medicine-compounding` 的渐进迁移顺序，以及“完成后必须回到正确 owner/session”的硬性要求。
- 明确 `story-battle` 不属于这套小游戏 taxonomy；它必须与小游戏 registry/runtime 作为并列 interactive family 区分，而不是被收进统一小游戏注册面。

### Impact
- 后续新增或改造小游戏时，启动、渲染、结算与回跳将有统一 contract 可依，不再继续把接线逻辑扩散到 `main.ts`、house module 或局部 overlay 分支中。
- 这份 spec 为后续 implementation plan 提供了正式边界；下一步应基于该 spec 写可执行迁移计划，而不是直接散点重构。
- 后续若整理 `story-battle`，应单独走 battle/combat 方向的 spec，而不是复用本小游戏 spec 直接改名套用。

## 2026-07-03 Unified Playable Runtime Contract Spec

### Added
- 新增仓库级 spec：[docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md)，把统一 runtime 的顶层 taxonomy 从 `minigame` 提升为 `playable`，并以 `family: "minigame" | "battle"` 约束具体子类。
- 新增 candidate-only 的 fresh weekly orchestration 计划：[docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md)，为 playable runtime 迁移预先建立独立队列，而不是把该问题类型附着到当前进行中的 `main-shell-ownerization` weekly set 上。
- 新增未来阶段用的独立 child plan：
  - [docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-31-covered-interactive-playables-migration-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-31-covered-interactive-playables-migration-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-32-house-local-mechanic-promotion-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-32-house-local-mechanic-promotion-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-33-battle-family-playable-migration-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-33-battle-family-playable-migration-plan.md)
  - [docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md)
- 新增轻量 queued child specs：
  - [docs/superpowers/specs/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-31-covered-interactive-playables-migration-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-31-covered-interactive-playables-migration-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-32-house-local-mechanic-promotion-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-32-house-local-mechanic-promotion-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-33-battle-family-playable-migration-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-33-battle-family-playable-migration-spec.md)
  - [docs/superpowers/specs/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-spec.md)
- 新增当前 playable 盘点文档：[docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md)，记录首轮 playable queue 的 current-state ownership matrix 以及未纳入 Child 30-34 的后续 playable-like 候选。
- 新增四份 playable companion docs：
  - [docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md)
  - [docs/superpowers/specs/2026-07-03-playable-scaffold-and-validator-io-draft.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-scaffold-and-validator-io-draft.md)
  - [docs/superpowers/specs/2026-07-03-playable-ai-authoring-protocol.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-ai-authoring-protocol.md)
  - [docs/superpowers/specs/2026-07-03-playable-test-strategy.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-03-playable-test-strategy.md)

### Changed
- 明确 `story-battle` 现纳入统一 playable runtime 范围，不再被排除在顶层 registry/runtime/presenter/settlement/handoff contract 之外。
- 明确 `story-battle` 必须保留 `family: "battle"` 的边界，不能为了统一 runtime 而被压平成普通小游戏语义。
- 将 [docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md) 降为 superseded 历史文档。
- 为 playable spec 补充“创作者责任边界”和“统一接入/目录归位/资源放置规则”，明确后续新增 playable 时，内容作者只关心玩法内容，不负责工程接线与资源管理策略。
- 将 playable spec 的结果模型进一步收紧为“玩法产出 fact result，剧本/集成层提供 outcome config，runtime 按配置判断胜负/取消并发放奖励”，避免把剧情语义硬编码回 playable 机制层。
- 为 playable spec 补充“缺失配置语义”规则，明确触发信息、owner 信息、outcome 条件缺失时必须 fail-closed，而奖励和 handoff 仅在文档明确允许时才可走显式 fallback。
- 继续将 playable spec 从“原则性 contract”收紧为“可执行闭环 contract”：新增 `integrationId` 这一层 scenario-owned playable use-site identity，明确同一 `playableId` 被多处复用时，触发、结算、奖励与回跳都必须绑定到唯一 integration instance。
- 为 playable spec 新增 trigger evaluation contract，明确“触发由谁配置”之外，还要求 framework-owned trigger evaluator 负责把命中的 trigger 规约为唯一的 `integrationId + playableId + ownerContext` launch request。
- 为 playable spec 新增 owner session recovery contract，明确 `sessionToken` 的签发、恢复、失效和 fallback 语义，防止统一结算后再次退回到 view/shell 猜测回跳目标。
- 为 playable spec 新增 scaffold / validator / CI enforcement 要求，明确该 spec 后续必须通过脚手架、schema/typed validator 和 CI 门禁执行，而不是只靠文档约定。
- 新增 [docs/superpowers/plans/_playable-plan-template.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/_playable-plan-template.md)，作为后续新增 playable、迁移 legacy playable、以及从 house/scene 流程中剥离 playable 的统一 active-plan 骨架。
- 在 playable spec 的 follow-up 中明确：后续 playable 相关执行计划应从 `_playable-plan-template.md` 起步，同时仍受通用 `_plan-template.md` 与 `plan-governance-spec.md` 约束。
- 将 playable runtime 迁移进一步拆成多 child 的阶段式候选队列，而不是预设成一个超大 child：当前 candidate 队列先记录 Child 30（runtime skeleton 与 integration registry）、Child 31（`activity-qte` / `city-begging` 迁移）、以及更后的 Child 32-34 候选阶段。
- 将 Child 30-34 全部预写成独立 future plan 文件，但明确保持为 non-executable；它们现在只是后续 fresh weekly promotion 的候选执行载体，不改变当前 active weekly set 的执行权。
- 将 Child 30-34 的计划文档 `Based On Spec` 回补为各自独立 child spec，而不再只引用顶层 playable contract spec，便于后续按 child 做 baseline recheck 与 promote。
- 为 playable runtime 这条线继续补齐实施前文档：冻结 `playableId / integrationId / triggerId / sessionId` 命名规则，预写 scaffold/validator 命令的输入输出草案，定义 AI 创作时的角色分工与提示协议，并按 Child 30-34 规划测试策略。

### Impact
- 后续 runtime 规划和迁移不再围绕“小游戏是否包含战斗”反复分叉，而是统一围绕 playable runtime 展开。
- 后续实现 plan 需要以 playable registry/runtime 为主线，同时对 `minigame` 与 `battle` 两类保留不同内部语义与 presenter/layout 约束。
- 后续若框架仍要求新增玩法的人手动决定代码目录、资产归位、注册点或 glue 路径，应视为 framework 缺口，而不是让内容创作者承担该复杂度。
- 后续同一 playable 可以被不同剧本以不同胜负条件、奖励和回跳方式复用，机制实现与剧本结算配置不再强耦合。
- 后续 runtime / editor / validator 在面对缺失配置时不能再各自猜默认行为，必须遵守 spec 里定义的 fail-closed 与 explicit fallback 规则。
- 这份 playable spec 现在不再只回答“该怎么设计”，而是开始回答“触发如何归一、结算如何唯一定位、回跳如何恢复、门禁如何执行”；后续实现 plan 可以直接围绕这些强制节点展开，而不是再次补概念口子。
- 后续不管是“新增 playable”、还是“把分散在 house / scene / local flow 的玩法剥离出来”，都可以沿同一份 plan 模板落地，减少每次重新定义迁移骨架的成本，也降低 AI/多人协作时的 plan 漂移。
- 后续 playable runtime 工作现在既不会破坏“同一时间只允许一个 active executable child”的治理规则，也不会因为前置拆分不足而把多个机制问题揉进一个难以验证的大迁移批次。
- 当前在不触碰 active weekly set 的前提下，playable runtime 这条线已经具备“candidate queue + queued child spec + future child plan + ownership inventory”四层前置文档，后续只需等当前 active set 关闭后从 Child 30 做正式 baseline recheck 即可。
- 当前这条线又向前补成“candidate queue + queued child spec + future child plan + ownership inventory + naming rules + scaffold/validator I/O draft + AI protocol + test strategy”的前置文档组合；后续 promote 时不需要再从零发明命名、输入输出或 AI 协作规则。

## 2026-07-02 Child 19 Task Runtime Mod Contract

### Added
- 新增 Child 19 回归测试，明确要求 `src/domain/content-pack.ts` 暴露可选 `tasks` contribution surface，`src/application/content/content-pack-loader.ts` 能从 shared manifest path 加载 `tasks.json`，并且 `src/application/scenario/scenario-pack-loader.ts` 把 `tasks` 视为正式可校验的 optional split-table。

### Changed
- `src/domain/content-pack.ts` 现已增加 `tasks?: TaskDefinition[]`，使 content-pack / scenario-pack 都能通过同一条 pack contract 携带 task definitions。
- `src/application/content/content-pack-loader.ts` 现已把 `tasks` 纳入 shared `CONTENT_PACK_FILE_KEYS`，使 manifest-driven content pack 可以加法式加载 task contribution，而不影响不提供该文件的旧 pack。
- `src/application/scenario/scenario-pack-loader.ts` 现已显式声明 `tasks?: string` manifest file slot，并在 parse 阶段校验 `tasks` 必须是数组，避免 scenario pack 对 task contribution 继续停留在隐式透传状态。
- `src/application/content/active-game-content.ts` 现已把 task definitions 纳入 active content assembly，导出 `taskDefinitions` 与 `taskDefinitionsById`，使已激活 pack 的 task contribution 能进入统一 lookup surface。
- `src/domain/game-state.ts` 与 `src/application/state/create-initial-state.ts` 现已把 `TaskRuntimeState` 落入 `gameState.runtime.tasks`，让任务运行态通过统一游戏状态结构保存，而不是停留在外部临时容器。
- `src/core/runtime/runtime-dispatch.ts` 现已新增 shared task settlement pass：当 routed runtime result 返回 `taskActions` / `taskSignals` 且 commit context 提供 `taskDefinitionsById` 时，dispatch 会调用 task runtime、写回 `gameState.runtime.tasks`、合并 `taskUpdates`，并继续通过 runtime settlement 应用 task effects。
- `src/main.ts` 现已维护 active task definition 索引，并为 covered runtime commit context 提供该索引，使 shared runtime dispatch 具备消费已激活 task contributions 的注册面。

### Impact
- Child 19 已完成：task definitions 现在可以通过 shared pack contract 声明、进入 active content lookup、并由 shared runtime dispatch 通过 typed task actions/signals 驱动 task runtime progression。
- 这次收口没有重开 house registration、general contribution registry、或完整 task authoring DSL；后续边界应转向 Child 20 的 house runtime mod registration baseline recheck，而不是把 Child 19 扩成更大的 registry redesign。

## 2026-07-02 Child 14 Interactive Remaining Legacy Convergence

## 2026-07-02 Child 17 Pack Content Decoupling

## 2026-07-02 Child 18 Runtime Spine Unification

### Added
- 新增 Child 18 回归测试，明确要求 `src/core/runtime/state-sync-runtime.ts` 导出共享 `commitRuntimeRequest()`，并要求 `src/main.ts` 的 covered `day-start`、`advance-segments`、`enter-city`、`story-battle`、`city-begging` 与 `activity-qte` 路径不再手工重复 runtime bridge create/apply write-back。

### Changed
- `src/core/runtime/state-sync-runtime.ts` 新增 `commitRuntimeRequest()`，把 `createRuntimeBridgeState()` -> `dispatchRuntimeRequest()` -> `applyRuntimeBridgeState()` 这一条 shared runtime commit 链收口为一个正式 helper。
- `src/main.ts` 的 covered `day-start`、`advance-segments`、`enter-city` 与 `story-battle` dispatch 路径，现已统一通过 `commitRuntimeRequest()` 提交 runtime request，而不再各自手写 bridge create/apply glue。
- `src/main.ts` 的 covered `city-begging` 与 `activity-qte` interactive write-back 路径，也已统一改为通过 `commitRuntimeRequest()` 提交到 interactive runtime route，不再直接组合 `createInteractiveRuntimeState()` / `applyInteractiveRuntimeResult()`。

### Impact
- Child 18 已完成：covered runtime entry 与 covered interactive write-back 现在共享一条更明确的 commit spine，`src/main.ts` 在这些路径上不再持有重复的 runtime bridge write-back 逻辑。
- 这次收敛没有吸收 task contract、house registration、manifest/registry policy redesign；下一个后续项应回到 Child 19 的 task-runtime mod-facing baseline recheck，而不是继续扩张 Child 18 边界。

### Added
- 新增 Child 17 回归测试，明确要求 `src/content/story/index.ts`、`src/content/houses/*.ts`、以及 covered `keep-house` / `temple-house` house module 消费端不再直接 hard-import `scenario-packs/zhuyuanzhang/**`。
- 新增 `src/content/pack-content-access.ts`，把默认 builtin `zhuyuanzhang` pack 的 story / house-content / activities / text JSON 读取集中到一个共享内容访问接缝。
- 新增 `src/application/content/pack-content-access.ts`，给 application 层消费端提供 pack-content access re-export seam。

### Changed
- `src/content/story/index.ts` 现在通过 `src/content/pack-content-access.ts` 获取默认 story events/scenes/text entries，不再直接导入 `zhuyuanzhang` pack 文件。
- `src/content/houses/home-house-content.ts`、`grain-shop-content.ts`、`keep-house-content.ts`、`market-house-content.ts`、`medicine-house-content.ts`、`tavern-content.ts` 与 `tea-house-content.ts` 现在通过共享 pack-content access seam 读取默认 house content，不再各自直接导入 `zhuyuanzhang` house-content JSON。
- `src/application/house-modules/keep-house/keep-house-house-module.ts` 与 `src/application/house-modules/temple-house/temple-house-house-module.ts` 现在通过共享 pack-content access seam 读取默认 activities / text entries，不再直接导入 `zhuyuanzhang` pack 表。

### Impact
- Child 17 已完成：covered production consumers 不再通过 scenario-specific 源码路径直接读取 `zhuyuanzhang` pack 内容，后续 mod-first 工作可以建立在共享 content access seam 上，而不是继续扩散 direct-import coupling。
- 这次收敛没有重开 Child 15/16 的 runtime handoff 设计，也没有改动 task/house/registry 的共享 contract 边界；下一个后续项应回到 Child 18 的 runtime spine baseline recheck。

### Added
- 新增 Child 14 回归测试，明确要求 `src/core/runtime/interactive-runtime.ts` 不再依赖 `legacy-interactive-adapter.ts` 持有 covered `activity-qte` / `story-battle` 生命周期，并要求 `src/main.ts` 关闭 `activity-qte` 结果面板时必须通过 `createExitInteractiveRequest("activity-qte")` 回到 interactive runtime。

### Changed
- `src/core/runtime/interactive-runtime.ts` 现在直接调用 `advanceActivityQteMarker()`、`stopActivityQte()` 与 `dispatchStoryBattleAction()`，不再通过 legacy interactive adapter 持有 covered `activity-qte` tick/stop 和 `story-battle` action dispatch ownership。
- `src/main.ts` 的 `closeCurrentActivityResult()` 不再直接调用 `clearActivityResult()`；该关闭路径现在通过 interactive runtime exit request 完成。
- `src/core/adapters/legacy-interactive-adapter.ts` 已降为历史占位文件，不再作为 covered 生产路径的实际 owner。

### Impact
- Child 14 已完成：remaining same-type covered interactive legacy tails 已从 adapter/shell 侧收口到 runtime owner line，后续 weekly continuation 不需要再把 interactive family 作为下一优先收敛边界。
- 当前后续 priority 已转向 Child 15 的 navigation/time mixed entry convergence；Child 16 仍保留为 event/scene handoff 的锁定后续项。

## 2026-07-02 Child 15 Navigation + Time Runtime Convergence

### Added
- 新增 Child 15 回归测试，明确要求 `src/main.ts` 在 covered `enter-city`、`day-start`、`advance-segments` 生产路径上不再直接调用 `runNavigationRuntime()` / `runTimeRuntime()`，而必须通过 shared `dispatchRuntimeRequest()` 收口。

### Changed
- `src/core/runtime/navigation-runtime.ts` 新增 `routeNavigationRuntime()`，把 navigation runtime 接入 shared `RuntimeState` / `RuntimeResult` dispatch 语言。
- `src/core/runtime/time-runtime.ts` 新增 `routeTimeRuntime()`，把 covered 时间推进入口接入 shared `RuntimeState` / `RuntimeResult` dispatch 语言。
- `src/core/runtime/state-sync-runtime.ts` 新增通用 bridge helper：`createRuntimeBridgeState()`、`applyRuntimeBridgeState()` 与 `applyRuntimeBridgeResult()`；原 interactive helper 改为委托给这些通用桥接函数。
- `src/main.ts` 的 covered `enter-city`、`day-start` 与 `advance-segments` 入口已改为 shared dispatch + runtime bridge write-back，不再直接把 shell 绑定到 navigation/time helper。

### Impact
- Child 15 已完成：covered navigation/time mixed entry 已收口到 shared runtime dispatch line，`src/main.ts` 只保留 bounded shell residue：`triggerStoryEventsForTiming("city-enter")` 与 `syncCouncilPriorityAfterGameStateChange()`。
- 下一个应审查的边界不再是同类 navigation/time 入口，而是 Child 16 的 event/scene handoff；是否还需要进一步处理 bounded residue，必须在 Child 16 baseline recheck 后再决定。

## 2026-07-02 Child 16 Event + Scene Handoff Convergence

### Added
- 新增 Child 16 回归测试，明确要求 `src/main.ts` 的 covered `triggerStoryEventsForTiming()` helper 不再直接 stitch `runEventRuntime()` 与 `runSceneFromEvent()`，同时锁定 covered `city-enter` 与 `indoor-screen-shown` 路径继续通过同一条 shared story-trigger seam 收口。

### Changed
- `src/core/runtime/event-runtime.ts` 新增 `runStoryEventRuntime()`，把基于 `EventTriggerTiming` 的 story trigger request 和 trigger input 组装收口到 event runtime 内。
- `src/core/runtime/scene-runtime.ts` 新增 `runStoryTriggerRuntime()`，把 covered story trigger 的 event activation 与 event -> scene handoff 串接收口到 runtime family 内，而不是继续由 `src/main.ts` 手工拼接。
- `src/main.ts` 的 `triggerStoryEventsForTiming()` 现在只调用 `runStoryTriggerRuntime()` 并做结果写回，不再自己直接调用 `runEventRuntime()` / `runSceneFromEvent()`。

### Impact
- Child 16 已完成：covered `city-enter` 与 `indoor-screen-shown` story handoff 已收口到一个 runtime-owned seam；本周这条 same-type event/scene handoff debt 不再保留 queued child。
- `2026-07-02` weekly set 已消费完 visible queue 并关闭。后续如果还要继续抽取，必须以新的 weekly review 重新证明它是不同的问题类型，而不是继续追加同类 child。

## 2026-07-02 Child 13 Shared Dispatch Reentry Convergence

### Added
- 新增 Child 13 回归测试，明确要求 `src/main.ts` 不再内联处理 `reenter-house` follow-up，且 `HouseRuntimeBridge` 必须能直接接管该 shared-dispatch reentry 收口路径。

### Changed
- `src/core/runtime/house-runtime.ts` 现在导出 `applyInteractiveFollowUp()` bridge seam，可在不额外触发浏览器层 render 分支的前提下，把 `reenter-house` follow-up 直接收口到 house runtime 自身。
- `src/main.ts` 的 `dispatchCurrentStoryBattleAction()` 不再自己判断 `interactive.houseId` 或维护 `followUpRendered` 分支；story-battle action 的剩余 Bucket A reentry 路径现在通过 shared dispatch follow-up -> `houseRuntime.applyInteractiveFollowUp()` 完成。
- `tests/robustness.test.cjs` 新增 Child 13 red-to-green coverage，锁定 `main.ts` 的 branch removal 和 `HouseRuntimeBridge` 的 reentry ownership。

### Impact
- Child 13 已完成：剩余同类 post-Child-11 Bucket A follow-up/reentry 路径已全部收口到 shared dispatch line 下，不再留下新的同类 Bucket A remainder。
- 本次审计没有发现 Bucket B 的 Child 11 backfill 问题，也没有发现 Bucket C 的新边界 follow-up；后续若还要继续 runtime continuation，必须先经过新的 weekly review/spec/plan，而不是继续扩写 Child 13。

## 2026-07-02 UI Contract Reserve

### Added
- 新增 `src/domain/ui/*` 未来 UI contract reserve 类型：`screen-schema`、`screen-layout`、`screen-skin`、`asset-catalog` 与组合后的 `ui-screen-contract`。
- 新增 `src/application/ui/*` 纯 UI reserve seam：validator、layout/skin resolver、asset layered alias resolver 与 builtin registry。
- 新增 `src/content/ui/*` builtin reserve 数据，覆盖当前 layout editor 的四个 screen target，并提供 alias-based UI asset catalog。

### Changed
- `src/domain/content-pack.ts` 增加可选 `uiScreenSchemas`、`uiLayouts`、`uiSkins`、`uiAssetCatalogs` reserve 字段。
- `src/application/content/content-pack-loader.ts` 以加法方式支持对应的 optional UI split-table file keys，不要求现有 pack 提供这些文件。
- `tests/robustness.test.cjs` 增加 UI contract reserve、builtin reserve seed、optional pack UI reserve、以及 inactive-by-default 保护测试。
- `tsconfig.test.json` 现在覆盖 `src/content/ui/**/*.ts`，使 Child 12 reserve 模块进入测试编译；同时避免把依赖 `import.meta.glob` 的现有 layout-editor runtime 文件误纳入 CommonJS 测试构建。

### Impact
- Child 12 已完成：future UI contract reserve、pack UI split-table reserve 与 explicit asset layering rules 均已落地，但当前 `src/main.ts`、现有 layout editor 路径和默认 runtime/render 行为保持不变。
- 这次落地没有启用 Editor mode，也没有把 reserve registry 接进当前生产运行时；后续 UI override / schema-driven renderer 工作仍需新的 child 明确接手。

## 2026-07-01 Runtime Contract Hardening

### Added
- 新增 `src/core/contracts/effect-settlement.ts`，定义 effect settlement 的 emitter/applier、输入、输出、unsupported-effects 与 warnings seam。
- 新增 `src/core/contracts/house-runtime.ts`，定义 house runtime 的 core-owned `enter / leave / dispatch` request contract。

### Changed
- `src/core/contracts/runtime-request.ts` 现在导出显式 typed request families；`src/core/runtime/runtime-router.ts` 由函数别名升级为正式 router seam；`src/core/runtime/runtime-dispatch.ts` 改为通过 formal router 和 formal settlement entrypoint 工作。
- `src/core/contracts/interactive-runtime.ts` 与 `src/core/runtime/interactive-runtime.ts` 现在定义 launch/action/exit/result/session seam，并通过一个 normalizer 统一覆盖 `activity-qte`、`city-begging`、`story-battle` 的公开 dispatch 语言。
- `src/core/runtime/runtime-settlement.ts` 现在显式报告 settled/unsupported effects 和 warnings，而不是静默忽略未覆盖 effect kinds。
- `src/core/runtime/house-runtime.ts` 不再把 domain `HouseModuleRequest` 作为 shared public contract 暴露；legacy adapter 仍在内部兼容层保留。

### Impact
- Child 9 已完成 shared contract baseline：后续 ownerization 可以围绕正式的 request/router、interactive dispatch、effect settlement 和 house runtime request seams 进行，而不必再依赖隐式 bridge 行为。
- Child 9 没有移除 legacy house/interactive adapters，也没有吸收 UI/layout 或 runtime ownerization 工作；这些明确递延到 Child 10 / Child 11。

## 2026-07-01 StateSync Runtime

### Added
- 新增 `src/core/contracts/state-sync-runtime.ts`，定义 `CanonicalRuntimeState`、`AppStateBridge`、`SaveState`、`PresentationInput`、`StateSyncTrigger`、`StateSyncResult` 与 `StateSyncRuntime`。
- 新增 `src/core/runtime/state-sync-*` 首版 StateSync Runtime seam，覆盖 validation、normalization、hydration、app bridge、pre-save snapshot、mod activation rebuild 与 presentation input preparation。

### Changed
- `src/main.ts` 不再直接声明 interactive RuntimeState creation/write-back helpers；这些 bridge-period helpers 已移入 StateSync runtime boundary。
- `src/core/contracts/runtime-state.ts` 和 `src/core/contracts/core-state.ts` 增加 legacy/bridge-period alias，避免继续把旧 `RuntimeState` 名称误认为 canonical authority。

### Impact
- StateSync Runtime 已有 formal runtime owner；Child 8 不接管 gameplay dispatch、save IO、mod activation、presenter/render 或 feature-specific business logic。

## 2026-07-01 Mod Runtime

### Added
- 新增 `src/core/contracts/mod-runtime.ts`，定义 `ModSourceDescriptor`、`LoadedMod`、`ActivatedMod`、`ModRuntimeState`、`ModRuntimeRequest`、`ModRuntimeFailure` 与 `ModActivationResult`。
- 新增 `src/core/mods/*` 首版 Mod Runtime seam，覆盖 source normalization/loading/parsing、dependency/capability validation 与 atomic activation rollback。
- 新增 `src/core/adapters/mod-runtime-main-adapter.ts`，把 `ModActivationResult` 转为当前 bootstrap/content assembly 可消费的兼容输入。

### Changed
- `src/main.ts` 的 builtin、file import、url import 与 restore selected-mod activation 现在先经过 Mod Runtime，再继续走现有 content assembly / bootstrap 路径。
- `src/core/contracts/mod-manifest.ts` 增加 `schemaVersion`、dependency/conflict/capability 和 default start 字段，供 Mod Runtime validation 与 startup handoff 使用。

### Impact
- Mod activation/startup 已有 formal runtime owner；Child 7 不接管最终内容合成、save/load IO、gameplay runtime execution、UI/menu/loading-screen、hot reload 或 sandboxing。

## 2026-07-01 Task Runtime

### Added
- 新增 `src/core/contracts/task-runtime.ts`，定义 `TaskDefinition`、`TaskInstance`、`TaskRuntimeState`、`TaskAction`、`TaskSignal`、`TaskUpdate` 与 `TaskRuntimeResult`。
- 新增 `src/core/runtime/task-runtime.ts`，提供 `startTask()`、`applyTaskAction()`、`applyTaskSignal()` 与首版 signal-driven progression。

### Changed
- `src/core/contracts/runtime-result.ts` 现在可携带 `taskUpdates`，同时保留 legacy `RuntimeTaskAction` / `RuntimeTaskSignal` 兼容形态。

### Impact
- Task lifecycle 和 signal progression 已有 formal runtime owner；Task Runtime 返回 task updates、effects 与 follow-up signals，但不应用 effects，也不接管 Event、Scene、Interaction、Time、Save/Load 或 Presentation 边界。

## 2026-06-30 Presenter Output Render Decoupling

### Added
- 新增 `src/application/presenter/presenter-output.ts`、`app-presenter.ts`、`stage-presenters.ts` 与 `overlay-presenters.ts`，形成首版 `Presentation Bridge Runtime` / presenter output seam。

### Changed
- `src/main.ts` 现在在调用 `renderAppMarkup()` 前先组装 `createAppPresenterOutput()`，不再在 render 入参里内联组装 scene action / choice options。
- `src/ui/app-render.ts` 改为消费 `presenterOutput` 中的 stage、overlay、HUD 和 scene 选择结果，不再直接导入 `getHouseModule`、`isCityEntryVisibleForStoryStage` 或 `selectCityNpcSummariesForHouse`。

### Impact
- render-time gameplay selection 已从 UI renderer 移到 application presenter 层，`app-render.ts` 更接近纯渲染消费端；后续 Task Runtime、Mod Runtime 与 StateSync Runtime 可以在不重新扩大 presenter/render 边界的前提下继续推进。

## 2026-06-30 Minimum Unified RuntimeState Carrier

### Added
- 新增 `src/core/contracts/runtime-state.ts`，为 Child 4 的最小统一运行态补出 `RuntimeState.core`、`RuntimeState.app` 与 `RuntimeState.view` 三段式 carrier。

### Changed
- `src/core/contracts/runtime-result.ts`、`src/core/runtime/runtime-router.ts`、`src/core/runtime/runtime-dispatch.ts` 与 `src/core/runtime/runtime-settlement.ts` 现在围绕 `RuntimeState` 工作，而不是继续把 Child 4 卡在 Child 1 的 `CoreGameState` 形状上。
- `src/core/runtime/interactive-runtime.ts` 不再返回私有 `{ appState, enterHouseId }` 结果，而是返回共享 `RuntimeResult.state` 与 `RuntimeResult.interactive`；`src/main.ts` 至少已有一条覆盖中的 story-battle action 路径通过 `dispatchRuntimeRequest()` 回到共享 runtime line。
- `characterDefinitions` 本轮继续走独立兼容参数，不并入 `RuntimeState.core`；是否后续提升为 convergence step，改由 weekly promotion gate 决定。

### Impact
- Child 4 现在已经具备最小统一 runtime state/result carrier，后续可以先继续扩大 shared dispatch 覆盖和统一 signal，再决定是否需要更高成本的 `characterDefinitions` 或 Child 1 `CoreGameState` convergence。

## 2026-06-30 Interactive Runtime Bridge Extraction

### Added
- 新增 `src/core/contracts/interactive-runtime.ts`，为受控交互运行态补出统一的 kind/source/session 基础类型。
- 新增 `src/core/runtime/interactive-runtime.ts` 与 `src/core/runtime/house-runtime.ts`，提供交互启动/动作请求与 house runtime 进出/派发的 core bridge 入口。
- 新增 `src/core/adapters/legacy-house-adapter.ts` 与 `src/core/adapters/legacy-interactive-adapter.ts`，把当前 house runtime、city-begging、activity-qte、story-battle 的旧实现包进过渡适配层。

### Changed
- `src/main.ts` 不再直接导入 `application/house/house-runtime`，已覆盖的 house / city-begging / activity-qte / story-battle 入口改为先走 `src/core/runtime` 的桥接层。
- 已覆盖的交互 launch/action 入口现在先经过 `createLaunchInteractiveRequest()` / `createInteractiveActionRequest()` 和 `runInteractiveRuntime()`，而不是由 `main.ts` 直接组装并调用旧 helper。

### Impact
- 项目现在具备了第一层 production 级 `Interaction Runtime` / `House Runtime` bridge seam，后续可以继续把交互请求并入统一 runtime-router/runtime-dispatch，逐步减少 `main.ts` 作为并行交互控制器的职责，而不必立即重写现有小游戏和剧情战实现。

## 2026-06-29 Save Migration Hardening

### Added
- 新增 `src/core/save/save-migrations.ts`，为旧存档到当前 `SaveEnvelope` 的归一化提供确定性的迁移入口。
- 新增 `src/core/save/save-loader.ts`，在读取时统一执行迁移并校验 `selectedModId` 是否仍然可用。
- 新增 `src/core/save/save-writer.ts`，为当前标准化后的引擎存档提供统一序列化出口。

### Changed
- `src/core/save/save-envelope.ts` 补出当前 envelope 版本常量，使 loader / migration / writer 能围绕同一版本边界工作。
- 存档读取现在支持旧形态 `state.flags/state.variables` 迁移到 `runtimeState`，并在缺失 `engineState` 时补出默认引擎态。
- 存档读取不再静默接受缺失的 `selectedModId`；当所选 mod 不可用时，会显式抛错而不是带着损坏状态继续运行。
- 标准化后的存档写回路径会保留未知 mod 的 `modState` 负载，不会因为核心运行时不理解字段含义而丢失数据。

### Impact
- `src/core/save` 已从“最小 envelope seam”推进到“可迁移、可校验、可回写”的 persistence boundary，后续 Child 3/4/5 可以建立在这个稳定读写合同之上，而不必再回头发明新的存档形状。

## 2026-06-29 Core Engine Runtime Boundary

### Added
- 新增首批 `src/core` 边界文件：`contracts`、`engine`、`runtime`、`save` 与 `adapters/legacy-main-adapter.ts`，把 mod manifest、EngineSession、RuntimeRequest/Result、Effect、SaveEnvelope 等最小运行时契约落到生产代码目录。
- 新增 `src/core/registry/mod-registry.ts` 与 `src/core/registry/content-registry.ts`，让引擎启动可以通过选中的 mod id 和 registry 进入统一 bootstrap seam。

### Changed
- 增加 runtime dispatch 与 effect settlement 接缝，首条 routed request 已由 `src/core/runtime` 接管并回写 `CoreGameState`。
- 增加最小 `SaveEnvelope` 契约，保存层现在有了可继续硬化的 engine/modState 边界。
- `src/main.ts` 新增 `legacy-main-adapter` handoff seam，默认启动流程会先经过 `src/core` bootstrap，再继续沿用现有主运行时逻辑。

### Impact
- 项目第一次具备了面向 mod-first 改造的生产级 `src/core` 入口边界，后续可以在不继续扩大 `main.ts` 架构职责的前提下，逐步拆分 navigation、event/task、interactive module、save hardening 和 UI presenter。

## 2026-06-26 Standalone Static Service Script

### Added
- 新增 Windows 独立服务管理脚本 `scripts/standalone-service.ps1`，支持 `start / stop / restart / status`，可在后台启动构建后的静态站点服务。
- 新增便捷包装脚本 `scripts/start-standalone-service.ps1`，用于一条命令启动独立服务。

### Changed
- README 增补独立后台服务启动说明、默认地址和运行时日志目录说明。

### Impact
- 现在可以不占用前台终端运行构建后的项目，便于局域网演示、临时部署和手工验收。

## 2026-06-18 JSON Scenario Pack Entry

### Added
- 新增 JSON scenario pack 契约 `ScenarioPackDefinition`，一个 JSON 包现在可以携带 `scenarioProfile`、`characters`、`events`、`scenes` 和 `activities`。
- 新增 scenario pack 加载/校验入口 `application/scenario/scenario-pack-loader.ts`，支持从内置 URL 或本地 JSON 文本读取并解析开局包。
- 新增内置 JSON 包 `content/scenario-packs/liu-bang-pei-county-opening.json`：刘邦作为玩家角色，从沛县亭长开局，入口剧情、人物、选择分支和默认活动 fallback 都来自 JSON。
- 开始界面新增 `JSON 开局` 入口，可选择内置“刘邦：沛县亭长开局”，也可导入本地 `.json` 开局包。

### Changed
- 主运行时的 story/event/scene/activity 内容源从固定静态表扩展为“当前激活内容注册表”。普通开局会重置为内置内容；读取 JSON 开局时会先 merge JSON 包内容，再用该包的 `entryEventId` 启动开局。
- scene 渲染、剧情推进、选项处理和 house 触发现在都读取当前激活内容注册表，因此 JSON scene 可以正常推进和选择。

### Impact
- 这一步已经形成“选择 JSON -> runtime 读取 -> 生成开局 scene”的可见闭环。当前 JSON 包仍复用现有地图/城市容器，尚未让 JSON 动态新增完整 map/city/house/content registry；下一步应把 city、house、map、resource 也纳入 scenario pack 汇总和校验。

## 2026-06-18 Modular Authoring Activity Loop

### Added
- 新增 `ScenarioProfileDefinition`，用于描述表单化/Mod 化开局档案：玩家角色、章节、初始地图/城市/house/view、初始 runtime、入口事件和 opening flow。
- 新增 `ActivityDefinition` 与 `FlowDefinition`，把“专属 function 或 fallback QTE”活动从剧情文本中拆成可注册、可校验的结构化内容。
- 新增 `ActionNode` 类型 `start-activity`，scene 可以通过稳定 `activityId` 启动活动，而不是在剧情或入口层写业务分支。
- 新增 `application/activity/activity-runner.ts`，按 `handlerId` 执行活动；当前内置 `generic.qte` fallback，会写入统一 `GameState.runtime.flags/variables` 并执行配置化 effects。
- 新增示例内容 `content/activities/scenario-activities.ts` 与 `content/scenarios/scenario-profiles.ts`，覆盖朱元璋和尚开局与秦始皇皇宫开局的表单化数据骨架。
- 新增 [docs/modular-authoring-closed-loop-plan.md](/D:/RPG_TG/docs/modular-authoring-closed-loop-plan.md)，记录从 schema、flow runner、交互式 QTE 到 Mod 包加载和编辑器 UI 的完整闭环规划。

### Changed
- `SceneRunnerContext`、`StoryContent`、`GameContent` 和 house runtime 的 story trigger 依赖现在可携带 `activityDefinitionsById`，让剧情推进链可以消费结构化活动注册表。
- `main.ts` 只传入活动注册表，不增加角色、house 或活动的专属业务分支。

### Impact
- 后续“输入一段文字生成剧情”“开局表单决定流程”“缺少专属 function 时 fallback 到 QTE”应继续走 `scenario/event/scene/flow/activity` 数据链路，运行时不得根据文本或 id 字符串临场猜语义。
- 当前 `generic.qte` 是自动结算 fallback，尚未接成可交互 overlay；下一步应抽共享 activity/minigame shell，而不是复制寺庙或酒馆 QTE 逻辑。

## 2026-06-17 Battle Demo Formation Targeting Cleanup

### Changed
- [prototypes/battle-demo/index.html](/D:/RPG_TG/prototypes/battle-demo/index.html) 的编队对战目标锁定改为固定前排优先顺序，成员按“前排到后排、从左到右”选择目标，不再按同路/居中随机切换目标。
- 编队成员攻击继续采用“先锁定目标、再随机短延时并发出手”的演出方式，缩短同批次成员攻击之间的等待，避免退回逐个串行撞击节奏。
- 兵种克制收口为两条成员级规则：骑兵攻击远程成员伤害 +50%，长枪攻击骑兵伤害 +50%；移除冲锋对伤害的额外加成与相关技能入口。
- 棋盘单位与部署/调试摘要统一按“编队”显示，不再在战场棋子摘要里暴露具体内部兵种构成；棋盘本体继续只显示兵力条和士气条。

## 2026-06-15 Story Battle Rescue Hook

### Added
- 新增共享 `storyBattle` 运行态、剧情战视图与 story battle runtime，用于把主线 scene callback 接到可交互战斗会话，而不是从剧情硬跳单文件战斗原型。
- 朱元璋郭子兴入营段新增“救援孙德崖”剧情战：郭子兴、汤和、徐达等友军由 NPC 推进，玩家只操作朱重八本队突入缺口，胜利后回帅府评定。

### Changed
- 第四周入郭剧情从占位战斗结果扩展为“对话铺垫 -> 剧情战 -> 胜利进入评定”的可复用流程。
- 主线剧情战视图改为嵌入完整 `prototypes/battle-demo` 战斗页面，并通过 `sundeya-rescue` 场景参数加载固定救援战；原型页新增剧情场景配置、NPC 友军自动行动和胜利 `postMessage` 回调。

### Impact
- 后续主线若要接个人战、救援战、护送战等剧情战，应继续复用 `storyBattle` 会话和 battle-demo 场景参数启动方式；正式化时再把 `prototypes/battle-demo` 的战棋规则抽进共享 application/domain 模块，避免长期依赖 iframe 原型页。

## 2026-06-12 Battle Demo Isometric Formation Prototype

### Changed
- [prototypes/battle-demo/index.html](/D:/RPG_TG/prototypes/battle-demo/index.html) 的战斗原型改为等轴 2.5D 棋盘表现，地块统一使用黄色边缘圆角正方形视觉，并按等轴坐标绝对定位。
- 玩家棋盘单位从单兵种部队改为混编编队预设，地图棋子显示编队摘要，内部保留 3x3 阵位成员数据用于战斗演出。
- 玩家操作改为点击己方编队显示移动范围，点击目标格后临时移动，并显示待机、整顿、攻击、撤回行为菜单；未确认行为前支持右键撤回，确认待机/整顿/攻击后锁定行动。
- 攻击范围改为按编队最高有效射程显示，真正进入战斗时按成员射程降级兼容：距离 1 全员可攻，距离大于 1 时射程不足成员不出手。
- 攻击结算改为弹出双侧 3x3 编队演出界面，攻方全员出手、守方全员还击，攻防交换重复两轮，并把成员兵力与编队士气写回地图层。
- 修正等轴地砖自身朝向和几何生成方式，地砖改为正方形本体旋转后再压缩投影，保证上下顶点位于同一横坐标，避免像鳞片一样竖起；地图行列投影保持原方向。
- 右键撤回移动后直接清空当前选择，方便玩家改选其他编队；编队战斗弹窗改为按成员逐次撞击播放，阵亡成员不会在后续轮次继续出手。
- 统一兵种操作取消逻辑：移动范围外、移动后行动选择期间、攻击目标选择期间点击无效位置都会撤销临时移动并清空选择；点击其他可操作己方编队时会切换选择。
- 修正玩家选择攻击后无法稳定进入编队对战的问题：攻击目标选择期间保留临时移动状态，点中敌军后才提交行动；移除火攻旧范围伤害入口。
- 敌方回合改为逐个编队顺序执行，移动时按路径逐格播放，移动后再判断是否攻击；若触发编队演出，会等待玩家关闭演出界面后再执行下一个敌方编队。
- 攻击范围改为固定形状判定：含弓兵、火器等远程成员的编队可攻击十字方向两格和对角一格，纯近战编队只可攻击十字一格；范围显示与目标锁定共用同一判定，不再受高地、瞭望或森林视野修正改变形状。
- 移动选择阶段允许点击当前棋子所在格，原地进入行动选择与攻击选定状态，并保留未确认前撤回到未选中状态的逻辑。
- 地图地块不再按地形显示底色或地形文字，基础 tile 统一为透明填充的黄色边缘，地形数据仅保留给规则判定使用。
- 战场棋盘容器使用 `ui/battle/battlegroun_forest.png` 作为背景图，黄色边缘 tile 和棋子继续叠加在背景之上。
- 战斗 UI 改为参考图式叠层排布：主地图铺满战斗界面作为底层，左侧浮动显示单位详情与 3x3 编队构成，右侧浮动显示目标/战况与日志，并隐藏原右侧调试/小地图式列表。
- 棋盘 tile 尺寸上调一档，动态缩放范围从 34-58px 调整为 40-68px，使主地图上的格子和棋子整体更大。
- 行动选项从底部固定条改为跟随当前行动棋子的纵向浮动栏目；右侧战斗日志改成带标题的独立面板。
- 战斗原型页面增加统一 125% 缩放变量，字体、主要面板、顶部/底部栏与棋盘 tile 动态范围同步放大。
- “选择攻击目标”状态下行动菜单仅保留撤回按钮，隐藏待机、整顿和攻击选项，避免目标选择阶段误触其他行为。
- 编队战斗演出从居中弹窗改为全屏战斗界面：左侧固定显示我方、右侧固定显示敌方，成员按实际 3x3 阵位坐标摆放并用椭圆立绘占位，左侧下排向左错位、右侧下排向右错位。

### Impact
- 当前仍是单文件原型实现，尚未抽入 `src/application/battle`；后续正式化应把编队演出、成员结算和地图交互状态机拆到共享 battle application/domain 模块。
- 粮车、据点、守卫战、斩首战等原有战型框架继续保留，但伤害结算开始以编队成员为主，旧的直接伤害逻辑只作为粮车和范围伤害等兼容路径使用。

## 2026-06-12 Isometric Formation Battle PRD

### Added
- 新增 [docs/battle-isometric-formation-prd.md](/D:/RPG_TG/docs/battle-isometric-formation-prd.md)，把战棋改造收口为“等轴 2.5D 地图层 + 九宫格编队演出层”的详细 PRD。

### Changed
- 明确后续战斗棋盘单位应从单兵种棋子改为混编编队，兵种作为 3x3 编队内部成员参与演出层结算。
- 明确玩家交互改为“点击编队显示移动范围 -> 点击目标格临时移动 -> 显示待机/整顿/攻击与攻击范围 -> 行为确认后不可撤销”，未确认行为前支持右键回退。
- 明确攻击进入类似《战争交响曲》的双侧编队演出界面，攻方全员出手、守方全员还击，攻防交换重复两轮。
- 明确攻击参与规则采用降级兼容射程：距离 1 时所有可战斗成员都能攻击，距离大于 1 时按成员射程过滤。

### Impact
- 该 PRD 不改变当前 `prototypes/battle-demo/index.html` 行为，但为后续战斗原型重构、`src/application/battle` 模块化和编队系统接入提供验收标准。
- 后续实现应优先复用 [src/domain/battle-formation.ts](/D:/RPG_TG/src/domain/battle-formation.ts) 的 3x3 编队契约，避免继续把兵种属性硬写成棋盘单位属性。

## 2026-06-05 Battle Formation Baseline

### Added
- 新增 [src/domain/battle-formation.ts](/D:/RPG_TG/src/domain/battle-formation.ts)，定义合战编队、3x3 阵位、单位占用规模、容量公式、编队校验和兵种发挥率纯领域函数。
- 新增 [docs/battle-formation-design.md](/D:/RPG_TG/docs/battle-formation-design.md)，记录参考《战争交响曲》的编队容量、占用规模、属性换算和后续接入顺序。

### Changed
- `src/domain/index.ts` 导出编队领域模块，便于后续 `application/battle` 和 UI 统一消费。

### Impact
- 当前变更不接入 `src/main.ts`，不改变现有战棋 Demo 行为。
- 后续战斗实现应通过共享编队结构与 `src/application/battle` 服务接入，避免把编队规则写成页面层或主循环特判。

## 2026-06-12 Rest Map Playback And Auto Return

### Changed
- 自宅与皇觉寺的休息不再在 house 内直接静默跳到最终日期；现在会先生成逐日休息快照，再切到主世界地图按天播放时间流逝，让右侧全局时间面板真实显示休息期间的日期推进与体力恢复。
- 共享 `start-map-auto-advance` 契约扩展为支持 `snapshots` 与 `completion`：house module 现在可以把“世界层播放几天时间”与“播放结束后如何回到目标 house”交给共享运行时处理，而不需要在 `main.ts` 补 house 分支。
- 休息播放结束后会自动回到原场景：在自宅休息会落回自宅并显示休息结果；在皇觉寺休息若只是普通静养则回到寺庙日常，若休息途中正好撞上评定日，则会直接重进寺庙并由 `enter()` 立即切入评定流程。
- 皇觉寺第一周工作后的“休整至评定期”也接入同一套自动收口，地图时间播放到评定日后会直接回寺开评，不再停在地图层等待额外点击。

### Impact
- “多日休息/等待”现在成为共享世界层机制：后续别的 house 若也要做可见的时间快进并在结束后回场景，可以复用同一套 snapshot + completion 契约，而不是各写一条一次性跳转。
- 休息的时间表现、回场景行为和评定入场顺序现在一致收口到共享运行时，避免再次出现“日期已经过去，但玩家还停在休息前 house 画面”或“先弹提醒、再手动找回 house”的割裂感。

## 2026-06-10 Zhu Yuanzhang Week Four Return And Story Callback Hook

### Added
- 新增共享 story callback 运行接线 [src/application/story/story-callbacks.ts](/E:/RPG_TG/src/application/story/story-callbacks.ts)；scene 中原先只占位的 `callback` action 现在可以执行注册回调，用于承接“剧情里需要留接口、但暂不落完整系统”的过渡逻辑。
- 新增共享占位战斗回调 `story.placeholder-battle`：当前可按 payload 自动写入“战斗已触发 / 已获胜 / 最后战斗 id 与结果”这类运行态，先保证剧情链可测试，后续真实个人战接入时可直接替换同一接口。
- 朱元璋主线新增第四周事件 `event.story.zhu_yuanzhang.haozhou_return_encounter`，覆盖“外地化缘返程 -> 路遇盗匪 -> 入濠州被疑为谍 -> 郭子兴留置左右”的完整转轨段。

### Changed
- 皇觉寺和尚期新增第四周评定语义：第三周远途化缘结束后的下一轮评定，仍由方丈强制派发“外地化缘”，不再回退成普通“寺内帮忙 / 外出化缘”自由选工。
- 第四周主线转折由共享进城触发链承接：玩家完成第四周外路化缘后，第一次回到濠州城就会切入“路遇盗匪 -> 城门被疑为谍 -> 郭子兴留置左右”scene。
- 朱元璋从和尚期切入郭子兴帐下的身份变更，改由共享 story callback 统一处理：包括 `stage -> guo-zixing-camp`、玩家身份改为亲兵、清空寺庙差事残留、重置帅府评定倒计时与主任务文案。
- scene 对话视图不再只吃寺庙 CSS 占位立绘；现在会优先走共享 portrait asset 解析，朱元璋、小兵、郭子兴等剧情角色都能直接显示各自 UI 目录中的真实立绘。

### Impact
- scene `callback` 终于成为真实可复用机制，后续如果还要做“剧情中先留个人战/辩论/审讯接口，系统稍后再接”，可以继续复用同一条 story callback 链。
- 第四周现在能在不引入临时 house、也不在 `main.ts` 硬写剧情分支的前提下，于返程路上完成和尚期到郭子兴线的正式转轨。
- 共享 scene 渲染拿到真实立绘后，后续新增非寺庙剧情时不必再为每个角色补一套一次性的 CSS 立绘特判。

## 2026-06-08 Temple Third Week Long-Distance Begging

### Changed
- 朱元璋和尚期开局新增第三周目大阶段 `huangjue-begging-journey`：在外出化缘解锁后的下一轮评定中，皇觉寺会强制把本轮差事定为“远途化缘”，不再让玩家在寺内帮忙和化缘之间自由切换。
- 第二周目恢复为过渡周：刚解锁化缘后的这一轮评定仍保留“寺内帮忙 / 外出化缘”自由分配，只有完整走完这一轮后，下一次评定才会切进第三周目的强制远途化缘。
- 皇觉寺第三周目的任务文本、评定方针、差事分派和出发提示改为围绕“北上颍州求粮”展开，但本轮结算仍继续复用现有寺庙交粮与贡献评价机制，只按带回寺里的粮食结算，不把传言本身做成评分项。
- 第三周目在濠州本地新增“缺粮封口”约束：城中化缘入口会明确提示“濠州近来已讨不出米”，濠州粮铺的“买粮”动作也会临时断供，从玩法上把玩家继续推向外地求粮，而不是留在本城磨时间。
- 评定优先级共享判断改为按“和尚期阶段”而不是单一 `huangjue-temple` 阶段识别寺庙评定；第三周目休息、时间推进和到期提醒不再误跳到帅府/郭子兴线，而会继续回到皇觉寺评定。
- 主线内容新增 `city-enter` 事件 `event.story.zhu_yuanzhang.runing_broadcast`：玩家在第三周第一次进入颍州时，会播报汝颍红巾、韩林儿名号与濠州郭子兴起兵的风声，用作世界铺垫和后续周目的钩子。
- `main.ts` 新增共享 `city-enter` 剧情触发接线，城市进入后会统一走现有 `triggerStoryEvents` 链，不再只能依赖 `house-enter` / `indoor-screen-shown` 两种时机承接主线。

### Impact
- 第三周目现在成为一个完整的“评定派发 -> 离寺远行 -> 外地求粮 -> 回寺交粮 -> 下轮再评”的共享循环，没有把周目推进写成 `main.ts` 的一次性剧情分支。
- “第三周必须离开濠州求粮”现在由共享阶段判断分别接入城市化缘入口、粮铺购买入口和评定优先级，不再依赖临时剧情台词硬推，也避免寺庙休息流程串到帅府逻辑。
- 后续如果别的主线也要做“进城即触发广播、街谈或阶段播报”，可以继续复用同一条 `city-enter` 触发链，而不用再给入口层补临时判断。

## 2026-06-05 Council Reminder Without Forced Return

### Changed
- 评定日期首次到达时，共享提醒现在只弹 NPC 提示，不再在点掉提示后强制把玩家送回寺庙或帅府；玩家可继续在城中或各 house 自行活动，天数也会照常推进。
- 但到评定日及逾期后，小游戏、工作、寺庙交粮和城中化缘依旧会被统一拦下，相关 NPC 会明确提示应先去参加评定。
- 顶部时间面板的评定状态改为按实际日期显示 `距离评定 X 天 / 今日评定 / 评定逾期 X 天`，不再只停留在“今日评定”。

### Impact
- 评定提醒和正式赴会彻底分离后，玩家可以自由决定何时动身赴会，同时仍被共享时长守卫限制，避免继续接长时工作把逾期拖得失控。
- 评定逾期天数现在成为稳定可见的全局信息，后续若继续扩展迟到处罚或逾期事件，可以直接复用同一状态文案。

## 2026-06-05 Timed Activity Review Guard

### Changed
- 共享评定日期 helper 新增“剩余天数不足以完整做完本轮活动”的开始前校验；粮铺算账、药铺配药、茶馆舌战、酒肆接活、寺庙寺务/交粮，以及城中化缘现在都会在入口先检查时日是否足够。
- 若离评定剩余天数少于该活动所需总天数，系统会直接禁止开始，并由当前场景 NPC 明确提示“时间不够，应先去评定”，不再让玩家先开做，也不再偷偷把时间自动快进到评定日。

### Impact
- “多天活动是否还能开做”收口成统一规则后，后续新增会耗数天的小游戏或工作时，只要复用共享时长 helper，就能自动接入评定前的时长守卫。
- 评定日前的节奏从“可能被系统半路切断”改成“开始前就说明来不及”，玩家决策会更稳定，也更符合太阁类的日程管理预期。

## 2026-06-05 Temple Review Timing Guard And Reminder Sequencing

### Changed
- 皇觉寺本轮贡献现在在每次新评定派发差事时重置，不再把上一轮累计值直接带进下一轮，避免“寺内帮忙看起来总是 45 点贡献”这类跨轮残留。
- 寺庙内多日工作、交粮回寺和城中化缘在开始前都会先检查“离评定还剩几天”；若剩余天数不足以完整做完这一轮，就不会先开做再被中途切断，而是直接把余下天数推进到评定日，再走共享评定提醒。
- 评定提醒与评定入场改为顺序触发：先显示提醒 NPC 面板，玩家点掉提醒后，才正式进入评定 house 并显示评定开场，不再出现两个 NPC 面板重叠。

### Impact
- “活动时长是否足够跨到下一次评定”现在统一在开始入口判定，寺庙工作和化缘不会再出现开始后被硬切去评定的跳变感。
- 评定提醒和正式评定台词分成两步显示后，后续如果别的阵营也要加到期提醒，可以继续复用同一条共享触发链。

## 2026-06-05 Immediate Review Trigger On Due Date

### Changed
- 共享评定触发改为“到日即触发”：只要任意时间推进让日期首次到达评定日，运行时就会立刻进入当前阶段对应的评定 house；如果玩家当时已经在该 house 内，则会直接重进当前 house 并切入评定流程。
- 这条规则现在同时覆盖 house 内活动结算、休息结算、外部化缘和地图移动后的时间推进，不再要求玩家手动再走一次“进 house”。
- 评定日真正到来时，系统现在会先弹出 NPC 提醒对话，再把玩家带入评定场所；若是休息被评定打断，对话里会一并说明本次已休息多久，以及体力恢复到了多少。

### Impact
- “评定触发”从原先偏依赖下次进入 `keep-house` / `temple-house`，收口成统一的到日触发机制；后续新增会推进时间的玩法时，只要走共享运行时，就会自动接入评定切换。
- 休息中断结算不再被自动进评定直接吞掉，后续其他“等待到某个截止日”的系统也可以复用同一条提醒通道补充结果摘要。

## 2026-06-05 Late Council Attendance And Rest Interruption

### Added
- 新增共享评定迟到 helper [src/application/time/council-attendance.ts](/E:/RPG_TG/src/application/time/council-attendance.ts)，统一计算迟到天数、五天内/五天外两档贡献处罚，以及五天外的逐出概率。

### Changed
- 自宅与寺庙的休息结果现在会明确提示：评定日一到就会中断休息，玩家可以立刻去评定，也可以先不去；若迟到赴会，会按当前阶段扣贡献并挨训。
- `main.ts` 不再把评定日做成全局硬锁；评定到期后仍可继续移动、进出其他地点或做别的事，但真正进入评定 house 时，会按迟到天数补结算处罚。
- 帅府评定现在会在迟到入场时先扣个人功劳并追加斥责开场；超过五天时有概率直接逐出郭子兴阵营。寺庙评定也会在迟到入场时先扣寺中贡献并追加斥责，但未把寺庙阶段做成随机逐出，以免直接踢断当前主线。

## 2026-06-05 Council Date Priority For Rest And Travel

### Added
- 新增共享评定日优先 helper [src/application/time/council-priority.ts](/E:/RPG_TG/src/application/time/council-priority.ts)，统一判断“是否已到评定日”以及当前阶段对应的评定场所模块。

### Changed
- 自宅与寺庙的休息流程现在都以评定日为最高优先级：无论是休息一日、指定天数，还是休至体力恢复，只要评定日期先到，就会立即中断，并按已休天数结算恢复量。
- 已进入评定场所后仍不能半途离开，必须先把当期评定处理完；但评定日不再把全局移动和其他地点硬锁死。

### Impact
- “休息推进时间”“评定日中断”和“迟到赴会处罚”现在进入同一套共享判断，不再由自宅、寺庙和 `main.ts` 各自散写不同标准。
- 评定日当天的流程优先级被抬到全局层级，后续如果继续扩展评定玩法，只需要复用同一套优先级判断即可。

## 2026-06-05 House Minigame And Work Day Costs

### Added
- 新增共享活动耗时 helper [src/application/house/house-activity-costs.ts](/E:/RPG_TG/src/application/house/house-activity-costs.ts)，统一提供“小游戏按等级递增天数”“工作固定 3 天”“天数转世界时间段数”和开始前提示文案。
- 新增共享 `activity-confirm` session overlay 数据形态，供多个 house 在正式进入小游戏 / 工作前先给出耗时与体力提示。

### Changed
- 粮铺算账、药铺配药、茶馆舌战改为按对应技能等级结算耗时：基础 10 天，等级越高耗时越长；完成后统一消耗 15 点体力，并把实际天数同步到 house-local 耗时和全局 world time。
- 酒馆工作、寺庙寺务与化缘工作统一改为耗时 3 天；开始前会由 NPC 明确提示耗时与 15 点体力消耗，结算时再同步推进世界时间。
- 粮铺、药铺、茶馆、酒馆、寺庙的相关开始入口不再直接跳进小游戏 / 工作，而是先经过确认 overlay，避免“点下去就开做”而看不到真实成本。

### Impact
- 现在 house 内“训练型小游戏”和“工作型事务”有了统一的时间刻度，不再继续沿用零散的 `时间 +1` 时段结算。
- 后续如果再加新的技能训练或工作流程，只需要复用共享 helper 并在开始入口挂 `activity-confirm`，不必重新散写天数公式和提示文案。

## 2026-06-04 Shared Time Progression For Movement And House Activities

### Added
- 新增共享时间推进 helper [src/application/time/time-progression.ts](/E:/RPG_TG/src/application/time/time-progression.ts)，统一处理 `morning -> afternoon -> night -> next day morning` 的时段推进，以及跨日时的评定倒计时、日期和文案更新。
- `HouseModuleTransitionResult` 新增共享 `timeAdvanceCost` 契约，并在 [docs/special-house-interface.md](/E:/RPG_TG/docs/special-house-interface.md) 记录用途：house 完成一次真实活动后，应通过共享运行时推进世界时间，而不是各模块自行散写 `calendar` / `timeOfDay`。

### Changed
- 地图移动完成后现在会统一推进 1 个时段；共享 map auto-advance 仍保留按天推进，用于“休整到评定日”这类整段快进。
- 粮铺调查/成交/算账结算、将领府邸问候/送礼/学习、货栈闲谈/调查/交易、药铺闲谈/疗伤/买药/配药、茶馆闲谈/请茶/打听/舌战、酒馆喝酒/交活/赌局结算、寺庙测运势/布施/交粮/寺务结算，现都会通过共享 house runtime 推进时段。
- 自宅的“过一天”改为复用共享按天推进 helper，不再继续维护一份独立的日期换算逻辑。
- 全局 HUD 日期文本改为显示“日期 + 当前时段”，让时段推进在非自宅场景中也可见。

### Impact
- 现在“移动”和“在 house 里做事”进入同一条 world time 机制，不再只有少数模块记录 house-local `time` 变量而不影响全局时间。
- 后续如果新 house 有“做一件事耗一个时段”的需求，只需要在模块返回 `timeAdvanceCost`，不需要再给 `main.ts` 增加特判或复制日期推进逻辑。

## 2026-06-04 Battle Branch Selective Integration

### Added
- 新增共享玩家粮食运行时库存 `var.player_inventory.grain_dou`，用斗作为统一单位承接粮店、城市化缘和寺庙交粮。
- 新增共享粮食单位换算 helper 与玩家体力消耗 helper，避免寺庙、粮店和化缘结果各自复制资源变更逻辑。
- `HouseOverlayViewModel` 新增结构化 `quantity-confirm` overlay，用于寺庙提交化缘粮食这类带上限的数量确认流程。
- 皇觉寺日常事务新增休息面板和本轮化缘交粮流程：可提交随身粮食、结算寺中贡献、记录本轮交粮评价并扣除活动体力。

### Changed
- 城市“化缘”按钮继续只在玩家 `title` / `occupation` 具备僧人/和尚身份时显示；皇觉寺开局不再提前赋予和尚身份，改由剃度剧情通过结构化 `patch-character` 效果写入 `挂单僧 / 皇觉寺僧人`。
- 粮店买卖粮食改为读写共享玩家粮食库存，并在进入粮店时迁移旧的粮店/市场米粮变量。
- 城市化缘小游戏完成后会将获得粮食写入共享库存，记录最近一次化缘结果，并消耗一次活动体力。
- 粮行算账、药铺配药、茶馆舌战、酒馆交活、酒馆赌局结算、寺庙寺务和化缘交粮统一接入活动体力消耗；体力不足时会在对应 house 或城市化缘入口提示先休息。
- 寺庙状态栏展示随身粮食、体力和本轮交粮结果；寺庙业务仍保留在 `temple-house` module 内，入口层只处理通用小游戏完成回调。
- [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 补充共享运行时库存和 `quantity-confirm` overlay 契约。

### Impact
- 没有直接合并 `origin/战斗`，避免覆盖本地酒馆长牌、城市 UI 和其他未提交改动。
- 后续若战斗分支继续推进体力、化缘奖励或寺庙评定，可继续扩展共享库存/体力 helper 和 typed overlay，而不是在 `src/main.ts` 写 house 特判。

## 2026-06-04 Character Select Layout Editor Target

### Added
- 新增 `character-select-screen` 布局编辑目标，选择人物界面现在可通过 live layout editor 直接拖拽调整真实界面组件。
- 选择人物界面新增默认布局预设，覆盖整体布局、左侧标题栏、人物名册面板、分页签、人物卡片网格、详情面板、底部操作区、返回按钮、分页文字和开始冒险按钮。

### Changed
- `LayoutEditorTargetId` 和 `UiLayoutByTargetId` 增加选择人物界面目标，`src/main.ts` 的编辑器打开逻辑会根据当前主界面自动选择 `start-screen` 或 `character-select-screen`。
- `docs/ui-layout-alignment-workflow.md` 补充 live target 扩展边界，并将资源扫描范围对齐为当前实际目录：`src/assets`、`ui`、`map`。

### Impact
- 后续继续接入其他真实界面时，应复用 `UiLayout`、`layout-editor-target-registry.ts`、默认 preset 和 `applyLiveLayoutBindings` 这条链路，不新增界面专属编辑器协议。
- 本次属于 UI 布局协作流程扩展，不改变 house 模块接口，也不在 `src/main.ts` 增加 house 业务分支。

## 2026-06-03 Tavern Long Gambling Variant

### Added
- 酒馆“赌博”入口新增结构化 `gamble-choice` overlay，先选择“长牌 / 短牌”，再进入对应下注配置；短牌继续走原有规则。
- `TavernGambleSession` 新增 `variant`，玩家状态新增长牌专用个人公开牌槽 `publicTileSlots`，公开槽支持 `covered` 状态。
- 新增长牌牌局：每名玩家开局 `5` 张暗牌与 `9` 张个人明牌，合计符合麻将 `14` 张胡型基础，下注后按轮摸 `3` 打 `3`，长牌吃/碰/杠响应窗口为 `10s`。
- 长牌新增核心 14 张胡牌评分骨架，先覆盖四组一对、七对、清一色、混一色、幺九、字牌刻、花牌和杠番，后续可继续补全完整国标 81 番。

### Changed
- 打出长牌个人明牌时，该玩家的公开槽会变为盖牌，且该弃牌标记为不可被其他玩家吃/碰/杠；每个玩家的公开槽只影响自己。
- `gamble-table` overlay 的公共牌视图新增 `covered` 字段，玩家摘要可携带个人公开牌展示字段；渲染层仍只消费 typed view model。
- 长牌牌桌 UI 隐藏短牌专用出牌槽与“打出顺/刻”相关按钮，只保留个人明牌、暗牌、下注、摸牌、弃牌和响应操作。
- [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 补充了 table mode picker 与 per-player public tile slot 的 overlay 契约要求。

### Impact
- 酒馆赌博继续通过 `tavern` house module 与 registry 接入，没有给 `src/main.ts` 增加赌博分支。
- 后续扩展长牌 AI、完整国标番种、抢杠/点炮等规则时，可以继续在 `domain/tavern-gambling.ts` 与结构化 overlay 契约内迭代。

## 2026-06-03 Tavern Gambling Discard Response

### Added
- 酒馆赌博弃牌后新增 3 秒响应窗口，按“吃/碰/杠 -> 碰/杠 -> 杠”的阶段递进；可用动作通过 `gamble-table` overlay 的结构化字段暴露给 UI，按钮可按规则闪烁。
- `TavernGambleSession` 新增弃牌响应窗口状态与已处理弃牌记录，仍保存在统一 house session 分支。
- 弃牌响应的吃/碰/杠判定现在会合并玩家手牌与该玩家未锁定公共牌，公共牌可补成顺、对子或刻子来响应他人弃牌。
- 酒馆牌桌 overlay 现在展示入场筹码、盲注、每名玩家本局下注和剩余筹码。

### Changed
- 酒馆赌博的入场数额改为总筹码语义，盲注固定为小盲 10 文、大盲 20 文，下注和加注不再把入场数额当作大盲。
- 酒馆赌博开局 seed 增加运行时熵，避免同条件第一局重复发牌。

### Fixed
- NPC 自动打出顺/刻时增加两组上限保护，避免同一名 AI 在一轮中打出超过两组。

## 2026-06-01 Tavern Mahjong Gambling Interface

### Added
- 新增酒馆赌博纯规则模块 [src/domain/tavern-gambling.ts](/D:/RPG_TG/src/domain/tavern-gambling.ts)，定义 144 张国标牌、2-6 人牌局结构、四轮下注、公共牌、摸打、碰/杠、花牌补牌和摊牌评分接口。
- `tavern` house 会话新增 `gambleSession`，赌局临时状态继续保存在统一 `GameState.ui.houseSession` 分支，不使用模块级全局变量。
- `HouseOverlayViewModel` 新增结构化 `gamble-table` overlay，用于呈现公共牌、玩家手牌、玩家下注、当前最高组合、碰杠选项、摸打动作和摊牌结果。
- `gamble-table` 玩家摘要新增可见弃牌历史字段，左侧玩家列表可以动态显示每名玩家每轮打出的牌。

### Changed
- 酒馆“赌博”从旧的 1.1 倍占位返还改为创建牌局 session，并通过 `tavern` 模块的 `dispatch` 处理下注、碰/杠、摸牌、弃牌、摊牌和最终金钱结算。
- 酒馆赌博 UI 改为消费结构化 view model 渲染牌桌，不向 application 层返回 HTML，也不向 `src/main.ts` 增加酒馆分支。
- 酒馆赌博规则调整为每人 4 张暗牌、9 张公共牌，摊牌时从 13 张里选最佳 6 张；公共牌按 5 / 2 / 2 翻开。
- 酒馆赌局流程调整为开局下注决定是否入局，随后每轮开牌后由庄家开始依次摸 2 张、杠判定、摸后跟/加/弃、弃 2 张；NPC 逐个 1-3 秒思考后执行同样流程。
- 公共牌发出后如果玩家没有可碰/杠选项，会自动跳过碰杠窗口直接下注；存在可碰/杠选项时显示 5 秒倒计时，到时自动不接。
- 酒馆赌博 UI 将“我的手牌”移入绿色牌桌下缘，玩家弃牌以麻将卡牌形式排列在对应座位区域，左侧玩家列表继续动态显示最高组合和每轮出牌。
- 酒馆赌博手牌支持拖拽重排，用于玩家自行码牌和计算组合。
- 酒馆赌博结算区展示每名玩家最终入选的 6 张牌与番数明细，便于核对系统评分。
- 清一色、混一色评分改为必须先形成有效 6 张结构：两副顺/刻，或三对子；散牌同门不再单独成立清/混一色。
- 清幺九评分同样改为必须先形成有效 6 张结构；散的幺九牌/字牌不再单独成立清幺九。
- 酒馆赌博短局番值改为“成型即有效，番数只排名”：基础结构先识别双顺、一顺一刻、三对将、双刻、四喜雏形和六字不靠，再叠加喜相逢、连六、步步高、老少副、清一色、混一色、全大/全中/全小/全双、幺九/字牌组、暗刻、花牌和杠番。
- 碰不再直接加番；明杠保留 +2、暗杠保留 +4，杠在摊牌结构中仍按刻子参与成型。
- 酒馆摸牌后弃牌流程改为先尝试打出顺/刻组：玩家可从手牌与未锁定公共牌选择 3 张移入出牌槽，确认后按自己贡献牌数补牌；用到公共牌则记为明打，公共牌变为已消耗不可再选，无法继续出组后仍需弃 2 张。
- 公共牌消耗改为玩家私有：对方打出顺/刻时使用过的公共牌只会锁定对方自己的后续选择，不会占用我的公共牌池。
- 打出自己牌数改为结算加成而非直接胜利：5 张 +2，6 张起算提前胡 +2，7 张及以上再 +1；NPC 同样按摸牌、自动出组、弃牌流程执行。
- 玩家或 NPC 打出两组顺/刻后，本局后续行动会被跳过，直接等待最终结算；仍保留其打出组和加番信息参与摊牌比较。
- 摊牌结算改为优先使用已打出的顺/刻：打出两组时直接用这 6 张结算；只打出一组时固定这 3 张，再从剩余手牌、公共牌和杠中补最佳 3 张。
- `gamble-table` overlay 新增完成等待字段，玩家或 NPC 打出两组顺/刻后 UI 会显示“等待结算”并禁用后续下注、摸牌、选牌和碰杠入口。
- 酒馆赌博弹窗改为内部滚动，结算区提升为牌局弹窗内的高层结果面板，避免被绿色牌桌区域遮住。

### Impact
- 后续要补更完整的国标番型识别、AI 行动或下注模式时，可以继续扩展 `domain/tavern-gambling.ts` 与 `gamble-table` overlay，不需要破坏 special-house 生命周期契约。

## 2026-05-30 House Access Refusal Dialogue

### Added
- 新增通用 house 进入拒绝规则：内容层可按剧情阶段、目标 `moduleId` 与 runtime flag 返回结构化拒绝对话。
- 朱元璋皇觉寺阶段补入两条拒绝对话：第一次寺庙评定前点击非寺庙地点由玩家自言“既然答应了主持，就先不要离开寺院吧。”；和尚期点击帅府由小兵提示“军机要出，请阁下回避。”
- `HouseModuleTransitionResult` 新增 `navigation: { type: "stay-in-house" }`，用于 house 模块拒绝通用离开动作并继续显示结构化对话。

### Changed
- 城市地点点击改为先走 `selectHouseEntryAccess`，符合规则时才进入 house runtime；拒绝时显示带说话人立绘的对话组件，不向 `src/main.ts` 写入具体 house 业务原因。
- 皇觉寺第一次评定期间点击右下角离开，会留在寺庙 house 内并显示玩家立绘对话“既然答应了主持，就先不要离开寺院吧。”
- [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 补充可见地点的拒绝进入对话规则。

### Impact
- 后续阶段性封锁地点、门卫拦截、自我约束类提示都可复用同一套规则，不需要在入口层增加特判。

## 2026-05-30 Tea House Debate UI And Grain Accounting UI Merge

### Added
- 合并 `shezhan` 分支中的舌战专属美术资源目录 `舌战UI/`，茶馆辩论改为“选题牌 -> 确认出牌”的 staged overlay 交互。
- 合并 `算术UI` 分支中的算账美术资源目录 `算术UI/`，粮行算账小游戏新增整屏账册式结算与答题界面。

### Changed
- `tea-house` 模块会话态新增舌战选牌字段，`HouseOverlayViewModel` 的 `debate` 结构新增 `selectedTopic`、`confirmActionId`、`confirmDisabled`，并在 [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 记录 staged overlay 的共享扩展规则。
- 茶馆模块、粮行模块及对应 house 视图中的乱码文案统一恢复为可读 UTF-8 文本。
- 本次只前移茶馆舌战玩法与粮行算账界面，不合并 `origin/算术UI` 里对 `src/main.ts` 的粮行专属 BGM 分支，以保持 special-house 合同不被入口层特判破坏。

### Impact
- 茶馆舌战和粮行算账都获得了分支中的主要界面升级，但仍然继续走 `module session -> typed overlay -> renderer` 的共享 special-house 路径。
- 后续如果其他特殊 house 也需要“先选再确认”的同类玩法，可以直接复用这次扩展后的共享 overlay 契约，而不必回到 DOM 特判或 `main.ts` 分支。

## 2026-05-30 Temple Opening Scene And Indoor Trigger Wiring

### Added
- 将皇觉寺开场剃度段整理为正式的 `旁白 -> 对话 -> 心里话 -> 方丈裁断` 演出序列，统一继续走 scene/dialog 契约。
- 在共享 house/story 运行时约定中补入 `indoor-screen-shown` 这类屋内界面展示时机的说明，明确它属于通用事件时机，不属于具体 house 私有逻辑。

### Changed
- 重写 [src/content/story/zhu-yuanzhang-main-story.ts](/D:/RPG_TG/src/content/story/zhu-yuanzhang-main-story.ts) 的寺庙开场文本，显式加入师兄“怕分走口粮”的一拍可见演出。
- 修正化缘解锁剧情中的方丈角色引用，统一改回 `char.kulan_temple_abbot`。
- 在 [src/main.ts](/D:/RPG_TG/src/main.ts) 增加通用被动剧情触发同步：当玩家停留在屋内界面且当前没有激活 scene 时，会统一评估 `indoor-screen-shown` 事件。

### Impact
- 皇觉寺开场现在可以直接承接文案碎片，不需要另写临时演出面板，也不会把心里话埋成不可见注释。
- 寺庙贡献达到阈值后的“准其外出化缘”剧情不再依赖手动点补触发；后续其他 house 若也需要屋内展示时机事件，可以复用同一条共享运行时路径。

## 2026-05-30 Tavern Work Intake Flow

### Added
- 酒馆工作改为“工作 -> 接取 / 提交”两段式流程，移除旧的“接当前活”即时完成 action。
- 新增酒馆任务持久状态键：当前已接任务、任务进度、完成标记和失败标记都写入 `GameState.runtime`。
- 新增刷盘子任务，复用 shared `qte-bar` overlay 与 `tick + stop-interval` 生命周期，三次判定后按完成度结算金钱。
- 为护送商队、跑腿采买等随机事件类酒馆任务保留 `random-event` 类型接口；当前未接入事件执行时，提交会按失败处理。

### Changed
- 酒馆会话状态新增工作面板模式、提交选择和已接任务列表，仍通过统一 `GameState.ui.houseSession` 管理。
- 提交任务前会弹出二次确认；未完成或失败任务允许提交，但结算为失败并从当前酒馆已接列表移除。

### Impact
- 后续扩展酒馆随机事件、声望解锁和多任务容量时，可以继续在 tavern module 内扩展，不需要给 `src/main.ts` 加 house 特判。
- 特殊 house 的任务状态示例进一步明确：接受/完成/失败这类持久状态必须进入统一 runtime，而不是模块级全局变量。

## 2026-05-29 Main Story Data Contract

### Added
- 新增共享主线领域合同 [src/domain/story.ts](/D:/RPG_TG/src/domain/story.ts)，定义 `StoryArcDefinition`、`StoryBeatDefinition`、剧情阶段变量键与节拍完成标记键。
- 新增朱元璋主线样例内容 [src/content/story/zhu-yuanzhang-main-story.ts](/D:/RPG_TG/src/content/story/zhu-yuanzhang-main-story.ts)，演示 `arc -> beat -> event -> scene` 的推荐组织方式。
- 新增主线数据合同文档 [docs/story-mainline-data-contract.md](/D:/RPG_TG/docs/story-mainline-data-contract.md)。

### Changed
- 将“主线剧情如何驱动游戏”的建议从口头约定收口为仓库内可复用合同，明确继续复用现有事件系统，而不是另起一套剧情运行时。
- 为现有 `zhu-yuanzhang-story` 阶段变量补上与 `var.story.<arcId>.stage` 命名规则一致的内容样例。

### Impact
- 后续新增主线、支线或人物剧情时，可以按统一内容合同组织，不需要把剧情推进逻辑塞进 `main.ts`、house 模块或页面层。
- 剧情阶段、节拍完成和事件触发历史的责任边界更清楚，便于后续扩存档、回放与调试。

## 2026-05-30 Story Fragment Intake Rule

### Added
- 在 [docs/story-mainline-data-contract.md](/D:/RPG_TG/docs/story-mainline-data-contract.md) 中补入“输入约定”“自然语言转剧情内容工作流”和“皇觉寺碎片示例”。
- 新增 [docs/zhu-yuanzhang-temple-opening-draft.md](/D:/RPG_TG/docs/zhu-yuanzhang-temple-opening-draft.md)，把皇觉寺开场桥段拆成 beat、事件链、状态键和当前实现差距。

### Changed
- 明确主线协作方式允许文案作者直接提供碎片化灵感，不要求其预先写成结构化模板。
- 将“碎片输入 -> 历史判断 -> beat / event / scene / state”收口为代理应承担的标准转换职责。
- 将 [src/content/story/zhu-yuanzhang-main-story.ts](/D:/RPG_TG/src/content/story/zhu-yuanzhang-main-story.ts) 从示例主线改为贴合当前设计方向的皇觉寺开场草案，并为 [src/domain/zhu-yuanzhang-story.ts](/D:/RPG_TG/src/domain/zhu-yuanzhang-story.ts) 补入寺庙期变量键和 flag 常量。
- 扩展 [src/domain/house-module.ts](/D:/RPG_TG/src/domain/house-module.ts) 的共享 overlay typed contract，新增 `qte-bar` 结构，用于寺庙等特殊 house 的默认停点小游戏。
- 将 [src/application/house-modules/temple-house/temple-house-house-module.ts](/D:/RPG_TG/src/application/house-modules/temple-house/temple-house-house-module.ts) 从纯寺务分配扩展为按剧情阶段开放寺内帮忙、累计贡献并解锁化缘的实际玩法流。

### Impact
- 后续剧情创作可以更贴近文案工作习惯，不需要作者替系统做事件建模。
- 代理在把自然语言落成代码时有了明确的中间转换规则，能减少反复来回补格式。
- 皇觉寺开场现在已经有了仓库内的正式剧情草案，后续寺庙玩法改造、QTE 接入和化缘解锁可以直接对照实现。
- 统一 QTE overlay 进入 shared contract 后，后续其他特殊 house 若也需要同类停点玩法，可以继续复用同一套 `tick + overlay + renderer` 路径，而不用再写入口特判。

## 2026-05-29 Temple House And Story-Stage Routing

### Added
- 新增 `temple-house` 特殊 house 模块，提供住持接待、测运势、捐香火，以及和尚时期的寺中评定与差事派发流程。
- 新增朱元璋早期剧情阶段键：`huangjue-temple` 与 `guo-zixing-camp`，统一写入 `GameState.runtime.variables`。
- 新增寺庙持久变量键与寺庙会话类型，用于累计香火与记录最近一次寺务派发。

### Changed
- `HouseDefinition` 与 `CityEntryDefinition` 扩展 story-stage 可见性/可进入元数据，并通过通用 selector 接管城市卡片与 house 入口过滤。
- 和尚时期的评定从帅府迁到寺庙，但不移除各城帅府；帅府仍可进入，只是不再对未入郭子兴阵营的主角触发评定。
- 原型世界补入各城寺庙 house，并把和尚类历史人物的默认驻所从茶馆改为寺庙；和尚期主角也会改驻皇觉寺。
- `docs/special-house-interface.md` 同步补入 stage-gating 元数据与 `temple-house` 示例，保持 shared contract 与实现一致。

### Impact
- “和尚期寺庙评定 / 入营后帅府评定”现在通过统一运行态和 registry 生效，不需要在 `src/main.ts` 为剧情阶段追加 house 特判。
- 后续如果还要扩展其他人物阶段、门派据点或阶段性城市入口，可以复用同一套 story-stage selector，而不是继续堆入口分支。

## 2026-05-27 Documentation Alignment

### Changed
- 对齐 [architecture.md](D:/RPG_TG/docs/architecture.md) 与当前代码实现，修正 `House` 入口字段、统一 `GameState` 结构，并补入特殊 house runtime、城市 NPC 池和市场运行态说明。
- 对齐 [special-house-interface.md](D:/RPG_TG/docs/special-house-interface.md) 与 `src/domain/house-module.ts` 当前契约，统一 `HouseModuleTransitionResult`、`HouseModuleRequest`、`HouseModuleSideEffect` 与 `tick` 驱动约束。
- 为 [development-plan-2026-05-25.md](D:/RPG_TG/docs/development-plan-2026-05-25.md) 增加“历史计划”说明，避免继续把阶段计划误用为现行接口规范。
- 清理本文件中的编码异常与失真段落，恢复可读的 Market System Merge 记录。

### Impact
- 后续开发可以直接以文档为准核对当前实现，不会再因 `onEnterSceneId`、旧 `GameState` 示例或过期 house 返回结构产生误导。
- 特殊 house 的开发、评审和扩展规则现在和代码现状一致，能减少“文档允许、实现不支持”或“实现已有、文档没写”的偏差。

## 2026-05-28 Medicine House UI Merge

### Added
- 为药铺配药浮层补入结构化清盘动作：`medicine-compounding` overlay 新增 `clearActionId` 与 `clearLabel`，药铺模块新增“清空药盘”处理。
- 合并 `yaopuui` 分支中的药铺专属美术资源与新版配药界面布局。

### Changed
- 药铺模块文案、购买浮层与配药结算改为清晰 UTF-8 文本，移除旧实现中的乱码输出。
- 药铺配药界面改为继续走统一 `data-house-action` 点击分发，不把 `yaopuui` 里的药铺专属拖拽逻辑并入 `src/main.ts`。
- `docs/special-house-interface.md` 补充共享 overlay 扩展规则，明确 richer overlay control 也必须先进入 typed contract。

### Impact
- 药铺现在获得了 `yaopuui` 的主要视觉升级和清盘玩法，同时保持 special-house 合同，不会为了单个 house 污染入口层。
- 后续如果其他特殊 house 也需要 overlay 级附加动作，可以按同一 typed contract 方式扩展，而不是再引入 DOM 特判。

## 2026-05-27 Leader Residence Directory Entry

### Added
- 新增 `leader-residence` 特殊 house 模块，用于承接“将领府邸 -> 选人 -> 拜访”的统一人物拜访流程。
- 新增城市目录入口模型：城市卡片可以先打开本城人物列表，再选中目标角色进入共享 special house。
- 原型内容新增“将领府邸”入口卡与两名乡贤样例人物：刘伯温、李善长。

### Changed
- 城市页从“所有卡片都直接进入 house”扩展为同时支持“直接进 house”与“先开目录再进入目标 house”的两级入口模式。
- `special-house-interface.md` 补充 grouped city entry 规则，明确目录选择属于城市导航层，但最终仍必须落回 `moduleId + registry + lifecycle`。
- “将领府邸”从静态房屋概念收敛为“本城可拜访历史人物列表”入口，并明确排除主帅与其他 house 固定工作 NPC。

### Impact
- 后续如果还要做市场分铺、官署分房间、人物目录类入口，可以复用同一套城市目录入口模式，而不必在 `main.ts` 里追加特判。
- 人物拜访系统现在可以按“本城人物列表 + 参数化拜访模块”扩展，不需要为每个历史人物单独造一栋真实 house。

## 2026-05-26 UI Layout Alignment Workflow

### Added
- 新建 `docs/ui-layout-alignment-workflow.md`，固定当前 UI 布局对齐的协作方式、参数格式和源码回写规则。

### Changed
- 明确布局编辑器当前采用“复制完整布局参数 -> 用户粘贴给代理 -> 代理回写 `src/content/layout-editor-presets.ts`”的工作流，而不是下载文件再导入。
- 在 `docs/collaboration.md` 增加了这套工作流的文档入口，后续涉及布局对齐流程变更时需要同步更新。

### Impact
- UI 微调不再依赖口头说明，后续 HUD、面板和其他可视化布局的对齐方式有了稳定协作协议。
- 布局编辑器与源码默认配置之间的责任边界更清楚，能减少“编辑器改了但默认值没落地”的反复。

## 2026-05-26 Home House Recovery Loop

### Added
- 新增 `home-house` 特殊 house 模块，为 `home_001` 提供休息、查看状态、整理道具、结束当天四类据点流程。
- 新增自宅持久数据结构与 Hook 预留：配偶接口、住宅成长字段、休息中断检查，以及“指定天数静养”输入浮层。

### Changed
- `GameState.world` 增加统一的 `timeOfDay` 与 `schedule.councilDate`，让自宅休息与评定日期能走共享运行态，而不是 house 私有全局。
- `keep-house` 在评定派发差事后会同步写入下次评定日期；特殊 house 共享 overlay 契约扩展为支持静养天数输入。
- 原型城市新增房屋 `home_001`（自宅），主角默认驻所改为自宅，形成“外出 -> 回家静养 -> 再外出”的循环入口。

### Impact
- 项目现在具备了第一个偏生活节奏的长期据点，玩家能在统一 house 合同下推进日期、恢复状态、查看行囊，而不需要在入口层加自宅特判。
- 后续若要接入妻子支援、家具升级、家庭事件或仓储扩建，可以继续沿用已有的自宅持久结构与 Hook，而不用推翻当前 house 接口。

## 2026-05-25 Medicine House Module

### Added
- 新增 `medicine-house` 特殊 house 模块，为 `house.kulan.medicine_house` 提供问诊、疗伤、买药与配药小游戏流程。
- 新增药馆持久状态键与配药纯逻辑：成药库存写入 `var.medicine_inventory.*`，疲劳恢复走统一运行时变量，配药小游戏支持按药材组合结算评级。
- 原型城市新增药馆房屋、郎中角色，以及药馆专属视图与模块注册接线。

### Changed
- 药馆沿用现有 special-house 契约接入 `moduleId + registry + sessionState + viewModel`，没有向 `main.ts` 添加 house 特判。
- 茶馆与药馆对齐为一致的 `greeting -> open -> idle` 交互节奏，药馆相关测试并入统一 `robustness` 回归集。
- 合并药馆时保留当前 `提交版本` 的城市命名，相关返回文案继续使用“濠州”而不是旧分支中的“应天府”。

### Impact
- 当前原型城内已经具备生活恢复链路中的医疗据点，玩家可以在统一 house runtime 下完成治疗、购药与轻量玩法，而不依赖单独入口逻辑。
- 后续若要扩展药方、伤病状态、医术成长或更多医馆 NPC，可以继续沿用已有模块边界与统一状态结构。

## 2026-05-22 Market House Trade Logic

### Added
- 新建 `src/content/houses/market-house-content.ts` 与 `src/domain/market-house.ts`，集中定义货栈 NPC 池、跑商库存刷新键和交易结果结构。
- 为 `market-house` 增加专用商品交易浮层，支持货单选择、数量输入和买卖差价结算。

### Changed
- `market-house` 从“城市店铺总览”改为真正的货栈交易屋舍：进入时固定钱掌柜打招呼，再按 `greeting -> open -> idle` 节奏展开、收起与重开。
- 货栈会按 3 到 7 天刷新随机商人和货单，玩家商品库存与 NPC 好感统一落在 `GameState.runtime.variables`，不再依赖临时视图态。
- 原型内容中的 `house.kulan.market` 改名为“货栈”，默认驻场角色文案同步调整为钱掌柜。

### Impact
- 货栈现在可以承接低买高卖、跨城倒卖和行情打听这类跑商循环，同时继续遵守 special-house 契约与统一 house runtime。
- 通用 house overlay 契约扩展后，后续当铺、商会、黑市等屋舍也可以复用同一套结构化交易浮层，而不需要把 HTML 塞回 application。

## 2026-05-22 Market System Merge

### Added
- 新建 `src/domain/trade-good.ts` 与 `src/domain/market.ts`，补齐统一贸易货物和城市市场数据模型。
- 新建 `src/content/markets/global-goods-pool.ts` 与 `src/application/markets/*`，提供全局货池和城市市场刷新逻辑。
- 在 `GameState.runtime` 中增加 `cityMarkets`，统一保存各城市市场运行态。

### Changed
- `CityDefinition` 扩展 `tags`、`prosperity`、`danger`、`specialDemand`，让市场刷新和需求差异走城市静态配置而不是硬编码。
- `create-initial-state` 改为初始化 `cityMarkets`，让市场系统从统一状态工厂进入运行时。
- 市场相关逻辑改为复用 special house 与统一 house runtime，而不是追加入口层特判或独立市场全局。
- `HouseDefinition.activityLocationId` 开始承接 market / street 等地点的流动 NPC 槽位声明。

### Impact
- 市场系统和 special house、城市 NPC、统一 runtime 结构完成对接，后续不需要为不同商业地点再开一套状态体系。
- 后续新增市场类屋舍时，可以继续沿用 `cityMarkets` 和 `MarketShopType`，减少重复建模。

## 2026-05-22 Market House Wiring

### Added
- Added `market-house` as a special-house module with its own session state and renderer.
- Added market-house tests covering enter flow, shop switching, and unified city market inventory display.

### Changed
- Upgraded `house.kulan.market` to use `moduleId: "market-house"` instead of the generic house path.
- Reused unified `runtime.cityMarkets` data for city market browsing instead of adding new market globals.

### Impact
- `house.kulan.market` now follows the repository special-house contract and no longer depends on plain house fallback behavior.
- Market browsing is now attached through `moduleId + registry`, which keeps `src/main.ts` free of market-specific branches.

## 2026-05-22 Keep House Meeting Flow

### Added
- Added `keep-house` as a special-house module for `house.kulan.keep`, including audience dialogue, review meeting flow, contribution ranking, strategy briefing, and task assignment.
- Added Guo Zixing-aligned prototype generals so the keep meeting can render a left-side roster and review contribution board.
- Added keep-house tests covering countdown-zero entry, meeting progression, and resetting the review countdown to `60` after task assignment.

### Changed
- Upgraded `house.kulan.keep` to use `moduleId: "keep-house"` instead of the generic static house path.
- Updated the prototype debug scenario so the player already serves under Guo Zixing and the unified review countdown starts at `0`, which forces the meeting to trigger immediately when entering the keep.
- Keep meeting task assignment now updates shared mission state, shared UI mission text, and unified runtime countdown data rather than using keep-specific globals.

### Impact
- The city lord house now follows the repository special-house contract and no longer depends on plain fallback house rendering.
- Review timing, meeting contribution data, and assigned work all flow through unified game state plus `ui.houseSession`, keeping `src/main.ts` free of keep-specific business branches.

## 2026-05-22 Global Status Bar Layout Refresh

### Changed
- Rebuilt the global player panel into a single top-left status board that uses `yuansu/1_002_top_status_bar_1.0.png` as its main frame instead of the earlier split card layout.
- Corrected the panel data mapping so the board now shows current city, player gold, stamina, fame, review countdown, and current mission text from unified state instead of temporary placeholder fields.

### Impact
- The always-visible top-left HUD now matches the project reference composition more closely without introducing new entrypoint branches or house-specific UI wiring.
- Global player summary data continues to flow through shared `GameState` and panel view-model wiring, keeping the renderer contract stable while updating presentation.

## 2026-05-21 City NPC Pool Template

### Added
- 新建城市级 NPC 池领域模型：`src/domain/city-npc.ts`
- 新建城市 NPC 每日刷新与 House 选择器骨架：`src/application/city-npcs/*`
- 为库兰城补充城市共享 NPC 池样例，以及可承接流动 NPC 的茶馆模板。
- 新建茶馆特殊 house 模块：`domain/tea-house`、`domain/house-modules/tea-house-session`、`application/house-modules/tea-house/*`、`ui/views/house/tea-house-house-view`
- 新建酒馆特殊 house 模块：`domain/tavern`、`domain/house-modules/tavern-session`、`application/house-modules/tavern/*`、`ui/views/house/tavern-house-view`

### Changed
- `GameState.runtime` 新增 `cityNpcPools`，用于统一保存“按城市共享、按日期刷新”的 NPC 位置与好感度运行态。
- `HouseDefinition` 新增可选 `activityLocationId`，用于声明某个 House 对应的城市活动地点槽位，而不是各自维护独立 NPC 池。
- 普通 House 视图改为可叠加显示“固定驻场角色 + 当日流动城市 NPC”。
- `HouseModuleId` 扩展为支持 `tea-house`，库兰城茶馆改为通过统一 registry 接入，而不是普通 House 静态展示。
- `HouseModuleId` 扩展为支持 `tavern`，库兰城客栈入口提升为酒馆 special house，通过统一 registry 接入工作 / 喝酒 / 赌博三类流程。
- 茶馆进入逻辑改为“固定老板 + 当日茶馆地点中至多 2 名城市流动 NPC”，并在模块内实现闲谈、请喝茶、打听消息、舌战四类交互。
- 特殊 house 视图注册表补入 `tea-house` renderer，茶馆现在可以通过 `moduleId -> view registry` 正常渲染。
- 粮铺与茶馆共享的 action/dialogue/status/leave/alert 视图块抽入 `src/ui/views/house/house-shared-view.ts`，特殊 house 视图层开始复用统一 renderer 而不是互相复制模板。
- 酒馆新增工作 / 喝酒 / 赌博三条流程：工作按支线活计即时结算，喝酒确认后扣 100 文，赌博先按接口占位以 1.1 倍返还赌本，后续再接真正小游戏。

### Impact
- 同一座城的流动 NPC 不再绑定到单个 House，而是通过城市共享池按日刷新，后续茶馆、酒馆、集市等地点都可复用同一模板。
- NPC 位置在同一天内保持稳定，只会在日期变化后重新刷新，能更自然地营造“城里的人在流动”的感觉。
- 茶馆现在成为第一个基于“城市共享 NPC 池 + 特殊 house 合同”实现的社交型屋舍，后续酒馆、道场、情报点可以沿同样模式扩展。

## 2026-05-20 Special House Contract

### Added
- 新建仓库级代理约束文件：`AGENTS.md`
- 新建特殊 `house` 接口规范：`docs/special-house-interface.md`

### Changed
- 将“新增 house 实例”明确设为一个强触发场景：任何代理在实现前都必须先展示并遵守特殊 house 接口合同。
- 把特殊 house 的硬约束从分散的分层原则，收紧为可执行的架构规则：禁止在 `main.ts` 写具体 house 分支、禁止在 `application` 返回 HTML、禁止用全局变量保存 house 会话态、禁止在进入 house 时重置玩家基础属性。

### Impact
- 以后任何人或代理再提“开发一个新的 house 实例”，都会先看到接口规范，而不是直接开始写特例代码。
- 特殊 house 的接入方式从“约定俗成”升级为仓库级合同，便于多人协作和代码审查。

## 2026-05-20 Demo Follow-up Plan

### Added
- 新建 2026-05-25 开发计划文档：`docs/development-plan-2026-05-25.md`

### Changed
- 明确 demo 阶段暂不做大规模拆分，但将 2026-05-25 设为结构收口节点。
- 将后续工作聚焦为三项基础建设：特殊 `house` 接口、玩家运行态边界、存档结构。

### Impact
- 后续开发从“继续堆 demo 功能”转为“先稳住接口，再扩功能”。
- 团队可以按同一时间表准备 5 月 25 日之后的架构收口工作。

## 2026-05-20 Grain Shop Refactor

### Added
- 新建特殊 house 共享领域契约：`src/domain/house-module.ts`
- 新建特殊 house 注册表：`src/application/house-modules/house-module-registry.ts`
- 新建粮行模块会话态与生命周期实现：`src/application/house-modules/grain-shop/*`

### Changed
- `src/domain/house.ts` 为 `HouseDefinition` 增加 `moduleId`，明确 house 的行为绑定不再依赖 `id` 字符串特判。
- `src/domain/global-ui.ts` 与 `src/application/state/create-initial-state.ts` 增加统一 `ui.houseSession`，替代入口层游离的 house 会话全局变量。
- `src/main.ts` 改为通用 `moduleId + registry` 分发，不再直接导入或分支处理粮行业务。
- `src/ui/views/house/grain-shop-house-view.ts` 改为消费结构化 `HouseModuleViewModel`，保留全局 UI 覆盖层，场景切换不再重绘全局组件容器。
- `src/application/grain-shop/init-grain-shop-session.ts` 停止在进入粮行时重置玩家金钱和算术。
- 删除旧的粮行专用入口控制与旧会话 UI 类型：`src/application/grain-shop/grain-shop-interactions.ts`、`src/application/grain-shop/accounting-timer.ts`、`src/application/grain-shop/grain-shop-session-ui.ts`、`src/ui/views/house/grain-shop-ui-state.ts`

### Impact
- 粮行成为第一个严格走仓库 house 合同的特殊 house，实现了统一状态传递、统一会话存放、统一副作用调度。
- 以后新增茶屋、道场、锻冶屋时可以直接按 `moduleId + registry + sessionState + viewModel` 方式接入。
- `main.ts` 从“原型特例堆叠”收口为稳定入口，后续继续扩 house 时冲突会小很多。

## 2026-05-20 Robustness Baseline

### Added
- 新建库存纯逻辑模块：`src/application/inventory/inventory-selection.ts`
- 新建最小纯逻辑测试基线：`tests/robustness.test.mjs`
- 新增测试构建配置与脚本：`tsconfig.test.json`、`npm test`

### Changed
- `src/domain/house-module.ts` 将 `houseSession` 从宽泛 `unknown` 收紧为按 `moduleId` 区分的联合类型。
- 粮行 house 模块、主入口与粮行纯逻辑中的关键查找从静默兜底改为显式断言失败。
- `eslint` 排除旧 `prototypes/**` 原型目录与 `.test-dist/**`，避免历史演示代码干扰主工程校验线。

### Impact
- 后续 house 模块可以沿着 `moduleId -> sessionState` 的稳定契约扩展，不需要再在入口层做裸转型。
- 内容配置缺失会更早暴露，避免运行时静默落到错误角色或错误房屋。
- 项目现在具备最小可执行的纯逻辑回归线，可先守住粮行交易、算账结算、house session 和库存选择一致性。

## 2026-05-20 Main Assembly Split

### Added
- 新建入口层共享状态类型：`src/application/app-shell.ts`
- 新建 UI 状态动作模块：`src/application/app-actions.ts`
- 新建特殊 house 运行时装配模块：`src/application/house/house-runtime.ts`
- 新建页面拼装渲染模块：`src/ui/app-render.ts`

### Changed
- `src/main.ts` 从业务中心收口为装配层，只保留事件监听、初始化、modal confirm 和渲染调用。
- `enter/leave/dispatch/applySideEffects/interval` 相关逻辑迁入 `house-runtime`。
- 卡牌、贵重物与 overlay 的 UI 状态修改迁入 `app-actions`。
- stage / modal / overlay / character detail 相关渲染拼装迁入 `app-render`。

### Impact
- 入口文件不再直接承担 house 生命周期、库存状态修改和大段 HTML 拼装。
- 后续继续做 house renderer 收口或增加 overlay 时，可以在独立模块内改动，降低 `main.ts` 冲突面。
- 第 1 次小重构已经为后续第 2 次 house 模块收口提供了更稳定的装配边界。

## 2026-05-20 House View Registry

### Added
- 新建特殊 house 视图注册表：`src/ui/views/house/house-module-view-registry.ts`

### Changed
- `src/ui/app-render.ts` 不再直接导入或分支处理粮行 renderer，改为通过 `moduleId -> renderer` 注册表渲染。
- `docs/special-house-interface.md` 明确要求特殊 house 的视图层也通过稳定 registry wiring 接入。

### Impact
- 入口层和页面拼装层都不再需要知道具体房屋名，剩余的特殊 house 视图耦合被压缩到稳定 registry。
- 后续新增茶馆、武馆、当铺时，只需注册模块行为和视图，不必继续污染装配层。

## 2026-05-19

- 粮铺算账小游戏：累计答错 3 次立即结束并进入结算，HUD 显示剩余可错次数。
- 粮铺 UI：去掉顶部状态条；底部左对话框、右大立绘分开展示，左下角场景名称卡片。
- 将粮铺原型按四层架构接入主项目：`content` 配置、`domain/grain-shop` 类型、`application/grain-shop` 流程、`ui/views/house/grain-shop-house-view` 视图。
- 在库兰城新增房屋 `house.kulan.grain_shop` 与掌柜角色 `char.kulan_grain_shopkeeper`。
- 主循环：地图 -> 库兰城 -> 粮铺 -> 买卖 / 调查 / 算账小游戏 -> 属性变化 -> 返回城市。

## 2026-05-19 Main Loop

### Added
- 新建 `effect-applier`，统一处理 flag、变量、任务、角色属性变化。
- 新建 `scene-runner`，用于推进场景 action 执行。
- 新建 `choice-resolver`，用于处理选择肢结果。
- 新建 `game-store`，用于统一保存与推进 `GameState`。
- 新建 `create-initial-state`，用于生成运行时初始状态。
- 新建 `game-store-example`，用于跑通示例事件流程。

### Changed
- 示例运行状态从内容文件内联假数据，改为通过状态工厂函数生成。
- 项目从“可定义事件”推进到“可执行事件主循环”。

### Impact
- 事件现在不只可声明，还能暂停、推进、选择、改状态。
- UI 接入时可以直接读取 store 快照，不需要再从零设计执行模型。

## 2026-05-19 Prototype Map

### Added
- 新建 Vite 前端运行入口：`index.html`、`src/main.ts`
- 新建地图移动原型内容：`prototype-world.ts`
- 新建地图移动命令：`travel-to-coordinate.ts`
- 新建城市进入命令：`enter-city.ts`
- 新建二次确认弹窗组件：`confirm-modal.ts`
- 新建地图视图与城市视图：`map-view.ts`、`city-view.ts`
- 新建原型样式文件：`prototype.css`
- 新建全局主角栏组件：`global-player-panel.ts`
- 新建角色详情全屏页：`character-detail-view.ts`
- 扩展人物数据结构：立绘差分、姓名年龄职位、人物简介、生卒年、体力、技能表。
- 扩展全局 UI 状态：距离评定日期、主家任务。

### Changed
- 项目从纯架构骨架推进到可交互页面原型。
- 新增地图 -> 二次确认 -> 移动 -> 城市进入 -> house 展开的基础流程。
- CSS 规则从单前缀模式调整为兼容 BEM 的命名，适配原型层的元素与修饰符。

### Impact
- 现在可以直接在浏览器里验证网格移动与城市进入逻辑。
- 后续地图、城市、house、事件 UI 可以在同一前端入口上继续迭代。
- 原型层可以在不破坏规范的前提下使用 `block__element--modifier`。
- 左上角主角栏已按目标布局接入原型。
- 点击主角栏可进入全屏角色详情。

## 2026-05-19 Character Detail Layout

### Changed
- 重构 `character-detail-view.ts`，将人物详情页整理为头部信息、左侧立绘与简介、右侧属性 / 装备 / 技能的全屏布局。
- 调整 `prototype.css` 中的人物详情页样式，使其更接近目标原型，并补上关闭按钮样式。
- 更新 `main.ts` 与 `game-store-example.ts` 的初始化数据，补齐 `cards` / `valuables` 输入，为人物详情提供据点、上司、装备等展示文本。
- 修正 `create-initial-state.ts` 的类型输入方式，保证 lint 与 typecheck 正常运行。

### Impact
- 人物详情页现在具备稳定的全屏展示结构，后续继续补按钮、贵重物、卡片时不需要再推翻页面骨架。
- 项目当前 `typecheck`、`build`、`lint` 可以作为后续扩展前的基础校验线。

## 2026-05-19 Inventory Overlay

### Added
- 新建卡库全屏视图：`src/ui/views/cards/card-library-view.ts`
- 新建贵重物全屏视图：`src/ui/views/valuables/valuable-library-view.ts`
- 新增卡库筛选状态、贵重物筛选 / 排序状态，以及武具装备槽位展示逻辑。

### Changed
- `src/main.ts` 从独立的 `characterDetailOpen` 分支改为统一使用 `ui.overlayView` 驱动人物详情、卡库、贵重物三个浮层。
- `src/domain/global-ui.ts` 扩展了卡库和贵重物列表的筛选 / 排序 UI 状态。
- `src/domain/valuable-item.ts` 扩展了贵重物详情字段，为后续装备 / 业务逻辑保留余量。
- `src/application/state/create-initial-state.ts` 补齐库存相关默认状态。
- `src/application/navigation/enter-city.ts` 在进入城市时清理 overlay，避免地图浮层残留。
- `src/ui/views/character/character-detail-view.ts` 的“卡 / 贵重品”按钮改为真实跳转库存页。
- `src/styles/prototype.css` 新增统一的全屏藏品页布局样式。

### Impact
- 角色详情、卡库、贵重物现在共用一套全屏浮层切换规则，后续新增日志页、任务页、背包页时可以直接复用。
- 贵重物列表已经具备筛选、排序、详情展示和单槽装备的基础交互，后续只需继续补业务规则。
- 全局主角栏到库存系统的用户路径已经打通，可直接在浏览器里验证交互。

## 记录规则

以下改动必须记录：

- 新增功能
- 删除功能
- 修改 `src/domain` 公共类型
- 修改 `src/application` / `src/ui` 的模块边界
- 修改内容配置格式
- 修改存档结构
- 修改事件触发规则
- 新增或调整样式分层规范
- 新建跨容器目录
- 修改“容器之外”的结构

这里的“容器之外”指：

- 新建或修改 `src` 一级目录
- 新建或修改 `docs` 一级规则文档
- 新增公共运行入口
- 新增跨模块共享服务

不强制记录的改动：

- 纯文案错字修正
- 不影响契约的小样式微调
- 局部实现细节重构且外部接口不变

## 模板

```md
## YYYY-MM-DD

### Added
- 新增了什么

### Changed
- 改了什么边界或结构

### Impact
- 对协作、配置、运行流程的影响
```

## 2026-05-27 Server Deployment Scripts

### Added
- Added [docs/server-deployment.md](/D:/RPG_TG/docs/server-deployment.md) to document localhost development and no-port production deployment.
- Added [scripts/serve-static.mjs](/D:/RPG_TG/scripts/serve-static.mjs) as the production static server for the built `dist/` output.
- Added [scripts/start-dev-localhost.ps1](/D:/RPG_TG/scripts/start-dev-localhost.ps1) and Linux deployment helpers in [scripts/server](/D:/RPG_TG/scripts/server).
- Added Windows Server IIS deployment scripts: [publish-iis-dist.ps1](/D:/RPG_TG/scripts/server/publish-iis-dist.ps1), [install-iis-site.ps1](/D:/RPG_TG/scripts/server/install-iis-site.ps1), and [manage-iis-site.ps1](/D:/RPG_TG/scripts/server/manage-iis-site.ps1).

### Changed
- Updated [package.json](/D:/RPG_TG/package.json) with `dev:localhost` and `serve:prod`.
- Replaced [README.md](/D:/RPG_TG/README.md) with a readable startup and deployment overview.
- Switched [docs/server-deployment.md](/D:/RPG_TG/docs/server-deployment.md) to make Windows Server + IIS the default production deployment path.

### Impact
- Local debugging remains on `http://localhost:5173` while production can be exposed on `http://159.75.153.83` through `nginx` on port `80`.
- The built game can now run as a managed background process behind `systemd` instead of depending on a manually attached shell session.
- On Windows Server, the built game can now be hosted directly by IIS on port `80`, with `W3SVC` acting as the daemonized service manager.
## 2026-06-18 JSON World Data And Generic Activity QTE

### Added
- `ScenarioPackDefinition` now accepts optional `cities` and `houses` arrays, so a JSON start pack can materialize world entities instead of only swapping character/event/scene/activity data.
- Added shared `GameState.runtime.activitySession` plus a reusable `generic.qte` activity session runner. Scene `start-activity` now opens an interactive QTE overlay and settles configured outcome effects only after the player clicks through the rounds.
- Liu Bang's JSON opening pack now defines `city.pei_county` and starts Liu Bang, Xiao He, and Lu Wan in that city.

## 2026-06-29 Navigation Time Event Runtime Extraction

### Added
- 在 `src/core/contracts/` 新增 `event-runtime.ts` 与 `scene-runtime.ts`，明确 Child 3 的事件候选、事件激活、scene handoff、task action、task signal 这些过渡期合同。
- 在 `src/core/runtime/` 新增 `navigation-runtime.ts`、`time-runtime.ts`、`event-runtime.ts`、`event-candidate-selector.ts`、`event-condition-evaluator.ts`、`event-activation.ts`、`scene-runtime.ts`、`scene-session.ts`、`scene-choice-resolution.ts`，把导航入口、时间推进入口、事件候选选择、事件激活、scene 会话接力拆成独立 seam。

### Changed
- `src/main.ts` 不再在对应入口点直接内联 `enterCity()`、`advanceGameStateOneDay()`、`advanceGameStateTimeSegments()` 和 `triggerStoryEvents()` 作为唯一控制路径，而是先创建 typed runtime request，再经由 Child 3 的 runtime wrapper 进入导航、时间、事件、scene seam。
- `src/core/contracts/runtime-request.ts` 的 `tick` 请求现在支持可选 `payload`，以便时间推进 seam 携带段数等最小 runtime 输入。
- `src/core/contracts/runtime-result.ts` 现在可以携带 `scene`、`taskActions` 与 `taskSignals`，为后续 Task Runtime / Interactive Runtime 抽离预留统一返回通道。

### Impact
- Child 3 让 `main.ts` 第一次从“直接控制导航/时间/剧情触发”转成“创建 request 并交给 runtime seam”，后续 Child 4 可以在这个基础上继续把 interactive/minigame/story-battle 接到统一 runtime。
- 事件系统和 scene 系统现在已经有第一层明确的 core-runtime 接缝，但仍然是过渡实现：具体剧情播放和任务状态机还没有被完全抽离，后续要继续通过 Child 4/后续 task runtime work 收口。

### Changed
- Runtime city and house registries in `main.ts` are now resettable and scenario-pack aware, rather than fixed startup constants.
- `generic.qte` no longer auto-completes activities. Missing specialized handlers now fall back to the same click-bar interaction shape used by the Zhu Yuanzhang temple work QTE.

### Impact
- JSON packs are closer to the intended “runtime input JSON -> new opening/game variant” loop: world location data can be carried by the pack and consumed by the existing runtime.
- Activity results remain schema-driven through `ActivityDefinition.outcome`; runtime does not infer behavior from activity labels or scene text.

## 2026-05-30 Mechanism-First Gameplay Guidance

### Added
- 在 [AGENTS.md](/D:/RPG_TG/AGENTS.md) 新增“机制优先设计规则”与“类型参考规则”，明确后续代理在做玩法开发时，必须优先提炼可复用机制组件，而不是继续写一次性剧情插片、house 特判或复制流程。
- 在 [docs/architecture.md](/D:/RPG_TG/docs/architecture.md) 补入同名开发原则，要求把同类玩法差异尽量留在 `content` 数据层，把流程骨架收口为共享状态机、共享 runtime contract 或共享组件。

### Changed
- 将“优先参考太阁系与其他经典历史模拟设计，不从零编造核心玩法概念”正式收口为仓库内开发规则，不再只作为口头协作偏好。
- 明确周期评定、贡献排名、方针宣布、工作分派、地图时间快进、通用小游戏外壳这类需求，默认都应先检查现有机制并考虑抽象复用。

### Impact
- 后续代理在处理评定、剧情推进、周期执行和类似系统时，会优先寻找共享骨架和 genre 参考，减少“临时补一段能跑的流程”这类扩展性差的实现。
- 玩法设计讨论会更稳定地对齐太阁类和经典历史模拟的成熟节奏，避免仓内继续积累概念漂移和重复机制。

## 2026-05-30 Temple Review Flow And Shared Map Auto-Advance

### Added
- 为 shared `HouseModuleSideEffect` 增加 `start-map-auto-advance` / `stop-map-auto-advance`，并在 [docs/special-house-interface.md](/D:/RPG_TG/docs/special-house-interface.md) 记录其用途：当 house 需要把流程交回地图层做通用时间推进时，必须走共享 side-effect，而不是把快进逻辑硬写进 `main.ts` 的 house 特判。
- 为皇觉寺工作结算补入“达到阈值后自动休整至下次评定”的共享 map 快进接线，后续其他地点若也需要“快进到评定/议事/约定日”，可以复用同一路径。

### Changed
- 皇觉寺评定改为更接近正式评定骨架的流程：`开场 -> 贡献展示 -> 嘉奖 -> 方针 -> 选工`，不再把第二次评定写成临时剧情插片。
- 朱元璋寺庙主线不再在剃度 scene 尾部强行续接 `first_temple_review` scene，而是回到 temple house 后继续走正式评定流程。
- 第一次寺庙评定在提交本轮工作方向时即写入 `firstTempleReviewCompleted` 与 `templeWorkUnlocked`，第二次评定则通过共享倒计时和自动回寺触发，自然开放 `外出化缘` 选项。
- 第一次评定后的新手寺内工作期新增 `firstTempleWorkLockCompleted` 进度标记：只在这一个教程周期内拒绝离开寺庙，后续再次选择寺内帮忙不会复用禁离规则；评定席期间也不再展示右下角离开按钮。

### Impact
- 寺庙前两次评定现在不再依赖“scene 插片 + house 临时续接”的混合实现，主线推进更接近固定节奏的阵营评定系统。
- 时间快进首次从单个 house 内部需求提升为共享 world/map 能力，后续更容易扩到帅府、其他阵营据点和类似“等待截止日”的玩法场景。

## 2026-06-04 Temple Grain Submission And Shared Grain Inventory

### Added
- 为 shared house overlay 契约补入“数量确认浮层”约束，用于“从背包里选择提交数量”这类结构化交互。
- 皇觉寺第二周外出化缘新增正式交粮浮层：点击住持后可输入本轮实际上交的粮食数量，再按该数量评级与结算贡献。

### Changed
- 粮食持久存储从粮铺私有 `var.grain_shop.food` 收口到共享背包库存路径，粮铺买粮与城中化缘小游戏都会把粮食写入同一份玩家库存；旧的粮铺粮食变量会在读取或变动时迁入共享库存。
- 粮食数量的底层基准单位统一改为“斗”，并补入共享换算规则 `1 石 = 10 斗`；粮铺继续按“石”交易和报价，寺庙按“斗”提交，但两边都经过同一套换算与格式化函数。
- 皇觉寺化缘线路不再依赖“小游戏未领取粮食”这种来源专属状态；只要背包里有粮，就可以回寺向住持提交，提交后才进入“静候下次评定”。
- [docs/special-house-interface.md](/E:/RPG_TG/docs/special-house-interface.md) 补充了“同一资源不得分裂成多套 house 私有库存”和“数量确认浮层”的共享规则。

### Impact
- 后续如果其他 house 也要消耗、上交或拆分同一类商品，可以直接复用共享库存与数量确认浮层，而不必再做来源特判或会话态临时结算。
- 寺庙第二周“化缘 / 买粮 / 回寺交粮 / 等待评定”的闭环现在按同一份背包数据运行，任务推进不再受粮食来源限制。

## 2026-06-04 Activity Stamina Cost

### Added
- 新增共享玩家体力结算 helper，统一处理小游戏和工作完成后的体力扣减。

### Changed
- 所有内置小游戏完成一次后都会扣除 15 点体力，结算不区分成功、失败或评级高低。
- 酒馆提交工作、寺庙寺务 QTE 结算、寺庙化缘交粮等工作完成点也统一扣除 15 点体力。
- 粮行算账、药铺配药、茶馆舌战、寺庙工作、酒馆工作等结果面板补入 `体力 -15` 提示。

### Impact
- 体力消耗从单点规则改为共享机制，后续新增小游戏或工作流时只需接入统一结算 helper，不必各自复制扣体力逻辑。

## 2026-06-04 Temple House Rest Flow

### Added
- 皇觉寺 `temple-house` 新增与自宅同结构的休息菜单：`休息一天 / 休息指定天数 / 休息到评定日期 / 休息到恢复体力`。
- 寺庙会话态补入 `rest-days` 输入浮层与 `rest` 日常面板，用于寺内静修的 typed overlay 与菜单切换。

### Changed
- 寺庙模块现在可在屋内直接推进日期、递减评定倒计时并恢复玩家 `stamina`，仍然完全走 `temple-house` 生命周期与结构化 overlay，不向 `src/main.ts` 添加寺庙休息分支。
- 若在寺中休息时正好推进到评定日，寺庙会从日常模式自然切回自身评定流程，而不是停留在一个与评定日期脱节的日常会话态。

### Impact
- 皇觉寺获得了与自宅接近的“歇脚 -> 恢复体力 -> 等待评定”节奏，但没有把自宅私有 `var.home.*` 恢复数据直接硬绑到寺庙模块。
- 2026-06-04：体力不足时，禁止开始会消耗体力的内置小游戏与工作流程，并在城市场景、粮行算账、药铺配药、茶馆舌战、酒馆接活/交活、寺庙寺务/化缘交粮入口统一改为 NPC 劝玩家先休息后再来。
## 2026-07-06 Phase 3 Authoring Entrypoints

### Added
- Added `tools/scaffold-scenario-pack.mjs` and `tools/validate-scenario-packs.mjs` plus package-script entrypoints so scenario-pack authoring has a repository-owned scaffold and validation path.
- Added a fail-closed default-pack authoring contract: `validate-scenario-packs` now rejects `src/content/pack-content-access.ts` when its scenario-pack imports drift away from the catalog's default scenario-pack entry.
- Added `src/core/registry/builtin-house-module-contributions.ts` so builtin house module and renderer wiring now enter the shared registry seam through one contribution list.

### Changed
- The builtin house registry installer no longer merges two separate static arrays for module and renderer registration.
- `docs/special-house-interface.md` now explicitly requires builtin house seed wiring to live in one shared contribution list instead of split module/render tables.
- Blueprint closeout truth for Phase 3 authoring now records `queue.authoring-entrypoint-and-fail-closed-closure` as closed, returns the target to `promotion-review` with no active queue, and explicitly rejects promotion of `queue.framework-scaffold-and-template-closure` on current evidence.

### Impact
- Scenario-pack/default-pack authoring no longer depends on undocumented manual catalog and adapter glue alone; authors now have a scaffold path and a fail-closed validator.
- Builtin house authoring has a clearer next seam: new registry wiring can be expressed through one contribution record instead of two disconnected edits.
- Current Phase 3 residue is limited to accepted compatibility residue and later target-level review, so further queue promotion now requires fresh evidence instead of silently continuing the same authoring queue.

## 2026-07-07 Phase 4 Residue Promotion

### Added
- Added [docs/blueprints/queues/historical-residue-disposition-queue.md](/C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/blueprints/queues/historical-residue-disposition-queue.md) as the first active Phase 4 queue under the current complete-modularization target.

### Changed
- `docs/blueprints/project-progress.md`, `docs/blueprints/blueprint.md`, the current target plan, and the current target spec now advance from `promotion-review` back into `active-execution` on `queue.historical-residue-disposition`.
- Current target truth now treats the remaining Phase 4 work as synchronized residue routing rather than another newly-proven implementation blocker by default.

### Impact
- The repository now has one explicit controller for accepted-history, accepted-framework-baseline, and accepted-compatibility residue instead of leaving those items spread across old queue closeout notes.
- Later Phase 4 handoff decisions such as `queue.first-party-mod-acceptance` or `queue.final-acceptance-closeout` must now pass through the active residue queue instead of being promoted directly from implicit closeout caveats.

## 2026-07-14 Script Editor Person Attribute Page Stability

### Changed
- The script editor person-attribute grid now keeps the current page stable after deleting one attribute card instead of immediately backfilling the gap with the next-page card, reducing the false impression that multiple attributes were deleted together.
- The person attribute block title now uses the creator-facing label `自定义属性` instead of the raw-implementation-oriented `当前人物 JSON 属性`.
- The person authoring surface no longer renders the redundant `人物作者面 / 人物详情 / 人物工作台 / 亲兵` explanatory label stack around the embedded workbench shell; instead, the tab controls are mounted directly into the compact inspector header band.
- The people profile form no longer renders the `高级设置与系统信息` foldout, so the first-screen authoring area now transitions directly from the biography field into the custom-attribute block without a dead disclosure row.

### Impact
- Attribute deletion inside the workbench now behaves closer to human expectation: removing one card only removes that card from the visible page, while later-page content stays on its own page until the creator explicitly navigates.
- The top-of-sheet wording is now consistent with the current authoring model, which exposes editable custom attributes rather than a raw JSON inspection panel.
- The person editor header is visually simpler and closer to the approved wireframe rhythm because the creator now sees one active control band instead of duplicated labels plus a separate tab row.
- The people editor's primary form reads more like a continuous authoring sheet and wastes less vertical space, which better matches the current creator-first workbench layout.
