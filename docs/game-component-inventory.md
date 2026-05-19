# 游戏组件缺口清单

这份清单用于回答“完整太阁式 HTML 游戏还缺哪些组件”。这里的组件不只指 UI 控件，也包括系统模块、应用服务、数据模型和开发工具。

## 1. 当前已有基础

已经有初始骨架：

- `domain`：角色、城市、房屋、地图、任务、事件、场景 action、全局 UI、游戏状态
- `application/events`：事件条件判断、参与者校验、触发筛选、启动事件
- `application/navigation`：进入房屋
- `ui`：房屋视图模型、玩家卡面板模型
- `styles`：token、base、layout、component、panel、view、utility

这说明项目已经能承接主循环，但还没有形成完整游戏闭环。

## 2. P0 必须组件

P0 是“没有它就跑不通主流程”的组件。

| 组件 | 类型 | 作用 | 建议位置 |
| --- | --- | --- | --- |
| `game-store` | application | 保存、读取、派发 `GameState` | `src/application/state` |
| `scene-runner` | application | 顺序执行 `ActionNode[]` | `src/application/scene` |
| `choice-resolver` | application | 处理选择肢、跳转、效果 | `src/application/scene` |
| `effect-applier` | application | 统一修改 flag、变量、任务、属性 | `src/application/effects` |
| `resource-registry` | domain/application | 管理背景、音乐、头像、立绘路径 | `src/domain/resource.ts` |
| `map-view` | ui view | 显示地图、城池节点、移动入口 | `src/ui/views/map` |
| `city-view` | ui view | 显示城市房屋列表 | `src/ui/views/city` |
| `scene-view` | ui view | 显示背景、人物、对话、选项 | `src/ui/views/scene` |
| `dialog-box` | ui component | 对话文本、说话人、继续提示 | `src/ui/components/dialog` |
| `choice-list` | ui component | 选择肢列表 | `src/ui/components/choice` |
| `character-portrait` | ui component | 人物头像或立绘 | `src/ui/components/character` |
| `audio-manager` | application | 播放 BGM、SE、停止与切换 | `src/application/audio` |
| `save-service` | application | 存档、读档、自动存档 | `src/application/save` |

建议先做 P0。完成后，游戏至少能走通：

`地图 -> 城市 -> 房屋 -> 触发事件 -> 场景演出 -> 选择肢 -> 改状态 -> 返回主循环`

## 3. P1 核心玩法组件

P1 是太阁式体验开始成立所需的组件。

| 组件 | 类型 | 作用 | 建议位置 |
| --- | --- | --- | --- |
| `calendar-service` | application | 日期推进、月份变化、触发日程事件 | `src/application/calendar` |
| `mission-service` | application | 主线、支线、委托、完成条件 | `src/application/missions` |
| `character-service` | application | 属性、身份、亲密度、所在地变化 | `src/application/characters` |
| `faction-service` | application | 势力、家主、同盟、敌对、从属 | `src/application/factions` |
| `city-service` | application | 城池归属、规模、治安、商业、石高 | `src/application/cities` |
| `inventory-service` | application | 物品、装备、贵重品 | `src/application/inventory` |
| `trade-service` | application | 买卖、行情、特产品、利润 | `src/application/trade` |
| `skill-service` | application | 技能、札、称号、学习条件 | `src/application/skills` |
| `relationship-service` | application | 亲密度、仇敌、师徒、仕官关系 | `src/application/relationships` |
| `command-menu` | ui component | 房屋或人物功能命令列表 | `src/ui/components/command` |
| `status-sheet` | ui panel | 玩家详细属性页 | `src/ui/panels/status-sheet-panel.ts` |
| `mission-panel` | ui panel | 当前任务与目标追踪 | `src/ui/panels/mission-panel.ts` |
| `inventory-panel` | ui panel | 物品和装备查看 | `src/ui/panels/inventory-panel.ts` |
| `calendar-panel` | ui panel | 年月日、季节、行动周期 | `src/ui/panels/calendar-panel.ts` |
| `notification-log` | ui panel | 系统提示和历史记录 | `src/ui/panels/notification-log-panel.ts` |

P1 完成后，玩家会感觉这是一个能持续游玩的角色养成与策略模拟框架。

## 4. P2 太阁特色组件

P2 决定“像不像太阁”，但不阻塞第一版主循环。

| 组件 | 类型 | 作用 | 建议位置 |
| --- | --- | --- | --- |
| `occupation-service` | application | 武士、商人、忍者、海贼、浪人等身份路线 | `src/application/occupations` |
| `rank-service` | application | 官位、家中地位、身份晋升 | `src/application/ranks` |
| `home-service` | application | 自宅、家臣、妻子、收藏、休息 | `src/application/home` |
| `training-service` | application | 道场、师事、能力修炼 | `src/application/training` |
| `tea-service` | application | 茶席、名物、亲密度变化 | `src/application/tea` |
| `duel-service` | application | 一骑讨、胜负、伤病 | `src/application/duel` |
| `battle-service` | application | 合战、部队、兵种、战场结果 | `src/application/battle` |
| `diplomacy-service` | application | 同盟、臣服、交涉、停战 | `src/application/diplomacy` |
| `rumor-service` | application | 情报、传闻、触发提示 | `src/application/rumors` |
| `collection-panel` | ui panel | 名物、札、称号、CG/回想 | `src/ui/panels/collection-panel.ts` |
| `relationship-map` | ui view | 人物关系网 | `src/ui/views/relationships` |
| `faction-map` | ui view | 势力关系与城池归属 | `src/ui/views/factions` |

