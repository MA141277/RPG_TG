# Generic Meeting Review Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade generic meeting/review runtime that any building can mount through authored bindings, then migrate temple and keep review flows onto that shared mechanism without changing current UI shell, visible behavior, or story order.

**Architecture:** Introduce a new `meeting` subsystem that separates host shell ownership, generic meeting runtime ownership, and scenario-pack authored content ownership. Buildings remain hosts, the new meeting runtime owns stage progression and write-back, and scenario packs own meeting definitions, bindings, panels, choices, and declarative action sets.

**Tech Stack:** TypeScript runtime/application/domain modules, JSON scenario-pack content families, Node contract tests, `pnpm run build:test`, targeted `node --test`, `pnpm run typecheck`, `pnpm run build`, `pnpm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-04`
- Current Focus: `keep hosted review 已确认不再保留本地 keep-review session owner；temple covered path 的 assignment-table / reward / personnel / advice 投影继续压到 shared projected handoff 与单一 follow-up helper。现在 reward/personnel 的 hosted overlay-close 与 policy close 的 hosted advance seam 都已经显式收口。`
- Next Step: `继续压缩 temple 剩余 no-meeting fallback，并优先判断在 reward/personnel/advice/policy 之后是否还存在新的 hosted/fallback 双 owner；若没有，下一刀转为证明剩余 seam 已是 no-meeting fallback only 的长期边界审计。`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-host-bridge.test.cjs` passed 3/3 after the bridge and shared session wiring landed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-runtime.test.cjs tests/meeting-host-bridge.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 4/4 after temple launch, display, advance, and hosted assignment settlement were routed through the hosted meeting path; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/keep-meeting-runtime-integration.test.cjs` passed 5/5 after keep launch, display, advance, summary-stage hosted rendering, and hosted assignment settlement were routed through the same host bridge; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-content-contract.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="story battle rescue flow opens battle demo scenario and returns to keep review|temple review" tests/robustness.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review" tests/robustness.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="keep review" tests/robustness.test.cjs` passed 2/2; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` still fails only on the unrelated historical file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` because it is missing the required top-level title heading.
- Notes: `This is a branch-local follow-up plan. docs/superpowers/project-progress.md currently points at an unrelated historical child, so this plan should not overwrite that canonical governance track unless the user explicitly promotes it.`

## Progress Log

- 2026-08-04
  - Summary: `Plan created from the approved generic meeting review module spec. Scope is production-grade generic meeting runtime plus temple/keep migration, while preserving current UI shell and story order.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed on unrelated historical governance file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.
  - Next: `Keep this plan in waiting state until execution is promoted; when work starts, begin Task 1 and continue recording the unrelated lint blocker unless the historical file is fixed separately.`
- 2026-08-04
  - Summary: `Task 1 landed the generic meeting content contracts and loader families: new meeting domain files define pack-facing authored shapes, scenario/content pack loaders now hydrate meetings plus bindings/panels/choice sets/action sets, and active game content exposes canonical meeting arrays with ById indexes for runtime consumers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-pack-loader.test.cjs` first failed with `pack.meetings?.[0]?.id === undefined`, then passed after the loader/content-contract changes; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-pack-loader.test.cjs tests/active-game-content-story-context.test.cjs` now passes 7/7 including file-import, override-merge, and `storyContent` meeting registry coverage; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` still fails only on unrelated historical file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.
  - Next: `start the generic meeting runtime state machine`
- 2026-08-04
  - Summary: `Task 2 landed the generic meeting runtime state machine: runtime start/advance semantics now live under src/application/meeting, presenter output bridges into the existing review overlay families, authored action stages can execute bounded shared review helpers without adding temple/keep-specific branches, and the runtime now enforces choice conditions plus transactional action-set validation.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-runtime.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs` first passed 23/23 after aligning the temple review UI contract test to the authored-text boundary, then passed 26/26 after adding action-set atomicity and choice-condition enforcement regressions; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` still fails only on unrelated historical file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.
  - Next: `wire the runtime into a reusable host bridge`
- 2026-08-04
  - Summary: `Task 3 landed the generic meeting host bridge and shared session wiring: host actions can resolve authored meeting bindings, house runtime now carries reusable runtime-owned shared session state alongside typed host session state, and completed meetings can clear themselves back to the correct host return target without adding new main.ts branches or a new shell layer.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-host-bridge.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-runtime.test.cjs tests/meeting-host-bridge.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` remains historically blocked only by `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.
  - Next: `migrate temple review to the generic meeting runtime`
- 2026-08-04
  - Summary: `Task 4 moved the temple review hosted path onto the generic meeting runtime without改动寺庙外壳：寺庙入口在 meeting 内容可用时会启动 shared meeting，会沿用现有寺庙壳子显示共享会议的对话/弹层/选项，并把 advance/assignment-table/policy-panel/choice 这几类动作交给 hosted meeting owner 处理；非评定路径如 work、donate、leave、rest、begging 仍保持当前 owner。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-content-contract.test.cjs tests/meeting-host-bridge.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/house-module-pack-event-runtime.test.cjs tests/temple-pack-event-work-bridge.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple" tests/robustness.test.cjs` passed 30/30.
  - Next: `either continue with keep review migration or remove the remaining temple-local review fallback once authored meeting parity is confirmed`
