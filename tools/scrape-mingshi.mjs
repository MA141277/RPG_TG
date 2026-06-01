import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(repositoryRoot, "generated", "mingshi");
const indexUrl = "https://www.guoxuedashi.com/a/26ozxd/";
const defaultDelayMs = 250;

function parseArgs(argv) {
  const options = {
    limit: null,
    delayMs: defaultDelayMs,
    outputDir: outputRoot,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--limit") {
      const rawValue = argv[index + 1];
      const limit = Number.parseInt(rawValue ?? "", 10);
      if (!Number.isFinite(limit) || limit <= 0) {
        throw new Error(`Invalid --limit value: ${rawValue ?? ""}`);
      }
      options.limit = limit;
      index += 1;
      continue;
    }

    if (argument === "--delay-ms") {
      const rawValue = argv[index + 1];
      const delayMs = Number.parseInt(rawValue ?? "", 10);
      if (!Number.isFinite(delayMs) || delayMs < 0) {
        throw new Error(`Invalid --delay-ms value: ${rawValue ?? ""}`);
      }
      options.delayMs = delayMs;
      index += 1;
      continue;
    }

    if (argument === "--output-dir") {
      const rawValue = argv[index + 1];
      if (rawValue == null || rawValue.trim() === "") {
        throw new Error("--output-dir requires a path");
      }
      options.outputDir = path.resolve(repositoryRoot, rawValue);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; RPG_TG scraper/1.0)",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function htmlDecode(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&quot;/gi, "\"")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function stripTags(text) {
  return text.replace(/<[^>]+>/g, "");
}

function normalizeWhitespace(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function toAbsoluteUrl(href) {
  return new URL(href, indexUrl).toString();
}

function extractCatalog(html) {
  const catalogBlockMatch = html.match(/<div class="info_cate clearfix">([\s\S]*?)<\/dl>\s*<\/div>/i);
  if (catalogBlockMatch == null) {
    throw new Error("Unable to locate catalog block on index page");
  }

  const catalogHtml = catalogBlockMatch[1];
  const chapterMatches = [...catalogHtml.matchAll(/<dd>\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/dd>/gi)];

  if (chapterMatches.length === 0) {
    throw new Error("Catalog block was found, but no chapters were extracted");
  }

  return chapterMatches.map((match, index) => ({
    index: index + 1,
    title: normalizeWhitespace(htmlDecode(stripTags(match[2]))),
    url: toAbsoluteUrl(match[1]),
  }));
}

function extractTitle(html) {
  const titleMatch = html.match(/<div id="ArtContent">\s*<h1>([\s\S]*?)<\/h1>/i);
  if (titleMatch == null) {
    throw new Error("Unable to locate chapter title");
  }

  return normalizeWhitespace(htmlDecode(stripTags(titleMatch[1])));
}

function extractChapterContent(html) {
  const contentMatch = html.match(
    /<div class="info_txt clearfix" id="infozj_txt">\s*([\s\S]*?)\s*<\/div>/i
  );
  if (contentMatch == null) {
    throw new Error("Unable to locate chapter content");
  }

  const cleaned = contentMatch[1]
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/\u3000/g, "　");

  return normalizeWhitespace(htmlDecode(stripTags(cleaned)));
}

function buildPlainText(bookTitle, chapters) {
  const parts = [`${bookTitle}\n`];

  for (const chapter of chapters) {
    parts.push(chapter.title);
    parts.push(chapter.content);
    parts.push("");
  }

  return `${parts.join("\n")}\n`;
}

async function scrapeBook(options) {
  const indexHtml = await fetchHtml(indexUrl);
  const bookTitle = normalizeWhitespace(
    htmlDecode(stripTags(indexHtml.match(/<div class="info_tree">[\s\S]*?<h1>([\s\S]*?)<\/h1>/i)?.[1] ?? "明史"))
  );
  const catalog = extractCatalog(indexHtml);
  const selectedCatalog = options.limit == null ? catalog : catalog.slice(0, options.limit);
  const chapters = [];

  for (const item of selectedCatalog) {
    console.log(`Fetching ${item.index}/${selectedCatalog.length}: ${item.title}`);
    const chapterHtml = await fetchHtml(item.url);
    const title = extractTitle(chapterHtml);
    const content = extractChapterContent(chapterHtml);

    chapters.push({
      index: item.index,
      title,
      url: item.url,
      content,
    });

    if (options.delayMs > 0 && item.index !== selectedCatalog[selectedCatalog.length - 1]?.index) {
      await sleep(options.delayMs);
    }
  }

  return {
    bookTitle,
    source: indexUrl,
    scrapedAt: new Date().toISOString(),
    chapterCount: catalog.length,
    exportedChapterCount: chapters.length,
    catalog,
    chapters,
  };
}

async function writeOutputs(result, outputDir) {
  await mkdir(outputDir, { recursive: true });

  const catalogPath = path.join(outputDir, "mingshi-catalog.json");
  const jsonPath = path.join(outputDir, "mingshi.json");
  const textPath = path.join(outputDir, "mingshi.txt");

  await Promise.all([
    writeFile(catalogPath, `${JSON.stringify(result.catalog, null, 2)}\n`, "utf8"),
    writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8"),
    writeFile(textPath, buildPlainText(result.bookTitle, result.chapters), "utf8"),
  ]);

  return { catalogPath, jsonPath, textPath };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = await scrapeBook(options);
  const outputs = await writeOutputs(result, options.outputDir);

  console.log(
    JSON.stringify(
      {
        bookTitle: result.bookTitle,
        source: result.source,
        chapterCount: result.chapterCount,
        exportedChapterCount: result.exportedChapterCount,
        outputDir: options.outputDir,
        outputs,
      },
      null,
      2
    )
  );
}

await main();
