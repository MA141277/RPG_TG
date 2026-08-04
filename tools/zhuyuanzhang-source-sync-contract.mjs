import path from "node:path";

export const DEFAULT_TEMPLATE_PUBLIC_PACK_URL =
  "/script-editor-templates/zhuyuanzhang/pack.json";

export const MAINTAINED_PACK_ROOTS = Object.freeze({
  builtinRuntimePack: "src/content/scenario-packs/zhuyuanzhang",
  scriptEditorTemplatePack:
    "src/modules/script-editor/builtin-templates/zhuyuanzhang",
});

export const PUBLISHED_PACK_ROOTS = Object.freeze({
  publicTemplatePublication: "public/script-editor-templates/zhuyuanzhang",
});

export const SUPPORTED_SYNC_SOURCES = Object.freeze([
  "builtin-runtime-pack",
  "script-editor-template-pack",
]);

export const PUBLIC_RETIREMENT_GATE = Object.freeze([
  "default template loader no longer depends on /script-editor-templates/zhuyuanzhang/pack.json",
  "equivalent browser-loadable template coverage exists outside public/script-editor-templates/zhuyuanzhang/**",
  "script-editor template URL and regression tests have been updated and verified",
]);

export const SHARED_SYNC_FILE_RULES = Object.freeze([
  Object.freeze({
    fileName: "scenario-profile.json",
    mode: "replace-whole-file",
    reason: "启动期场景配置目前必须在两包之间保持一致。",
  }),
  Object.freeze({
    fileName: "characters.json",
    mode: "startup-character-projection",
    reason: "当前只同步启动期角色身份字段，并保留模板包专属元数据。",
  }),
  Object.freeze({
    fileName: "text-entries.json",
    mode: "shared-key-overlay",
    reason: "共享文本条目需要一致，但模板包额外的编辑器/运行时辅助条目不能被覆盖掉。",
  }),
  Object.freeze({
    fileName: "activities.json",
    mode: "shared-id-overlay",
    reason: "活动记录的共享字段要同步，但需要保留包专属字段与包专属活动。",
  }),
]);

export const ADDITIVE_SHARED_TEXT_ENTRY_PREFIXES = Object.freeze([
  "runtime.zhu_yuanzhang.temple.",
]);

export const DEFERRED_SYNC_FILE_RULES = Object.freeze([
  Object.freeze({
    fileName: "pack.json",
    reason: "清单仍混合运行时源、编辑器源和 public 发布层差异，需在 Task 3 专门收口。",
  }),
  Object.freeze({
    fileName: "cities.json",
    reason: "模板包包含 mapPlacement/mountedBuildings/menuInstanceIds 等编辑器专属结构，不能直接整文件同步。",
  }),
  Object.freeze({
    fileName: "city-entries.json",
    reason: "模板包使用 template house 目标，而运行时包使用 builtin house 目标，需要明确映射规则后再同步。",
  }),
  Object.freeze({
    fileName: "events.json",
    reason: "模板包与运行时包当前使用不同的事件承载形态，需等待事件 owner 进一步统一。",
  }),
  Object.freeze({
    fileName: "houses.json",
    reason: "模板包 house id 仍是 template 体系，而运行时包是 builtin/runtime 体系，当前不能直接互相覆盖。",
  }),
  Object.freeze({
    fileName: "maps.json",
    reason: "模板包地图仍携带编辑器与预览坐标/统计数据，运行时包则携带 campaign 运行时扩展字段，需专门映射。",
  }),
]);

export const BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS = Object.freeze([
  "playables",
  "playableIntegrations",
  "settlements",
]);

export const PLAYABLE_FAMILY_FILE_NAMES = Object.freeze([
  "playables.json",
  "playable-integrations.json",
  "playable-shells.json",
]);

export const RUNTIME_BUILDING_SUPPORT_FILE_NAMES = Object.freeze([
  "building-arrangements.json",
  "dialogues.json",
  "event-bindings.json",
  "house-module-defaults.json",
  "location-access.json",
  "menu-instances.json",
  "menu-resources.json",
  "settlements.json",
]);

