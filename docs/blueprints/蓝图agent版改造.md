# 蓝图agent版改造

## Document Control

- document_id: `blueprint-agent-refactor`
- document_role: `design-memo`
- created_at: `2026-07-27`
- status: `draft-recorded`
- scheduling_effect: `none`
- active_truth_owner: `none`
- related_memo_entry: `MEMO-031`

## 文档定位

- 本文档记录一套 Blueprint 侧 agent 制度改造方案，用于从制度结构上消除“明明仍应继续执行，却随意停下询问用户”的行为。
- 本文档只记录设计与治理规则，不构成队列准入、队列关闭、版本关闭、活动任务切换、或当前 Blueprint 执行真相。
- 本文档不包含发给主会话的临时执行令文本。临时执行令属于会话级操作口令；本文档只保留可长期复用的制度架构。

## 一、问题定义

### 1.1 当前问题不只是“停错了”

- 真正的问题不是 agent 偶尔判断失误。
- 真正的问题是同一个 agent 往往同时持有以下权力：
  - 具体实现上下文
  - 流程控制权
  - 是否该停下的裁量权
  - 向用户输出阶段性信息的能力
- 当这些权力集中在一个角色身上时，系统即使已经知道“当前仍有 lawful next step”，仍然可能产出一个用户可见的停机式输出。

### 1.2 非法停机的典型表现

- 明明 `active_task` 仍存在，却输出“本轮先到这里”。
- 明明 `lawful_next_step` 仍存在，却输出“先同步一下进度”。
- 工具失败本可 fallback，却被包装成“是否继续”。
- 验证失败本可修复，却被包装成“先停下确认一下”。
- 审查发现问题本应返修，却被包装成“当前阶段完成，剩余下轮再说”。

### 1.3 目标问题

- 如何从制度上剥夺 agent 的任意停权。
- 如何把“继续执行”变成默认强制路径，而不是可选倾向。
- 如何把“停下来询问用户”压缩成封闭白名单，而不是开放式例外。

## 二、制度目标

### 2.1 总目标

- 建立一套“除非命中人工干预白名单，否则绝对禁止随意停下询问”的 Blueprint agent 制度。

### 2.2 结果要求

- 任何普通 agent 都不能直接把暂停、阻塞、阶段总结、开放式问题送到用户面前。
- 任何可恢复失败都必须被内部吸收为 continue 或 fallback。
- 只有命中封闭白名单、通过裁决代理、并经守门器放行后，用户才可能看到中断性输出。

### 2.3 非目标

- 本文档不要求立刻重写现有 Blueprint 文件结构。
- 本文档不要求立刻改变当前活动 queue 的执行真相。
- 本文档不等于“只靠 prompt 就能物理级绝对保证”。
- 真正接近物理级绝对保证，仍需要外部守门层或消息投递门禁。

## 三、总原则

1. 不是把停止权交给另一个更强的 agent，而是普通 agent 根本没有天然停止权。
2. 总控代理只能负责流程控制，不能负责具体实现。
3. 总控代理也不能亲自裁决是否该停下。
4. 裁决代理只能匹配规则，不能发言。
5. 守门器只能放行或拦截，不能参与实施，也不能自定义治理结论。
6. 只要 `active_task` 和 `lawful_next_step` 仍存在，系统默认必须继续推进。
7. 可恢复失败不是用户中断理由。
8. 阶段总结、进度同步、状态汇报，不构成合法停机理由。
9. 人工干预必须是封闭白名单，不能是“类似情况也可”。
10. 默认行为必须是 `deny`，而不是“默认可发，特殊时拦截”。

## 四、角色分工与禁权表

### 4.1 总控代理

#### 职责

- 维护结构化执行状态。
- 识别当前活动 queue、活动 task、lawful next step。
- 派发执行、验证、审查工单。
- 向裁决代理提交结构化裁决请求。
- 向守门器提交候选用户可见消息。

#### 明确禁止

