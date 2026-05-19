# 前端命名与拆分规范

## 1. 命名总原则

命名先表达职责，再表达范围，不要用视觉位置或临时语义命名。

推荐：

- `city-list-panel`
- `mission-summary-card`
- `trigger-house-enter-events`
- `resolve-event-conditions`

禁止：

- `left-panel`
- `big-card`
- `temp-data`
- `doStuff`

## 2. 文件与目录命名

### 文件名

- 全部使用 `kebab-case`
- 类型文件用业务名，不加 `types` 大杂烩文件名
- 一个文件只暴露一个主要职责

推荐：

- `event-runner.ts`
- `trigger-evaluator.ts`
- `house-view.ts`
- `mission-panel.ts`

不推荐：

- `utils.ts`
- `common.ts`
- `page2.js`

### 目录名

- 目录用职责名，不用技术心智负担过重的缩写
- 页面目录按视图拆，系统目录按流程拆

推荐：

- `application/events`
- `application/navigation`
- `ui/views/map`
- `ui/components/dialog`

## 3. TypeScript 命名规范

### 类型与枚举

- 类型别名、接口、枚举值使用 `PascalCase`
- 枚举字符串值保持稳定、可序列化，优先 `kebab-case`

推荐：

- `EventDefinition`
- `GameState`
- `SceneStatus`
- `"house-enter"`

### 变量与函数

- 变量、函数使用 `camelCase`
- 布尔值必须带判断语义前缀：`is` `has` `can` `should`
- 事件处理函数统一 `handleXxx`
- 计算函数统一 `getXxx` / `selectXxx` / `resolveXxx`
- 有副作用的应用层动作统一动词开头：`startEvent` `enterHouse` `applyEffects`

推荐：

- `isEventAvailable`
- `hasRequiredParticipants`
- `handleHouseClick`
- `resolveSceneStep`
- `startMission`

### 常量

- 模块内常量用 `camelCase`
- 跨模块共享常量用 `UPPER_SNAKE_CASE`

推荐：

- `defaultTriggerPriority`
- `MAX_DIALOGUE_OPTIONS`

### ID 命名

所有内容对象 ID 统一 `dot.case`，格式稳定，可直接给模组覆盖：

- `chapter.rising_sun`
- `event.gifu.council_001`
- `scene.gifu.council_001`
- `city.gifu`
- `house.gifu.castle`
- `char.oda_nobunaga`
- `bg.council_room`
- `bgm.midsummer_duel`

规则：

- 第一段固定对象类型
- 中间段表达归属域
- 最后一段表达业务名或序号
- 不用中文、不用空格、不用数组下标

## 4. JS/TS 模块拆分

前端代码建议按“依赖方向”拆，不按“都是 js”堆在一起。

```text
src/
  content/        # 纯配置数据
  domain/         # 类型、规则、领域纯函数
  application/    # 流程编排、命令、runner、selector
  ui/             # 页面、组件、面板、视图适配
  shared/         # 真正跨层通用的小工具，数量必须少
  styles/         # 全局样式资产
```

### `domain`

职责：

- 类型定义
- 条件结构
- 领域纯函数
- 不依赖 DOM、不依赖组件

适合放：

- `event.ts`
- `game-state.ts`
- `evaluate-condition.ts`

### `application`

职责：

- 把用户操作转成系统流程
- 调用领域规则
- 更新状态
- 驱动事件和场景

推荐拆法：

```text
application/
  events/
    event-runner.ts
    trigger-evaluator.ts
    event-queue.ts
  navigation/
    enter-city.ts
    enter-house.ts
    travel-to-city.ts
  scene/
    scene-runner.ts
    choice-resolver.ts
  missions/
    mission-service.ts
  selectors/
    select-current-city.ts
    select-available-events.ts
```

规则：

- 一个文件一个动作或一个服务
- 不在 `application` 写具体 DOM 操作
- 不把 `application` 写成巨型 store 文件

### `ui`

职责：

- 只负责显示和交互绑定
- 从 `application/selectors` 取数据
- 把点击行为交给 `application` 命令

推荐拆法：

