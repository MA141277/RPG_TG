# Scenario-Pack Source Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `zhuyuanzhang` toward a two-pack model: one builtin scenario pack and one script-editor template scenario pack, keep those two packs synchronized, and keep only one generated public publication package, while preserving the current UI, feature behavior, startup order, and pre-merge scenario content/order.

**Architecture:** Converge the repository onto two maintained zhuyuanzhang pack trees only: `src/content/scenario-packs/zhuyuanzhang/**` as the builtin runtime pack and `src/modules/script-editor/builtin-templates/zhuyuanzhang/**` as the script-editor template pack. `public/builtin-script-editor-templates/zhuyuanzhang/**` is the only generated publication target in the current target state; `public/script-editor-templates/zhuyuanzhang/**` and its legacy manifest URL are retired. Shared fields between the builtin pack and the template pack must have an explicit synchronization mechanism in both directions, so changes originating from either maintained pack can be propagated to the other through one centralized repository-owned tooling seam.

**Tech Stack:** TypeScript startup/editor shell, JSON scenario-pack content, Node sync tooling under `tools/`, script-editor runtime preview tests, `pnpm run build:test`, targeted `node --test`, `pnpm run typecheck`, `pnpm run build`, `pnpm run lint:plans`.

## Execution State

- Status: `closed`
- Last Updated: `2026-08-08`
- Current Focus: `none`
- Next Step: `Open the next approved runtime/event child from docs/superpowers/project-progress.md.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/temple-meeting-content-contract.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/navigation-time-follow-up.test.cjs; PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "startup bootstrap owner is extracted from main.ts into a dedicated startup module|startup resolved session owner is extracted from the coordinator into a dedicated startup module|startup loading launcher owner is extracted from main.ts into a dedicated startup module|main.ts map intro shell no longer owns the zhuyuanzhang chapter intro text id|main.ts city begging refusal shell no longer owns zhuyuanzhang shortage or stamina dialogue seeds|main.ts council dialogue shell no longer owns temple or keep default copy branches|startup app-state factory no longer owns the sundeya battle review mission text id inline" tests/robustness.test.cjs`
- Notes: `This child is closed as a documented pushed baseline. Startup remains frozen after the 2026-08-05 audit, and review-system work remains intentionally paused rather than being reopened by source-unification closeout.`

## Progress Log

- 2026-08-08
  - Summary: `Canonical governance sync and child closeout are now complete. docs/superpowers/project-progress.md no longer treats source-unification as the active current child; instead it records this line as the latest closed child and leaves the branch waiting for the next approved runtime/event child. Startup stays frozen after the 2026-08-05 audit, and review-system work remains paused by current owner choice.`
  - Verification: `Governance/documentation-only sync; reused the already recorded source-unification and startup verification history, then reran pnpm run lint:plans and git diff --check during closeout sync.`
  - Next: `Open the next approved runtime/event child from docs/superpowers/project-progress.md rather than reopening source-unification or review-system work by default.`

- 2026-08-05
  - Summary: `补齐了 source-unification 的最终 closeout：Task 4 已明确记账为“保留 public/builtin-script-editor-templates/zhuyuanzhang/** 作为唯一生成 publication root，并确认旧 legacy public root / legacy manifest URL 已按 deletion gate 退场”；Task 5 也补跑了 lint:plans、build:test、source-unification 定向测试、三条 sync --check、typecheck、build，以及一组 startup/preview owner 回归。随后 branch-local owner 文档、执行队列、checkpoint commit 与远端 push 也都已完成，当前只剩是否恢复 D 线或是否切 canonical progress 的治理决定。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/temple-meeting-content-contract.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/startup-session-coordinator.test.cjs tests/scenario-preview-sanitizer.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/navigation-time-follow-up.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "startup bootstrap owner is extracted from main.ts into a dedicated startup module|startup resolved session owner is extracted from the coordinator into a dedicated startup module|startup loading launcher owner is extracted from main.ts into a dedicated startup module|main.ts map intro shell no longer owns the zhuyuanzhang chapter intro text id|main.ts city begging refusal shell no longer owns zhuyuanzhang shortage or stamina dialogue seeds|main.ts council dialogue shell no longer owns temple or keep default copy branches|startup app-state factory no longer owns the sundeya battle review mission text id inline" tests/robustness.test.cjs`
  - Next: `Keep this child completed-but-open, then decide whether to reopen temple review work or to sync canonical project-progress to the current branch-local owner state.`
- 2026-08-05
  - Summary: `继续按“同类型问题一次性处理”推进，把最后剩下的 maps.json 也从 deferred family 推进到 shared projection sync。sync contract 现已新增 runtime-canonical 2 条 map ids、3 条 runtime-only campaign 扩展字段，以及 3 条 template-preserved asset surface 字段；sync tool 则新增 runtime-first 的 template/public map projection，会把 runtime 的 canonical node/stats 内容折到 builtin template / public maps，同时保留 template/public 自包含 asset surface。结果是 template/public 的 map.yuanmo_campaign 不再保留 950 条 editor fort/resource/settlement surface，而只承接 runtime 的 96 条 canonical node 集与 0 fort / 0 resource 统计。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=builtin-runtime-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `maps.json 已不再是待判断项；当前 source-unification 代码面已无剩余 deferred family，下一步只剩文档/治理 closeout。`
- 2026-08-05
  - Summary: `继续按“同类型问题一次性处理”推进，把 events.json 也从 deferred family 推进到 shared projection sync。sync contract 现已新增 runtime-canonical 11 条 shared event ids、38 条仍被 template event-bindings / runtime menu-resources 消费的 template-only active event ids，以及 5 条 story event 的 template-format gap ids；sync tool 则新增 runtime-first 的 template event projection，会把 runtime-canonical 事件按 template authored shape 回写到 builtin template，同时完整保留 template-only event surface。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `同日后续切片已继续把 maps.json 也转入 shared projection sync；当前这条记录仅保留为 events 收口完成的历史节点。`
- 2026-08-05
  - Summary: `继续按“同类型问题一次性处理”推进，把 cities.json 也从 deferred family 推进到 shared projection sync。sync contract 现已新增 city-projection：shared fields 不再包含 name，template-only editor fields 保留在模板包，houseIds 则通过 generic-template <-> runtime-concrete 映射双向投影。sync tool 同步补上了 projectTemplateCitiesForSync(...) / projectRuntimeCitiesForSync(...)，并已证明当前真实 runtime/template cities.json 两侧都能被 projection 原样重建。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `同日后续切片已继续把 events.json 也转入 shared projection sync；当前这条记录仅保留为 cities 收口完成的历史节点。`
- 2026-08-05
  - Summary: `继续沿 houses.json 自己推进，并把最后缺的 template -> runtime 一刀补完。sync contract 现在已把 houses.json 正式从 deferred family 移入 SHARED_SYNC_FILE_RULES；sync tool 也补上了 projectRuntimeHousesForSync(...)，会以现有 runtime concrete houses 为宿主，把 template generic houses 的 shared fields 展开覆盖回去，同时保留 runtime-only 的 onEnterEventId 与 pack-specific 字段。配合既有的 projectTemplateHousesForSync(...)，houses.json 当前已具备独立的双向 asymmetric projection。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `同日后续切片已继续把 cities.json 也转入 shared projection sync；当前这条记录仅保留为 houses 收口完成的历史节点。`
- 2026-08-05
  - Summary: `继续沿 houses.json 自己推进，但不把它并入 cities.json，也不强行升级成 shared sync。sync tool 现已新增 projectTemplateHousesForSync(...)：它会按 house id 映射把 runtime concrete houses 折回 template houses，只覆盖 shared fields，保留 template-only 的 menuInstanceIds 与 pack-specific 字段。对应回归也已证明当前真实 template houses.json 可以被这条 helper 原样重建。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "template house projection can collapse runtime concrete houses|current template houses already match runtime-to-template house projection" tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`
  - Next: `同日后续切片已补齐 template -> runtime 展开合同；当前这条记录仅保留为 runtime -> template helper 落地的历史节点。`
- 2026-08-05
  - Summary: `按“houses.json 与 cities.json 保持独立”的约束继续推进。source contract 现在已经补上 houses.json 的独立边界常量：generic template house ids、template concrete scenario house（house.kulan.temple）、runtime home id 规则（home.*/home_001）以及 city-scoped house suffix 集。这样 houses.json 当前已不再只是口头判断，而是一个独立的 generic-template mapping family。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "houses.json as an independent generic-template mapping family" tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `同日后续切片已先后补上 runtime -> template 与 template -> runtime helper；当前这条记录仅保留为边界冻结完成的历史节点。`
- 2026-08-05
  - Summary: `对剩余 deferred family 做了下一层可行性审计。结果确认 houses.json 不能按单文件小 drift 处理：模板包只持有少量 generic template houses + home.template，而 runtime 包是按城市展开的 concrete houses + home.<city>/home_001。这个问题首先是 houses.json 自己的 generic-template -> runtime-concrete 映射合同问题，应独立收口，而不是默认和 cities.json 绑成同一刀。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" rg -n 'house\\.template\\.|home\\.template|house\\.kulan\\.|home_001|home\\.yingtian|leader_residence' src/content/scenario-packs/zhuyuanzhang src/modules/script-editor/builtin-templates/zhuyuanzhang tests`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node -e "/* local audit comparing runtime/template houses.json */"`
  - Next: `如果继续推进，先把 houses.json 的 generic-template -> runtime-concrete 映射合同下沉到工具和测试，再决定 cities.json 是否需要单独 owner/mapping 合同。`
- 2026-08-05
  - Summary: `继续把“边界已冻结”的两类 deferred family 推到可执行 projection。sync contract 现已把 pack.json 与 city-entries.json 正式从 deferred 移入 shared sync rules；sync tool 也新增了 template/runtime 双向 projection helper。pack manifest 当前会按 shared/runtime-only/template-only file-key 边界投影；city-entries 当前会按 template-only kulan entries 与 leader-residence targetHouseId 映射投影。对应 check 已证明当前 runtime/template/public 文件全部处于已对齐状态。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "first shared sync whitelist|pack manifest projections enforce|city-entry projections preserve" tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`
  - Next: `如果继续推进，直接收剩余 deferred family：cities.json、events.json、houses.json、maps.json。`