- 不实施代码、文档、测试、审查。
- 不直接裁决是否应停下。
- 不直接向用户发起中断式询问。
- 不直接宣布暂停、阻塞、完成。
- 不得把“是否继续”权力下放给其它 agent。

### 4.2 执行代理

#### 职责

- 只负责具体实现与交付。
- 只返回结构化执行结果。

#### 明确禁止

- 不决定流程是否继续。
- 不决定是否 closeout。
- 不决定是否问用户。
- 不输出用户可见中断消息。

### 4.3 验证代理

#### 职责

- 只负责测试、lint、governance check、验收校验。
- 只返回结构化验证结果。

#### 明确禁止

- 不宣布完成。
- 不宣布阻塞。
- 不决定是否升级给用户。
- 不输出用户可见中断消息。

### 4.4 审查代理

#### 职责

- 只负责 review、closeout review、风险审查。
- 只返回结构化审查结果。

#### 明确禁止

- 不宣布 queue 完成。
- 不宣布应该暂停。
- 不替代裁决代理做治理判断。
- 不输出用户可见中断消息。

### 4.5 裁决代理

#### 职责

- 只根据结构化字段和固定规则表返回裁决枚举值。
- 不做自由叙事。

#### 明确禁止

- 不直接向用户说话。
- 不直接输出停机说明。
- 不自己发起升级。
- 不把“我觉得”当成治理真相。

### 4.6 守门器

#### 职责

- 作为唯一用户可见中断出口。
- 只做 `allow` 或 `deny`。
- 根据结构化状态、裁决结果、白名单编码决定放行或拦截。

#### 明确禁止

- 不实施工作。
- 不解释业务。
- 不自己补做裁决。
- 不自己改变 queue/plan 真相。

## 五、权限模型

### 5.1 核心命题

- 不是“谁拥有停止权”，而是“没有任何普通 agent 天然拥有停止权”。

### 5.2 权限拆分

1. 总控代理拥有：
   - 流程推进权
   - 状态读取权
   - 工单派发权
   - 候选消息提交权
2. 总控代理不拥有：
   - 实施权
   - 最终裁决权
   - 直接中断用户权
3. 裁决代理拥有：
   - 枚举裁决输出权
4. 裁决代理不拥有：
   - 用户发言权
   - 最终放行权
5. 守门器拥有：
   - 用户消息放行/拦截权
6. 守门器不拥有：
   - 自主执行权
   - 自主治理解释权

## 六、总控代理执行状态机 v1

### 6.1 固定状态集合

1. `INIT`
2. `PLAN_READY`
3. `DISPATCHING`
4. `EXECUTING`
5. `VERIFYING`
6. `REVIEWING`
7. `ADJUDICATING`
8. `GATE_PENDING`
9. `FALLBACK_ROUTING`
10. `CONTINUING`
11. `CLOSEOUT_CANDIDATE`
12. `DONE`
13. `HARD_ESCALATION_PENDING`

### 6.2 为什么不能有普通 `PAUSED`

- 如果保留普通 `PAUSED` / `ASK_USER` / `BLOCKED` 状态，系统仍会把大量内部可恢复问题错误导向用户。
- 本制度的方向不是“规范暂停”，而是“制度上默认不允许暂停”。

### 6.3 唯一合法状态转移

1. `INIT -> PLAN_READY`
2. `PLAN_READY -> DISPATCHING`
3. `DISPATCHING -> EXECUTING`
4. `EXECUTING -> VERIFYING`
5. `VERIFYING -> ADJUDICATING`
6. `ADJUDICATING -> CONTINUING` 当 verdict=`continue`
7. `ADJUDICATING -> FALLBACK_ROUTING` 当 verdict=`fallback_required`
8. `ADJUDICATING -> CLOSEOUT_CANDIDATE` 当 verdict=`closeout_review_only`
9. `ADJUDICATING -> HARD_ESCALATION_PENDING` 当 verdict=`escalate`
10. `CONTINUING -> DISPATCHING`
11. `FALLBACK_ROUTING -> DISPATCHING`
12. `CLOSEOUT_CANDIDATE -> REVIEWING`
13. `REVIEWING -> ADJUDICATING`
14. `HARD_ESCALATION_PENDING -> GATE_PENDING`
15. `CLOSEOUT_CANDIDATE -> GATE_PENDING`
16. `GATE_PENDING -> DONE` 当 gatekeeper=`allow`
17. `GATE_PENDING -> CONTINUING` 当 gatekeeper=`deny` 且仍应继续
18. `GATE_PENDING -> FALLBACK_ROUTING` 当 gatekeeper=`deny` 且要求 fallback

