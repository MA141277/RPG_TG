# pixel-workflow 拆分蓝图

本文件是 `pixel-workflow.html` 的结构拆分路线图。
目的：把一个 6400+ 行的单文件项目，拆成对人和 AI 都“能一次看懂”的多模块结构，且**行为零变更、无跨域、无 MIME 问题**。

配套文档：`docs/pixel-workflow-dev-rules.md`（之后所有新增 / 修改都应遵守）。

---

## 0. 设计约束

1. **本项目通过本地 HTTP 服务运行**（`启动本地服务.bat`）。
   - 不可双击 `file://` 打开，否则外链资源、`fetch`、`localStorage` 行为不稳。
   - 所有外链资源使用相对路径（例如 `./styles/...`、`./scripts/...`），不写绝对路径、不跨域。
2. **只用 classic `<script>`，不引入 ES Modules。**
   - 原因：当前 6400+ 行共享同一个顶层作用域，所有 `const` / `let` / `function` 彼此可见。改成 ESM 要给几十个函数补 `import / export`，风险极高。
   - classic `<script>` 顶层的 `let / const / function` 都落在 **global lexical env**，多个 `<script>` 文件共享可见（只要加载顺序正确）。
3. **路径不要含中文**。
   - 项目根目录名叫 `像素wf` 没关系（那是磁盘路径，HTTP 服务内部以 URL 路径暴露）。
   - 但仓库内新建的文件夹、文件名**全部用 ASCII**，避免个别服务器 / 浏览器对非 ASCII URL 处理不一致。
4. **每一步都是可回退的**。
   - 拆分 = 搬位置，不改行为。
   - 任一步后如果出问题，直接恢复上一版即可。

---

## 1. 当前文件结构（拆分前）

`pixel-workflow.html` 里实际塞了：

| 行号区间（近似） | 内容 |
| --- | --- |
| `1 – 9` | `<head>` 起始、字体 link |
| `10 – 725` | 内联 `<style>`（~715 行） |
| `726 – 727` | `</head>`、`<body>` |
| `728 – 1037` | 页面 HTML 结构（主面板 + FX 全屏 HUD） |
| `1039 – 1040` | 外链 `mud/hut1-preset.js`、`mud/hut-voxel-runtime.js` |
| `1042 – 6470` | 内联 `<script>`（~5427 行）：生图、去白底、切片、三视图、体素、动画器、FX、场景、碰撞、渲染、初始化 |
| `6471 – 6473` | `</body></html>` |

里面至少混了 **10 个职责**（详见 §3 模块目标清单）。

---

## 2. 目标目录结构

最终理想目录（Phase 3+ 逐步到达）：

```
pixel-workflow.html          # 只剩结构、外链引用
styles/
  pixel-workflow.css         # 原内联样式
scripts/
  pixel-workflow.js          # Phase 2 过渡产物；Phase 3 之后逐步被下面各模块替代
  app/
    boot.js                  # file:// 警告、CONFIG、ls()
    dom-refs.js              # 所有 getElementById / querySelector
    status.js                # setTextStatus、统一状态提示
  image/
    image-utils.js           # loadImage、b64ToDataUrl、rotateImageDataUrl90、fetchJson、bustAssetUrl
    background.js            # removeUnenclosedWhiteBackground、removeAllWhiteBackground、shrinkOpaqueEdgeOnePixel
    spritesheet.js           # normalizeSpriteSheetByAnchor、组件切割、锚点重对齐
    building-views.js        # 建筑三视图抽取、裁切、方向判定
  generation/
    api.js                   # CONFIG 引用 + /v1/images/generations 调用
    character.js             # 人物生成主流程（generate()）
    building.js              # 建筑三视图生成（generateBuilding()）
  library/
    library.js               # saveCurrentCharacter / saveCurrentBuilding / refreshXxxLibrary / 渲染
  voxel/
    voxel-build.js           # finalizeVoxelModel、rebuildVoxelListFromSolid、pruneTopColorMismatchByViews
    building-model.js        # buildPlacedBuildingModelFromViews、ensureHutVoxelModel
  scene/
    tilemap.js               # ensurePlaceholderTilemap、sampleTilemap、base layer capture/restore
    scene-store.js           # loadSceneStore、persistSceneStore、snapshot 转换、loadSceneById、saveActiveScene
    placement.js             # beginPlacement / cancelPlacement / confirmPlacement / syncPlacementUi
    road.js                  # 村路重算（fxBtnRoadRebuild 对应逻辑）
  animator/
    state.js                 # 全局 animator 对象（状态）
    sheet-loader.js          # loadAnimatorSheet
    controls.js              # bindAnimatorControls、键盘事件
  fx/
    fx-panel.js              # bindFxPanel、applyFxPanelValuesFromAnimator、loadFxParamsFromStorage
    fx-fullscreen.js         # openFxWorldFromPreview、resizeFxBigCanvasToViewport、HUD 显隐
  render/
    projection.js            # perspectiveScaleAtDepth、tilemap 透视反解、屏幕<->世界映射
    collision.js             # 玩家碰撞箱、建筑碰撞、滑动解算
    renderer.js              # drawAnimator 主循环、雪地/树/精灵渲染
  main.js                    # 顶层初始化：场景、默认角色、事件绑定
```

