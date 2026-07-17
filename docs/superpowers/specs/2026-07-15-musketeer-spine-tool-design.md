# 火枪兵 Spine 工具接入设计

## 目标

为 `tools/spine-node-timeline-editor.html` 新增一个独立兵种 `火枪兵`：

- 右上角兵种列表可选择 `火枪兵`
- 使用独立工程目录 `src/faxian/leg/musketeer/`
- 当前阶段在工具能力上先整体复用 `枪兵` 的导入动画、握拳安装、特效骨骼逻辑
- 在火枪兵上下文中，将枪兵的 `戳刺特效` 文案改为 `开火特效`
- 不修改战斗渲染器，不接入棋盘/战斗 troopType

## 非目标

- 不新增火枪兵战斗演出逻辑
- 不修改棋盘兵种数值
- 不重构整套枪兵/剑士/弓兵的能力系统
- 不在本次把枪兵专用 role 命名全部改成通用命名

## 设计方案

采用“独立目录 + 枪兵行为别名复用”方案。

### 1. 独立兵种注册

在 `SPINE_UNIT_CONFIGS` 中新增：

- key: `musketeer`
- label: `火枪兵`
- projectUrl: `/src/faxian/leg/musketeer/project.json`
- imageBaseUrl: `/src/faxian/leg/musketeer/`
- featureGroups: `["swordsman"]`

这样火枪兵会：

- 出现在右上角兵种下拉框中
- 拥有独立保存路径
- 先进入与枪兵同一类近战/特效功能分组

### 2. 独立目录资源

新增 `src/faxian/leg/musketeer/`。

初始内容直接复制枪兵目录：

- `project.json`
- `head.png`
- `torso.png`
- `leftarm.png`
- `rightarm.png`
- `leftleg.png`
- `rightleg (1).png`
- `sword.png`

这样火枪兵在工具内从第一刻起就是一个可加载、可保存、可独立演化的项目。

如果本轮能够访问外部贴图文件，则额外将用户提供的 `火枪兵.png` 复制到该目录作为原始参考图；如果审批链路仍不可用，则本次先保证功能接入与独立工程可用。

### 3. 枪兵系能力复用

为减少复制，新增最小范围的“枪兵系判断”辅助函数，例如：

- `isSpearmanStyleUnit(unitType)`

当前返回：

- `spearman`
- `musketeer`

该判断用于接管目前工具里写死 `spearman` 的入口：

- 材质替换中超长武器保留策略
- 握拳自动安装逻辑
- 枪兵/火枪兵共用的功能分组显示
- 相关绑定面板按钮显示

### 4. 文案上下文

保留原来的刀光/戳刺特效逻辑结构，但在 `slashEffectContext()` 中按兵种返回不同文案：

- `spearman` -> `戳刺特效`
- `musketeer` -> `开火特效`
- 其他 -> `刀光`

受影响的 UI：

- 出现/消失按钮
- 本动作显示/隐藏按钮
- 临时父节点标签
- 绑定/解绑父节点按钮
- 创建特效骨骼按钮

### 5. 兼容性说明

本次不改以下内部标识：

- `installSpearmanFistRigFromMaterial`
- `spearmanFistCustomImageId`
- `spearmanFistBoneRole`
- `spearmanFistPieceRole`

原因：

- 这些内部命名目前已被多处逻辑与测试依赖
- 本次目标是最小增量支持火枪兵
- 先扩展“适用于枪兵和火枪兵”的判断，比大范围重命名更稳

后续若兵种继续增加，再统一抽象成更通用的枪系能力命名。

## 影响文件

- `tools/spine-node-timeline-editor.html`
- `src/faxian/leg/musketeer/*`
- `tests/spine-unit-context.test.cjs`
- `tests/spine-material-replacement.test.cjs`
- `tests/spine-spearman-fist-import.test.cjs`

## 验证

至少覆盖以下回归：

- `musketeer` 出现在单位注册表和下拉框来源中
- 火枪兵指向独立 `project.json`
- 火枪兵上下文显示 `开火特效`
- 火枪兵可以进入枪兵系功能分组
- 火枪兵保留枪兵武器尺寸保护逻辑
- 火枪兵可复用握拳安装入口