### 6.4 非法转移

以下转移一律视为非法：

1. `ADJUDICATING -> 用户可见输出`
2. `EXECUTING -> 用户可见 summary`
3. `VERIFYING -> 用户可见 question`
4. `CONTINUING -> 停机说明`
5. `FALLBACK_ROUTING -> 用户提问`
6. `REVIEWING -> 直接宣布完成`

### 6.5 总控代理逐状态禁令

#### `EXECUTING`

- 禁止发阶段总结。
- 禁止发“目前做到这里”。
- 禁止问用户是否继续。

#### `VERIFYING`

- 禁止把测试失败直接解释成需要人工确认。
- 禁止发“发现一些问题先同步你”。

#### `ADJUDICATING`

- 禁止绕过裁决结果自行下判断。
- 禁止直接形成用户可见输出。

#### `CONTINUING`

- 禁止任何收束式措辞。
- 禁止把继续状态包装成阶段汇报。

#### `FALLBACK_ROUTING`

- 禁止因 fallback 不顺手而发问用户。
- 禁止将可恢复失败升级为“请拍板”。

### 6.6 执行循环

总控代理每一轮必须固定执行：

1. 读取结构化状态。
2. 判断 `active_queue`。
3. 判断 `active_task_exists`。
4. 判断 `lawful_next_step_exists`。
5. 若存在，进入 `DISPATCHING`。
6. 执行后进入 `VERIFYING`。
7. 验证后进入 `ADJUDICATING`。
8. 若 verdict 不是 `escalate` 或 `closeout_review_only`，不得尝试形成用户消息。
9. 若守门器拒绝发送，必须回到 `CONTINUING` 或 `FALLBACK_ROUTING`。

### 6.7 这个状态机如何直接卡死乱停

- 它禁止从“已知仍应继续”的状态直接走向用户。
- 它要求所有中断候选必须先经过裁决，再经过守门。
- 它把“停下来”从普通分支移除，只保留白名单升级分支。

## 七、裁决代理规则总表 v1

### 7.1 裁决输入原则

1. 只接受结构化字段，不接受长段自然语言。
2. 字段必须可枚举、可比较、可入规则表。
3. 缺字段时默认更倾向 `continue` / `fallback_required` / `illegal_stop`。
4. 缺字段不得默认 `escalate`。

### 7.2 裁决输入总结构

```json
{
  "version_id": "string",
  "queue_id": "string",
  "task_id": "string|null",
  "execution_state": "INIT|PLAN_READY|DISPATCHING|EXECUTING|VERIFYING|REVIEWING|ADJUDICATING|GATE_PENDING|FALLBACK_ROUTING|CONTINUING|CLOSEOUT_CANDIDATE|HARD_ESCALATION_PENDING",
  "active_queue": true,
  "active_task_exists": true,
  "lawful_next_step_exists": true,
  "delivery_intent": "none|summary|question|escalation|final",
  "delivery_target": "user|internal|gate_only",
  "worker_result": "not_run|success|failed|partial",
  "verification_result": "not_run|pass|fail|partial",
  "review_result": "not_run|pass|fail|partial",
  "recoverable_tool_failure": false,
  "recoverable_worker_failure": false,
  "fallback_available": true,
  "fallback_selected": false,
  "closeout_preconditions_met": false,
  "closeout_review_required": false,
  "closeout_review_passed": false,
  "explicit_user_pause": false,
  "explicit_user_redirect": false,
  "explicit_user_abort": false,
  "boundary_violation_risk": "none|low|hard",
  "governance_conflict": "none|soft|hard",
  "missing_required_input": false,
  "safe_conservative_assumption_available": true,
  "whitelist_escalation_code": "none|USER_DECISION_REQUIRED|BOUNDARY_CONFLICT|GOVERNANCE_HARD_CONFLICT",
  "candidate_reason_code": "string"
}
```

