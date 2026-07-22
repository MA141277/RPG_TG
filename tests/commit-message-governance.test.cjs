const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { spawnSync, execFileSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");

async function loadCommitMessageModule() {
  return import(
    pathToFileURL(path.join(projectRoot, "tools", "validate-commit-message.mjs")).href
  );
}

function writeTempCommitMessage(content) {
  const filePath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-commit-msg-")),
    "COMMIT_EDITMSG"
  );
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
}

function createTempGitRepo() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rpg-tg-commit-range-"));
  execFileSync("git", ["init"], { cwd: repoRoot, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "Codex Test"], { cwd: repoRoot, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "codex@example.com"], {
    cwd: repoRoot,
    stdio: "ignore",
  });
  fs.writeFileSync(path.join(repoRoot, "file.txt"), "first\n", "utf8");
  execFileSync("git", ["add", "file.txt"], { cwd: repoRoot, stdio: "ignore" });
  execFileSync(
    "git",
    [
      "commit",
      "-m",
      "docs: add governed commit message rule\n\nSummary:\n- add a structured summary block to the first repository fixture commit.\n",
    ],
    { cwd: repoRoot, stdio: "ignore" }
  );
  return repoRoot;
}

test("commit message validator accepts subject plus Summary bullets", async () => {
  const { validateCommitMessage } = await loadCommitMessageModule();

  const result = validateCommitMessage(
    "docs: harden blueprint governance\n\nSummary:\n- replace prose-only control fields with structured enums.\n- add repository lint coverage for the new rule.\n"
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("commit message validator rejects messages without a Summary block", async () => {
  const { validateCommitMessage } = await loadCommitMessageModule();

  const result = validateCommitMessage("docs: harden blueprint governance");

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /Summary/i);
});

test("commit message validator rejects Summary headers without bullets", async () => {
  const { validateCommitMessage } = await loadCommitMessageModule();

  const result = validateCommitMessage(
    "docs: harden blueprint governance\n\nSummary:\nVerification:\n- npm run lint\n"
  );

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /bullet/i);
});

test("commit message validator rejects subject lines without typed summary titles", async () => {
  const { validateCommitMessage } = await loadCommitMessageModule();

  const result = validateCommitMessage(
    "update stuff\n\nSummary:\n- describe the actual content.\n"
  );

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /subject/i);
});

test("commit message validator CLI accepts --edit files with comments stripped", () => {
  const messagePath = writeTempCommitMessage(
    "merge: integrate blueprint governance hardening into mod-first-dev\n\nSummary:\n- merge the working branch after governance sync passes.\n# Please enter the commit message for your changes.\n"
  );

  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "tools", "validate-commit-message.mjs"), "--edit", messagePath],
    { cwd: projectRoot, encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Commit message lint passed/i);
});

test("commit message validator CLI rejects rev ranges containing invalid commit messages", () => {
  const repoRoot = createTempGitRepo();

  fs.writeFileSync(path.join(repoRoot, "file.txt"), "second\n", "utf8");
  execFileSync("git", ["add", "file.txt"], { cwd: repoRoot, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", "fix: missing summary"], {
    cwd: repoRoot,
    stdio: "ignore",
  });

  const result = spawnSync(
    process.execPath,
    [
      path.join(projectRoot, "tools", "validate-commit-message.mjs"),
      "--rev-range",
      "HEAD~1..HEAD",
    ],
    { cwd: repoRoot, encoding: "utf8" }
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid commit message/i);
  assert.match(result.stderr, /Summary/i);
});

test("commit message validator accepts explicit commit sha lists", async () => {
  const repoRoot = createTempGitRepo();
  const headSha = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  const { validateCommitShas } = await loadCommitMessageModule();

  const result = validateCommitShas([headSha], repoRoot);

  assert.equal(result.valid, true);
  assert.equal(result.checkedCommitCount, 1);
});
