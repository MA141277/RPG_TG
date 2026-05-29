# 主线剧情数据合同

这份文档定义后续主线剧情推荐采用的数据结构与目录方式。

目标：

- 主线继续复用现有 `EventDefinition -> SceneDefinition -> ActionNode -> Effect` 运行链
- 不在 `src/main.ts` 或具体 house 里硬写主线分支
- 剧情推进统一落在 `GameState.runtime.flags / variables / eventHistory`
- 主线、支线、人物事件都用同一种事件系统，只在内容组织方式上区分

## 核心设计

主线建议由四层数据组成：

1. `StoryArcDefinition`
2. `StoryBeatDefinition`
3. `EventDefinition`
4. `SceneDefinition`

职责边界：

- `StoryArcDefinition`：整条主线的章节索引、入口事件、阶段变量
- `StoryBeatDefinition`：一个相对完整的剧情节拍，管理该节拍关联的事件集合
- `EventDefinition`：定义何时触发、能否触发
- `SceneDefinition`：定义触发后具体播什么内容

## 推荐目录

建议在 `src/content/story/` 下按以下方式组织：

- `src/content/story/<arc-id>-main-story.ts`
- 后续如果一条主线过大，再拆为：
- `src/content/story/<arc-id>/arc.ts`
- `src/content/story/<arc-id>/beats.ts`
- `src/content/story/<arc-id>/events.ts`
- `src/content/story/<arc-id>/scenes.ts`

先用单文件跑通，再在体量变大后拆目录，避免一开始就过度分拆。

## StoryArcDefinition

推荐结构见 [src/domain/story.ts](/D:/RPG_TG/src/domain/story.ts:1)：

```ts
type StoryArcDefinition = {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  entryEventId: EventId;
  stageVariableKey: string;
  defaultStage: string;
  beatIds: string[];
  tags?: string[];
};
```

规则：

- `id` 必须稳定，不随文案变化
- `entryEventId` 只指向第一段入口事件，不负责整条主线跳转
- `stageVariableKey` 是大阶段推进键，建议固定为 `var.story.<arcId>.stage`
- `defaultStage` 是新档或未初始化时的默认阶段

## StoryBeatDefinition

推荐结构见 [src/domain/story.ts](/D:/RPG_TG/src/domain/story.ts:1)：

```ts
type StoryBeatDefinition = {
  id: string;
  arcId: string;
  title: string;
  summary: string;
  eventIds: EventId[];
  completionFlagKey?: string;
  nextBeatId?: string;
  tags?: string[];
};
```

规则：

- 一个 beat 代表一个剧情推进节拍，不要把整章塞成一个 beat
- `eventIds` 允许一个 beat 内含多个触发点
- `completionFlagKey` 建议固定为 `flag.story.<arcId>.<beatId>.completed`
- `nextBeatId` 是内容索引，不是运行时硬跳转机制

## 剧情推进状态

建议只用三类统一状态：

- 大阶段：`runtime.variables["var.story.<arcId>.stage"]`
- 节拍完成：`runtime.flags["flag.story.<arcId>.<beatId>.completed"]`
- 触发历史：`runtime.eventHistory[eventId]`

推荐分工：

- `stage` 控制大范围开放内容
- `flag` 控制局部前置、选项结果、回流判断
- `eventHistory` 只负责事件是否触发过以及触发次数

不要把所有主线语义都压进 `eventHistory`。

## Event 设计规则

主线事件继续使用 [src/domain/event.ts](/D:/RPG_TG/src/domain/event.ts:1)。

推荐触发粒度：

- “进某城后第一次遇见某人”是一个 event
- “进某屋触发一段交代剧情”是一个 event
- “日期推进后触发催促”是一个 event

不推荐：

- 一整章只做一个超长 event
- 用 `main.ts` 判断主线阶段后手动播剧情

优先使用现有触发时机：

- `city-enter`
- `house-enter`
- `talk`
- `date-change`
- `turn-end`
- `travel-complete`

## Scene 设计规则

主线 scene 继续使用 [src/domain/action.ts](/D:/RPG_TG/src/domain/action.ts:1)。

scene 只负责：

- 背景
- 音乐
- 对话
- 选项
- 结构化 effect
- jump
- start-event

scene 不负责：

- 大量触发前置判断
- 直接读写 DOM
- 依赖页面组件生命周期决定剧情成败

## 命名规范

推荐：

- 主线阶段变量：`var.story.zhu_yuanzhang.stage`
- 节拍完成标记：`flag.story.zhu_yuanzhang.temple-departure.completed`
- 主线事件：`event.story.zhu_yuanzhang.temple_departure`
- 主线场景：`scene.story.zhu_yuanzhang.temple_departure`

统一前缀能降低后续排查和存档迁移成本。

## 现代码中的落地建议

当前仓库已经有：

- 事件触发评估器 [src/application/events/trigger-evaluator.ts](/D:/RPG_TG/src/application/events/trigger-evaluator.ts:1)
- 场景执行器 [src/application/scene/scene-runner.ts](/D:/RPG_TG/src/application/scene/scene-runner.ts:1)
- 选项结算器 [src/application/scene/choice-resolver.ts](/D:/RPG_TG/src/application/scene/choice-resolver.ts:1)
- 朱元璋阶段变量示例 [src/domain/zhu-yuanzhang-story.ts](/D:/RPG_TG/src/domain/zhu-yuanzhang-story.ts:1)

因此新增主线时，不要另造“剧情管理器”。优先做：

1. 新增 arc / beat 内容文件
2. 把 event / scene 注册进现有内容汇总
3. 用 `flags + variables + eventHistory` 推进

## 当前风险

[src/application/effects/effect-applier.ts](/D:/RPG_TG/src/application/effects/effect-applier.ts:1) 里的 `modify-character-stat` 仍直接改 `characterDefinitions`，没有完全并入统一 `GameState`。

这在 demo 阶段可用，但主线扩大后会带来：

- 存档恢复口径不统一
- 角色数值变化来源分裂
- 剧情效果更难回放和排查

建议后续把角色运行态也逐步收进统一状态结构。