- 2026-08-04
  - Summary: `Task 5 moved keep review onto the same generic meeting runtime: keep review now launches/resumes/completes through the shared host bridge, hosted meeting UI no longer falls back to legacy intro dialogue during summary stages, and the story-battle return path still re-enters keep review through the hosted owner.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/keep-meeting-runtime-integration.test.cjs` first failed 1/4 on the new summary-stage red test, then passed 4/4 after shared presenter/host fallback convergence; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 3/3 after the same host-fallback tightening; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-content-contract.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="story battle rescue flow opens battle demo scenario and returns to keep review" tests/robustness.test.cjs` passed 1/1.
  - Next: `continue temple/keep review legacy compatibility cleanup without reintroducing a second stage owner`
- 2026-08-04
  - Summary: `继续收口 hosted meeting 的最终委任结算：新增共享 handoff helper，把帅府 assign-keep-task 和寺庙 temple-review-assign-* 这两类最终选择统一回流到现有宿主结算 helper，同时在 handoff 后立即清掉 shared meeting 会话，保证当前结果 UI、任务写入和工作计划写入不回退。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/keep-meeting-runtime-integration.test.cjs tests/temple-meeting-runtime-integration.test.cjs` first failed 2/9 on the new handoff red tests, then passed 9/9 after adding the hosted settlement handoff seam; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-content-contract.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="story battle rescue flow opens battle demo scenario and returns to keep review|temple review" tests/robustness.test.cjs` passed 6/6.
  - Next: `梳理 temple/keep 里仍仅服务于 review fallback 的本地 meetingStage 分支，决定下一批可以整体删除的兼容代码`
- 2026-08-04
  - Summary: `继续把 temple/keep 的评议兼容 owner 收口到单入口 fallback：帅府已先落到 handleLegacyKeepReviewFallback(...)，这次又把寺庙评议在 handleAction(...) 里的 advance/advice/assignment-table/policy-panel/assigned-reward-personnel close/assign-work 这些重复分支迁到 handleLegacyTempleReviewFallback(...)，让 hosted meeting 之后的 review fallback 只剩一处入口。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review" tests/robustness.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="keep review" tests/robustness.test.cjs` passed 2/2.
  - Next: `盘点 temple/keep 剩余 legacy review helper 与宿主结算依赖，决定下一批是整段删除本地 fallback，还是把最后几段 settlement / authored 内容继续下放到 shared meeting / 剧本包`
- 2026-08-04
  - Summary: `按“评议系统整体收口任务”冻结了 owner 范围：新增 docs/superpowers/specs/2026-08-04-review-owner-inventory.md，把 keep/temple 当前剩余的入口 owner、阶段 owner、结算 seam、内容 owner、legacy fallback 全量列清；同时先删掉 keep 已失效的本地评议类型面和本地 overlay 视图分支，让 keep 只保留宿主壳、任务写回和 assigned 收尾。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs tests/keep-meeting-runtime-integration.test.cjs` passed 10/10; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review|keep review" tests/robustness.test.cjs` passed 7/7; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/keep-meeting-runtime-integration.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="keep review" tests/robustness.test.cjs` passed 2/2.
  - Next: `以 keep 的 assigned 收尾为边界判断 Task B 是否可视为完成，然后开始把 temple assignment/reward/personnel/praise 这组正式 owner 往 shared review / shared meeting 下放`
- 2026-08-04
  - Summary: `继续推进 temple review 长链 shared owner：在保留当前 UI、功能和顺序不变的前提下，temple 的 hosted covered path 现在已经不只到 reward/personnel/praise，而是继续在 shared meeting owner 下贯穿 praise / situation / policy / advice / assign-duty；其中 assign-duty 的动态台词和差事按钮通过 hosted stage handoff 注入 shared presenter，而不是重新回退到宿主 action owner。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs tests/keep-meeting-runtime-integration.test.cjs && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review|keep review" tests/robustness.test.cjs` passed.
  - Next: `更新 owner inventory，确认 temple 当前只剩 assigned 收尾和若干 no-meeting fallback 还在宿主，再决定下一刀是继续把 assigned 壳并入 shared summary/complete，还是把它明确留成 settlement seam`
- 2026-08-04
  - Summary: `用户已确认把 temple 的 assigned 结果壳正式定性为宿主 settlement seam：submitReviewWorkPlan(...) 继续拥有工作计划写回、story stage/week/countdown 写回，以及 assigned 结果壳 closeout；后续默认不再把这层纳入 shared meeting summary/complete 收口范围。`
  - Verification: `No behavior change in this slice; classification/docs/code-comment update only.`
  - Next: `继续收窄 temple reward/personnel/praise 相关 stage/settlement seam，避免再把 assigned 结果壳作为共享化目标反复讨论`
- 2026-08-04
  - Summary: `继续收窄 temple 的双 owner：当 shared meeting 的 meeting.temple.review 已激活时，handleAction(...) 不再回落到 handleLegacyTempleReviewFallback(...)，避免 stray legacy action 在 hosted covered path 期间偷偷改动宿主本地评议状态；同时新增集成测试锁住这条边界。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 6/6 after adding the hosted-owner isolation regression; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review" tests/robustness.test.cjs` passed 5/5.
  - Next: `继续处理 temple reward/personnel/praise 这些仍需通过宿主 stage/settlement seam 投影回 shared meeting 的残留点`
- 2026-08-04
  - Summary: `继续收窄 temple 的 reward/personnel/praise seam：`settleTempleReviewAssignmentTable(...)`、`createTemplePersonnelOrPraiseProjection(...)`、`createTemplePraiseProjection(...)` 现在统一返回“宿主结算 + shared meeting 投影结果”，不再返回本地评议 session 再由调用方二次拼装，从而把这组三段从“本地评议状态机转场”明确收口为“宿主结算 seam + shared owner 投影”。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review" tests/robustness.test.cjs` passed 5/5.
  - Next: `继续压缩 temple 剩余 no-meeting fallback 与 projectTempleHostedReviewStage(...) / meeting-host-stage-handoff.ts 这两层 seam 的长期保留范围`
