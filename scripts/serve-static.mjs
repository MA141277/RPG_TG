import { createReadStream, existsSync, statSync } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { constants as fsConstants } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const projectRoot = resolve(__dirname, "..");

const CONTENT_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function readArg(name, fallback) {
  const flag = `--${name}`;
  const flagWithValue = process.argv.find((argument) => argument.startsWith(`${flag}=`));
  if (flagWithValue != null) {
    return flagWithValue.slice(flag.length + 1);
  }

  const index = process.argv.indexOf(flag);
  if (index >= 0) {
    return process.argv[index + 1] ?? fallback;
  }

  return fallback;
}

const host = process.env.HOST ?? readArg("host", "0.0.0.0");
const port = Number(process.env.PORT ?? readArg("port", "8080"));
const rootArg = process.env.STATIC_ROOT ?? readArg("root", "dist");
const staticRoot = resolve(projectRoot, rootArg);
const indexPath = join(staticRoot, "index.html");

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error(`Invalid port: ${port}`);
}

if (!existsSync(staticRoot)) {
  throw new Error(`Static root does not exist: ${staticRoot}`);
}

if (!existsSync(indexPath)) {
  throw new Error(`Missing index.html under static root: ${indexPath}`);
}

function buildSafePath(urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname);
  const normalizedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const relativePath = normalizedPath.replace(/^[/\\]+/, "");
  return resolve(staticRoot, relativePath);
}

function getContentType(filePath) {
  return CONTENT_TYPES.get(extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

async function resolveRequestFile(urlPathname) {
  const candidatePath = buildSafePath(urlPathname);
  if (!candidatePath.startsWith(staticRoot)) {
    return indexPath;
  }

  try {
    await access(candidatePath, fsConstants.R_OK);
    const candidateStats = statSync(candidatePath);
    if (candidateStats.isDirectory()) {
      const nestedIndexPath = join(candidatePath, "index.html");
      if (existsSync(nestedIndexPath)) {
        return nestedIndexPath;
      }

      return indexPath;
    }

    return candidatePath;
  } catch {
    return indexPath;
  }
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? `${host}:${port}`}`);
    const resolvedFilePath = await resolveRequestFile(requestUrl.pathname);
    const fileStats = statSync(resolvedFilePath);

    response.writeHead(200, {
      "Content-Length": fileStats.size,
      "Content-Type": getContentType(resolvedFilePath),
      "Cache-Control":
        resolvedFilePath === indexPath ? "no-cache" : "public, max-age=31536000, immutable",
    });

    createReadStream(resolvedFilePath).pipe(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown static server error.";
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Static server error: ${message}`);
  }
});

server.listen(port, host, async () => {
  const indexContent = await readFile(indexPath, "utf8");
  console.log(
    `[rpg-tg] serving ${staticRoot} on http://${host}:${port} (${indexContent.length} bytes in index.html)`
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      process.exit(0);
    });
  });
}
