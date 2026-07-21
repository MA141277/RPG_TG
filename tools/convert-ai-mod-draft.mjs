import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.input == null || args.out == null) {
    printUsageAndExit();
  }

  const {
    normalizeAiModDraft,
  } = requireBuilt("application/ai-mod-draft/ai-mod-draft-normalizer.js");
  const {
    convertAiModDraftToScriptEditorProject,
  } = requireBuilt("application/ai-mod-draft/ai-draft-to-script-editor-project.js");
  const {
    serializeScriptEditorProjectToFiles,
  } = requireBuilt("application/script-editor/editor-project-save.js");

  const rawDraft = JSON.parse(fs.readFileSync(args.input, "utf8"));
  const normalized = normalizeAiModDraft(rawDraft);
  printDiagnostics(normalized.diagnostics);
  if (normalized.draft == null) {
    process.exitCode = 1;
    return;
  }

  const converted = convertAiModDraftToScriptEditorProject(normalized.draft);
  printDiagnostics(converted.diagnostics);
  const files = serializeScriptEditorProjectToFiles(converted.project);

  fs.mkdirSync(args.out, { recursive: true });
  for (const [fileName, text] of Object.entries(files)) {
    fs.writeFileSync(path.join(args.out, fileName), text, "utf8");
  }
  console.log(`Wrote Script Editor project package to ${args.out}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") {
      args.input = argv[index + 1];
      index += 1;
    } else if (arg === "--out") {
      args.out = argv[index + 1];
      index += 1;
    }
  }
  return args;
}

function requireBuilt(relativePath) {
  const modulePath = path.join(repoRoot, ".test-dist", relativePath);
  if (!fs.existsSync(modulePath)) {
    console.error("Compiled test modules are missing. Run npm run build:test first.");
    process.exit(1);
  }
  return require(modulePath);
}

function printDiagnostics(diagnostics) {
  for (const diagnostic of diagnostics ?? []) {
    const line = `${diagnostic.severity}: ${diagnostic.path}: ${diagnostic.message}`;
    if (diagnostic.severity === "error") {
      console.error(line);
    } else {
      console.warn(line);
    }
  }
}

function printUsageAndExit() {
  console.error("Usage: node tools/convert-ai-mod-draft.mjs --input draft.json --out project-dir");
  process.exit(1);
}