### 7.3 裁决输出结构

```json
{
  "verdict": "continue|illegal_stop|fallback_required|escalate|closeout_review_only",
  "matched_rule_id": "R-XXX",
  "reason_code": "string",
  "must_block_user_message": true,
  "required_next_state": "CONTINUING",
  "required_action": "dispatch_next_step"
}
```

### 7.4 固定优先级

1. 用户显式暂停/改向/中止
2. 硬边界冲突
3. 硬治理冲突
4. 可恢复失败且存在 fallback
5. closeout review only
6. 存在合法下一步时继续
7. 继续执行中试图停下时记为非法停机

### 7.5 关键规则

#### `R-101 用户显式暂停`

- 条件：`explicit_user_pause = true`
- 输出：`escalate`

#### `R-102 用户显式改向`

- 条件：`explicit_user_redirect = true`
- 输出：`escalate`

#### `R-201 可恢复失败必须 fallback`

- 条件：
  - `recoverable_tool_failure = true` 或 `recoverable_worker_failure = true`
  - `fallback_available = true`
- 输出：`fallback_required`

#### `R-301 closeout 前只能进入 closeout review`

- 条件：
  - `closeout_preconditions_met = true`
  - `closeout_review_required = true`
  - `closeout_review_passed = false`
- 输出：`closeout_review_only`

#### `R-401 有合法下一步必须继续`

- 条件：
  - `active_queue = true`
  - `active_task_exists = true`
  - `lawful_next_step_exists = true`
- 输出：`continue`

#### `R-402 继续执行中发 summary 属于非法停机`

- 条件：
  - `active_queue = true`
  - `active_task_exists = true`
  - `lawful_next_step_exists = true`
  - `delivery_intent = summary`
  - `delivery_target = user`
- 输出：`illegal_stop`

#### `R-403 继续执行中发 question 属于非法停机`

- 条件：
  - `active_queue = true`
  - `active_task_exists = true`
  - `lawful_next_step_exists = true`
  - `delivery_intent = question`
  - `delivery_target = user`
  - `whitelist_escalation_code = none`
- 输出：`illegal_stop`

### 7.6 缺字段默认规则

1. 缺执行结果字段，不得默认完成。
2. 缺 closeout 字段，不得默认 closeout。
3. 缺升级字段，不得默认 escalate。
4. 缺 fallback 字段，优先补状态，不得直接问用户。
5. 缺用户显式指令字段，默认用户未要求暂停。

## 八、守门器拦截规则表 v2

### 8.1 守门器定位

- 守门器不是建议器，不是总结器，不是治理解释器。
- 它唯一职责是决定“候选消息能否到达用户”。

### 8.2 输入结构

```json
{
  "message": {
    "kind": "summary|question|escalation|final|pause_ack|redirect_ack",
    "target": "user",
    "reason_code": "string"
  },
  "state": {
    "active_queue": true,
    "active_task_exists": true,
    "lawful_next_step_exists": true,
    "execution_state": "CONTINUING",
    "closeout_preconditions_met": false,
    "closeout_review_required": false,
    "closeout_review_passed": false,
    "recoverable_tool_failure": false,
    "recoverable_worker_failure": false,
    "fallback_available": true,
    "explicit_user_pause": false,
    "explicit_user_redirect": false,
    "explicit_user_abort": false,
    "whitelist_escalation_code": "none"
  },
  "adjudication": {
    "verdict": "continue",
    "matched_rule_id": "R-401",
    "must_block_user_message": true,
    "required_next_state": "CONTINUING",
    "required_action": "dispatch_next_step"
  }
}
```

