import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_PROJECT_ROOT = resolve(__dirname, "..");
const REQUIRED_DIST_ASSET_PATHS = [
  "ui/yuansu/属性栏/20260707-201706.png",
  "ui/yuansu/属性栏/global_task_panel_frame_20260706-190314.png",
  "ui/yuansu/编队详细/兵种/upload_1784703206372190622.png",
  "src/faxian/leg/spearman/project.json",
  "src/faxian/leg/spearman/head.png",
  "src/faxian/leg/cavalry/project.json",
];

export async function createWebStandalonePackage({
  projectRoot = DEFAULT_PROJECT_ROOT,
  outputRoot = resolve(projectRoot, "release"),
  nodeExecutable = process.execPath,
  skipBuild = false,
  zip = true,
  host = "127.0.0.1",
  port = 8080,
  productName = "RPG_TG",
} = {}) {
  const resolvedProjectRoot = resolve(projectRoot);
  const resolvedOutputRoot = resolve(outputRoot);
  const packageJsonPath = resolve(resolvedProjectRoot, "package.json");
  const distRoot = resolve(resolvedProjectRoot, "dist");
  const staticServerPath = resolve(resolvedProjectRoot, "scripts", "serve-static.mjs");
  const resolvedNodeExecutable = resolve(nodeExecutable);

  if (!existsSync(packageJsonPath)) {
    throw new Error(`Missing package.json: ${packageJsonPath}`);
  }
  if (!existsSync(resolvedNodeExecutable)) {
    throw new Error(`Node executable not found: ${resolvedNodeExecutable}`);
  }

  if (!skipBuild) {
    runCommand(resolveNpmCommand(), ["run", "build"], resolvedProjectRoot);
  }

  if (!existsSync(resolve(distRoot, "index.html"))) {
    throw new Error(`Missing built dist/index.html under: ${distRoot}`);
  }
  validateRequiredDistAssets(distRoot);
  if (!existsSync(staticServerPath)) {
    throw new Error(`Missing static server entry: ${staticServerPath}`);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const version = typeof packageJson.version === "string" ? packageJson.version : "0.0.0";
  const platform = process.platform === "win32" ? "win" : process.platform;
  const arch = process.arch;
  const packageName = `${productName}-web-${version}-${platform}-${arch}`;
  const packageRoot = resolve(resolvedOutputRoot, packageName);

  ensureChildPath(resolvedOutputRoot, packageRoot);
  rmSync(packageRoot, { recursive: true, force: true });
  mkdirSync(packageRoot, { recursive: true });

  cpSync(distRoot, resolve(packageRoot, "dist"), { recursive: true });
  mkdirSync(resolve(packageRoot, "scripts"), { recursive: true });
  cpSync(staticServerPath, resolve(packageRoot, "scripts", "serve-static.mjs"));
  mkdirSync(resolve(packageRoot, "runtime"), { recursive: true });
  cpSync(resolvedNodeExecutable, resolve(packageRoot, "runtime", "node.exe"));

  writeFileSync(resolve(packageRoot, "start.bat"), createStartBat({ host, port }), "utf8");
  writeFileSync(resolve(packageRoot, "README.txt"), createReadme({ host, port }), "utf8");

  let zipPath = null;
  if (zip) {
    zipPath = `${packageRoot}.zip`;
    createZipArchive(packageRoot, zipPath);
  }

  return {
    packageName,
    packageRoot,
    zipPath,
  };
}

export function validateRequiredDistAssets(distRoot) {
  const missingPaths = REQUIRED_DIST_ASSET_PATHS.filter(
    (assetPath) => !existsSync(resolve(distRoot, assetPath))
  );

  if (missingPaths.length > 0) {
    throw new Error(
      [
        "Built dist is missing required runtime assets.",
        ...missingPaths.map((assetPath) => `- ${assetPath}`),
        "Run npm run build so Vite publishes static runtime assets before packaging.",
      ].join("\n")
    );
  }
}

function createStartBat({ host, port }) {
  return `@echo off
setlocal
cd /d "%~dp0"
echo Starting RPG_TG web standalone server...
echo.
echo URL: http://${host}:${port}/
echo Close this window to stop the server.
echo.
start "" "http://${host}:${port}/"
"%~dp0runtime\\node.exe" "%~dp0scripts\\serve-static.mjs" --host ${host} --port ${port} --root dist
echo.
echo Server stopped.
pause
`;
}

function createReadme({ host, port }) {
  return `RPG_TG web standalone package

Run:
  start.bat

Then open:
  http://${host}:${port}/

No npm install is required on this computer. This package includes a Node.js
runtime executable only for serving the local static files under dist/.

To stop the game server, close the start.bat console window.
`;
}

function createZipArchive(packageRoot, zipPath) {
  if (process.platform !== "win32") {
    throw new Error("Zip archive creation currently requires Windows PowerShell.");
  }

  rmSync(zipPath, { force: true });
  runCommand(
    "powershell",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "& { param($source, $destination) Compress-Archive -LiteralPath $source -DestinationPath $destination -Force }",
      packageRoot,
      zipPath,
    ],
    DEFAULT_PROJECT_ROOT
  );
}

function runCommand(command, args, cwd) {
  const needsCmdShim =
    process.platform === "win32" && command.toLowerCase().endsWith(".cmd");
  const executable = needsCmdShim ? "cmd.exe" : command;
  const executableArgs = needsCmdShim ? ["/d", "/s", "/c", command, ...args] : args;
  const result = spawnSync(executable, executableArgs, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error != null) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

function resolveNpmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function ensureChildPath(parentPath, childPath) {
  const relativePath = relative(parentPath, childPath);
  if (relativePath.startsWith("..") || relativePath === "") {
    throw new Error(`Refusing to write outside output root: ${childPath}`);
  }
}

function readCliFlag(name, fallback = null) {
  const flag = `--${name}`;
  const withValue = process.argv.find((argument) => argument.startsWith(`${flag}=`));
  if (withValue != null) {
    return withValue.slice(flag.length + 1);
  }

  const index = process.argv.indexOf(flag);
  if (index >= 0) {
    return process.argv[index + 1] ?? fallback;
  }

  return fallback;
}

async function runCli() {
  const result = await createWebStandalonePackage({
    outputRoot: resolve(DEFAULT_PROJECT_ROOT, readCliFlag("output", "release")),
    nodeExecutable: readCliFlag("node", process.execPath),
    skipBuild: process.argv.includes("--skip-build"),
    zip: !process.argv.includes("--no-zip"),
    host: readCliFlag("host", "127.0.0.1"),
    port: Number(readCliFlag("port", "8080")),
  });

  console.log(`Packaged web standalone folder: ${result.packageRoot}`);
  if (result.zipPath != null) {
    console.log(`Packaged web standalone zip: ${result.zipPath}`);
  }
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
