# UI Contract Reserve Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land additive UI contract reserve seams, optional pack UI split-table support, and explicit asset-layering rules without changing current runtime/render behavior or enabling Editor mode.

**Architecture:** Add a new `src/domain/ui/**` and `src/application/ui/**` reserve surface alongside the existing `UiLayout` path, extend content-pack typing/loading additively, and seed builtin UI reserve content without wiring it into `src/main.ts` or the current renderer. The implementation must prove default behavior remains unchanged when no UI reserve data is present.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), Vite build, current content-pack loader/runtime contracts, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Child 11 closeout sync now records this as the immediate next executable UI layout/interface-reserve child. No production implementation batch has started yet.`
- Next Step: `Start Task 1 Step 1 from this plan. Keep the work additive and do not bypass Child 12 to unlock Child 13 early.`
- Verification: `Queue-state reconciliation: npm run lint:plans`
- Notes: `Child 12 must stay additive. Do not change current src/main.ts render entry, current layout editor behavior, or current default pack runtime path while implementing this plan.`

## Progress Log

- 2026-07-01
  - Summary: `Plan created and queued as the immediate post-Child-11 UI layout/interface-reserve child for additive UI contract reserve work.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for Child 11 completion and a weekly unlock before starting Task 1 Step 1.`
- 2026-07-02
  - Summary: `Reconciled Child 12 queue state after Child 11 closeout. Weekly, parent, and visibility governance now treat Child 12 as the immediate next executable child, while Child 13 remains locked behind Child 12 completion and a later review.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1 from this plan without reopening Child 11 scope.`

---

## Source Documents

- Child 12 spec: `docs/superpowers/specs/2026-07-01-ui-contract-reserve-spec.md`
- Weekly controller: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Plan governance: `docs/superpowers/specs/plan-governance-spec.md`

## Parent Alignment

- This file is `Child Plan 12` in the weekly queue.
- Primary subsystem boundary:
  - `Future UI Contract Reserve`, `Pack UI split-table reserve`, `Asset layering reserve`
- Secondary subsystem relationships:
  - must remain outside Child 11 runtime ownerization implementation
  - must remain additive to the existing `UiLayout` and layout editor path
  - may prepare later UI override and Editor work, but must not enable either during this child
- Queue rule:
  - Child 12 is now executable because Child 11 is completed and weekly closeout sync records Child 12 as the immediate next child; Child 12 completion then unlocks Child 13 for a later review gate.

## Scope

This child plan includes:

- formal UI contract type reserve under `src/domain/ui/**`
- additive UI reserve resolver/validator seams under `src/application/ui/**`
- builtin UI reserve content seeding under `src/content/ui/**`
- optional content-pack UI split-table typing and loader support
- tests proving reserve fields are optional and current default behavior stays unchanged
- required weekly/governance closeout sync

This child plan does not include:

- current runtime ownerization work
- enabling Editor mode
- migrating current renderer to schema-driven rendering
- changing current layout editor interaction behavior
- changing current `src/main.ts` render flow
- current mod capability activation behavior for UI override
- user-content runtime loading

## File Map

### Existing files to modify

- `src/domain/content-pack.ts`
  - Add optional UI reserve fields to the formal pack definition.
- `src/application/content/content-pack-loader.ts`
  - Extend manifest file-key support additively for optional UI reserve tables.
- `tests/robustness.test.cjs`
  - Add reserve contract and backward-compat loader tests.
- `docs/change-log.md`
  - Record the new contract reserve and additive pack-loader surface.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Record Child 12 queue state and later closeout state.

### New files to create

- `src/domain/ui/screen-schema.ts`
  - Formal future screen-schema contract types.
- `src/domain/ui/screen-layout.ts`
  - Formal future screen-layout contract types.
- `src/domain/ui/screen-skin.ts`
  - Formal future screen-skin contract types.
- `src/domain/ui/asset-catalog.ts`
  - Formal future asset-catalog contract types.
- `src/domain/ui/ui-screen-contract.ts`
  - Shared composed types for resolved UI contracts.
- `src/application/ui/ui-contract-validator.ts`
  - Pure validation helpers for schema/layout/skin/catalog payloads.
- `src/application/ui/ui-layout-resolver.ts`
  - Additive layout reserve resolver with builtin/no-op behavior.
- `src/application/ui/ui-skin-resolver.ts`
  - Additive skin reserve resolver with builtin/no-op behavior.
- `src/application/ui/ui-asset-resolver.ts`
  - Alias resolution helpers with layered fallback rules.
- `src/application/ui/ui-contract-registry.ts`
  - Builtin reserve registry for future UI contract consumers.
- `src/content/ui/screen-schemas/builtin-screen-schemas.ts`
  - Builtin screen-schema reserve data for the currently supported layout-editor screens.
- `src/content/ui/layout-presets/builtin-layout-presets.ts`
  - Builtin layout reserve data seeded from current layout defaults.
- `src/content/ui/skin-presets/builtin-skin-presets.ts`
  - Builtin skin reserve data seeded from current layout-editor preset resources.
- `src/content/ui/asset-catalogs/builtin-ui-asset-catalog.ts`
  - Builtin alias-based UI asset catalog.

## Task 1: Add Formal UI Contract Types

**Files:**
- Create: `src/domain/ui/screen-schema.ts`
- Create: `src/domain/ui/screen-layout.ts`
- Create: `src/domain/ui/screen-skin.ts`
- Create: `src/domain/ui/asset-catalog.ts`
- Create: `src/domain/ui/ui-screen-contract.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Write the failing contract-export tests**

Add tests like:

```js
test("ui contract modules export the reserve contract families", async () => {
  const schema = await import("../.test-dist/domain/ui/screen-schema.js");
  const layout = await import("../.test-dist/domain/ui/screen-layout.js");
  const skin = await import("../.test-dist/domain/ui/screen-skin.js");
  const assets = await import("../.test-dist/domain/ui/asset-catalog.js");
  const contract = await import("../.test-dist/domain/ui/ui-screen-contract.js");

  assert.equal(typeof schema.isScreenSchemaComponentKind, "function");
  assert.equal(typeof layout.isScreenLayoutPreset, "function");
  assert.equal(typeof skin.isScreenSkinPreset, "function");
  assert.equal(typeof assets.isUiAssetCatalog, "function");
  assert.equal(typeof contract.createEmptyResolvedScreenContract, "function");
});
```

- [ ] **Step 2: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "ui contract modules export the reserve contract families"
```

Expected:

- the new targeted test fails because the new modules do not exist yet

- [ ] **Step 3: Implement the minimal contract modules**

Create reserve modules with minimal guards and helpers, for example:

```ts
// src/domain/ui/screen-schema.ts
export const screenSchemaComponentKinds = [
  "panel",
  "button",
  "label",
  "portrait",
  "list",
  "progress",
] as const;

export type ScreenSchemaComponentKind =
  (typeof screenSchemaComponentKinds)[number];

export type ScreenComponentSchema = {
  id: string;
  kind: ScreenSchemaComponentKind;
  required: boolean;
  defaultVisible: boolean;
};

export type ScreenSchema = {
  id: string;
  version: number;
  components: ScreenComponentSchema[];
};

export function isScreenSchemaComponentKind(
  value: unknown
): value is ScreenSchemaComponentKind {
  return (
    typeof value === "string" &&
    screenSchemaComponentKinds.includes(value as ScreenSchemaComponentKind)
  );
}
```

- [ ] **Step 4: Re-run the targeted contract tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "ui contract modules export the reserve contract families"
```

Expected:

- the targeted contract-export test passes

- [ ] **Step 5: Run the full verification gate for Task 1**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with no current runtime/render behavior changes

## Task 2: Add Pure UI Reserve Resolvers And Validators

**Files:**
- Create: `src/application/ui/ui-contract-validator.ts`
- Create: `src/application/ui/ui-layout-resolver.ts`
- Create: `src/application/ui/ui-skin-resolver.ts`
- Create: `src/application/ui/ui-asset-resolver.ts`
- Create: `src/application/ui/ui-contract-registry.ts`
- Modify: `tests/robustness.test.cjs`
- Read: `src/domain/ui/*.ts`

- [ ] **Step 1: Write the failing reserve resolver tests**

Add tests like:

```js
test("ui asset resolver prefers higher-priority layered aliases", async () => {
  const { resolveUiAssetAlias } = await import(
    "../.test-dist/application/ui/ui-asset-resolver.js"
  );

  const resolved = resolveUiAssetAlias("ui.button.start.default", {
    builtin: { "ui.button.start.default": "/builtin/start.png" },
    pack: { "ui.button.start.default": "/pack/start.png" },
    mod: { "ui.button.start.default": "/mod/start.png" },
    user: { "ui.button.start.default": "/user/start.png" },
  });

  assert.equal(resolved?.url, "/user/start.png");
});

test("ui reserve registry returns builtin-only defaults when no overrides exist", async () => {
  const { createUiContractRegistry } = await import(
    "../.test-dist/application/ui/ui-contract-registry.js"
  );

  const registry = createUiContractRegistry({
    builtinSchemasById: { "global-hud": { id: "global-hud", version: 1, components: [] } },
    builtinLayoutsById: { "global-hud": { screenId: "global-hud", version: 1, canvas: { width: 1600, height: 900 }, components: [] } },
    builtinSkinsById: { "global-hud": { screenId: "global-hud", version: 1, themeId: "builtin", components: [] } },
    builtinAssetCatalogs: [],
  });

  assert.equal(registry.getSchema("global-hud")?.id, "global-hud");
});
```

- [ ] **Step 2: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "ui asset resolver prefers higher-priority layered aliases|ui reserve registry returns builtin-only defaults when no overrides exist"
```

Expected:

- the new resolver/registry tests fail before implementation

- [ ] **Step 3: Implement the pure reserve seams**

Implement pure helpers, for example:

```ts
// src/application/ui/ui-asset-resolver.ts
export function resolveUiAssetAlias(
  alias: string,
  layers: {
    builtin?: Record<string, string>;
    pack?: Record<string, string>;
    mod?: Record<string, string>;
    user?: Record<string, string>;
  }
): { alias: string; url: string } | null {
  const url =
    layers.user?.[alias] ??
    layers.mod?.[alias] ??
    layers.pack?.[alias] ??
    layers.builtin?.[alias] ??
    null;

  return url == null ? null : { alias, url };
}
```

- [ ] **Step 4: Re-run the targeted reserve seam tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "ui asset resolver prefers higher-priority layered aliases|ui reserve registry returns builtin-only defaults when no overrides exist"
```

Expected:

- all targeted resolver/registry tests pass

- [ ] **Step 5: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with the new reserve seams still unused by the current render path

## Task 3: Seed Builtin UI Reserve Content

**Files:**
- Create: `src/content/ui/screen-schemas/builtin-screen-schemas.ts`
- Create: `src/content/ui/layout-presets/builtin-layout-presets.ts`
- Create: `src/content/ui/skin-presets/builtin-skin-presets.ts`
- Create: `src/content/ui/asset-catalogs/builtin-ui-asset-catalog.ts`
- Modify: `tests/robustness.test.cjs`
- Read: `src/domain/ui-layout.ts`
- Read: `src/content/layout-editor-presets.ts`

- [ ] **Step 1: Write the failing builtin reserve seed tests**

Add tests like:

```js
test("builtin ui reserve content covers the current layout-editor targets", async () => {
  const { builtinScreenSchemasById } = await import(
    "../.test-dist/content/ui/screen-schemas/builtin-screen-schemas.js"
  );
  const { builtinLayoutPresetsById } = await import(
    "../.test-dist/content/ui/layout-presets/builtin-layout-presets.js"
  );
  const { builtinSkinPresetsById } = await import(
    "../.test-dist/content/ui/skin-presets/builtin-skin-presets.js"
  );

  for (const targetId of [
    "global-hud",
    "start-screen",
    "character-select-screen",
    "character-detail-screen",
  ]) {
    assert.equal(typeof builtinScreenSchemasById[targetId], "object");
    assert.equal(typeof builtinLayoutPresetsById[targetId], "object");
    assert.equal(typeof builtinSkinPresetsById[targetId], "object");
  }
});
```

- [ ] **Step 2: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "builtin ui reserve content covers the current layout-editor targets"
```

Expected:

- the builtin reserve-content coverage test fails before implementation

- [ ] **Step 3: Implement builtin reserve seed modules**

Seed reserve data from existing layout-editor defaults, for example:

```ts
// src/content/ui/screen-schemas/builtin-screen-schemas.ts
export const builtinScreenSchemasById = {
  "global-hud": {
    id: "global-hud",
    version: 1,
    components: [
      { id: "portrait-frame", kind: "portrait", required: true, defaultVisible: true },
      { id: "status-board", kind: "panel", required: true, defaultVisible: true },
      { id: "task-panel", kind: "panel", required: false, defaultVisible: true },
    ],
  },
} as const;
```

Keep the seed additive:

- do not delete `src/content/layout-editor-presets.ts`
- do not wire these new builtin reserve modules into `src/main.ts`

- [ ] **Step 4: Re-run the targeted builtin reserve tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "builtin ui reserve content covers the current layout-editor targets"
```

Expected:

- the builtin reserve-content coverage test passes

- [ ] **Step 5: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass and the current layout-editor path still behaves as before

## Task 4: Add Optional Pack UI Split-Table Support

**Files:**
- Modify: `src/domain/content-pack.ts`
- Modify: `src/application/content/content-pack-loader.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Write the failing backward-compatible loader tests**

Add tests like:

```js
test("content pack definition accepts optional ui reserve fields", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), ".test-dist", "domain", "content-pack.js"),
    "utf8"
  );

  assert.equal(source.includes("uiLayouts"), true);
  assert.equal(source.includes("uiSkins"), true);
  assert.equal(source.includes("uiAssetCatalogs"), true);
});

test("content pack loader ignores missing optional ui reserve files", async () => {
  const { loadContentPackFromManifestText } = await import(
    "../.test-dist/application/content/content-pack-loader.js"
  );

  global.fetch = async (url) => {
    if (String(url).endsWith("/pack.json")) {
      return {
        ok: true,
        text: async () =>
          JSON.stringify({
            schemaVersion: 1,
            id: "pack.test",
            title: "Pack Test",
            files: { maps: "maps.json" },
          }),
      };
    }

    return {
      ok: true,
      json: async () => [],
    };
  };

  const pack = await loadContentPackFromManifestText(
    JSON.stringify({
      schemaVersion: 1,
      id: "pack.test",
      title: "Pack Test",
      files: { maps: "maps.json" },
    }),
    "file:///virtual/pack.json"
  );

  assert.equal(pack.id, "pack.test");
  assert.equal(pack.uiLayouts == null, true);
});
```

- [ ] **Step 2: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "content pack definition accepts optional ui reserve fields|content pack loader ignores missing optional ui reserve files"
```

Expected:

- the new optional-ui-field tests fail before implementation

- [ ] **Step 3: Implement the additive pack reserve support**

Add optional fields only, for example:

```ts
// src/domain/content-pack.ts
import type { UiAssetCatalog } from "./ui/asset-catalog";
import type { ScreenLayoutPreset } from "./ui/screen-layout";
import type { ScreenSkinPreset } from "./ui/screen-skin";

export type ContentPackDefinition = {
  // existing fields...
  uiLayouts?: ScreenLayoutPreset[];
  uiSkins?: ScreenSkinPreset[];
  uiAssetCatalogs?: UiAssetCatalog[];
};
```

And extend the file-key whitelist additively:

```ts
const CONTENT_PACK_FILE_KEYS = [
  "maps",
  "cities",
  "houses",
  // existing keys...
  "uiLayouts",
  "uiSkins",
  "uiAssetCatalogs",
] as const;
```

Do not:

- require these files
- change current runtime consumers to read them

- [ ] **Step 4: Re-run the targeted pack reserve tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "content pack definition accepts optional ui reserve fields|content pack loader ignores missing optional ui reserve files"
```

Expected:

- all targeted optional-field tests pass

- [ ] **Step 5: Run the full verification gate for Task 4**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass and current builtin/default content-pack loading still works unchanged

## Task 5: Prove The Reserve Path Is Inactive By Default

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/main.ts`
- Read: `src/content/layout-editor-presets.ts`
- Read: `src/application/layout-editor/layout-editor-target-registry.ts`

- [ ] **Step 1: Write the failing default-path protection tests**

Add tests like:

```js
test("main runtime path does not import the ui reserve registry yet", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );

  assert.equal(source.includes("./application/ui/ui-contract-registry"), false);
});

test("existing layout editor target registry still stays on the current ui-layout path", async () => {
  const source = await fs.promises.readFile(
    path.join(
      process.cwd(),
      "src",
      "application",
      "layout-editor",
      "layout-editor-target-registry.ts"
    ),
    "utf8"
  );

  assert.equal(source.includes("../../domain/ui-layout"), true);
});
```

- [ ] **Step 2: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "main runtime path does not import the ui reserve registry yet|existing layout editor target registry still stays on the current ui-layout path"
```

Expected:

- both protection tests pass before the inactive-by-default closeout, proving the active runtime path is still disconnected from the reserve modules

- [ ] **Step 3: Complete the inactive-by-default reserve landing**

Ensure the new reserve files remain disconnected from the active runtime path:

```ts
// No new import should be added to src/main.ts in this task.
// The reserve files should remain available for future children only.
```

If any new code path accidentally connected the reserve modules into active runtime behavior, remove that connection now.

- [ ] **Step 4: Re-run the targeted protection tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "main runtime path does not import the ui reserve registry yet|existing layout editor target registry still stays on the current ui-layout path"
```

Expected:

- both protection tests pass

- [ ] **Step 5: Run the full verification gate for Task 5**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass and the reserve landing remains inactive by default

## Task 6: Child 12 Closeout And Governance Sync

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-01-ui-contract-reserve-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

- [ ] **Step 1: Record the Child 12 reserve landing in the change log**

Add a new dated entry summarizing:

- formal UI contract reserve types
- optional pack UI reserve file keys
- builtin reserve content seeding
- inactive-by-default protection

- [ ] **Step 2: Record Child 12 execution outcome**

Update this plan's `Execution State`, `Progress Log`, and checkbox state only after all production verification passes.

- [ ] **Step 3: Run the required queue/governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- plan-governance checks pass

- [ ] **Step 4: Confirm Child 12 exit criteria in the weekly docs**

Record that:

- future UI contract reserve exists
- pack UI split-table reserve exists
- asset layering rules are explicit
- default runtime behavior remains unchanged
- Child 12 did not enable Editor mode or rewrite the current renderer path

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