- 2026-08-04
  - Summary: `继续把 shared meeting owner 往正式 seam 收口：meeting-host-stage-handoff 新增了 projected stage handoff helper，temple review 的 assignment-table / reward / personnel / advice 这四段 hosted 投影现在共用同一类 shared handoff，而 keep review 进入 hosted meeting 时也不再额外保留本地 keep-review session 起点。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-host-stage-handoff.test.cjs tests/temple-meeting-runtime-integration.test.cjs tests/keep-meeting-runtime-integration.test.cjs` passed 15/15.
  - Next: `继续处理 temple 剩余 no-meeting fallback，并审视 projectTempleHostedReviewStage(...) 是否还能进一步下沉为更正式的 shared stage capability。`
- 2026-08-04
  - Summary: `继续做 temple review 的窄切片 owner 收缩：`projectTempleHostedReviewStage(...)` 与 `handleLegacyTempleReviewFallback(...)` 不再分别持有 praise 后续的 policy/advice projection seed，改为共用 `createTempleReviewPraiseFollowupProjectionSeed(...)` 这一处宿主 helper，只压缩 no-meeting fallback 与 stage projection seam，不碰 keep、startup、main.ts 或 assigned settlement seam。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review praise follow-up projection is owned by one helper across hosted and fallback paths" tests/robustness.test.cjs` first failed because `createTempleReviewPraiseFollowupProjectionSeed(...)` did not exist, then passed after the extraction; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 --test-name-pattern="temple review|temple house review|global NPC interaction does not append default choices to temple review work assignment|temple review praise follow-up projection is owned by one helper across hosted and fallback paths" tests/robustness.test.cjs` passed 9/9.`
  - Next: `继续检查 reward / personnel 之后的 no-meeting fallback 与 hosted projection 是否还残留类似双 owner 的 follow-up seed，可在不碰 settlement seam 的前提下继续缩到单一 helper。`
- 2026-08-04
  - Summary: `继续把 temple review 的双 owner 往单 helper 收：`advice -> assign-duty` 这段后续投影不再由 hosted handoff 和 no-meeting fallback 各自拼装响应文案、special-task 文案和差事列表，而是统一收口到 `createTempleReviewAdviceFollowupProjection(...)`，只压缩 shared meeting covered path 与 legacy fallback 之间的重复 owner，不碰 assigned settlement seam。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 --test-name-pattern "temple review advice follow-up projection is owned by one helper across hosted and fallback paths" tests/robustness.test.cjs` first failed because `createTempleReviewAdviceFollowupProjection(...)` did not exist, then passed after the extraction; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 --test-name-pattern "temple review|temple house review|temple review advice follow-up projection is owned by one helper across hosted and fallback paths" tests/robustness.test.cjs` passed 11/11.`
  - Next: `继续审视 assignment-table / reward / personnel 之后还有没有类似 advice follow-up 这种仍由 hosted path 与 fallback 双写的投影缝；若没有，再决定下一刀是继续压缩 no-meeting fallback，还是把更正式的 stage capability 往 shared meeting 下沉。`
- 2026-08-04
  - Summary: `继续压缩 temple review 的 hosted seam 重复面：`handleAction(...)` 里原先分开的 `hostedRewardStageHandoff` / `hostedPersonnelStageHandoff` 两段 overlay-close 投影接线，现已收口成同一个 `hostedOverlayCloseHandoff(...)` 本地 seam helper；这一步不改 reward/personnel 结算 owner，只去掉 hosted path 内部的重复 stage wiring。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 --test-name-pattern "temple review hosted reward and personnel overlay-close handoff uses one seam helper|temple review reward and personnel overlay-close follow-up projection is owned by one helper across hosted and fallback paths" tests/robustness.test.cjs` first failed because `hostedOverlayCloseHandoff(...)` did not exist, then passed after the refactor and structure-test sync; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 --test-name-pattern "temple review|temple house review|temple review hosted reward and personnel overlay-close handoff uses one seam helper" tests/robustness.test.cjs` passed 12/12.`
  - Next: `继续寻找 temple review 剩余 hosted/fallback 或 stage wiring 的单点 seam；若已没有类似 reward/personnel hosted wiring 这种重复面，再回到 no-meeting fallback 的长期保留范围审计。`
- 2026-08-04
  - Summary: `继续把 temple review 的剩余边界从“潜在双 owner”收成“显式 fallback only 审计点”：这次没有再新增 hosted stage handoff，而是把 hosted `policy` close 明确归到 `isTempleHostedMeetingAdvanceAction(...)` 这一条统一 advance seam，并新增结构回归锁定 `close-review-policy-panel` 的显式动作分支现在只剩 `handleLegacyTempleReviewFallback(...)` 持有。`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 --test-name-pattern "temple review policy close remains fallback-only while hosted path uses one advance seam" tests/robustness.test.cjs` first failed because `isTempleHostedMeetingAdvanceAction(...)` did not exist, then passed after the extraction; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test --test-concurrency=1 --test-name-pattern "temple review policy close remains fallback-only while hosted path uses one advance seam|temple review policy plan popup closes into advice without opening a second plan popup|temple review" tests/robustness.test.cjs` passed 10/10.`
  - Next: `若继续审视 temple review 的剩余 seam，优先确认当前显式动作分支里还有没有类似 policy close 这种“hosted 已归通用 advance，显式 owner 只剩 fallback”的边界；如果没有，就把下一批定位成 no-meeting fallback only 的长期保留范围审计。`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-04-generic-meeting-review-module-design.md`
- Related prior spec:
  - `docs/superpowers/specs/2026-07-24-faction-review-flow-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Temple work / donate / leave / review entry front doors already moved partway toward building-container-item -> pack event / pack dialogue seams, so the meeting migration can reuse that boundary instead of adding a new entry shim.`
  - `The repository already contains shared review helper contracts under src/application/review/* and src/domain/review.ts, but temple and keep still own separate review state machines inside their house modules.`
  - `The current branch already treats preserving UI shell and story order as a hard requirement; this plan therefore migrates owner/mechanism first and explicitly does not redesign the visible meeting shell.`

## Implementation Scope

### In Scope

