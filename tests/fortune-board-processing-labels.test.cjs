const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("fortune-board overlays show a processing label and disable commands while animating", () => {
  const sources = [
    path.join(
      process.cwd(),
      "src",
      "minigames",
      "temple-copy-scripture",
      "shell.ts"
    ),
    path.join(
      process.cwd(),
      "src",
      "application",
      "playables",
      "activity-qte",
      "shell.ts"
    ),
    path.join(
      process.cwd(),
      "src",
      "ui",
      "views",
      "dialogue",
      "dialogue-view.ts"
    ),
  ].map((filePath) => fs.readFileSync(filePath, "utf8"));

  for (const source of sources) {
    assert.match(source, /return "处理中";/);
    assert.match(
      source,
      /activitySession\.phase !== "ready" && activitySession\.phase !== "scanning"/
    );
    assert.match(source, /data-(playable|activity)-action="(play|play-board)" \$\{primaryActionDisabled \? "disabled" : ""\}/);
  }
});
