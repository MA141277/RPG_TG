# RPG_TG

RPG_TG is a Vite-based browser game project.

## Local Development

Run the game locally with Vite and keep HMR on `localhost`:

```powershell
npm run dev:localhost
```

If `npm` is not available in the current PowerShell session, use the repository
launcher instead:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dev-localhost.ps1
```

Default local URL:

```text
http://localhost:5173
```

## Build

Create the production bundle:

```powershell
npm run build
```

## Local Production-Style Serving

Serve the built `dist/` folder with the repository static server:

```powershell
npm run serve:prod
```

Default local production-style URL:

```text
http://127.0.0.1:8080
```

## Standalone Background Service

If you want the built game to run as a separate background process on Windows, use:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\standalone-service.ps1 -Action start
```

Common commands:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\standalone-service.ps1 -Action status
powershell -ExecutionPolicy Bypass -File .\scripts\standalone-service.ps1 -Action stop
```

Convenience start-only wrapper:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-standalone-service.ps1
```

Default standalone URL:

```text
http://localhost:8080
```

Runtime files are written under `.runtime/`.

## Server Deployment

If the server is a Windows Server machine at `159.75.153.83` and should be reachable without a port suffix, use the deployment workflow documented here:

[docs/server-deployment.md](/D:/RPG_TG/docs/server-deployment.md)

That workflow keeps:

- local debugging on `http://localhost:5173`
- production access on `http://159.75.153.83`

by combining:

- local Vite development on `localhost`
- IIS on Windows Server bound to port `80`
