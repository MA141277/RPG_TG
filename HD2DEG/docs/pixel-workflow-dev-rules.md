# pixel-workflow 开发规则（vibe coding 指南）

配套文档：`docs/pixel-workflow-split-blueprint.md`
适用对象：所有修改 `pixel-workflow.*` 相关代码的**人类开发者**与 **AI 助手**。

> 核心目标：让每一次改动都**局部可理解、可回滚**，不再出现"改一个地方坏另一个地方"。

---

## 一、运行方式（必须遵守）

1. **永远通过本地 HTTP 服务打开**：运行项目目录下的 `启动本地服务.bat`，从浏览器访问自动打开的 `http://` 地址。
2. **禁止双击 HTML 文件**（`file://`）。页面已有兜底警告，但 `file://` 会让 `fetch`、`localStorage`、外链 JS 行为不一致，调试无意义。
3. 新增依赖文件全部放在项目子目录内（`styles/`、`scripts/`、`mud/` 等），**使用相对路径**引用（`./xxx/yyy.js`）。
4. 路径里**不要出现中文 / 空格**。项目根目录名 `像素wf` 是磁盘路径，不计入仓库。仓库内所有新建文件夹、文件名、资源名**只用 ASCII**。

---

## 二、代码组织（对应拆分蓝图）

1. **一次只做一件事**：新增功能 / 修 bug 只碰最相关的那一两个文件，不"顺手重构"。
2. **禁止把多个职责塞回同一个文件**：
   - ❌ 在 `image/background.js` 里写渲染循环
   - ❌ 在 `render/renderer.js` 里写生图 API 调用
   - ✅ 渲染只关心"怎么画"；生成只关心"怎么拿到图"
3. **状态集中**：所有运行时可变状态放在 `animator` 或 `appState`（Phase 5 后）对象里。**不要**新增散落的顶层 `let`。
4. **DOM 引用集中**：所有 `getElementById` / `querySelector` 写在 `app/dom-refs.js`，其它文件**只读**这些引用。

---

## 三、`<script>` 加载顺序（严格）

当前项目**只用 classic `<script>`**（不是 `type="module"`）。因此：

1. **被依赖方必须先加载**。例如 `animator/state.js` 必须在 `animator/controls.js` 之前。
2. 新增脚本时，按蓝图第 5 节的顺序插入到 `pixel-workflow.html`，不要图省事扔到末尾。
3. **禁止循环依赖**。如果 A 调 B、B 调 A，说明该拆出第三个文件或把共享状态上移。
4. 初始化代码（`addEventListener`、`requestAnimationFrame`、IIFE）**只写在 `main.js`**。其它文件只定义函数和状态，不自动启动任何行为。

---

## 四、作用域与命名

1. classic `<script>` 顶层的 `let / const / function` 全部共享，**全局可见**。因此：
   - ❌ 不要在不同文件里声明同名 `const`（会报错 / 互相覆盖）
   - ✅ 不同模块用明显前缀：`fxXxx`、`animatorXxx`、`sceneXxx`
2. **绝不使用顶层 `var`**。所有新代码用 `let / const`。
3. 临时 / 私有变量放在函数体内，不要溢到顶层。

---

## 五、拆分 / 搬家操作规范

这是把现有代码从 `scripts/pixel-workflow.js` 抽到子模块时必须遵守的流程：

1. **不改行为**：搬家 = 纯文本移动 + 调用关系保持。变量名、函数名、判断分支、常量值**一律不动**。
2. **整体搬完再动格式**：搬完后不立即格式化 / 重排 / 改 lint。格式化单独一次提交。
3. **每次只搬一个文件** 的目标模块。对应老代码**删除**，不要注释掉（注释留着会诱导 AI 按旧版本思路判断）。
4. **搬完立刻回归**（见 §七）。任何一点点异常，立刻 `git revert` 回到上一版再分析。
5. **提交信息前缀**：
   - `refactor(split): extract xxx` — 搬家
   - `chore(style): format xxx` — 纯格式
   - `feat(xxx): ...` / `fix(xxx): ...` — 功能 / 修复

