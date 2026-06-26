#!/usr/bin/env python3
import argparse
import base64
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
CHARACTER_DIR = ROOT / "character"
BUILDING_DIR = ROOT / "building"
SCENE_DIR = ROOT / "scene"


def ensure_dirs() -> None:
    CHARACTER_DIR.mkdir(parents=True, exist_ok=True)
    BUILDING_DIR.mkdir(parents=True, exist_ok=True)
    SCENE_DIR.mkdir(parents=True, exist_ok=True)


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def validate_asset_id(raw: str) -> str:
    s = (raw or "").strip()
    if not s:
        raise ValueError("缺少 id")
    if ".." in s or "/" in s or "\\" in s:
        raise ValueError("非法 id")
    if not re.match(r"^[\w\u4e00-\u9fff-]+$", s):
        raise ValueError("非法 id")
    return s


def slugify(text: str, fallback: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"[^\w\u4e00-\u9fff-]+", "-", text, flags=re.UNICODE)
    text = re.sub(r"-{2,}", "-", text).strip("-")
    return text or fallback


def unique_asset_id(kind_dir: Path, base_name: str) -> str:
    candidate = slugify(base_name, "asset")
    if not (kind_dir / candidate).exists():
      return candidate
    index = 2
    while True:
        next_id = f"{candidate}-{index}"
        if not (kind_dir / next_id).exists():
            return next_id
        index += 1


def data_url_to_bytes(data_url: str) -> tuple[bytes, str]:
    if not isinstance(data_url, str) or not data_url.startswith("data:"):
        raise ValueError("无效的 data URL")
    header, b64 = data_url.split(",", 1)
    mime = "application/octet-stream"
    if ";" in header:
        mime = header[5:].split(";", 1)[0] or mime
    return base64.b64decode(b64), mime


def write_data_url(target: Path, data_url: str) -> None:
    raw, _ = data_url_to_bytes(data_url)
    target.write_bytes(raw)


def fetch_remote_image_data_url(raw_url: str) -> dict:
    parsed = urlparse(str(raw_url or ""))
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("只允许 http/https 图片 URL")
    req = Request(
        raw_url,
        headers={
            "User-Agent": "PixelWfAssetApi/0.1",
            "Accept": "image/*,*/*;q=0.8",
        },
    )
    max_bytes = 20 * 1024 * 1024
    with urlopen(req, timeout=20) as res:
        mime = str(res.headers.get("Content-Type") or "").split(";", 1)[0].strip().lower()
        if not mime.startswith("image/"):
            raise ValueError(f"远程资源不是图片: {mime or 'unknown'}")
        raw = res.read(max_bytes + 1)
    if len(raw) > max_bytes:
        raise ValueError("图片过大，超过 20MB")
    b64 = base64.b64encode(raw).decode("ascii")
    return {
        "mime": mime,
        "dataUrl": f"data:{mime};base64,{b64}",
    }


def load_index(path: Path) -> list[dict]:
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []
    if isinstance(data, dict) and isinstance(data.get("items"), list):
        return data["items"]
    if isinstance(data, list):
        return data
    return []


