# Main Shell Contract

本文档定义 `src/main.ts` 的长期职责边界，以及资源、布局、样式和过渡层的协作规则。目标是确保入口文件保持为薄 shell，只负责装配、启动和顶层事件转发，不再承载地图、背包、house、剧情、运行时、UI、资源和样式业务逻辑。

## 目标

`src/main.ts` 应该是应用启动壳，而不是功能实现文件。

入口文件允许做：

- 创建根 DOM 引用。
- 创建初始 app state。
- 装配 runtime / coordinator / renderer / store。
- 注册少量顶层浏览器事件。
- 把事件转发给专门的 coordinator。
- 调用统一 render coordinator 刷新界面。
- 启动应用首帧。

入口文件不允许做：

- 直接实现地图交互业务。
- 直接实现背包、卡牌、贵重物、角色详情业务。
- 直接实现 house 特判。
- 直接实现小游戏、playable、battle、event、scene、dialogue 的业务流程。
- 直接拼接或维护 UI HTML。
- 直接处理具体 `data-action` 的大量分支。
- 直接修改角色、金币、物品、任务、剧情 flag 等持久状态。
- 直接 import 具体 house module 或具体业务模块来做分支判断。
- 直接 import 具体资源文件。
- 直接生成或切换具体 CSS class。

## `main.ts` 允许的职责

### Shell Boot

允许：

```ts
const appElement = document.querySelector<HTMLElement>("#app");
const overlayElement = document.querySelector<HTMLElement>("#ui-overlay");

const appRuntime = createMainRuntimeOrchestrator(...);
const renderer = createAppRenderCoordinator(...);

renderer.render();
```

不允许：

```ts
if (currentHouse.moduleId === "grain-shop") {
  executeGrainTrade(...);
}
```

### Dependency Composition

`main.ts` 可以把模块装配到一起，但不能知道模块内部业务。

允许：

```ts
const interactiveActionCoordinator = createInteractiveActionCoordinator({
  getState,
  setState,
  commitRuntimeRequest,
  render,
});
```

不允许：

```ts
if (actionId === "interactive.city-begging.complete") {
  const result = completeCityBeggingPlayable(...);
  appState = result.state;
}
```

### Top-Level Event Forwarding

`main.ts` 可以注册顶层 DOM 事件，但应只提取通用事件上下文并转发。

允许：

```ts
appElement.addEventListener("click", (event) => {
  appActionCoordinator.handleClick(event);
});
```

不允许：

```ts
appElement.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (target.closest("[data-action='open-backpack']")) {
    appState.ui.overlay = "backpack";
    renderApp();
    return;
  }

  if (target.closest("[data-action='grain-shop-buy']")) {
    executeGrainTrade(...);
    renderApp();
    return;
  }
});
```

### Rendering Entry Point

`main.ts` 可以调用统一渲染入口，但不能自己拼 UI。

允许：

```ts
renderCoordinator.render(appState);
```

不允许：

```ts
appRoot.innerHTML = `
  <div class="inventory-panel">
    ...
  </div>
`;
```

## 禁止出现在 `main.ts` 的内容

### 具体 House 分支

禁止：

```ts
if (house.moduleId === "grain-shop") {}
if (house.moduleId === "medicine-house") {}
if (house.moduleId === "tea-house") {}
if (house.moduleId === "tavern") {}
if (house.moduleId === "temple-house") {}
if (house.moduleId === "leader-residence") {}
```

正确位置：

- `src/application/house-modules/*`
- `src/core/runtime/house-runtime.ts`
- `src/ui/views/house/*`
- house module registry

### 背包业务

禁止：

```ts
runBackpackItemAction(...);
equipValuableItem(...);
openBackpackOverlay(...);
```

正确位置：

- `src/application/backpack/*`
- `src/domain/backpack/*`
- `src/ui/views/inventory/*`
- backpack coordinator

### 地图业务

禁止：

```ts
createHexTravelPath(...);
revealCampaignMapAroundCoordinate(...);
isCampaignMapCoordinateClickable(...);
```

正确位置：

- `src/application/map/*`
- `src/application/navigation/*`
- `src/application/runtime/*map*`
- `src/ui/views/map/*`

### 运行时结算业务

禁止：

```ts
settleRuntimeEffects(...);
mutateCharacterNumericProperty(...);
applySettlementContents(...);
```

正确位置：

- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/state-sync-runtime.ts`
- `src/core/runtime/runtime-dispatch.ts`

### Playable / Minigame 业务

禁止：

```ts
completeCityBeggingPlayable(...);
settleMedicineCompoundingPlayable(...);
answerGrainAccountingPlayable(...);
dispatchStoryBattlePlayableAction(...);
```

正确位置：

- `src/application/playables/*`
- `src/core/runtime/playable-runtime.ts`
- `src/core/runtime/interactive-runtime.ts`

### 剧情 / Event / Dialogue 业务

禁止：

```ts
startEvent(...);
runSceneUntilPause(...);
advanceScene(...);
resolveChoiceOption(...);
continueStoryFromSourceEvent(...);
```

正确位置：

- `src/application/events/*`
- `src/application/story/*`
- `src/application/scene/*`
- `src/application/dialogue/*`
- `src/core/runtime/event-*`

## 新功能接入规则

任何新功能不得默认修改 `src/main.ts`。

新增功能时，应先判断功能类型：

| 功能类型 | 应进入的位置 |
| --- | --- |
| 地图交互 | `application/map` / `application/runtime/*map*` / `ui/views/map` |
| 背包物品 | `application/backpack` / `domain/backpack` / `ui/views/inventory` |
| House 行为 | house module / house runtime / house registry |
| 剧情事件 | `application/events` / `application/story` / event runtime |
| 对话流程 | dialogue runtime / dialogue runner / dialogue view |
| 小游戏 | playable runtime / `application/playables/*` |
| UI 渲染 | presenter / view / render coordinator |
| 启动流程 | startup coordinator |
| 状态写回 | state-sync runtime / runtime settlement |

如果找不到合适位置，应新增一个专门 coordinator 或 runtime seam，而不是把逻辑加回 `main.ts`。

## Action 分发规则

`main.ts` 不应拥有具体 action 分支。

不推荐：

```ts
if (target.matches("[data-action='open-backpack']")) {}
if (target.matches("[data-action='start-begging-minigame']")) {}
if (target.matches("[data-action='enter-city-3d']")) {}
```

推荐：

```ts
appActionCoordinator.dispatch({
  type: "click",
  target,
  event,
});
```

具体 action 应在对应 coordinator 中处理：

```ts
backpackActionCoordinator.register("open-backpack", handleOpenBackpack);
mapActionCoordinator.register("enter-city-3d", handleEnterCity3d);
interactiveActionCoordinator.register("start-begging-minigame", handleStartBegging);
```

## 不清楚放哪里时的默认处理

如果开发者不确定新逻辑应该放在哪个模块，默认不得把逻辑加到 `src/main.ts`。

应按以下顺序处理：

1. 先判断是否已有明确归属模块。
2. 如果没有明确归属，放入过渡层。
3. 在过渡层中用清晰命名标记 feature owner。
4. 增加 TODO / change-log 记录后续迁移目标。
5. 不允许过渡层逻辑反向 import UI 视图或具体 DOM。
6. 不允许把过渡层变成新的大入口。

### 过渡层位置

推荐新增或使用以下目录：

- `src/application/runtime/transition/`
- `src/application/runtime/compat/`
- `src/application/runtime/coordinators/`

推荐命名：

```txt
src/application/runtime/transition/<feature>-transition-coordinator.ts
src/application/runtime/compat/<feature>-compat-action.ts
src/application/runtime/coordinators/<feature>-action-coordinator.ts
```

示例：

```txt
src/application/runtime/transition/backpack-entry-transition.ts
src/application/runtime/transition/campaign-map-click-transition.ts
src/application/runtime/transition/house-action-transition.ts
src/application/runtime/transition/playable-action-transition.ts
```

### 过渡层允许做什么

过渡层允许：

- 接收来自 `main.ts` 的通用事件或 action。
- 解析 feature-level action。
- 调用现有 application/runtime/domain 模块。
- 返回统一结果给 shell。
- 暂时承接尚未归类的旧入口逻辑。
- 为后续正式 coordinator 留出边界。

示例：

```ts
export function handleBackpackTransitionAction(input: {
  state: AppState;
  actionId: string;
  payload?: Record<string, unknown>;
}): {
  state: AppState;
  handled: boolean;
} {
  if (input.actionId !== "open-backpack") {
    return {
      state: input.state,
      handled: false,
    };
  }

  return {
    state: openBackpackOverlay(input.state),
    handled: true,
  };
}
```

`main.ts` 只允许这样调用：

```ts
const result = transitionActionCoordinator.dispatch({
  state: appState,
  actionId,
  payload,
});

if (result.handled) {
  appState = result.state;
  render();
}
```

### 过渡层不允许做什么

过渡层不允许：

- 直接拼 HTML。
- 直接操作 DOM。
- 直接读取 `document.querySelector`。
- 直接修改全局变量。
- 直接依赖 `src/main.ts`。
- 同时处理多个无关 feature。
- 长期保留临时逻辑而没有迁移记录。

禁止：

```ts
document.querySelector("[data-action='open-backpack']");
appRoot.innerHTML = "...";
window.addEventListener("click", ...);
```

### 不确定归属时的决策表

| 新逻辑类型 | 放置位置 |
| --- | --- |
| 看起来是状态转换 | `src/application/runtime/transition/<feature>-transition.ts` |
| 看起来是 UI action 分发 | `src/application/runtime/coordinators/<feature>-action-coordinator.ts` |
| 看起来是旧逻辑兼容 | `src/application/runtime/compat/<feature>-compat.ts` |
| 看起来是 runtime 结果处理 | `src/core/runtime/*` 或 `src/application/runtime/*` |
| 看起来是业务规则 | `src/application/<feature>/*` |
| 看起来是纯数据结构 | `src/domain/*` |
| 看起来是显示模型 | `src/application/presenter/*` |
| 看起来是 HTML / DOM view | `src/ui/views/*` |
| 仍然无法判断 | `src/application/runtime/transition/unknown-action-transition.ts`，并必须记录迁移 TODO |

### Unknown Transition Rule

如果仍然不知道放哪里，可以临时放到：

```txt
src/application/runtime/transition/unknown-action-transition.ts
```

但必须满足：

- 单个函数只处理一个 action family。
- 文件顶部写明为什么暂时无法归类。
- `docs/change-log.md` 记录。
- 新增测试锁定行为。
- 后续有明确模块后必须迁出。

示例：

```ts
/**
 * Temporary transition owner for actions whose final module boundary is unclear.
 * Do not add a second unrelated action family here.
 * Migrate this to a feature coordinator once ownership is identified.
 */