### 8.3 默认策略

- 默认 `deny`。
- 未命中明确 allow 规则时，一律不放行。

### 8.4 强制拦截规则

#### `G-101 有合法下一步时禁止阶段总结`

- 条件：
  - `active_task_exists = true`
  - `lawful_next_step_exists = true`
  - `message.kind = summary`
- 动作：`deny`

#### `G-102 有合法下一步时禁止向用户提问`

- 条件：
  - `active_task_exists = true`
  - `lawful_next_step_exists = true`
  - `message.kind = question`
  - `whitelist_escalation_code = none`
- 动作：`deny`

#### `G-103 裁决要求阻断时一律拦截`

- 条件：`adjudication.must_block_user_message = true`
- 动作：`deny`

#### `G-104 可恢复失败时禁止升级给用户`

- 条件：
  - `recoverable_tool_failure = true` 或 `recoverable_worker_failure = true`
  - `fallback_available = true`
  - `message.kind = escalation` 或 `message.kind = summary`
- 动作：`deny`

#### `G-105 未完成 closeout review 时禁止宣告完成`

- 条件：
  - `message.kind = final`
  - `closeout_review_required = true`
  - `closeout_review_passed = false`
- 动作：`deny`

#### `G-106 continue 裁决下禁止任何用户可见中断消息`

- 条件：
  - `adjudication.verdict = continue`
  - `message.kind != final`
- 动作：`deny`

#### `G-107 illegal_stop 裁决下禁止任何候选消息放行`

- 条件：`adjudication.verdict = illegal_stop`
- 动作：`deny`

#### `G-108 fallback_required 裁决下禁止发给用户`

- 条件：`adjudication.verdict = fallback_required`
- 动作：`deny`

### 8.5 唯一放行规则

#### `A-101 用户显式暂停确认`

- 条件：
  - `explicit_user_pause = true`
  - `adjudication.verdict = escalate`
  - `message.kind = pause_ack`
- 动作：`allow`

#### `A-102 用户显式改向确认`

- 条件：
  - `explicit_user_redirect = true`
  - `adjudication.verdict = escalate`
  - `message.kind = redirect_ack`
- 动作：`allow`

#### `A-103 白名单硬升级`

- 条件：
  - `adjudication.verdict = escalate`
  - `whitelist_escalation_code` 属于：
    - `USER_DECISION_REQUIRED`
    - `BOUNDARY_CONFLICT`
    - `GOVERNANCE_HARD_CONFLICT`
  - `message.kind = escalation`
- 动作：`allow`

#### `A-104 真正完成`

- 条件：
  - `active_queue = false` 或 `active_task_exists = false`
  - `lawful_next_step_exists = false`
  - `closeout_preconditions_met = true`
  - 若需要 closeout review，则 `closeout_review_passed = true`
  - `message.kind = final`
- 动作：`allow`

### 8.6 输出结构

```json
{
  "gate_result": "allow|deny",
  "reason_code": "string",
  "matched_gate_rule": "G-XXX",
  "required_next_state": "CONTINUING",
  "required_action": "dispatch_next_step"
}
```

## 九、总控代理调度工单模板 v1

### 9.1 调度原则

1. 只描述任务，不授予流程裁决权。
2. 只描述交付物，不授予用户沟通权。
3. 只描述验收条件，不授予停机判断权。
4. 只允许结构化回执，不允许自由发挥式总结。
5. 失败必须回传为失败类型，不得自行升级用户。
6. 不允许出现“如有问题请询问用户”“如判断风险较大则暂停”等措辞。

### 9.2 统一工单结构

