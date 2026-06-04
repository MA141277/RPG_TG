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
