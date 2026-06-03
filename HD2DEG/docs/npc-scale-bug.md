# NPC 缩放异常（“几百米高”）排查与修复

## 现象
- 在 FX 全屏世界中，NPC 精灵被渲染得极大，看起来像“几百米高”。\n

## 根因
- NPC 绘制时错误地使用了 `projectWorldToScreen()` 返回的透视缩放系数 `p.scale` 来放大 spritesheet 帧尺寸。\n
- `p.scale` 的语义是**透视投影的远近缩放**，并不等价于“角色像素尺寸”。把它直接乘到 `frameW/frameH` 上，会在某些视角/位置导致**指数级夸张的视觉尺寸**。\n

错误示例（旧逻辑，概念上）：\n
```js
const dw = spr.frameW * (0.9 * p.scale);
const dh = spr.frameH * (0.9 * p.scale);
```\n

## 正确做法
- 角色（玩家与 NPC）的视觉尺寸应该由“世界渲染缩放”体系统一控制，即：\n
  - `animator.targetCharPx`（目标人物像素大小）\n
  - `animator.worldScale`（世界缩放）\n
  - `worldScaleRef`（参考缩放基准，项目内已有用法）\n

玩家的尺寸策略（项目内已有）：\n
- 先算 `effectiveCharPx = targetCharPx * (worldScale / worldScaleRef)`\n
- 再算 `charMul = clamp(effectiveCharPx / baseSpriteWidth)`\n
- 最终 `drawW = spriteFrameW * charMul`\n

NPC 应当与玩家一致：\n
```js
const worldScaleRef = 0.62;
const effectiveCharPx = (animator.targetCharPx || 22) * (animator.worldScale / worldScaleRef);
const baseW = Math.max(1, spr.frameW);
const charMul = Math.max(0.06, Math.min(4, effectiveCharPx / baseW));
const dw = spr.frameW * charMul;
const dh = spr.frameH * charMul;
```\n

## 本次修复点
- 文件：`scripts/pixel-workflow.js`\n
- 函数：`getNpcRenderablesForCanvas()`\n
- 修改：\n
  - 去掉 `dw/dh` 对 `p.scale` 的依赖\n
  - 改用与玩家相同的 `targetCharPx/worldScale` 计算逻辑\n

## 以后遇到类似问题怎么查
- **若物体随远近变化而变大/变小**：看 `projectWorldToScreen()` 的返回值（尤其 `p.scale`）\n
- **若角色大小应保持“像素角色尺寸一致”**：统一走 `targetCharPx/worldScale` 的尺寸链路，不要直接乘 `p.scale`\n
- **若只有 FX 全屏异常**：检查 FX 大屏分支是否用了不同的 `worldScale` 或不同的 canvas（`animator.stageCanvas` vs 预览 canvas）\n

