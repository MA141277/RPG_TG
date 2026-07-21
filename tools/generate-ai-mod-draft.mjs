import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.topic == null || args.out == null) {
    printUsageAndExit();
  }

  const {
    generateAiModDraftFromTopic,
    readAiModDraftClientConfigFromEnv,
  } = requireBuilt("application/ai-mod-draft/ai-mod-draft-openai-client.js");

  const { config, missing } = readAiModDraftClientConfigFromEnv(process.env);
  if (config == null) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const draft = await generateAiModDraftFromTopic({
    topic: args.topic,
    config,
  });
  fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
  fs.writeFileSync(args.out, `${JSON.stringify(draft, null, 2)}\n`, "utf8");
  console.log(`Wrote AI Mod Draft to ${args.out}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--topic") {
      args.topic = argv[index + 1];
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

function printUsageAndExit() {
  console.error("Usage: node tools/generate-ai-mod-draft.mjs --topic \"题材\" --out draft.json");
  process.exit(1);
}
