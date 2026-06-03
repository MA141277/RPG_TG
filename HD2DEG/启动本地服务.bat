@echo off
chcp 65001 >nul
cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 python。请安装 Python 3 并勾选 Add to PATH，然后重新运行本脚本。
    pause
    exit /b 1
)

set PORT=8765
set API_PORT=8766
echo 正在清理旧服务进程（端口 %PORT% / %API_PORT%）...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ports=@(%PORT%,%API_PORT%); foreach($port in $ports){ Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { $ownerPid=$_.OwningProcess; try { $proc=Get-Process -Id $ownerPid -ErrorAction Stop; Write-Host ('停止旧服务 PID {0} ({1}) on port {2}' -f $ownerPid,$proc.ProcessName,$port); Stop-Process -Id $ownerPid -Force } catch {} } }"
echo.
echo 正在后台启动网页服务：http://127.0.0.1:%PORT%/pixel-workflow.html
echo 正在后台启动素材库服务：http://127.0.0.1:%API_PORT%/api/health
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Start-Process -WindowStyle Minimized -FilePath 'python' -ArgumentList '-m','http.server','%PORT%','--bind','127.0.0.1','--directory','%CD%' -WorkingDirectory '%CD%'"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Start-Process -WindowStyle Minimized -FilePath 'python' -ArgumentList 'local_asset_api.py','--port','%API_PORT%' -WorkingDirectory '%CD%'"

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/pixel-workflow.html"

echo.
echo 若浏览器没有画面，请按 F5 刷新，或手动打开上面的地址。
echo 停止服务：再次运行本脚本会先清理旧服务；也可在任务管理器里结束对应的 python 进程。
echo.
pause
