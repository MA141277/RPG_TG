---
name: start-spine-plugin
description: 当用户要求“启动spine插件”“启动 Spine 插件”“打开骨骼绑定工具”或类似请求时，启动 RPG_TG 项目内 Spine 节点时间轴编辑器服务并说明用法。
---

# Start Spine Plugin

Use this skill when the user asks to start, open, run, or explain the project Spine plugin/tool.

The tool is:

```text
tools/spine-node-timeline-editor.html
```

The local URL is:

```text
http://localhost:5173/tools/spine-node-timeline-editor.html
```

## Required Workflow

1. Work from the repository root.
2. If dependencies are missing, run `npm install`.
3. Check whether port `5173` is already listening.
4. If it is not listening, start the dev server with:

```powershell
npm run dev:localhost
```

5. Prefer starting it in the background and writing logs to:

```text
dev-server-spine-plugin.out.log
dev-server-spine-plugin.err.log
```

6. Open or provide:

```text
http://localhost:5173/tools/spine-node-timeline-editor.html
```

7. Explain the basic usage and save rules from `docs/spine-plugin.md`.

## Windows PowerShell Commands

Check port:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -First 1 LocalAddress,LocalPort,OwningProcess
```

Install dependencies if `node_modules` is absent:

```powershell
npm install
```

Start hidden background server:

```powershell
Start-Process -FilePath 'npm.cmd' `
  -ArgumentList 'run','dev:localhost' `
  -WorkingDirectory '<repo-root>' `
  -RedirectStandardOutput '<repo-root>\dev-server-spine-plugin.out.log' `
  -RedirectStandardError '<repo-root>\dev-server-spine-plugin.err.log' `
  -WindowStyle Hidden
```

Then re-check port `5173`.

## Explanation To Give User

After the service is running, say:

- The tool is open at `http://localhost:5173/tools/spine-node-timeline-editor.html`.
- Use “新版” to load the current Faxian spine project.
- Use “绑定管理” to edit physical binding pose, 物块, and 骨骼绑定.
- In binding mode, left side has the 物块列表 and the two add-bone modes: 从节点添加骨骼 and 自由添加骨骼.
- New piece images must already exist under `src/faxian/leg/`; adding a piece asks for a filename relative to that folder.
- Export/copy JSON saves bones, timelines, bindings, piece transforms, and `leg:` image references, but not image file bytes.

## Guardrails

- Do not change project code just to start the tool.
- Do not kill an existing process on port `5173` unless the user explicitly asks.
- Do not start another server on a different port unless `5173` is occupied by an unrelated process and the user agrees.
- If the browser plugin is available, open the URL in the in-app browser and keep the tab for the user.
- If browser control is not available, provide the URL plainly.

