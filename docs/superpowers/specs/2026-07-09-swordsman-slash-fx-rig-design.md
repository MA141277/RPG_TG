# Swordsman Slash FX Rig Design

## 1. Goal

为 `tools/spine-node-timeline-editor.html` 增加一套可复用现有弓箭机制的“刀光特效骨骼”能力，使剑士可以在编辑器里：

- 从一张独立刀光图片自动生成一个独立刀光骨骼与贴图片节点
- 像箭矢一样为刀光设置暂时父骨骼
- 像箭矢一样用关键帧控制刀光在某一帧开始出现、在某一帧开始消失
- 但出现/消失不是硬切，而是固定 `1` 帧淡入、固定 `1` 帧淡出

本次设计只锁定编辑器内的算法、数据结构和交互，不把游戏运行时同步纳入本 spec 的交付范围。

## 2. Scope

### In Scope

- `tools/spine-node-timeline-editor.html` 中新增刀光 rig 创建入口
- 刀光节点的独立骨骼生成
- 刀光的暂时父骨骼事件
- 刀光的出现/消失事件
- 刀光出现与消失的固定 `1` 帧 alpha 过渡
- 保存/加载 JSON 时对刀光轨道数据的持久化

### Out Of Scope

- 游戏运行时对刀光逻辑的同步
- 替换或重构现有箭矢 JSON 数据
- 引入每个事件单独可配的淡入/淡出时长
- 把箭矢系统整体重命名为通用 FX 系统

## 3. Current Repository State

当前仓库中已经存在一套专用于箭矢的机制：

- 独立图片驱动的 `arrow-piece`
- 独立骨骼控制与拖拽
- `arrowVisibilityTracks`
- `arrowParentTracks`
- 临时父骨骼下的零距离挂接
- 关键帧之间遇到父节点切换时停止错误插值

这套机制已经覆盖了刀光所需的大部分能力。刀光与箭矢的核心差异只有两点：

- 刀光不是飞行物，而是短时附着型视觉特效
- 刀光显示切换需要 `alpha` 过渡，而不是简单布尔可见性切换

因此本次不重新设计一套平行机制，而是在编辑器内部将“箭矢式独立贴图件”扩展为可支持刀光的第二类特效件。

## 4. Recommended Approach

采用“复用弓箭机制并扩一层刀光淡入淡出轨道”的方案。

原因：

- 风险最低，最大程度复用已经被用户验证过的箭矢临时父节点行为
- 交互模型对用户最一致，学习成本最低
- 后续同步到游戏运行时也可以沿着现有箭矢同步路径扩展

不采用单独刀光专用系统，因为那会制造第二套几乎相同的可见性/父节点逻辑；也不在本次将所有箭矢逻辑彻底抽象成通用 FX 基础层，因为那会扩大回归面。

## 5. Target Model

### 5.1 New Node Role

新增刀光贴图片节点角色：

- `slash-fx-piece`

新增刀光承载骨骼角色：

- `slash-fx`

它们的关系与箭矢一致：

- 刀光图片节点本身是一个带 attachment 的独立 piece 节点
- 该 piece 通过 `attachment.restPart.parentBoneId` 绑定到独立刀光骨骼
- 刀光骨骼默认无父节点
- 刀光骨骼允许通过事件临时挂接到其他骨骼

### 5.2 New Track Families

在顶层 project 和 action 级别新增两类刀光轨道：

- `slashFxVisibilityTracks`
- `slashFxParentTracks`

数据形状与箭矢保持同风格：

```json
{
  "slashFxVisibilityTracks": {
    "<pieceId>": [
      { "frame": 8, "visible": true },
      { "frame": 12, "visible": false }
    ]
  },
  "slashFxParentTracks": {
    "<pieceId>": [
      { "frame": 7, "parentId": "<bone-id>" },
      { "frame": 13, "parentId": null }
    ]
  }
}
```

这里的 `visible` 仍然表示“从这一帧起进入显示态/隐藏态”，但最终绘制 alpha 会再经过一层刀光专用的 `1` 帧淡入/淡出求值。

## 6. Playback Rules

### 6.1 Visibility State Rule

刀光显示状态的布尔规则与箭矢一致：

- 在出现事件前保持隐藏
- 到出现帧后保持显示
- 到消失帧后保持隐藏
- 反复播放时继续沿用同样的区间规则

