const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("browser runtime source tree does not contain CommonJS require calls", () => {
  const srcRoot = path.join(process.cwd(), "src");
  const pending = [srcRoot];
  const offenders = [];

  while (pending.length > 0) {
    const current = pending.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }

      if (!/\.(ts|js)$/.test(entry.name)) {
        continue;
      }

      const source = fs.readFileSync(fullPath, "utf8");
      if (/require\(/.test(source)) {
        offenders.push(path.relative(process.cwd(), fullPath));
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Expected browser runtime source to stay ESM-only, found CommonJS require() in: ${offenders.join(", ")}`
  );
});
