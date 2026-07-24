# 蓝图 Supervisor 正式开发分支备忘录

## 目的

记录 Blueprint `inspect --json` 与外部 `blueprint-supervisor` 原型的正式开发分支、对应 worktree、当前验证状态，以及后续安全接入开发母线的草稿方案。

本文件是备忘录草稿，不是主会话 Blueprint 治理真值，也不替代 candidate queue / version admission / active queue 文档。

## 正式开发分支与 Worktree 信息

- 正式开发分支：`codex/blueprint-supervisor-formal`
- 远端跟踪：`origin/codex/blueprint-supervisor-formal`
- 正式开发 worktree：
  - `D:/workspace/project/RPG_TG/.worktrees/blueprint-supervisor-formal`
- 已推送提交：
  - `d69c1070` `feat: add blueprint supervisor prototype for external stop enforcement`
  - `7bf4d7b` `fix: harden blueprint supervisor stop cue detection`
- 基线来源：`mod-first-dev`

## 当前用于备忘录同步的隔离分支与 Worktree

- 备忘录同步分支：`codex/blueprint-supervisor-memo-sync`
- 备忘录同步 worktree：
  - `D:/workspace/project/RPG_TG/.worktrees/blueprint-supervisor-memo-sync`
- 用途：
  - `只同步这份备忘录到开发母线，不承载 supervisor 正式实现接入`

## 这个正式开发分支当前做了什么

- 为 `tools/blueprint-version-governance.mjs` 增加 machine-readable `inspect --json`
- 暴露结构化工作流状态：
  - `activeVersionPlanPath`
  - `activeQueueId`
  - `activeTaskId`
  - `stopReason`
  - `stopBasis`
  - `nextUnblockedAction`
  - `humanInputRequired`
  - `stopAllowed`
- 新增 `tools/blueprint-supervisor.mjs`
  - 基于 Blueprint 真值判断当前应当 `continue` / `stop` / `illegal-stop`
- 新增并加固测试：
  - `tests/blueprint-version-governance.test.cjs`
  - `tests/blueprint-supervisor.test.cjs`

## 当前验证结果

- 已通过：`node tools/blueprint-version-governance.mjs inspect --json`
- 已通过：`node --test tests/blueprint-version-governance.test.cjs tests/blueprint-supervisor.test.cjs tests/blueprint-governance-lint.test.cjs tests/blueprint-skill-sync.test.cjs`
- 已通过：`npm.cmd run lint:blueprints`
- 已通过：`npm.cmd run blueprint:governance:check`

## 已知无关基线问题

- `npm.cmd run lint:blueprint-skill`
  - 曾在更早基线里因 `.codex/skills/blueprint-governance/SKILL.md` 与 Blueprint markers 不同步而失败
  - 当前是否仍失败，需以未来正式接入时的主线状态为准
- `npm.cmd test`
  - 曾存在与本分支无关的历史失败
  - 当前是否仍失败，需以未来正式接入时的主线状态为准

## 安全合入开发母线草稿

### 目标

在不打断当前主会话 active queue / active version 的前提下，把 `codex/blueprint-supervisor-formal` 的 supervisor 能力安全接入 `mod-first-dev`。

### 为什么现在不直接合

- 当前主会话仍在执行，进度未知
- 当前主会话所在 local checkout 工作树持续变动，live Blueprint 文档和业务改动尚未收束
- 此时直接 merge supervisor 分支，容易把主会话未完成改动、侧边会话草稿、以及 supervisor 原型接入混在一起

### 当前判断

- 该分支的正式提交差异主要集中在：
  - `tools/blueprint-version-governance.mjs`
  - `tools/blueprint-supervisor.mjs`
  - `tests/blueprint-version-governance.test.cjs`
  - `tests/blueprint-supervisor.test.cjs`
- 更适合在主会话收束到可识别节点后，于干净 worktree 中接入

### 安全前提

- 主会话当前 active queue 到达可识别收束点，避免混入未完成 live 改动
- 接入操作在干净 worktree 中完成，而不是在当前脏工作树中直接 merge
- 接入时先确认主线是否已自行修改以下文件：
  - `tools/blueprint-version-governance.mjs`
  - `tests/blueprint-version-governance.test.cjs`
  - 若有重叠，再决定 merge 或 cherry-pick

### 推荐接入方式

优先级从稳到快：

1. 在干净 worktree 上从 `mod-first-dev` 新开接入分支
2. 先尝试按提交顺序 cherry-pick：
   - `d69c1070`
   - `7bf4d7b`
3. 若 cherry-pick 冲突过大，再评估是否直接 merge `codex/blueprint-supervisor-formal`

### 接入后最小验证

- `node tools/blueprint-version-governance.mjs inspect --json`
- `node --test tests/blueprint-version-governance.test.cjs tests/blueprint-supervisor.test.cjs`
- `npm run lint:blueprints`
- `npm run blueprint:governance:check`

## Blueprint 规范待接入草稿

下列内容已在侧边会话形成明确方案，但尚未作为主会话 live Blueprint 真值落地：

### Version-plan 级建议

- `stop_gate_owner`
- `default_task_completion_effect`
- `default_queue_completion_effect`
- 强化规则：
  - 当 `stop_reason = none` 且仍存在 `active_queue` / `active_task` / 唯一 lawful next action` 时，`next_unblocked_action` 不应为 `none`

### Queue 级建议

- `auto_continue_policy`
- `idle_after_task_completion`
- `queue_close_handoff`
- 强化规则：
  - 若 queue 需要无人值守连续推进，则 continuation truth 不应只写在 prose 中

### Task 级建议

- `human_input_required`
- `next_lawful_action_if_done`
- `next_lawful_action_if_blocked`
- `auto_promote_if_done`
- 强化规则：
  - 即使 `promote_next_if_done = none`，仍应显式写出 `next_lawful_action_if_done`

## 未来主会话候选队列草稿

以下内容仅为未来提升进主会话 truth chain 的草稿，不是当前生效的 Blueprint candidate truth。

### 候选方向

- `queue.blueprint-supervisor-stop-gate-integration`

### 一句话 scope

- 将 Blueprint 机器可读 workflow inspect 与外部 supervisor stop gate 正式接入主线，使“继续推进 / 合法停机”可由结构化真值而非 agent 自身收口习惯裁定。

### Admission basis 草稿

- 当前 Blueprint 已有 stop-rule allow-list、active queue / active task resume chain 与持续推进要求，但仍缺少真正位于 agent 收口习惯外层的 stop gate
- `codex/blueprint-supervisor-formal` 已提供最小可运行原型与测试，可作为正式接入基础
- 为避免打断当前 active queue，建议等主会话到达可识别收束点后再提升该候选队列

### 预期 owned surface

- `tools/blueprint-version-governance.mjs`
- `tools/blueprint-supervisor.mjs`
- `tests/blueprint-version-governance.test.cjs`
- `tests/blueprint-supervisor.test.cjs`
- 如主会话确认需要，再单独推进 Blueprint 规范/模板字段正式接入

### 不应混入的内容

- 当前 active version 的业务实现
- 与 supervisor 原型无关的 live Blueprint queue closeout / admission / routing 真值修改
- 主会话尚未收束的 queue-local 文档同步

## 后续提醒

- 这个备忘录只负责记录与准备，不会自动影响主会话
- 真正要让主会话读取并执行，仍需在主会话中把该方向写入 candidate queue 或 version-level candidate truth
- 如果主会话未来已自行吸收部分 supervisor 能力，正式接入前应先重做差异审计，避免重复落地
