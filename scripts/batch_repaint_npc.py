# -*- coding: utf-8 -*-
"""Batch repaint NPC portraits with OpenAI image edits.

Default paths are tuned for this repository:

    python scripts\batch_repaint_npc.py --limit 3
"""

from __future__ import annotations

import argparse
import base64
import sys
import time
import urllib.request
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Callable, Iterable, Sequence

from PIL import Image


DEFAULT_INPUT_DIR = Path(r"C:\RPG_TG\ui\npc")
DEFAULT_OUTPUT_DIR = Path(r"C:\RPG_TG\ui\npc1")
DEFAULT_STYLE_IMAGE = DEFAULT_OUTPUT_DIR / "upload_1785120162867965862.png"

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
JPEG_EXTENSIONS = {".jpg", ".jpeg"}

DEFAULT_BASE_URL = "https://epone.ggb.today/v1"
DEFAULT_MODEL = "gpt-image-2-dev"
DEFAULT_QUALITY = "high"
DEFAULT_SIZE = "auto"
DEFAULT_RETRIES = 3
DEFAULT_RETRY_DELAY_SECONDS = 5.0
FOREGROUND_SCALE_MULTIPLIER = 1.04
FOREGROUND_PADDING = 8

REPAINT_PROMPT = """基于原角色图和风格参考图进行定向重绘。原角色图用于决定角色身份、脸型五官、年龄气质、服装大形、姿态、半身像构图、主色关系和原本饱和度；风格参考图只用于参考画风语言、笔触处理、线稿虚实、明暗概括方式和画面干净程度，禁止复制风格参考图的人物身份、服装、五官、年龄、表情和配饰。

画风目标：更接近风格参考图的古风人物游戏立绘插画，融合中国传统人物画的线面关系、工笔人物画的结构控制、现代国风动画概念设计感和高完成度游戏角色立绘的干净完成度。整体必须是插画感、概括块面感、角色设定图感和游戏立绘感，五官和皮肤处理要图形化、线面化、块面化，不要真人照片感，不要写实照片质感，不要真实肖像摄影感。颜色饱和度和当前柔和配色感保持原图，不要整体降饱和，不要变灰暗，不要变淡。画面是纯白色背景，保留必要呼吸感但不要明显四周白边或二次边框，主体撑满程度接近原图，视觉中心明确。

线稿要求：勾线必须参照风格参考图，线条要更有特色，使用干净利落、粗细变化明确的东方勾线，轮廓线简洁有力，边缘必须有清楚的勾线和形体收束。外轮廓线应比内部线更明确，使用偏深棕/灰褐/深墨色，不要纯黑硬描边；线条要有提按变化、顿挫感和虚实变化，转折处可以更重，受光边和次要边可以减弱，方圆转折要稍微更硬朗。内部衣服必须像外轮廓一样有粗细变化明确的东方勾线：衣领、门襟、袖口、腰带、布料折线、主要褶皱、饰品边缘都要用干净线条组织，线条有粗细、轻重、方圆和顿挫变化；衣服内部结构线要清楚可见、连续但不过密，不能只有外轮廓有线，不能让衣服内部变成无结构的淡色雾面。面部、衣褶、发丝、配饰的内线比外轮廓略细，但仍要有明确设计感，整体像参考图和尚一样有特色的中国风线描语言，而不是软糊无边缘，也不是硬边赛璐璐或厚重黑边。

明暗和高光要求：明暗交界线必须清晰，阴影要比当前结果更概括、更成片，笔触更概括，减少碎散过渡、真人皮肤细节和雾化灰面；使用大色块组织体积，衣服褶皱、脸部骨相、帽子/头发暗面都用清楚的大块阴影归纳。脸部明暗对比要更明显，鼻梁、眼窝、颧骨、嘴角、下颌的明暗交界线要清晰，用概括块面表达骨相，不要照片式细碎渐变。明暗交界线要清晰，暗部边界明确但不过分锐利，像游戏立绘里的概括块面，而不是照片式柔焦渐变。面部用骨相转折、鼻梁、颧骨、眼窝、下颌等中等面积色块塑造，边界清楚但不过分锐利；减少毛孔、细纹、真实摄影皮肤质感，减少真实老人照片式皱纹和皮肤微细节，把五官转译为插画块面和线条。高光是低亮度、低面积、柔和的结构性块面高光，不要油亮反光，不要零碎亮点。暗部不要纯黑，皮肤暗部用暖棕、赭棕、橄榄灰棕等通透阴影；服装暗部根据原色相使用偏灰的深色系，但不要让整体发灰。

笔触和质感要求：保留参考图里轻微、低频、成片的手绘笔触和半透明刷痕，衣服和皮肤可以有柔和叠色感；笔触要更概括、更成片，减少碎散小笔触，用少量明确的大笔触概括衣服褶皱、脸部转折和暗部形状；不要厚涂，不要油画肌理，不要粗糙颗粒，不要水墨飞白，不要脏污旧纸质感。衣服褶皱用大形和少量柔和线条表现，不要密集小线条，不要复杂小装饰。

构图要求：只生成半身像，统一控制在腰部以上，腰部以上的人物信息不能丢失，保持原图半身像取景范围、头身比例、肩宽比例、人物在画布中的位置和人物占画面比例。生成后的人物主体尺寸大小必须和原图一样，人物宽度、高度、肩部范围、头部大小都要接近原图，不能缩小，不能额外放大到超过原图主体范围，不能留出比原图更多的大面积空白，不要产生内嵌小画框或二次白底边框，图片底部不要有空白边，人物下缘应贴近画布底部或与原图下缘位置一致，不要四周白边过多，不要裁成头像，不要拉伸人物比例，不要放大到过满，不要改变角色核心设计。

整体画面必须干净，平滑，统一，强调大色块叙事和整体轮廓，不要细节化噪点，不要高频纹理，不要脏污颗粒，不要密集小装饰，表面干净，边缘利落，画面呼吸感强，一目了然。

反向约束：不要软糊无边缘，不要缺少轮廓线，不要只有外轮廓线而衣服内部没线，不要衣服内部无勾线，不要衣服内部无粗细变化，不要衣服内部无结构，不要线条全都一样细，不要过于圆滑软弱的线条，不要真人照片感，不要写实摄影质感，不要真实肖像摄影感，不要毛孔细纹，不要真实老人照片式皮肤细节，不要脸部明暗太平，不要脸部细碎照片渐变，不要过淡无对比，不要雾化灰面，不要照片式柔焦渐变，不要人物缩小，不要人物额外放大到超过原图主体范围，不要主体尺寸偏离原图，不要留白过多，不要四周白边过多，不要底部空白边，不要丢失腰部以上人物信息，不要内嵌小画框，不要二次白底边框，不要硬黑描边，不要粗重漫画外轮廓，不要赛璐璐硬边，不要过度锐化，不要线条过硬，不要过强对比，不要厚涂，不要油画风，不要照片写实质感，不要欧美油画风，不要低饱和度全水墨画风，不要灰色调立绘，不要画面发灰暗沉，不要水墨晕染，不要飞白，不要旧纸颗粒，不要纯黑死阴影，不要油亮高光，不要零碎亮点，不要高频纹理，不要噪点，不要颗粒感，不要脏污感，不要复杂小装饰，不要密集花纹，不要过度细节化，不要凌乱背景，不要改变角色身份，不要改变半身像构图，不要把半身裁成头像，不要拉伸人物比例。"""