export function handleUnknownTransitionAction(...) {}
```

## 过渡层生命周期

过渡层不是长期架构归属。

每个 transition / compat 文件必须在文件头记录：

- 创建日期。
- 负责 feature。
- 为什么暂时无法归类。
- 目标归属模块。
- 清理条件。

示例：

```ts
/**
 * Created: 2026-07-29
 * Feature: backpack item action dispatch
 * Reason: final backpack action coordinator is not extracted yet.
 * Target owner: src/application/backpack/backpack-action-coordinator.ts
 * Remove when: backpack action coordinator owns all backpack data-action handling.
 */
```

## 允许修改 `main.ts` 的情况

只有以下情况可以修改 `main.ts`：

1. 新增顶层 coordinator 装配。
2. 替换旧入口逻辑为 coordinator 调用。
3. 调整启动顺序。
4. 调整全局错误边界。
5. 调整顶层 DOM root 或 browser lifecycle。
6. 删除入口内旧业务代码。
7. 改善 shell 边界并减少入口职责。

任何修改都必须说明：

- 为什么不能放到已有 coordinator / runtime / presenter。
- 是否新增了业务分支。
- 是否增加了直接状态 mutation。
- 是否更新了 main shell guard 测试。

## 禁止修改 `main.ts` 的情况

以下需求不能直接修改 `main.ts`：

- 加一个地图按钮。
- 加一个背包操作。
- 加一个 house 功能。
- 加一个小游戏。
- 加一个剧情触发。
- 加一个 UI 弹窗。
- 加一个结算效果。
- 加一个 NPC 对话。
- 加一个角色状态变化。

这些都必须进入对应模块。

## 修改 `main.ts` 的测试优先规则

任何扩大 `main.ts` 职责的改动都必须先新增或更新 shell guard 测试。

如果确实需要临时修改 `main.ts`：

1. 先写测试证明这是 shell wiring，而不是业务逻辑。
2. 再修改 `main.ts`。
3. 同时记录迁出目标。

没有测试的 `main.ts` 业务改动不允许合入。

## `main.ts` Import 白名单

`main.ts` 只允许 import 以下类别：

- app shell / bootstrap。
- startup coordinator。
- runtime orchestrator。
- render coordinator。
- action coordinator。
- global styles。
- 顶层类型。

禁止直接 import：

- concrete house module。
- concrete playable definition。
- feature settlement helper。
- backpack business helper。
- map pathfinding helper。
- scene/event/dialogue runner。
- UI view renderer。
- concrete asset file。

如需新增 import，必须判断它是 coordinator 还是业务模块。业务模块不得直接进入 `main.ts`。

## 旧逻辑迁移例外

在 shell 化完成前，`main.ts` 可能仍有旧逻辑。

规则：

- 不要求一次性删除所有旧逻辑。
- 不允许基于旧逻辑继续扩展新功能。
- 修改旧逻辑时，优先迁到 coordinator / transition layer。
- 每次迁出后增加 guard，防止同类逻辑回流。

## Main Shell Definition of Done

`main.ts` shell 化完成标准：

- 不直接包含具体 feature business branch。
- 不直接包含 house module id 判断。
- 不直接包含 backpack / map / playable / event 业务处理。
- 不直接拼接 UI HTML。
- 顶层 DOM event listener 只转发给 coordinator。
- `renderApp()` 或等价函数只由 render coordinator 拥有。
- `main.ts` 行数低于约定阈值。
- `tests/main-shell-contract.test.cjs` 通过。
- 新增功能无需修改 `main.ts` 即可接入。

## 资源、布局、样式治理

资源、布局、样式必须单独立边界。否则即使 `main.ts` 不污染，UI 仍然会被随手 import 图片、随手写 CSS、随手改布局污染。

### 总原则

资源、布局、样式必须分层管理：

- 资源归资源 registry / manifest。
- 布局归 layout model / presenter / view。
- 样式归样式文件和 design tokens。
- runtime 不知道 CSS class。
- domain 不知道资源 URL。
- `main.ts` 不直接 import 业务资源、不直接改 class、不直接写 style。

## 资源管理

### 资源不得散落 import

禁止在业务逻辑或 `main.ts` 中直接写：

```ts
import iconUrl from "../assets/icon.png";
const bg = new URL("../assets/background.png", import.meta.url).href;
```

除非这是资源 registry 文件。

推荐：

```ts
const asset = assetRegistry.get("map.city.marker");
```

### 资源 registry

新增资源应进入明确 registry：

```txt
src/assets/
src/content/resource-manifest.ts
src/application/resources/
src/ui/resource-resolver.ts
```

建议结构：

```txt
src/content/resources/
  builtin-resource-manifest.ts
  map-resource-manifest.ts
  portrait-resource-manifest.ts
  ui-resource-manifest.ts

