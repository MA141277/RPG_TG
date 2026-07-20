const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PNG } = require("pngjs");

function readPng(relativePath) {
  return PNG.sync.read(fs.readFileSync(path.join(process.cwd(), relativePath)));
}

function pixelKey(png, x, y) {
  const index = (png.width * y + x) * 4;
  return [
    png.data[index],
    png.data[index + 1],
    png.data[index + 2],
    png.data[index + 3],
  ].join(",");
}

function assertAdjacentBoundaryMatches(png, boundary, axis) {
  if (axis === "x") {
    for (let y = 0; y < png.height; y += 1) {
      assert.equal(pixelKey(png, boundary - 1, y), pixelKey(png, boundary, y));
    }
    return;
  }

  for (let x = 0; x < png.width; x += 1) {
    assert.equal(pixelKey(png, x, boundary - 1), pixelKey(png, x, boundary));
  }
}

function assertCornerSliceInnerEdgesBleed(png, corner) {
  const bleed = 2;
  const { name, x0, x1, y0, y1, verticalDirection, horizontalDirection } = corner;
  const cornerVerticalEdge = verticalDirection > 0 ? x1 : x0;
  const cornerHorizontalEdge = horizontalDirection > 0 ? y1 : y0;

  for (let y = y0; y <= y1; y += 1) {
    const expected = pixelKey(png, cornerVerticalEdge, y);
    for (let offset = 1; offset <= bleed; offset += 1) {
      assert.equal(
        pixelKey(png, cornerVerticalEdge + verticalDirection * offset, y),
        expected,
        `${name} corner slice must bleed its vertical inner edge ${bleed}px into the adjacent slice`
      );
    }
  }

  for (let x = x0; x <= x1; x += 1) {
    const expected = pixelKey(png, x, cornerHorizontalEdge);
    for (let offset = 1; offset <= bleed; offset += 1) {
      assert.equal(
        pixelKey(png, x, cornerHorizontalEdge + horizontalDirection * offset),
        expected,
        `${name} corner slice must bleed its horizontal inner edge ${bleed}px into the adjacent slice`
      );
    }
  }
}

test("nine-slice UI skins use anti-seam assets with matching slice boundaries", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );
  const prototypeCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/prototype.css"),
    "utf8"
  );
  const combinedCss = `${grainShopCss}\n${prototypeCss}`;

  const assets = [
    {
      cssName: "20260709-205114_popup-slice-anti-seam.png",
      path: "ui/yuansu/评定/generated/20260709-205114_popup-slice-anti-seam.png",
      boundaries: [
        [22, "x"],
        [268, "x"],
        [48, "y"],
        [64, "y"],
        [300, "y"],
      ],
    },
    {
      cssName: "20260709-205119_item-slice-anti-seam.png",
      path: "ui/yuansu/评定/generated/20260709-205119_item-slice-anti-seam.png",
      boundaries: [
        [18, "x"],
        [236, "x"],
        [10, "y"],
        [45, "y"],
      ],
    },
    {
      cssName: "20260709-205123_button-clean-anti-seam.png",
      path: "ui/yuansu/评定/generated/20260709-205123_button-clean-anti-seam.png",
      boundaries: [
        [18, "x"],
        [104, "x"],
        [10, "y"],
        [34, "y"],
      ],
    },
    {
      cssName: "temple-yellow-button-anti-seam.png",
      path: "ui/yuansu/评定/generated/temple-yellow-button-anti-seam.png",
      boundaries: [
        [24, "x"],
        [98, "x"],
        [12, "y"],
        [32, "y"],
      ],
    },
    {
      cssName: "temple-paper-button-anti-seam.png",
      path: "ui/yuansu/评定/generated/temple-paper-button-anti-seam.png",
      boundaries: [
        [54, "x"],
        [205, "x"],
        [22, "y"],
        [51, "y"],
      ],
    },
    {
      cssName: "20260714-141153-city-menu-anti-seam.png",
      path: "ui/yuansu/按钮/generated/20260714-141153-city-menu-anti-seam.png",
      boundaries: [
        [64, "x"],
        [795, "x"],
        [64, "y"],
        [203, "y"],
      ],
    },
    {
      cssName: "20260714-141203-return-anti-seam.png",
      path: "ui/yuansu/按钮/generated/20260714-141203-return-anti-seam.png",
      boundaries: [
        [116, "x"],
        [1095, "x"],
        [92, "y"],
        [276, "y"],
      ],
    },
  ];

  for (const asset of assets) {
    assert.match(combinedCss, new RegExp(asset.cssName.replace(".", "\\.")));
    const png = readPng(asset.path);
    for (const [boundary, axis] of asset.boundaries) {
      assertAdjacentBoundaryMatches(png, boundary, axis);
    }
  }
});

