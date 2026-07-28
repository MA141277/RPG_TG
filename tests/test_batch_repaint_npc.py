import base64
import importlib.util
import sys
import tempfile
import unittest
from io import BytesIO
from pathlib import Path

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = REPO_ROOT / "scripts" / "batch_repaint_npc.py"


def load_script_module():
    spec = importlib.util.spec_from_file_location("batch_repaint_npc", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def write_image(path: Path, size=(32, 48), mode="RGBA", color=(200, 80, 40, 255)):
    image = Image.new(mode, size, color)
    if path.suffix.lower() in {".jpg", ".jpeg"} and image.mode != "RGB":
        image = image.convert("RGB")
    image.save(path)


def make_image_bytes(size=(16, 24), fmt="PNG"):
    buffer = BytesIO()
    image = Image.new("RGBA", size, (20, 120, 220, 255))
    image.save(buffer, format=fmt)
    return buffer.getvalue()


class BatchRepaintNpcTests(unittest.TestCase):
    def setUp(self):
        self.mod = load_script_module()
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.input_dir = self.root / "npc"
        self.output_dir = self.root / "npc1"
        self.input_dir.mkdir()
        self.output_dir.mkdir()
        self.style_image = self.output_dir / "upload_1785120162867965862.png"
        write_image(self.style_image)

    def tearDown(self):
        self.tmp.cleanup()

    def test_build_jobs_filters_supported_images_and_skips_style_reference(self):
        source_png = self.input_dir / "a.png"
        source_jpeg = self.input_dir / "b.jpeg"
        unsupported = self.input_dir / "notes.txt"
        nested = self.input_dir / "nested"
        nested.mkdir()

        write_image(source_png)
        write_image(source_jpeg)
        unsupported.write_text("not an image", encoding="utf-8")
        write_image(nested / "ignored.png")

        jobs = self.mod.build_jobs(
            input_dir=self.input_dir,
            output_dir=self.output_dir,
            style_image=self.style_image,
            overwrite=False,
            limit=None,
        )

        self.assertEqual([job.source.name for job in jobs], ["a.png", "b.jpeg"])
        self.assertEqual([job.output.name for job in jobs], ["a.png", "b.jpeg"])

    def test_build_jobs_skips_touxiang_files(self):
        avatar = self.input_dir / "hero(touxiang).png"
        half_body = self.input_dir / "hero.png"
        write_image(avatar)
        write_image(half_body)

        jobs = self.mod.build_jobs(
            input_dir=self.input_dir,
            output_dir=self.output_dir,
            style_image=self.style_image,
            overwrite=False,
            limit=None,
        )

        self.assertEqual([job.source.name for job in jobs], ["hero.png"])

    def test_build_jobs_respects_overwrite_and_limit(self):
        for name in ("a.png", "b.png", "c.png"):
            write_image(self.input_dir / name)
        write_image(self.output_dir / "a.png")

        jobs_without_overwrite = self.mod.build_jobs(
            input_dir=self.input_dir,
            output_dir=self.output_dir,
            style_image=self.style_image,
            overwrite=False,
            limit=2,
        )
        jobs_with_overwrite = self.mod.build_jobs(
            input_dir=self.input_dir,
            output_dir=self.output_dir,
            style_image=self.style_image,
            overwrite=True,
            limit=2,
        )

        self.assertEqual([job.source.name for job in jobs_without_overwrite], ["b.png", "c.png"])
        self.assertEqual([job.source.name for job in jobs_with_overwrite], ["a.png", "b.png"])

    def test_prompt_contains_requested_style_identity_composition_and_negative_constraints(self):
        prompt = self.mod.REPAINT_PROMPT

        required_fragments = [
            "更接近风格参考图的古风人物游戏立绘插画",
            "颜色饱和度和当前柔和配色感保持原图",
            "风格参考图只用于参考画风语言、笔触处理、线稿虚实、明暗概括方式",
            "禁止复制风格参考图的人物身份、服装、五官、年龄、表情和配饰",
            "线条要更有特色，使用干净利落、粗细变化明确的东方勾线",
            "脸部明暗对比要更明显",
            "笔触要更概括、更成片",
            "阴影要比当前结果更概括、更成片",
            "只生成半身像，统一控制在腰部以上，腰部以上的人物信息不能丢失",
            "图片底部不要有空白边",
            "不要把半身裁成头像",
            "不要拉伸人物比例",
        ]

        for fragment in required_fragments:
            self.assertIn(fragment, prompt)

        self.assertNotIn("纯净白色或接近纯白", prompt)
        self.assertNotIn("使用中高对比度", prompt)

    def test_cli_defaults_to_requested_endpoint_and_model(self):
        args = self.mod.parse_args(["--dry-run"])

        self.assertEqual(args.base_url, "https://epone.ggb.today/v1")
        self.assertEqual(args.model, "gpt-image-2-dev")

    def test_process_jobs_dry_run_does_not_call_editor(self):
        source = self.input_dir / "a.png"
        write_image(source)
        jobs = self.mod.build_jobs(self.input_dir, self.output_dir, self.style_image, False, None)

        def editor(*args, **kwargs):
            raise AssertionError("dry run must not call editor")

        summary = self.mod.process_jobs(
            jobs,
            style_image=self.style_image,
            prompt=self.mod.REPAINT_PROMPT,
            editor=editor,
            dry_run=True,
            retries=1,
            retry_delay=0,
        )

        self.assertEqual(summary.processed, 0)
        self.assertEqual(summary.failed, [])
        self.assertFalse((self.output_dir / "a.png").exists())

    def test_process_jobs_retries_failures_and_continues(self):
        first = self.input_dir / "a.png"
        second = self.input_dir / "b.png"
        write_image(first)
        write_image(second)
        jobs = self.mod.build_jobs(self.input_dir, self.output_dir, self.style_image, False, None)
        attempts = {}
        png_bytes = make_image_bytes(size=(20, 20), fmt="PNG")

        def editor(source_path, style_image_path, prompt, output_format, model, quality, size, base_url):
            attempts[source_path.name] = attempts.get(source_path.name, 0) + 1
            if source_path.name == "a.png" and attempts[source_path.name] == 1:
                raise RuntimeError("temporary failure")
            if source_path.name == "b.png":
                raise RuntimeError("permanent failure")
            return png_bytes

        summary = self.mod.process_jobs(
            jobs,
            style_image=self.style_image,
            prompt=self.mod.REPAINT_PROMPT,
            editor=editor,
            dry_run=False,
            retries=2,
            retry_delay=0,
        )

        self.assertEqual(summary.processed, 1)
        self.assertEqual([(failure.source.name, failure.attempts) for failure in summary.failed], [("b.png", 2)])
        self.assertEqual(attempts["a.png"], 2)
        self.assertEqual(attempts["b.png"], 2)
        self.assertTrue((self.output_dir / "a.png").exists())
        self.assertFalse((self.output_dir / "b.png").exists())

    def test_save_output_resizes_and_converts_jpeg_to_rgb(self):
        source = self.input_dir / "portrait.jpg"
        write_image(source, size=(31, 47), mode="RGB", color=(200, 80, 40))
        output = self.output_dir / "portrait.jpg"
        generated_png = make_image_bytes(size=(128, 128), fmt="PNG")

        self.mod.save_generated_image(generated_png, output, source)

        with Image.open(output) as saved:
            self.assertEqual(saved.size, (31, 47))
            self.assertEqual(saved.mode, "RGB")
            self.assertEqual(saved.format, "JPEG")

    def test_resize_to_white_canvas_preserves_aspect_ratio(self):
        image = Image.new("RGB", (100, 100), (20, 120, 220))

        resized = self.mod.resize_to_white_canvas(image, (50, 100))

        self.assertEqual(resized.size, (50, 100))
        self.assertEqual(resized.getpixel((25, 0)), (255, 255, 255))
        self.assertEqual(resized.getpixel((25, 50)), (20, 120, 220))

    def test_extract_image_bytes_supports_base64_response_objects(self):
        expected = b"image-bytes"

        class Item:
            b64_json = base64.b64encode(expected).decode("ascii")

        class Response:
            data = [Item()]

        self.assertEqual(self.mod.extract_image_bytes(Response()), expected)


if __name__ == "__main__":
    unittest.main()