```json
{
  "order_id": "string",
  "order_type": "execute|verify|review",
  "role": "执行代理|验证代理|审查代理",
  "version_id": "string",
  "queue_id": "string",
  "task_id": "string",
  "objective": "string",
  "scope_whitelist": ["string"],
  "scope_blacklist": ["string"],
  "inputs": ["string"],
  "expected_outputs": ["string"],
  "acceptance_checks": ["string"],
  "fallback_hint": "string|null",
  "on_failure": "return_structured_failure",
  "on_uncertainty": "apply_conservative_assumption_or_return_structured_gap",
  "user_contact_allowed": false,
  "stop_decision_allowed": false,
  "governance_decision_allowed": false,
  "response_schema": "EXECUTE_RESULT_V1|VERIFY_RESULT_V1|REVIEW_RESULT_V1"
}
```

### 9.3 执行工单模板重点

- 目标必须明确。
- scope whitelist/blacklist 必须明确。
- 不得包含“你判断是否该停”之类授权。

### 9.4 验证工单模板重点

- 只回答通过/失败/部分通过。
- 不得回答“我觉得差不多可以收了”。

### 9.5 审查工单模板重点

- 只回答 findings、风险、是否 closeout ready。
- 不拥有收口权。

### 9.6 固定回执格式

```json
{
  "EXECUTE_RESULT_V1": {
    "order_id": "string",
    "status": "success|failed|partial",
    "deliverables": ["string"],
    "changed_surfaces": ["string"],
    "blocked_by": "none|implementation_issue|tool_failure|missing_input|boundary_conflict",
    "recoverable": true,
    "fallback_options": ["string"],
    "notes_code": ["string"]
  },
  "VERIFY_RESULT_V1": {
    "order_id": "string",
    "status": "pass|fail|partial",
    "checks_run": ["string"],
    "failures": ["string"],
    "failure_type": "none|implementation_issue|tool_failure|environment_issue",
    "recoverable": true,
    "fallback_options": ["string"],
    "notes_code": ["string"]
  },
  "REVIEW_RESULT_V1": {
    "order_id": "string",
    "status": "pass|fail|partial",
    "findings": ["string"],
    "closeout_ready": false,
    "review_gap": "none|missing_evidence|missing_verification|open_risk",
    "recoverable": true,
    "fallback_options": ["string"],
    "notes_code": ["string"]
  }
}
```

### 9.7 总控代理禁止措辞

以下句式一律禁止出现在工单中：

1. 必要时询问用户
2. 如果你认为风险较大则暂停
3. 自行决定是否继续
4. 如判断需要可先做阶段总结
5. 如果遇阻则向用户解释情况
6. 你来判断是否应 closeout
7. 可视情况等待进一步指示

## 十、人工干预白名单总表 v1

### 10.1 总原则

1. 白名单必须是封闭枚举。
2. 未命中白名单编码的中断请求一律非法。
3. 命中白名单也不自动放行，仍需裁决代理与守门器双重通过。
4. 白名单只描述允许人工介入的硬边界，不描述普通执行困难。

### 10.2 唯一允许的白名单编码

#### `W-101 用户显式暂停`

- 用户明确说出暂停、停止、先别继续、等我确认后再做。

#### `W-102 用户显式改向`

- 用户明确要求更换目标、切换 queue、改走另一方案。

#### `W-103 必须用户选择且无法保守推断`

- 存在真实多分支决策。
- 仓库、蓝图、既有约束都无法推出默认答案。
- 任何保守假设都会越权。

#### `W-104 硬边界冲突`

- 继续执行将直接越过权限、安全、side conversation、用户明示禁止等明确边界，且不存在合法 fallback。

#### `W-105 硬治理冲突`

- 蓝图、治理规则、流程约束出现不可共存冲突，且无法通过保守执行或 fallback 消解。

### 10.3 明确不在白名单里的情形

1. 工具失败
2. 执行失败
3. 验证失败
4. 审查发现问题
5. 阶段性总结冲动
6. 可保守假设的缺信息

### 10.4 判定顺序

1. 是否用户显式暂停
2. 是否用户显式改向
3. 是否必须用户选择且无法保守推断
4. 是否硬边界冲突
5. 是否硬治理冲突
6. 其余全部归入非白名单

