export type TroopEditorButtonSoundInput =
  | { kind: "menu"; menuId: string; actionId: string | null }
  | { kind: "troop-card" }
  | { kind: "shop-offer" }
  | { kind: "shop-prompt"; action: "buy" | "cancel" }
  | { kind: "shop-back" }
  | { kind: "create-choice"; choice: "confirm" | "cancel" }
  | { kind: "dismiss-member" }
  | { kind: "dismiss-prompt"; action: "dismiss" | "back" }
  | { kind: "dismiss-close" }
  | { kind: "dismiss-confirm"; choice: "confirm" | "cancel" }
  | { kind: "confirm-choice"; choice: "confirm" | "cancel" }
  | { kind: "alert-close" };

export function getTroopEditorButtonSound(
  input: TroopEditorButtonSoundInput
): "light" | "heavy" {
  if (input.kind === "menu") {
    return input.actionId === "open-troop-management" ? "heavy" : "light";
  }

  if (input.kind === "shop-prompt") {
    return input.action === "buy" ? "heavy" : "light";
  }

  if (input.kind === "create-choice") {
    return input.choice === "confirm" ? "heavy" : "light";
  }

  if (input.kind === "dismiss-prompt") {
    return input.action === "dismiss" ? "heavy" : "light";
  }

  if (input.kind === "dismiss-confirm") {
    return input.choice === "confirm" ? "heavy" : "light";
  }

  if (input.kind === "confirm-choice") {
    return input.choice === "confirm" ? "heavy" : "light";
  }

  return "light";
}

export type TroopManagementButtonSoundInput =
  | { kind: "troop-card" }
  | { kind: "cycle" }
  | { kind: "action"; actionId: string; dataAction: string | null }
  | { kind: "reserve-member" }
  | { kind: "reserve-prompt"; action: "assign" | "back" }
  | { kind: "reserve-close" }
  | { kind: "remove-confirm"; choice: "confirm" | "cancel" }
  | { kind: "alert-close" };

export function getTroopManagementButtonSound(
  input: TroopManagementButtonSoundInput
): "light" | "heavy" {
  if (input.kind === "reserve-prompt") {
    return input.action === "assign" ? "heavy" : "light";
  }

  if (input.kind === "remove-confirm") {
    return input.choice === "confirm" ? "heavy" : "light";
  }

  return "light";
}
