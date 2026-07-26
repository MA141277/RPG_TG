const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

test(
  "browser smoke exercises deep script editor creator actions without page errors",
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
    await page.locator('[data-main-ui-action="open-script-editor"]').click();
    await page.locator('[data-script-editor-action="import-pack"]').click();
    await page.waitForSelector(".c-script-editor-shell", { timeout: 30000 });

    await page.locator('[data-script-editor-family="storyNodes"]').click();
    await page.locator('[data-script-editor-action="add-record"]').click();
    await page.waitForTimeout(150);
    await page
      .locator(
        '[data-script-editor-action="select-narrative-tab"][data-script-editor-narrative-tab="links"]'
      )
      .click();
    await page.waitForTimeout(150);
    const storyRelationCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-story-related-people"]')
      .count();
    await page.locator('[data-script-editor-action="add-story-related-people"]').click();
    await page.waitForTimeout(150);
    const storyRelationCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-story-related-people"]')
      .count();
    assert.equal(storyRelationCountAfterAdd, storyRelationCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="remove-story-related-people"]').last().click();
    await page.waitForTimeout(150);
    const storyRelationCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-story-related-people"]')
      .count();
    assert.equal(storyRelationCountAfterRemove, storyRelationCountBeforeAdd);
    await page.locator('[data-script-editor-action="remove-record"]').click();
    await page.waitForTimeout(150);

    await page.locator('[data-script-editor-family="people"]').click();
    await page.locator('[data-script-editor-action="add-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "110001");
    const personAttributeCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-person-attribute"]')
      .count();
    await page.locator('[data-script-editor-action="add-person-attribute"]').click();
    await page.waitForTimeout(150);
    const personAttributeCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-person-attribute"]')
      .count();
    assert.equal(personAttributeCountAfterAdd, personAttributeCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="remove-person-attribute"]').last().click();
    await page.waitForTimeout(150);
    const personAttributeCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-person-attribute"]')
      .count();
    assert.equal(personAttributeCountAfterRemove, personAttributeCountBeforeAdd);
    await page.locator('[data-script-editor-action="remove-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "char.player");

    await page.locator('[data-script-editor-family="cities"]').click();
    await page.waitForTimeout(150);
    assert.notEqual(await selectedRecordId(page), null);
    await page
      .locator(
        '[data-script-editor-action="select-location-tab"][data-script-editor-location-tab="menus"]'
      )
      .click();
    await page.waitForTimeout(150);
    const cityMenuCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-location-menu-entry"]')
      .count();
    await page.locator('[data-script-editor-action="add-location-menu-entry"]').click();
    await page.waitForTimeout(150);
    const cityMenuCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-location-menu-entry"]')
      .count();
    assert.equal(cityMenuCountAfterAdd, cityMenuCountBeforeAdd + 1);
    assert.equal(
      (await page.locator("[data-script-editor-location-menu-instance-id]").count()) > 0,
      true
    );
    const cityMenuLabelInput = page
      .locator('[data-script-editor-location-menu-field="label"]')
      .last();
    await cityMenuLabelInput.fill("Smoke Menu Entry");
    await page.waitForTimeout(150);
    assert.equal(await cityMenuLabelInput.inputValue(), "Smoke Menu Entry");
    await page
      .locator('[data-script-editor-location-menu-field="targetFamily"]')
      .last()
      .selectOption("event");
    await page.waitForTimeout(150);
    assert.equal(
      await page
        .locator('[data-script-editor-location-menu-field="targetFamily"]')
        .last()
        .inputValue(),
      "event"
    );
    await page.locator('[data-script-editor-action="remove-location-menu-entry"]').last().click();
    await page.waitForTimeout(150);
    const cityMenuCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-location-menu-entry"]')
      .count();
    assert.equal(cityMenuCountAfterRemove, cityMenuCountBeforeAdd);

    await page.locator('[data-script-editor-family="dialogues"]').click();
    await page.locator('[data-script-editor-action="add-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "410001");
    const dialogueParticipantCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-dialogue-participants"]')
      .count();
    await page.locator('[data-script-editor-action="add-dialogue-participants"]').click();
    await page.waitForTimeout(150);
    const dialogueParticipantCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-dialogue-participants"]')
      .count();
    assert.equal(dialogueParticipantCountAfterAdd, dialogueParticipantCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="remove-dialogue-participants"]').last().click();
    await page.waitForTimeout(150);
    const dialogueParticipantCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-dialogue-participants"]')
      .count();
    assert.equal(dialogueParticipantCountAfterRemove, dialogueParticipantCountBeforeAdd);
    await page
      .locator(
        '[data-script-editor-action="select-narrative-tab"][data-script-editor-narrative-tab="nodes"]'
      )
      .click();
    await page.waitForTimeout(150);
    const dialogueNodeCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-dialogue-node"]')
      .count();
    await page.locator('[data-script-editor-action="add-dialogue-node"]').click();
    await page.waitForTimeout(150);
    const dialogueNodeCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-dialogue-node"]')
      .count();
    assert.equal(dialogueNodeCountAfterAdd, dialogueNodeCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="remove-dialogue-node"]').last().click();
    await page.waitForTimeout(150);
    const dialogueNodeCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-dialogue-node"]')
      .count();
    assert.equal(dialogueNodeCountAfterRemove, dialogueNodeCountBeforeAdd);
    await page.locator('[data-script-editor-action="remove-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "scene.story.zhu_yuanzhang.ordination");

    await page.locator('[data-script-editor-family="events"]').click();
    await page.locator('[data-script-editor-action="add-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "460001");
    const eventRelationCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-event-related-people"]')
      .count();
    await page.locator('[data-script-editor-action="add-event-related-people"]').click();
    await page.waitForTimeout(150);
    const eventRelationCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-event-related-people"]')
      .count();
    assert.equal(eventRelationCountAfterAdd, eventRelationCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="remove-event-related-people"]').last().click();
    await page.waitForTimeout(150);
    const eventRelationCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-event-related-people"]')
      .count();
    assert.equal(eventRelationCountAfterRemove, eventRelationCountBeforeAdd);
    await page.locator('[data-script-editor-event-field="type"]').selectOption("settlement");
    await page.waitForTimeout(150);
    assert.equal(
      await page.locator('[data-script-editor-event-field="type"]').inputValue(),
      "settlement"
    );
    await page.locator('[data-script-editor-action="remove-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "event.story.zhu_yuanzhang.ordination");

    await page.locator('[data-script-editor-family="settlements"]').click();
    await page.locator('[data-script-editor-action="add-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), "240001");
    assert.equal(
      await page.locator('[data-script-editor-settlement-field="title"]').inputValue(),
      "结算 1"
    );
    const settlementContentCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-settlement-content"]')
      .count();
    await page.locator('[data-script-editor-action="add-settlement-content"]').click();
    await page.waitForTimeout(150);
    const settlementContentCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-settlement-content"]')
      .count();
    assert.equal(settlementContentCountAfterAdd, settlementContentCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="remove-settlement-content"]').last().click();
    await page.waitForTimeout(150);
    const settlementContentCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-settlement-content"]')
      .count();
    assert.equal(settlementContentCountAfterRemove, settlementContentCountBeforeAdd);
    await page.locator('[data-script-editor-action="remove-record"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), null);

    await page.locator('[data-script-editor-family="stageConfiguration"]').click();
    await page.locator('[data-script-editor-action="open-stage-configuration-help"]').click();
    await page.waitForTimeout(150);
    assert.equal(
      await page.locator(".c-script-editor-stage-configuration-help").count(),
      1
    );
    await page
      .locator('[data-script-editor-action="close-stage-configuration-help"]')
      .nth(1)
      .click();
    await page.waitForTimeout(150);
    assert.equal(
      await page.locator(".c-script-editor-stage-configuration-help").count(),
      0
    );
    await page.locator('[data-script-editor-action="add-stage-configuration-binding"]').click();
    await page.waitForTimeout(150);
    assert.notEqual(await selectedRecordId(page), null);
    await page.locator('[data-script-editor-action="add-stage-configuration-track"]').click();
    await page.waitForTimeout(150);
    assert.equal(
      await page.locator('[data-script-editor-action="remove-stage-configuration-track"]').count(),
      1
    );
    const stageTierCountBeforeAdd = await page
      .locator('[data-script-editor-action="remove-progress-track-tier"]')
      .count();
    await page.locator('[data-script-editor-action="add-progress-track-tier"]').click();
    await page.waitForTimeout(150);
    const stageTierCountAfterAdd = await page
      .locator('[data-script-editor-action="remove-progress-track-tier"]')
      .count();
    assert.equal(stageTierCountAfterAdd, stageTierCountBeforeAdd + 1);
    await page.locator('[data-script-editor-action="preview-runtime"]').click();
    await page.waitForTimeout(200);
    assert.match(
      await page.locator(".c-script-editor-workflow__notice").textContent(),
      /metricKey/i
    );
    await page.locator('[data-script-editor-action="remove-progress-track-tier"]').last().click();
    await page.waitForTimeout(150);
    const stageTierCountAfterRemove = await page
      .locator('[data-script-editor-action="remove-progress-track-tier"]')
      .count();
    assert.equal(stageTierCountAfterRemove, stageTierCountBeforeAdd);
    await page.locator('[data-script-editor-action="remove-stage-configuration-track"]').click();
    await page.waitForTimeout(150);
    await page.locator('[data-script-editor-action="remove-stage-configuration-binding"]').click();
    await page.waitForTimeout(150);
    assert.equal(await selectedRecordId(page), null);

    assert.deepEqual(pageErrors, [], "Deep script editor actions should not raise uncaught page errors.");
  }
);

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
    stdout.push(String(chunk));
  });
  child.stderr.on("data", (chunk) => {
    stderr.push(String(chunk));
  });

  await waitForServerReady({
    child,
    port,
    stdout,
    stderr,
  });

  return { child, stdout, stderr };
}

async function waitForServerReady({ child, port, stdout, stderr }) {
  const startedAt = Date.now();
  const timeoutMs = 30000;

  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode != null) {
      throw new Error(
        `Vite dev server exited early with code ${child.exitCode}.\nstdout:\n${stdout.join("")}\nstderr:\n${stderr.join("")}`
      );
    }

    try {
      await requestOk(`http://127.0.0.1:${port}`);
      return;
    } catch {
      await delay(250);
    }
  }

  throw new Error(
    `Timed out waiting for Vite dev server on port ${port}.\nstdout:\n${stdout.join("")}\nstderr:\n${stderr.join("")}`
  );
}

function requestOk(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      response.resume();
      if ((response.statusCode ?? 500) < 500) {
        resolve();
        return;
      }
      reject(new Error(`Unexpected status ${response.statusCode}`));
    });

    request.on("error", reject);
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function stopChildProcess(child) {
  if (child.exitCode != null) {
    return;
  }

  child.kill("SIGTERM");
  const stopped = await Promise.race([
    new Promise((resolve) => {
      child.once("exit", resolve);
    }),
    delay(5000).then(() => false),
  ]);

  if (stopped === false && child.exitCode == null) {
    child.kill("SIGKILL");
    await new Promise((resolve) => {
      child.once("exit", resolve);
    });
  }
}

async function pickFreePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address == null || typeof address === "string") {
        reject(new Error("Failed to allocate a free TCP port."));
        return;
      }
      const { port } = address;
      server.close((error) => {
        if (error != null) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    server.on("error", reject);
  });
}
