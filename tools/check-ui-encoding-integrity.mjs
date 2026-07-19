#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const defaultChecks = [
  {
    file: "src/ui/main-ui/main-ui-flow.js",
    requiredText: [
      "剧本编辑",
      "剧本编辑器入口",
      "项目总览",
      "新增人物",
      "新增城市",
      "新增建筑",
      "新增剧情",
      "新增对话",
      "新增事件",
      "新增玩法绑定",
      "运行预览",
      "保存项目",
    ],
  },
  {
    file: "src/ui/views/script-editor/script-editor-workspace-view.ts",
    requiredText: ["script-editor"],
  },
  {
    file: "src/application/script-editor/workspace-shell.ts",
    requiredText: ["项目信息", "运行预览", "保存项目", "剧本导出"],
  },
];

const mojibakePattern = /[\uFFFD]|(?:[ÃÂåæçèéêëìíîïðñòóôõöøùúûüýþÿ][\u0080-\uFFFF]?){2,}/u;

function parseArgs(argv) {
  const checks = [];
  let active = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--file") {
      const file = argv[index + 1];
      if (!file) {
        throw new Error("--file requires a path");
      }
      active = { file, requiredText: [] };
      checks.push(active);
      index += 1;
      continue;
    }
    if (arg === "--require") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--require requires text");
      }
      if (!active) {
        throw new Error("--require must follow --file");
      }
      active.requiredText.push(value);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return checks.length > 0 ? checks : defaultChecks;
}

function checkJavaScriptSyntax(filePath) {
  if (extname(filePath) !== ".js") {
    return [];
  }
  const result = spawnSync(process.execPath, ["--check", filePath], {
    encoding: "utf8",
  });
  if (result.status === 0) {
    return [];
  }
  return [`invalid JS syntax: ${result.stderr || result.stdout}`];
}

function checkFile(check) {
  const filePath = resolve(check.file);
  const source = readFileSync(filePath, "utf8");
  const problems = [];

  if (mojibakePattern.test(source)) {
    problems.push("mojibake marker detected");
  }

  for (const requiredText of check.requiredText) {
    if (!source.includes(requiredText)) {
      problems.push(`missing required text: ${requiredText}`);
    }
  }

  problems.push(...checkJavaScriptSyntax(filePath));
  return problems.map((problem) => `${relative(process.cwd(), filePath)}: ${problem}`);
}

function main() {
  const checks = parseArgs(process.argv.slice(2));
  const problems = checks.flatMap(checkFile);
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(`UI encoding integrity check passed (${checks.length} files).`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