export const RUNTIME_SAFE_EVENT_MIRROR_IDS = Object.freeze([
  "event.building.template.house.temple.review",
  "event.building.house.kulan.temple.copy_scripture",
  "event.building.house.kulan.temple.sweep_courtyard",
  "event.building.template.house.temple.leave",
  "event.building.template.house.temple.donate",
  "event.building.house.kulan.temple.carry_water",
]);

export const PLAYABLE_FAMILY_OWNERSHIP = Object.freeze({
  canonicalMaintainedOwner: "scriptEditorTemplatePack",
  runtimePackMirrorMode: "derived-from-script-editor-template-pack",
  publicPublicationFile: "playable-shells.json",
  publicPublicationDerivedFrom: "playable-shells.json",
});

export const PUBLICATION_REVIEW_EVENT_IDS = Object.freeze([
  "event.building.template.house.temple.review",
  "event.building.template.house.leader_residence.review",
]);

export const PUBLICATION_REVIEW_DIALOGUE_IDS = Object.freeze([
  "scene.building.template.house.temple.review",
  "scene.building.template.house.leader_residence.review",
]);

export const LEGACY_PUBLICATION_FILE_RULES = Object.freeze([]);

export const PUBLICATION_ONLY_MANIFEST_FILE_KEYS = Object.freeze(
  LEGACY_PUBLICATION_FILE_RULES.map((rule) => rule.manifestKey)
);

export const PUBLICATION_SYNC_FILE_RULES = Object.freeze([
  Object.freeze({
    fileName: "pack.json",
    mode: "public-manifest-projection",
    reason: "public 发布层清单应由 builtin 模板清单投影生成，并保留当前遗留发布专属键。",
  }),
  Object.freeze({
    fileName: "playable-shells.json",
    mode: "public-playable-shells-projection",
    reason:
      "public 发布层应同步暴露 canonical 的 playable-shells.json，默认模板导入不再依赖旧的 flow-playables 兼容文件。",
  }),
  Object.freeze({
    fileName: "events.json",
    mode: "public-review-event-projection",
    reason:
      "public 发布层中的 review 事件必须投影自 builtin template，避免旧 launchFlow authored 内容继续分叉。",
  }),
  Object.freeze({
    fileName: "dialogues.json",
    mode: "public-review-dialogue-projection",
    reason:
      "public 发布层中的 review 对话必须投影自 builtin template，保证默认模板导入拿到 canonical authored dialogues。",
  }),
]);

export function resolveZhuyuanzhangPackRoots(repoRoot) {
  return {
    runtimeRoot: path.join(repoRoot, MAINTAINED_PACK_ROOTS.builtinRuntimePack),
    builtinTemplateRoot: path.join(
      repoRoot,
      MAINTAINED_PACK_ROOTS.scriptEditorTemplatePack
    ),
    publicTemplateRoot: path.join(
      repoRoot,
      PUBLISHED_PACK_ROOTS.publicTemplatePublication
    ),
  };
}

export function resolveZhuyuanzhangSyncDirection(
  repoRoot,
  source = "builtin-runtime-pack"
) {
  if (!SUPPORTED_SYNC_SOURCES.includes(source)) {
    throw new Error(
      `Unsupported zhuyuanzhang sync source "${source}". Expected one of: ${SUPPORTED_SYNC_SOURCES.join(
        ", "
      )}`
    );
  }

  const { runtimeRoot, builtinTemplateRoot, publicTemplateRoot } =
    resolveZhuyuanzhangPackRoots(repoRoot);

  if (source === "script-editor-template-pack") {
    return {
      sourceRoot: builtinTemplateRoot,
      targetRoots: [runtimeRoot, publicTemplateRoot],
    };
  }

  return {
    sourceRoot: runtimeRoot,
    targetRoots: [builtinTemplateRoot, publicTemplateRoot],
  };
}
