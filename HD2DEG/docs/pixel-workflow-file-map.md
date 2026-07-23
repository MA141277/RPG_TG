# pixel-workflow 文件索引（AI 易读版）

配套文档：
- `docs/pixel-workflow-split-blueprint.md`（拆分路线图）
- `docs/pixel-workflow-dev-rules.md`（开发规则）

---

## 约定

- **状态列**：`current` = 已存在；`planned` = 蓝图规划、尚未建立；`legacy` = 过渡文件，Phase 3+ 会逐步清空。
- **加载顺序列**：`<script>` 在 HTML 中的加载次序。未列出的不是脚本（如 css / md）。
- **AI 改动前必读**：任何修改请先读"对应 md"列里的文档。

> 任何新增 / 搬家 / 删除文件，**必须同步更新本索引**。

---

## 1. 入口与静态资源

| 路径 | 状态 | 作用 | AI 改动前必读 |
| --- | --- | --- | --- |
| `pixel-workflow.html` | current | 主页面。只剩结构 + 外链。改 HTML 结构 / 新增 DOM 节点前看这里。 | split-blueprint §1、§5 |
| `styles/pixel-workflow.css` | current | 全部 UI 样式（深色主题、FX HUD、全屏、动画器、库面板）。 | split-blueprint §1 |
| `启动本地服务.bat` | current | Python `http.server` 8765（页面）+ `local_asset_api.py` 8766（素材库）。改端口前确认 8766 与页面代码里的 `127.0.0.1:8766` 一致。 | dev-rules §一 |
| `local_asset_api.py` | current | 资产库后端（人物 / 建筑 / 场景保存、列出、读取）。`/api/*` 请求全部打它。 | 源文件注释 |
| `package.json` | current | 只用于声明 Node 元数据（当前项目不经打包）。不要随便 `npm install` 未在蓝图里规划的依赖。 | dev-rules §九 |

## 2. 业务静态资产（不改）

| 路径 | 状态 | 作用 |
| --- | --- | --- |
| `mud/hut1-preset.js` | current | Hut 建筑预设体素数据。先于主 JS 加载。 |
| `mud/hut-voxel-runtime.js` | current | 体素运行时（Hut 专用）。先于主 JS 加载。 |
| `mud/tower-preset.js` | current | 塔预设，暂未接入主流程。 |
| `8direction.png` | current | 默认人物 8 方向参考图，页面启动时自动加载。 |
| `maid.png`、`hu.jpg` | current | "测试去白底" / "测试切片对齐" 按钮使用。 |
| `building/` | current | 建筑资产库（由 `local_asset_api.py` 读写）。 |
| `character/` | current | 人物资产库。 |
| `scene/` | current | 场景存档库：每个场景一个目录，`scene.json` 保存建筑、位置角度、标签、后续室内/NPC/属性等完整场景数据。 |
| `data/cache/` | current | 生成流程中间缓存。 |
| `data/saves/` | current | `world-item.json` 等存档产物。 |

## 3. JS 模块（scripts/）

### 3.1 当前实际存在

| 路径 | 状态 | 作用 | 对应蓝图 |
| --- | --- | --- | --- |
| `scripts/app/boot.js` | current | `file://` 警告兜底、`ls()` 本地存储封装、全局 `CONFIG`（接口 base / API key / 默认模型 / 图片尺寸）。**必须在其它脚本之前加载**（被 `ls` / `CONFIG` 引用点达 40 处）。 | split-blueprint §4 Phase 3 |
| `scripts/app/city-ambient-npc-scene-index.js` | current | 从当前已加载场景对象提取城市环境 NPC 使用的建筑占位、入口节点、城门节点与场景边界。 | city-ambient-npc spec / plan |
| `scripts/app/city-ambient-npc-pathfinder.js` | current | 基于 scene index 的四向最短路搜索，供城市环境 NPC 选择有效步行路线。 | city-ambient-npc spec / plan |
| `scripts/app/city-ambient-npc-runtime.js` | current | 维护 4..8 个城市环境 NPC 的生成、移动、销毁与胶囊占位渲染元数据。 | city-ambient-npc spec / plan |
| `scripts/pixel-workflow.js` | legacy | Phase 2 过渡单体文件。Phase 3.1 后已剥离 boot，当前仍包含 DOM refs、`animator`、生成、场景、渲染、FX、库等全部逻辑。继续按 §3.2 顺序外迁。 | split-blueprint §1 |

