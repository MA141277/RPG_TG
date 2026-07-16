import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve("src/faxian/leg");
const generatedDirName = "generated";

function walkProjectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const nextPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkProjectFiles(nextPath, out);
      continue;
    }
    if (entry.isFile() && entry.name === "project.json") {
      out.push(nextPath);
    }
  }
  return out;
}

function sanitizeFilename(input, fallback = "image") {
  const cleaned = String(input || fallback)
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function extFromMime(mime) {
  if (/png/i.test(mime)) return ".png";
  if (/jpe?g/i.test(mime)) return ".jpg";
  if (/webp/i.test(mime)) return ".webp";
  return ".bin";
}

function decodeDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;,]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function uniqueGeneratedName(baseDir, filename, usedNames) {
  const ext = path.extname(filename);
  const stem = path.basename(filename, ext);
  let candidate = filename;
  let index = 1;
  while (usedNames.has(candidate) || fs.existsSync(path.join(baseDir, candidate))) {
    candidate = `${stem}-${index}${ext}`;
    index += 1;
  }
  usedNames.add(candidate);
  return candidate;
}

function externalizeProject(projectFile) {
  const projectDir = path.dirname(projectFile);
  const project = JSON.parse(fs.readFileSync(projectFile, "utf8"));
  const customImages = project.customImages || {};
  const generatedDir = path.join(projectDir, generatedDirName);
  const usedNames = new Set();
  let changed = false;

  for (const [imageId, item] of Object.entries(customImages)) {
    const src = String(item?.src || "");
    if (!src.startsWith("data:")) continue;
    const decoded = decodeDataUrl(src);
    if (!decoded) continue;
    fs.mkdirSync(generatedDir, { recursive: true });
    const preferredName = sanitizeFilename(
      item?.name || `${imageId.replace(/^custom:/, "").replace(/[:/\\]+/g, "-")}${extFromMime(decoded.mime)}`,
    );
    const filename = uniqueGeneratedName(generatedDir, preferredName, usedNames);
    fs.writeFileSync(path.join(generatedDir, filename), decoded.buffer);
    item.src = `leg:${generatedDirName}/${filename}`;
    changed = true;
  }

  if (!changed) return false;
  fs.writeFileSync(projectFile, `${JSON.stringify(project, null, 2)}\n`);
  return true;
}

const projectFiles = walkProjectFiles(rootDir);
let changedCount = 0;
for (const projectFile of projectFiles) {
  if (externalizeProject(projectFile)) {
    changedCount += 1;
    console.log(`externalized ${path.relative(process.cwd(), projectFile)}`);
  }
}
console.log(`done: ${changedCount}/${projectFiles.length} project.json updated`);