---

## 六、AI 协作规则

让 AI 帮你改代码时：

1. **明确边界**：告诉 AI 只改哪个模块、不要动其它文件。例如"只改 `scripts/scene/scene-store.js`，不要动渲染相关的文件"。
2. **提供上下文**：把 `docs/pixel-workflow-split-blueprint.md` 和这份规则一起喂给它。
3. **拒绝跨文件大改**：如果 AI 提出要同时改 3+ 个文件，先问清楚"是否必要"，多数情况可以拆成多轮。
4. **用小步提交换安全**：每完成一个子任务让 AI 停下、commit、然后继续。
5. **AI 新增的 `console.log` / 调试注释**：合并前删干净。
6. **AI 不应该**：
   - 不应该"顺手"重命名已有变量
   - 不应该把 classic script 改成 ESM
   - 不应该新增未在蓝图中列出的目录
   - 不应该引入 npm / 打包器（除非专门开一轮"工程化"任务）

---

## 七、回归点击清单

每次改完 / 搬完 / 合并前，至少跑一遍：

### 启动检查
- [ ] 运行 `启动本地服务.bat`，页面加载无白屏
- [ ] DevTools Console **零报错**（黄色 warning 可接受但记录下来）
- [ ] DevTools Network 里 `styles/*.css` 和 `scripts/*.js` 全部 `200`，MIME 正确（`text/css` / `text/javascript`）

### 生图路径
- [ ] 点"生成图像"按钮，`/v1/images/generations` 请求发出
- [ ] 点"测试去白底（maid.png）"
- [ ] 点"测试切片对齐（hu.jpg）"
- [ ] 点"生成建筑三视图"

### 动画器 + FX
- [ ] 默认 `8direction.png` 成功加载，动画器有图
- [ ] 调整地平线 / 相机高度 / 纵深尺度滑条，两个舞台画面同步变化
- [ ] 点右侧 CRT/FX 舞台进入全屏，WASD 移动、Q/E 偏航都可用
- [ ] FX HUD 保存 / 重置 / 隐藏 / 画面 ↑↓ 按钮都有响应

### 场景 + 放置
- [ ] FX 全屏里"放置 Hut"→ 地面出现预览 → 确认后保留
- [ ] "保存场景" / "加载场景" / "新建场景" / "重算村路" 都能生效
- [ ] 刷新页面后自动恢复上次激活的场景

### 资产库
- [ ] "保存当前人物" / "刷新人物库" 走通
- [ ] "保存当前建筑" / "刷新建筑库" 走通

> 任一项失败都视为本轮不过，必须先修复或回滚。

---

## 八、常见坑

1. **`file://` 下 `localStorage` 写不进**：场景 / FX 参数会丢。务必 HTTP。
2. **`<script>` 顺序错导致 `ReferenceError: xxx is not defined`**：多半是被依赖方还没加载。回到蓝图第 5 节核对。
3. **CSS / JS 改完不生效**：硬刷新（`Ctrl+F5`），或在 DevTools 勾选 "Disable cache"。
4. **Canvas 尺寸异常**：`drawAnimator` / `resizeFxBigCanvasToViewport` 对 DPR 敏感，不要在运行时随便改 `width` / `height` 属性。
5. **非 ASCII 文件名 404**：重命名文件 / 目录为纯英文。
6. **引入的新外链脚本跨域**：只用相对路径、同源资源。如果必须用 CDN，确认对方带 CORS 头。

---

## 九、什么时候可以"大改"

以下情况允许不走增量拆分：

1. Phase 5 收口全局变量时（单独一轮）。
2. 升级到 ESM / 引入打包器时（单独一轮）。
3. 添加测试框架时（单独一轮）。

**这三种情况之外，一律按蓝图走增量。**

---

## 十、新功能放哪（决策树）

拆分尚未走完，但不代表新功能就得回到老单体文件里堆。按下列顺序判断，保证"新增的代码 = 新增的文件"，以后拆起来几乎零成本。

