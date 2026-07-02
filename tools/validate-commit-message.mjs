import fs from "node:fs";
import { pathToFileURL } from "node:url";

export function validateCommitMessageText(text) {
  const normalizedText = text.replace(/\r\n/g, "\n");
  const lines = normalizedText.split("\n");
  const errors = [];
  const subject = lines[0]?.trim() ?? "";
  const bodyLines = lines.slice(1);
  const summaryIndex = bodyLines.findIndex((line) => line.trim() === "Summary:");

  if (subject.length === 0) {
    errors.push("Commit subject must not be empty.");
  }

  if (!bodyLines.some((line) => line.trim().length > 0)) {
    errors.push("Commit message must include a body.");
  }

  if (summaryIndex === -1) {
    errors.push("Commit message body must include a `Summary:` section.");
  } else {
    const summaryBodyLines = bodyLines
      .slice(summaryIndex + 1)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (summaryBodyLines.length === 0) {
      errors.push("`Summary:` must be followed by at least one non-empty line.");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function main(argv) {
  const commitMessagePath = argv[2];

  if (!commitMessagePath) {
    console.error("Missing commit message file path.");
    process.exit(1);
  }

  const text = fs.readFileSync(commitMessagePath, "utf8");
  const result = validateCommitMessageText(text);

  if (result.ok) {
    return;
  }

  console.error("Commit message rejected.");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  console.error("");
  console.error("Example:");
  console.error("feat: add hook-based commit summary enforcement");
  console.error("");
  console.error("Summary:");
  console.error("- add repository-managed commit-msg hook");
  process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv);
}
