# 可视化城市地图地块编辑器

这是一个独立 HTML 工具，用来在接近游戏实景的城镇地图上编辑建筑位置、建筑占格、建筑图片偏移、标签按钮和点击区域。核心数据抽象仍然是 `CityMapBuildingEntity`，导出结果仍然是 `city-map-layout.json`。

该工具不接入游戏运行时，不修改 `src/main.ts`、`HouseModule`、城市导航、剧情、NPC、资源、经营或时间推进逻辑。

## 如何打开

直接用浏览器打开：

`tools/city-map-building-editor/index.html`

也可以在项目根目录启动一个静态服务后打开：

```bash
python -m http.server 8765 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:8765/tools/city-map-building-editor/index.html`。

如果 `file://` 下真实城镇底图或前景墙体图没有显示，优先使用上面的本地静态服务。浏览器对本地文件和跨目录资源的限制不完全一致。

## 主放置模型

编辑器现在使用固定 `40 x 40` 等距菱形棋盘作为主放置模型，不再依赖自动识别城墙内部范围。

```json
{
  "grid": {
    "type": "isometric-board",
    "cols": 40,
    "rows": 40,
    "cellWidth": 40,
    "cellHeight": 20,
    "originX": 885,
    "originY": 40?40,
    "snap": true,
    "visible": true,
    "showCoordinates": true,
    "showOutline": true
  }
}
```

`originX` / `originY` 是棋盘格 `0,0` 的中心点。坐标换算：

```js
pixelX = originX + (gridX - gridY) * (cellWidth / 2);
pixelY = originY + (gridX + gridY) * (cellHeight / 2);
```

反算时编辑器会用同一套 2:1 等距公式取最近的 `gridX` / `gridY`，所以拖动建筑会吸附到最近格子。

## 建筑地块

建筑地块以棋盘坐标为准：

```json
{
  "lot": {
    "gridX": 8,
    "gridY": 5,
    "cols": 4,
    "rows": 3,
    "offsetX": 0,
    "offsetY": 0
  }
}
```

`x`、`y`、`footprintWidth`、`footprintHeight` 会作为兼容字段保留和导出，但编辑器会根据 `gridX` / `gridY` / `cols` / `rows` 重新计算它们。

地块和图片是分开的：

- 地块是占位和交互骨架。
- 图片是视觉表现。
- 图片可以大于地块，并通过图片缩放、图片偏移 X / Y 和锚点调整。

## 画布编辑方式

- 点击棋盘格：把当前选中建筑移动到该 `gridX,gridY`。
- 拖动绿色圆点：移动整个建筑，并吸附到最近格子。
- 拖动金色横向手柄：增加或减少占地列数。
- 拖动金色纵向手柄：增加或减少占地行数。
- 拖动红色角手柄：同时调整占地列数和行数。
- 拖动建筑图片本体：调整图片偏移。
- 拖动标签按钮：调整入口按钮位置。
- 拖动蓝色点击区域：调整点击区域位置。
- 拖动蓝色小圆点：调整点击区域宽高。

## 20×20 棋盘设置

点击顶部“棋盘校准模式”后：

- 拖动棋盘中心或原点：整体移动 20×20 棋盘。
- 拖动棋盘顶点 / 左点 / 右点 / 底点：缩放棋盘格宽高。
- 右侧可以直接输入棋盘原点 X / Y、格子宽度、格子高度。
- 棋盘列数和行数默认固定为 20，不建议普通编辑修改。

画布提示语：

“当前使用固定 20×20 菱形棋盘。拖动建筑会吸附到格子；拖动金色手柄会改变建筑占几格。”

校准提示语：

“请将 20×20 菱形棋盘整体对齐到城墙内部空地。建筑只能占用棋盘格，不再使用自动识别范围。”

## 参考遮罩

`map.referenceMask` 只作为“城墙参考遮罩”显示，默认关闭，不参与建筑能否放置的判断。旧 JSON 中的 `map.referenceMask` 导入时会被兼容读取为 `referenceMask`。

`map.forbiddenPolygons` 仍可作为前景遮挡参考层手动配置，默认也不作为主放置模型。

主校验基于棋盘边界：

- `gridX >= 0`
- `gridY >= 0`
- `gridX + cols <= 20`
- `gridY + rows <= 20`
- 标签按钮不能超出画布可见区域。
- 图片可以视觉超出地块，但建筑底座必须落在棋盘内。

## 图片路径

示例使用当前游戏城市地图资源：

- `ui/yuansu/菱形格子/20260716-111958.png`
- `ui/yuansu/菱形格子/20260716-141239.png`

浏览器上传图片只能用于当前页面预览。导出 JSON 时，建议填写项目内相对路径，例如：

`ui/yuansu/菱形格子/shuaifu.png`

## 后续游戏内编辑模式

本工具仍是独立可视化编辑器，没有修改游戏运行时 UI。

后续如需真正的“游戏内城市地图编辑模式”，建议只在开发模式开启：

- 通过 `?cityMapEditor=1` 或 `localStorage.setItem("rpg_tg_city_map_editor", "1")` 开启。
- 仅在 UI 层叠加地块框、手柄、标签和点击热区。
- 编辑模式中点击建筑只选中建筑，不进入建筑。
- 普通模式继续使用现有 `data-house-id` / `data-city-entry-id` 进入逻辑。

不要把 house、city-entry、剧情、NPC、资源、经营或时间推进逻辑接入编辑器。

## 人工验证建议

1. 打开 `tools/city-map-building-editor/index.html`。
2. 点击“载入濠州示例”，或导入 `examples/haozhou-city-layout.example.json`。
3. 确认能看到真实城镇底图和前景墙体。
4. 确认能看到完整 20×20 菱形棋盘，而不是不规则绿色范围。
5. 点击“棋盘校准模式”。
6. 拖动棋盘中心或原点，确认整套格子整体移动。
7. 拖动棋盘顶点 / 左点 / 右点 / 底点，确认格子宽高变化。
8. 一键选中“帅府”。
9. 拖动帅府，确认吸附到棋盘格并更新 `lot.gridX` / `lot.gridY`。
10. 拖动金色手柄，确认帅府占格列数 / 行数变化。
11. 拖动标签按钮。
12. 拖动点击区域和蓝色小圆点。
13. 导出 JSON，确认包含 `grid.type = "isometric-board"`、`grid.cols = 20`、`grid.rows = 20`、`grid.originX` / `originY` / `cellWidth` / `cellHeight`。
14. 再导入 JSON，确认棋盘校准和建筑布局不丢失。