> 注意：该树是**最终形态**。不要求一次到位，分阶段演进。

---

## 3. 模块职责清单（对照现有函数）

下表让 AI / 人类在搬代码时知道“这段代码该去哪”。
行号取自拆分前的 `pixel-workflow.html`（Phase 1 之后以 `scripts/pixel-workflow.js` 为准，行号下移 1042 行）。

### `app/boot.js`
- `(function () { if (location.protocol === "file:") ... })();`（~1043）
- `function ls(key, val)`（1050）
- `const CONFIG = { ... }`（1060）

### `app/dom-refs.js`
- 所有 `const elXxx = document.getElementById(...)`（1067 – 1209）
- 建议最终改写为 `const dom = { elXxx, elYyy, ... }`，但第一次搬家保持原样。

### `animator/state.js`
- `const animator = { ... }`（1210 起，到该对象闭合）

### `image/image-utils.js`
- `b64ToDataUrl`（2274）
- `loadImage`（2281）
- `rotateImageDataUrl90`（2296）
- `fetchJson`（2493）
- `bustAssetUrl`（2487）
- `relativeSpanMismatch`（2290）

### `image/background.js`
- `isEdgeBackgroundWhite`（2347）
- `shrinkOpaqueEdgeOnePixel`（2355）
- `removeUnenclosedWhiteBackground`（2393）
- `removeAllWhiteBackground`（2450）

### `image/spritesheet.js`
- `getColumnColorOccupancy` / `collectColumnSegments` / `measureSegmentBounds`
- `collectOpaqueComponentsInRect` / `splitComponentsIntoRows`
- `pickThreeViewBoundsFromComponents`
- `cropCanvasRegionToDataUrl`
- `getAlphaAt` / `collectConnectedComponent` / `scoreComponent` / `getMainComponentBounds`
- `normalizeSpriteSheetByAnchor`（3210）
- `describeDirection`

### `image/building-views.js`
- `extractBuildingThreeViews`（3049）
- `normalizeBuildingThreeViews`（2311）
- `isSimilarOpaqueColorAt` / 列扫描 / 色键等图像判定（1370 – 1456）

### `voxel/voxel-build.js`
- `finalizeVoxelModel`（1345）
- `voxelSolidIndex`
- `readCanvasRgba` / `readPixelChannels`
- `columnHasSimilarColorBelowCached` / `rowHasSimilarColorNearby` / `columnBandHasSimilarColorBelowCached`
- `buildQuantizedColorKey`
- `rebuildVoxelListFromSolid`（1457）
- `pruneTopColorMismatchByViews`（1500）

### `voxel/building-model.js`
- `ensureHutVoxelModel`（1570）
- `getGeneratedBuildingModel` / `getPlacementModel` / `getPlacementLabel`
- `buildPlacedBuildingModelFromViews`（2643）

### `scene/placement.js`
- `syncPlacementUi` / `cancelPlacement` / `beginPlacement` / `confirmPlacement`
- `startPlacementHut` / `startPlacementGenerated`
- `inferBuildingTag` / `backfillSceneBuildingTags`

### `scene/scene-store.js`
- `sanitizeSceneId`（3366）
- `modelToSceneSnapshot` / `sceneSnapshotToModel`
- `sceneObjectToSnapshot` / `sceneSnapshotToObject`
- `loadSceneStore` / `persistSceneStore`
- `loadSceneById` / `saveActiveScene` / `createNewScene` / `refreshSceneListUi`
- `DEFAULT_SCENE_ID`

