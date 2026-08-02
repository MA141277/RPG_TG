const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

test(
  "script editor minigame config and settlement cards stay inside paginated containers",
  { timeout: 120000 },
  async (t) => {
    const playwright = resolvePlaywrightModule();
    if (playwright == null) {
      t.skip(
        "Playwright is not installed. Set CODEX_PLAYWRIGHT_PATH or install playwright to run the browser smoke test."
      );
      return;
    }

    let appUrl = await resolveAvailableDevServerUrl();
    if (appUrl == null) {
      const port = await pickFreePort();
      const server = await startViteDevServer(port);
      appUrl = `http://127.0.0.1:${port}`;
      t.after(async () => {
        await stopChildProcess(server.child);
      });
    }

    const browser = await launchChromium(playwright);
    t.after(async () => {
      await browser.close();
    });

    const page = await browser.newPage({
      viewport: { width: 1600, height: 900 },
    });
    const pageErrors = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(appUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    if ((await page.locator(".c-script-editor-shell").count()) === 0) {
      await page.locator('[data-main-ui-action="open-script-editor"]').click();
      if ((await page.locator('[data-script-editor-action="import-pack"]').count()) > 0) {
        await page.locator('[data-script-editor-action="import-pack"]').click();
      }
      await page.locator(".c-script-editor-shell").waitFor({ timeout: 30000 });
    }

    await page.locator('[data-script-editor-family="minigames"]').click();
    await page.waitForTimeout(150);
    if ((await selectedRecordId(page)) == null) {
      await page
        .locator('.c-script-editor-record-list [data-script-editor-record-id]')
        .first()
        .click();
      await page.waitForTimeout(150);
    }
    assert.notEqual(await selectedRecordId(page), null);

    assert.equal(
      await page
        .locator('[aria-label="玩法基础信息分栏"] [data-script-editor-minigame-field="description"]')
        .count(),
      0
    );
    await page
      .locator(
        '[data-script-editor-action="select-minigame-tab"][data-script-editor-minigame-tab="config"]'
      )
      .click();
    await page.waitForTimeout(150);

    await ensureMinigameCardsReachCount(
      page,
      '[data-script-editor-action="add-minigame-config-entry"]',
      '[aria-label="玩法配置组分栏"] .c-script-editor-minigame-list__route',
      7
    );
    assert.equal(
      await page
        .locator('[aria-label="玩法配置组分栏"] [data-script-editor-minigame-config-field="notes"]')
        .count(),
      0
    );
    assert.equal(
      await page
        .locator('[aria-label="玩法配置组分栏"] .c-script-editor-minigame-list__remove')
        .count() > 0,
      true
    );

    assert.equal(
      await page
        .locator('[aria-label="玩法配置组分栏"] .c-script-editor-minigame-list__route')
        .count(),
      1
    );
    assert.equal(
      await page
        .locator('[aria-label="玩法配置组分栏"] .c-script-editor-record-pagination')
        .count(),
      1
    );
    assert.match(
      await page
        .locator(
          '[aria-label="玩法配置组分栏"] .c-script-editor-record-pagination__status'
        )
        .textContent(),
      /第 3 \/ 3 页/
    );
    await page
      .locator(
        '[aria-label="玩法配置组卡片分页"] [data-script-editor-action="record-page-prev"]'
      )
      .click();
    await page.waitForTimeout(150);
    assert.equal(
      await page
        .locator('[aria-label="玩法配置组分栏"] .c-script-editor-minigame-list__route')
        .count(),
      3
    );

    await page
      .locator(
        '[data-script-editor-action="select-minigame-tab"][data-script-editor-minigame-tab="settlement"]'
      )
      .click();
    await page.waitForTimeout(150);
    assert.equal(
      await page
        .locator('[aria-label="玩法结算组分栏"] .c-script-editor-editor-card__hint')
        .count(),
      0
    );

    await ensureMinigameCardsReachCount(
      page,
      '[data-script-editor-action="add-minigame-settlement-route"]',
      '[aria-label="玩法结算组分栏"] .c-script-editor-minigame-list__route',
      7
    );

    assert.equal(
      await page
        .locator('[aria-label="玩法结算组分栏"] .c-script-editor-minigame-list__route')
        .count(),
      1
    );
    assert.equal(
      await page
        .locator('[aria-label="玩法结算组分栏"] .c-script-editor-minigame-list__remove')
        .count() > 0,
      true
    );
    assert.equal(
      await page
        .locator('[aria-label="玩法结算组分栏"] .c-script-editor-record-pagination')
        .count(),
      1
    );
    assert.match(
      await page
        .locator(
          '[aria-label="玩法结算组分栏"] .c-script-editor-record-pagination__status'
        )
        .textContent(),
      /第 3 \/ 3 页/
    );
    await page
      .locator(
        '[aria-label="玩法结算组卡片分页"] [data-script-editor-action="record-page-prev"]'
      )
      .click();
    await page.waitForTimeout(150);
    assert.equal(
      await page
        .locator('[aria-label="玩法结算组分栏"] .c-script-editor-minigame-list__route')
        .count(),
      3
    );

    assert.deepEqual(pageErrors, [], "Minigame pagination smoke should not raise uncaught page errors.");
  }
);

async function ensureMinigameCardsReachCount(page, addButtonSelector, cardSelector, targetCount) {
  let currentCount = await page.locator(cardSelector).count();
  while (currentCount < targetCount) {
    await page.locator(addButtonSelector).click();
    await page.waitForTimeout(120);
    currentCount += 1;
  }
}

async function selectedRecordId(page) {
  return page.evaluate(
    () =>
      document
        .querySelector("[data-script-editor-record-id].is-selected")
        ?.getAttribute("data-script-editor-record-id") ?? null
  );
}

function resolvePlaywrightModule() {
  const explicitPath =
    process.env.CODEX_PLAYWRIGHT_PATH ?? process.env.RPG_TG_PLAYWRIGHT_PATH;
  const candidateDirectories = [
    explicitPath,
    path.join(
      os.homedir(),
      ".cache",
      "codex-runtimes",
      "codex-primary-runtime",
      "dependencies",
      "node",
      "node_modules",
      "playwright"
    ),
  ].filter(Boolean);

  try {
    return require("playwright");
  } catch {}

  for (const candidateDirectory of candidateDirectories) {
    const packagePath = path.join(candidateDirectory, "package.json");
    if (fs.existsSync(packagePath)) {
      return require(candidateDirectory);
    }
  }

  return null;
}

async function launchChromium(playwright) {
  const chromeExecutablePath = resolveChromeExecutablePath();
  const baseLaunchOptions = {
    headless: true,
    args: ["--use-gl=swiftshader"],
  };

  if (chromeExecutablePath != null) {
    return playwright.chromium.launch({
      ...baseLaunchOptions,
      executablePath: chromeExecutablePath,
      args: [...baseLaunchOptions.args, "--no-sandbox"],
    });
  }

  return playwright.chromium.launch(baseLaunchOptions);
}

async function resolveAvailableDevServerUrl() {
  const candidates = [
    process.env.RPG_TG_DEV_SERVER_URL,
    "http://127.0.0.1:5173",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await requestOk(candidate);
      return candidate;
    } catch {}
  }

  return null;
}

