import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";
import { defineConfig } from "vite";

export const SCENARIO_PACK_SOURCE_ROOT = "src/content/scenario-packs";
export const SCENARIO_PACK_PUBLIC_ROOT = "/scenario-packs";
export const SCRIPT_EDITOR_TEMPLATE_SOURCE_ROOT =
  "src/modules/script-editor/builtin-templates";
export const SCRIPT_EDITOR_TEMPLATE_PUBLIC_ROOT = "/script-editor-templates";

export function publishScenarioPacksToDir(
  workspaceRoot: string,
  outputRoot: string
): void {
  publishStaticContentTree(
    workspaceRoot,
    outputRoot,
    SCENARIO_PACK_SOURCE_ROOT,
    SCENARIO_PACK_PUBLIC_ROOT
  );
}

export function publishScriptEditorTemplatesToDir(
  workspaceRoot: string,
  outputRoot: string
): void {
  publishStaticContentTree(
    workspaceRoot,
    outputRoot,
    SCRIPT_EDITOR_TEMPLATE_SOURCE_ROOT,
    SCRIPT_EDITOR_TEMPLATE_PUBLIC_ROOT
  );
}

export function createScenarioPackPublishPlugin(workspaceRoot = __dirname) {
  return {
    name: "scenario-pack-publisher",
    configureServer(server: {
      middlewares: {
        use: (
          handler: (
            req: { url?: string; method?: string },
            res: {
              statusCode: number;
              setHeader: (name: string, value: string) => void;
              end: (body?: string | Buffer) => void;
            },
            next: () => void
          ) => void
        ) => void;
      };
    }) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split("?")[0] ?? "";
        const sourcePath =
          resolvePublishedStaticContentSourcePath(
            workspaceRoot,
            pathname,
            SCENARIO_PACK_SOURCE_ROOT,
            SCENARIO_PACK_PUBLIC_ROOT
          ) ??
          resolvePublishedStaticContentSourcePath(
            workspaceRoot,
            pathname,
            SCRIPT_EDITOR_TEMPLATE_SOURCE_ROOT,
            SCRIPT_EDITOR_TEMPLATE_PUBLIC_ROOT
          );

        if (sourcePath == null) {
          next();
          return;
        }

        if (!existsSync(sourcePath) || statSync(sourcePath).isDirectory()) {
          res.statusCode = 404;
          res.end("Not Found");
          return;
        }

        const body = readFileSync(sourcePath);
        res.statusCode = 200;
        res.setHeader("Content-Type", getMimeType(sourcePath));
        res.setHeader("Content-Length", String(body.byteLength));
        res.end(body);
      });
    },
    closeBundle() {
      publishScenarioPacksToDir(workspaceRoot, resolve(workspaceRoot, "dist"));
      publishScriptEditorTemplatesToDir(workspaceRoot, resolve(workspaceRoot, "dist"));
    },
  };
}

function publishStaticContentTree(
  workspaceRoot: string,
  outputRoot: string,
  sourceRootPath: string,
  publicRootPath: string
): void {
  const sourceRoot = resolve(workspaceRoot, sourceRootPath);
  const publishedRoot = resolve(outputRoot, publicRootPath.replace(/^\//, ""));

  mkdirSync(outputRoot, { recursive: true });
  cpSync(sourceRoot, publishedRoot, {
    recursive: true,
    force: true,
  });
}

function resolvePublishedStaticContentSourcePath(
  workspaceRoot: string,
  pathname: string,
  sourceRootPath: string,
  publicRootPath: string
): string | null {
  if (!pathname.startsWith(publicRootPath)) {
    return null;
  }

  const relativePublishedPath = pathname
    .slice(publicRootPath.length)
    .replace(/^\/+/, "");
  const sourceRoot = resolve(workspaceRoot, sourceRootPath);
  const absolutePath = resolve(sourceRoot, relativePublishedPath);
  const relativePath = relative(sourceRoot, absolutePath);

  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    return null;
  }

  return absolutePath;
}

function getMimeType(filePath: string): string {
  switch (extname(filePath).toLowerCase()) {
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export default defineConfig({
  base: "./",
  appType: "mpa",
  server: {
    watch: {
      ignored: ["**/.codex-temp/**", "**/.superpowers/**"],
    },
  },
  plugins: [
    createScenarioPackPublishPlugin(),
    {
      name: "spine-editor-json-save",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = req.url?.split("?")[0] || "";
          if (pathname !== "/api/spine-editor/save") {
            next();
            return;
          }
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }
          let body = "";
          req.setEncoding("utf8");
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("error", (error) => {
            const responseBody = JSON.stringify({ ok: false, error: error.message });
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader("Content-Length", String(Buffer.byteLength(responseBody)));
            res.end(responseBody);
          });
          req.on("end", () => {
            try {
              const payload = JSON.parse(body || "{}") as { path?: string; data?: unknown };
              const targetPath =
                payload.path || "src/faxian/leg/new-version-spine-project.json";
              if (!targetPath.endsWith(".json")) {
                throw new Error("Only .json files can be saved");
              }
              const absoluteTarget = resolve(__dirname, targetPath);
              const relativeTarget = relative(__dirname, absoluteTarget);
              if (relativeTarget.startsWith("..") || isAbsolute(relativeTarget)) {
                throw new Error("Save path must stay inside the workspace");
              }
              if (!payload.data || typeof payload.data !== "object") {
                throw new Error("Missing JSON object payload");
              }
              mkdirSync(dirname(absoluteTarget), { recursive: true });
              writeFileSync(
                absoluteTarget,
                `${JSON.stringify(payload.data, null, 2)}\n`,
                "utf8"
              );
              const responseBody = JSON.stringify({
                ok: true,
                path: relativeTarget.replaceAll("\\", "/"),
              });
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.setHeader("Content-Length", String(Buffer.byteLength(responseBody)));
              res.end(responseBody);
            } catch (error) {
              const responseBody = JSON.stringify({
                ok: false,
                error: error instanceof Error ? error.message : "Save failed",
              });
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.setHeader("Content-Length", String(Buffer.byteLength(responseBody)));
              res.end(responseBody);
            }
          });
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        battleDemo: resolve(__dirname, "prototypes/battle-demo/index.html"),
      },
    },
  },
});
