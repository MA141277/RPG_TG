# Server Deployment

This project is a Vite-built static web game.

For your current deployment target, the recommended production path is:

- local development: `http://localhost:5173`
- Windows Server production: `http://159.75.153.83`

without adding a port suffix.

## Recommended Production Architecture

On Windows Server, the cleanest setup is IIS:

1. Build the static game into `dist/`
2. Publish `dist/` with an IIS-friendly `web.config`
3. Let IIS listen on port `80`
4. Use the built-in IIS service `W3SVC` as the long-running daemon

This avoids keeping a separate Node foreground process on port `80`.

## Local Development

Use:

```powershell
npm run dev:localhost
```

Default local URL:

```text
http://localhost:5173
```

## Local Production-Style Static Server

If you want to simulate production locally without IIS:

```powershell
npm run build
npm run serve:prod
```

Default local static URL:

```text
http://127.0.0.1:8080
```

This is only for verification. On Windows Server, prefer IIS for the real deployment.

## Windows Server Deployment

### 1. Publish The Build

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\server\publish-iis-dist.ps1
```

This does two things:

- runs `npm run build`
- writes `dist\web.config`

### 2. Install The IIS Site

Run an elevated PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\server\install-iis-site.ps1
```

Default values:

- site name: `RPG_TG`
- app pool: `RPG_TG`
- IP binding: `*`
- port: `80`
- host header: empty

That means the game can be reached directly from:

```text
http://159.75.153.83
```

if that IP points at the server and Windows Firewall allows inbound `80`.

### 3. Manage The Running Site

Use:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\server\manage-iis-site.ps1 -Action Status
powershell -ExecutionPolicy Bypass -File .\scripts\server\manage-iis-site.ps1 -Action Restart
```

`W3SVC` is the daemonized IIS service. The site is hosted under that service, so no extra custom watcher is required.

## Update Workflow

For later updates:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\server\publish-iis-dist.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\server\manage-iis-site.ps1 -Action Restart
```

## Optional Custom Binding

If you later want to bind a specific host header:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\server\install-iis-site.ps1 -HostHeader example.com
```

## Verification

After installation:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\server\manage-iis-site.ps1 -Action Status
```

Then verify in a browser:

```text
http://159.75.153.83
```

## Notes

- If port `80` is already occupied, free it before installing the IIS site.
- If IIS is not enabled yet, `install-iis-site.ps1` attempts to install `Web-Server`.
- The repository still contains Linux helper scripts, but for Windows Server the IIS path is the intended deployment route.
