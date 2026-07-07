import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const SUBJECT_PATTERN = /^[a-z0-9][a-z0-9/-]*: .+\S$/i;
const SECTION_HEADER_PATTERN = /^[A-Z][A-Za-z ]*:\s*$/;
const SUMMARY_HEADER = "Summary:";

export function normalizeCommitMessage(rawMessage) {
  return String(rawMessage ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => !/^\s*#/.test(line))
    .join("\n")
    .trim();
}

export function validateCommitMessage(rawMessage) {
  const message = normalizeCommitMessage(rawMessage);
  const errors = [];

  if (!message) {
    return {
      valid: false,
      errors: ["Commit message is empty."],
      normalizedMessage: message,
    };
  }

  const lines = message.split("\n");
  const subject = lines[0] ?? "";

  if (!SUBJECT_PATTERN.test(subject)) {
    errors.push(
      "Commit subject must use `<type>: <brief title>` format, for example `docs: harden blueprint governance`."
    );
  }

  if (lines.length < 3 || lines[1] !== "") {
    errors.push("Commit subject must be followed by a blank line before the body.");
  }

  const summaryIndex = lines.findIndex((line, index) => index >= 2 && line === SUMMARY_HEADER);
  if (summaryIndex === -1) {
    errors.push("Commit message body must contain a `Summary:` section.");
  } else {
    const summaryBullets = [];
    for (let index = summaryIndex + 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (!line.trim()) {
        if (summaryBullets.length > 0) {
          break;
        }
        continue;
      }
      if (SECTION_HEADER_PATTERN.test(line)) {
        break;
      }
      if (/^\s*-\s+\S/.test(line)) {
        summaryBullets.push(line);
        continue;
      }
      if (summaryBullets.length === 0) {
        errors.push("`Summary:` must be followed by at least one bullet line starting with `- `.");
      } else {
        errors.push("`Summary:` may contain only bullet lines before the next section header.");
      }
      break;
    }

    if (summaryBullets.length === 0 && !errors.some((error) => error.includes("`Summary:`"))) {
      errors.push("`Summary:` must be followed by at least one bullet line starting with `- `.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    normalizedMessage: message,
  };
}

function readCommitMessageFile(filePath) {
  return fs.readFileSync(path.resolve(filePath), "utf8");
}

function getCommitShasForRange(revRange, cwd) {
  const output = execFileSync("git", ["rev-list", "--reverse", revRange], {
    cwd,
    encoding: "utf8",
  }).trim();
  return output ? output.split("\n").filter(Boolean) : [];
}

function getCommitMessage(sha, cwd) {
  return execFileSync("git", ["log", "-1", "--format=%B", sha], {
    cwd,
    encoding: "utf8",
  });
}

export function validateCommitRange(revRange, cwd = process.cwd()) {
  const shas = getCommitShasForRange(revRange, cwd);
  return validateCommitShas(shas, cwd);
}

export function validateCommitShas(shas, cwd = process.cwd()) {
  const failures = [];

  for (const sha of shas) {
    const result = validateCommitMessage(getCommitMessage(sha, cwd));
    if (!result.valid) {
      failures.push({ sha, ...result });
    }
  }

  return { valid: failures.length === 0, failures, checkedCommitCount: shas.length };
}

function printSingleResult(result, label) {
  if (result.valid) {
    console.log(`Commit message lint passed for ${label}.`);
    return 0;
  }

  console.error(`Invalid commit message in ${label}:`);
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  return 1;
}

function printRangeResult(result, revRange) {
  if (result.valid) {
    console.log(`Commit message lint passed for ${result.checkedCommitCount} commit(s) in ${revRange}.`);
    return 0;
  }

  console.error(`Invalid commit message(s) found in ${revRange}:`);
  for (const failure of result.failures) {
    console.error(`- ${failure.sha}`);
    for (const error of failure.errors) {
      console.error(`  - ${error}`);
    }
  }
  return 1;
}

function printUsage() {
  console.error(
    "Usage: node tools/validate-commit-message.mjs --message <text> | --edit <path> | --rev-range <git-range> | --commits <sha1,sha2,...>"
  );
}

function main(argv) {
  if (argv.length < 2) {
    printUsage();
    return 1;
  }

  const [flag, ...rest] = argv;

  if (flag === "--message") {
    return printSingleResult(validateCommitMessage(rest.join(" ")), "provided message");
  }

  if (flag === "--edit") {
    const filePath = rest[0];
    if (!filePath) {
      printUsage();
      return 1;
    }
    return printSingleResult(validateCommitMessage(readCommitMessageFile(filePath)), filePath);
  }

  if (flag === "--rev-range") {
    const revRange = rest[0];
    if (!revRange) {
      printUsage();
      return 1;
    }
    return printRangeResult(validateCommitRange(revRange), revRange);
  }

  if (flag === "--commits") {
    const rawCommitList = rest[0];
    if (!rawCommitList) {
      printUsage();
      return 1;
    }
    const shas = rawCommitList.split(",").map((sha) => sha.trim()).filter(Boolean);
    return printRangeResult(validateCommitShas(shas), "explicit commit list");
  }

  printUsage();
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