- Add a generic meeting domain/runtime contract that can be launched from any building/location binding.
- Add authored meeting pack families and loader wiring for meetings, bindings, panels, choice sets, and action sets.
- Route temple review and keep review through the generic meeting runtime while preserving current shell and visible flow.
- Keep reward, assignment, policy, advice, and personnel settlement inside shared runtime/application seams rather than concrete house modules.
- Add regression coverage for pack loading, meeting stage execution, and temple/keep host integration.

### Still Out Of Scope

- Redesigning the temple or keep visual shell.
- Rewriting every existing story/dialogue flow into meeting content in one child.
- Converting non-review building actions such as temple donation, rest, work QTE, or unrelated house loops.
- Deleting all legacy temple/keep review helpers before the new runtime is proven by migration tests.

## File Map

### Existing files to modify

- `src/domain/content-pack.ts`
  - Add generic meeting content families to the scenario/content pack contract.
- `src/application/scenario/scenario-pack-loader.ts`
  - Load authored meeting JSON families and validate canonical file names.
- `src/application/content/content-pack-loader.ts`
  - Mirror generic meeting family loading for non-scenario content packs.
- `src/application/content/active-game-content.ts`
  - Expose loaded meeting definitions, bindings, panels, choices, and action sets to runtime consumers.
- `src/domain/review.ts`
  - Narrow shared review helpers so they plug into the generic meeting runtime instead of concrete house-only flows.
- `src/application/review/*`
  - Reuse or extend existing rank / assignment / policy / reward helpers for the meeting runtime.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Remove the temple-owned review state machine and replace it with host launch / resume / return integration.
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - Remove the keep-owned review state machine and replace it with the same host integration seam.
- `src/core/runtime/house-runtime.ts`
  - Carry active meeting session state through the host runtime boundary if it becomes part of house session ownership.
- `src/domain/house-module.ts`
  - Extend shared input/result/session contracts if hosts need a typed active meeting payload.
- `src/ui/views/house/house-shared-view.ts`
  - Reuse current review overlays and, if necessary, add a generic meeting presenter-to-house mapping.
- `docs/special-house-interface.md`
  - Record the new meeting host boundary if house modules delegate meeting flow to the shared meeting runtime.
- `docs/change-log.md`
  - Record the shared generic meeting runtime introduction and temple/keep migration.
- `docs/superpowers/plans/2026-08-04-generic-meeting-review-module-plan.md`
  - Update execution state, progress log, verification, and closeout as work proceeds.

### New files to create

- `src/domain/meeting/meeting-definition.ts`
  - Stable authored meeting definition types.
- `src/domain/meeting/meeting-session.ts`
  - Session state, host context, stage status, and completion contracts.
- `src/domain/meeting/meeting-stage.ts`
  - Stage type vocabulary and authored stage shape.
- `src/domain/meeting/meeting-binding.ts`
  - Binding contracts for host entrypoints.
- `src/domain/meeting/meeting-panel.ts`
  - Structured panel/summary definitions.
- `src/domain/meeting/meeting-choice-set.ts`
  - Choice set and choice option contracts.
- `src/domain/meeting/meeting-action-set.ts`
  - Declarative authored write-back action contracts.
- `src/application/meeting/meeting-runtime.ts`
  - Core generic meeting state machine.
- `src/application/meeting/meeting-host-bridge.ts`
  - Launch/resume/complete bridge between building hosts and the generic meeting runtime.
- `src/application/meeting/meeting-presenter.ts`
  - Convert meeting runtime state into generic presenter/view-model data.
- `src/application/meeting/meeting-action-runtime.ts`
  - Execute declarative meeting action sets through shared runtime helpers.
- `tests/meeting-pack-loader.test.cjs`
  - Contract coverage for authored meeting families.
- `tests/meeting-runtime.test.cjs`
  - Core meeting state machine coverage.
- `tests/meeting-host-bridge.test.cjs`
  - Host launch/resume/return coverage.
- `tests/temple-meeting-runtime-integration.test.cjs`
  - Temple migration coverage.
- `tests/keep-meeting-runtime-integration.test.cjs`
  - Keep migration coverage.

## Verification Plan

- Targeted verification:
  - `node --test --test-concurrency=1 tests/meeting-pack-loader.test.cjs tests/meeting-runtime.test.cjs tests/meeting-host-bridge.test.cjs tests/temple-meeting-runtime-integration.test.cjs tests/keep-meeting-runtime-integration.test.cjs`
  - `node --test --test-concurrency=1 tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs`
  - `node --test --test-name-pattern "temple review|keep review|meeting runtime|review-assignment-table|review policy panel" tests/robustness.test.cjs`
- Required commands:
  - `pnpm run lint:plans`
  - `pnpm run build:test`
  - `pnpm run typecheck`
  - `pnpm run build`

## Task 1: Define Generic Meeting Content Contracts And Loader Families

**Files:**
- Create: `src/domain/meeting/meeting-definition.ts`
- Create: `src/domain/meeting/meeting-session.ts`
- Create: `src/domain/meeting/meeting-stage.ts`
- Create: `src/domain/meeting/meeting-binding.ts`
- Create: `src/domain/meeting/meeting-panel.ts`
- Create: `src/domain/meeting/meeting-choice-set.ts`
- Create: `src/domain/meeting/meeting-action-set.ts`
- Modify: `src/domain/content-pack.ts`
- Modify: `src/application/scenario/scenario-pack-loader.ts`
- Modify: `src/application/content/content-pack-loader.ts`
- Modify: `src/application/content/active-game-content.ts`
- Test: `tests/meeting-pack-loader.test.cjs`

- [x] **Step 1: Write the failing loader contract test for new meeting families**

Add a focused red test in `tests/meeting-pack-loader.test.cjs` that expects a pack to load authored meeting families and expose them through active content:

