# Spine 插件工具协作规范

本文档记录 `tools/spine-node-timeline-editor.html` 的启动、使用、保存和后续 Codex 协作方式。这里的“Spine 插件”指项目内的骨骼节点时间轴与绑定管理工具，不是外部 Spine 官方编辑器插件。

## 启动入口

推荐用项目脚本启动：

```powershell
npm run dev:localhost
```

工具页面：

```text
http://localhost:5173/tools/spine-node-timeline-editor.html
```

如果是刚拉取仓库，先安装依赖：

```powershell
npm install
```

## Codex 快捷触发

当用户输入“启动spine插件”或“启动 Spine 插件”时，Codex 应执行项目内 skill：

```text
.codex/skills/start-spine-plugin/SKILL.md
```

该 skill 应自动完成：

- 检查依赖是否存在，必要时运行 `npm install`。
- 检查 `localhost:5173` 是否已有服务。
- 若无服务，运行 `npm run dev:localhost`。
- 打开或提示工具地址。
- 简要讲解核心使用方式和保存约定。

## 工具定位

该工具用于编辑类 Spine 的 2D 骨骼和物块绑定：

- 动作时间轴：编辑骨骼节点关键帧、播放、导入导出 JSON。
- 绑定管理：编辑独立绑定姿势、物块、骨骼和物块绑定关系，不把绑定编辑写进时间轴关键帧。
- 物块管理：物块是一张切好的图片，可移动、缩放、旋转。
- 骨骼管理：可移动节点、移动整根骨骼、从节点添加骨骼、自由添加骨骼。

## 绑定管理规则

进入“绑定管理”后：

- 底部时间轴应保留布局占位，避免画布比例被拉伸。
- 画布图片比例必须和正常模式一致。
- 左侧显示物块列表和骨骼添加入口。
- 选中物块后，优先拖动画布中的该物块。
- 物块可直接在画布中拖动、角点缩放、顶部旋转，类似 Word/PPT 图片处理。
- 移动物块本身不会改变绑定在它身上的骨骼位置。
- 选中物块时，绑定在该物块上的骨骼和首尾端点高亮。
- 拖动骨骼节点可影响相连骨骼，包括未绑定在当前物块上的骨骼。
- 拖动骨骼主干会让该骨骼脱离父骨骼，并保持世界位置。
- 新增骨骼必须绑定到当前选中的物块。

## 物块图片来源

新增物块图片必须来自项目目录：

```text
src/faxian/leg/
```

添加物块时输入相对 `src/faxian/leg/` 的文件名，例如：

```text
sword.png
custom_piece.png
weapons/sword2.png
```

JSON 中保存为：

```json
"image": "leg:custom_piece.png"
```

运行时会读取：

```text
/src/faxian/leg/custom_piece.png
```

不要再把新增物块图片保存成 base64 `data:` URL。旧 JSON 中的 `customImages` 仅保留导入兼容，不作为新的保存方案。

## 保存和交接方式

当前推荐保存方式：

- 使用“导出 JSON”或“复制 JSON”保存骨骼、绑定、物块变换、动作时间轴。
- 图片文件本体必须已经存在于 `src/faxian/leg/`。
- 把导出的 JSON 交给 Codex 时，Codex 可以直接根据 `leg:xxx.png` 引用修改项目资源和绑定数据。

JSON 能保存：

- 节点、父子关系、长度、旋转、缩放。
- `bindPose` 绑定姿势。
- 物块 attachment、`restPart`、层级、缩放、旋转。
- `skinBoneIds` 物块绑定骨骼列表。
- 时间轴、动作列表、当前动作。

JSON 不保存：

- 新图片文件本体。
- 本地任意目录图片路径。
- 自动写回磁盘的资源文件。

## Codex 修改原则

后续修改该工具时：

- 先追踪真实用户路径，不用额外提示文案掩盖交互 bug。
- 保持绑定管理模式和动画模式画布比例一致。
- 不要把时间轴从布局中移除；绑定管理可以隐藏时间轴内容，但必须保留占位。
- 新增物块图片只能走 `leg:` 引用。
- 如果修改保存结构，更新本文档和 `docs/change-log.md`。
- 对已有 JSON 的错误绑定应通过迁移修复，避免用户旧项目继续读出错误状态。

