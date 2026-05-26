# UI 布局对齐工作流

这份文档用于固定当前的 UI 对齐协作方式，避免继续靠口头约定反复说明。

## 1. 适用范围

当前主要用于以下这类工作：

- 全局 HUD / 面板 / 状态栏的位置微调
- 组件底图替换
- 底图拉伸、覆盖、九宫格切片方式调整
- 组件内部元素位置、尺寸调整
- 把可视化编辑结果回写到源码默认布局

当前第一批支持的目标是 `global-hud`。

## 2. 当前原则

- 可视化编辑只负责产出参数，不直接改源码文件
- 最终默认值仍由代码维护，统一回写到 `src/content/layout-editor-presets.ts`
- 布局结构必须保持数据化，不能把位置写死进零散 DOM 分支或临时样式
- 一次对齐以“用户复制参数 -> 粘贴给代理 -> 代理改源码”为准流程

## 3. 运行时结构

当前布局编辑围绕以下数据模型：

- `layout.id`：布局目标 ID，例如 `global-hud`
- `layout.screenSize`：编辑基准分辨率
- `layout.components[]`：每个可摆放组件
- `component.rect`：组件在父级或屏幕中的位置与尺寸
- `component.background`：组件底图、拉伸模式、切片参数
- `component.elements[]`：组件内部元素
- `element.rect`：子元素相对组件左上角的位置与尺寸

其中源码默认布局定义在：

- [src/content/layout-editor-presets.ts](D:/RPG_TG/src/content/layout-editor-presets.ts)

类型定义在：

- [src/domain/ui-layout.ts](D:/RPG_TG/src/domain/ui-layout.ts)

## 4. 标准协作流程

### 用户侧

1. 打开布局编辑器，选择要调整的目标与组件
2. 拖拽组件或内部元素，调整位置、尺寸、底图与切片方式
3. 点击“复制完整布局参数”
4. 把复制出的 JSON 原样粘贴到对话里

### 代理侧

1. 读取用户粘贴的完整参数
2. 只回写对应布局目标的默认配置，不手工猜位置
3. 把 `components`、`background`、`elements` 中的变更同步到 `src/content/layout-editor-presets.ts`
4. 如有必要，补充相关文档或变更记录
5. 跑 `typecheck` / `build` 做最小校验

## 5. 参数格式

当前复制按钮产出的数据格式如下：

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

- `targetId` 用于确定要改哪个布局目标
- `selectedComponentId` 和 `selectedElementId` 只是编辑器上下文，不是唯一修改依据
- 真正要回写的是 `layout`
- 默认按完整布局整体回写，不按局部差量 patch 推断

## 6. 回写规则

收到用户粘贴的参数后，按以下规则处理：

- 如果只改了单个组件，也优先以整份 `layout` 为准检查一致性
- `rect` 的 `x / y / width / height` 按用户参数直接回写
- `background.assetId`、`imageUrl`、`mode`、`slice` 按用户参数直接回写
- 不因为“看起来不协调”擅自二次微调
- 如果参数和当前代码不一致，以用户最后一次粘贴为准

## 7. 资源选择规则

布局编辑器中的底图选择应允许从项目资源中选取，当前资源清单来自项目图片目录扫描。

当前已纳入搜索范围的目录包括：

- `src/assets`
- `ui`
- `ui1`
- `yuansu`
- `sliced_ui_assets`
- `map`

这套机制的目标是：

- 用户先在编辑器里选图
- 编辑器复制出的参数里带上资源路径
- 代理收到后只需要按路径回写默认配置

## 8. 当前已确定的操作边界

- 不走“下载 JSON 文件 -> 手动导入”的工作流
- 优先走“复制参数 -> 粘贴给代理 -> 代理改源码”的工作流
- 编辑器是辅助定位工具，不替代源码层的最终配置管理
- 如果后续要支持更多界面，优先复用同一套 `UiLayout` 结构，不另起一套临时协议

## 9. 后续扩展建议

后续如果继续扩展这套工作流，按这个顺序推进：

1. 扩展更多 `LayoutEditorTargetId`
2. 为更多界面提供默认布局预设
3. 支持把用户粘贴的 JSON 反向导入运行时编辑器
4. 如构建体积变大，再收缩可搜索资源目录，而不是改掉协作流程