src/application/resources/
  resource-resolver.ts
  resource-url-resolver.ts
  resource-preload-plan.ts
```

### 资源 ID 规则

资源在数据层使用 ID，不使用文件路径。

推荐：

```json
{
  "portraitId": "portrait.zhu_yuanzhang.young",
  "backgroundId": "bg.temple.main",
  "mapTextureId": "map.yuanmo.terrain.grass"
}
```

禁止：

```json
{
  "portrait": "/src/assets/portraits/zyz.png"
}
```

### 资源解析

资源路径只在 resolver 中解析：

```ts
resolveResourceUrl(resourceId);
```

业务模块只传 `resourceId`。

## 布局管理

布局不能由 `main.ts` 拼。

### 布局归属

| 类型 | 归属 |
| --- | --- |
| 全局屏幕布局 | `src/ui/app-render.ts` / render coordinator |
| 地图布局 | `src/ui/views/map/*` |
| 背包布局 | `src/ui/views/inventory/*` |
| house 布局 | `src/ui/views/house/*` |
| 剧本编辑器布局 | `src/modules/script-editor/ui/*` |
| 可配置布局数据 | `src/content/layout-*` 或 scenario pack |
| 布局状态转换 | `src/application/presenter/*` 或 `src/application/runtime/*coordinator*` |

### Presenter 先于 View

复杂页面不应直接在 view 中读完整 `AppState`。

推荐：

```ts
const model = presentBackpackView(appState);
renderBackpackView(model);
```

不推荐：

```ts
renderBackpackView(appState, characterDefinitions, houses, maps, runtime, ...);
```

### 布局数据化

可复用布局应数据化，例如：

```ts
type LayoutSlot = {
  id: string;
  region: "left" | "right" | "bottom" | "overlay";
  componentId: string;
};
```

不要把可配置布局写死在 `main.ts` 或 runtime 中。

## 样式管理

### 样式只能在样式层

禁止在 runtime / application / main 中写：

```ts
element.style.left = "...";
element.classList.add("some-feature-class");
```

允许在 UI interaction 层做有限 DOM 同步，但业务状态不应依赖 DOM class。

### CSS 文件归属

建议：

```txt
src/styles/tokens.css
src/styles/app.css
src/styles/views.css
src/styles/map.css
src/styles/backpack.css
src/styles/house.css
src/styles/script-editor.css
```

或者保持现有文件，但必须有归属规则：

| 样式类型 | 文件 |
| --- | --- |
| 全局 token | `tokens.css` |
| App shell | `app.css` |
| 地图 | map / campaign 对应样式 |
| 背包 | backpack / inventory |
| house | 每个 house 自己样式或 shared house 样式 |
| 剧本编辑器 | script editor 专属样式 |
| 临时调试 | debug 专属样式，禁止混入业务样式 |

### 命名规则

推荐 BEM 或明确前缀：

```css
.c-backpack-panel {}
.c-map-toolbar {}
.c-house-dialogue {}
.c-script-editor-workbench {}
```

禁止无归属通用类：

```css
.panel {}
.button {}
.box {}
.left {}
.active {}
```

### Design Tokens

颜色、间距、z-index、字体大小应优先使用 token。

```css
:root {
  --color-surface-panel: #151515;
  --space-2: 8px;
  --z-overlay: 100;
}
```

组件样式引用 token，不硬编码大量新颜色。

## 样式防污染规则

禁止：

- 为一个页面临时加全局 `.button`。
- 在 `prototype.css` 继续堆所有新功能样式。
- 在地图样式文件里写背包样式。
- 在 house 样式里写全局 overlay。
- 在 runtime 文件里生成 CSS class 名称。
- 在 `main.ts` 里切换具体样式 class。

允许：

- UI view 根据 presenter model 输出 class。
- coordinator 改变状态，由 render 层决定 class。
- 低层 WebGL / canvas renderer 使用必要的 canvas 参数，但不接管 DOM 样式。

## Anti Hardcoded Style Rules

目标：避免后续样式继续写成临时硬编码，导致颜色、间距、z-index、字号、阴影、圆角、动画时间散落到各个 CSS 文件中。

### 总原则

新样式应优先使用 design tokens。

禁止无理由新增硬编码：

- 颜色。
- 间距。
- 字号。
- 圆角。
- 阴影。
- z-index。
- 动画时长。
- 断点。
- 透明度层级。

推荐：

```css
.c-backpack-panel {
  background: var(--color-surface-panel);
  color: var(--color-text-primary);
  padding: var(--space-3);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-overlay);
  z-index: var(--z-overlay);
}
```

不推荐：

```css
.c-backpack-panel {
  background: #121212;
  color: #f7f1df;
  padding: 17px;
  border-radius: 13px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  z-index: 9999;
}
```

### Design Token 分层

建议维护统一 token 文件：

```txt
src/styles/tokens.css
```

建议 token 分类：

```css
:root {
  /* Color */
  --color-bg-app: #0f1115;
  --color-surface-panel: #181b20;
  --color-surface-raised: #20242b;
  --color-border-subtle: rgba(255, 255, 255, 0.12);
  --color-text-primary: #f4f1e8;
  --color-text-muted: #b8b2a2;
  --color-accent-primary: #c89b3c;
  --color-danger: #d95f5f;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  /* Radius */
  --radius-control: 4px;
  --radius-panel: 8px;
  --radius-overlay: 8px;

  /* Typography */
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;

  /* Layer */
  --z-base: 0;
  --z-floating: 20;
  --z-overlay: 100;
  --z-modal: 200;
  --z-debug: 900;

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --duration-slow: 260ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Shadow */
  --shadow-panel: 0 8px 24px rgba(0, 0, 0, 0.28);
  --shadow-overlay: 0 16px 48px rgba(0, 0, 0, 0.36);
}
```

### 禁止硬编码范围

#### 颜色

禁止：

```css
color: #fff;
background: #181818;
border-color: rgba(255, 255, 255, 0.2);
```

推荐：

```css
color: var(--color-text-primary);
background: var(--color-surface-panel);
border-color: var(--color-border-subtle);
```

例外：

- canvas / shader / WebGL 专用计算色值。
- 第三方库覆盖时无法使用 token。
- 一次性 debug 边框，但必须放 debug 文件。

#### 间距

禁止随意新增：

```css
padding: 17px;
margin-top: 23px;
gap: 19px;
```

推荐：

```css
padding: var(--space-4);
gap: var(--space-3);
```

允许：

```css
border-width: 1px;
transform: translateX(-50%);
width: 100%;
height: 100%;
```

#### 字号

禁止：

```css
font-size: 15.5px;
font-size: 2.7vw;
```

推荐：

```css
font-size: var(--font-size-md);
```

不要用 viewport width 缩放字体。

#### z-index

禁止：

```css
z-index: 9999;
```

推荐：

```css
z-index: var(--z-modal);
```

如果必须新增层级，先加 token，不能在组件里直接写数字。

#### 圆角

禁止：

```css
border-radius: 999px;
border-radius: 14px;
```

推荐：

```css
border-radius: var(--radius-control);
```

例外：

- 圆形头像 / 圆形图标按钮可以使用 `50%`。
- 视觉规范明确要求 pill 时，可用 `--radius-pill`。

#### 动画时间

禁止：

```css
transition: opacity 173ms ease-out;
```

推荐：

```css
transition:
  opacity var(--duration-normal) var(--ease-standard),
  transform var(--duration-normal) var(--ease-standard);