```js
test("scenario pack loader exposes authored meeting families to active content", () => {
  const files = new Map([
    ["pack.json", JSON.stringify({
      id: "pack.test.meeting",
      title: "Meeting Pack",
      files: {
        meetings: "meetings.json",
        meetingBindings: "meeting-bindings.json",
        meetingPanels: "meeting-panels.json",
        meetingChoiceSets: "meeting-choice-sets.json",
        meetingActionSets: "meeting-action-sets.json",
      },
    })],
    ["meetings.json", JSON.stringify([{ id: "meeting.temple.review", initialStageId: "intro", stageIds: ["intro"], stagesById: { intro: { id: "intro", type: "dialogue", dialogueId: "scene.temple.review" } } }])],
    ["meeting-bindings.json", JSON.stringify([{ id: "binding.temple.review", meetingId: "meeting.temple.review", owner: { family: "building", id: "house.kulan.temple" }, trigger: { action: "building-container-item-action", itemId: "review" } }])],
    ["meeting-panels.json", JSON.stringify([])],
    ["meeting-choice-sets.json", JSON.stringify([])],
    ["meeting-action-sets.json", JSON.stringify([])],
  ]);

  const pack = loadScenarioPackFromFiles({
    readFile: (path) => files.get(path) ?? null,
    entryFileName: "pack.json",
  });

  assert.equal(pack.meetings?.[0]?.id, "meeting.temple.review");
  assert.equal(pack.meetingBindings?.[0]?.id, "binding.temple.review");
});
```

- [x] **Step 2: Run the meeting pack loader test and verify it fails**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-pack-loader.test.cjs
```

Expected:

- `FAIL`
- missing `meetings` / `meetingBindings` / related manifest family support in the loaders or content-pack contract

- [x] **Step 3: Add stable meeting domain contracts**

Create focused domain files with concrete authored shapes:

```ts
// src/domain/meeting/meeting-stage.ts
export type MeetingStageType =
  | "dialogue"
  | "summary"
  | "policy-panel"
  | "choice"
  | "assignment-table"
  | "reward"
  | "personnel-update"
  | "action"
  | "branch";

export type MeetingStageDefinition = {
  id: string;
  type: MeetingStageType;
  dialogueId?: string | undefined;
  textLineIds?: string[] | undefined;
  panelId?: string | undefined;
  choiceSetId?: string | undefined;
  actionSetId?: string | undefined;
  nextStageId?: string | undefined;
};
```

```ts
// src/domain/meeting/meeting-definition.ts
import type { MeetingStageDefinition } from "./meeting-stage";

export type MeetingDefinition = {
  id: string;
  hostScope: {
    family: "building" | "city" | "organization" | "faction";
    templateId?: string | undefined;
  };
  initialStageId: string;
  stageIds: string[];
  stagesById: Record<string, MeetingStageDefinition>;
  completion?: {
    type: "return-to-host" | "follow-up-event" | "start-map-auto-advance";
  } | undefined;
};
```

- [x] **Step 4: Extend content-pack and loaders with meeting families**

Update the content contract and loaders so the new families are first-class:

```ts
// src/domain/content-pack.ts
import type { MeetingDefinition } from "./meeting/meeting-definition";
import type { MeetingBindingDefinition } from "./meeting/meeting-binding";
import type { MeetingPanelDefinition } from "./meeting/meeting-panel";
import type { MeetingChoiceSetDefinition } from "./meeting/meeting-choice-set";
import type { MeetingActionSetDefinition } from "./meeting/meeting-action-set";

