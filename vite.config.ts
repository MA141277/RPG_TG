import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
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
            const targetPath = payload.path || "src/faxian/leg/new-version-spine-project.json";
            if (!targetPath.endsWith(".json")) throw new Error("Only .json files can be saved");
            const absoluteTarget = resolve(__dirname, targetPath);
            const relativeTarget = relative(__dirname, absoluteTarget);
            if (relativeTarget.startsWith("..") || isAbsolute(relativeTarget)) {
              throw new Error("Save path must stay inside the workspace");
            }
            if (!payload.data || typeof payload.data !== "object") {
              throw new Error("Missing JSON object payload");
            }
            mkdirSync(dirname(absoluteTarget), { recursive: true });
            writeFileSync(absoluteTarget, `${JSON.stringify(payload.data, null, 2)}\n`, "utf8");
            const responseBody = JSON.stringify({ ok: true, path: relativeTarget.replaceAll("\\", "/") });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader("Content-Length", String(Buffer.byteLength(responseBody)));
            res.end(responseBody);
            } catch (error) {
            const responseBody = JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Save failed" });
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
      input: resolve(__dirname, "index.html"),
    },
  },
});
