import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultSourceDir = path.join(repositoryRoot, "generated", "mingshi");
const defaultOutputDir = path.join(repositoryRoot, "generated", "history-kb");

function parseArgs(argv) {
  const options = {
    sourceDir: defaultSourceDir,
    outputDir: defaultOutputDir,
    chunkSize: 1200,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = argv[index + 1];

    if (argument === "--source-dir") {
      if (next == null) {
        throw new Error("--source-dir requires a value");
      }
      options.sourceDir = path.resolve(repositoryRoot, next);
      index += 1;
      continue;
    }

    if (argument === "--output-dir") {
      if (next == null) {
        throw new Error("--output-dir requires a value");
      }
      options.outputDir = path.resolve(repositoryRoot, next);
      index += 1;
      continue;
    }

    if (argument === "--chunk-size") {
      const parsed = Number.parseInt(next ?? "", 10);
      if (!Number.isFinite(parsed) || parsed < 300) {
        throw new Error(`Invalid --chunk-size value: ${next ?? ""}`);
      }
      options.chunkSize = parsed;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function slugify(value) {
  return value
    .normalize("NFKC")
    .replace(/[《》\[\]()（）]/g, " ")
    .replace(/[^\p{Letter}\p{Number}\u4e00-\u9fff]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function normalizeText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\uFEFF/g, "")
    .replace(/\t/g, " ")
    .replace(/[ \u3000]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanHeading(value) {
  return value.replace(/^[●○◎△]\s*/, "").replace(/\s+/g, " ").trim();
}

function trimBoilerplateLines(lines) {
  return lines.filter(
    (line) =>
      !/^\[\s*本书籍由流芳阁/i.test(line) &&
      !/^书籍名称：/.test(line)
  );
}

function inferTitle(lines, fileName) {
  const declaredTitle = lines
    .map((line) => line.match(/^书籍名称：\s*《(.+?)》/))
    .find((match) => match != null)?.[1];

  if (declaredTitle != null) {
    return declaredTitle.trim();
  }

  const bracketed = lines
    .map((line) => line.match(/^《(.+?)》/))
    .find((match) => match != null)?.[1];

  if (bracketed != null) {
    return bracketed.trim();
  }

  return path.parse(fileName).name.trim();
}

function inferAuthor(lines) {
  const candidates = lines.slice(0, 8);

  for (const line of candidates) {
    const directMatch = line.match(/^《.+?》\s*[　 ]*([^\s]+)\s+([^\s]+)$/);
    if (directMatch != null) {
      return `${directMatch[1]} ${directMatch[2]}`.trim();
    }

    const altMatch = line.match(/^.+?[　 ]+[（(]([^）)]+)[）)]([^\s]+)\s*(撰|著)?$/);
    if (altMatch != null) {
      return `${altMatch[1]} ${altMatch[2]}`.trim();
    }
  }

  return null;
}

function detectHeadingLevel(line) {
  if (/^●\s*/.test(line)) {
    return 1;
  }

  if (/^[○◎]\s*/.test(line)) {
    return 2;
  }

  if (/^(卷[一二三四五六七八九十百千上下]+(?:[上下])?(?:\s+.+)?)$/.test(line)) {
    return 1;
  }

  if (/^(自序|附录)$/.test(line)) {
    return 1;
  }

  return 0;
}

function buildGenericSections(fileName, rawText) {
  const allLines = normalizeText(rawText)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const title = inferTitle(allLines, fileName);
  const author = inferAuthor(allLines);
  const lines = trimBoilerplateLines(allLines);
  const sections = [];

  let levelOne = null;
  let current = null;
  let sectionCounter = 0;

  const flushCurrent = () => {
    if (current == null) {
      return;
    }

    const content = normalizeText(current.content.join("\n\n"));
    if (content.length > 0) {
      sections.push({
        id: `${slugify(title)}-section-${String(sectionCounter + 1).padStart(4, "0")}`,
        sourceTitle: title,
        heading: current.heading,
        path: current.path,
        content,
      });
      sectionCounter += 1;
    }

    current = null;
  };

  for (const line of lines) {
    const headingLevel = detectHeadingLevel(line);

    if (headingLevel === 1) {
      const heading = cleanHeading(line);
      flushCurrent();
      levelOne = heading;
      current = {
        heading,
        path: [heading],
        content: [],
      };
      continue;
    }

    if (headingLevel === 2) {
      const heading = cleanHeading(line);
      flushCurrent();
      current = {
        heading,
        path: levelOne == null ? [heading] : [levelOne, heading],
        content: [],
      };
      continue;
    }

    if (current == null) {
      current = {
        heading: "前言",
        path: ["前言"],
        content: [],
      };
    }

    current.content.push(line);
  }

  flushCurrent();

  return {
    title,
    author,
    sections,
  };
}

async function buildMingshiSections(sourceDir) {
  const mingshiJsonPath = path.join(sourceDir, "mingshi.json");
  const mingshiJson = JSON.parse(await readFile(mingshiJsonPath, "utf8"));

  return {
    title: mingshiJson.bookTitle.replace(/[《》]/g, ""),
    author: "清 张廷玉",
    sections: mingshiJson.chapters.map((chapter, index) => ({
      id: `mingshi-section-${String(index + 1).padStart(4, "0")}`,
      sourceTitle: mingshiJson.bookTitle.replace(/[《》]/g, ""),
      heading: chapter.title,
      path: [chapter.title],
      content: normalizeText(chapter.content),
    })),
  };
}

function paragraphSplit(text) {
  return normalizeText(text)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function splitLargeParagraph(paragraph, chunkSize) {
  if (paragraph.length <= chunkSize) {
    return [paragraph];
  }

  const sentences = paragraph
    .split(/(?<=[。！？；])/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  if (sentences.length <= 1) {
    const parts = [];
    for (let offset = 0; offset < paragraph.length; offset += chunkSize) {
      parts.push(paragraph.slice(offset, offset + chunkSize));
    }
    return parts;
  }

  const parts = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current.length + sentence.length + 1) > chunkSize && current.length > 0) {
      parts.push(current.trim());
      current = sentence;
      continue;
    }

    current = current.length === 0 ? sentence : `${current}${sentence}`;
  }

  if (current.length > 0) {
    parts.push(current.trim());
  }

  return parts;
}

function buildChunks(source, section, chunkSize) {
  const paragraphs = paragraphSplit(section.content).flatMap((paragraph) =>
    splitLargeParagraph(paragraph, chunkSize)
  );
  const chunks = [];
  let buffer = [];
  let size = 0;

  const flush = () => {
    if (buffer.length === 0) {
      return;
    }

    const text = buffer.join("\n\n");
    chunks.push({
      text,
      preview: text.slice(0, 120).replace(/\n+/g, " "),
    });
    buffer = [];
    size = 0;
  };

  for (const paragraph of paragraphs) {
    if ((size + paragraph.length + 2) > chunkSize && buffer.length > 0) {
      flush();
    }

    buffer.push(paragraph);
    size += paragraph.length + 2;
  }

  flush();

  return chunks.map((chunk, index) => ({
    id: `${section.id}-chunk-${String(index + 1).padStart(3, "0")}`,
    sourceId: source.id,
    sourceTitle: source.title,
    sectionId: section.id,
    sectionHeading: section.heading,
    path: section.path,
    chunkIndex: index + 1,
    text: chunk.text,
    preview: chunk.preview,
    charCount: chunk.text.length,
  }));
}

function buildHeadingIndex(sections) {
  const index = new Map();

  for (const section of sections) {
    for (const heading of section.path) {
      const key = heading.trim();
      if (key.length === 0) {
        continue;
      }

      const entries = index.get(key) ?? [];
      entries.push({
        sectionId: section.id,
        sourceId: section.sourceId,
        path: section.path,
      });
      index.set(key, entries);
    }
  }

  return Object.fromEntries(
    [...index.entries()].sort((left, right) => left[0].localeCompare(right[0], "zh-Hans-CN"))
  );
}

function toJsonLines(records) {
  return `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
}

function buildReadme({ sourceDir, outputDir, sources, sections, chunks }) {
  const lines = [
    "# History KB",
    "",
    `- Source directory: \`${sourceDir}\``,
    `- Output directory: \`${outputDir}\``,
    `- Sources: ${sources.length}`,
    `- Sections: ${sections.length}`,
    `- Chunks: ${chunks.length}`,
    "",
    "## Files",
    "",
    "- `manifest.json`: corpus overview and source stats",
    "- `sources.json`: source-level metadata",
    "- `sections.jsonl`: normalized section records",
    "- `chunks.jsonl`: retrieval chunks",
    "- `heading-index.json`: heading-to-section lookup",
    "",
    "## Search",
    "",
    "```bash",
    "node tools/search-history-kb.mjs 朱元璋",
    "node tools/search-history-kb.mjs 小明王 --limit 5",
    "```",
    "",
    "## Sources",
    "",
    ...sources.map(
      (source) =>
        `- ${source.title}: ${source.sectionCount} sections, ${source.chunkCount} chunks`
    ),
    "",
  ];

  return lines.join("\n");
}

async function buildKnowledgeBase(options) {
  const entries = await readdir(options.sourceDir, { withFileTypes: true });
  const txtFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "zh-Hans-CN"));

  const sources = [];
  const allSections = [];
  const allChunks = [];

  for (const fileName of txtFiles) {
    if (fileName === "mingshi.txt") {
      const structured = await buildMingshiSections(options.sourceDir);
      const source = {
        id: slugify(structured.title),
        fileName,
        title: structured.title,
        author: structured.author,
      };
      const sections = structured.sections.map((section) => ({
        ...section,
        sourceId: source.id,
      }));
      const chunks = sections.flatMap((section) => buildChunks(source, section, options.chunkSize));

      sources.push({
        ...source,
        sectionCount: sections.length,
        chunkCount: chunks.length,
      });
      allSections.push(...sections);
      allChunks.push(...chunks);
      continue;
    }

    const rawText = await readFile(path.join(options.sourceDir, fileName), "utf8");
    const parsed = buildGenericSections(fileName, rawText);
    const source = {
      id: slugify(parsed.title),
      fileName,
      title: parsed.title,
      author: parsed.author,
    };
    const sections = parsed.sections.map((section) => ({
      ...section,
      sourceId: source.id,
    }));
    const chunks = sections.flatMap((section) => buildChunks(source, section, options.chunkSize));

    sources.push({
      ...source,
      sectionCount: sections.length,
      chunkCount: chunks.length,
    });
    allSections.push(...sections);
    allChunks.push(...chunks);
  }

  const headingIndex = buildHeadingIndex(allSections);
  const manifest = {
    builtAt: new Date().toISOString(),
    sourceDir: options.sourceDir,
    outputDir: options.outputDir,
    sourceCount: sources.length,
    sectionCount: allSections.length,
    chunkCount: allChunks.length,
    chunkSize: options.chunkSize,
    sourceTitles: sources.map((source) => source.title),
  };

  await mkdir(options.outputDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(options.outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`),
    writeFile(path.join(options.outputDir, "sources.json"), `${JSON.stringify(sources, null, 2)}\n`),
    writeFile(path.join(options.outputDir, "sections.jsonl"), toJsonLines(allSections)),
    writeFile(path.join(options.outputDir, "chunks.jsonl"), toJsonLines(allChunks)),
    writeFile(
      path.join(options.outputDir, "heading-index.json"),
      `${JSON.stringify(headingIndex, null, 2)}\n`
    ),
    writeFile(
      path.join(options.outputDir, "README.md"),
      buildReadme({
        sourceDir: options.sourceDir,
        outputDir: options.outputDir,
        sources,
        sections: allSections,
        chunks: allChunks,
      })
    ),
  ]);

  return {
    manifest,
    sources,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = await buildKnowledgeBase(options);

  console.log(
    JSON.stringify(
      {
        ...result.manifest,
        sources: result.sources.map((source) => ({
          title: source.title,
          sectionCount: source.sectionCount,
          chunkCount: source.chunkCount,
        })),
      },
      null,
      2
    )
  );
}

await main();
