# RPG_TG

RPG_TG is a Vite-based browser game project.

## Local Development

Run the game locally with Vite and keep HMR on `localhost`:

```powershell
npm run dev:localhost
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

## Server Deployment

If the server is a Windows Server machine at `159.75.153.83` and should be reachable without a port suffix, use the deployment workflow documented here:

[docs/server-deployment.md](/D:/RPG_TG/docs/server-deployment.md)

That workflow keeps:

- local debugging on `http://localhost:5173`
- production access on `http://159.75.153.83`

by combining:

- local Vite development on `localhost`
- IIS on Windows Server bound to port `80`