@dataclass(frozen=True)
class ImageJob:
    source: Path
    output: Path


@dataclass(frozen=True)
class Failure:
    source: Path
    error: str
    attempts: int


@dataclass(frozen=True)
class ProcessSummary:
    total: int
    processed: int
    failed: list[Failure]


Editor = Callable[[Path, Path, str, str, str, str, str, str], bytes]


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Batch repaint NPC images with OpenAI image edits.",
    )
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--style-image", type=Path, default=DEFAULT_STYLE_IMAGE)
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing output files.")
    parser.add_argument("--limit", type=positive_int, default=None, help="Only process the first N pending images.")
    parser.add_argument("--dry-run", action="store_true", help="Print planned work without calling the API.")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"OpenAI-compatible API base URL. Default: {DEFAULT_BASE_URL}")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"OpenAI image model. Default: {DEFAULT_MODEL}")
    parser.add_argument(
        "--quality",
        default=DEFAULT_QUALITY,
        choices=("low", "medium", "high", "auto", "standard"),
        help=f"Image generation quality. Default: {DEFAULT_QUALITY}",
    )
    parser.add_argument("--size", default=DEFAULT_SIZE, help=f"Requested API output size. Default: {DEFAULT_SIZE}")
    parser.add_argument("--retries", type=positive_int, default=DEFAULT_RETRIES)
    parser.add_argument("--retry-delay", type=non_negative_float, default=DEFAULT_RETRY_DELAY_SECONDS)
    return parser.parse_args(argv)


