# UI 布局对齐工作流

这份文档用于固定当前 UI 布局编辑器的协作方式，避免后续继续依赖口头约定。

## 1. 适用范围

当前主要用于以下工作：

- 全局 HUD、面板、状态栏的位置微调
- 开始界面按钮、标题、内容组的位置微调
- 组件底图替换
- 底图拉伸、覆盖、九宫格切片方式调整
- 组件内部元素位置和尺寸调整
- 把可视化编辑结果回写到源码默认布局

当前支持的布局目标：

- `global-hud`
- `start-screen`

布局目标统一登记在：

- [src/application/layout-editor/layout-editor-target-registry.ts](D:/RPG_TG/src/application/layout-editor/layout-editor-target-registry.ts)

## 2. 当前原则

- 可视化编辑器只负责产出参数，不直接改源码文件。
- 最终默认值仍由代码维护，统一回写到 `src/content/layout-editor-presets.ts`。
- 布局结构必须保持数据化，不能把位置写死进零散 DOM 分支或临时样式。
- 一次对齐以“用户复制参数 -> 粘贴给代理 -> 代理回写源码”为准。

## 3. 运行时结构

当前布局编辑器围绕以下数据模型：

- `layout.id`：布局目标 ID，例如 `global-hud` / `start-screen`
- `layout.screenSize`：编辑基准分辨率
- `layout.components[]`：每个可摆放组件
- `component.rect`：组件在屏幕或父级中的位置与尺寸
- `component.background`：组件底图、拉伸模式、切片参数
- `component.elements[]`：组件内部元素
- `element.rect`：子元素相对组件左上角的位置与尺寸

源码默认布局定义在：

- [src/content/layout-editor-presets.ts](D:/RPG_TG/src/content/layout-editor-presets.ts)

类型定义在：

- [src/domain/ui-layout.ts](D:/RPG_TG/src/domain/ui-layout.ts)

## 4. 标准协作流程

用户侧：

1. 打开布局编辑器，选择要调整的目标与组件。
2. 拖拽组件或内部元素，调整位置、尺寸、底图与切片方式。
3. 点击“复制完整布局参数”。
4. 把复制出的 JSON 原样粘贴到对话里。

补充：`start-screen` 支持实际界面编辑模式。打开开始界面的布局编辑器时，右侧显示参数面板，真实开始界面上的可编辑组件会出现拖拽框。对齐开始界面时应优先拖真实界面上的组件，而不是只依赖独立预览。

代理侧：

1. 读取用户粘贴的完整参数。
2. 只回写对应布局目标的默认配置，不手工猜位置。
3. 把 `components`、`background`、`elements` 中的变更同步到 `src/content/layout-editor-presets.ts`。
4. 如有必要，补充相关文档或变更记录。
5. 跑最小验证，例如 lint、typecheck 或 build。

## 5. 参数格式

复制按钮产出的数据格式如下：

```json
{
  "targetId": "global-hud",
  "selectedComponentId": "status-board",
  "selectedElementId": null,
  "layout": {
    "id": "global-hud",
    "label": "顶部全局属性栏",
    "screenSize": {
      "width": 1600,
      "height": 900
    },
    "components": []
  }
}
```

说明：

- `targetId` 用于确定要改哪个布局目标。
- `selectedComponentId` 和 `selectedElementId` 只是编辑器上下文，不是唯一修改依据。
- 真正要回写的是 `layout`。
- 默认按完整布局整体回写，不按局部差量 patch 猜测。

## 6. 回写规则

收到用户粘贴的参数后，按以下规则处理：

- 如果只改了单个组件，也优先以整份 `layout` 为准检查一致性。
- `rect` 的 `x / y / width / height` 按用户参数直接回写。
- `background.assetId`、`imageUrl`、`mode`、`slice` 按用户参数直接回写。
- 不因“看起来不协调”擅自二次微调。
- 如果参数和当前代码不一致，以用户最后一次粘贴为准。

## 7. 资源选择规则

布局编辑器中的底图选择应允许从项目资源中选取，当前资源清单来自项目图片目录扫描。

当前已纳入搜索范围的目录包括：

- `src/assets`
- `ui`
- `ui1`
- `yuansu`
- `sliced_ui_assets`
- `map`

机制目标：

- 用户先在编辑器里选图。
- 编辑器复制出的参数里带上资源路径。
- 代理收到后按路径回写默认配置。

## 8. 开始界面布局注意事项

开始界面已经接入 `start-screen` 布局目标。后续使用或扩展编辑器时，必须注意以下两个问题：

1. 默认布局坐标和尺寸必须贴合原 CSS 视觉结果。

   开始界面的按钮原本由 CSS 自然布局控制，例如开始/继续按钮约为 `136x136` 方形按钮，主菜单内容组还带有 `translateY(-50%)` 居中效果。接入布局编辑器后，`component.rect` 会覆盖这些自然布局结果。如果默认 `x / y / width / height` 没有按原视觉位置回写，就会导致按钮位置或尺寸突然变化。

   处理方式：先以原界面实际视觉结果为基准设定默认 `rect`，并在布局接管时取消会叠加偏移的旧 CSS transform。

2. 编辑器组件不会自动读取 CSS class 里的背景图。

   开始/继续按钮的图片原本写在 `.c-main-ui-image-button--start` / `.c-main-ui-image-button--continue` 的 CSS `background-image` 中，但布局编辑器预览只读取 `component.background`。因此所有需要在编辑器中显示或替换图片的组件，都必须在 `src/content/layout-editor-presets.ts` 的对应 `component.background` 中显式写入 `assetId / imageUrl / mode / slice`。

真实界面也应优先从布局组件背景读取图片，否则会出现“预览无图”或“编辑器换图不作用于真实按钮”的问题。

`start-screen` 的实际界面编辑能力通过通用 live binding helper 接入：

- [src/ui/tools/live-layout-bindings.js](D:/RPG_TG/src/ui/tools/live-layout-bindings.js)

后续其他界面如果也要支持“直接在真实界面拖拽/缩放”，应复用这个 helper，而不是在各自 view 里复制拖拽框、缩放柄和背景应用逻辑。

## 9. 当前已确定的操作边界

- 不走“下载 JSON 文件 -> 手动导入”的工作流。
- 优先走“复制参数 -> 粘贴给代理 -> 代理改源码”的工作流。
- 编辑器是辅助定位工具，不替代源码层的最终配置管理。
- 如果后续要支持更多界面，优先复用同一套 `UiLayout` 结构，不另起一套临时协议。

## 10. 后续扩展建议

后续如果继续扩展这套工作流，按这个顺序推进：

1. 扩展更多 `LayoutEditorTargetId`。
2. 在 `layout-editor-target-registry.ts` 中登记目标的 `id / label / mode`。
3. 为新界面提供默认布局预设，并加入 `uiLayouts` 初始化。
4. 如果目标使用 `mode: "live"`，在对应 view 中声明 DOM selector -> `componentId` 的 binding，并调用 `applyLiveLayoutBindings`。
5. 支持把用户粘贴的 JSON 反向导入运行时编辑器。
6. 如果资源体积变大，再收缩可搜索资源目录，而不是改掉协作流程。
