# 容器系统设计记录（像素wf）

目标：先做一个可用的“容器（2×9 格）”与物品堆叠交互；后续逐步演进到更接近矮人要塞（DF）的涌现式模拟（密封性、可倾倒/可倒入、内容物状态、污染/温度等）。

## 核心共识：UI 与底层驱动不冲突

- **底层驱动（AI/任务系统）**：负责让 NPC 进行搬运、存储、补给、生产等操作（“他们自己会拿”）。
- **UI 交互（玩家操控主角）**：提供玩家直接操作背包/容器的手段（“玩家帮主角拿”）。
- 两者作用在同一套“世界状态”上（物品、容器、包含关系/内容物），只是触发来源不同。

## 当前阶段（已落地/进行中）

- 容器对象识别：语义 `container` 或交互标签 `item:container`。
- 容器 UI：打开后显示 **2 行 × 9 列（18 格）**。
- 容器持久化：使用 localStorage，key = `sceneId:objectId`。
- 物品栈 schema：`{ name, icon, description, tags, count, liquid? }`（`liquid` 为后续 DF 风格内容物预留）。

## 下一阶段（DF 风格涌现性：路线图）

### 1) 内容物与盛装（Contents）

把“容器里装的是什么”抽象成统一的 contents 模型，而不是只有 slots：

- **离散物品**：slots（箱子、柜子、背包等）。
- **连续内容物**：liquid/powder（瓶、桶、袋、罐等）。

建议字段（示意）：

- `liquid: { type, amount, max, temperature?, contamination?, sealed? }`
- `powder: { type, amount, max, moisture?, contamination?, sealed? }`

### 2) 密封性（Sealed）

- 容器是否密封影响：蒸发/泄露/污染扩散/气味等。
- UI 层面：显示“已密封/未密封”；交互：开盖/加塞/封蜡。

### 3) 可倾倒 / 可倒入（Pour / Fill）

定义通用动作：

- `pour(from, to, amount?)`
- `fill(target, source, amount?)`

并绑定到交互标签：

- `item:water-source` / `item:ore-source` 等作为 source
- `item:vessel` / `item:container` 等作为 target

### 4) 涌现性（Emergence）

当 contents + sealed + pour/fill + 温度/污染一起存在时，会自然产生很多玩法：

- 污水装进水袋 → 饮用后 debuff
- 高温液体倒入木桶 → 破坏/泄漏
- 发酵系统：液体随时间转变，产生压力等

## 交互手感建议（玩家侧）

- 左键：拿起/放下/自动合并
- 右键：移动 1 个（精细调整）
- Ctrl：拆半（从一堆里取一半到手上）
- Shift：快速搬运（容器 ↔ 背包：自动放入可合并/空槽）