```

## 资源和样式过渡方案

如果资源、布局、样式归属暂时不清楚：

- 资源进入 `src/content/resources/pending-resource-manifest.ts`。
- 布局进入 `src/application/presenter/pending-layout-presenter.ts`。
- 样式进入 `src/styles/pending.css`。

但必须：

- 文件头写明创建原因。
- 记录目标归属。
- 不允许长期扩张。
- 每个 pending 文件行数不超过阈值。
- 后续确认归属后迁出。

## 自动化守卫测试

应新增测试文件，例如：

```txt
tests/main-shell-contract.test.cjs
tests/style-token-contract.test.cjs
```

### 基础 main shell 守卫

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

function readMainSource() {
  return fs.readFileSync("src/main.ts", "utf8");
}

test("main.ts remains a shell and avoids concrete house business branches", () => {
  const source = readMainSource();

  assert.doesNotMatch(source, /moduleId\s*===/);
  assert.doesNotMatch(source, /grain-shop/);
  assert.doesNotMatch(source, /medicine-house/);
  assert.doesNotMatch(source, /tea-house/);
  assert.doesNotMatch(source, /tavern/);
  assert.doesNotMatch(source, /temple-house/);
  assert.doesNotMatch(source, /leader-residence/);
});
```

### 禁止具体业务 import