test("city choice bleed asset extends each corner slice's inner edges", () => {
  const png = readPng("ui/yuansu/\u8bc4\u5b9a/generated/city-choice-item-bleed-1px.png");

  for (const corner of [
    { name: "top-left", x0: 0, x1: 17, y0: 0, y1: 9, verticalDirection: 1, horizontalDirection: 1 },
    { name: "top-right", x0: 236, x1: 253, y0: 0, y1: 9, verticalDirection: -1, horizontalDirection: 1 },
    { name: "bottom-left", x0: 0, x1: 17, y0: 45, y1: 54, verticalDirection: 1, horizontalDirection: -1 },
    { name: "bottom-right", x0: 236, x1: 253, y0: 45, y1: 54, verticalDirection: -1, horizontalDirection: -1 },
  ]) {
    assertCornerSliceInnerEdgesBleed(png, corner);
  }
});

test("house dialogue skin references real dialogue texture assets", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );

  const dialogueAssets = [
    "ui/yuansu/对话框/20260708-162747.png",
    "ui/yuansu/对话框/20260708-162820.png",
  ];

  assert.doesNotMatch(grainShopCss, /ui\/yuansu\/\?\?\?\//);

  for (const assetPath of dialogueAssets) {
    assert.match(grainShopCss, new RegExp(assetPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.ok(
      fs.existsSync(path.join(process.cwd(), assetPath)),
      `${assetPath} must exist`
    );
  }
});

function assertRuleHasOpaqueBackground(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [
    ...css.matchAll(
      new RegExp(`(?:^|})[^{}]*${escapedSelector}[^{}]*\\{([\\s\\S]*?)\\}`, "g")
    ),
  ];
  assert.ok(matches.length > 0, `Missing CSS rule for ${selector}`);
  const body = matches.map((match) => match[1]).join("\n");
  assert.match(
    body,
    /--nine-slice-seam-fill:\s*(#[0-9a-fA-F]{3,8}|rgb\()/,
    `${selector} must paint an opaque base behind border-image seams`
  );
  assert.match(
    body,
    /background-clip:[^;]*padding-box/,
    `${selector} must clip the opaque base inside the border image`
  );
  assert.match(
    body,
    /background-color:\s*var\(--nine-slice-seam-fill\)/,
    `${selector} must paint an opaque background color behind scaled border-image seams`
  );
  assert.match(
    body,
    /linear-gradient\(var\(--nine-slice-seam-fill\),\s*var\(--nine-slice-seam-fill\)\)/,
    `${selector} must paint one-pixel seam guards`
  );
  assert.match(
    body,
    /calc\(var\(--nine-slice-left\) - 2px\)/,
    `${selector} seam guards must overlap inward from the left slice boundary by 2px`
  );
  assert.match(
    body,
    /calc\(var\(--nine-slice-top\) - 2px\)/,
    `${selector} seam guards must overlap inward from the top slice boundary by 2px`
  );
  assert.match(
    body,
    /calc\(100% - var\(--nine-slice-left\) - var\(--nine-slice-right\) \+ 4px\) 2px no-repeat/,
    `${selector} horizontal seam guards must be 2px high and cover both corner directions`
  );
  assert.match(
    body,
    /2px calc\(100% - var\(--nine-slice-top\) - var\(--nine-slice-bottom\) \+ 4px\) no-repeat/,
    `${selector} vertical seam guards must be 2px wide and cover both corner directions`
  );
}

function findExactRuleBody(css, selector) {
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(",").map((value) => value.trim());
    if (selectors.includes(selector)) {
      return match[2];
    }
  }
  return null;
}

function assertRuleHasCornerSeamGuards(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [
    ...css.matchAll(
      new RegExp(`(?:^|})[^{}]*${escapedSelector}[^{}]*\\{([\\s\\S]*?)\\}`, "g")
    ),
  ];
  assert.ok(matches.length > 0, `Missing CSS rule for ${selector}`);
  const body = matches.map((match) => match[1]).join("\n");

  for (const position of [
    "left calc\\(var\\(--nine-slice-left\\) - 1px\\) top calc\\(var\\(--nine-slice-top\\) - 1px\\)",
    "right calc\\(var\\(--nine-slice-right\\) - 1px\\) top calc\\(var\\(--nine-slice-top\\) - 1px\\)",
    "left calc\\(var\\(--nine-slice-left\\) - 1px\\) bottom calc\\(var\\(--nine-slice-bottom\\) - 1px\\)",
    "right calc\\(var\\(--nine-slice-right\\) - 1px\\) bottom calc\\(var\\(--nine-slice-bottom\\) - 1px\\)",
  ]) {
    assert.match(
      body,
      new RegExp(`${position}\\s*/\\s*2px 2px no-repeat`),
      `${selector} must paint a 2px corner seam guard at ${position}`
    );
  }
}

function assertRuleHasInwardBorderImageSlice(css, selector, expected) {
  const bodies = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(",").map((value) => value.trim());
    if (selectors.includes(selector)) {
      bodies.push(match[2]);
    }
  }

  assert.ok(bodies.length > 0, `Missing CSS rule for ${selector}`);
  const body = bodies.join("\n");

  assert.match(
    body,
    new RegExp(`border-image-slice:\\s*${expected.slice}\\s+fill;`),
    `${selector} must move border-image source slice lines 1px toward the center`
  );
  assert.match(
    body,
    new RegExp(`border-image-width:\\s*${expected.width};`),
    `${selector} must move rendered nine-slice boundaries 1px toward the center`
  );
  assert.match(
    body,
    new RegExp(`(?:^|\\n)\\s*(?:border:\\s*${expected.physicalBorder}\\s+solid\\s+transparent|border-width:\\s*${expected.physicalBorder});`),
    `${selector} physical border box must stay at the asset's original edge size`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-top:\\s*${expected.top};`),
    `${selector} seam variables must match the shifted top boundary`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-right:\\s*${expected.right};`),
    `${selector} seam variables must match the shifted right boundary`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-bottom:\\s*${expected.bottom};`),
    `${selector} seam variables must match the shifted bottom boundary`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-left:\\s*${expected.left};`),
    `${selector} seam variables must match the shifted left boundary`
  );
}