### 10.5 白名单请求格式

```json
{
  "whitelist_code": "USER_DECISION_REQUIRED|BOUNDARY_CONFLICT|GOVERNANCE_HARD_CONFLICT",
  "evidence": {
    "explicit_user_pause": false,
    "explicit_user_redirect": false,
    "missing_required_input": true,
    "safe_conservative_assumption_available": false,
    "boundary_violation_risk": "none",
    "governance_conflict": "none",
    "fallback_available": false
  },
  "requested_message_kind": "escalation"
}
```

## 十一、异常分级与自动 Fallback 规则 v1

### 11.1 总原则

1. 异常先分级，再处理。
2. 异常默认进入内部恢复流程，不进入用户沟通流程。
3. 同一种异常只能映射到固定恢复路径。
4. 只有白名单命中 + 裁决通过 + 守门放行，异常才可能到用户面前。
5. 无法定级时，默认按更低权限、更强续跑处理，而不是升级。

### 11.2 异常等级

#### `E-1 可恢复工具异常`

- 如 sub-agent 404、外围工具失败、浏览器烟测工具异常。

#### `E-2 可恢复执行异常`

- 如当前实现路径失败、改动引入错误、局部回归。

#### `E-3 可恢复验证异常`

- 如测试失败、lint 失败、治理检查失败、环境问题。

#### `E-4 可恢复审查异常`

- 如 review 发现回归风险、closeout review 不通过、证据不足。

#### `E-5 不可直接继续但可保守收缩的异常`

- 如大改路径风险高但小改路径存在。

#### `E-6 硬升级候选异常`

- 只有命中白名单时才允许成为升级候选。

### 11.3 Fallback 类型

#### `F-101 工具替换`

- 换同类工具、改走本地命令链、去掉非关键工具依赖。

#### `F-102 验证降级`

- 从全量自动化降到关键路径验证。

#### `F-103 实现收缩`

- 缩小改动面、拆批、单向收敛。

#### `F-104 顺序重排`

- 先修阻断项、先补测试、先补证据。

#### `F-105 证据补齐`

- 补日志、补结果、补审查定位、补 closeout 证据。

#### `F-106 保守假设推进`

- 按仓库既有模式、蓝图默认方向、最小改动原则推进。

### 11.4 固定映射

1. `E-1 -> F-101`，必要时联动 `F-102`
2. `E-2 -> F-103`，必要时联动 `F-104`
3. `E-3 -> F-101 | F-102 | F-103`
4. `E-4 -> F-105`，必要时联动 `F-103`
5. `E-5 -> F-106 | F-103`
6. `E-6 -> 不直接 fallback，必须先裁决`

### 11.5 连续失败处理

1. 同一路径连续失败 1 次：正常 fallback
2. 同一路径连续失败 2 次：强制收缩范围
3. 同一路径连续失败 3 次：强制更换路径类型
4. 连续失败达到阈值但未命中白名单：继续内部降级，不得升级用户

### 11.6 明确禁止

以下行为一律禁止：

1. 工具失败后发“当前工具异常，是否继续”
2. 测试失败后发“发现一些问题，先同步你”
3. 审查不通过后发“这轮先停在这里”
4. fallback 次数变多后自动改为问用户

## 十二、非法停机样例库

### 12.1 样例一：仍在继续执行中却发阶段总结

#### 输入事实

- `active_task_exists = true`
- `lawful_next_step_exists = true`
- `delivery_intent = summary`

#### 正确结果

- 裁决：`illegal_stop`
- 守门：`deny`
- 路由：`CONTINUING -> DISPATCHING`

### 12.2 样例二：review 工具 404 后询问用户

#### 输入事实

- `recoverable_tool_failure = true`
- `fallback_available = true`
- 试图输出 `question`

#### 正确结果

- 裁决：`fallback_required`
- 守门：`deny`
- 路由：`FALLBACK_ROUTING`

### 12.3 样例三：测试失败后“先同步一下”

