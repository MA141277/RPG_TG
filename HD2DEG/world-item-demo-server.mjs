/**
 * 本地演示服务：① 服务端拉取 Ark/TOS 图片并同源提供，避免浏览器 canvas CORS；
 * ② 将物品 JSON + 图标文件写入 data/saves/。
 *
 * 启动：npm run demo-server
 * 浏览器打开：http://127.0.0.1:8770/
 */

import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8770);

const DATA_CACHE = path.join(ROOT, "data", "cache");
const DATA_SAVES = path.join(ROOT, "data", "saves");
const DEMO_HTML = path.join(ROOT, "ai-world-item-generator-demo.html");

function ensureDirs() {
  fs.mkdirSync(DATA_CACHE, { recursive: true });
  fs.mkdirSync(DATA_SAVES, { recursive: true });
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function sendText(res, status, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(text);
}

function fetchUrlBuffer(urlStr, maxBytes = 40 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(
      urlStr,
      {
        method: "GET",
        headers: {
          "User-Agent": "world-item-demo-server/1.0",
          Accept: "*/*",
        },
        timeout: 120000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          const next = new URL(res.headers.location, urlStr).href;
          fetchUrlBuffer(next, maxBytes).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        let total = 0;
        res.on("data", (c) => {
          total += c.length;
          if (total > maxBytes) {
            req.destroy();
            reject(new Error("文件过大"));
            return;
          }
          chunks.push(c);
        });
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.end();
  });
}

function extFromUrl(urlStr) {
  const base = urlStr.split("?")[0];
  const m = /\.(jpe?g|png|webp|gif)$/i.exec(base);
  if (m) return m[1].toLowerCase() === "jpeg" ? ".jpg" : `.${m[1].toLowerCase()}`;
  return ".jpg";
}

function slugName(name) {
  const s = String(name || "item").trim().slice(0, 48);
  const safe = s.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") || "item";
  return safe;
}

function readBody(req, limit = 80 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let n = 0;
    req.on("data", (c) => {
      n += c.length;
      if (n > limit) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safeInsideDir(baseDir, resolvedPath) {
  const base = path.resolve(baseDir);
  const target = path.resolve(resolvedPath);
  return target === base || target.startsWith(base + path.sep);
}

function handleStatic(req, res, baseDir, urlPrefix) {
  let rel = req.url.split("?")[0];
  if (!rel.startsWith(urlPrefix)) return false;
  rel = rel.slice(urlPrefix.length).replace(/^\/+/, "");
  if (!rel || rel.includes("..")) {
    sendText(res, 400, "bad path");
    return true;
  }
  const filePath = path.join(baseDir, rel);
  if (!safeInsideDir(baseDir, filePath)) {
    sendText(res, 403, "forbidden");
    return true;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendText(res, 404, "not found");
    return true;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".html"
            ? "text/html; charset=utf-8"
            : ext === ".json"
              ? "application/json; charset=utf-8"
              : "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

async function handleCacheRemote(req, res, bodyText) {
  let body;
  try {
    body = JSON.parse(bodyText || "{}");
  } catch {
    return send(res, 400, { error: "invalid JSON" });
  }
  const remoteUrl = typeof body.url === "string" ? body.url.trim() : "";
  if (!remoteUrl || !/^https?:\/\//i.test(remoteUrl)) {
    return send(res, 400, { error: "missing or invalid url" });
  }

  let buf;
  try {
    buf = await fetchUrlBuffer(remoteUrl);
  } catch (e) {
    return send(res, 502, { error: String(e.message || e) });
  }

  const id = crypto.randomUUID();
  const ext = extFromUrl(remoteUrl);
  const filename = `${id}${ext}`;
  const diskPath = path.join(DATA_CACHE, filename);
  await fs.promises.writeFile(diskPath, buf);

  const localPath = `/media/cache/${filename}`;
  return send(res, 200, { localPath, bytes: buf.length });
}

async function handleSaveItem(req, res, bodyText) {
  let body;
  try {
    body = JSON.parse(bodyText || "{}");
  } catch {
    return send(res, 400, { error: "invalid JSON" });
  }

  const worldItem = body.worldItem;
  if (!worldItem || typeof worldItem !== "object") {
    return send(res, 400, { error: "missing worldItem" });
  }

  const rawCachePath = typeof body.rawCachePath === "string" ? body.rawCachePath.trim() : "";
  const iconProcessedDataUrl =
    typeof body.iconProcessedDataUrl === "string" ? body.iconProcessedDataUrl.trim() : "";

  const folderName = `${Date.now()}-${slugName(worldItem.name)}`;
  const dir = path.join(DATA_SAVES, folderName);
  await fs.promises.mkdir(dir, { recursive: true });

  const assets = {};

  if (rawCachePath && rawCachePath.startsWith("/media/cache/")) {
    const rel = rawCachePath.replace("/media/cache/", "").replace(/\\/g, "/");
    if (!rel.includes("..") && /^[a-zA-Z0-9_.-]+$/.test(rel)) {
      const src = path.join(DATA_CACHE, rel);
      if (fs.existsSync(src) && fs.statSync(src).isFile() && safeInsideDir(DATA_CACHE, src)) {
        const ext = path.extname(rel) || ".jpg";
        const rawName = `icon-raw${ext}`;
        await fs.promises.copyFile(src, path.join(dir, rawName));
        assets.raw = rawName;
      }
    }
  }

  if (iconProcessedDataUrl.startsWith("data:image/png;base64,")) {
    const b64 = iconProcessedDataUrl.slice("data:image/png;base64,".length);
    const outName = "icon-processed.png";
    await fs.promises.writeFile(path.join(dir, outName), Buffer.from(b64, "base64"));
    assets.processed = outName;
  }

  const manifest = {
    savedAt: new Date().toISOString(),
    worldItem,
    assets,
  };

  const jsonPath = path.join(dir, "world-item.json");
  await fs.promises.writeFile(jsonPath, JSON.stringify(manifest, null, 2), "utf8");

  return send(res, 200, {
    id: folderName,
    manifestPath: `/saves/${folderName}/world-item.json`,
    folderPath: `/saves/${folderName}/`,
  });
}

const server = http.createServer(async (req, res) => {
  const u = req.url.split("?")[0];

  if (u === "/api/health" && req.method === "GET") {
    return send(res, 200, { ok: true, port: PORT });
  }

  if (u === "/api/cache-remote-image" && req.method === "POST") {
    try {
      const raw = await readBody(req);
      return await handleCacheRemote(req, res, raw);
    } catch (e) {
      return send(res, 500, { error: String(e.message || e) });
    }
  }

  if (u === "/api/save-item" && req.method === "POST") {
    try {
      const raw = await readBody(req);
      return await handleSaveItem(req, res, raw);
    } catch (e) {
      return send(res, 500, { error: String(e.message || e) });
    }
  }

  if (req.method === "GET") {
    if (u === "/" || u === "/index.html") {
      if (!fs.existsSync(DEMO_HTML)) {
        return sendText(res, 500, "ai-world-item-generator-demo.html not found next to server");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(DEMO_HTML).pipe(res);
      return;
    }
    if (handleStatic(req, res, DATA_CACHE, "/media/cache")) return;
    if (handleStatic(req, res, DATA_SAVES, "/saves")) return;
  }

  sendText(res, 404, "not found");
});

ensureDirs();
server.listen(PORT, "127.0.0.1", () => {
  console.log(`world-item-demo-server http://127.0.0.1:${PORT}/`);
});
