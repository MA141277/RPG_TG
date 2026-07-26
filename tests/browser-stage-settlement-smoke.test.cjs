const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

const FIXTURE_DIRECTORY = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "scenario-packs",
  "browser-stage-settlement-smoke"
);

const EXPECTED_PACK_ID = "scenario-pack.browser.progression-smoke";
const EXPECTED_PLAYER_ID = "char.browser.smoke";
const EXPECTED_CITY_ID = "city.browser.smoke";
const EXPECTED_EVENT_ID = "event.progression.training";
const EXPECTED_TRACK_ID = "track.cultivation";
const EXPECTED_HOST_KEY = `person:${EXPECTED_PLAYER_ID}`;
const EXPECTED_TIER_ID = "tier.2";

test(
  "browser smoke imports a scenario pack and verifies stage settlement runtime convergence",
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
    const dialogMessages = [];
    const pageErrors = [];

    page.on("dialog", async (dialog) => {
      dialogMessages.push(dialog.message());
      await dialog.dismiss();
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(appUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.locator('[data-main-ui-action="open-json-scenario-select"]').click();
    await page.locator('[data-main-ui-scenario-file]').setInputFiles(FIXTURE_DIRECTORY);

    await page.waitForFunction(
      ({ expectedPackId, expectedPlayerId, expectedTrackId, expectedHostKey, expectedTierId, expectedEventId }) => {
        const snapshot = window.__rpgTgTest?.getRuntimeSnapshot?.();
        const trackState =
          snapshot?.progression?.trackStatesByHostKey?.[expectedHostKey]?.[
            expectedTrackId
          ];
        const eventHistory = snapshot?.eventHistory?.[expectedEventId];

        return (
          snapshot?.activePackId === expectedPackId &&
          snapshot?.currentPlayerCharacterId === expectedPlayerId &&
          snapshot?.playerCharacter?.stamina === 105 &&
          trackState?.currentTierId === expectedTierId &&
          eventHistory?.firedCount === 1
        );
      },
      {
        expectedPackId: EXPECTED_PACK_ID,
        expectedPlayerId: EXPECTED_PLAYER_ID,
        expectedTrackId: EXPECTED_TRACK_ID,
        expectedHostKey: EXPECTED_HOST_KEY,
        expectedTierId: EXPECTED_TIER_ID,
        expectedEventId: EXPECTED_EVENT_ID,
      },
      { timeout: 60000 }
    );

    const snapshot = await page.evaluate(() =>
      window.__rpgTgTest.getRuntimeSnapshot()
    );
    const trackState =
      snapshot.progression?.trackStatesByHostKey?.[EXPECTED_HOST_KEY]?.[
        EXPECTED_TRACK_ID
      ] ?? null;

    assert.deepEqual(dialogMessages, [], "Scenario import should not surface alert dialogs.");
    assert.deepEqual(pageErrors, [], "Browser smoke should not raise uncaught page errors.");
    assert.equal(snapshot.activePackId, EXPECTED_PACK_ID);
    assert.equal(snapshot.currentPlayerCharacterId, EXPECTED_PLAYER_ID);
    assert.equal(snapshot.currentCityId, EXPECTED_CITY_ID);
    assert.equal(snapshot.playerCharacter?.stamina, 105);
    assert.equal(
      snapshot.eventHistory?.[EXPECTED_EVENT_ID]?.firedCount,
      1,
      "Expected the authored settlement event to execute exactly once."
    );
    assert.equal(trackState?.currentTierId, EXPECTED_TIER_ID);
    assert.equal(
      trackState?.metricValue,
      100,
      "Expected the stage metric to be evaluated from the post-settlement value."
    );
  }
);

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

function resolveViteCliPath() {
  try {
    return require.resolve("vite/bin/vite.js");
  } catch {
    return path.join(process.cwd(), "node_modules", "vite", "bin", "vite.js");
  }
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
