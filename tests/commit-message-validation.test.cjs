const test = require("node:test");
const assert = require("node:assert/strict");

test("accepts a commit message with a Summary section and body lines", async () => {
  const { validateCommitMessageText } = await import(
    "../tools/validate-commit-message.mjs"
  );

  assert.deepEqual(
    validateCommitMessageText("feat: add hook\n\nSummary:\n- add validator\n"),
    { ok: true, errors: [] }
  );
});

test("rejects a commit message without a body", async () => {
  const { validateCommitMessageText } = await import(
    "../tools/validate-commit-message.mjs"
  );

  const result = validateCommitMessageText("feat: add hook\n");
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /body/i);
});

test("rejects a commit message without Summary", async () => {
  const { validateCommitMessageText } = await import(
    "../tools/validate-commit-message.mjs"
  );

  const result = validateCommitMessageText(
    "feat: add hook\n\nDetails:\n- add validator\n"
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Summary:/);
});

test("rejects a commit message with an empty Summary section", async () => {
  const { validateCommitMessageText } = await import(
    "../tools/validate-commit-message.mjs"
  );

  const result = validateCommitMessageText("feat: add hook\n\nSummary:\n");
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /non-empty/i);
});
