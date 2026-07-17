import type { LayoutEditorTargetId } from "../../domain/ui-layout";

export type LayoutEditorTargetMode = "preview" | "live";

export type LayoutEditorTargetDefinition = {
  id: LayoutEditorTargetId;
  label: string;
  mode: LayoutEditorTargetMode;
};

export const layoutEditorTargets: LayoutEditorTargetDefinition[] = [
  {
    id: "global-hud",
    label: "顶部全局属性栏",
    mode: "preview",
  },
  {
    id: "start-screen",
    label: "开始界面",
    mode: "live",
  },
  {
    id: "character-select-screen",
    label: "选择人物界面",
    mode: "live",
  },
  {
    id: "character-detail-screen",
    label: "人物通用界面",
    mode: "live",
  },
  {
    id: "battle-ui-screen",
    label: "战斗界面调整",
    mode: "live",
  },
];

export const layoutEditorTargetById: Record<
  LayoutEditorTargetId,
  LayoutEditorTargetDefinition
> = Object.fromEntries(
  layoutEditorTargets.map((target) => [target.id, target])
) as Record<LayoutEditorTargetId, LayoutEditorTargetDefinition>;

export function getLayoutEditorTarget(
  targetId: LayoutEditorTargetId
): LayoutEditorTargetDefinition {
  return layoutEditorTargetById[targetId];
}
