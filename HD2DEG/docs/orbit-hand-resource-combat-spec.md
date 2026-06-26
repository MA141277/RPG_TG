# Orbit Hand / Resource Combat 规格草案

本文是对当前需求的实现草案，目标是先把系统边界、数据结构、时序和模块拆分定下来，再进入编码阶段。

## 1. 目标与范围

- 玩家身边已有一个绕角色旋转的小球，视为“玩家的手”。
- 未来若装备武器/工具，小球贴图替换为对应武器/工具贴图。
- 先做资源点战斗与掉落链路，不做复杂数值系统。
- 资源点（树、煤矿、铁矿等）后续仍由交互功能 agent 管理；当资源点尚无掉落配置时，触发 LLM 预生成掉落候选。

## 2. 核心规则（按当前口径）

1) 轨道手（小球）
- 旋转高度约 `1 tile`。
- 小球底部需要投影。
- 小球若碰到“除主角外”的碰撞箱：
  - 保持速度大小不变；
  - 旋转方向反转（顺时针 <-> 逆时针）。

2) 资源受击
- 若碰撞对象是资源类（`resource`），造成一次伤害。
- 资源默认生命值 `hp = 10`（当前阶段）。
- 小球单次伤害 `damage = 2`（当前阶段）。
- 资源点被打中时，沿击打方向抖动一次作为反馈。

3) 资源击破与掉落
- 资源 `hp <= 0` 时判定击破。
- 击破后根据掉落表随机生成掉落物：
  - 每种候选掉落，数量随机 `0~3`；
  - 随机逻辑由代码实现，不由 LLM 决定。
- 生成的掉落物可被角色拾取并进入物品栏。

4) 掉落表缺失时的推理
- 若资源点无掉落配置，受击后提前异步触发 LLM 推理掉落候选。
- 模型：先用“GPT 快模型”（后续按项目里实际可用模型映射）。
- 提示词主题（示例）：
  - `这是一个rpg游戏里的{物体名称}，生成他的可能掉落物至少1种`
- 输出结构必须使用统一物品结构：名称、贴图、描述、tag、tag 对应功能细节。
- 贴图可异步生成（比 LLM 慢）：
  - 先生成结构化物品数据；
  - 后续再用豆包/seedream/doubao 生成贴图并回填。

## 3. 建议数据结构

## 3.1 轨道手（玩家手）

```ts
type OrbitHand = {
  enabled: boolean;
  radiusWorld: number;            // 绕玩家半径
  heightWorld: number;            // 当前设为约 1 tile
  angularSpeed: number;           // 角速度（弧度/秒）
  clockwise: boolean;             // true 顺时针，false 逆时针
  angle: number;                  // 当前角度
  sprite?: string;                // 当前贴图（空=默认球）
  damage: number;                 // 当前固定 2
  lastHitAtMs: number;            // 防抖/节流用
  hitCooldownMs: number;          // 对同目标触发节流
};
```

## 3.2 资源对象扩展（挂在 scene object 上）

```ts
type ResourceCombatState = {
  hp: number;                     // 默认 10
  maxHp: number;                  // 默认 10
  shakeUntilMs?: number;          // 抖动结束时刻
  shakeDirX?: number;             // 受击方向
  shakeDirY?: number;
  dropTableReady?: boolean;       // 是否已有掉落表
  dropTableGenState?: "idle" | "running" | "ok" | "error";
  dropTableError?: string;
};
```

## 3.3 统一掉落物结构（与物品系统对齐）

```ts
type WorldItem = {
  name: string;
  icon?: string;                  // 初期可空，后续异步填充
  description: string;
  tags: string[];
  tagFeatures?: Array<{
    tag: string;
    details: Record<string, unknown>;
  }>;
};

type ResourceDropEntry = {
  item: WorldItem;
  min: number;                    // 先固定 0
  max: number;                    // 先固定 3
  weight?: number;                // 可选，用于后续加权
};
```

## 4. 运行时时序

1. 每帧更新轨道手位置与投影。
2. 用轨道手碰撞体检测碰撞：
   - 若命中非玩家碰撞箱：反向旋转。
   - 若命中资源对象：进入 `onResourceHit(...)`。
3. `onResourceHit`：
   - 扣血 `hp -= 2`；
   - 写入抖动参数；
   - 若掉落表未准备且未在运行：异步请求 LLM 推理掉落候选；
   - 若 `hp <= 0`：执行 `onResourceDestroyed(...)`。
4. `onResourceDestroyed`：
   - 从掉落表按代码随机生成 0~3 数量；
   - 在世界生成可拾取掉落实体；
   - 角色靠近自动拾取进物品栏（或按现有拾取规则）。

## 5. LLM 与异步生成策略

## 5.1 掉落推理（快模型）

- 输入：资源对象名称 + 标签 + 上下文（RPG世界）。
- 输出：`ResourceDropEntry[]`，至少 1 种物品。
- 失败处理：
  - 记录 `dropTableGenState = error`；
  - 使用本地兜底（例如木材/矿石基础掉落）。

## 5.2 贴图生成（豆包/seedream）

- 只在物品 `icon` 缺失时异步触发。
- 先不阻塞战斗和掉落逻辑。
- 生成完成后回填 `item.icon` 并刷新 UI。

## 6. 建议模块拆分（与当前脚本兼容）

- `combat/orbit-hand.js`
  - 轨道手状态、位置更新、投影与碰撞入口。
- `combat/resource-damage.js`
  - 资源受击、抖动、击破与掉落实例化。
- `drops/drop-table-runtime.js`
  - 掉落表随机逻辑（0~3、权重等）。
- `drops/drop-table-llm.js`
  - 快模型推理掉落候选。
- `drops/drop-icon-jobs.js`
  - 豆包/seedream 图标异步任务与回填。

> 若短期仍在单体 `scripts/pixel-workflow.js` 内实现，也建议按上述函数分区命名，后续再抽文件。

## 7. 需要你确认的口径（实现前）

1. “1 tile 高”的 tile 基准，是否固定为世界单位 `1`？  
2. 小球与同一资源的连续命中，是否需要最小命中间隔（例如 120ms）？  
3. 资源击破后对象是否立即消失，还是进入“空壳/重生计时”状态？  
4. 掉落拾取是“自动吸附”还是“进入碰撞后按键拾取”？  
5. 快模型具体用哪个（项目内可用名）？

## 8. 当前阶段默认值（可直接编码）

- `resource.hp = 10`
- `orbitHand.damage = 2`
- `dropCountPerItem = randomInt(0, 3)`
- `resourceHitCooldownMs = 120`
- `dropTableMissing => first hit triggers async LLM generation`

