import commoner1RightUpUrl from "../../../../ui/npc/city-ambient-walkers/平民1右上.png";
import commoner1RightDownUrl from "../../../../ui/npc/city-ambient-walkers/平民1右下.png";
import commoner1LeftUpUrl from "../../../../ui/npc/city-ambient-walkers/平民1左上.png";
import commoner1LeftDownUrl from "../../../../ui/npc/city-ambient-walkers/平民1左下.png";
import commoner2RightUpUrl from "../../../../ui/npc/city-ambient-walkers/平民2右上.png";
import commoner2RightDownUrl from "../../../../ui/npc/city-ambient-walkers/平民2右下.png";
import commoner2LeftUpUrl from "../../../../ui/npc/city-ambient-walkers/平民2左上.png";
import commoner2LeftDownUrl from "../../../../ui/npc/city-ambient-walkers/平民2左下.png";
import noble1RightUpUrl from "../../../../ui/npc/city-ambient-walkers/贵族1右上.png";
import noble1RightDownUrl from "../../../../ui/npc/city-ambient-walkers/贵族1右下.png";
import noble1LeftUpUrl from "../../../../ui/npc/city-ambient-walkers/贵族1左上.png";
import noble1LeftDownUrl from "../../../../ui/npc/city-ambient-walkers/贵族1左下.png";
import noble2RightUpUrl from "../../../../ui/npc/city-ambient-walkers/贵族2右上.png";
import noble2RightDownUrl from "../../../../ui/npc/city-ambient-walkers/贵族2右下.png";
import noble2LeftUpUrl from "../../../../ui/npc/city-ambient-walkers/贵族2左上.png";
import noble2LeftDownUrl from "../../../../ui/npc/city-ambient-walkers/贵族2左下.png";
import scholar1RightUpUrl from "../../../../ui/npc/city-ambient-walkers/文人1右上.png";
import scholar1RightDownUrl from "../../../../ui/npc/city-ambient-walkers/文人1右下.png";
import scholar1LeftUpUrl from "../../../../ui/npc/city-ambient-walkers/文人1左上.png";
import scholar1LeftDownUrl from "../../../../ui/npc/city-ambient-walkers/文人1左下.png";
import official1RightUpUrl from "../../../../ui/npc/city-ambient-walkers/文官1右上.png";
import official1RightDownUrl from "../../../../ui/npc/city-ambient-walkers/文官1右下.png";
import official1LeftUpUrl from "../../../../ui/npc/city-ambient-walkers/文官1左上.png";
import official1LeftDownUrl from "../../../../ui/npc/city-ambient-walkers/文官1左下.png";

const spriteUrlByResourceId: Record<string, string> = {
  "sandbox.walker.commoner1.right-up": commoner1RightUpUrl,
  "sandbox.walker.commoner1.right-down": commoner1RightDownUrl,
  "sandbox.walker.commoner1.left-up": commoner1LeftUpUrl,
  "sandbox.walker.commoner1.left-down": commoner1LeftDownUrl,
  "sandbox.walker.commoner2.right-up": commoner2RightUpUrl,
  "sandbox.walker.commoner2.right-down": commoner2RightDownUrl,
  "sandbox.walker.commoner2.left-up": commoner2LeftUpUrl,
  "sandbox.walker.commoner2.left-down": commoner2LeftDownUrl,
  "sandbox.walker.noble1.right-up": noble1RightUpUrl,
  "sandbox.walker.noble1.right-down": noble1RightDownUrl,
  "sandbox.walker.noble1.left-up": noble1LeftUpUrl,
  "sandbox.walker.noble1.left-down": noble1LeftDownUrl,
  "sandbox.walker.noble2.right-up": noble2RightUpUrl,
  "sandbox.walker.noble2.right-down": noble2RightDownUrl,
  "sandbox.walker.noble2.left-up": noble2LeftUpUrl,
  "sandbox.walker.noble2.left-down": noble2LeftDownUrl,
  "sandbox.walker.scholar1.right-up": scholar1RightUpUrl,
  "sandbox.walker.scholar1.right-down": scholar1RightDownUrl,
  "sandbox.walker.scholar1.left-up": scholar1LeftUpUrl,
  "sandbox.walker.scholar1.left-down": scholar1LeftDownUrl,
  "sandbox.walker.official1.right-up": official1RightUpUrl,
  "sandbox.walker.official1.right-down": official1RightDownUrl,
  "sandbox.walker.official1.left-up": official1LeftUpUrl,
  "sandbox.walker.official1.left-down": official1LeftDownUrl,
};

export function resolveCivilizationSandboxSpriteUrl(
  resourceId: string
): string | null {
  return spriteUrlByResourceId[resourceId] ?? null;
}
