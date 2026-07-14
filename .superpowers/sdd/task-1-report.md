# Task 1 Report: Replace The Toolbar Buttons With A Registry-Driven Dropdown

## 改了什么

- 将 `tools/spine-node-timeline-editor.html` 顶部 `unitContextToolbar` 的两个固定兵种按钮替换为单个 `Unit` 下拉框：`<select id="unitTypeSelect">`
- 将 `SPINE_UNIT_CONFIGS` 扩展为显式可用性注册表：
  - `swordsman.enabled = true`
  - `archer.enabled = true`
  - 新增 `spearman.enabled = false`
- 新增 `renderSpineUnitOptions()`，从 `Object.entries(SPINE_UNIT_CONFIGS)` 动态渲染所有下拉项
- 新增 `syncSpineUnitSelectValue()`，用 `state.currentUnitType` 同步当前下拉值
- 保留现有 `switchSpineUnitContext()` 机制，不加入确认弹窗逻辑
- 将 `bindEvents()` 的兵种入口绑定从旧按钮点击改为 `unitTypeSelect` 的 `change` 事件
- 更新 `tests/spine-unit-context.test.cjs`，移除旧按钮断言，改为覆盖 dropdown 渲染、disabled option、registry 驱动来源与 current-unit 同步

## 测试结果

- 目标命令：`C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
- 最终结果：`11 passed, 0 failed`

## TDD 证据

### RED

- 命令：
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
- 关键输出：
  - `fail 4`
  - `The input did not match the regular expression /id="unitTypeSelect"/`
  - `The input did not match the regular expression /enabled:\s*false/`
  - `The input did not match the regular expression /function renderSpineUnitOptions\(\) \{/`
  - `The input did not match the regular expression /function syncSpineUnitSelectValue\(\) \{/`

### GREEN

- 命令：
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
- 关键输出：
  - `pass 11`
  - `fail 0`

## 变更文件

- `tools/spine-node-timeline-editor.html`
- `tests/spine-unit-context.test.cjs`
- `/.superpowers/sdd/task-1-report.md`

## 自查结论

- 已遵守文件边界，代码改动仅在指定 HTML 与测试文件内，另补充本任务报告文件
- 旧 `unitSwordsmanBtn` / `unitArcherBtn` 入口已移除
- 下拉选项唯一来源为 `SPINE_UNIT_CONFIGS`
- 未实现 confirmation 逻辑，符合本任务边界
- 现有 `state.currentUnitType`、`switchSpineUnitContext()` 与 unit-specific feature-group gating 逻辑保持不变
- 共享控件未移入 unit-specific feature groups
- 未创建提交：当前工作区已存在与本任务无关的未提交改动，且目标文件本身也有既有差异；为避免把他人变更一并提交，本次保留未提交状态

## 2026-07-13 Task 1 follow-up fix

### Scope guard

- Stayed inside Task 1.
- Did not add confirmation logic in this pass.
- Limited code changes to `tools/spine-node-timeline-editor.html` and `tests/spine-unit-context.test.cjs`.

### Confirmed fixes

- Removed the placeholder `spearman` registry entry from `SPINE_UNIT_CONFIGS`.
- Kept the unit picker aligned to the live game assets currently used by battle runtime:
  - `剑士` -> `/src/faxian/leg/swordsman/project.json`
  - `弓兵` -> `/src/faxian/leg/archer/project.json`
- Corrected the toolbar selector label to `兵种`.
- Simplified picker option rendering so the dropdown text comes directly from `config.label`.
- Dropped the temporary `(unconfigured)` rendering branch and the test expectation for `enabled: false` placeholder entries.

### TDD evidence for this follow-up

#### RED

- Command:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
- Observed result:
  - `11 tests`
  - `7 pass`
  - `4 fail`
- Relevant failures:
  - placeholder `spearman` entry still existed
  - selector label was still `Unit` instead of `兵种`
  - picker source still contained `enabled: false` / `(unconfigured)` expectations
  - option rendering still used the temporary conditional label branch

#### GREEN

- Command:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
- Observed result:
  - `11 tests`
  - `11 pass`
  - `0 fail`

### Notes

- No commit was created in this sub-agent pass.
- The target HTML file already contains unrelated in-progress changes outside this follow-up; they were left untouched.
