const { app, BrowserWindow, Menu, net, protocol } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const APP_PROTOCOL = "rpgtg";
const APP_HOST = "app";
const APP_NAME = "朱元璋";

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
app.setName(APP_NAME);

function getDistRoot() {
  return path.join(__dirname, "..", "dist");
}

function resolveAppProtocolPath(requestUrl) {
  const url = new URL(requestUrl);
  const distRoot = getDistRoot();
  const requestedPath = decodeURIComponent(url.pathname || "/");
  const relativeRequestPath = requestedPath === "/" ? "index.html" : requestedPath.replace(/^[/\\]+/, "");
  const filePath = path.resolve(distRoot, relativeRequestPath);
  const relativeToDist = path.relative(distRoot, filePath);

  if (relativeToDist.startsWith("..") || path.isAbsolute(relativeToDist)) {
    return null;
  }

  return filePath;
}

function registerAppProtocol() {
  protocol.handle(APP_PROTOCOL, (request) => {
    const filePath = resolveAppProtocolPath(request.url);

    if (filePath == null) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return new Response("Not Found", { status: 404 });
    }

    return net.fetch(pathToFileURL(filePath).toString());
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: "#10131a",
    title: APP_NAME,
    icon: path.join(__dirname, "assets", "app-icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);
  window.loadURL(`${APP_PROTOCOL}://${APP_HOST}/index.html`);
}

app.whenReady().then(() => {
  registerAppProtocol();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