### 6.2 Fade Rule

刀光额外增加固定 `1` 帧过渡：

- 出现帧：alpha 从 `0 -> 1`
- 消失帧：alpha 从 `1 -> 0`

具体语义：

- 若 `frame = showFrame`，则在 `[showFrame, showFrame + 1)` 内按插值淡入
- 若 `frame = hideFrame`，则在 `[hideFrame, hideFrame + 1)` 内按插值淡出
- 若出现帧和消失帧相邻，则前一个过渡结束后立刻进入后一个过渡
- 若轨道没有任何显示事件，则刀光保持不可见

### 6.3 Parent Rule

刀光暂时父骨骼规则与箭矢一致：

- 绑定帧之后一直绑定到下一个解绑帧
- 解绑帧之后一直解绑到下一个绑定帧
- 绑定时以视觉上 0 距离相接为准
- 临时父节点切换边界不允许错误插值
- 在用户手动旋转前，刀光保持相对于临时父骨骼的原角度

## 7. Editor UX

### 7.1 Binding Panel

在现有绑定管理区域新增按钮：

- `Create Slash FX Rig`

点击后行为：

1. 要求用户选择一张刀光图片
2. 载入图片并注册为 `customImages`
3. 自动生成一个独立无父节点刀光骨骼
4. 自动生成一个 `slash-fx-piece`
5. 默认选中该刀光节点与骨骼

### 7.2 Animation Panel

当当前选中节点为刀光时，显示刀光事件按钮：

- `Slash FX Appear`
- `Slash FX Disappear`
- `Bind Temp Parent`
- `Unbind Temp Parent`

这些事件应复用箭矢当前的交互风格：

- 绑定父节点前先从下拉中选择目标骨骼
- 点击事件后把当前帧写入对应轨道
- 立即刷新画布和 JSON 预览

### 7.3 Visual Feedback

编辑器画布中刀光需要表现出两层状态：

- 布尔显示态：决定是否进入显示区间
- 淡入淡出 alpha：决定当前帧的实际透明度

也就是说，刀光在淡出帧之后的 `1` 帧内虽然“逻辑上已经切到隐藏态”，但画面上还会有一个快速衰减过程。

## 8. JSON Compatibility Rules

### 8.1 Backward Compatibility

旧项目不包含刀光轨道时：

- 读取时默认 `slashFxVisibilityTracks = {}`
- 读取时默认 `slashFxParentTracks = {}`
- 不影响箭矢、普通 piece、弓 rig 的现有表现

### 8.2 Save Contract

保存项目时：

- 顶层 project 写出刀光轨道
- action snapshot 写出刀光轨道
- 复制/切换 action 时同步刀光轨道

### 8.3 No Silent Arrow Mutation

本次不修改现有 `arrowVisibilityTracks` / `arrowParentTracks` 的字段名与存档格式。  
刀光仅在现有结构旁边增加新字段，不做破坏性迁移。

## 9. Implementation Constraints

- 不要让 `main.ts` 或游戏运行时代码参与本次编辑器内实现
- 不要为了刀光功能改动已稳定的弓箭运行时算法
- 不要把显示淡入淡出耦合到通用 attachment `alpha` 输入框；它必须是轨道求值结果与 attachment 基础 alpha 的乘积
- 不要让刀光临时父节点切换重新引入“回到水平朝向”的旧问题

## 10. Verification Requirements

最少验证应覆盖：

- 创建刀光 rig 后可保存并重新加载
- 绑定到手臂/剑骨骼后，拖动父骨骼时刀光保持 0 距离相接
- 出现帧触发 1 帧淡入
- 消失帧触发 1 帧淡出
- 循环播放时显示/隐藏区间正确重复
- 切换 action、复制关键帧、保存 JSON 后轨道不丢失
- 不回归现有箭矢 show/hide 与 temp parent 行为

## 11. Acceptance Criteria

当以下条件全部成立时，本次设计视为满足：

- 用户可以上传一张独立刀光图并生成刀光 rig
- 刀光可像箭矢一样设置暂时父骨骼
- 刀光可在某一帧开始出现、在某一帧开始消失
- 出现和消失都带固定 `1` 帧快速淡入淡出
- 循环播放结果符合区间语义
- JSON 保存/加载后结果稳定
- 现有箭矢功能未被破坏
