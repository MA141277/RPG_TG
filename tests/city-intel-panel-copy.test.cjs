const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const cityViewPath = "src/ui/views/city/city-view.ts";

test("city intel panel does not show temporary mock-intel disclaimer copy", () => {
  const source = fs.readFileSync(cityViewPath, "utf8");

  assert.doesNotMatch(source, /当前版本使用模拟情报/);
  assert.doesNotMatch(source, /后续将接入真实 House、NPC 与事件内容/);
});
