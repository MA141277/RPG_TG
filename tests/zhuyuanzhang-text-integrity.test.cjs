const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const PACK_ROOT = path.join(
  __dirname,
  "../src/content/scenario-packs/zhuyuanzhang"
);

const SUSPICIOUS_SUBSTRINGS = [
  "??",
  "\uFFFD",
  "杩斿洖",
  "瑙掕壊",
  "浜虹墿",
  "鍩庡競",
  "姝﹀媷",
  "閲戦挶",
  "缁熺巼",
  "鏈懡",
];

function collectJsonFiles(rootDir) {
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .flatMap((entry) => {
      const resolvedPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        return collectJsonFiles(resolvedPath);
      }
      return entry.isFile() && entry.name.endsWith(".json")
        ? [resolvedPath]
        : [];
    });
}

function collectStringLeaves(value, currentPath = "$") {
  if (typeof value === "string") {
    return [{ path: currentPath, value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      collectStringLeaves(entry, `${currentPath}[${index}]`)
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) =>
      collectStringLeaves(entry, `${currentPath}.${key}`)
    );
  }
  return [];
}

test("zhuyuanzhang scenario pack JSON keeps readable text values", () => {
  const diagnostics = [];

  for (const filePath of collectJsonFiles(PACK_ROOT)) {
    const source = fs.readFileSync(filePath, "utf8");
    const document = JSON.parse(source);
    for (const entry of collectStringLeaves(document)) {
      const matchedToken = SUSPICIOUS_SUBSTRINGS.find((token) =>
        entry.value.includes(token)
      );
      if (matchedToken) {
        diagnostics.push(
          `${path.relative(process.cwd(), filePath)} ${entry.path} contains suspicious text: ${matchedToken}`
        );
      }
    }
  }

  assert.deepEqual(diagnostics, []);
});
