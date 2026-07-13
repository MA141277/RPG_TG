# Swordsman Dual Attack Variant Design

## 1. Goal

为剑士近战补充第二种攻击表现，并保证战斗运行时能够在每次剑士出手时严格 `50/50` 随机选择：

- 现有的“跳跃 + 挥砍”
- 新的“跳劈”

本次设计同时覆盖两部分：

- 剑士 Spine JSON 需要同时提供两套可独立调用的攻击动作
- 战斗运行时需要按动作变体驱动不同的位移窗口、命中帧和收招时序

## 2. Scope

### In Scope

- `src/faxian/leg/swordsman/project.json` 接入第二套剑士攻击动作
- `prototypes/battle-demo/index.html` 为剑士近战添加攻击变体选择层
- 为不同攻击变体配置不同的动作名、位移帧区间、命中帧和白闪帧
- 保持伤害结算、抖动、白闪、伤害数字与命中帧精确同步

### Out Of Scope

- 弓兵攻击逻辑
- 通用 Spine 渲染器的大规模重构
- 兵种数值、伤害公式、寻路规则的改写
- 其他兵种新增多攻击分支

## 3. Current Repository State

当前剑士近战链路是固定单一路径：

1. 代理单位先播放 `move/jump`
2. 到达落点后再播放 `attack/挥砍`
3. 在固定攻击帧触发受击、白闪和伤害数字
4. 动画结束后销毁代理单位，原位单位重新显示

运行时已经具备以下可复用能力：

- 代理单位创建与销毁
- 攻击中按帧驱动位移
- 抛物线跳跃轨迹
- 命中帧触发回调
- 白闪帧触发回调
- 目标抖动和伤害数字显示

因此本次不需要新建第二套战斗动画系统，而是在现有链路上为剑士插入“攻击变体配置”。

## 4. Recommended Approach

采用“剑士专用攻击变体配置层”的方案。

### Why

- 风险最低，只改剑士近战分支，不波及弓兵和其他兵种
- 复用现有代理单位、跳跃轨迹、命中回调和特效队列
- 后续如果剑士继续增加第三种攻击，只需要新增配置项，而不是继续膨胀单个流程函数

### Rejected Alternatives

#### A. 在 `playBattleSpineStrike` 里直接硬编码第二套攻击

可以实现，但会把动作选择、动作时序和特效时序耦合进一个函数，继续增加维护成本。

#### B. 把所有攻击帧语义完全下沉到 JSON 元数据

过度设计。当前只需要让剑士多一种攻击表现，没有必要在这次同时重构整套战斗 runtime 合同。

## 5. Target Runtime Model

### 5.1 Attack Variants

仅对剑士近战定义两个运行时攻击变体：

- `jump_slash`
- `jump_chop`

运行时在每次剑士近战出手前执行一次严格 `50/50` 随机：

- `Math.random() < 0.5` 选择 `jump_slash`
- 否则选择 `jump_chop`

随机只作用于单次攻击，不持久化，不影响伤害公式。

### 5.2 Variant Profiles

每个攻击变体通过配置描述，而不是在主流程里散落 magic number。

建议最小配置形状：

```js
{
  id: 'jump_chop',
  actionId: 'attack_jump_chop',
  usesSeparateMoveAction: false,
  moveStartFrame: 29,
  moveEndFrame: 41,
  impactFrame: 43,
  effectFrame: 43
}
```

`jump_slash` 与 `jump_chop` 共享统一调用入口，但读取不同 profile。

## 6. Animation Semantics

### 6.1 Existing Variant: `jump_slash`

保持现有表现：

- 先播放 `jump`
- 再播放 `挥砍`
- 保持当前命中帧与白闪触发点

这部分是回归基线，除非为适配新配置层必须做极小包装，否则不改变视觉结果。

### 6.2 New Variant: `jump_chop`

新变体按单段攻击动作执行，动作内部自带前跃：