- 2026-08-05
  - Summary: `继续沿 deferred family 收口，不直接硬做双向同步，而是先把 pack.json 与 city-entries.json 的真实 owner/mapping 边界下沉到工具合同。source contract 现在已经明确冻结了 pack manifest 的 shared/runtime-only/template-only file-key 边界，以及 city-entries 的 template-only kulan building entries 和 leader-residence targetHouseId generic-template -> runtime-city-specific 映射边界。这样这两类文件已从“完全 deferred”推进到“边界清晰、待实现 projection”。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "pack manifest ownership boundaries|city-entry mapping boundaries" tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `同日后续切片已把这两组边界继续落成可执行 projection；当前这条记录仅保留为“边界冻结完成”的历史节点。`
- 2026-08-05
  - Summary: `把 C4 的“部分完成”进一步收成了明确合同。zhuyuanzhang-source-sync-contract 现在已经把第一版共享同步白名单冻结成 4 类：scenario-profile.json = replace-whole-file，characters.json = startup-character-projection，text-entries.json = shared-key-overlay，activities.json = shared-id-overlay；同时也把 pack.json、cities.json、city-entries.json、events.json、houses.json、maps.json 这 6 类文件明确列为 deferred sync family，要求先完成 owner / 映射规则再继续。这样后续 C4/C6/C7 不再需要重复辨认“哪些能同步、哪些不能同步”。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`
  - Next: `如果继续推进，直接按 deferred family 成组处理 owner / 映射规则，优先考虑 pack.json、cities.json、city-entries.json、events.json、houses.json、maps.json 的最终双源边界。`
- 2026-08-05
  - Summary: `继续把 publication retirement 从“只删旧 physical root”推进到“连同 legacy manifest URL 一起退役”。registered-scenario-pack-publications 已移除对 /script-editor-templates/zhuyuanzhang/pack.json 的 registered seam；script-editor-template-url / runtime-preview / source-unification / temple-meeting 这批回归也都已切到只认 /builtin-script-editor-templates/zhuyuanzhang/pack.json 与 public/builtin-script-editor-templates/zhuyuanzhang/**。结果是仓库里当前只剩一个真实 public self-contained package，旧 public 根和旧 URL 都不再承担入口职责。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/temple-meeting-content-contract.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `如果继续推进，不应再把 legacy public root 或 legacy URL 当成工作对象；下一步直接收共享白名单、共享字段覆盖规则与最终双源 owner 文档。`
- 2026-08-05
  - Summary: `继续把 publication-layer replacement 从“只有 registered seam”推进到“真正可替代旧目录导入包”的完整发布包。sync contract 现在正式承认唯一的 published root：public/builtin-script-editor-templates/zhuyuanzhang，并把旧 /script-editor-templates/zhuyuanzhang/pack.json 冻结为 registered-builtin-template-url-alias-only。sync tool 也不再只写少数 projection 文件，而会按 public pack.json 补齐整套 manifest 文件族；如果旧 legacy physical root 仍存在，--write 会直接删除。结果是新的 builtin public 根现在已经能作为完整自包含 folder-import 包使用；旧根则从仓库里完全退场，只剩 legacy URL alias。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/temple-meeting-content-contract.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `同日后续切片已把 legacy /script-editor-templates/zhuyuanzhang/pack.json URL alias 也一并退役；当前这条记录仅保留为“新自包含发布包已落地”的历史节点。`
- 2026-08-05
  - Summary: `继续把 publication-layer replacement 从 manifest owner 推进到 asset outlet owner。registered-scenario-pack-publications 现在会把 builtin template maps 里的图片层资产解析到 /builtin-script-editor-templates/zhuyuanzhang/assets/maps/**，不再借旧 /script-editor-templates/zhuyuanzhang/assets/maps/**。source contract 也已冻结当前 10 个 registered builtin map assets，sync tool 则补上自动同步与 --check 校验，因此 registered builtin publication 当前已经拥有独立的浏览器可加载地图资产出口。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `如果继续推进，不应再围绕 registered builtin outlet 本身切片；下一步应直接审计 legacy public 目录还能缩到什么程度，以及“自包含 folder-import 包”这层兼容是否还能被替代。`
- 2026-08-05
  - Summary: `继续把 legacy compatibility retirement 审计推进到真正的剩余 blocker。审计确认 public/script-editor-templates/zhuyuanzhang/** 当前还不能直接缩成外链 manifest/asset 壳，因为 Script Editor 的 folder-import 仍会把这棵目录作为完整包读取；如果 maps.json 改成外部绝对 URL，目录导入就会从“自包含包”退化成依赖外链资产的半状态。因此这批没有直接删旧 public 目录，而是把这条自包含兼容边界正式写进 retirement gate 和回归。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`
  - Next: `如果继续推进，应直接设计“导入自包含包”的替代机制，而不是再尝试对 legacy public maps.json 做局部外链化。`
- 2026-08-05
  - Summary: `继续把 publication-layer replacement 从“默认 URL 已换”推进到“legacy public manifest URL 也已换 owner”。registered-scenario-pack-publications 现在同时接管 /builtin-script-editor-templates/zhuyuanzhang/pack.json 与 /script-editor-templates/zhuyuanzhang/pack.json；scenario-pack-loader 会优先命中这条 registered seam，因此当前默认模板 URL 和 legacy public manifest URL 导入都不再 fetch public pack.json。相应回归也已切成 fetch-forbidden 形态，证明当前 public 的剩余职责已不再是 manifest owner，而收缩到地图等静态资产发布与目录级兼容。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `如果继续推进，不应再把注意力放在 manifest owner；下一步应直接审计 map asset/publication outlet，判断 public 是否还能继续缩到只剩目录级兼容，或彻底被替代。`
- 2026-08-05
  - Summary: `继续按同类型残留批处理了 builtin template 侧的 house-content 旧镜像。审计发现 src/modules/script-editor/builtin-templates/zhuyuanzhang/house-content/home-house-content.json 与 keep-house-content.json 和先前删掉的 public 对应文件一样，不在 builtin template manifest 中，地图和其他 authoring/publication 入口也都不引用，仓库里没有任何 Script Editor / preview / sync-tool 消费方。因此这批直接删除这两份 builtin-template-only 历史文件，并补回归锁定它们不再复活。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `如果继续推进，同类 residual 清理应优先继续查找 maintained/public packs 中其余“未进 manifest、无消费方”的历史文件；否则就转入 publication-layer replacement 设计。`
- 2026-08-05
  - Summary: `继续沿 C5 清掉真正无 owner 的 public 旧镜像。审计发现 public/script-editor-templates/zhuyuanzhang/house-content/home-house-content.json 与 keep-house-content.json 既不在 public pack manifest 中，也没有任何 runtime / Script Editor / publication loader 消费方；真实 owner 仍在 maintained packs 侧的 house-content 与 pack-content access seam。因此这批直接删除这两份 public-only 历史文件，并补回归锁定它们不再复活。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `如果继续推进，优先继续找同类“未进 manifest、无消费方、无 maintained owner”的 public 历史残留；否则就转入更高层的 publication-layer replacement 设计。`
- 2026-08-05
  - Summary: `完成了一轮 public publication retirement audit。审计确认默认模板导入 owner 已迁走，main-ui-script-editor-module.js 里的 URL 常量死引用也已清掉；但现有仓库仍保留 loadScriptEditorProjectFromScenarioPackUrl(...) 这条浏览器 URL 导入合同，相关回归继续以 /script-editor-templates/zhuyuanzhang/pack.json 作为 manifest 入口。因此 public/script-editor-templates/zhuyuanzhang/** 现在仍是有职责的 browser-loadable publication layer，而不是可直接删除的空目录。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" rg -n "loadScriptEditorProjectFromScenarioPackUrl\\(|script-editor-templates/zhuyuanzhang/pack.json|DEFAULT_TEMPLATE_PUBLIC_PACK_URL|PUBLIC_RETIREMENT_GATE" src tests docs tools public`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`
  - Next: `如果继续推进，不应直接删 public；应先补 public 之外的 browser-loadable template publication seam，再修改 config/source contract/URL-import 回归。`
- 2026-08-05
  - Summary: `继续把 publication-layer 审计推进到生产代码引用面。审计确认 Script Editor 的默认模板导入 owner 早已从 public URL 迁走，但 main-ui-script-editor-module.js 里还残留一条未使用的 DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL bridge 解构。这一批补了结构回归并清掉该死引用后，当前生产代码里只剩 config.ts 继续保留 public URL 字面量，用于维持浏览器可加载的发布层入口与兼容测试。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-template-url.test.cjs`
  - Next: `如果继续推进，关注点应转向 public 发布层本身是否还能进一步退场，而不是再围绕生产代码的 URL 常量残留做零散清理。`
- 2026-08-05
  - Summary: `继续把最后两条 builtin-only failure_reward settlement 事件也收掉。此前 grain-accounting / medicine-compounding 的 settlementRoutes 已经在 public playable-integrations 里保留 targetEventId，但 public events.json 仍把对应的 settlement-only runtime event 过滤掉，形成了引用存在而 authored event 本体缺失的历史特判。实际验证表明，这两条事件并不会破坏默认模板导入、再次导出或 runtime preview 闭环，因此这批直接清空了 BUILTIN_ONLY_EVENT_IDS / PUBLICATION_OMITTED_EVENT_IDS。结果是 public events.json 现已与 builtin template authored events 全量对齐，source-unification 的显式 publication omitted / builtin-only event 边界也随之清空。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`
  - Next: `如果继续推进，source-unification 不应再围绕单条 authored file residual boundary 切片；下一步只再看 public 发布层是否还需要继续长期存在。`
- 2026-08-05
  - Summary: `继续把 public menu-resources 的最后两条 omitted boundary 收掉。此前 city.default 下的 grain-accounting / medicine-compounding menu entries 之所以被 public 过滤，本质上是因为 public 默认模板还缺对应 playable-integrations，导入后无法形成稳定的 minigame round-trip。随着 temple-copy-scripture 与整份 playable-integrations family 已完成 importer/exporter 合同升级，这两个 city menu entries 也不再需要继续作为 public 特判存在。source contract 的 PUBLICATION_OMITTED_MENU_RESOURCE_ENTRY_IDS 现已清空，public menu-resources.json 改为与 builtin template 全量对齐，默认模板导入后也会保留这两条 city minigame 菜单入口。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`
  - Next: `如果继续推进，source-unification 不应再把 menu-resources 当作残留边界；后续只再看 settlement failure reward 事件与 public 发布层退场策略。`
- 2026-08-05
  - Summary: `继续把 playable-integrations 这条 residual boundary 真正收口。此前 public playable-integrations.json 虽已作为 editor-safe projection 发布，但 temple-copy-scripture 仍因 Script Editor export 只认 shell-backed playable，而被迫停留在 public omitted 边界。这一批直接升级 importer/exporter 合同：builtin playable definition / shell registry 现在把 temple-copy-scripture 视为可 round-trip 的 minigame playable，sync contract 也不再保留 PUBLICATION_OMITTED_PLAYABLE_INTEGRATION_IDS。结果是 public playable-integrations.json 现已与 builtin template 全量对齐，默认模板导入、再次导出与 runtime preview 闭环都能保留 temple-copy-scripture，不再需要为它维持单条 publication omitted 例外。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `如果继续推进，不应再把 temple-copy-scripture 视作 public playable family 的阻塞项；后续只再看 menu-resources 是否还存在 public omitted 边界，以及更高层的 publication-layer 保留策略。`
- 2026-08-05
  - Summary: `继续沿 public playable family 的 publication policy 再收了一刀。此前 public manifest 相对 builtin template 还残留最后一个 builtin-template-only key: playableIntegrations；但真实验证表明问题并不是“整份 integration family 都不能发布”，而是其中的 temple-copy-scripture integration 会在默认模板导入时被映成当前不可导出的 minigame binding，破坏 round-trip。因此这一批把 public playable-integrations.json 改成 editor-safe projection：它现在从 builtin template 派生整份 integration family，但显式过滤 \`playable.temple-copy-scripture.instance.template.temple-copy-scripture\`。这样 grain-accounting、medicine-compounding、activity-qte 两条寺庙差事这组 integration 现在都可以进入 public 默认模板，而不再需要把整份 family 继续保留在 builtin template。对应 contract 也从“builtin-template-only manifest key”改成“public omitted integration id”边界。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `如果继续推进，不应再把 attention 放在 grain/medicine/activity-qte 这类已安全发布的 integration 上；应聚焦 temple-copy-scripture omitted boundary，以及 public 发布层是否还能继续退场。`
- 2026-08-05
  - Summary: `继续把 source-unification 从“public 文件投影”推进到“默认模板 loader owner”。Script Editor workflow controller 的 importTemplateProject 现在不再通过 public template URL 拉取 pack.json，而是改为走一个新的 builtin template asset loader：该 loader 直接从 script-editor builtin template pack 的 pack.json、manifest family JSON 以及地图 PNG 资源构造一组 File，再复用现有 runtime-pack import 入口生成默认项目。这样默认模板导入的真实 owner 已从 public/script-editor-templates 脱离，但 public URL 仍保留给发布层与兼容测试。同步回归也显式锁住了这条新边界：workflow controller 不再调用 loadScriptEditorProjectFromScenarioPackUrl(DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL)，但 public template URL 仍然存在且可被 URL 导入链消费。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续只在 publication-layer policy 上推进：评估 public 是否还需要继续承载默认模板 URL 以外的职责，并判断 playableIntegrations 是否值得做 editor-safe projection。`
- 2026-08-05
  - Summary: `继续沿 pack manifest / publication family 收口了一组更高层差异。public 先前仍缺少 template-owned 的 playables.json 与 settlements.json，manifest 上也还把这两类 family 视作 builtin-template-only；这次把两者都改成由 builtin template 派生发布到 public，默认模板 URL 导入链因此能直接看到 canonical 的 playable definitions 与 settlements。与此同时，针对 playable-integrations.json 做了同类审计和真实 round-trip 验证：一旦把整份 integration family 直接发布到 public，当前 script-editor 默认模板导入会把 temple-copy-scripture 等记录映成不可导出的 minigame binding，进而破坏 export/runtime-preview 现有回归。因此本批最终将 playableIntegrations 明确保留为 builtin-template-only manifest key，并把它记成当前 publication 安全边界，而不是继续把 public manifest 强行做成三项全量对齐。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `如果继续推进，不应再直接把 playable-integrations 整份暴露到 public；应改为评估 editor-safe integration projection，或者直接推进默认模板 loader 脱离 public 发布层。`
- 2026-08-05
  - Summary: `继续按“同类型问题一次性处理”完成了 public publication support-data 的整组收口。builtin template 相对 public 仍存在两类 owner 漂移：其一是 public 缺少 temple-house 的整份 house-module-defaults；其二是 builtin template 的 template/home 菜单资源仍有大量空 entries，而 public 持有真实默认菜单配置。现在这两类 support-data 都已改为由 builtin template 统一持有：builtin template 的 menu-resources.json 已并入 public 现有 template/home 菜单定义，同时保留 city.default 下 2 个 builtin-only minigame 入口；public 的 menu-resources.json 与 house-module-defaults.json 则改为由 sync tool 从 builtin template 派生生成，其中 public menu-resources 只显式过滤这 2 个当前不支持的 city minigame 入口。这样 public 在 support-data 这一类文件上也不再保留第三套手维护树。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `public publication 在 authored/support-data 文件层的批量清理已基本结束；下一步只再看 pack manifest、默认模板 loader 与 public 发布层是否继续长期存在。`
- 2026-08-05
  - Summary: `按“同类型问题一次性处理”完成了 public authored event surface 的整组回收。此前 public 相对 builtin template 仍多出 26 条 template action / home / temple.work 事件和 531 条 event-bindings；现在这些记录已整组回收到 builtin template，public 的 events.json / dialogues.json / event-bindings.json 都改为从 builtin template 派生。对应 source contract 不再保留 publication-only event/dialogue 列表，只留下 builtin-only failure_reward settlement 事件作为明确例外；sync tool 同时新增 runtime event-binding 过滤，让 builtin runtime pack 不再镜像那些落不到 runtime event 集合的 bindings。这样 public 默认模板在 authored event/binding 这一类文件上，不再保留第三套手维护树。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `继续处理剩余更高层的 publication/loader 选择题，而不是再回到单条 event 或单条 binding 的 authored drift。`
- 2026-08-05
  - Summary: `继续沿 public publication 收口了第二组低风险 enter authored 记录：`event.building.house.kulan.keep.enter`、`tea_house.enter`、`market.enter`、`grain_shop.enter`、`medicine_house.enter`、`inn.enter` 及其 6 条对应 dialogues，现已从 public-only residual surface 提升为 builtin template canonical records。source contract 把这 12 个 id 从 publication-only 移到 publication-canonical；sync 工具继续只投影 canonical 子集到 public，因此 public 默认模板里的这 6 条 building-enter 不再作为第三棵手维护树存在。由于 runtime building-support 文件本来就沿模板包镜像，执行 `--source=script-editor-template-pack --write` 时也同步刷新了 builtin runtime pack 的 dialogues mirror，但没有扩大 runtime 事件 mirror 范围。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `这组 enter records 后续已并入同日的整组 authored event/binding 回收，不再单独作为后续切片。`
- 2026-08-04
  - Summary: `把 source-unification 的收尾继续推进到 public publication 这一层的 meeting/review authored 内容。之前 runtime pack 与 builtin template 的 temple / leader residence review 已经收到了 dialogue-backed canonical event，但 public 默认模板里仍保留旧 launchFlow 事件，且缺失对应 dialogues，导致 public 继续像第三棵手维护树。现在 source contract 明确把这两条 review events 与 dialogues 记为 publication projection 合同；sync 工具会仅对这组 canonical review 记录做 public overlay projection，保留其它 public-only 发布层记录不动。这样 public/script-editor-templates/zhuyuanzhang 不再自己持有另一套 review authored owner，默认模板导入链也能拿到与 maintained packs 一致的 review dialogues/events。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续只在 runtime/builtin/public/sync-tool 这条线清点剩余 public authored drift，优先看是否还存在其它需要以同样 projection 合同收口的 review publication 记录；不要回到 temple 或 keep 的 house runtime 逻辑。`
- 2026-08-05
  - Summary: `继续沿同一条 public publication 收口了一刀：`event.building.template.house.temple.donate` 与 `scene.building.template.house.temple.donate` 在 runtime/builtin 已经是 canonical dialogue-backed 记录，但 public 还停留在旧的 launchFlow publication 形态。现在 source contract 把这组记录并入 canonical publication 子集，sync 工具会把 public 的 donate event/dialogue 投影回 builtin template canonical 版本，默认模板导入链不再为这一入口保留第三套独立 owner。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `继续把剩余 public-only enter/template 事件与 6 条 enter 对话分清“publication-only 外层兼容”还是“下一批 canonical projection”，同时把 2 条 builtin-only failure_reward settlement 事件明确记为不进入 public 的 builtin-only 边界。`
- 2026-08-05
  - Summary: `把 Batch 2 剩余差异正式冻结成 contract：source contract 现在显式列出了 32 条 public-only event ids、6 条 public-only dialogue ids，以及 2 条 builtin-only failure_reward settlement event ids。这样 keep/market/inn/grain/medicine/tea-house/home/temple.work 这批 public residual surface 不再是隐性第三套 canonical owner，而是明确的 publication-only 外层兼容边界；grain_accounting / medicine_compounding 的 failure_reward 事件也被明确记为 builtin-only settlement records，不进入 public 发布层。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - Next: `继续只在 source-unification 范围内判断：这批 publication-only enter/template records 是否值得再挑下一组转入 canonical projection；若没有明确收益，则保持当前显式边界并转向其它双源收口项。`
- 2026-08-04
  - Summary: `继续沿同一条寺庙前门把 review 也往剧本包 owner 收了一层。前一刀已经让 donate 通过 itemId = donate 绑定事件投影 pack-authored 对话正文，这一刀则把评定开场也并到同一类 seam：temple-house 在进入评定会议时，会优先读取 itemId = review 绑定事件上的 dialogueId，再把对应 authored 对话段落投影进现有 meeting shell；只有当这条 pack 前门没有可用对话时，才回退到当前的 review intro 默认文案。这样 review 开场不再完全由 temple-house 本地持有，同时晚到评定、评定分配、政策、建议、人员与奖励这些后续长链逻辑都保持原样，不改 UI、功能和剧本顺序。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/house-module-pack-event-runtime.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/temple-house-static-defaults.test.cjs`
  - Next: `继续审视寺庙剩余动态 owner，优先考虑 review 后半段还能否继续按同一条前门收口，或者明确哪些部分属于暂时保留在 house module 的长链 owner。`
- 2026-08-04
  - Summary: `把寺庙同构前门再往前收了一层。house runtime 现在会把 dialogueDefinitionsById 沿共享输入链传进 house module；application/house/house-module-pack-event-runtime.ts 也新增了按 houseId + itemId 读取 / 应用 pack event 的集中 helper。基于这两条共享 seam，temple-house 的 leave 不再只认固定 event id，而是优先通过 itemId = "leave" 的 building-container-item 绑定事件关闭建筑；donate 也不再只靠本地硬持有正文，而是优先读取 itemId = "donate" 绑定事件上的 authored dialogue 段落，再投影回现有捐香火确认浮层。这样寺庙的 work / donate / leave 这组三类入口现在共用同一条剧本包前门，owner 继续向 pack / mod 框架收口，但现有 UI、交互和顺序保持不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/temple-house-static-defaults.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house status labels, fortune, and begging submit overlay resolve from text entries" tests/robustness.test.cjs`
  - Next: `继续处理寺庙剩余动态 owner，优先审视 review 或其它长链入口还能否沿同一条 building-container-item / pack event seam 收口，而不引入新的分散兼容层。`
- 2026-08-04
  - Summary: `把 Task 3C 真正收尾到了“当前项目完全移除 flowPlayables 合同”这一步。scenario-pack loader、content-pack loader、script-editor runtime-pack import、active-game-content、content-pack 类型与同步工具都已去掉当前项目自己的 flowPlayables fallback / manifest 键支持；flow-playables.json 文件也已从 public 默认模板发布层删除。现在仓库里剩余的 flowPlayables 只再用于两类地方：一是 loader/import 对外部旧包输入给出显式拒绝报错，二是对应的负向回归测试。这样 Task 3C 的目标已经完成，后续不需要再围绕当前项目自己的 flowPlayables 做兼容维护。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/active-game-content-story-context.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `把后续主线切换到 Task 4 与寺庙内容继续剧本包化；如果再处理小游戏相关问题，也应以 canonical playableShells / playableIntegrations / playables 合同为前提，而不是恢复 flowPlayables。`
- 2026-08-04
  - Summary: `继续把寺庙 pack-owned playable 真正接到当前 runtime。之前虽然 copy-scripture 已经能从 temple-house 的 task allowlist 中解开，apply-startup-session 也还没有把激活 mod 的 playable 注册灌进默认运行时，所以当前 authored temple-copy-scripture 事件就算命中 pack seam，也会因为运行时不认识这个 playable 而立刻掉回 builtin。现在 main-runtime-orchestrator 在应用启动会话时会先配置默认 playable 注册表；同时 playable runtime 新增了集中式的 temple-copy-scripture 兼容落地：当 pack 事件命中这个 authored playable，并且激活 mod 已注册对应 playable/integration 时，runtime 会把它落成当前已有的 activity-qte / fortune-board 会话，从而保持现有寺庙 UI、交互和节奏不变。对应回归一方面锁住“启动会话后默认注册表已切到当前激活 mod”，另一方面锁住“真实 authored copy-scripture 事件在注册就位时保持 pack-owned、注册缺失时仍安全回退 builtin”。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-pack-event-work-bridge.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/indoor-screen-story-runtime.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple work reaching contribution threshold starts shared map auto advance for next review|temple work confirmation shows work sections and quick complete from best score" tests/robustness.test.cjs`
  - Next: `继续挑下一块仍由 temple-house 或主 runtime 自己硬持有的寺庙动态入口 owner，优先考虑 donate / review 或其它不改现有界面的 pack-owned runtime seam。`
- 2026-08-04
  - Summary: `继续沿“寺庙信息进入剧本包 owner”这条线补了一个同步层缺口。之前模板包里新加的 runtime.zhu_yuanzhang.temple.* 文本键，只会留在 script-editor builtin template pack，不会自动补进 builtin runtime pack/public 发布层；这会让已经改成 pack-owned text id 的寺庙状态卡、休息总结等路径在运行时掉成 MISSING_TEXT。现在 source sync contract 新增了集中式的 additive temple text 前缀规则，sync 工具会把这组寺庙共享文本从模板包自动镜像到 runtime/public；同时把寺庙休息总结回归改成真正覆盖“指定天数确认”这条已收口入口，并把状态卡文案回归收回到当前真实玩家金钱初值，避免为了测通去改现有 UI/功能。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house rest summary resolves from text entries|temple house status labels, fortune, and begging submit overlay resolve from text entries|zhuyuanzhang text sync can add approved temple shared keys into the runtime pack mirror" tests/robustness.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`
  - Next: `继续挑选下一块仍由 temple-house 自己硬持有的动态行为 owner，优先考虑不改外观和顺序、但能继续往 pack-owned event/playable/mod 执行收口的寺庙入口。`
- 2026-08-04
  - Summary: `继续沿寺庙动态 owner 收口推进了一刀。原先 temple-house 只有 sweep-courtyard / carry-water 会先尝试 mirrored pack event -> launchPlayable，copy-scripture 仍被本地 allowlist 挡在这条 seam 之外。现在这层 allowlist 已移除：所有 temple-help QTE 差事都会先尝试走统一的 pack-owned work launch seam，再在 pack event 缺失或当前 authored playable 暂时不可执行时回退到旧 builtin 启动链。对应回归一方面锁住“如果 copy-scripture 的 mirrored event 已经能落到受支持 playable，就会走 pack-owned 启动”，另一方面也锁住“按仓库当前真实 authored temple-copy-scripture 状态，仍然安全回退，不改变现有运行表现”。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple work reaching contribution threshold starts shared map auto advance for next review|temple work confirmation shows work sections and quick complete from best score" tests/robustness.test.cjs`
  - Next: `继续选择下一块仍由 temple-house 独占的动态入口 owner，优先看 donate / review / work 顶层入口里哪一块能沿同一条 seam 无感迁移。`

- 2026-08-03
  - Summary: `Created the source-unification follow-up plan for zhuyuanzhang and explicitly folded the public/script-editor-templates deletion question into the governed scope. The plan locks runtime as canonical, builtin/public as derived layers, and forbids deleting public until the default editor template loading contract is migrated or replaced on purpose.`
  - Verification: `Planning-only update; no code changes or runtime verification performed yet.`
  - Next: `Execute Task 1 to formalize the source hierarchy, file ownership, and public-retirement gate before expanding the sync tool.`
- 2026-08-03
  - Summary: `Updated the target architecture to the newly approved two-pack end state: one builtin pack plus one script-editor template pack are the only maintained zhuyuanzhang packs, and whichever maintained pack changes must have a defined synchronization path to update the other.`
  - Verification: `Planning-only update; no code changes or runtime verification performed yet.`
  - Next: `Revise Task 1 and Task 2 execution around the two-pack synchronization contract before implementation starts.`
- 2026-08-03
  - Summary: `Completed Task 1 by adding an executable zhuyuanzhang source contract module, wiring the startup-template sync tool to that contract, and adding regression coverage that freezes the current two-maintained-pack model plus the public default-template publication dependency.`
  - Verification: `node --test tests/script-editor-template-url.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check`
  - Next: `Start Task 2 and expand the current startup-only sync tool into a broader builtin-pack/template-pack shared-field synchronization mechanism.`
- 2026-08-03
  - Summary: `Started Task 2 by adding an explicit sync-source contract for both maintained packs and teaching the existing zhuyuanzhang sync tool to run from either builtin-runtime-pack or script-editor-template-pack while still publishing out to public.`
  - Verification: `node --test tests/zhuyuanzhang-source-unification.test.cjs`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Define the first safe shared-file whitelist and overlay rules so Task 2 can expand beyond startup-only files without overwriting editor-only structures.`
- 2026-08-03
  - Summary: `While Task 2 was in progress, fixed a retained runtime-preview UI regression: the script-editor exit-preview banner had been hidden together with the whole main UI overlay once the game became visible, so main-ui.css now preserves the runtime-preview overlay/badge path and the source test locks that behavior.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `node --test tests/script-editor-entry-availability.test.cjs`
  - Next: `Continue Task 2 shared-file whitelist design; keep the restored runtime-preview exit banner behavior covered as a non-negotiable preview invariant.`
- 2026-08-03
  - Summary: `Completed Task 2 by formalizing the first shared sync whitelist and implementing it in the zhuyuanzhang sync tool: scenario-profile.json still uses whole-file replacement, characters.json keeps the startup projection, text-entries.json now syncs shared keys while preserving pack-only entries, and activities.json now syncs shared activity records while preserving pack-only fields/records. The first deferred set is now explicit as pack/cities/city-entries/events/houses/maps.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `node --test tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Move to Task 3 and reconcile manifest/publication-shape ownership so pack.json and public-vs-builtin playable file drift are no longer hand-maintained.`
- 2026-08-03
  - Summary: `Started Task 3 with a bounded manifest/publication slice: the zhuyuanzhang source contract now records builtin-only manifest keys and publication-only manifest keys, the sync tool can project public/pack.json from the builtin template manifest, and public pack.json has been regenerated through that projection while preserving the existing flowPlayables publication key.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `node --test tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Finish Task 3 by deciding the owner of flow-playables.json and auditing the remaining runtime-vs-template manifest keys that are still intentionally split.`
- 2026-08-03
  - Summary: `Audited mod-first-dev against the current branch and confirmed the remaining minigame-loading gap: mod-first-dev already treats playables/playableIntegrations/playableShells/settlements as the canonical family set, while the current branch still keeps public/script-editor-templates/zhuyuanzhang/flow-playables.json as a legacy publication artifact and still uses internal runtime owner names such as resolvedPack.flows / flowPlayablesById in the main content path.`
  - Verification: `git ls-tree -r --name-only mod-first-dev -- public/script-editor-templates/zhuyuanzhang src/modules/script-editor/builtin-templates/zhuyuanzhang src/content/scenario-packs/zhuyuanzhang | rg "flow-playables|playable-shells|playables|playable-integrations|settlements|flow"`; `git show mod-first-dev:src/modules/script-editor/builtin-templates/zhuyuanzhang/pack.json`; `git show mod-first-dev:src/content/scenario-packs/zhuyuanzhang/pack.json`; `git grep -n "flowPlayables\\|playableShells\\|playableIntegrations\\|playables\\|settlements\\|readFlowPlayablesFamily" mod-first-dev -- src/modules/script-editor src/application src/core src/main.ts`; `rg -n "flowPlayables|playableShells|playableIntegrations|playables|settlements|readFlowPlayablesFamily" src/modules/script-editor src/application src/core src/main.ts public/script-editor-templates/zhuyuanzhang`
  - Next: `Expand Task 3 into an explicit minigame-loading unification checklist so the remaining flow-playables retirement, runtime owner rename, and loader validation work can be executed in order without changing visible behavior.`
- 2026-08-03
  - Summary: `Completed Task 3A by promoting flow-playables.json from an implied public exception to an explicit source contract rule: the zhuyuanzhang sync contract now declares flow-playables.json as a legacy public-only publication artifact, publication-only manifest keys are derived from that rule instead of duplicated by hand, and regression coverage now fails if either maintained pack starts declaring flowPlayables or if the public manifest loses the current legacy publication key before loader migration.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Start Task 3B and collapse the runtime-side flowPlayables/flows owner seam into a single playableShells-family owner or compatibility bridge.`
- 2026-08-03
  - Summary: `Started Task 3B with a bounded compatibility-bridge slice instead of a risky repo-wide rename. active-game-content now treats playableShells as the canonical loaded family while still exposing flowPlayables aliases, the core playable runtime now accepts playableShellsById as the primary lookup surface, and the scene-runner -> event-playable-runtime path now forwards playableShellsById so runtime-preview event actions can launch the same flow shell without depending on the old property name.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `Continue Task 3B by applying the same canonical playableShells bridge to dialogue/story runtime contracts and then reassess how much flowPlayables surface remains before loader-contract alignment.`
- 2026-08-03
  - Summary: `Extended Task 3B into the shared story runtime path. Scene/dialogue runtime contracts now accept playableShellsById, story-runtime passes the canonical shell map into its scene-runner context, and a new targeted regression proves startStoryEventById can launch a flow shell when only playableShellsById is present. During verification, a temporary failure was traced to global playable-registry test interference rather than runtime ownership; the new story-runtime test now uses a dedicated playable id so the coverage remains stable under multi-file node --test runs.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs`
  - Next: `Use the remaining flowPlayables reference inventory to decide whether one more Task 3B caller-shrink slice is worthwhile before switching focus to Task 3C loader and manifest alignment.`
- 2026-08-03
  - Summary: `Completed one more Task 3B caller-shrink slice by wiring game-store through the same canonical playableShells bridge. A dedicated regression now proves createGameStore can launch a flow shell when only playableShellsById is present. While checking whether Task 3A's remaining legacy-public problem could now be handled, a fresh audit confirmed the blocking fact pattern has not changed: src/modules/script-editor/builtin-templates/zhuyuanzhang/playable-shells.json is still empty, but public/script-editor-templates/zhuyuanzhang/flow-playables.json still contains 24 records, so the legacy public file still lacks a maintained-pack owner and cannot yet be safely regenerated or deleted.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node -e "const fs=require('fs');const a=JSON.parse(fs.readFileSync('src/modules/script-editor/builtin-templates/zhuyuanzhang/playable-shells.json','utf8'));const b=JSON.parse(fs.readFileSync('public/script-editor-templates/zhuyuanzhang/flow-playables.json','utf8'));console.log(JSON.stringify({builtinPlayableShells:a.length, publicFlowPlayables:b.length},null,2))"`
  - Next: `Decide whether to stop Task 3B after one last residual-reference audit and move to Task 3C, because Task 3A's remaining legacy-public file cannot progress further until a maintained canonical owner exists for the public-only flow records.`
- 2026-08-03
  - Summary: `Started Task 3C with a bounded loader-contract slice. scenario-pack-loader now explicitly accepts playables/playableIntegrations/playableShells and rejects the retired flowDefinitions family, while content-pack-loader now hydrates playables/playableIntegrations/playableShells from manifest files and rejects files.flowDefinitions. This brings the primary loader vocabulary closer to the mod-first-dev family set without changing runtime behavior.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Continue Task 3C by aligning more of the loader/manifest surface with the new playable family vocabulary, then reassess whether any remaining flowPlayables/flows compatibility fields can be narrowed without touching UI or behavior.`
- 2026-08-03
  - Summary: `Extended Task 3C into the script-editor import/export seam for the still-live public template contract. runtime-pack-import now accepts the legacy public flowPlayables publication family as a fallback only when playableShells is absent, so importing public/script-editor-templates/zhuyuanzhang no longer silently drops the 24 legacy flow shells. runtime-pack-export now also permits minigame bindings that target authored project flow shells, which restores round-trip export compatibility for the imported public template without changing the current UI or startup behavior.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Keep Task 3C focused on the remaining loader/manifest contract inventory: decide whether legacy public flowPlayables should be made explicit in the remaining loader types/tests or remain a script-editor-only compatibility seam until the public publication contract is retired.`
- 2026-08-03
  - Summary: `Made the remaining legacy-public flowPlayables contract explicit instead of relying on accidental passthrough. script-editor runtime preview coverage now locks both file import and URL import of the public template path, scenario-pack-loader explicitly accepts and validates manifest/files.flowPlayables as a legacy public publication family, ContentPackDefinition now exposes flowPlayables as a compatibility alias, and active-game-content falls back from playableShells to flowPlayables before the older flows alias. This keeps the current UI and behavior unchanged while making the loader contract readable and testable.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/scenario-pack-playable-shells-contract.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Use the now-explicit loader contract to audit remaining manifest/publication drift: identify which playable-family files are still effectively public-only, which are already derivable from the two maintained packs, and whether the sync tool can absorb one more bounded publication slice without touching runtime UI or startup order.`
- 2026-08-03
  - Summary: `Finished the first playable-family drift audit after making the loader contract explicit. New source-unification regressions now freeze the actual current split: canonical playable family files (playables / playable-integrations / playable-shells) live only in the script-editor builtin template pack, runtime pack still does not own that family, and public remains limited to the legacy flow-playables publication file. This removes ambiguity about the current owner map and prevents public from silently regrowing into a third maintained playable source.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs`
  - Next: `Decide the next bounded Task 3C slice using the now-frozen owner map: either teach the sync/publication layer how to report public-only playable drift more explicitly, or start the harder owner migration that would move the 24 legacy public flow shells into one of the two maintained packs.`
- 2026-08-03
  - Summary: `Completed the governance-only warning slice before owner migration. The zhuyuanzhang sync tool now exports a dedicated legacy-public flow audit and a check-legacy-publication-drift CLI mode that reports the current owner gap without affecting the normal startup-template sync path. Regression coverage now locks both the structured audit result and the failing CLI output: builtin template playable-shells count is still 0, public legacy flow-playables count is 24, and all 24 ids are surfaced as public-only owner gaps.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check-legacy-publication-drift`
  - Next: `Use the frozen 24-id owner-gap list to design and execute the actual owner migration: choose the maintained canonical pack, project those legacy public flow shells into maintained data, and only then retire or regenerate public flow-playables from maintained sources.`
- 2026-08-03
  - Summary: `Completed the first owner migration slice after the warning pass. The script-editor builtin template pack is now the maintained canonical owner for the 24 legacy public flow shells: playable-shells.json has been populated from the previously public-only flow-playables data, the sync contract now treats flow-playables.json as a publication projection alongside pack.json, and the sync tool can project public flow-playables from builtin template playable-shells. The legacy-public audit remains available, but it now reports aligned for the repository state while still supporting synthetic owner-gap coverage.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check-legacy-publication-drift`
  - Next: `Use the now-maintained builtin template owner to reduce the remaining publication/runtime split further: decide whether public flow-playables can be treated as fully derived in all workflows, and whether any playable-family ownership should also move toward the builtin runtime pack or remain template-owned by design.`
- 2026-08-03
  - Summary: `Finished the next publication-consistency slice by removing the remaining source-direction ambiguity for public flow-playables. The sync tool now resolves public flow-playables from the template-owned canonical playable-shells projection even when the caller runs --source=builtin-runtime-pack, so both sync directions agree on the same public publication output. This keeps public in a pure publication role and avoids a hidden split where runtime-source checks previously skipped that file entirely.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `With public publication now fully tied to the template-owned canonical projection in both directions, decide whether the remaining playable-family split between runtime pack and template pack is intentional long-term architecture or the next convergence target.`
- 2026-08-03
  - Summary: `Completed the first runtime mirror convergence slice for playable families. The sync contract now documents template-owned canonical playable-family data with a runtime mirror mode, the sync tool resolves canonical playables/playable-integrations/playable-shells from the template owner even when invoked from the runtime direction, and running the sync tool from script-editor-template-pack generated mirrored runtime files plus matching manifest entries under src/content/scenario-packs/zhuyuanzhang. Regression coverage now freezes the new boundary: runtime pack carries mirrored playable-family files, but runtime events still do not directly launch those playables, so visible behavior remains unchanged while source ownership becomes less fragmented.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/game-store-playable-shells.test.cjs tests/story-runtime-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs tests/flow-playable-runtime-dispatch.test.cjs tests/dialogue-runtime-compatibility.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Use the new runtime mirror state to decide the long-term canonical owner: keep playable-family data template-first with runtime mirrors, or further converge around a shared canonical source in a later slice.`
- 2026-08-03
  - Summary: `Extended Task 3C past the playable-family vocabulary and into the first temple runtime-building support mirror. content-pack-loader and scenario-pack-loader now accept menuResources/menuInstances/locationAccess/houseModuleDefaults in addition to the newer playable families, active-game-content preserves these families for later builtin runtime consumption, and the zhuyuanzhang sync contract/tool now mirrors building-arrangements/dialogues/event-bindings/menu-resources/menu-instances/location-access/house-module-defaults/settlements from the script-editor template pack into the builtin runtime pack together with matching runtime manifest keys. This gives the builtin runtime pack the same authored temple-entry support set that mod-first-dev already carries, without yet changing the visible temple UI or entry order.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/scenario-pack-playable-shells-contract.test.cjs tests/active-game-content-story-context.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs tests/active-game-content-story-context.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`
  - Next: `Start the next bounded temple-owner slice: choose one current builtin temple entry path and reroute it to consume the now-mirrored runtime pack building/action support data through an existing coordinator seam instead of keeping that entry entirely temple-module-owned.`
- 2026-08-03
  - Summary: `Started the first actual temple-owner consumption slice on top of the mirrored runtime support data. The zhuyuanzhang sync contract/tool now mirrors a safe temple event subset into the builtin runtime pack without enabling the mirrored temple enter event, a centralized house-module pack-event transition helper now owns this compat path, and temple-house leave now consumes the pack-owned temple leave event instead of keeping that close-building behavior only inside the house module. This keeps the current UI and temple entry order unchanged while moving one real temple action under pack-owned mod execution.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test tests/house-module-pack-event-runtime.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/dialogue-runtime-compatibility.test.cjs tests/building-container-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `Use the same centralized seam for one bounded in-house temple action next, preferably a low-risk action whose current visible shell can stay exactly the same while the underlying event/playable ownership moves into the mirrored pack data.`
- 2026-08-03
  - Summary: `把第一组同构寺庙杂务动作一起收进了同一个集中入口。temple-house 不再只对“打扫庭院”尝试 pack-owned 启动，而是对“打扫庭院 / 挑水”都优先读取 mirrored runtime pack 里的 building-action -> launchPlayable 数据；命中时继续留在当前寺庙房屋壳内运行，拿 pack-authored integrationId 和 activityId 起 QTE；未命中时仍回退到原有 temple builtin 启动链。这样寺庙动作 ownership 继续往剧本包移动，但 UI、交互和既有顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续判断下一类寺庙信息该优先往哪里收口：要么继续扩展同构 building-action 的 pack-owned 消费面，要么开始把寺庙专属默认文案/默认配置从 temple-house owner 下放到剧本包数据。`
- 2026-08-03
  - Summary: `开始把寺庙静态默认配置从 temple-house owner 下放到剧本包。temple review / task assignment 这组默认种子不再只依赖 temple-review-assignment-defaults.ts 内的固定值，而是先读取 scenario pack 的 house-module-defaults["temple-house"]，没有配置时再回退到旧默认值。与此同时，house runtime 已把 houseModuleDefaults 沿着统一输入链传给 house module，模板包中的 temple-house 默认配置也已同步写回 builtin runtime pack。这样寺庙相关“信息 owner”开始进入剧本包，但现有 UI、功能和顺序保持不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续选择下一类低风险寺庙信息收口：优先考虑更多可配置默认文案/默认参数，或者继续扩展不改现有房屋壳的 building-action pack-owned 消费面。`
- 2026-08-03
  - Summary: `继续沿“静态默认信息下放”这条线推进了一小刀。新增了集中式 temple-house-static-defaults 读取器，先把 greeting / open / rest menu / meeting intro / leave refusal 这 5 组寺庙静态文案默认值从 temple-house-house-module.ts 里的直接文本键引用，改成优先读取 scenario pack 的 house-module-defaults["temple-house"]；没有配置时仍回退到原有内建文本键。模板包中的对应默认值已经补进 house-module-defaults.json，并同步镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI 与交互不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑捐香火确认/结果文案、工作方案标签和其余固定提示文本。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙静态默认值覆盖面。temple-house-static-defaults 现在除了 greeting / open / rest menu / meeting intro / leave refusal 之外，还统一承接 work-plan labels 与 donation text ids；temple-house-house-module.ts 里原本直接引用的“外出化缘/寺内帮忙”等工作方案文本键，以及捐香火确认/余额不足/结果提示文本键，已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。模板包中的对应默认值已补进 house-module-defaults.json，并同步镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑其余固定提示文本、差事固定文案和静态参数。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙 review assignment 提示文案的收口范围。temple-house-static-defaults 现在除了已有的 greeting/open/rest/review-intro/leave-refusal/work-plan labels/donation text ids 之外，还统一承接 review assignment text ids；temple-house-house-module.ts 里原本直接引用的“第三周/第四周分配提示”“默认分配提示”“化缘未解锁提示”文本键，已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。模板包中的对应默认值已补进 house-module-defaults.json，并同步镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑 beg-alms start overlay 文案、休息总结文案和状态卡固定标题/副标题。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙静态默认值覆盖面。temple-house-static-defaults 现在进一步统一承接 beg-alms start overlay 文案和状态卡固定文案；temple-house-house-module.ts 里原本直接拼接/直写的“化缘开始浮层标题与两段提示”“寺庙状态卡眉题/标题/副标题/住持指标标签”文本键，已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。模板包中的对应默认值已补进 house-module-defaults.json，并同步镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑休息总结文案和其余固定提示文本。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙静态默认值覆盖面。temple-house-static-defaults 现在进一步统一承接休息总结文案；temple-house-house-module.ts 里原本直接引用的“休息被评定中断提示”“无须继续休息提示”“休息天数/当前体力/正常总结”这 6 个文本键，已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。模板包中的对应默认值已补进 house-module-defaults.json，并同步镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house rest summary resolves from text entries" tests/robustness.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑其余固定提示文本和少量静态参数。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙静态默认值覆盖面。temple-house-static-defaults 现在进一步统一承接迟到评定文案；temple-house-house-module.ts 里原本直接引用的“迟到后续选择说明”“轻度迟到两段提示”“重度迟到两段提示”文本键，已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。模板包中的对应默认值已补进 house-module-defaults.json，并同步镜像到 builtin runtime pack。同时补了一条行为回归，锁住迟到进入寺庙评定时的文案顺序保持不变。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house late review copy resolves from text entries" tests/robustness.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑其余固定提示文本和少量静态参数。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙静态默认值覆盖面。temple-house-static-defaults 现在进一步统一承接化缘交粮文案；temple-house-house-module.ts 里原本直接引用或直写的“暂无可交粮食”标题、“空库存两段提示”“交粮确认标题与两段说明”“交粮完成后的主任务标签”已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。为把原本写死的空库存标题也迁进剧本包，这次额外补了一个新的文本键 `runtime.zhu_yuanzhang.temple.begging_food.empty.title`，但显示文案仍保持“暂无可交粮食”不变。模板包中的对应默认值已补进 house-module-defaults.json，并通过同步工具镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house status labels, fortune, and begging submit overlay resolve from text entries" tests/robustness.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs tests/temple-review-assignment-defaults.test.cjs tests/temple-pack-event-work-bridge.test.cjs tests/house-module-pack-event-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑其余固定提示文本和少量静态参数。`
- 2026-08-03
  - Summary: `继续沿同一个集中读取器扩大了寺庙静态默认值覆盖面。temple-house-static-defaults 现在进一步统一承接“指定休息天数”浮层文案、“寺内帮忙”说明浮层文案，以及化缘交粮浮层的数量标签/确认按钮/取消按钮。temple-house-house-module.ts 里原本直接写死的“指定休息天数”“开始休息”“返回”“寺内帮忙”“两条寺内帮忙说明”“交粮数量（斗）”“交给寺里”“暂缓”，已经改成优先从 scenario pack 的 house-module-defaults["temple-house"] 读取。模板包中的对应默认值与新 text id 已补进 house-module-defaults.json 和 text-entries.json，并通过同步工具镜像到 builtin runtime pack。这样寺庙静态信息继续往剧本包 owner 收口，但现有 UI、行为和顺序不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house status labels, fortune, and begging submit overlay resolve from text entries|temple house rest-days and qte overlays resolve from text entries" tests/robustness.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续下放下一批低风险寺庙静态信息，优先考虑剩余 alert/result 类固定标题、按钮标签和少量静态参数。`
- 2026-08-03
  - Summary: `把寺庙静态 owner 收口推到一层完成态。temple-house-static-defaults 这次继续接住了剩余 alert/result 类标题、工作确认标签、工作结果等级与评语、评定面板标题、日常按钮标签、状态卡标签、对话推进提示和离开按钮等静态文本；模板包中的 house-module-defaults.json 与 text-entries.json 已补齐对应键，runtime pack 也已同步镜像。当前 temple-house-house-module.ts 内部已经没有直接写死的中文文案，寺庙这一层的固定可见文案已统一归到剧本包 owner。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-house-static-defaults.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple house status labels, fortune, and begging submit overlay resolve from text entries|temple house rest-days and qte overlays resolve from text entries" tests/robustness.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `回到 Task 3C 主线，继续处理寺庙以外的 loader / manifest / playable family 统一问题。`
- 2026-08-04
  - Summary: `继续沿 Task 3C 缩小 playable family 的中间层兼容面。active-game-content 仍保留 gameContent.flowPlayables / flowPlayablesById 作为外层兼容别名，但 storyContent 已不再继续暴露 flowPlayablesById；story-runtime、scene-runner、event-playable-runtime、core scene-runtime、core dialogue-runtime 这一整条内部链现在只再透传 canonical 的 playableShellsById。这样旧 owner 名称被压回更外层兼容边界，运行时主干继续向 mod-first-dev 的 canonical 词汇收口，而现有 UI 和预览行为不变。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/active-game-content-story-context.test.cjs tests/story-runtime-playable-shells.test.cjs tests/game-store-playable-shells.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/dialogue-runtime-compatibility.test.cjs`
  - Next: `继续处理更外层的 legacy public flow-playables / import-export / manifest 兼容边界，避免再把 flowPlayablesById 重新扩散回中间 runtime 链。`
- 2026-08-04
  - Summary: `继续沿 Task 3C 收 public 发布层的小游戏 family 合同。zhuyuanzhang source contract 不再把 playableShells 视为 builtin-template-only manifest key，sync 工具开始给 public/script-editor-templates/zhuyuanzhang 同步生成 canonical 的 playable-shells.json，同时保留 flow-playables.json 作为 legacy public publication。这样默认模板导入链在 public 同时提供新旧两个文件时，会优先使用 playable-shells，而旧 flow-playables 继续仅做外层兼容。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --source=script-editor-template-pack --write`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续把剩余 legacy flowPlayables 读取边界压回 script-editor/public seam，优先补 loader/import 侧的 canonical-first 合同与回归，再决定是否还能进一步收 manifest 别名。`
- 2026-08-04
  - Summary: `继续沿 Task 3C 补齐 loader 外层兼容面。content-pack loader 现在与 scenario-pack loader 一样，显式支持 files.flowPlayables 这个 legacy public manifest 键，因此外部内容包如果仍发布旧 flow-playables 文件，也能在最外层被正确接住；而 active-game-content 继续把这类旧键收束到 playableShells canonical owner，不向更内层扩散。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `继续清点剩余 flowPlayables / flowPlayablesById 残留，优先处理还停在 loader、导入导出、测试合同里的旧别名，再判断是否能继续缩减外层兼容口。`
- 2026-08-04
  - Summary: `继续沿 Task 3C 把内部运行时 owner 完成收口。core/runtime/playable-runtime.ts 不再接受 flowPlayablesById；application/state/game-store.ts 也不再保留 flowPlayablesById 兼容入口；application/content/active-game-content.ts 的 gameContent 结果已不再暴露 flowPlayables / flowPlayablesById。对应回归测试全部改为以 playableShells / playableShellsById 为 canonical owner，验证通过后，当前仓库里剩余的 flowPlayables 只再停留在 public/template loader 与 legacy pack 输入边界。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/flow-playable-runtime-dispatch.test.cjs tests/active-game-content-story-context.test.cjs tests/game-store-playable-shells.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/script-editor-template-url.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `如果继续压缩剩余 legacy surface，下一刀只应针对 loader/public/template seam 做 keep-or-remove 判断，不要再把兼容别名重新带回 runtime 主链。`
- 2026-08-04
  - Summary: `继续沿 Task 3C 收束外层 loader/import 的 legacy playable family fallback。新增了 domain/playables/playable-shell-family helper，集中负责把 flowPlayables / flows 投影成 canonical 的 playableShells；scenario-pack loader、content-pack loader、script-editor runtime-pack import、active-game-content 都已改为通过这一个 helper 读取，相关回归也锁住了“legacy 输入仍保留旧字段，但同时必须补出 canonical playableShells”这一合同。这样旧字段的兼容 owner 进一步集中，不再散落在多个消费点里。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `评估是否还要继续收 domain/content-pack.ts、manifest key 和 public/template loader 的 legacy surface；如果继续，也必须保持“兼容集中在外层，内部消费只认 canonical owner”这个约束。`
- 2026-08-04
  - Summary: `继续沿同一条线再收了一层更老的兼容面。domain/content-pack.ts 与 playable-shell-family helper 里对 flows 的内容包兼容支持已经移除，说明当前仓库里 legacy playable family 只剩 flowPlayables 这一层仍在 public/template loader 与 script-editor 导入兼容里使用。这样“旧到新”的兼容梯度更清晰：内部消费只认 playableShells，内容包 legacy 输入只认 flowPlayables，不再额外保留 flows。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/scenario-pack-playable-shells-contract.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/active-game-content-story-context.test.cjs`
  - Next: `如果还要继续收口，就只能围绕 flowPlayables 这层 public/template loader 合同来做 keep-or-migrate 决策，而不是再改内部 runtime 或内容包消费方。`
- 2026-08-04
  - Summary: `开始执行这条主线最后一层真正的迁移：当前项目自己的 public/template 发布合同已不再使用 flowPlayables。zhuyuanzhang source contract 现已把 public canonical publication file 改成 playable-shells.json；同步工具不再生成或校验 flow-playables.json；public/script-editor-templates/zhuyuanzhang/pack.json 已移除 files.flowPlayables；对应默认模板 URL 与 script-editor 运行预览回归也已从“保留 legacy public flow-playables”改成“直接导入 canonical playable-shells”。这样当前项目自己的发布层和默认模板入口已经真正摆脱 flowPlayables，只保留通用 loader 对外部旧包输入的兼容。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/zhuyuanzhang-source-unification.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/scenario-pack-playable-shells-contract.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=builtin-runtime-pack`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node tools/sync-zhuyuanzhang-startup-templates.mjs --check --source=script-editor-template-pack`
  - Next: `若继续推进，唯一剩余的 flowPlayables 只应出现在通用 legacy loader 合同与其测试中；当前项目的 public/template/runtime owner 合同可以视为已完成移除。`
---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-03-builtin-startup-scenario-pack-unification-design.md`
- Upstream implementation handoff:
  - `docs/superpowers/plans/2026-08-03-builtin-startup-scenario-pack-unification-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `There are currently two maintained zhuyuanzhang pack trees in active use: src/content/scenario-packs/zhuyuanzhang/** and src/modules/script-editor/builtin-templates/zhuyuanzhang/**.`
  - `src/modules/script-editor/config.ts now points the default editor template URL at /builtin-script-editor-templates/zhuyuanzhang/pack.json, and tests/script-editor-template-url.test.cjs enforces that this registered builtin publication path exists.`
  - `tools/sync-zhuyuanzhang-startup-templates.mjs no longer stops at scenario-profile.json/startup-facing fields; it also materializes the sole generated public publication package and deletes the retired legacy physical root on --write.`
  - `The generated public publication now lives at public/builtin-script-editor-templates/zhuyuanzhang/** and keeps the full self-contained manifest family plus map-referenced assets needed for browser loading and folder import.`
  - `Because the legacy public template tree and legacy manifest URL are already retired, the remaining work is no longer “demote old public into a generated layer” but “finish the shared-field/overlay contract for the two maintained packs and keep the sole publication root reproducible.”`

## Implementation Scope

### Non-Negotiable Constraints

- Do not change the current UI shell, page order, button order, or visible entry surfaces.
- Do not change existing feature behavior for `开始游戏`, `角色选择`, `地图`, `模板运行预览`, map/house interactions, building layout, or editor tooling.
- Do not reorder, rewrite, or replace the pre-merge scenario sequence or content.
- Do not move feature business logic into `src/main.ts`; keep source unification in tooling, startup seams, and editor/runtime ownership modules.
- Do not reintroduce `public/script-editor-templates/zhuyuanzhang/**` or the legacy `/script-editor-templates/zhuyuanzhang/pack.json` manifest URL in this child.
- The long-term maintained-pack target is exactly two zhuyuanzhang packs: builtin runtime pack plus script-editor template pack. `public/builtin-script-editor-templates/zhuyuanzhang/**` may exist only as a generated publication output, not as a third hand-maintained pack.

### In Scope

- Define a durable ownership contract for the two maintained zhuyuanzhang packs plus the temporary public publication layer.
- Keep `src/content/scenario-packs/zhuyuanzhang/**` as the builtin runtime pack and `src/modules/script-editor/builtin-templates/zhuyuanzhang/**` as the editor template pack.
- Keep `public/builtin-script-editor-templates/zhuyuanzhang/**` as the sole derived publication output and prevent any legacy public-root or legacy-URL regression.
- Expand or replace the current zhuyuanzhang sync tooling so repeated multi-tree manual editing is no longer required and changes from either maintained pack can be synchronized to the other.
- Add regressions that prove the default editor template URL, runtime preview, and canonical runtime pack stay aligned under the new ownership model.
- Record the final ownership contract now that `public/script-editor-templates/zhuyuanzhang/**` and its legacy manifest URL are retired, and keep the remaining publication root reproducible.

### Still Out Of Scope

- Broad scenario-content hardcoding cleanup unrelated to source ownership.
- UI redesign, menu-flow changes, or startup-chain behavior changes already completed in the previous child.
- Rewriting scenario story content, text ordering, or startup event order to “fit” the new source model.
- Immediate removal of the public template URL without an explicit loader migration.
- Converting unrelated scenario packs before zhuyuanzhang proves the ownership model.

## File Map

### Existing files to modify

- `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - Builtin runtime-pack manifest may need explicit ownership metadata or normalized file coverage expectations for shared fields versus builtin-only fields.
- `src/content/scenario-packs/zhuyuanzhang/scenario-profile.json`
  - Builtin runtime-pack owner for shared startup/runtime-facing scenario defaults unless a field is explicitly template-only.
- `src/content/scenario-packs/zhuyuanzhang/characters.json`
  - Shared runtime/startup-facing character identity data must stay synchronized with the template pack.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/pack.json`
  - Editor template-pack manifest with explicit shared-field synchronization and template-only ownership boundaries.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/scenario-profile.json`
  - Shared fields must stay synchronized with the builtin runtime pack while preserving explicit editor-only fields.
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/characters.json`
  - Shared startup/identity fields must stay synchronized with the builtin runtime pack while preserving editor-only metadata.
- `public/builtin-script-editor-templates/zhuyuanzhang/pack.json`
  - The sole published default-template manifest and self-contained folder-import entry; it must remain reproducible from the unified source model.
- `public/builtin-script-editor-templates/zhuyuanzhang/scenario-profile.json`
  - Derived published copy of the canonical runtime/template shared scenario profile.
- `public/builtin-script-editor-templates/zhuyuanzhang/characters.json`
  - Derived published copy of shared character startup fields.
- `src/modules/script-editor/config.ts`
  - Keeps the registered builtin publication URL contract at `/builtin-script-editor-templates/zhuyuanzhang/pack.json`; this child must not reintroduce the retired legacy path.
- `src/modules/script-editor/kernel/script-editor-workflow-controller.ts`
  - May need source-loading seam updates if template publication becomes generated or if ownership metadata is enforced.
- `tools/sync-zhuyuanzhang-startup-templates.mjs`
  - Current narrow startup sync owner that should be expanded or replaced by the broader two-pack synchronization mechanism.
- `package.json`
  - Script wiring may need to expose the broader source sync/generation command and check mode.
- `tests/script-editor-template-url.test.cjs`
  - Must keep proving the registered builtin default-template contract works and the retired legacy path does not silently return.
- `tests/script-editor-runtime-preview-compat.test.cjs`
  - Must keep proving runtime preview behavior stays aligned with the canonical runtime source.

### Existing files expected to be deleted

- `none`

### New files to create

- `tests/zhuyuanzhang-source-unification.test.cjs`
  - Guards the two-pack synchronization contract and fails if builtin/template shared fields drift or if required generated public outputs go stale.

## Verification Plan

- Targeted verification:
- `The builtin runtime pack and the editor template pack resolve the same shared startup/runtime-visible data under the approved ownership map, and the published public template pack remains a reproducible output instead of a third maintained source.`
- `The default editor template URL continues to resolve the registered builtin self-contained public pack.`
- `The sync tool fails in check mode when the builtin pack and template pack drift on shared fields, or when the published public output drifts from the maintained-pack contract.`
- Required commands:
  - `pnpm run lint:plans`
  - `pnpm run build:test`
  - `node --test tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs`
  - `pnpm run typecheck`
  - `pnpm run build`

## Task 1: Lock The Source Hierarchy Contract

**Files:**
- Modify: `docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md`
- Read: `src/modules/script-editor/config.ts`
- Read: `tests/script-editor-template-url.test.cjs`
- Read: `tools/sync-zhuyuanzhang-startup-templates.mjs`

- [x] **Step 1: Record the ownership map and public-retirement gate**

Write down the exact tree contract:
- builtin runtime pack and script-editor template pack are the only two maintained packs
- shared fields between the two maintained packs must have explicit synchronization rules
- `public/builtin-script-editor-templates/zhuyuanzhang/**` is a published derivative for direct browser loading and folder import, not a maintained third pack
- `public/script-editor-templates/zhuyuanzhang/**` and `/script-editor-templates/zhuyuanzhang/pack.json` are retired and must not be reintroduced

- [x] **Step 2: Freeze the current public dependency with regression coverage**

Ensure tests keep failing if someone removes or silently bypasses the public default-template path before the loader migration is intentionally implemented, and if someone reintroduces a third hand-maintained pack workflow.

- [x] **Step 3: Sync progress and governance state**

Update this child plan after the contract is finalized so the next resume point stays explicit.

## Task 2: Expand The Sync Tool From Startup Fields To Two-Pack Shared Fields

**Files:**
- Modify: `tools/sync-zhuyuanzhang-startup-templates.mjs`
- Modify: `package.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/scenario-profile.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/characters.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/scenario-profile.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/characters.json`
- Modify: `public/script-editor-templates/zhuyuanzhang/scenario-profile.json`
- Modify: `public/script-editor-templates/zhuyuanzhang/characters.json`

- [x] **Step 1: Broaden the synchronization model**

Turn the current startup-only sync tool into the owner for all shared runtime/startup-facing fields that must stay identical across the two maintained packs, while still being able to emit the public published copy.

- [x] **Step 2: Preserve explicit template-only/public-only overlays**

Keep editor-only metadata and public-only publication needs out of the shared synchronization surface unless they are deliberately modeled as pack-specific overlays.

- [x] **Step 3: Add bi-directional sync semantics and check-mode failure**

Make drift visible in CI by ensuring the sync tool can fail loudly when either maintained pack becomes stale relative to the approved synchronization contract, and support an explicit source-of-change direction when applying updates.

- [x] **Step 4: Sync progress and governance state**

Update this child plan after the tool and derived files are aligned.

## Task 3: Canonicalize Manifest And Asset Publication Rules

**Files:**
- Modify: `src/content/scenario-packs/zhuyuanzhang/pack.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/pack.json`
- Modify: `public/builtin-script-editor-templates/zhuyuanzhang/pack.json`
- Modify: `src/modules/script-editor/kernel/script-editor-workflow-controller.ts`
- Modify: `tests/script-editor-template-url.test.cjs`
- Create: `tests/zhuyuanzhang-source-unification.test.cjs`

- [x] **Step 1: Separate shared-file ownership from publication shape**

Define which manifest entries are shared between the two maintained packs, which remain pack-specific exceptions, and which belong only to the published browser-loading output.

- [x] **Step 2: Keep the current public loader contract working**

Retain the current `/builtin-script-editor-templates/zhuyuanzhang/pack.json` behavior while making that published tree reproducible rather than hand-maintained.

- [x] **Step 3: Add ownership regressions**

Cover the cases where builtin/template manifest coverage drifts on shared fields or where public publication loses a file the current default template still needs.

- [x] **Step 4: Sync progress and governance state**

Record the manifest/publication outcome and the exact remaining gap, if any, before considering loader migration.

### Task 3A: Lock The Legacy Public Flow-Playables Decision

**Files:**
- Modify: `tools/zhuyuanzhang-source-sync-contract.mjs`
- Modify: `tools/sync-zhuyuanzhang-startup-templates.mjs`
- Modify: `public/builtin-script-editor-templates/zhuyuanzhang/pack.json`
- Modify: `tests/zhuyuanzhang-source-unification.test.cjs`
- Read: `public/builtin-script-editor-templates/zhuyuanzhang/playable-shells.json`
- Read: `src/modules/script-editor/builtin-templates/zhuyuanzhang/playable-shells.json`
- Read: `src/modules/script-editor/builtin-templates/zhuyuanzhang/playables.json`
- Read: `src/modules/script-editor/builtin-templates/zhuyuanzhang/playable-integrations.json`

- [x] **Step 1: Freeze the current owner diagnosis**

Record in code and tests that `public/script-editor-templates/zhuyuanzhang/flow-playables.json` is a legacy publication-only file, not one of the two maintained pack sources, and that it cannot be silently treated as canonical runtime/editor data.

- [x] **Step 2: Decide the short-term publication contract**

Choose one explicit temporary rule and encode it in the sync contract:
- keep `flow-playables.json` as a legacy publication-only artifact with an explicit retention gate, or
- regenerate it from a newly defined canonical owner if the current file can be derived without losing behavior.

The key constraint is that the answer must be centralized in tooling rather than left as an undocumented hand-maintained exception.

- [x] **Step 3: Add regression coverage for the public exception**

Fail if:
- `public/pack.json` drops `flowPlayables` before the loader/publication contract is migrated, or
- a maintained pack starts declaring `flowPlayables` as if it were a first-class source family again.

- [x] **Step 4: Sync progress and governance state**

Update this plan with the explicit temporary decision, so later work does not have to rediscover why `flow-playables.json` still exists or under what gate it can be removed.

### Task 3B: Move Runtime Content Ownership To The Playable-Shells Family Contract

**Files:**
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/application/state/game-store.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `src/core/runtime/dialogue-runtime.ts`
- Modify: `src/core/contracts/dialogue-runtime.ts`
- Modify: `src/core/contracts/scene-runtime.ts`
- Modify: `src/application/events/event-playable-runtime.ts`
- Test: `tests/script-editor-runtime-preview-compat.test.cjs`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Replace runtime owner terminology, not runtime behavior**

Refactor the central runtime content owner so the canonical loaded family becomes `playableShells` / `playableShellsById`, matching the newer pack model, while preserving every current UI path and playable launch behavior.

This is an ownership cleanup, not a gameplay rewrite:
- no menu reorder
- no startup flow change
- no minigame trigger semantics change

- [x] **Step 2: Keep a narrow compatibility seam where needed**

If some downstream runtime APIs still need `flowPlayablesById` temporarily, isolate that as a transition seam in one owner module instead of letting both owner names continue to spread across the runtime.

- [x] **Step 3: Add runtime equivalence regressions**

Cover that the same template preview/startup path can still:
- enter the same scene/map shell
- resolve the same minigame/playable triggers
- keep the current exit-preview and first-playable behavior unchanged

- [x] **Step 4: Sync progress and governance state**

Record which old runtime names, if any, remain intentionally bridged after this slice and where the bridge is expected to be deleted.

### Task 3C: Align Scenario-Pack Validation And Loading With mod-first-dev

**Files:**
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/application/content/content-pack-loader.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify: `tests/script-editor-runtime-preview-compat.test.cjs`
- Modify: `tests/zhuyuanzhang-source-unification.test.cjs`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Promote the new family set into the main loader contract**

Bring the main scenario/content loading contract up to the same family vocabulary already used by mod-first-dev:
- `playables`
- `playableIntegrations`
- `playableShells`
- `settlements`

and explicitly reject retired inputs such as `flowDefinitions`.

- [x] **Step 2: Keep the script-editor import/export path on the same contract**

Verify the editor runtime-pack import/export seam still reads and writes the same family set after the runtime/content loaders are aligned, so preview, builtin runtime, and template publication no longer drift on minigame-family expectations.

- [x] **Step 3: Add drift-detection coverage**

Fail if:
- builtin runtime pack and builtin editor template pack disagree on the canonical minigame-family manifest shape, or
- a loader accepts retired flow-family manifest keys without an intentional compat bridge.

- [x] **Step 4: Sync progress and governance state**

Update Task 3 status with the exact remaining delta between the two maintained packs and the public publication layer after loader alignment is complete.

### Task 3 Execution Order For The Remaining Minigame Slice

- [x] **Order 1: Complete Task 3A first**

Do not rename runtime owners before the public legacy-exception rule is written down and test-covered.

- [x] **Order 2: Complete Task 3B second**

Once the public exception is bounded, move runtime/game-content ownership to the `playableShells` family contract without changing visible behavior.

- [x] **Order 3: Complete Task 3C third**

After runtime ownership is aligned, tighten the scenario/content loader contract so the branch no longer accepts the old split by accident.

- [x] **Order 4: Only then revisit Task 4**

The `public` deletion/migration decision should be revisited only after the minigame-family owner, loader, and publication contracts all match the two-pack model.

## Task 4: Decide Whether Loader Migration Is Needed Or Public Remains A Published Layer

**Files:**
- Modify: `src/modules/script-editor/config.ts`
- Modify: `src/modules/script-editor/kernel/script-editor-workflow-controller.ts`
- Modify: `tests/script-editor-template-url.test.cjs`
- Modify: `docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md`

- [x] **Step 1: Re-evaluate the public deletion question using the new source model**

After Tasks 1-3, decide whether the repository still needs the public pack as a published target or whether the editor loader can be intentionally migrated without changing UI or behavior.

Current result: `public/builtin-script-editor-templates/zhuyuanzhang/**` 已经落地为新的完整自包含 publication package；旧 `public/script-editor-templates/zhuyuanzhang/**` physical root 与 legacy `/script-editor-templates/zhuyuanzhang/pack.json` manifest URL 都已退场。

- [x] **Step 2: If public stays, document it as a permanent published derivative**

Close the deletion question by recording that public is not a third source anymore, only a generated publish target.

Current result: `public/builtin-script-editor-templates/zhuyuanzhang/**` 已固定为唯一生成 publication root；它继续承担浏览器加载与 folder-import 职责，但不再作为第三套 maintained pack。branch-local status / queue / change-log 也已同步这条 owner 结论。

- [x] **Step 3: If public is migrated away, satisfy the deletion gate before removal**

Only remove `public/script-editor-templates/zhuyuanzhang/**` if the loader, tests, and publication strategy have already been updated and verified.

Current result: `public/script-editor-templates/zhuyuanzhang/**` physical root 与 `/script-editor-templates/zhuyuanzhang/pack.json` legacy manifest URL 都已退役；默认模板 URL、目录导入 / runtime preview 回归、以及 publication sync strategy 都已切到 `public/builtin-script-editor-templates/zhuyuanzhang/**` 并通过验证。

- [x] **Step 4: Sync progress and governance state**

Update the plan with the chosen outcome so later resumes know whether public was retained, migrated, or deleted.

## Task 5: Final Verification And Handoff

**Files:**
- Modify: `docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md`

- [x] **Step 1: Run the required verification set**

Run:

```bash
pnpm run lint:plans
pnpm run build:test
node --test tests/script-editor-template-url.test.cjs tests/script-editor-runtime-preview-compat.test.cjs tests/zhuyuanzhang-source-unification.test.cjs
pnpm run typecheck
pnpm run build
```

Expected:

- `PASS`

- [x] **Step 2: Confirm the user-facing invariants remain true**

Recheck that `开始游戏` UI flow, `角色选择 -> 地图` visible order, and `使用模板 -> 运行预览` behavior remain unchanged.

Current result: `script-editor-runtime-preview-compat`、`startup-session-coordinator`、`scenario-preview-sanitizer`、`navigation-time-follow-up` 与 startup owner robustness 子集都已通过；本轮 source-unification 未重新打开 startup drift，仍维持“开始游戏 / 运行预览”已冻结对齐的 branch-local 结论。

- [x] **Step 3: Sync progress and governance state**

Update `Execution State`, append a `Progress Log` entry, and leave an explicit next action for follow-up work.

## Exit Check

- [x] `The repository has exactly two maintained zhuyuanzhang packs: builtin runtime pack and script-editor template pack.`
- [x] `Shared fields between those two maintained packs are governed by an explicit reproducible synchronization model.`
- [x] `The public template tree is no longer treated as a third maintained pack.`
- [x] `The public deletion question is resolved with a documented keep-or-delete gate rather than left ambiguous.`
- [x] `Current UI, feature behavior, and pre-merge scenario order/content remain unchanged.`
- [ ] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Scenario-Pack Source Unification`
- Parent Task: `Post-Merge Branch Stabilization`
- Parent Stage: `Post-Merge Branch Stabilization`
- Closeout Status: `closed`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `open-next-approved-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `success`
- Push Commit: `aaad59af`
- Resume From: `Open docs/superpowers/project-progress.md, then open the next approved runtime/event child from the pushed source-unification baseline.`
