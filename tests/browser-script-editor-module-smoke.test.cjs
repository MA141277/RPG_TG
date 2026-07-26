const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

test(
  "browser smoke opens script editor and clicks each top-level creator module without page errors",
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

    const families = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-script-editor-family]")).map((node) => ({
        family: node.getAttribute("data-script-editor-family"),
        label: node.textContent?.replace(/\s+/g, " ").trim() ?? "",
      }))
    );

    assert.ok(families.length > 0, "Expected the script editor tree to expose top-level creator modules.");
    assert.ok(
      families.some((entry) => entry.family === "people"),
      "Expected the script editor tree to expose the people module."
    );
    assert.ok(
      families.some((entry) => entry.family === "stageConfiguration"),
      "Expected the script editor tree to expose the stage configuration module."
    );

    const clickResults = [];

    for (const entry of families) {
      await page.locator(`[data-script-editor-family="${entry.family}"]`).click();
      await page.waitForFunction(
        (family) => {
          const selectedFamily = document
            .querySelector(".c-script-editor-tree-node.is-selected")
            ?.getAttribute("data-script-editor-family");
          const stageText =
            document.querySelector(".c-script-editor-shell__editor-stage")?.textContent ?? "";
          return selectedFamily === family && stageText.trim().length > 0;
        },
        entry.family,
        { timeout: 10000 }
      );

      const result = await page.evaluate((family) => {
        const selectedFamily = document
          .querySelector(".c-script-editor-tree-node.is-selected")
          ?.getAttribute("data-script-editor-family");
        const stageText =
          document.querySelector(".c-script-editor-shell__editor-stage")?.textContent ?? "";
        return {
          family,
          selectedFamily,
          stageText: stageText.replace(/\s+/g, " ").trim().slice(0, 160),
        };
      }, entry.family);

      clickResults.push(result);
      assert.equal(
        result.selectedFamily,
        entry.family,
        `Expected clicking "${entry.label}" to select the "${entry.family}" module.`
      );
      assert.notEqual(
        result.stageText.length,
        0,
        `Expected clicking "${entry.label}" to render editor-stage content.`
      );
    }

    assert.deepEqual(pageErrors, [], "Script editor module smoke should not raise uncaught page errors.");
    assert.equal(clickResults.length, families.length);
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

  try {
    return await playwright.chromium.launch(baseLaunchOptions);
  } catch (error) {
    throw error;
  }
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
