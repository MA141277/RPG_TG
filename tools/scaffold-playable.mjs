import fs from "node:fs";
import path from "node:path";

const usage = `
Usage:
  node tools/scaffold-playable.mjs --playable-id <id> --family <minigame|battle> --title <title> [--output-root <path>]
`.trim();

const args = parseArgs(process.argv.slice(2));
const playableId = args["playable-id"];
const family = args.family;
const title = args.title;
const outputRoot = path.resolve(args["output-root"] ?? process.cwd());

if (!isValidPlayableId(playableId) || !isValidFamily(family) || !isNonEmptyString(title)) {
  fail(`${usage}\n\nMissing or invalid required arguments.`);
}

const playableName = toPascalCase(playableId);
const playableConst = toConstantCase(playableId);
const playableDir = path.join(
  outputRoot,
  "src",
  "application",
  "playables",
  playableId
);

const files = [
  {
    filePath: path.join(
      outputRoot,
      "src",
      "content",
      "playables",
      `${playableId}.playable.json`
    ),
    contents: `${JSON.stringify(
      {
        schemaVersion: 1,
        playableId,
        family,
        title,
        kind: "builtin",
        paths: {
          domainFile: `src/domain/playables/${playableId}.ts`,
          definitionFile: `src/application/playables/${playableId}/${playableId}-definition.ts`,
          sessionFile: `src/application/playables/${playableId}/${playableId}-session.ts`,
          presenterFile: `src/application/playables/${playableId}/${playableId}-presenter.ts`,
          metricsFile: `src/application/playables/${playableId}/${playableId}-metrics.ts`,
          settlementFile: `src/application/playables/${playableId}/${playableId}-settlement.ts`,
          viewFile: `src/ui/views/playables/${playableId}-view.ts`,
          assetDirectory: `src/assets/playables/${playableId}`,
        },
      },
      null,
      2
    )}\n`,
  },
  {
    filePath: path.join(outputRoot, "src", "domain", "playables", `${playableId}.ts`),
    contents: `export const ${playableConst}_PLAYABLE_ID = "${playableId}" as const;\nexport const ${playableConst}_PLAYABLE_FAMILY = "${family}" as const;\n\nexport type ${playableName}Session = {\n  playableId: typeof ${playableConst}_PLAYABLE_ID;\n  status: "idle" | "active" | "completed";\n};\n`,
  },
  {
    filePath: path.join(playableDir, `${playableId}-session.ts`),
    contents: `import { ${playableConst}_PLAYABLE_ID, type ${playableName}Session } from "../../../domain/playables/${playableId}";\n\nexport function create${playableName}Session(): ${playableName}Session {\n  return {\n    playableId: ${playableConst}_PLAYABLE_ID,\n    status: "idle",\n  };\n}\n`,
  },
  {
    filePath: path.join(playableDir, `${playableId}-presenter.ts`),
    contents: `import type { ${playableName}Session } from "../../../domain/playables/${playableId}";\n\nexport function present${playableName}(session: ${playableName}Session) {\n  return {\n    playableId: session.playableId,\n    status: session.status,\n  };\n}\n`,
  },
  {
    filePath: path.join(playableDir, `${playableId}-metrics.ts`),
    contents: `export type ${playableName}Metrics = {\n  completedRounds: number;\n  failedRounds: number;\n};\n`,
  },
  {
    filePath: path.join(playableDir, `${playableId}-settlement.ts`),
    contents: `export function create${playableName}Settlement() {\n  return {\n    outcome: "pending" as const,\n    effects: [] as const,\n  };\n}\n`,
  },
  {
    filePath: path.join(playableDir, `${playableId}-definition.ts`),
    contents: `import { ${playableConst}_PLAYABLE_FAMILY, ${playableConst}_PLAYABLE_ID } from "../../../domain/playables/${playableId}";\nimport { create${playableName}Session } from "./${playableId}-session";\nimport { present${playableName} } from "./${playableId}-presenter";\nimport { create${playableName}Settlement } from "./${playableId}-settlement";\n\nexport const ${playableName[0].toLowerCase()}${playableName.slice(1)}Definition = {\n  playableId: ${playableConst}_PLAYABLE_ID,\n  family: ${playableConst}_PLAYABLE_FAMILY,\n  title: ${JSON.stringify(title)},\n  createSession: create${playableName}Session,\n  present: present${playableName},\n  settle: create${playableName}Settlement,\n};\n`,
  },
  {
    filePath: path.join(
      outputRoot,
      "src",
      "ui",
      "views",
      "playables",
      `${playableId}-view.ts`
    ),
    contents: `export type ${playableName}ViewModel = {\n  title: string;\n  status: string;\n};\n\nexport function render${playableName}View(model: ${playableName}ViewModel): string {\n  return \`\${model.title}: \${model.status}\`;\n}\n`,
  },
  {
    filePath: path.join(
      outputRoot,
      "src",
      "assets",
      "playables",
      playableId,
      ".gitkeep"
    ),
    contents: "",
  },
];

for (const { filePath, contents } of files) {
  writeNewFile(filePath, contents);
}

process.stdout.write(
  `Scaffolded playable '${playableId}' in ${toPosix(path.relative(outputRoot, playableDir)) || "."}.\n`
);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) {
      fail(`${usage}\n\nUnexpected argument '${key}'.`);
    }

    const value = argv[index + 1];
    if (value == null || value.startsWith("--")) {
      fail(`${usage}\n\nMissing value for '${key}'.`);
    }

    parsed[key.slice(2)] = value;
    index += 1;
  }

  return parsed;
}

function writeNewFile(filePath, contents) {
  if (fs.existsSync(filePath)) {
    fail(`Refusing to overwrite existing file: ${toPosix(filePath)}`);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function toPascalCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join("");
}

function toConstantCase(value) {
  return value.toUpperCase().replaceAll("-", "_");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPlayableId(value) {
  return isNonEmptyString(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isValidFamily(value) {
  return value === "minigame" || value === "battle";
}

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