def save_index(kind_dir: Path, items: list[dict]) -> None:
    index_path = kind_dir / "index.json"
    payload = {
        "updatedAt": now_iso(),
        "count": len(items),
        "items": items,
    }
    index_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def relative_to_root(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def normalize_character_entry(payload: dict) -> dict:
    ensure_dirs()
    title = payload.get("title") or "角色"
    asset_id = unique_asset_id(CHARACTER_DIR, title)
    asset_dir = CHARACTER_DIR / asset_id
    asset_dir.mkdir(parents=True, exist_ok=True)
    files = payload.get("files") or {}
    write_data_url(asset_dir / "sheet.png", files["sheetDataUrl"])
    if files.get("idleDataUrl"):
        write_data_url(asset_dir / "idle.png", files["idleDataUrl"])
    if files.get("previewDataUrl"):
        write_data_url(asset_dir / "preview.png", files["previewDataUrl"])
    meta = {
        "id": asset_id,
        "kind": "character",
        "title": title,
        "prompt": payload.get("prompt") or "",
        "tags": payload.get("tags") or [],
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
        "sourceModel": payload.get("sourceModel") or "",
        "imageSize": payload.get("imageSize") or "",
        "columns": payload.get("columns") or 6,
        "rows": payload.get("rows") or 5,
        "files": {
            "sheet": relative_to_root(asset_dir / "sheet.png"),
            "idle": relative_to_root(asset_dir / "idle.png") if (asset_dir / "idle.png").exists() else "",
            "preview": relative_to_root(asset_dir / "preview.png") if (asset_dir / "preview.png").exists() else "",
        },
    }
    (asset_dir / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    items = [item for item in load_index(CHARACTER_DIR / "index.json") if item.get("id") != asset_id]
    items.insert(0, meta)
    save_index(CHARACTER_DIR, items)
    return meta


def normalize_building_entry(payload: dict) -> dict:
    ensure_dirs()
    title = payload.get("title") or "建筑"
    asset_id = unique_asset_id(BUILDING_DIR, title)
    asset_dir = BUILDING_DIR / asset_id
    asset_dir.mkdir(parents=True, exist_ok=True)
    files = payload.get("files") or {}
    write_data_url(asset_dir / "front.png", files["frontDataUrl"])
    write_data_url(asset_dir / "side.png", files["sideDataUrl"])
    write_data_url(asset_dir / "top.png", files["topDataUrl"])
    if files.get("previewDataUrl"):
        write_data_url(asset_dir / "preview.png", files["previewDataUrl"])
    if files.get("previewProcessedDataUrl"):
        write_data_url(asset_dir / "preview-processed.png", files["previewProcessedDataUrl"])
    meta = {
        "id": asset_id,
        "kind": "building",
        "title": title,
        "prompt": payload.get("prompt") or "",
        "tags": payload.get("tags") or [],
        "widthTiles": payload.get("widthTiles"),
        "drawRoad": payload.get("drawRoad"),
        "facilityProfile": payload.get("facilityProfile") or None,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
        "sourceModel": payload.get("sourceModel") or "",
        "imageSize": payload.get("imageSize") or "",
        "voxelOptions": payload.get("voxelOptions") or {
            "targetLongest": 112,
            "shellOnly": True,
            "frontPriority": False,
        },
        "files": {
            "front": relative_to_root(asset_dir / "front.png"),
            "side": relative_to_root(asset_dir / "side.png"),
            "top": relative_to_root(asset_dir / "top.png"),
            "preview": relative_to_root(asset_dir / "preview.png") if (asset_dir / "preview.png").exists() else "",
            "previewProcessed": relative_to_root(asset_dir / "preview-processed.png") if (asset_dir / "preview-processed.png").exists() else "",
        },
    }
    (asset_dir / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    items = [item for item in load_index(BUILDING_DIR / "index.json") if item.get("id") != asset_id]
    items.insert(0, meta)
    save_index(BUILDING_DIR, items)
    return meta


def delete_character_entry(payload: dict) -> dict:
    ensure_dirs()
    asset_id = validate_asset_id(str(payload.get("id", "")))
    asset_dir = CHARACTER_DIR / asset_id
    existed = asset_dir.is_dir()
    if existed:
        shutil.rmtree(asset_dir)
    items = [item for item in load_index(CHARACTER_DIR / "index.json") if item.get("id") != asset_id]
    save_index(CHARACTER_DIR, items)
    return {"id": asset_id, "existed": existed}


def delete_building_entry(payload: dict) -> dict:
    ensure_dirs()
    asset_id = validate_asset_id(str(payload.get("id", "")))
    asset_dir = BUILDING_DIR / asset_id
    existed = asset_dir.is_dir()
    if existed:
        shutil.rmtree(asset_dir)
    items = [item for item in load_index(BUILDING_DIR / "index.json") if item.get("id") != asset_id]
    save_index(BUILDING_DIR, items)
    return {"id": asset_id, "existed": existed}


def update_building_entry(payload: dict) -> dict:
    ensure_dirs()
    asset_id = str(payload.get("id") or "").strip()
    if not asset_id:
        raise ValueError("缺少 id")
    meta_path = BUILDING_DIR / asset_id / "meta.json"
    if not meta_path.exists():
        raise ValueError("建筑不存在")
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    for key in ("tags", "widthTiles", "drawRoad"):
        if key in payload:
            meta[key] = payload.get(key)
    meta["updatedAt"] = now_iso()
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    items = [item for item in load_index(BUILDING_DIR / "index.json") if item.get("id") != asset_id]
    items.insert(0, meta)
    save_index(BUILDING_DIR, items)
    return meta


def normalize_scene_entry(payload: dict) -> dict:
    ensure_dirs()
    scene = payload.get("scene")
    if not isinstance(scene, dict):
        raise ValueError("缺少 scene")
    title = payload.get("title") or scene.get("title") or scene.get("id") or "场景"
    raw_id = payload.get("id") or scene.get("id") or title
    scene_id = validate_asset_id(str(raw_id))
    scene_dir = SCENE_DIR / scene_id
    scene_dir.mkdir(parents=True, exist_ok=True)

    meta_path = scene_dir / "meta.json"
    previous_meta = {}
    if meta_path.exists():
        try:
            previous_meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except Exception:
            previous_meta = {}

    created_at = previous_meta.get("createdAt") or now_iso()
    updated_at = now_iso()
    scene_payload = dict(scene)
    scene_payload["id"] = scene_id
    scene_payload["title"] = title
    scene_payload["updatedAt"] = updated_at
    scene_payload.setdefault("schemaVersion", 1)
    scene_payload.setdefault("entities", {})
    scene_payload.setdefault("extensions", {})

    runtime_path = scene_dir / "runtime.json"
    if runtime_path.exists():
        runtime_path.unlink()

    (scene_dir / "scene.json").write_text(
        json.dumps(scene_payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    objects = scene_payload.get("objects") if isinstance(scene_payload.get("objects"), list) else []
    entities = scene_payload.get("entities") if isinstance(scene_payload.get("entities"), dict) else {}
    meta = {
        "id": scene_id,
        "kind": "scene",
        "title": title,
        "createdAt": created_at,
        "updatedAt": updated_at,
        "schemaVersion": scene_payload.get("schemaVersion") or 1,
        "objectCount": len(objects),
        "buildingCount": len([o for o in objects if isinstance(o, dict) and o.get("model")]),
        "npcCount": len(entities.get("npcs") or []) if isinstance(entities.get("npcs"), list) else 0,
        "files": {
            "scene": relative_to_root(scene_dir / "scene.json"),
        },
    }
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    items = [item for item in load_index(SCENE_DIR / "index.json") if item.get("id") != scene_id]
    items.insert(0, meta)
    save_index(SCENE_DIR, items)
    return meta


def load_scene_entry(scene_id: str) -> dict:
    ensure_dirs()
    valid_id = validate_asset_id(scene_id)
    scene_dir = SCENE_DIR / valid_id
    scene_path = scene_dir / "scene.json"
    if not scene_path.exists():
        raise ValueError("场景不存在")
    data = json.loads(scene_path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("场景文件不是 JSON 对象")
    runtime_path = scene_dir / "runtime.json"
    if runtime_path.exists():
        runtime_data = json.loads(runtime_path.read_text(encoding="utf-8"))
        if isinstance(runtime_data, dict):
            if isinstance(runtime_data.get("entities"), dict):
                data["entities"] = runtime_data["entities"]
            if isinstance(runtime_data.get("extensions"), dict):
                data["extensions"] = runtime_data["extensions"]
            if runtime_data.get("updatedAt"):
                data["updatedAt"] = runtime_data["updatedAt"]
    return data


def update_scene_runtime_entry(payload: dict) -> dict:
    ensure_dirs()
    raw_id = payload.get("id")
    scene_id = validate_asset_id(str(raw_id or ""))
    scene_dir = SCENE_DIR / scene_id
    scene_path = scene_dir / "scene.json"
    if not scene_path.exists():
        raise ValueError("场景不存在")

    base_scene = json.loads(scene_path.read_text(encoding="utf-8"))
    if not isinstance(base_scene, dict):
        raise ValueError("场景文件不是 JSON 对象")

    entities = payload.get("entities")
    extensions = payload.get("extensions")
    if entities is None and extensions is None:
        raise ValueError("缺少 entities/extensions")
    if entities is not None and not isinstance(entities, dict):
        raise ValueError("entities 必须是对象")
    if extensions is not None and not isinstance(extensions, dict):
        raise ValueError("extensions 必须是对象")

    runtime_path = scene_dir / "runtime.json"
    runtime_data = {}
    if runtime_path.exists():
        try:
            runtime_data = json.loads(runtime_path.read_text(encoding="utf-8"))
        except Exception:
            runtime_data = {}
    if not isinstance(runtime_data, dict):
        runtime_data = {}

    updated_at = now_iso()
    if entities is not None:
        runtime_data["entities"] = entities
    if extensions is not None:
        runtime_data["extensions"] = extensions
    runtime_data["updatedAt"] = updated_at
    runtime_path.write_text(json.dumps(runtime_data, ensure_ascii=False, indent=2), encoding="utf-8")

    meta_path = scene_dir / "meta.json"
    previous_meta = {}
    if meta_path.exists():
        try:
            previous_meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except Exception:
            previous_meta = {}

    effective_entities = runtime_data.get("entities")
    if not isinstance(effective_entities, dict):
        effective_entities = base_scene.get("entities") if isinstance(base_scene.get("entities"), dict) else {}
    objects = base_scene.get("objects") if isinstance(base_scene.get("objects"), list) else []
    return {
        "id": scene_id,
        "kind": "scene",
        "title": base_scene.get("title") or previous_meta.get("title") or scene_id,
        "createdAt": previous_meta.get("createdAt") or base_scene.get("createdAt") or updated_at,
        "updatedAt": updated_at,
        "schemaVersion": base_scene.get("schemaVersion") or 1,
        "objectCount": len(objects),
        "buildingCount": len([o for o in objects if isinstance(o, dict) and o.get("model")]),
        "npcCount": len(effective_entities.get("npcs") or []) if isinstance(effective_entities.get("npcs"), list) else 0,
        "files": {
            "scene": relative_to_root(scene_dir / "scene.json"),
            "runtime": relative_to_root(runtime_path),
        },
    }


def delete_scene_entry(payload: dict) -> dict:
    ensure_dirs()
    scene_id = validate_asset_id(str(payload.get("id", "")))
    scene_dir = SCENE_DIR / scene_id
    existed = scene_dir.is_dir()
    if existed:
        shutil.rmtree(scene_dir)
    items = [item for item in load_index(SCENE_DIR / "index.json") if item.get("id") != scene_id]
    save_index(SCENE_DIR, items)
    return {"id": scene_id, "existed": existed}


class AssetApiHandler(BaseHTTPRequestHandler):
    server_version = "PixelWfAssetApi/0.1"

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._json(200, {"ok": True})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)
        if path == "/api/health":
            ensure_dirs()
            self._json(200, {"ok": True, "root": str(ROOT)})
            return
        if path == "/api/list-characters":
            ensure_dirs()
            self._json(200, {"items": load_index(CHARACTER_DIR / "index.json")})
            return
        if path == "/api/list-buildings":
            ensure_dirs()
            self._json(200, {"items": load_index(BUILDING_DIR / "index.json")})
            return
        if path == "/api/list-scenes":
            ensure_dirs()
            self._json(200, {"items": load_index(SCENE_DIR / "index.json")})
            return
        if path == "/api/load-scene":
            try:
                scene_id = (query.get("id") or [""])[0]
                self._json(200, {"ok": True, "scene": load_scene_entry(scene_id)})
            except Exception as exc:
                self._json(404, {"error": str(exc)})
            return
        self._json(404, {"error": "未知接口"})

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        content_length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8"))
        except Exception:
            self._json(400, {"error": "请求体不是合法 JSON"})
            return
        try:
            if path == "/api/save-character":
                item = normalize_character_entry(payload)
                self._json(200, {"ok": True, "item": item})
                return
            if path == "/api/save-building":
                item = normalize_building_entry(payload)
                self._json(200, {"ok": True, "item": item})
                return
            if path == "/api/update-building":
                item = update_building_entry(payload)
                self._json(200, {"ok": True, "item": item})
                return
            if path == "/api/save-scene":
                item = normalize_scene_entry(payload)
                self._json(200, {"ok": True, "item": item})
                return
            if path == "/api/update-scene-runtime":
                item = update_scene_runtime_entry(payload)
                self._json(200, {"ok": True, "item": item})
                return
            if path == "/api/fetch-image-data-url":
                data = fetch_remote_image_data_url(str(payload.get("url") or ""))
                self._json(200, {"ok": True, **data})
                return
            if path == "/api/delete-character":
                deleted = delete_character_entry(payload)
                self._json(200, {"ok": True, "id": deleted["id"]})
                return
            if path == "/api/delete-building":
                deleted = delete_building_entry(payload)
                self._json(200, {"ok": True, "id": deleted["id"]})
                return
            if path == "/api/delete-scene":
                deleted = delete_scene_entry(payload)
                self._json(200, {"ok": True, "id": deleted["id"]})
                return
            self._json(404, {"error": "未知接口"})
        except KeyError as exc:
            self._json(400, {"error": f"缺少字段: {exc}"})
        except Exception as exc:
            self._json(500, {"error": str(exc)})


def main() -> int:
    parser = argparse.ArgumentParser(description="Pixel workflow local asset API")
    parser.add_argument("--port", type=int, default=8766)
    args = parser.parse_args()
    ensure_dirs()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), AssetApiHandler)
    print(f"[asset-api] listening on http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