```js
test("main.ts does not import concrete feature business modules", () => {
  const source = readMainSource();

  assert.doesNotMatch(source, /application\/grain-shop/);
  assert.doesNotMatch(source, /application\/medicine-house/);
  assert.doesNotMatch(source, /application\/tea-house/);
  assert.doesNotMatch(source, /application\/tavern/);
  assert.doesNotMatch(source, /application\/house-modules\/.*house-module/);
  assert.doesNotMatch(source, /application\/playables\/.*definition/);
});
```

### 禁止直接结算

```js
test("main.ts does not perform direct runtime settlement or character mutation", () => {
  const source = readMainSource();

  assert.doesNotMatch(source, /settleRuntimeEffects/);
  assert.doesNotMatch(source, /applySettlementContents/);
  assert.doesNotMatch(source, /mutateCharacterNumericProperty/);
  assert.doesNotMatch(source, /mutateCharacterNumericAttributeBySemanticKey/);
});
```

### 禁止背包业务回流

```js
test("main.ts does not own backpack business behavior", () => {
  const source = readMainSource();

  assert.doesNotMatch(source, /runBackpackItemAction/);
  assert.doesNotMatch(source, /equipValuableItem/);
  assert.doesNotMatch(source, /getVisibleValuables/);
  assert.doesNotMatch(source, /getVisibleOwnedCards/);
});
```

### 限制 action 分支膨胀

