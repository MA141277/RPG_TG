# Git Commit Summary Enforcement Design

Date: 2026-07-02

## Context

The repository currently has no shared `.githooks/` directory, no documented commit-message format, and no repository-scoped bootstrap command that enables local Git hooks for collaborators. Recent commit history also shows mixed message formats, so the repository does not yet enforce a required change summary in commit bodies.

The requested policy is:

- every commit intended for remote push must include a change overview in the commit body
- the overview must be written under a `Summary:` section
- the rule should live in the repository so collaborators can enable and follow the same workflow

## Goals

- Enforce a repository-standard commit body section named `Summary:`.
- Reject non-compliant commits before they are created.
- Keep the rule lightweight enough for daily use.
- Make collaborator setup explicit and repeatable from repository files.

## Non-Goals

- Automatically infer or generate commit summaries from diffs.
- Enforce branch naming, semantic prefixes, or PR title conventions.
- Special-case merge, revert, or conflict-resolution workflows in the first version.
- Guarantee hook activation without any local setup. Git does not propagate `core.hooksPath` through clone.

## Chosen Approach

Use a repository-managed `commit-msg` hook under `.githooks/`, ship an installation command that points local Git config to that directory, and document the required commit format in the repository README.

This approach covers both halves of the problem:

- the validation logic is versioned with the repository
- collaborators have a single bootstrap step to opt into enforcement locally

## Why Not Other Approaches

### Documentation only

Documentation and examples do not enforce anything. This does not satisfy the requirement that every commit in this repository must follow the rule.

### Commit template only

Templates improve ergonomics but do not reject malformed messages. Contributors can still delete or bypass the template body.

### CI-only enforcement

CI can reject bad history before merge, but it does not stop invalid commits from being created locally. The requested rule is a commit-time constraint, not just an integration-time check.

## Commit Contract

Every commit message must satisfy all of the following:

1. The subject line exists and is not blank.
2. The message contains a body after the subject.
3. The body contains a line exactly equal to `Summary:`.
4. At least one non-empty summary line appears after `Summary:`.

Accepted example:

```text
feat: add commit summary enforcement

Summary:
- add repository-managed commit-msg hook
- add bootstrap command for core.hooksPath
- document required commit format in README
```

Rejected examples:

```text
feat: add commit summary enforcement
```

```text
feat: add commit summary enforcement

Summary:
```

```text
feat: add commit summary enforcement

Details:
- add repository-managed commit-msg hook
```

## Repository Changes

The implementation should add the following repository artifacts:

- `.githooks/commit-msg`
  - validates the commit message file passed by Git
  - exits non-zero with a clear remediation message when `Summary:` is missing or empty
- `scripts/install-git-hooks.(ps1|mjs|sh-compatible entry point)`
  - sets `git config core.hooksPath .githooks` for the local clone
- `package.json`
  - adds a bootstrap command such as `npm run git:install-hooks`
- `README.md`
  - explains the policy, setup step, and required commit message shape

Optional but useful:

- a checked-in commit message example file or snippet in documentation

## Validation Logic

The hook should:

- read the commit message file path from the first hook argument
- normalize CRLF and LF handling safely
- parse the body lines after the first line
- find the first `Summary:` line
- require at least one subsequent non-empty line before end-of-file
- print a concise example of a valid message on failure

The hook should not:

- rewrite commit messages automatically
- require bullet syntax specifically
- inspect staged diffs or compare message content against changed files

## Error Handling

Failure output should explain:

- why the commit was rejected
- the required `Summary:` contract
- a valid example message
- how to enable repository hooks if the contributor has not done so yet

## Testing Strategy

This change should be verified with focused tests for the validator script where practical, plus manual end-to-end checks:

- valid commit message passes
- missing body fails
- missing `Summary:` fails
- empty `Summary:` section fails

Manual checks should cover:

- running the bootstrap command in a fresh clone
- creating a failing commit attempt
- creating a passing commit attempt

## Rollout Notes

Because Git hooks are local configuration, collaborators must run the bootstrap command once per clone. The repository can enforce the rule for all participating collaborators after that setup step, but it cannot make an unconfigured clone obey hooks automatically.

This is the current repository mismatch that the implementation must close:

- shared validation logic can be committed
- hook activation still requires an explicit local install command

## Recommended Next Step

After design approval, create an implementation plan and then add:

- the `commit-msg` hook
- the installer command
- README guidance
- validator tests if the chosen hook implementation is testable in the existing Node-based test setup
