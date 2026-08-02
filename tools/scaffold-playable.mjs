import fs from "node:fs";
import path from "node:path";

const usage = `
Usage:
  node tools/scaffold-playable.mjs --playable-id <id> --title <title> [--output-root <path>]
`.trim();

const args = parseArgs(process.argv.slice(2));
const playableId = args["playable-id"];
const title = args.title;
const outputRoot = path.resolve(args["output-root"] ?? process.cwd());

if (!isValidPlayableId(playableId) || !isNonEmptyString(title)) {
  fail(`${usage}\n\nMissing or invalid required arguments.`);
}

const playableName = toPascalCase(playableId);
const playableConst = toConstantCase(playableId);
const playableDir = path.join(outputRoot, "src", "playables", playableId);

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
        title,
        kind: "builtin",
        paths: {
          manifestFile: `src/playables/${playableId}/manifest.ts`,
          contractFile: `src/playables/${playableId}/contract.ts`,
          sessionFile: `src/playables/${playableId}/session.ts`,
          reducerFile: `src/playables/${playableId}/reducer.ts`,
          presenterFile: `src/playables/${playableId}/presenter.ts`,
          settlementFile: `src/playables/${playableId}/settlement.ts`,
          indexFile: `src/playables/${playableId}/index.ts`,
          assetDirectory: `src/assets/playables/${playableId}`,
        },
      },
      null,
      2
    )}\n`,
  },
  {
    filePath: path.join(playableDir, "contract.ts"),
    contents: `export const ${playableConst}_PLAYABLE_ID = "${playableId}" as const;\n\nexport type ${playableName}Status = "idle" | "active" | "completed";\n\nexport type ${playableName}Session = {\n  playableId: typeof ${playableConst}_PLAYABLE_ID;\n  status: ${playableName}Status;\n  roundsCompleted: number;\n};\n\nexport type ${playableName}Action =\n  | { type: "start" }\n  | { type: "advance" }\n  | { type: "complete" };\n\nexport type ${playableName}ViewModel = {\n  playableId: typeof ${playableConst}_PLAYABLE_ID;\n  status: ${playableName}Status;\n  roundsCompleted: number;\n};\n\nexport type ${playableName}Completion = {\n  outcome: "pending" | "completed";\n  effects: readonly [];\n};\n`,
  },
  {
    filePath: path.join(playableDir, "session.ts"),
    contents: `import { ${playableConst}_PLAYABLE_ID, type ${playableName}Session } from "./contract";\n\nexport function create${playableName}Session(): ${playableName}Session {\n  return {\n    playableId: ${playableConst}_PLAYABLE_ID,\n    status: "idle",\n    roundsCompleted: 0,\n  };\n}\n`,
  },
  {
    filePath: path.join(playableDir, "reducer.ts"),
    contents: `import type { ${playableName}Action, ${playableName}Session } from "./contract";\n\nexport function reduce${playableName}(\n  session: ${playableName}Session,\n  action: ${playableName}Action\n): ${playableName}Session {\n  switch (action.type) {\n    case "start":\n      return {\n        ...session,\n        status: "active",\n      };\n    case "advance":\n      return {\n        ...session,\n        status: "active",\n        roundsCompleted: session.roundsCompleted + 1,\n      };\n    case "complete":\n      return {\n        ...session,\n        status: "completed",\n      };\n  }\n}\n`,
  },
  {
    filePath: path.join(playableDir, "presenter.ts"),
    contents: `import type { ${playableName}Session, ${playableName}ViewModel } from "./contract";\n\nexport function present${playableName}(\n  session: ${playableName}Session\n): ${playableName}ViewModel {\n  return {\n    playableId: session.playableId,\n    status: session.status,\n    roundsCompleted: session.roundsCompleted,\n  };\n}\n`,
  },
  {
    filePath: path.join(playableDir, "settlement.ts"),
    contents: `import type { ${playableName}Completion, ${playableName}Session } from "./contract";\n\nexport function complete${playableName}(\n  session: ${playableName}Session\n): ${playableName}Completion {\n  return {\n    outcome: session.status === "completed" ? "completed" : "pending",\n    effects: [] as const,\n  };\n}\n`,
  },
  {
    filePath: path.join(playableDir, "manifest.ts"),
    contents: `import { ${playableConst}_PLAYABLE_ID } from "./contract";\nimport { create${playableName}Session } from "./session";\nimport { reduce${playableName} } from "./reducer";\nimport { present${playableName} } from "./presenter";\nimport { complete${playableName} } from "./settlement";\n\nexport const manifest = {\n  playableId: ${playableConst}_PLAYABLE_ID,\n  title: ${JSON.stringify(title)},\n  createSession: create${playableName}Session,\n  reduce: reduce${playableName},\n  present: present${playableName},\n  complete: complete${playableName},\n};\n`,
  },
  {
    filePath: path.join(playableDir, "index.ts"),
    contents: `export { manifest } from "./manifest";\nexport { create${playableName}Session as createSession } from "./session";\nexport { reduce${playableName} as reduce } from "./reducer";\nexport { present${playableName} as present } from "./presenter";\nexport { complete${playableName} as complete } from "./settlement";\n`,
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

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
