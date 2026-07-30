const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readCss() {
  return fs.readFileSync(
    path.join(__dirname, "..", "src/styles/grain-shop.css"),
    "utf8"
  );
}

function getRuleBody(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "s"));
  assert.ok(match, `Missing CSS rule for ${selector}`);
  return match[1];
}

function getPxCustomProperty(ruleBody, propertyName) {
  const escapedPropertyName = propertyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = ruleBody.match(
    new RegExp(`${escapedPropertyName}\\s*:\\s*([0-9.]+)px`)
  );
  assert.ok(match, `Missing px custom property for ${propertyName}`);
  return Number(match[1]);
}

test("grain intel report widens only the price-table popup width", () => {
  const css = readCss();
  const basePopupRule = getRuleBody(css, ".c-grain-shop-modal.c-house-trade-popup");
  const reportPopupRule = getRuleBody(
    css,
    ".c-grain-shop-modal.c-house-trade-popup.c-grain-intel-report"
  );

  const baseContentWidth = getPxCustomProperty(
    basePopupRule,
    "--house-trade-content-width"
  );
  const reportContentWidth = getPxCustomProperty(
    reportPopupRule,
    "--house-trade-content-width"
  );

  assert.ok(
    reportContentWidth > baseContentWidth,
    `Expected grain intel report width > base popup width; got ${reportContentWidth}px vs ${baseContentWidth}px`
  );
  assert.ok(
    reportContentWidth >= 680,
    `Expected grain intel report content width >= 680px; got ${reportContentWidth}px`
  );
  assert.doesNotMatch(reportPopupRule, /--house-trade-popup-max-height\s*:/);
  assert.doesNotMatch(reportPopupRule, /max-height\s*:/);
});