def positive_int(value: str) -> int:
    parsed = int(value)
    if parsed <= 0:
        raise argparse.ArgumentTypeError("must be a positive integer")
    return parsed


def non_negative_float(value: str) -> float:
    parsed = float(value)
    if parsed < 0:
        raise argparse.ArgumentTypeError("must be non-negative")
    return parsed


def build_jobs(
    input_dir: Path,
    output_dir: Path,
    style_image: Path,
    overwrite: bool,
    limit: int | None,
) -> list[ImageJob]:
    style_resolved = style_image.resolve()
    jobs: list[ImageJob] = []

    for source in iter_image_files(input_dir):
        if is_touxiang_image(source):
            print(f"[skip touxiang] {source}")
            continue

        output = output_dir / source.name
        if path_matches(source, style_resolved) or path_matches(output, style_resolved):
            print(f"[skip style] {source}")
            continue
        if output.exists() and not overwrite:
            print(f"[skip exists] {output}")
            continue

        jobs.append(ImageJob(source=source, output=output))
        if limit is not None and len(jobs) >= limit:
            break

    return jobs


def iter_image_files(input_dir: Path) -> Iterable[Path]:
    for path in sorted(input_dir.iterdir(), key=lambda item: item.name.lower()):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path


def path_matches(path: Path, resolved_target: Path) -> bool:
    try:
        return path.resolve() == resolved_target
    except FileNotFoundError:
        return path.absolute() == resolved_target


def is_touxiang_image(path: Path) -> bool:
    return "touxiang" in path.stem.lower()


def process_jobs(
    jobs: Sequence[ImageJob],
    style_image: Path,
    prompt: str,
    editor: Editor,
    dry_run: bool,
    retries: int,
    retry_delay: float,
    model: str = DEFAULT_MODEL,
    quality: str = DEFAULT_QUALITY,
    size: str = DEFAULT_SIZE,
    base_url: str = DEFAULT_BASE_URL,
) -> ProcessSummary:
    processed = 0
    failures: list[Failure] = []
    total = len(jobs)

    for index, job in enumerate(jobs, start=1):
        print(f"[{index}/{total}] {job.source.name} -> {job.output}")
        if dry_run:
            print(f"[dry-run] would process {job.source}")
            continue

        output_format = output_format_for_path(job.output)
        last_error: BaseException | None = None
        for attempt in range(1, retries + 1):
            try:
                image_bytes = editor(
                    job.source,
                    style_image,
                    prompt,
                    output_format,
                    model,
                    quality,
                    size,
                    base_url,
                )
                save_generated_image(image_bytes, job.output, job.source)
                processed += 1
                print(f"[ok] saved {job.output}")
                break
            except BaseException as error:
                last_error = error
                print(f"[retry {attempt}/{retries}] {job.source.name}: {error}")
                if attempt < retries and retry_delay > 0:
                    time.sleep(retry_delay)
        else:
            failures.append(
                Failure(
                    source=job.source,
                    error=str(last_error) if last_error is not None else "unknown error",
                    attempts=retries,
                )
            )
            print(f"[failed] {job.source.name}")

    return ProcessSummary(total=total, processed=processed, failed=failures)