### 3.2 Phase 3+ 计划模块（按加载顺序）

| 加载顺序 | 路径 | 状态 | 作用 | 顶层导出 |
| --- | --- | --- | --- | --- |
| 1 | `scripts/app/boot.js` | current | 见 §3.1 | `ls`、`CONFIG` |
| 2 | `scripts/app/dom-refs.js` | planned | 集中所有 `document.getElementById` 引用。Phase 5 会收成 `dom` 对象。 | `elXxx`、`fxXxx`、`fxBtnXxx` 等 |
| 3 | `scripts/app/status.js` | planned | `setTextStatus` 等统一状态提示工具。 | `setTextStatus` |
| 4 | `scripts/animator/state.js` | planned | 全局 `animator` 对象（人物状态、FX 参数、输入按键、放置预览）。 | `animator` |
| 5 | `scripts/image/image-utils.js` | planned | 纯图像工具：`loadImage`、`b64ToDataUrl`、`rotateImageDataUrl90`、`fetchJson`、`bustAssetUrl`、`relativeSpanMismatch`。 | 同名函数 |
| 6 | `scripts/image/background.js` | planned | 白底清理：`isEdgeBackgroundWhite`、`shrinkOpaqueEdgeOnePixel`、`removeUnenclosedWhiteBackground`、`removeAllWhiteBackground`。 | 同名函数 |
| 7 | `scripts/image/spritesheet.js` | planned | 精灵表切片 / 锚点对齐：列扫描、组件连通域、`normalizeSpriteSheetByAnchor`、`describeDirection`。 | 同名函数 |
| 8 | `scripts/image/building-views.js` | planned | 建筑三视图识别：`extractBuildingThreeViews`、`normalizeBuildingThreeViews`、色域判定。 | 同名函数 |
| 9 | `scripts/voxel/voxel-build.js` | planned | 体素基础：`finalizeVoxelModel`、`rebuildVoxelListFromSolid`、`pruneTopColorMismatchByViews`、色键与列扫描缓存。 | 同名函数 |
| 10 | `scripts/voxel/building-model.js` | planned | 体素建筑整装：`ensureHutVoxelModel`、`buildPlacedBuildingModelFromViews`、`getPlacementModel` / `Label`。 | 同名函数 |
| 11 | `scripts/scene/tilemap.js` | planned | 底图：`ensurePlaceholderTilemap`、`sampleTilemap`、草地 base layer 捕获 / 恢复。 | 同名函数 |
| 12 | `scripts/scene/scene-store.js` | planned | 场景持久化：snapshot 转换、`loadSceneStore` / `persistSceneStore`、`loadSceneById` / `saveActiveScene` / `createNewScene`、`DEFAULT_SCENE_ID`。 | 同名函数 / 常量 |
| 13 | `scripts/scene/placement.js` | planned | 放置流程：`beginPlacement` / `cancelPlacement` / `confirmPlacement` / `syncPlacementUi` / `startPlacementHut` / `startPlacementGenerated`、`inferBuildingTag`、`backfillSceneBuildingTags`。 | 同名函数 |
| 14 | `scripts/scene/road.js` | planned | 村路重算。 | `rebuildRoads`（暂名） |
| 15 | `scripts/fx/fx-panel.js` | planned | FX HUD 参数面板：`bindFxPanel`、`applyFxPanelValuesFromAnimator`、`loadFxParamsFromStorage`、`clampAnimatorFxParams`。 | 同名函数 |
| 16 | `scripts/fx/fx-fullscreen.js` | planned | FX 全屏：`fxClientToStage`、`syncFxHudFab`、`setFxHudState`、`setFxFullscreen`、`getFxStageScaleMul`、`resizeFxBigCanvasToViewport`、`openFxWorldFromPreview`。 | 同名函数 |
| 17 | `scripts/render/projection.js` | planned | 投影数学：`perspectiveScaleAtDepth`、tilemap 屏幕 ↔ 世界反解、`clampNumber`。 | 同名函数 |
| 18 | `scripts/render/collision.js` | planned | 角色 / 建筑碰撞箱、沿墙滑动拆步。 | `collideAndMove`（暂名） |
| 19 | `scripts/render/renderer.js` | planned | `drawAnimator` 主循环、雪地重采样、树 / 精灵排序、FX 大屏同步。 | `drawAnimator` |
| 20 | `scripts/generation/api.js` | planned | `/v1/images/generations` 请求封装。消费 `CONFIG`。 | `generateImage`（暂名） |
| 21 | `scripts/library/library.js` | planned | 人物 / 建筑库：`summarizePrompt`、`createLibraryAction`、`buildPreviewCard`、`renderBeforeAfter`、`renderHudPreviewGrid`、`renderCharacterLibrary` / `renderBuildingLibrary`、`refreshXxxLibrary`、`saveCurrentXxx`。 | 同名函数 |
| 22 | `scripts/generation/character.js` | planned | `generate`（人物）、`applyCharacterLibraryEntry`。 | 同名函数 |
| 23 | `scripts/generation/building.js` | planned | `generateBuilding`、`applyBuildingLibraryEntry`、`renderBuildingWorkflowPreview`。 | 同名函数 |
| 24 | `scripts/animator/sheet-loader.js` | planned | `loadAnimatorSheet`。依赖 image/spritesheet + animator/state。 | `loadAnimatorSheet` |
| 25 | `scripts/animator/controls.js` | planned | `bindAnimatorControls`、键盘 / 鼠标 / 拖拽 / 滚轮事件。 | `bindAnimatorControls` |
| 26 | `scripts/main.js` | planned | 顶层启动：场景初始化 IIFE、默认 `8direction.png` 加载 IIFE、按钮 `addEventListener`、首帧 `requestAnimationFrame(drawAnimator)`。 | 无导出（纯副作用） |