这些组件适合等 P0/P1 稳定后并行开发。

## 5. 小游戏接入组件

小游戏不要直接改主状态，必须通过统一接口接入。

| 组件 | 类型 | 作用 | 建议位置 |
| --- | --- | --- | --- |
| `minigame-registry` | application | 注册小游戏 ID 和入口 | `src/application/minigames` |
| `minigame-runner` | application | 启动、结束、回传结果 | `src/application/minigames` |
| `minigame-view` | ui view | 小游戏容器页 | `src/ui/views/minigame` |
| `minigame-result-dialog` | ui component | 胜负、奖励、失败后果 | `src/ui/components/minigame` |

建议接口：

```ts
type MinigameResult = {
  outcome: "success" | "failure" | "cancelled";
  score?: number;
  effects?: Effect[];
};
```

这样茶席、剑术、军学、商业小游戏都能返回同一类结果。

## 6. 模组与开发工具组件

这些组件不是首屏玩法，但对多人 webcoding 很关键。

| 组件 | 类型 | 作用 | 建议位置 |
| --- | --- | --- | --- |
| `content-loader` | application | 加载本体内容和模组内容 | `src/application/content` |
| `mod-manifest` | domain | 描述模组 ID、版本、依赖、覆盖策略 | `src/domain/mod.ts` |
| `content-validator` | application/tooling | 校验 ID、引用、事件条件、资源路径 | `src/application/content` |
| `event-debugger` | ui tool | 查看为什么事件触发或未触发 | `src/ui/tools/event-debugger` |
| `state-inspector` | ui tool | 查看当前 `GameState` | `src/ui/tools/state-inspector` |
| `content-browser` | ui tool | 查看人物、城池、事件、任务配置 | `src/ui/tools/content-browser` |
| `import-export-service` | application | 存档和模组导入导出 | `src/application/io` |

多人开发时，`event-debugger` 和 `content-validator` 的价值很高。事件系统一复杂，靠肉眼排查会很慢。

## 7. 通用 UI 组件

这些是所有页面都会反复用到的基础 UI。

| 组件 | 作用 | 建议位置 |
| --- | --- | --- |
| `icon-button` | 工具栏按钮、关闭、返回、设置 | `src/ui/components/button` |
| `text-button` | 明确文字命令 | `src/ui/components/button` |
| `modal` | 设置、存档、确认操作 | `src/ui/components/modal` |
| `tabs` | 状态页、背包、情报多页切换 | `src/ui/components/tabs` |
| `tooltip` | 图标按钮说明 | `src/ui/components/tooltip` |
| `progress-meter` | 经验、亲密度、城池开发度 | `src/ui/components/meter` |
| `stat-grid` | 角色属性、城市属性、势力属性 | `src/ui/components/stat` |
| `empty-state` | 列表为空时的占位 | `src/ui/components/empty-state` |
| `confirm-dialog` | 丢弃、覆盖存档、离开小游戏 | `src/ui/components/dialog` |
| `toast` | 简短系统反馈 | `src/ui/components/toast` |

这些组件可以先做 view model，再根据最终框架决定 DOM / React / Vue 实现。

## 8. 推荐开发顺序

第一阶段：

1. `game-store`
2. `scene-runner`
3. `effect-applier`
4. `map-view`
5. `city-view`
6. `scene-view`
7. `dialog-box`
8. `choice-list`

第二阶段：

1. `mission-service`
2. `calendar-service`
3. `character-service`
4. `inventory-service`
5. `trade-service`
6. `save-service`
7. `notification-log`

第三阶段：

1. `content-loader`
2. `content-validator`
3. `mod-manifest`
4. `event-debugger`
5. `minigame-registry`
6. `minigame-runner`

## 9. 当前最明显的缺口

现在最缺的不是更多 UI 卡片，而是三个执行核心：

- `scene-runner`
- `effect-applier`
- `game-store`

没有这三个，事件可以被定义和筛选，但还不能稳定推进、修改状态和驱动画面。

这三个核心现在已经有第一版骨架：

- [scene-runner.ts](D:/RPG_TG/src/application/scene/scene-runner.ts)
- [choice-resolver.ts](D:/RPG_TG/src/application/scene/choice-resolver.ts)
- [effect-applier.ts](D:/RPG_TG/src/application/effects/effect-applier.ts)
- [game-store.ts](D:/RPG_TG/src/application/state/game-store.ts)

当前已支持的流程：

1. 从激活场景开始执行
2. 在 `background / music / dialogue / choice` 处停下
3. 继续推进 `cursor`
4. 执行 `effect`
5. 处理 `jump`
6. 启动 `start-event`
7. 通过选择肢修改任务和角色数据