def openai_image_edit(
    source_path: Path,
    style_image_path: Path,
    prompt: str,
    output_format: str,
    model: str,
    quality: str,
    size: str,
    base_url: str,
) -> bytes:
    from openai import OpenAI

    client_kwargs: dict[str, object] = {}
    if base_url:
        client_kwargs["base_url"] = base_url
    client = OpenAI(**client_kwargs)
    kwargs: dict[str, object] = {
        "model": model,
        "image": [],
        "prompt": prompt,
        "background": "opaque",
        "output_format": output_format,
        "quality": quality,
        "size": size,
    }
    if supports_input_fidelity(model):
        kwargs["input_fidelity"] = "high"

    with source_path.open("rb") as source_file, style_image_path.open("rb") as style_file:
        kwargs["image"] = [source_file, style_file]
        result = client.images.edit(**kwargs)

    return extract_image_bytes(result)


def supports_input_fidelity(model: str) -> bool:
    normalized = model.lower()
    return normalized in {"gpt-image-1", "gpt-image-1.5"}


def extract_image_bytes(result: object) -> bytes:
    data = getattr(result, "data", None)
    if not data:
        raise RuntimeError(
            "OpenAI image edit response did not include data; "
            f"response summary: {summarize_response(result)}"
        )

    first = data[0]
    image_base64 = getattr(first, "b64_json", None)
    if image_base64:
        return base64.b64decode(image_base64)

    image_url = getattr(first, "url", None)
    if image_url:
        with urllib.request.urlopen(image_url, timeout=120) as response:
            return response.read()

    raise RuntimeError(
        "OpenAI image edit response did not include b64_json or url; "
        f"first item summary: {summarize_response(first)}"
    )


def summarize_response(result: object) -> str:
    """Return safe response shape details without dumping image bytes."""
    if hasattr(result, "model_dump"):
        payload = result.model_dump()
        if isinstance(payload, dict):
            fields = []
            for key, value in payload.items():
                if value in (None, [], {}):
                    continue
                fields.append(f"{key}={type(value).__name__}")
            return ", ".join(fields) or "empty model_dump"

    attrs = []
    for key in ("data", "created", "usage", "error", "message", "id", "object"):
        if hasattr(result, key):
            value = getattr(result, key)
            if value not in (None, [], {}):
                attrs.append(f"{key}={type(value).__name__}")
    return ", ".join(attrs) or type(result).__name__



