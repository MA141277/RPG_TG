# HTML 版《太阁立志传》复刻项目基线

这是第一版工程基线，目标不是直接开做页面，而是先把多人协作最容易失控的三件事固定下来：

- 领域数据结构
- 模块边界与代码规范
- CSS 拆分策略

当前目录结构：

```text
docs/
  architecture.md
  change-log.md
  collaboration.md
  frontend-conventions.md
  game-component-inventory.md
src/
  application/
    README.md
  content/
    base/
    sample-scenario.ts
  domain/
    action.ts
    character.ts
    city.ts
    event.ts
    game-state.ts
    global-ui.ts
    house.ts
    index.ts
    map.ts
    mission.ts
  shared/
    README.md
  styles/
    app.css
    base.css
    components.css
    layout.css
    tokens.css
    views.css
  ui/
    README.md
```

建议后续技术方向：

- 语言：TypeScript
- 渲染：原生 DOM / Vue / React 都可以，但领域层保持框架无关
- 状态：单一 `GameState`，按 `map / city / house / scene / ui` 分 slice
- 内容：剧情、城市、人物、房屋、小游戏入口统一走配置驱动

规范补充文档：

- 架构设计：[docs/architecture.md](D:/RPG_TG/docs/architecture.md)
- 变更记录：[docs/change-log.md](D:/RPG_TG/docs/change-log.md)
- 协作规范：[docs/collaboration.md](D:/RPG_TG/docs/collaboration.md)
- 前端命名与拆分规范：[docs/frontend-conventions.md](D:/RPG_TG/docs/frontend-conventions.md)
- 游戏组件缺口清单：[docs/game-component-inventory.md](D:/RPG_TG/docs/game-component-inventory.md)

入口开发顺序建议：

1. 先跑通 `地图 -> 城市 -> 房屋 -> 角色功能 -> 事件动作列表`
2. 再补数值系统、任务系统、交易系统、小游戏系统
3. 最后再做模组加载器、存档、多人协作工具链
