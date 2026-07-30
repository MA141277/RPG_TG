const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  renderBackpackView,
} = require("../.test-dist/ui/views/inventory/backpack-view.js");

const repoRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("backpack view renders filters, table columns, detail, and item action buttons", () => {
  const html = renderBackpackView({
    filter: "all",
    selectedItemId: "item.weapon",
    items: [
      {
        id: "item.weapon",
        name: "锈刀",
        icon: "刀",
        value: 8,
        types: ["equipment", "weapon"],
        count: 1,
        description: "旧刀。",
        actions: [{ id: "equip.weapon", label: "装备" }],
      },
      {
        id: "item.food",
        name: "粮食",
        icon: null,
        value: 0,
        types: ["food", "grain"],
        count: 12,
        description: "随身粮食。",
        actions: [{ id: "submit.quest", label: "提交" }],
      },
    ],
  });

  for (const label of ["全部", "装备", "食物", "其他"]) {
    assert.match(html, new RegExp(`>\\s*${label}\\s*<`));
  }

  assert.match(html, /<th aria-label="图标"><\/th>/);
  for (const column of ["名字", "价值", "类型", "持有数"]) {
    assert.match(html, new RegExp(`<th>${column}</th>`));
  }
  for (const brokenFragment of [
    "鍏ㄩ儴",
    "浠峰",
    "鎸佹湁",
    "鐗?/span",
    "€?/th",
    "銆?/p",
  ]) {
    assert.equal(
      html.includes(brokenFragment),
      false,
      `backpack html must not contain mojibake fragment ${brokenFragment}`
    );
  }

  assert.match(html, /data-backpack-filter="equipment"/);
  assert.match(html, /data-backpack-item-id="item\.weapon"/);
  assert.match(html, /data-action="run-backpack-item-action"/);
  assert.match(html, /data-item-action-id="equip\.weapon"/);
  assert.match(html, /class="c-city-choice-skin"/);
  assert.match(html, /<h2 class="c-library-detail__title">锈刀<\/h2>/);
});

test("backpack icon column only renders image icons and hides plain icon ids", () => {
  const html = renderBackpackView({
    filter: "all",
    selectedItemId: "item.icon-id",
    items: [
      {
        id: "item.icon-id",
        name: "锈刀",
        icon: "icon-sword",
        value: 8,
        types: ["equipment", "weapon"],
        count: 1,
        description: "旧刀。",
        actions: [{ id: "equip.weapon", label: "装备" }],
      },
      {
        id: "item.image-icon",
        name: "饭团",
        icon: "/ui/items/rice-ball.png",
        value: 2,
        types: ["food"],
        count: 3,
        description: "可食用。",
        actions: [{ id: "consume.food", label: "使用" }],
      },
    ],
  });

  assert.doesNotMatch(
    html,
    /<span class="c-backpack-table__icon">icon-sword<\/span>/
  );
  assert.match(
    html,
    /<img class="c-backpack-table__icon-image" src="\/ui\/items\/rice-ball\.png" alt="">/
  );
});

test("backpack view renders readable labels for projected shop items without action buttons", () => {
  const html = renderBackpackView({
    filter: "other",
    selectedItemId: "item.trade.silk",
    items: [
      {
        id: "item.trade.silk",
        name: "Silk",
        icon: null,
        value: 450,
        types: ["other", "trade", "silk"],
        count: 2,
        description: "Market good shown through the backpack projection.",
        actions: [],
      },
      {
        id: "item.medicine.medicine_heal_001",
        name: "Bandage",
        icon: null,
        value: 80,
        types: ["other", "prepared-medicine"],
        count: 1,
        description: "Prepared medicine shown through the backpack projection.",
        actions: [],
      },
    ],
  });

  assert.match(html, />[^<]*\u5546\u8d27[^<]*</);
  assert.match(html, />[^<]*\u4e1d\u7ef8[^<]*</);
  assert.match(html, />[^<]*\u6210\u836f[^<]*</);
  assert.doesNotMatch(html, />[^<]*trade[^<]*</);
  assert.doesNotMatch(html, />[^<]*prepared-medicine[^<]*</);
  assert.doesNotMatch(html, /data-item-action-id=/);
});

