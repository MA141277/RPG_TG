const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve("src/faxian/leg");

function walkProjectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const nextPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkProjectFiles(nextPath, out);
      continue;
    }
    if (entry.isFile() && entry.name === "project.json") {
      out.push(nextPath);
    }
  }
  return out;
}

test("all shipped Spine project custom images use external leg assets instead of embedded data URLs", () => {
  const projectFiles = walkProjectFiles(rootDir);
  assert.ok(projectFiles.length > 0);

  for (const projectFile of projectFiles) {
    const projectDir = path.dirname(projectFile);
    const project = JSON.parse(fs.readFileSync(projectFile, "utf8"));
    for (const [imageId, item] of Object.entries(project.customImages || {})) {
      const src = String(item?.src || "");
      assert.ok(!src.startsWith("data:"), `${projectFile} still embeds ${imageId} as data URL`);
      if (src.startsWith("leg:")) {
        const relativeFile = src.slice(4);
        const targetFile = path.join(projectDir, ...relativeFile.split("/"));
        assert.ok(fs.existsSync(targetFile), `${projectFile} references missing asset ${relativeFile}`);
      }
    }
  }
});

test("battle runtime resolves leg custom image sources and the externalize script is present", () => {
  const battleSource = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const scriptSource = fs.readFileSync("scripts/externalize-spine-custom-images.mjs", "utf8");
  assert.match(battleSource, /if \(src\.startsWith\('leg:'\)\)/);
  assert.match(scriptSource, /const rootDir = path\.resolve\("src\/faxian\/leg"\);/);
  assert.match(scriptSource, /item\.src = `leg:\$\{generatedDirName\}\/\$\{filename\}`;/);
});