function assertRuleUsesBleedAssetWithOriginalSlice(css, selector, expected) {
  const body = findExactRuleBody(css, selector);
  assert.ok(body, `Missing CSS rule for ${selector}`);
  assert.match(
    body,
    new RegExp(`border-image-source:\\s*url\\("${expected.asset}"\\);`),
    `${selector} must use the city choice bleed asset`
  );
  assert.match(
    body,
    new RegExp(`border-image-slice:\\s*${expected.slice}\\s+fill;`),
    `${selector} must keep the original source slice lines`
  );
  assert.match(
    body,
    new RegExp(`border-image-width:\\s*${expected.width};`),
    `${selector} must keep the original rendered nine-slice widths`
  );
  assert.match(
    body,
    new RegExp(`(?:^|\\n)\\s*border:\\s*${expected.physicalBorder}\\s+solid\\s+transparent;`),
    `${selector} physical border box must match the original asset edge size`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-top:\\s*${expected.top};`),
    `${selector} seam variables must match the original top boundary`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-right:\\s*${expected.right};`),
    `${selector} seam variables must match the original right boundary`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-bottom:\\s*${expected.bottom};`),
    `${selector} seam variables must match the original bottom boundary`
  );
  assert.match(
    body,
    new RegExp(`--nine-slice-left:\\s*${expected.left};`),
    `${selector} seam variables must match the original left boundary`
  );
}

function assertSelectorIsNotInSharedSeamGuard(css, selector) {
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!match[2].includes("calc(var(--nine-slice-left) - 1px)")) {
      continue;
    }
    const selectors = match[1].split(",").map((value) => value.trim());
    assert.ok(
      !selectors.includes(selector),
      `${selector} must rely on the bleed asset rather than the shared seam guard`
    );
  }
}

function findExactRuleBodies(css, selector) {
  const bodies = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(",").map((value) => value.trim());
    if (selectors.includes(selector)) {
      bodies.push(match[2]);
    }
  }
  return bodies;
}

test("nine-slice UI skins paint an opaque base behind border-image seams", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );
  const prototypeCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/prototype.css"),
    "utf8"
  );

  for (const selector of [
    ".c-grain-shop-modal.c-house-contribution-settlement",
    ".c-house-contribution-settlement .c-grain-shop-modal__body p",
    ".c-house-contribution-settlement .c-grain-shop-modal__actions .c-grain-shop-button",
    ".c-house-temple-utility-popup .c-grain-shop-trade__field",
  ]) {
    assertRuleHasOpaqueBackground(grainShopCss, selector);
  }

  for (const selector of [
    ".c-kulan-city__leave-action",
    ".c-city-directory__panel",
    ".c-city-directory__close",
    ".c-city-menu-panel__meta div",
    ".c-city-menu-panel__primary-action",
    ".c-city-locations-view__close",
    ".c-city-locations-view__return-action",
  ]) {
    assertRuleHasOpaqueBackground(prototypeCss, selector);
  }
});

test("city main menu buttons render overlapped nine-slice parts", () => {
  const prototypeCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/prototype.css"),
    "utf8"
  );
  const cityViewTs = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/city/city-view.ts"),
    "utf8"
  );

  assert.match(cityViewTs, /function renderCityMenuButtonSkin\(\): string/);
  assert.match(cityViewTs, /class="c-city-menu-button-skin"/);
  assert.match(cityViewTs, /class="c-city-menu__button-label"/);

  const bodies = findExactRuleBodies(prototypeCss, ".c-city-menu__button");
  assert.ok(bodies.length > 0, "Missing CSS rule for .c-city-menu__button");
  assert.ok(
    bodies.every((body) => !body.includes("border-image-source")),
    ".c-city-menu__button must not rely on border-image for overlapped corners"
  );
  assertSelectorIsNotInSharedSeamGuard(prototypeCss, ".c-city-menu__button");

  for (const part of ["tl", "t", "tr", "l", "c", "r", "bl", "b", "br"]) {
    assert.match(
      prototypeCss,
      new RegExp(`\\.c-city-menu-button-skin__part--${part}\\s*\\{[\\s\\S]*city-menu-button-${part}\\.png`),
      `city menu button nine-slice part ${part} must use its cropped asset`
    );
    assert.ok(
      fs.existsSync(
        path.join(process.cwd(), `ui/yuansu/按钮/generated/city-menu-button-${part}.png`)
      ),
      `city menu button cropped asset ${part} is missing`
    );
  }
});

test("city choice item skin renders overlapped nine-slice parts", () => {
  const prototypeCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/prototype.css"),
    "utf8"
  );
  const cityViewTs = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/city/city-view.ts"),
    "utf8"
  );

  assert.match(cityViewTs, /function renderCityChoiceSkin\(\): string/);
  assert.match(cityViewTs, /class="c-city-choice-skin"/);

  for (const selector of [
    ".c-city-directory__option",
    ".c-city-menu-panel__location",
    ".c-city-menu-panel__intel-item",
    ".c-city-menu-panel__lock",
  ]) {
    const bodies = findExactRuleBodies(prototypeCss, selector);
    assert.ok(bodies.length > 0, `Missing CSS rule for ${selector}`);
    assert.ok(
      bodies.every((body) => !body.includes("border-image-source")),
      `${selector} must not rely on border-image for city choice skin`
    );
    assertSelectorIsNotInSharedSeamGuard(prototypeCss, selector);
  }

  for (const part of ["tl", "t", "tr", "l", "c", "r", "bl", "b", "br"]) {
    assert.match(
      prototypeCss,
      new RegExp(`\\.c-city-choice-skin__part--${part}\\s*\\{[\\s\\S]*city-choice-item-${part}\\.png`),
      `city choice nine-slice part ${part} must use its cropped asset`
    );
  }
});

test("temple utility popup buttons keep enough height for paper nine-slice centers", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );
  const selector =
    ".c-house-temple-utility-popup .c-grain-shop-modal__actions .c-grain-shop-button";
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = grainShopCss.match(
    new RegExp(`(?:^|})[^{}]*${escapedSelector}[^{}]*\\{([\\s\\S]*?)\\}`)
  );

  assert.ok(match, `Missing CSS rule for ${selector}`);
  assert.match(match[1], /height:\s*48px;/);
});

test("temple utility split confirmation buttons use full nine-slice dimensions", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );
  const modalSelector = ".c-house-temple-confirm-popup";
  const escapedModalSelector = modalSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const modalMatch = grainShopCss.match(
    new RegExp(`(?:^|})[^{}]*${escapedModalSelector}[^{}]*\\{([\\s\\S]*?)\\}`)
  );
  const selector =
    ".c-house-temple-confirm-popup .c-grain-shop-modal__actions--split .c-grain-shop-button";
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = grainShopCss.match(
    new RegExp(`(?:^|})[^{}]*${escapedSelector}[^{}]*\\{([\\s\\S]*?)\\}`)
  );

  assert.ok(modalMatch, `Missing CSS rule for ${modalSelector}`);
  assert.match(modalMatch[1], /width:\s*min\(86vw,\s*360px\);/);
  assert.ok(match, `Missing CSS rule for ${selector}`);
  assert.match(match[1], /width:\s*132px;/);
  assert.match(match[1], /min-width:\s*132px;/);
  assert.match(match[1], /height:\s*48px;/);
  assert.match(match[1], /padding:\s*0 12px;/);
});

test("temple utility split confirmation buttons stay on one row", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );
  const selector =
    ".c-house-temple-confirm-popup .c-grain-shop-modal__actions--split";
  const body = findExactRuleBody(grainShopCss, selector);

  assert.ok(body, `Missing CSS rule for ${selector}`);
  assert.match(body, /flex-wrap:\s*nowrap;/);
  assert.match(body, /min-width:\s*272px;/);
});

test("temple utility split cancel button matches task confirm paper nine-slice", () => {
  const grainShopCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/grain-shop.css"),
    "utf8"
  );
  const taskSelector =
    ".c-house-temple-task-confirm .c-grain-shop-modal__actions .c-grain-shop-button--paper";
  const escapedTaskSelector = taskSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const taskMatch = grainShopCss.match(
    new RegExp(`(?:^|})[^{}]*${escapedTaskSelector}[^{}]*\\{([\\s\\S]*?)\\}`)
  );
  const selector =
    ".c-house-temple-confirm-popup .c-grain-shop-modal__actions--split .c-grain-shop-button--paper";
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = grainShopCss.match(
    new RegExp(`(?:^|})[^{}]*${escapedSelector}[^{}]*\\{([\\s\\S]*?)\\}`)
  );

  assert.ok(taskMatch, `Missing CSS rule for ${taskSelector}`);
  assert.ok(match, `Missing CSS rule for ${selector}`);
  assert.doesNotMatch(match[1], /ui\/yuansu\/\?\?\//);
  assert.equal(
    match[1].match(/border-image-source:\s*url\("([^"]+)"\);/)?.[1],
    taskMatch[1].match(/border-image-source:\s*url\("([^"]+)"\);/)?.[1]
  );
  assert.match(match[1], /temple-paper-button-anti-seam\.png/);
  assert.match(match[1], /border-image-slice:\s*22 54 fill;/);
  assert.match(match[1], /border-image-width:\s*12px 24px;/);
  assert.match(match[1], /color:\s*#5b351d;/);
});
test("house-hosted village begging skin references real background texture", () => {
  const prototypeCss = fs.readFileSync(
    path.join(process.cwd(), "src/styles/prototype.css"),
    "utf8"
  );
  const assetPath = "ui/化缘UI/背景图.png";

  assert.doesNotMatch(prototypeCss, /ui\/\?\?UI\/\?\?\?\.png/);
  assert.match(prototypeCss, new RegExp(assetPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(
    fs.existsSync(path.join(process.cwd(), assetPath)),
    `${assetPath} must exist`
  );
});