export type ContentPackDefinition = {
  // existing fields...
  meetings?: MeetingDefinition[] | undefined;
  meetingBindings?: MeetingBindingDefinition[] | undefined;
  meetingPanels?: MeetingPanelDefinition[] | undefined;
  meetingChoiceSets?: MeetingChoiceSetDefinition[] | undefined;
  meetingActionSets?: MeetingActionSetDefinition[] | undefined;
};
```

```ts
// loader manifest support shape
files: {
  meetings?: string;
  meetingBindings?: string;
  meetingPanels?: string;
  meetingChoiceSets?: string;
  meetingActionSets?: string;
}
```

- [x] **Step 5: Expose the loaded meeting families through active content**

Add canonical arrays and `ById` indexes in `src/application/content/active-game-content.ts`:

```ts
const meetingDefinitions = resolvedPack.meetings ?? [];
const meetingDefinitionsById = indexById(meetingDefinitions);
const meetingBindings = resolvedPack.meetingBindings ?? [];
const meetingPanelsById = indexById(resolvedPack.meetingPanels ?? []);
const meetingChoiceSetsById = indexById(resolvedPack.meetingChoiceSets ?? []);
const meetingActionSetsById = indexById(resolvedPack.meetingActionSets ?? []);
```

Then expose them in the returned active content context so runtime code can consume them without reopening pack files.

- [x] **Step 6: Rerun the meeting pack loader test and make it pass**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-pack-loader.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 7: Commit the content-contract slice**

Run:

```bash
git add src/domain/content-pack.ts src/domain/meeting src/application/scenario/scenario-pack-loader.ts src/application/content/content-pack-loader.ts src/application/content/active-game-content.ts tests/meeting-pack-loader.test.cjs
git commit -m "feat: add generic meeting content pack contracts"
```

- [x] **Step 8: Sync progress and governance state**

Update this plan’s `Execution State` and `Progress Log` with:

- current focus: `meeting content contracts and loader families landed`
- verification summary: the exact test command and result
- next step: `start the generic meeting runtime state machine`

## Task 2: Build The Generic Meeting Runtime State Machine

**Files:**
- Create: `src/application/meeting/meeting-runtime.ts`
- Create: `src/application/meeting/meeting-presenter.ts`
- Create: `src/application/meeting/meeting-action-runtime.ts`
- Modify: `src/application/review/*`
- Test: `tests/meeting-runtime.test.cjs`

- [x] **Step 1: Write the failing generic meeting runtime tests**

Add red tests for:

- start meeting at `initialStageId`
- advance a `dialogue` stage to its `nextStageId`
- keep a `policy-panel` visible through the next advice prompt
- execute a `choice` stage and jump to the chosen next stage
- execute an `action` stage and write back shared review state

Example skeleton:

```js
test("meeting runtime starts at the authored initial stage", () => {
  const result = startMeetingSession({
    meetingDefinition: createMeetingDefinition(),
    hostContext: createHostContext(),
    gameState: createState(),
    characterDefinitions: createCharacters(),
  });

  assert.equal(result.sessionState?.currentStageId, "intro");
  assert.equal(result.sessionState?.status, "running");
});
```

```js
test("meeting runtime keeps the policy panel visible while entering the advice prompt", () => {
  const running = createRunningMeetingAtPolicyStage();
  const result = advanceMeetingSession(running);

  assert.equal(result.sessionState?.currentStageId, "advice");
  assert.equal(result.presenterModel?.overlay?.type, "review-policy-panel");
});
```

- [x] **Step 2: Run the meeting runtime test file and verify it fails**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-runtime.test.cjs
```

Expected:

- `FAIL`
- missing `startMeetingSession` / `advanceMeetingSession` / presenter support

- [x] **Step 3: Add the generic meeting runtime core**

Implement a focused runtime API:

```ts
export function startMeetingSession(input: StartMeetingSessionInput): MeetingRuntimeResult {
  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      meetingId: input.meetingDefinition.id,
      hostContext: input.hostContext,
      currentStageId: input.meetingDefinition.initialStageId,
      visitedStageIds: [input.meetingDefinition.initialStageId],
      selectedChoiceIds: [],
      derivedState: {},
      overlayState: null,
      status: "running",
    },
  };
}
```

```ts
export function advanceMeetingSession(input: AdvanceMeetingSessionInput): MeetingRuntimeResult {
  const stage = readCurrentMeetingStage(input);
  if (stage.type === "dialogue") {
    return moveToNextMeetingStage(input, stage.nextStageId);
  }
  if (stage.type === "action") {
    return runMeetingActionStage(input, stage);
  }
  return input.current;
}
```

- [x] **Step 4: Build a presenter bridge from meeting stage state to existing review overlay families**

In `src/application/meeting/meeting-presenter.ts`, return typed models that current house UI can consume:

```ts
export function createMeetingPresenterModel(input: CreateMeetingPresenterModelInput) {
  const stage = readCurrentMeetingStage(input);
  if (stage.type === "assignment-table") {
    return {
      overlay: {
        type: "review-assignment-table",
        title: input.panel.title,
        rows: input.assignmentRows,
        confirmActionId: "close-review-assignment-table",
        confirmLabel: input.panel.confirmLabel,
      },
    };
  }
  if (stage.type === "policy-panel") {
    return {
      overlay: {
        type: "review-policy-panel",
        title: input.policy.title,
        policy: input.policy.panel,
        closeActionId: "close-review-policy-panel",
        closeLabel: input.policy.closeLabel,
      },
    };
  }
  return { overlay: null };
}
```

- [x] **Step 5: Route authored action stages through shared review/runtime helpers**

In `src/application/meeting/meeting-action-runtime.ts`, keep the action vocabulary bounded and explicit:

```ts
export function runMeetingActionSet(input: RunMeetingActionSetInput): MeetingRuntimeResult {
  let nextState = input.gameState;
  let nextCharacters = input.characterDefinitions;

  for (const action of input.actionSet.actions) {
    if (action.type === "set-flag") {
      nextState = writeMeetingFlag(nextState, action.key, action.value);
      continue;
    }
    if (action.type === "grant-review-reward") {
      ({ gameState: nextState, characterDefinitions: nextCharacters } =
        applyReviewItemReward({ gameState: nextState, characterDefinitions: nextCharacters, rewardId: action.rewardId }));
      continue;
    }
  }

  return {
    gameState: nextState,
    characterDefinitions: nextCharacters,
    sessionState: input.sessionState,
  };
}
```

- [x] **Step 6: Rerun meeting runtime tests and make them pass**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-runtime.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 7: Commit the generic meeting runtime slice**

Run:

```bash
git add src/application/meeting src/application/review src/domain/meeting tests/meeting-runtime.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs
git commit -m "feat: add generic meeting runtime"
```

- [x] **Step 8: Sync progress and governance state**

Update this plan with the exact test output and set the next step to `wire the runtime into a reusable host bridge`.

## Task 3: Add A Generic Host Bridge And Shared Session Wiring

**Files:**
- Create: `src/application/meeting/meeting-host-bridge.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Test: `tests/meeting-host-bridge.test.cjs`

- [x] **Step 1: Write the failing host-bridge tests**

Add tests that prove:

- a host can launch a meeting from a `review` binding
- the meeting session can resume through the host runtime boundary
- a completed meeting returns to the correct host target

Example:

```js
test("meeting host bridge launches a bound meeting and returns a running session", () => {
  const result = launchMeetingFromHostAction({
    actionId: "review",
    hostContext: createTempleHostContext(),
    meetingBindings,
    meetingDefinitionsById,
    gameState: createState(),
    characterDefinitions: createCharacters(),
  });

  assert.equal(result.sessionState?.meetingId, "meeting.temple.review");
  assert.equal(result.sessionState?.status, "running");
});
```

- [x] **Step 2: Run the host-bridge tests and verify they fail**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-host-bridge.test.cjs
```

Expected:

- `FAIL`
- missing host bridge / session wiring

- [x] **Step 3: Extend shared host session contracts to carry active meetings**

Update `src/domain/house-module.ts` and `src/core/runtime/house-runtime.ts` so a host can carry meeting-owned state without turning the host back into the meeting owner:

```ts
export type HouseModuleBaseInput<ModuleId extends HouseModuleId = HouseModuleId> = {
  // existing fields...
  meetingDefinitionsById?: Record<string, MeetingDefinition> | undefined;
  meetingBindings?: MeetingBindingDefinition[] | undefined;
  meetingPanelsById?: Record<string, MeetingPanelDefinition> | undefined;
  meetingChoiceSetsById?: Record<string, MeetingChoiceSetDefinition> | undefined;
  meetingActionSetsById?: Record<string, MeetingActionSetDefinition> | undefined;
};
```

- [x] **Step 4: Implement a reusable launch/resume/complete host bridge**

In `src/application/meeting/meeting-host-bridge.ts`, centralize host integration:

```ts
export function launchMeetingFromHostAction(input: LaunchMeetingFromHostActionInput): MeetingHostBridgeResult {
  const binding = resolveMeetingBindingForHostAction(input);
  if (binding == null) {
    return { handled: false, gameState: input.gameState, characterDefinitions: input.characterDefinitions, sessionState: input.sessionState };
  }

  return {
    handled: true,
    ...startMeetingSession({
      meetingDefinition: input.meetingDefinitionsById[binding.meetingId],
      hostContext: input.hostContext,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
    }),
  };
}
```

- [x] **Step 5: Reuse current shared house rendering instead of adding a new shell**

Adapt the house shared view to consume meeting presenter output through existing dialogue/action/overlay models:

```ts
const meetingPresenterModel = input.sessionState?.meetingSession != null
  ? createMeetingPresenterModel(...)
  : null;

const overlay = meetingPresenterModel?.overlay ?? existingOverlay;
const dialogue = meetingPresenterModel?.dialogue ?? existingDialogue;
const actionContainer = meetingPresenterModel?.actionContainer ?? existingActions;
```

- [x] **Step 6: Rerun the host-bridge tests and make them pass**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-host-bridge.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 7: Commit the host-bridge slice**

Run:

```bash
git add src/application/meeting/meeting-host-bridge.ts src/domain/house-module.ts src/core/runtime/house-runtime.ts src/ui/views/house/house-shared-view.ts tests/meeting-host-bridge.test.cjs
git commit -m "feat: add meeting host bridge"
```

- [x] **Step 8: Sync progress and governance state**

Record the verification and set the next step to `migrate temple review to the generic meeting runtime`.

## Task 4: Migrate Temple Review To The Generic Meeting Runtime

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/*.json` meeting-related pack files
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/*.json` meeting-related template files
- Modify: `tools/sync-zhuyuanzhang-startup-templates.mjs`
- Modify: `tools/zhuyuanzhang-source-sync-contract.mjs`
- Test: `tests/temple-meeting-runtime-integration.test.cjs`
- Test: `tests/house-module-pack-event-runtime.test.cjs`
- Test: `tests/temple-pack-event-work-bridge.test.cjs`

- [x] **Step 1: Write the failing temple migration tests**

Cover:

- temple review launch now uses the generic meeting runtime
- current temple review entry still shows the same intro/opening sequence
- assignment table, policy panel, advice, and assignment choices still appear in the same visible order
- leaving the temple review path does not break temple work/donate/leave paths

Example:

```js
test("temple review host launches the generic meeting runtime while preserving the current intro order", () => {
  const enterResult = templeHouseHouseModule.enter(createTempleMeetingInput());

  assert.equal(enterResult.sessionState?.meetingSession?.meetingId, "meeting.temple.review");
  assert.deepEqual(enterResult.sessionState?.meetingSession?.visitedStageIds, ["intro"]);
  assert.deepEqual(readVisibleTempleReviewLines(enterResult), ["自定义寺评开场一。", "自定义寺评开场二。"]);
});
```

- [x] **Step 2: Run temple migration tests and verify they fail**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/temple-pack-event-work-bridge.test.cjs
```

Expected:

- `FAIL`
- temple review still owned by house-local meeting branches

- [x] **Step 3: Author temple review into meeting pack content**

Create authored meeting content in zhuyuanzhang pack files with explicit stage order:

```json
{
  "id": "meeting.temple.review",
  "hostScope": { "family": "building", "templateId": "house.template.temple" },
  "initialStageId": "intro",
  "stageIds": ["intro", "assignment-table", "praise", "situation", "policy", "advice", "assign-duty", "reward", "personnel", "complete"],
  "stagesById": {
    "intro": { "id": "intro", "type": "dialogue", "dialogueId": "scene.building.template.house.temple.review" },
    "assignment-table": { "id": "assignment-table", "type": "assignment-table", "panelId": "panel.temple.review.assignment", "nextStageId": "praise" },
    "policy": { "id": "policy", "type": "policy-panel", "panelId": "panel.temple.review.policy", "nextStageId": "advice" }
  },
  "completion": { "type": "return-to-host" }
}
```

- [x] **Step 4: Replace temple-owned review stage dispatch with host launch/resume**

In `temple-house-house-module.ts`, reduce review ownership to host responsibilities:

```ts
if (shouldStartMeeting) {
  return launchTempleReviewMeeting({
    ...input,
    hostContext: createTempleMeetingHostContext(input),
  });
}
```

```ts
if (sessionState.meetingSession != null) {
  return resumeTempleMeetingHost({
    ...input,
    sessionState,
  });
}
```

Delete or dead-path the old temple-local `meetingStage` review switch only after the new integration tests pass.

- [x] **Step 5: Keep temple non-review paths unchanged**

Retain current owner for:

- work
- donate
- leave
- rest
- begging submission

Only the review long chain should move in this task.

- [x] **Step 6: Rerun the temple migration verification and make it pass**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/temple-meeting-runtime-integration.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/temple-pack-event-work-bridge.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 7: Commit the temple migration slice**

Run:

```bash
git add src/application/house-modules/temple-house/temple-house-house-module.ts src/content/scenario-packs/zhuyuanzhang src/modules/script-editor/builtin-templates/zhuyuanzhang tools/sync-zhuyuanzhang-startup-templates.mjs tools/zhuyuanzhang-source-sync-contract.mjs tests/temple-meeting-runtime-integration.test.cjs tests/house-module-pack-event-runtime.test.cjs tests/temple-pack-event-work-bridge.test.cjs
git commit -m "feat: migrate temple review to meeting runtime"
```

- [ ] **Step 8: Sync progress and governance state**

Update the plan and explicitly note whether any temple legacy review compatibility still remains.

## Task 5: Migrate Keep Review To The Generic Meeting Runtime

**Files:**
- Modify: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: keep-related meeting pack files under `src/content/scenario-packs/zhuyuanzhang/`
- Modify: keep-related template pack files under `src/modules/script-editor/builtin-templates/zhuyuanzhang/`
- Test: `tests/keep-meeting-runtime-integration.test.cjs`
- Test: `tests/faction-review-domain.test.cjs`
- Test: `tests/faction-review-ui-contract.test.cjs`

- [x] **Step 1: Write the failing keep migration tests**

Add tests that prove:

- keep review also launches through the generic meeting runtime
- keep task access no longer depends on a keep-local review state machine
- current assignment/policy/advice ordering remains intact

Example:

```js
test("keep review host launches the generic meeting runtime while preserving current visible order", () => {
  const enterResult = keepHouseHouseModule.enter(createKeepMeetingInput());

  assert.equal(enterResult.sessionState?.meetingSession?.meetingId, "meeting.keep.review");
  assert.equal(enterResult.sessionState?.meetingSession?.currentStageId, "intro");
});
```

- [x] **Step 2: Run keep migration tests and verify they fail**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/keep-meeting-runtime-integration.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs
```

Expected:

- `FAIL`
- keep review still owned by the keep house module state machine

- [x] **Step 3: Author keep review into meeting content**

Mirror the temple migration pattern with keep-authored meeting content:

```json
{
  "id": "meeting.keep.review",
  "hostScope": { "family": "building", "templateId": "house.template.keep" },
  "initialStageId": "intro",
  "stageIds": ["intro", "assignment-table", "praise", "situation", "policy", "advice", "assign-task", "complete"],
  "stagesById": {
    "intro": { "id": "intro", "type": "dialogue", "dialogueId": "scene.building.template.house.keep.review" }
  },
  "completion": { "type": "return-to-host" }
}
```

- [x] **Step 4: Replace keep-owned review dispatch with the generic host bridge**

Apply the same host-only pattern as temple:

```ts
if (shouldStartKeepMeeting) {
  return launchKeepReviewMeeting({
    ...input,
    hostContext: createKeepMeetingHostContext(input),
  });
}
```

Remove the keep-local meeting switch only after the generic path is green.

- [x] **Step 5: Rerun keep migration verification and make it pass**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test && PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/keep-meeting-runtime-integration.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 6: Commit the keep migration slice**

Run:

```bash
git add src/application/house-modules/keep-house/keep-house-house-module.ts src/content/scenario-packs/zhuyuanzhang src/modules/script-editor/builtin-templates/zhuyuanzhang tests/keep-meeting-runtime-integration.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs
git commit -m "feat: migrate keep review to meeting runtime"
```

- [x] **Step 7: Sync progress and governance state**

Record whether any keep-only review compatibility remains and set the next step to final verification and docs.

## Task 6: Final Verification, Documentation, And Closeout

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-04-generic-meeting-review-module-plan.md`

- [x] **Step 1: Update shared docs for the new meeting host boundary**

Document the new generic meeting host rule:

```md
- house/building modules may delegate meeting/review execution to the shared meeting runtime
- host modules remain responsible for launch eligibility, host context, and safe return targets only
- authored meeting content must live in scenario-pack meeting families rather than concrete house-local state-machine branches
```

- [ ] **Step 2: Run the full required verification set**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-concurrency=1 tests/meeting-pack-loader.test.cjs tests/meeting-runtime.test.cjs tests/meeting-host-bridge.test.cjs tests/temple-meeting-runtime-integration.test.cjs tests/keep-meeting-runtime-integration.test.cjs tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node --test --test-name-pattern "temple review|keep review|meeting runtime|review-assignment-table|review policy panel" tests/robustness.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build
```

Expected:

- `PASS`
- if `pnpm run lint:plans` still fails due to a historical unrelated governance file, record the exact blocker in the latest progress log and keep the child open

- [ ] **Step 3: Recheck user-facing invariants**

Confirm manually or through targeted tests that:

- temple review still appears in the current order
- keep review still appears in the current order
- current temple/keep UI shells are unchanged
- work/donate/leave/startup behaviors were not regressed by the meeting migration

- [ ] **Step 4: Commit documentation and verification updates**

Run:

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/plans/2026-08-04-generic-meeting-review-module-plan.md
git commit -m "docs: record generic meeting runtime migration"
```

- [ ] **Step 5: Sync progress and governance state**

Update:

- `Execution State`
- `Progress Log`
- `Verification`
- `Exit Check`
- `Completion Checklist`

Set status to:

- `completed-but-open` if implementation is done but push/closeout remains
- `blocked` if `lint:plans` or another required gate is still blocked by an external historical issue
- `closed` only after all closeout gates, including remote push, succeed

## Exit Check

- [ ] `A generic meeting runtime exists and is no longer temple- or keep-owned.`
- [ ] `Scenario packs can define meetings and bind them to arbitrary building/location actions.`
- [ ] `Temple review and keep review both run through the same meeting runtime.`
- [ ] `Building hosts no longer own full review/meeting stage machines.`
- [ ] `Current UI shell, feature behavior, and story order remain unchanged.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