- `0-29`：原地蓄力
- `29-41`：前跃并走现有抛物线轨迹
- `41-44`：下劈
- `43`：命中帧
- `44-66`：原地收刀
- `66`：动作结束，代理单位移除，原位剑士恢复显示

这里的关键点是：

- `jump_chop` 不再先播独立 `move`，而是在单段攻击动作内完成位移
- 位移仍然使用运行时现有的抛物线公式，避免新老跳跃轨迹手感不一致

## 7. JSON Integration

### 7.1 Required JSON State

剑士项目 JSON 需要同时存在：

- 原 `挥砍` 动作
- 新 `跳劈` 动作

运行时必须能够单独定位并调用这两套动作，不能通过覆盖 `selectedActionId` 的方式把其中一套挤掉。

### 7.2 Action Identity

运行时优先通过稳定 `id` 定位动作，名称只作为兼容后备。

建议约束：

- 原挥砍动作保留现有稳定身份
- 新跳劈动作写入新的独立 `id`
- 运行时 troop asset 为剑士声明：
  - 默认攻击动作列表
  - 跳劈动作列表

如果 JSON 中未找到跳劈动作，运行时应回退到 `jump_slash`，而不是抛异常或让战斗中断。

## 8. Runtime Flow

### 8.1 Shared Steps

两种攻击都复用以下公共步骤：

1. 解析攻击方兵种与 renderer
2. 创建代理单位
3. 计算源点和落点
4. 播放对应动作
5. 在命中帧触发受击逻辑
6. 清理代理单位并恢复原位单位

### 8.2 `jump_slash` Flow

```text
create proxy
play move action
play slash action
impact/effect callbacks
remove proxy
```

### 8.3 `jump_chop` Flow

```text
create proxy
play jump-chop action with internal movement window
impact/effect callbacks at frame 43
remove proxy
```

## 9. Impact And FX Rules

对 `jump_chop`，第 `43` 帧同时触发：

- 目标模型抖动
- 目标整体白闪
- 伤害数字或 `MISS`
- 伤害状态推进

这 4 个效果必须由同一命中时点驱动，不能拆成两个不一致的帧。

白闪不再沿用“命中前一帧预触发”的旧经验值，而是直接跟随 `jump_chop` 的明确命中帧，以保证与用户给定动作语义一致。

## 10. Error Handling And Fallback

### 10.1 Missing Jump-Chop Action

如果 `project.json` 中缺少跳劈动作：

- 剑士仍可正常攻击
- 本次攻击强制回退为 `jump_slash`
- 不允许出现空白动画、卡死或无命中回调

### 10.2 Missing Renderer / Missing Slot

继续沿用当前近战链路的保底逻辑：

- 找不到 renderer 或 DOM 槽位时，短延时后直接执行结算回调

## 11. Verification Requirements

最少验证覆盖：

- 剑士连续多次近战时，能观察到两种攻击都被触发，且长期接近 `50/50`
- `jump_slash` 表现与当前版本一致
- `jump_chop` 在 `29-41` 帧发生前跃，轨迹与现有跳跃一致
- `jump_chop` 在第 `43` 帧触发抖动、白闪和伤害数字
- `jump_chop` 在收刀阶段不继续前移
- 跳劈动作缺失时，剑士仍稳定回退为 `jump_slash`
- 弓兵攻击完全不受影响

## 12. Acceptance Criteria

当以下条件全部成立时，本次设计视为完成：

- 剑士每次近战出手都会严格 `50/50` 随机选择两种攻击之一
- 原“跳跃 + 挥砍”仍可正常播放
- 新“跳劈”可独立播放并按指定帧语义工作
- 命中帧、白闪、抖动、伤害数字时序一致
- `project.json` 可同时承载两套攻击动作
- 跳劈动作缺失时有稳定回退，不会破坏战斗流程
- 弓兵和其他兵种不发生行为回归