### 10.1 快速决策表

| 新功能类型 | 新文件放哪 | 加载顺序位置 | 备注 |
| --- | --- | --- | --- |
| 新增接口地址 / API Key / 全局常量 | 改 `scripts/app/boot.js` 的 `CONFIG` | 不变 | 不要另起 `const XXX_URL = ...` 散在别处 |
| 新 UI 面板（独立按钮 / 抽屉 / 弹窗） | `scripts/ui/<panel-name>.js` | 主 JS 之**前** | 只放该面板的渲染与事件绑定，状态挂到 `animator` |
| 新生成工作流（调 LLM / 图像 / 音频） | `scripts/generation/<name>.js` | 主 JS 之**前** | 请求走 boot.js 的 `CONFIG`，产物走 library |
| 新资产类型（类似人物 / 建筑） | `scripts/library/<type>-library.js` | 主 JS 之**前** | 复用 `buildPreviewCard` / `renderHudPreviewGrid` 风格 |
| 新场景 / tilemap 行为 | `scripts/scene/<name>.js` | 主 JS 之**前** | 和 `scene-store.js` 的 snapshot schema 对齐 |
| 新渲染效果（后处理、粒子、着色器） | `scripts/fx/<effect>.js` 或 `scripts/render/<effect>.js` | 主 JS 之**前** | 只暴露一个入口函数给 `drawAnimator` 调用 |
| 新输入方式（手柄 / 触控 / 快捷键） | `scripts/animator/<input-name>.js` | 主 JS 之**前** | 统一修改 `animator.pressed` / 事件流 |
| 小到 5 行的纯工具函数 | 可临时留在老单体里，但必须在文件开头注释 `// TODO: split to scripts/util/xxx.js` | — | 下次主题搬家一起带走 |

### 10.2 命名与加载硬规则

1. **所有新文件只用 ASCII 命名**，小写 + 短横线，如 `night-cycle.js`。
2. **每新加一个 `<script src>`**，同时做四件事：
   - 插入位置按 §10.1 表；在主 JS `./scripts/pixel-workflow.js` **之前**
   - `docs/pixel-workflow-file-map.md` §3 加一行，状态写 `current`
   - `docs/pixel-workflow-split-blueprint.md` §5 如果这个文件不在列表里，追加进去（不要删旧表）
   - 提交消息前缀用 `feat(<area>):`
3. **禁止"把新功能写在 `pixel-workflow.js` 中间"**。就算它看起来和旁边某段"很像"，也先开新文件。
4. **状态对象只有两个**：`animator`（现存）、未来的 `appState`。新功能的运行时状态挂到 `animator.xxx`（用新键名），**不要再造第三个全局对象**。

### 10.3 当你不确定时

按这个顺序问自己：

1. "是不是改一下 `CONFIG` 就够了？" → 是：`boot.js` 里加一项，完事
2. "是不是某个现有模块的子功能？" → 是：找到它所属目录，新文件放同目录
3. "是不是一个全新的大块功能？" → 是：开一个新子目录 `scripts/<new-area>/`，先写一个 `README.md` 说明它是干什么的，再加第一个 js
4. 以上都不是 → 先停下来问人类，不要硬塞

### 10.4 最小改动示例

假设今天要新增"天气系统"：

```
scripts/weather/
  weather-state.js         # const weather = { mode: "clear", ... }
  weather-renderer.js      # function drawWeather(ctx, animator) { ... }
```

HTML 中按 §10.1 要求插入：

```html
<script src="./scripts/weather/weather-state.js"></script>
<script src="./scripts/weather/weather-renderer.js"></script>
<script src="./scripts/pixel-workflow.js"></script>
```

`scripts/pixel-workflow.js` 里只在 `drawAnimator` 合适的位置加 **一行** `drawWeather(ctx, animator);`。
`docs/pixel-workflow-file-map.md` §3.1 新增 2 行记录。

**这一次新增功能，老单体文件只多了 1 行。** 这就是拆分到这个程度已经带来的"新功能好管理"的红利。
