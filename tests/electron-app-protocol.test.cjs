const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

test("Electron desktop shell serves packaged app through a fetch-capable app protocol", () => {
  const source = fs.readFileSync(path.join(repoRoot, "electron", "main.cjs"), "utf8");

  assert.match(source, /protocol\.registerSchemesAsPrivileged/);
  assert.match(source, /supportFetchAPI:\s*true/);
  assert.match(source, /protocol\.handle\(APP_PROTOCOL/);
  assert.match(source, /const APP_NAME = "朱元璋"/);
  assert.match(source, /app\.setName\(APP_NAME\)/);
  assert.match(source, /title:\s*APP_NAME/);
  assert.match(source, /icon:\s*path\.join\(__dirname,\s*"assets",\s*"app-icon\.png"\)/);
  assert.match(source, /window\.loadURL\(`\$\{APP_PROTOCOL\}:\/\/\$\{APP_HOST\}\/index\.html`\)/);
  assert.doesNotMatch(source, /window\.loadFile\(/);
});

test("Electron builder uses the Zhu Yuanzhang product name and app icon", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")
  );

  assert.equal(packageJson.build.productName, "朱元璋");
  assert.equal(packageJson.build.win.icon, "electron/assets/app-icon.ico");
  assert.equal(
    fs.existsSync(path.join(repoRoot, "electron", "assets", "app-icon.ico")),
    true
  );
  assert.equal(
    fs.existsSync(path.join(repoRoot, "electron", "assets", "app-icon.png")),
    true
  );
});

test("HTML entrypoint uses the Zhu Yuanzhang document title", () => {
  const source = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");

  assert.match(source, /<title>朱元璋<\/title>/);
});