```js
test("main.ts does not regain large data-action dispatch ownership", () => {
  const source = readMainSource();

  const dataActionMatches = source.match(/data-action=['"`]/g) ?? [];

  assert.ok(
    dataActionMatches.length <= 5,
    `main.ts should not own concrete data-action dispatches; found ${dataActionMatches.length}`
  );
});
```

这个阈值可以在 shell 化完成后逐步收紧到 `0`。

### 行数守卫

```js
test("main.ts stays within shell-size budget", () => {
  const source = readMainSource();
  const lineCount = source.split(/\r?\n/).length;

  assert.ok(
    lineCount <= 900,
    `main.ts should stay shell-sized; found ${lineCount} lines`
  );
});
```

行数阈值要等真正 shell 化完成后再启用。迁移中可以先设为较宽，例如 `2500`，之后逐步降。

### 过渡层无 DOM / 渲染守卫

```js
test("transition modules do not own DOM or rendering", () => {
  const files = collectFiles("src/application/runtime/transition");

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");

    assert.doesNotMatch(source, /document\.querySelector/);
    assert.doesNotMatch(source, /window\.addEventListener/);
    assert.doesNotMatch(source, /innerHTML\s*=/);
    assert.doesNotMatch(source, /renderAppMarkup/);
  }
});
```

### 过渡层体积守卫

```js
test("transition modules stay small", () => {
  const files = collectFiles("src/application/runtime/transition");

  for (const file of files) {
    const lineCount = fs.readFileSync(file, "utf8").split(/\r?\n/).length;

    assert.ok(
      lineCount <= 250,
      `${file} is too large for a transition module`
    );
  }
});
```

### 禁止 main.ts 直接 import 资源

```js
test("main.ts does not import concrete visual assets", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.doesNotMatch(source, /\.(png|jpg|jpeg|webp|svg|glb|gltf|mp3|wav)["']/);
  assert.doesNotMatch(source, /new URL\([^)]*assets/);
});
```

### 禁止 runtime 依赖 CSS

```js
test("runtime modules do not depend on CSS classes", () => {
  const files = collectFiles("src/core/runtime");

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");

    assert.doesNotMatch(source, /className/);
    assert.doesNotMatch(source, /classList/);
    assert.doesNotMatch(source, /\.css["']/);
  }
});
```

### 禁止业务层直接 import 资源

```js
test("application business modules do not directly import concrete assets", () => {
  const files = collectFiles("src/application");

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");

    assert.doesNotMatch(source, /\.(png|jpg|jpeg|webp|svg|glb|gltf|mp3|wav)["']/);
  }
});
```

资源 registry 文件可以例外。

### 检查 CSS 硬编码颜色

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function collectFiles(root, ext = ".css") {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath, ext);
    }
    return entry.isFile() && entry.name.endsWith(ext) ? [fullPath] : [];
  });
}

const ALLOWED_HARDCODED_STYLE_FILES = new Set([
  "src/styles/tokens.css",
]);

test("css files use design tokens instead of hardcoded colors", () => {
  const files = collectFiles("src/styles");

  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (ALLOWED_HARDCODED_STYLE_FILES.has(normalized)) {
      continue;
    }

    const source = fs.readFileSync(file, "utf8");

    assert.doesNotMatch(
      source,
      /#[0-9a-fA-F]{3,8}\b/,
      `${normalized} contains hardcoded hex color`
    );

    assert.doesNotMatch(
      source,
      /rgba?\(\s*\d+/,
      `${normalized} contains hardcoded rgb/rgba color`
    );
  }
});
```

### 检查 z-index 硬编码

```js
test("css files use z-index tokens", () => {
  const files = collectFiles("src/styles");

  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (ALLOWED_HARDCODED_STYLE_FILES.has(normalized)) {
      continue;
    }

    const source = fs.readFileSync(file, "utf8");

    assert.doesNotMatch(
      source,
      /z-index\s*:\s*\d+/,
      `${normalized} contains hardcoded z-index`
    );
  }
});
```

### 检查异常间距

```js
test("css files avoid arbitrary spacing values", () => {
  const files = collectFiles("src/styles");

  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (ALLOWED_HARDCODED_STYLE_FILES.has(normalized)) {
      continue;
    }

    const source = fs.readFileSync(file, "utf8");

    const arbitrarySpacing = /\b(?:padding|margin|gap|row-gap|column-gap)\s*:[^;]*(?:17px|19px|23px|27px|31px)/;

    assert.doesNotMatch(
      source,
      arbitrarySpacing,
      `${normalized} contains arbitrary spacing`
    );
  }
});
```

这些规则不要一开始太严，否则会误伤现有旧样式。可以先只检查新增文件或新目录，之后逐步扩大。

## 样式硬编码例外机制

如果确实需要硬编码，必须写注释：

```css
.c-map-grid-debug {
  /* style-exception: debug overlay uses exact calibration color */
  color: #ff00ff;
}
```

测试允许带注释的例外：

```js
function removeAllowedExceptions(source) {
  return source
    .split(/\r?\n/)
    .filter((line, index, lines) => {
      const previous = lines[index - 1] ?? "";
      return !previous.includes("style-exception:");
    })
    .join("\n");
}
```

例外注释必须说明原因，不能只写：

```css
/* style-exception */
```

必须写：

```css
/* style-exception: third-party datepicker requires exact selected color */
```

## 样式迁移期策略

当前项目已有旧 CSS，不建议一次性严格封死。

### 阶段 1：只管新增样式

- 新增 CSS 文件必须使用 token。
- 新增 feature 样式不允许硬编码颜色 / z-index。
- 旧文件暂不全量清理。

### 阶段 2：管被修改文件

- 如果修改旧 CSS 文件，新增规则必须用 token。
- 顺手替换同一小块附近的硬编码。
- 不要求全文件一次性清理。

### 阶段 3：全局守卫

- 所有 `src/styles/**/*.css` 禁止非 token 硬编码。
- 例外必须有 `style-exception` 注释。
- CI 中强制运行 style token contract test。

## 新资源添加流程

新增资源时：

1. 放到正确资源目录。
2. 在 resource manifest 注册 ID。
3. 业务数据引用 resource ID。
4. view / renderer 通过 resolver 获取 URL。
5. 如资源影响首屏，加入 preload plan。
6. 增加测试确保没有直接路径散落。

## 新布局添加流程

新增布局时：

1. 先定义 presenter model。
2. view 只渲染 presenter model。
3. 样式写入对应 feature CSS。
4. 不在 `main.ts` 拼布局。
5. 不在 runtime 生成 HTML。
6. 增加 source guard 或 view contract test。

## 新样式添加流程

新增样式时：

1. 选择对应 CSS 文件。
2. 使用 feature 前缀。
3. 复用 token。
4. 不写无归属全局类。
5. 检查移动端/桌面文本不溢出。
6. 如果是组件样式，配 view contract test。

## 什么时候新增 token

新增 token 的条件：

- 同一个值会被两个以上组件复用。
- 这个值表达设计语义，而不是一次性坐标。
- 这个值属于颜色、间距、层级、动效、字号、圆角、阴影之一。

推荐 token 命名表达用途：

```css
--color-surface-panel
--color-text-muted
--space-panel-padding
--z-modal
```

不推荐：

```css
--color-yellow1
--my-padding
--value-17
```

## PR 检查清单

任何 PR 修改 `src/main.ts`，必须回答：

- 这次修改是否只是装配 coordinator？
- 是否新增了具体业务分支？
- 是否新增了具体 `data-action` 处理？
- 是否直接读写了角色、背包、地图、house、剧情状态？
- 是否可以放进现有 coordinator？
- 是否新增或更新了 main shell guard 测试？
- 是否保持 UI、地图、背包现有行为不变？

资源 PR 必须检查：

- 是否直接路径散落？
- 是否有 resource ID？
- 是否经过 resolver？
- 是否需要 preload？

布局 PR 必须检查：

- 是否由 presenter model 驱动？
- 是否绕过了 render coordinator？
- 是否污染 `main.ts`？

样式 PR 必须检查：

- 是否新增了硬编码颜色？
- 是否新增了硬编码 z-index？
- 是否新增了随意间距？
- 是否新增了 viewport 字号？
- 是否复用了 design token？
- 是否需要新增 token？
- 是否把 feature 样式写进了正确文件？
- 是否影响全局 selector？
- 是否有移动端文本溢出风险？

## 代码审查规则

如果发现以下情况，应要求改回模块内：

- `main.ts` 里出现具体 house 名称。
- `main.ts` 里出现具体 item / backpack action。
- `main.ts` 里出现具体 map calculation。
- `main.ts` 里出现具体 playable completion。
- `main.ts` 里出现具体 event / dialogue progression。
- `main.ts` 里出现大量 DOM selector 与业务状态 mutation 混在一起。
- 新增功能只通过在 `main.ts` 加 `if` 分支实现。
- 资源文件路径散落在业务逻辑中。
- runtime 或 domain 依赖 CSS class。
- 新样式直接写硬编码颜色、z-index 或任意间距。

当开发者不确定怎么放时，应这样做：

1. 不改 `src/main.ts`。
2. 新建一个 transition / compat / coordinator 文件。
3. 在文件名中写清 feature。
4. 只暴露一个小函数给 shell 或上级 coordinator。
5. 加测试。
6. 在 change-log 写明这是过渡层。
7. 后续确认归属后迁出。

## 推荐目录边界

### Runtime

- `src/core/runtime/*`
- `src/core/contracts/*`

负责通用运行时合同、dispatch、settlement、state sync。

### Application Coordinator

- `src/application/runtime/*`
- `src/application/startup/*`

负责把 runtime、state、render、feature action 串起来。

### Feature Application

- `src/application/backpack/*`
- `src/application/map/*`
- `src/application/events/*`
- `src/application/story/*`
- `src/application/playables/*`
- `src/application/house-modules/*`

负责具体功能流程。

### Domain

- `src/domain/*`

负责类型、规则、纯数据结构，不直接依赖 UI。

### UI

- `src/ui/*`
- `src/styles/*`

负责展示和交互视图，不直接承担 runtime settlement。

## Shell 化后的理想结构

最终 `main.ts` 应接近：

```ts
const roots = createDomRoots();
const appStateStore = createAppStateStore();
const runtime = createMainRuntimeOrchestrator(...);
const renderer = createAppRenderCoordinator(...);

const actionCoordinator = createAppActionCoordinator({
  runtime,
  renderer,
  getState: appStateStore.get,
  setState: appStateStore.set,
});

registerBrowserEvents({
  roots,
  actionCoordinator,
});

await bootApplication({
  runtime,
  renderer,
  appStateStore,
});
```

它不应该知道：

- 当前在哪个 house。
- 某个 house 有什么 action。
- 背包物品怎么结算。
- 地图路径怎么计算。
- playable 怎么完成。
- event 怎么推进。
- 角色属性怎么变更。
- UI HTML 怎么拼。
- 资源路径在哪里。
- 某个视觉元素用什么具体 CSS class。

## 迁移期规则

在 shell 化未完成前，允许临时存在旧逻辑，但新增代码必须遵守：

1. 新功能不得继续加到 `main.ts`。
2. 修改旧逻辑时，优先顺手抽到 coordinator。
3. 每完成一个抽离切片，增加一个 guard 测试。
4. 不一次性大改入口，避免覆盖当前 UI、地图、背包。
5. `mod-first-dev` 可以作为蓝图，但不能直接覆盖当前 `main.ts`。

## 例外机制

如果确实必须临时修改 `main.ts`，必须在代码附近留下短注释：

```ts
// Temporary shell wiring: remove after <coordinator-name> owns this path.
```

并在 `docs/change-log.md` 记录：

- 为什么临时放在入口。
- 后续迁出目标模块。
- 预计清理条件。

临时入口逻辑不得扩展第二次；第二次需求必须先抽 coordinator。

## 最简执行规则

如果只记三条：

1. 不确定归属时，默认进入受限过渡层；过渡层必须小、可测、无 DOM、无 UI、可迁出，不能变成第二个 `main.ts`。
2. 资源用 ID 和 manifest 管，布局用 presenter model 管，样式用归属 CSS 和 token 管；`main.ts`、runtime、domain 都不应该直接碰具体资源路径、CSS class 或 HTML 结构。
3. 新样式除 `tokens.css` 外，不允许直接写 `#hex`、`rgb()`、硬编码 `z-index`；需要新视觉值时先加 token，再在组件样式中引用 token。