> **规则**：所有 `planned` 模块一旦建立，**本表立刻改 `current`**，并同步更新 `scripts/pixel-workflow.js` 里该段被删除。

## 4. 文档（docs/）

| 路径 | 作用 |
| --- | --- |
| `docs/pixel-workflow-split-blueprint.md` | 拆分路线图。Phase 1–5 的总体计划、目录目标、加载顺序。 |
| `docs/pixel-workflow-dev-rules.md` | 开发规则。AI / 人类共同遵守的"九条军规"。 |
| `docs/pixel-workflow-file-map.md` | 本文件。全仓库文件索引，文件级职责说明。 |

## 5. 其它根目录文档

| 路径 | 作用 |
| --- | --- |
| `ai-world-item-data-schema.md` | AI 生成物件 / 建筑的数据结构约定。 |
| `ai-world-item-generator-api-notes.md` | 物件生成接口笔记。 |
| `llm-scene-tagging-and-semantic-generation.md` | 场景 LLM 标签化 / 语义生成方案。 |
| `ai-world-item-generator-demo.html` | 物件生成器 demo 页。 |
| `tilemap-editor.html` | 底图编辑器 demo 页。 |
| `world-item-demo-server.mjs` | 物件 demo 服务端。 |

---

## AI 使用提示

1. **只改必要文件**。上表每行已说明该文件的唯一职责，不要在错位置添代码。
2. **搬家时必须改两处**：① 目标模块新增 ② 原处删除 ③ HTML 里加 `<script src>`，④ 本索引状态从 `planned` → `current`。
3. **顺序不可乱**：第 3 节的"加载顺序"列是依赖顺序。加脚本标签时必须按这个序数插入。
4. **读 md 的 AI 友好方式**：本索引尽量单表 + 单行，AI 扫一遍就能知道"改 X 功能该碰哪个文件"。
