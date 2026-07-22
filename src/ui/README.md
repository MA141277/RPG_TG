# ui

这里放页面、组件、全局面板和交互绑定代码。

规则：

- 不直接写领域规则
- 不直接决定事件前置是否成立
- 只负责显示状态和转发用户操作

优先补齐的视图：

- `views/map/map-view.ts`
- `views/city/city-view.ts`
- `views/dialogue/dialogue-view.ts`
- `views/minigame/minigame-view.ts`

优先补齐的组件：

- `components/dialog/dialog-box.ts`
- `components/choice/choice-list.ts`
- `components/character/character-portrait.ts`
- `components/command/command-menu.ts`
- `components/modal/modal.ts`
- `components/toast/toast.ts`

优先补齐的面板：

- `panels/mission-panel.ts`
- `panels/calendar-panel.ts`
- `panels/inventory-panel.ts`
- `panels/status-sheet-panel.ts`
- `panels/notification-log-panel.ts`