### `scene/tilemap.js`
- `ensurePlaceholderTilemap`（3307）
- `sampleTilemap`
- `resetTilemapToDefaultGrass` / `captureTilemapBaseLayer` / `restoreTilemapBaseLayer`

### `fx/fx-panel.js`
- `clampAnimatorFxParams` / `applyFxPanelValuesFromAnimator`
- `bindFxPanel`
- `loadFxParamsFromStorage`

### `fx/fx-fullscreen.js`
- `fxClientToStage`
- `syncFxHudFab` / `setFxHudState` / `setFxFullscreen`
- `getFxStageScaleMul` / `resizeFxBigCanvasToViewport`
- `openFxWorldFromPreview`

### `render/projection.js`
- `perspectiveScaleAtDepth`
- `clampNumber`
- 与 tilemap 透视反解相关的辅助（`z 给屏幕 y`、`屏幕 y 求 z` 二分）

### `render/collision.js`
- 玩家碰撞半径 / 椭圆匹配
- 建筑碰撞多边形硬裁剪
- 分步位移与沿墙滑动

### `render/renderer.js`
- `drawAnimator`（5778）
- 雪地 tilemap 重采样、树、精灵排序
- FX 大屏同步渲染

### `animator/sheet-loader.js`
- `loadAnimatorSheet`（5746）

### `animator/controls.js`
- `bindAnimatorControls`（5982）
- 键盘 / 鼠标 / 拖拽事件

### `generation/character.js`
- `applyCharacterLibraryEntry`
- `generate`（6245）

### `generation/building.js`
- `applyBuildingLibraryEntry`
- `generateBuilding`（6116）
- `renderBuildingWorkflowPreview`

### `library/library.js`
- `summarizePrompt`
- `createLibraryAction` / `buildPreviewCard` / `renderBeforeAfter` / `renderHudPreviewGrid`
- `renderCharacterLibrary` / `renderBuildingLibrary`
- `refreshCharacterLibrary` / `refreshBuildingLibrary`
- `saveCurrentCharacter` / `saveCurrentBuilding`

### `main.js`
- `bindAnimatorControls();`
- `initSceneSystem` IIFE
- `syncPlacementUi();`
- `requestAnimationFrame(drawAnimator);`
- 默认 `8direction.png` 加载 IIFE
- 顶层 button `addEventListener` 绑定

---

## 4. 分阶段执行计划

### ✅ Phase 1：抽离 CSS（本次完成）
- 把 `<style>...</style>` 内容整体搬到 `styles/pixel-workflow.css`。
- HTML 用 `<link rel="stylesheet" href="./styles/pixel-workflow.css" />` 替代。
- **风险评级**：极低。纯文本搬位置，不影响 JS。

### ✅ Phase 2：抽离 JS 到单文件（本次完成）
- 把 `<script> ... </script>`（原行 1042 – 6470）整体搬到 `scripts/pixel-workflow.js`。
- HTML 在同一位置改为 `<script src="./scripts/pixel-workflow.js"></script>`。
- **保持加载顺序不变**：先 `mud/hut1-preset.js`、再 `mud/hut-voxel-runtime.js`、再本文件。
- **风险评级**：低。仍然是 classic script，顶层作用域、DOM 时序完全一致。

> Phase 1+2 完成后：`pixel-workflow.html` 降到 ~1050 行；`scripts/pixel-workflow.js` ~5427 行。
> 这一步**不解决大文件问题**，但让后续每次增量拆都不再碰 HTML 结构，把风险限制在 JS 内。

### ⏳ Phase 3：抽离“纯函数 + 无共享状态”的模块
按以下顺序（每个独立提交，独立验证）：
1. `app/boot.js`
2. `image/image-utils.js`
3. `image/background.js`
4. `image/spritesheet.js`
5. `image/building-views.js`
6. `voxel/voxel-build.js`

**搬家规则**：
- 每拆一个文件，更新 HTML 的 `<script>` 顺序，确保在 `scripts/pixel-workflow.js` **之前**加载。
- `scripts/pixel-workflow.js` 里对应段落**删除**（不是注释，避免残留歧义）。
- 每次拆完立刻刷新页面，人工点一遍关键路径：生图按钮、去白底测试、切片对齐测试。

