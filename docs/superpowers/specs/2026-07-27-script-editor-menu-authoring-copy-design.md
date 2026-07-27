# Script Editor Menu Authoring Copy Design

## Goal

将剧本编辑器中城市/建筑的【菜单】tab 从运行时结构直出，收口为纯创作面，作者界面不再显示运行时 `id` 或英文技术键。

## Scope

- 隐藏菜单 tab 中的 `instanceId`、`resourceId`、`entry.id`。
- 不再把 `menuFamily`、`targetFamily` 的英文原值直接展示给作者。
- 菜单用途、跳转类型、跳转对象全部改用中文创作语义显示。
- 新建菜单项的默认标题与默认菜单名改为中文。

## Constraints

- 不改动底层 `menuResources` / `menuInstances` / `MenuEntryDefinition` 的运行时契约。
- 作者面仍通过现有更新入口回写 `menuFamily`、`targetFamily`、`targetId`。
- 缺失引用或异常状态下，也不能把技术 `id` 暴露到主作者面文案。

## Design

- 在 `src/ui/main-ui/main-ui-flow.js` 为菜单 tab 增加中文用途/类型映射。
- 菜单用途字段保留内部 `menuFamily` 写回，但 UI 改为中文 `select`。
- 跳转类型字段保留内部 `targetFamily` 写回，但 UI 改为中文 `select`。
- 跳转对象选项改用 creator-facing label，不拼接 `(${id})`。
- 在 `src/application/script-editor/menu-authoring.ts` 中将默认菜单标题、默认菜单项标题改为中文，避免新增即出现英文。