function resolveChromeExecutablePath() {
  const candidates = [
    process.env.CODEX_CHROME_PATH,
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function resolveViteCliPath() {
  try {
    return require.resolve("vite/bin/vite.js");
  } catch {
    return path.join(process.cwd(), "node_modules", "vite", "bin", "vite.js");
  }
}

async function startViteDevServer(port) {
  const stdout = [];
  const stderr = [];
  const child = spawn(
    process.execPath,
    [resolveViteCliPath(), "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        BROWSER: "none",
      },
    }
  );

  child.stdout.on("data", (chunk) => {
    stdout.push(chunk.toString());
  });
  child.stderr.on("data", (chunk) => {
    stderr.push(chunk.toString());
  });

  await waitForServer(`http://127.0.0.1:${port}`);

  return {
    child,
    stdout,
    stderr,
  };
}

async function stopChildProcess(child) {
  if (child.exitCode != null) {
    return;
  }

  await new Promise((resolve) => {
    child.once("exit", () => resolve());
    child.kill("SIGTERM");
    setTimeout(() => {
      if (child.exitCode == null) {
        child.kill("SIGKILL");
      }
    }, 5000);
  });
}

function requestOk(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      response.resume();
      if (response.statusCode && response.statusCode >= 200 && response.statusCode < 500) {
        resolve();
        return;
      }
      reject(new Error(`Unexpected status code: ${response.statusCode}`));
    });
    request.on("error", reject);
  });
}

async function waitForServer(url, attempts = 120) {
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await requestOk(url);
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw lastError ?? new Error(`Unable to connect to ${url}`);
}

function pickFreePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
    server.on("error", reject);
  });
}