def save_generated_image(image_bytes: bytes, output_path: Path, source_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(BytesIO(image_bytes)) as generated, Image.open(source_path) as source:
        target_size = source.size
        image = flatten_to_white(generated)
        source_canvas = flatten_to_white(source)
        if image.size != target_size or foreground_bbox(image) != foreground_bbox(source_canvas):
            image = match_foreground_to_source_canvas(image, source_canvas)

        suffix = output_path.suffix.lower()
        if suffix in JPEG_EXTENSIONS:
            image.save(output_path, format="JPEG", quality=95, optimize=True)
        elif suffix == ".webp":
            image.save(output_path, format="WEBP", quality=95, method=6)
        else:
            image.save(output_path, format="PNG")


def flatten_to_white(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    background = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
    background.alpha_composite(rgba)
    return background.convert("RGB")


def match_foreground_to_source_canvas(image: Image.Image, source_image: Image.Image) -> Image.Image:
    """Match generated subject scale/position to the source white-background canvas."""
    source = flatten_to_white(source_image)
    generated = flatten_to_white(image)
    source_box = foreground_bbox(source)
    generated_box = foreground_bbox(generated)
    if source_box is None or generated_box is None:
        return resize_to_white_canvas(generated, source.size)

    padded_generated_box = expand_bbox_edges(
        generated_box,
        left=FOREGROUND_PADDING,
        top=FOREGROUND_PADDING,
        right=FOREGROUND_PADDING,
        bottom=0,
        size=generated.size,
    )
    crop = generated.crop(padded_generated_box)

    source_width = source_box[2] - source_box[0]
    source_height = source_box[3] - source_box[1]
    scale = min(source_width / crop.width, source_height / crop.height) * FOREGROUND_SCALE_MULTIPLIER
    resized_size = (
        max(1, round(crop.width * scale)),
        max(1, round(crop.height * scale)),
    )
    resized = crop.resize(resized_size, resample_lanczos())

    source_center_x = (source_box[0] + source_box[2]) // 2
    source_bottom = min(source_box[3], source.height)
    left = source_center_x - resized.width // 2
    top = source_bottom - resized.height

    canvas = Image.new("RGB", source.size, (255, 255, 255))
    canvas.paste(resized, (left, top))
    return canvas


def foreground_bbox(image: Image.Image, white_threshold: int = 246) -> tuple[int, int, int, int] | None:
    rgba = image.convert("RGBA")
    alpha_box = rgba.getchannel("A").point(lambda value: 255 if value > 10 else 0).getbbox()
    if alpha_box and alpha_box != (0, 0, rgba.width, rgba.height):
        return alpha_box

    rgb = rgba.convert("RGB")
    mask = Image.new("L", rgb.size, 0)
    pixels = rgb.load()
    mask_pixels = mask.load()
    for y in range(rgb.height):
        for x in range(rgb.width):
            r, g, b = pixels[x, y]
            if r < white_threshold or g < white_threshold or b < white_threshold:
                mask_pixels[x, y] = 255
    return mask.getbbox()


def expand_bbox_edges(
    bbox: tuple[int, int, int, int],
    left: int,
    top: int,
    right: int,
    bottom: int,
    size: tuple[int, int],
) -> tuple[int, int, int, int]:
    width, height = size
    return (
        max(0, bbox[0] - left),
        max(0, bbox[1] - top),
        min(width, bbox[2] + right),
        min(height, bbox[3] + bottom),
    )


def expand_bbox(
    bbox: tuple[int, int, int, int],
    padding: int,
    size: tuple[int, int],
) -> tuple[int, int, int, int]:
    return expand_bbox_edges(bbox, padding, padding, padding, padding, size)


def resize_to_white_canvas(image: Image.Image, target_size: tuple[int, int]) -> Image.Image:
    """Preserve character proportions while matching the source canvas size."""
    target_width, target_height = target_size
    scale = min(target_width / image.width, target_height / image.height)
    resized_size = (
        max(1, round(image.width * scale)),
        max(1, round(image.height * scale)),
    )
    resized = image.resize(resized_size, resample_lanczos())
    canvas = Image.new("RGB", target_size, (255, 255, 255))
    left = (target_width - resized.width) // 2
    top = (target_height - resized.height) // 2
    canvas.paste(resized, (left, top))
    return canvas


def resample_lanczos() -> int:
    try:
        return Image.Resampling.LANCZOS
    except AttributeError:
        return Image.LANCZOS


def output_format_for_path(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in JPEG_EXTENSIONS:
        return "jpeg"
    if suffix == ".webp":
        return "webp"
    return "png"


def validate_paths(input_dir: Path, style_image: Path) -> None:
    if not input_dir.exists() or not input_dir.is_dir():
        raise FileNotFoundError(f"input folder not found: {input_dir}")
    if not style_image.exists() or not style_image.is_file():
        raise FileNotFoundError(f"style reference image not found: {style_image}")


def print_summary(summary: ProcessSummary) -> None:
    print("")
    print(f"Total planned: {summary.total}")
    print(f"Processed: {summary.processed}")
    print(f"Failed: {len(summary.failed)}")
    if summary.failed:
        print("")
        print("Failures:")
        for failure in summary.failed:
            print(f"- {failure.source} after {failure.attempts} attempts: {failure.error}")


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        validate_paths(args.input_dir, args.style_image)
        jobs = build_jobs(
            input_dir=args.input_dir,
            output_dir=args.output_dir,
            style_image=args.style_image,
            overwrite=args.overwrite,
            limit=args.limit,
        )
        summary = process_jobs(
            jobs,
            style_image=args.style_image,
            prompt=REPAINT_PROMPT,
            editor=openai_image_edit,
            dry_run=args.dry_run,
            retries=args.retries,
            retry_delay=args.retry_delay,
            model=args.model,
            quality=args.quality,
            size=args.size,
            base_url=args.base_url,
        )
        print_summary(summary)
        return 1 if summary.failed else 0
    except KeyboardInterrupt:
        print("Interrupted.", file=sys.stderr)
        return 130
    except Exception as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
