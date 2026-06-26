# LLM 打标与语义驱动生成方案

## 目标

将当前 `pixel-workflow.html` 中的启发式建筑打标（`house/building`）升级为：

1. 由 LLM 进行建筑语义打标（可解释、可扩展）。
2. 基于语义标签反向指导场景生成（道路、聚落结构、功能分区、建筑提示词补全）。

---

## 当前状态（基线）

目前实现为规则匹配：

- `hut` 默认标记为 `house`。
- 其余建筑通过关键词命中打 `house`，否则为 `building`。
- 道路系统仅连接 `house` 类建筑。

问题：

- 语义粒度太粗，仅二分类。
- 无法表达“商铺/公共建筑/地标/工业/农田/防御”等角色差异。
- 无法根据“场景目标”自动生成布局与建筑类型。

---

## 目标能力

### 1) LLM 语义打标（Tagging）

输入（每个建筑）：

- 基本信息：`id/type/label/prompt/title`
- 可选视觉信息：三视图摘要、体素尺寸（`W/H/D`）、占地面积、层数估计
- 场景上下文：当前场景主题、时代风格、地形类型

输出（结构化 JSON）：

- `primary_tag`：主类（如 `residential/commercial/public/religious/industrial/farm/defense/landmark`）
- `sub_tags`：细分类（如 `inn/blacksmith/market/temple/warehouse`）
- `road_role`：道路角色（`connect_required/optional/avoid_heavy_traffic`）
- `confidence`：0~1
- `reason`：简短解释

### 2) 语义驱动生成（Guided Generation）

在生成新建筑或新场景时，引入“语义目标”：

- 示例：`“生成一个以居民区+集市为核心的村落，至少1个公共建筑，2-4个商铺，主路连接客栈与集市”`

LLM 负责：

- 先给出“布局意图”（哪些标签要出现、比例、邻接关系）。
- 再给出每个建筑的提示词模板与放置建议。
- 最后由现有生成链路执行（生成三视图 -> 体素 -> 放置）。

---

## 数据结构升级建议

为每个场景对象新增字段（兼容旧数据）：

```json
{
  "semantic": {
    "primaryTag": "residential",
    "subTags": ["house", "inn"],
    "roadRole": "connect_required",
    "confidence": 0.92,
    "reason": "关键词与体素形态显示为居住/住宿用途",
    "source": "llm|rule|manual",
    "version": 1,
    "updatedAt": 1777000000000
  }
}
```

场景级新增：

```json
{
  "semanticPlan": {
    "theme": "northern_grassland_village",
    "requiredTags": ["residential", "commercial", "public"],
    "adjacencyHints": [
      ["commercial", "road_main"],
      ["residential", "road_branch"]
    ],
    "version": 1
  }
}
```

---

## 接口建议

## 1) 建筑打标接口

- `POST /api/scene/tag-buildings`
- 入参：`sceneId + buildings[] + sceneContext`
- 出参：`buildingId -> semantic`

要求：

- 严格 JSON schema 输出。
- 失败时返回可降级信息（不要阻塞主流程）。

## 2) 语义规划接口

- `POST /api/scene/semantic-plan`
- 入参：主题、规模、地形、风格、约束条件
- 出参：语义配额、邻接约束、道路连接优先级

## 3) 语义驱动建筑提示词接口

- `POST /api/scene/building-prompts-from-plan`
- 入参：`semanticPlan + existingBuildings`
- 出参：每个待生成建筑的提示词与建议位置

---

## 渐进式落地计划

## Phase 1（低风险）

- 保留现有规则打标。
- 增加 `semantic.source = "rule"` 字段。
- 新增“请求 LLM 重打标”按钮（手动触发，不自动覆盖）。

## Phase 2（双轨运行）

- 保存时自动调用 LLM 打标。
- 若 `confidence >= 阈值`，写入 `semantic`；否则保留规则结果。
- UI 显示：标签来源 + 置信度 + 解释。

## Phase 3（语义驱动道路）

- 路由算法不再只看 `isHouse`，而看 `roadRole`：
  - `connect_required` 必连
  - `optional` 视距离连接
  - `avoid_heavy_traffic` 避开主路

## Phase 4（语义驱动生成）

- 新建场景时先生成 `semanticPlan`。
- 按 plan 自动生成一批建筑提示词 + 放置建议。
- 用户确认后批量生成并落地。

---

## 兼容与回滚

- 没有 `semantic` 字段时，继续走旧逻辑（关键词规则）。
- LLM 失败/超时时不影响放置与保存。
- 保留开关：
  - `useLlmTagging`
  - `useSemanticRoadPlanner`
  - `useSemanticSceneGenerator`

---

## 风险与对策

- **输出不稳定**：用 JSON schema + 重试 + 低温度。
- **标签漂移**：记录 `semantic.version` 与 `source`，允许人工锁定标签。
- **成本问题**：批量打标合并请求，增量更新（仅新/变更建筑）。
- **响应时延**：先显示规则结果，LLM 完成后异步更新。

---

## 建议的最小下一步（可直接开工）

1. 给场景对象补 `semantic` 字段（先写 `source=rule`）。
2. 增加“LLM 重打标”入口与状态显示。
3. 道路连接逻辑切换为读取 `roadRole`（缺失时回退 `isHouse`）。
4. 预留 `semanticPlan` 结构，先不接自动生成。

