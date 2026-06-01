import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultKbDir = path.join(repositoryRoot, "generated", "history-kb");

function parseArgs(argv) {
  const options = {
    kbDir: defaultKbDir,
    limit: 8,
  };
  const queryParts = [];

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = argv[index + 1];

    if (argument === "--kb-dir") {
      if (next == null) {
        throw new Error("--kb-dir requires a value");
      }
      options.kbDir = path.resolve(repositoryRoot, next);
      index += 1;
      continue;
    }

    if (argument === "--limit") {
      const parsed = Number.parseInt(next ?? "", 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --limit value: ${next ?? ""}`);
      }
      options.limit = parsed;
      index += 1;
      continue;
    }

    queryParts.push(argument);
  }

  const query = queryParts.join(" ").trim();
  if (query.length === 0) {
    throw new Error("A query is required");
  }

  return {
    ...options,
    query,
  };
}

function normalize(text) {
  return text.replace(/\s+/g, "").toLowerCase();
}

function countOccurrences(text, token) {
  if (token.length === 0) {
    return 0;
  }

  let count = 0;
  let cursor = 0;

  while (cursor < text.length) {
    const found = text.indexOf(token, cursor);
    if (found < 0) {
      break;
    }
    count += 1;
    cursor = found + token.length;
  }

  return count;
}

function buildQueryTokens(query) {
  const normalized = normalize(query);
  const tokens = new Set([normalized]);

  if (!/\s/.test(query)) {
    for (let size = 2; size <= Math.min(4, normalized.length); size += 1) {
      for (let index = 0; index <= normalized.length - size; index += 1) {
        tokens.add(normalized.slice(index, index + size));
      }
    }
  } else {
    query
      .split(/\s+/)
      .map((part) => normalize(part))
      .filter((part) => part.length > 0)
      .forEach((part) => tokens.add(part));
  }

  return [...tokens].sort((left, right) => right.length - left.length);
}

function scoreChunk(chunk, query, tokens) {
  const searchableHeading = normalize(`${chunk.sourceTitle} ${chunk.path.join(" ")} ${chunk.sectionHeading}`);
  const searchableText = normalize(chunk.text);
  const normalizedQuery = normalize(query);

  let score = 0;
  score += countOccurrences(searchableHeading, normalizedQuery) * 80;
  score += countOccurrences(searchableText, normalizedQuery) * 30;

  for (const token of tokens) {
    score += countOccurrences(searchableHeading, token) * 10;
    score += countOccurrences(searchableText, token) * 3;
  }

  return score;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const chunksPath = path.join(options.kbDir, "chunks.jsonl");
  const fileText = await readFile(chunksPath, "utf8");
  const chunks = fileText
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
  const tokens = buildQueryTokens(options.query);

  const results = chunks
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, options.query, tokens),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, options.limit)
    .map((chunk) => ({
      score: chunk.score,
      sourceTitle: chunk.sourceTitle,
      path: chunk.path.join(" > "),
      sectionId: chunk.sectionId,
      chunkId: chunk.id,
      preview: chunk.preview,
    }));

  console.log(
    JSON.stringify(
      {
        query: options.query,
        limit: options.limit,
        resultCount: results.length,
        results,
      },
      null,
      2
    )
  );
}

await main();