#### 输入事实

- `verification_result = fail`
- `recoverable_worker_failure = true`
- `fallback_available = true`

#### 正确结果

- 裁决：`fallback_required`
- 守门：`deny`
- 路由：返修或实现收缩

### 12.4 样例四：closeout 未审完却宣布完成

#### 输入事实

- `closeout_preconditions_met = true`
- `closeout_review_required = true`
- `closeout_review_passed = false`
- `delivery_intent = final`

#### 正确结果

- 裁决：`closeout_review_only`
- 守门：`deny`
- 路由：`REVIEWING`

### 12.5 样例五：必须用户二选一且无法保守推断

#### 输入事实

- `missing_required_input = true`
- `safe_conservative_assumption_available = false`
- `whitelist_escalation_code = USER_DECISION_REQUIRED`
- `fallback_available = false`

#### 正确结果

- 裁决：`escalate`
- 守门：若消息种类正确则 `allow`
- 路由：`HARD_ESCALATION_PENDING`

## 十三、为什么这套制度能显著杜绝乱停

### 13.1 不是靠“自觉”，而是靠拆权

- 总控代理失去直接中断能力。
- 执行/验证/审查代理失去提问能力。
- 裁决代理失去发言能力。
- 守门器失去实施和自由裁决能力。

### 13.2 非法停机要同时穿透三层才会成功

1. 总控代理先要形成候选中断消息。
2. 裁决代理还要错误地放行。
3. 守门器还要错误地允许发送。

- 只要任何一层按制度工作，非法停机就会被拦下。

### 13.3 普通失败不再自然流向用户

- 过去：失败 -> 想解释一下 -> 停下
- 现在：失败 -> 分级 -> fallback -> 继续

### 13.4 进度汇报不再是中性动作

- 在本制度下，执行中阶段总结不是“礼貌同步”，而是潜在非法停机候选。
- 一旦系统仍有 lawful next step，这类消息就应被裁成 `illegal_stop` 或被守门器 `deny`。

## 十四、落地层级

### 14.1 提示词级落地

- 通过主会话执行令让主 agent 临时按该制度运作。
- 优点：快。
- 缺点：不是绝对硬约束。

### 14.2 流程级落地

- 将角色拆分、工单模板、裁决字段、守门规则写入固定文档和执行约束。
- 优点：比纯提示词更稳定。
- 缺点：仍可能被同一会话自由文本绕开。

### 14.3 外部门禁级落地

- 让所有候选用户输出先进入外部守门层，再决定是否投递。
- 优点：最接近绝对防线。
- 缺点：需要额外技术实现。

### 14.4 绝对性结论

- 若仅靠同一个会话里的提示词，无法达到物理级绝对保证。
- 若通过外部门禁收回用户输出投递权，才接近“绝对杜绝随意停下”的工程实现。

## 十五、采用边界

- 本文档记录的是 Blueprint agent 治理架构。
- 本文档不自动覆写当前活动 queue 或版本计划。
- 本文档不自动要求主会话立即照此执行。
- 若要让主会话临时按此制度执行，仍需单独下发执行令。
- 若要实现更强保证，仍需后续把守门器能力从文档规则变成实际消息门禁。

## 十六、推广守则

### 16.1 允许的后续动作

- 作为 memo-only 设计继续记录。
- 未来拆成边界清晰的推广队列。
- 先从主会话执行制度试运行，再评估外部门禁。

### 16.2 不允许的直接推论

- 不得把本文档自动视为当前活动 queue 的执行真相。
- 不得把本文档自动视为当前 Blueprint 的活动治理规则。
- 不得因为本文档存在，就默认可以改动活动 queue 的 closeout / routing / admission 结论。

## Promotion Guard

- Recorded only.
- This document does not admit a queue.
- This document does not close a queue or version.
- This document does not modify the current active Blueprint resume chain.
- Future promotion should be bounded and must remain separate from the live governed execution truth unless explicitly adopted by later review.