```text
ui/
  views/
    map/
      map-view.ts
    city/
      city-view.ts
    house/
      house-view.ts
    scene/
      scene-view.ts
  components/
    button/
      button.ts
    dialog/
      dialog-box.ts
    character/
      character-card.ts
  panels/
    player-card-panel.ts
    mission-panel.ts
```

完整太阁式游戏的组件缺口和优先级见：

- [game-component-inventory.md](D:/RPG_TG/docs/game-component-inventory.md)

规则：

- `view` 组织页面级骨架
- `component` 组织可复用块
- `panel` 组织全局常驻区域
- 不在 UI 组件里直接判断复杂事件前置

### `shared`

只允许放两类东西：

- 无业务语义的纯工具
- 非领域专属的基础 helper

推荐：

- `assert.ts`
- `clamp.ts`
- `create-id-set.ts`

禁止把业务逻辑塞进 `shared`。

## 5. import 方向约束

依赖方向固定：

`content -> domain -> application -> ui`

允许：

- `application` 引用 `domain`
- `ui` 引用 `application` 和 `domain` 的只读类型

禁止：

- `domain` 引用 `ui`
- `content` 引用 `application`
- `ui` 反向修改 `content`

如果某模块需要反向依赖，通常说明拆分边界错了。

## 6. barrel 文件规范

- `index.ts` 只用于稳定导出入口
- 不要每层目录都到处建 barrel
- 深层模块优先显式路径导入，减少循环依赖

推荐：

- `domain/index.ts`

谨慎使用：

- `ui/index.ts`
- `application/index.ts`

## 7. CSS 命名规范

CSS 类名统一用语义前缀：

- `l-`：布局
- `c-`：组件
- `view-`：页面
- `p-`：全局面板
- `u-`：工具类
- `is-` / `has-`：状态

推荐：

- `l-shell`
- `c-dialog`
- `view-house`
- `p-player-card`
- `is-selected`

禁止：

- `red-text`
- `mt20`
- `left-box`

说明：

- 不把样式含义绑死在颜色和位置上
- 少量工具类可以有，但不能退化成一堆原子类手写体系

## 8. CSS 文件拆分

当前可先保留扁平文件：

- `tokens.css`
- `base.css`
- `layout.css`
- `components.css`
- `views.css`

当项目变大后，扩成目录：

```text
styles/
  app.css
  tokens/
    color.css
    space.css
    motion.css
  base/
    reset.css
    typography.css
  layouts/
    shell.css
    sidebar.css
  components/
    button.css
    dialog.css
    character-card.css
  views/
    map-view.css
    city-view.css
    house-view.css
    scene-view.css
  utilities/
    visibility.css
    state.css
```

扩容规则：

- 一个文件超过约 250 行就考虑拆分
- 某类组件超过 5 个就考虑建立子目录
- 页面特有样式不准回流到 `components`

## 9. CSS 编写约束

- token 优先，禁止硬编码重复颜色和间距
- 组件样式最大嵌套不超过 3 层选择器
- 页面样式只改布局与场景，不重写组件内部结构
- 状态使用类切换，不依赖 `style=""`
- 动画时长和层级统一走 token

推荐：

- `.c-dialog.is-active`
- `.view-map .c-panel`

不推荐：

- `.view-map > div > div > .panel span`

## 10. 事件与前端命名对齐

事件系统相关文件统一按职责命名：

- `trigger-evaluator.ts`：筛选候选事件
- `condition-evaluator.ts`：判断条件树
- `participant-resolver.ts`：校验参与者
- `event-runner.ts`：真正启动事件
- `scene-runner.ts`：执行 action 列表
- `effect-applier.ts`：应用数据变更

不要写成：

- `event-helper.ts`
- `scene-utils.ts`
- `core.ts`

## 11. 团队协作最低要求

每次新增文件前先问三个问题：

1. 这是领域规则、流程编排，还是 UI 呈现？
2. 这个名字三个月后别人还能一眼看懂吗？
3. 这个文件未来会不会变成垃圾桶？

只要第三个问题答案是“会”，就先重拆。