test("backpack shell uses stable grid rows so empty filters do not shift the overlay", () => {
  const prototypeCss = readSource("src/styles/prototype.css");

  assert.match(
    prototypeCss,
    /\.c-library-shell\s*\{[\s\S]*grid-template-rows:\s*auto auto minmax\(0,\s*1fr\);/
  );
  assert.match(
    prototypeCss,
    /\.c-backpack-shell__body\s*\{[\s\S]*min-height:\s*0;[\s\S]*overflow:\s*hidden;/
  );
  assert.match(
    prototypeCss,
    /\.c-backpack-table-wrap\s*\{[\s\S]*min-height:\s*0;[\s\S]*overflow:\s*auto;/
  );
});

test("backpack overlay overrides generic beige library surfaces", () => {
  const prototypeCss = readSource("src/styles/prototype.css");

  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s*\{[\s\S]*?isolation:\s*isolate;[\s\S]*?background:\s*#101720;/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay::before\s*\{[\s\S]*?z-index:\s*0;[\s\S]*?background:\s*url\("\.\.\/\.\.\/ui\/background\/beibao\.png"\)\s+center \/ cover no-repeat;[\s\S]*?pointer-events:\s*none;/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s+\.c-backpack-shell\s*\{[\s\S]*?position:\s*relative;[\s\S]*?z-index:\s*1;/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s+\.c-backpack-table__select\s*\{[\s\S]*?position:\s*relative;[\s\S]*?isolation:\s*isolate;[\s\S]*?overflow:\s*hidden;/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s+\.c-backpack-table__select\s*>\s*:not\(\.c-city-choice-skin\)\s*\{[\s\S]*?z-index:\s*1;/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s+\.c-backpack-table-wrap,\s*[\s\S]*?\.view-backpack-overlay\s+\.c-backpack-detail\s*\{[\s\S]*?background:\s*rgb\(0 0 0 \/ 46%\);/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s+\.c-library-table\s+th,\s*[\s\S]*?\.view-backpack-overlay\s+\.c-library-table\s+td\s*\{[\s\S]*?color:\s*#f2dfb7;/
  );
  assert.match(
    prototypeCss,
    /\.view-backpack-overlay\s+\.c-library-detail__title\s*\{[\s\S]*?color:\s*#f8e7bd;/
  );
});

test("game-visible app state suppresses the full-screen main menu layer", () => {
  const mainSource = readSource("src/main.ts");
  const mainUiCss = readSource("src/styles/main-ui.css");

  assert.match(
    mainSource,
    /document\.body\.classList\.toggle\("is-game-visible",\s*isVisible\);/
  );
  assert.match(
    mainUiCss,
    /body\.is-game-visible\s+\.c-main-ui-overlay\s*\{[\s\S]*?display:\s*none !important;[\s\S]*?visibility:\s*hidden;[\s\S]*?pointer-events:\s*none;/
  );
});

test("backpack view keeps browsing light and promotes equip actions to heavy", () => {
  const html = renderBackpackView({
    filter: "all",
    selectedItemId: "item.weapon",
    items: [
      {
        id: "item.weapon",
        name: "Weapon",
        icon: "/ui/items/sword.png",
        value: 8,
        types: ["equipment", "weapon"],
        count: 1,
        description: "test",
        actions: [
          { id: "equip.weapon", label: "Equip" },
          { id: "submit.quest", label: "Submit" },
        ],
      },
    ],
  });

  assert.match(
    html,
    /<button[^>]*data-backpack-filter="equipment"[^>]*data-button-sound="light"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-backpack-item-id="item\.weapon"[^>]*data-button-sound="light"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-action="run-backpack-item-action"[^>]*data-item-action-id="equip\.weapon"[^>]*data-button-sound="heavy"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-action="run-backpack-item-action"[^>]*data-item-action-id="submit\.quest"[^>]*data-button-sound="light"[^>]*>/
  );
  assert.match(
    html,
    /<button[^>]*data-action="close-overlay"[^>]*data-button-sound="light"[^>]*>/
  );
});

test("main shell exposes backpack entry points and dispatches item actions before row selection", () => {
  const mainSource = readSource("src/main.ts");
  const appRenderSource = readSource("src/ui/app-render.ts");
  const characterDetailSource = readSource(
    "src/ui/views/character/character-detail-view.ts"
  );
  const mapViewSource = readSource("src/ui/views/map/map-view.ts");

  assert.match(appRenderSource, /data-action="open-backpack"/);
  assert.match(characterDetailSource, /data-action="open-backpack"/);
  assert.match(mapViewSource, /data-action="open-backpack"/);
  assert.match(mapViewSource, /c-campaign-map-actions/);
  assert.match(mainSource, /data-action='open-backpack'/);
  assert.match(mainSource, /data-action='open-valuables'/);
  assert.match(mainSource, /openBackpack\(appState\)/);

  const actionIndex = mainSource.indexOf("run-backpack-item-action");
  const selectIndex = mainSource.indexOf("[data-backpack-item-id]");
  assert.ok(actionIndex >= 0, "backpack action handler must exist");
  assert.ok(selectIndex >= 0, "backpack row selection handler must exist");
  assert.ok(
    actionIndex < selectIndex,
    "item action dispatch must run before generic backpack row selection"
  );
});