### ⏳ Phase 4：抽离“共享状态的模块”
顺序（强依赖顺序）：
1. `app/dom-refs.js`（最先，所有 UI 交互都依赖它）
2. `animator/state.js`
3. `fx/fx-panel.js` → `fx/fx-fullscreen.js`
4. `scene/tilemap.js` → `scene/scene-store.js` → `scene/placement.js` → `scene/road.js`
5. `voxel/building-model.js`
6. `generation/api.js` → `generation/character.js` → `generation/building.js`
7. `library/library.js`
8. `animator/sheet-loader.js` → `render/projection.js` → `render/collision.js` → `render/renderer.js` → `animator/controls.js`
9. `main.js`

### ⏳ Phase 5：收口全局变量
- 把 `const elXxx = document.getElementById(...)` 聚合到 `dom` 对象。
- 把运行时状态聚合到 `appState`（含 `animator`、`generatedCharacter`、`generatedBuilding`、`sceneStore`）。
- 只在这一步做“语义重构”，其它阶段全部是“搬家不改名”。

---

## 5. HTML 内 `<script>` 终态加载顺序

拆分完成后，`pixel-workflow.html` 在 body 尾部应该是：

```html
<!-- 外部预设脚本 -->
<script src="mud/hut1-preset.js"></script>
<script src="mud/hut-voxel-runtime.js"></script>

<!-- 基础：配置、DOM、状态 -->
<script src="./scripts/app/boot.js"></script>
<script src="./scripts/app/dom-refs.js"></script>
<script src="./scripts/app/status.js"></script>
<script src="./scripts/animator/state.js"></script>

<!-- 图像 / 体素工具（纯函数，可彼此独立） -->
<script src="./scripts/image/image-utils.js"></script>
<script src="./scripts/image/background.js"></script>
<script src="./scripts/image/spritesheet.js"></script>
<script src="./scripts/image/building-views.js"></script>
<script src="./scripts/voxel/voxel-build.js"></script>
<script src="./scripts/voxel/building-model.js"></script>

<!-- 场景 -->
<script src="./scripts/scene/tilemap.js"></script>
<script src="./scripts/scene/scene-store.js"></script>
<script src="./scripts/scene/placement.js"></script>
<script src="./scripts/scene/road.js"></script>

<!-- FX + 渲染 -->
<script src="./scripts/fx/fx-panel.js"></script>
<script src="./scripts/fx/fx-fullscreen.js"></script>
<script src="./scripts/render/projection.js"></script>
<script src="./scripts/render/collision.js"></script>
<script src="./scripts/render/renderer.js"></script>

<!-- 生成 / 资产库 -->
<script src="./scripts/generation/api.js"></script>
<script src="./scripts/library/library.js"></script>
<script src="./scripts/generation/character.js"></script>
<script src="./scripts/generation/building.js"></script>

<!-- 动画器控制 -->
<script src="./scripts/animator/sheet-loader.js"></script>
<script src="./scripts/animator/controls.js"></script>

<!-- 顶层初始化，必须最后 -->
<script src="./scripts/main.js"></script>
```

> **关键原则：被依赖方先加载**。
> 任何新增脚本，必须在它依赖的所有脚本**之后**。

---

## 6. 为什么不用 ES Modules

1. 原文件所有顶层声明处于同一词法作用域，改 ESM 要改几十处 `import / export`，一次性风险极高。
2. ESM 要求 `<script type="module">`，严格同源 + 严格 MIME（`text/javascript`），部分本地 HTTP 服务（例如最小的 Python `http.server`）在 Windows 下可能对 `.mjs` / `.js` 的 MIME 不稳定。
3. 你现在的 `mud/*.js` 也都是 classic script，混用成本更高。
4. 什么时候切 ESM？Phase 5 之后、全部模块化收口完成、需要打包/Tree-shaking 时再切，一次性换。

---

## 7. 拆分期保护措施

- **每一步都提交一个 git commit**（消息清晰：`refactor: extract xxx module`）。
- **拆完每一个文件都做回归点击**：
  1. 打开首页，确认无控制台报错
  2. 点“生成图像”“测试去白底”“测试切片对齐”
  3. 点 FX 全屏，检查 HUD 面板、人物/建筑生成、场景保存/加载、放置 Hut
- **出现行为差异立即回滚对应 commit**，不要在已损坏的基础上继续拆。
