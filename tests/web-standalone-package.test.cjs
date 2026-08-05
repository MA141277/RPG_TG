const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

test("web standalone packager creates a runnable static package layout", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-web-package-"));
  const projectRoot = path.join(tempRoot, "project");
  const outputRoot = path.join(tempRoot, "release");
  const fakeNode = path.join(tempRoot, "node.exe");

  fs.mkdirSync(path.join(projectRoot, "dist"), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, "scripts"), { recursive: true });
  fs.writeFileSync(
    path.join(projectRoot, "package.json"),
    JSON.stringify({ version: "9.8.7" }),
    "utf8"
  );
  fs.writeFileSync(path.join(projectRoot, "dist", "index.html"), "<main></main>", "utf8");
  createRequiredDistAssets(path.join(projectRoot, "dist"));
  fs.writeFileSync(
    path.join(projectRoot, "scripts", "serve-static.mjs"),
    "console.log('serve');\n",
    "utf8"
  );
  fs.writeFileSync(fakeNode, "fake node binary", "utf8");

  const { createWebStandalonePackage } = await import(
    "../scripts/package-web-standalone.mjs"
  );

  const result = await createWebStandalonePackage({
    projectRoot,
    outputRoot,
    nodeExecutable: fakeNode,
    skipBuild: true,
    zip: false,
  });

  assert.equal(result.packageName, "RPG_TG-web-9.8.7-win-x64");
  assert.equal(
    fs.existsSync(path.join(result.packageRoot, "dist", "index.html")),
    true
  );
  assert.equal(
    fs.existsSync(path.join(result.packageRoot, "runtime", "node.exe")),
    true
  );
  assert.equal(
    fs.existsSync(path.join(result.packageRoot, "scripts", "serve-static.mjs")),
    true
  );
  assert.equal(
    fs.existsSync(
      path.join(result.packageRoot, "dist", "ui", "yuansu", "属性栏", "20260707-201706.png")
    ),
    true
  );
  assert.equal(
    fs.existsSync(
      path.join(result.packageRoot, "dist", "src", "faxian", "leg", "spearman", "project.json")
    ),
    true
  );

  const startScript = fs.readFileSync(
    path.join(result.packageRoot, "start.bat"),
    "utf8"
  );
  assert.match(startScript, /runtime\\node\.exe/);
  assert.match(startScript, /scripts\\serve-static\.mjs/);
  assert.match(startScript, /--root dist/);
  assert.match(startScript, /http:\/\/127\.0\.0\.1:8080\//);

  const readme = fs.readFileSync(path.join(result.packageRoot, "README.txt"), "utf8");
  assert.match(readme, /No npm install is required/);
});

test("web standalone packager can create a zip archive", async (t) => {
  if (process.platform !== "win32") {
    t.skip("zip creation uses Windows PowerShell");
    return;
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-web-package-zip-"));
  const projectRoot = path.join(tempRoot, "project");
  const outputRoot = path.join(tempRoot, "release");
  const fakeNode = path.join(tempRoot, "node.exe");

  fs.mkdirSync(path.join(projectRoot, "dist"), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, "scripts"), { recursive: true });
  fs.writeFileSync(
    path.join(projectRoot, "package.json"),
    JSON.stringify({ version: "1.2.3" }),
    "utf8"
  );
  fs.writeFileSync(path.join(projectRoot, "dist", "index.html"), "<main></main>", "utf8");
  createRequiredDistAssets(path.join(projectRoot, "dist"));
  fs.writeFileSync(
    path.join(projectRoot, "scripts", "serve-static.mjs"),
    "console.log('serve');\n",
    "utf8"
  );
  fs.writeFileSync(fakeNode, "fake node binary", "utf8");

  const { createWebStandalonePackage } = await import(
    "../scripts/package-web-standalone.mjs"
  );

  const result = await createWebStandalonePackage({
    projectRoot,
    outputRoot,
    nodeExecutable: fakeNode,
    skipBuild: true,
    zip: true,
  });

  assert.equal(result.zipPath, path.join(outputRoot, "RPG_TG-web-1.2.3-win-x64.zip"));
  assert.equal(fs.existsSync(result.zipPath), true);
  assert.ok(fs.statSync(result.zipPath).size > 0);
});

test("web standalone packager fails before packaging when dist runtime assets are missing", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-web-package-missing-"));
  const projectRoot = path.join(tempRoot, "project");
  const outputRoot = path.join(tempRoot, "release");
  const fakeNode = path.join(tempRoot, "node.exe");

  fs.mkdirSync(path.join(projectRoot, "dist"), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, "scripts"), { recursive: true });
  fs.writeFileSync(
    path.join(projectRoot, "package.json"),
    JSON.stringify({ version: "1.0.0" }),
    "utf8"
  );
  fs.writeFileSync(path.join(projectRoot, "dist", "index.html"), "<main></main>", "utf8");
  fs.writeFileSync(
    path.join(projectRoot, "scripts", "serve-static.mjs"),
    "console.log('serve');\n",
    "utf8"
  );
  fs.writeFileSync(fakeNode, "fake node binary", "utf8");

  const { createWebStandalonePackage } = await import(
    "../scripts/package-web-standalone.mjs"
  );

  await assert.rejects(
    () =>
      createWebStandalonePackage({
        projectRoot,
        outputRoot,
        nodeExecutable: fakeNode,
        skipBuild: true,
        zip: false,
      }),
    /Built dist is missing required runtime assets/
  );
});

function createRequiredDistAssets(distRoot) {
  const requiredFiles = [
    path.join("ui", "yuansu", "属性栏", "20260707-201706.png"),
    path.join("ui", "yuansu", "属性栏", "global_task_panel_frame_20260706-190314.png"),
    path.join("ui", "yuansu", "编队详细", "兵种", "upload_1784703206372190622.png"),
    path.join("src", "faxian", "leg", "spearman", "project.json"),
    path.join("src", "faxian", "leg", "spearman", "head.png"),
    path.join("src", "faxian", "leg", "cavalry", "project.json"),
    path.join("ui", "battle", "red_man", "material-202606150823-001.png"),
    path.join("ui", "battle", "red_horse", "material-202606150817-001.png"),
    path.join("ui", "battle", "战斗", "20260702-195702.png"),
    path.join("ui", "battle", "战斗", "archer_trail_effect.png"),
    path.join("tools", "spine-new-recovered-project.generated.js"),
    path.join("prototypes", "battle-demo", "spine-runtime-math.js"),
    path.join("src", "assets", "audio", "ui", "troop-selection.mp3"),
    path.join("src", "assets", "audio", "battle", "battle-bgm.mp3"),
    path.join("src", "assets", "yuanmo-units", "zhu-yuanzhang-monk-strat.json"),
    path.join("src", "assets", "yuanmo-units", "yuan-infantry-strat.png"),
    path.join("src", "assets", "yuanmo-unit-animations", "strat_named_with_army", "walk.json"),
    path.join("src", "assets", "campaign-structures", "fort-wall", "fort-hex-wall.json"),
    path.join("src", "assets", "campaign-structures", "fort-wall", "brick1.jpg"),
    path.join("src", "assets", "campaign-structures", "fort-wall", "Brick.jpg"),
  ];

  for (const relativePath of requiredFiles) {
    const filePath = path.join(distRoot, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "asset", "utf8");
  }
}
