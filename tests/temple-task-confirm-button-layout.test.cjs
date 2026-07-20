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

function getPxDeclaration(ruleBody, propertyName) {
  const escapedPropertyName = propertyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = ruleBody.match(
    new RegExp(
      `${escapedPropertyName}\\s*:\\s*([0-9.]+)(?:px)?(?:\\s+([0-9.]+)px)?`
    )
  );
  assert.ok(match, `Missing px declaration for ${propertyName}`);

  return {
    first: Number(match[1]),
    second: match[2] == null ? Number(match[1]) : Number(match[2]),
  };
}

test("temple task confirm buttons keep enough inline text width for four-character labels", () => {
  const css = readCss();
  const actionsRule = getRuleBody(
    css,
    ".c-house-temple-task-confirm .c-grain-shop-modal__actions"
  );
  const buttonRule = getRuleBody(
    css,
    ".c-house-temple-task-confirm .c-grain-shop-modal__actions .c-grain-shop-button"
  );
  const paperRule = getRuleBody(
    css,
    ".c-house-temple-task-confirm .c-grain-shop-modal__actions .c-grain-shop-button--paper"
  );

  const buttonWidth = getPxDeclaration(buttonRule, "width").first;
  const paperBorderX = getPxDeclaration(paperRule, "border-width").second * 2;
  const paperPaddingX = getPxDeclaration(paperRule, "padding").second * 2;
  const paperTextWidth = buttonWidth - paperBorderX - paperPaddingX;

  assert.match(actionsRule, /flex-wrap\s*:\s*wrap/);
  assert.match(buttonRule, /white-space\s*:\s*nowrap/);
  assert.ok(
    paperTextWidth >= 64,
    `Expected at least 64px text width; got ${paperTextWidth}px`
  );
});
