# application

这里放流程编排代码，不放纯内容配置，也不放 UI 组件。

典型职责：

- 导航命令
- 事件触发与执行
- 场景推进
- 任务状态流转
- selector 与 service

优先补齐：

- `state/game-store.ts`
- `state/game-store-example.ts`
- `state/create-initial-state.ts`
- `scene/scene-runner.ts`
- `scene/choice-resolver.ts`
- `effects/effect-applier.ts`
- `audio/audio-manager.ts`
- `save/save-service.ts`
- `content/content-loader.ts`
- `content/content-validator.ts`

游戏系统逐步扩展：

- `calendar`
- `characters`
- `cities`
- `factions`
- `inventory`
- `trade`
- `skills`
- `relationships`
- `minigames`

当前已补上的主循环核心：

- `state/game-store.ts`
- `scene/scene-runner.ts`
- `scene/choice-resolver.ts`
- `effects/effect-applier.ts`

它们现在已经能处理：

- 进入已激活场景
- 停在 `background / music / dialogue / choice`
- 继续推进 scene cursor
- 处理 `effect / jump / start-event`
- 通过选择肢修改任务和角色状态
