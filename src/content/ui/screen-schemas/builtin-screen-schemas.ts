import type { ScreenSchema } from "../../../domain/ui/screen-schema";
import { builtinUiReserveScreensById } from "../builtin-ui-reserve-seeds";

function createScreenSchema(screenId: string): ScreenSchema {
  const screen = builtinUiReserveScreensById[screenId as keyof typeof builtinUiReserveScreensById];
  return {
    id: screen.id,
    version: 1,
    components: screen.components.map((component) => ({
      id: component.id,
      kind: component.kind,
      required: true,
      defaultVisible: true,
    })),
  };
}

export const builtinScreenSchemasById = {
  "global-hud": createScreenSchema("global-hud"),
  "start-screen": createScreenSchema("start-screen"),
  "character-select-screen": createScreenSchema("character-select-screen"),
  "character-detail-screen": createScreenSchema("character-detail-screen"),
};
