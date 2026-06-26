# AI 世界物品 — 交互数据结构

面向「物品 + 可选设施能力」的统一数据模型。设施相关字段仅在 `categories` 含 **设施** 时使用；其余类型可忽略 `facility`。

## 约定

| 字段 | 说明 |
|------|------|
| `tags` | **可重复**：同一字符串可出现多次（如两次 `"易燃"` 表示叠加语义，由业务解释）。 |
| `categories` | **可重复、可扩展**：建议用稳定英文码，展示层再映射中文；后续可追加新类别而不改顶层结构。 |
| `attributes` | 物理向属性；单位在元数据里约定，数值本身为标量。 |

### 类别（建议码值，可增删）

- `item` — 物品  
- `facility` — 设施  

若一项同时属于多类，在 `categories` 中多次出现或并列多码均可（例如 `["item","facility"]`）。

---

## TypeScript 形态（参考）

```typescript
/** 类别码：可随产品扩展，如 environment、npc 等 */
type CategoryCode = string;

interface WorldItemAttributes {
  /** 体积，单位见 metadata.units.volume */
  volume: number;
  /** 质量，单位见 metadata.units.mass */
  mass: number;
}

/**
 * 设施 — 转化：由大模型读取「源物品」完整 WorldItem JSON，
 * 按规则输出新的 WorldItem（可改名称、增删 tags/categories、改 attributes 等任意已定义字段）。
 */
interface FacilityTransformation {
  id: string;
  /** 给人 / 给模型看的说明，或固定槽位名称 */
  label?: string;
  /**
   * 驱动 LLM 的规则：自然语言或结构化提示模板。
   * 模型输入应包含：本设施、源物品 WorldItem、全局约束；输出应为完整 WorldItem 或 RFC 7396 式 patch（二选一致即可，由实现约定）。
   */
  instruction: string;
  /** 可选：限定可放入槽位的物品需具备的 tag（无则任意物品） */
  acceptedSourceTags?: string[];
}

/**
 * 设施 — 消耗：持续从世界/库存中消耗「带某 tag 的物品」，
 * amountPerMinute 为每游戏分钟（或真实分钟，由 simulation 约定）消耗量。
 */
interface FacilityTagConsumption {
  id: string;
  /** 匹配 tag：与物品 tags 中任一条目相等即计为可消耗（含重复 tag 时的计数规则由运行时定义） */
  tag: string;
  /** 每分钟消耗量（同 tag 多条目时是否累加由运行时定义） */
  amountPerMinute: number;
}

interface FacilityBlock {
  transformations: FacilityTransformation[];
  consumptions: FacilityTagConsumption[];
}

interface WorldItem {
  /** 展示用唯一名；LLM 转化后也可改名 */
  name: string;
  description: string;
  /** 可重复 */
  tags: string[];
  /** 可重复；含 facility 时须带 `facility` 块 */
  categories: CategoryCode[];
  attributes: WorldItemAttributes;
  /** 当 categories 含 facility 时使用；否则可省略或 {} */
  facility?: FacilityBlock;
  /** 版本、作者、单位、游戏时间制等 */
  metadata?: Record<string, unknown>;
}
```

---

## JSON 示例（普通物品）

```json
{
  "name": "木桶",
  "description": "装液体的简陋容器。",
  "tags": ["容器", "易燃", "容器"],
  "categories": ["item"],
  "attributes": {
    "volume": 0.05,
    "mass": 2.5
  },
  "metadata": {
    "units": { "volume": "m3", "mass": "kg" },
    "schemaVersion": "1.0.0"
  }
}
```

## JSON 示例（设施：转化 + 按 tag 消耗）

```json
{
  "name": "劣质提炼台",
  "description": "把含「原料」tag 的物品粗炼成别的样子。",
  "tags": ["设施", "危险"],
  "categories": ["facility", "item"],
  "attributes": {
    "volume": 8,
    "mass": 1200
  },
  "facility": {
    "transformations": [
      {
        "id": "tf-ore-to-ingot",
        "label": "粗炼",
        "instruction": "读取源物品；若 tags 含「原料」则保留质量大部分、名称改为锭、去掉「原料」并增加「金属锭」；否则仅更新 description 说明失败原因。",
        "acceptedSourceTags": ["原料"]
      }
    ],
    "consumptions": [
      {
        "id": "burn-fuel",
        "tag": "燃料",
        "amountPerMinute": 0.2
      }
    ]
  },
  "metadata": {
    "units": { "volume": "m3", "mass": "kg" },
    "schemaVersion": "1.0.0"
  }
}
```

---

## LLM 转化接口建议（实现时）

- **输入**：`facility`、当前 `WorldItem`（源物）、可选世界上下文。  
- **输出**：完整新 `WorldItem`，或 **JSON Patch / merge patch** 只在 `facility` 要求下改动物品各字段。  
- **校验**：服务端对 `name`、`tags`、`categories`、`attributes` 做类型与范围校验，防止模型输出非法结构。

---

## 与 demo 页的对应关系

后续 `ai-world-item-generator-demo.html` 或封装模块可据此渲染表单：基础字段 + 当勾选/包含设施类别时展开「转化列表」「按 tag 消耗列表」。
