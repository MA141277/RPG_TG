import type { GameState } from "./game-state";

export const HOME_HOUSE_VARIABLE_KEYS = {
  hp: "var.home.hp",
  maxHp: "var.home.max_hp",
  fatigue: "var.home.fatigue",
  maxFatigue: "var.home.max_fatigue",
  homeLevel: "var.home.level",
  storageSize: "var.home.storage_size",
  spouseNpcId: "var.home.spouse.npc_id",
  spouseAffection: "var.home.spouse.affection",
  spouseSupportActions: "var.home.spouse.support_actions",
  homeDecoration: "var.home.decoration",
} as const;

export const HOME_HOUSE_FLAG_KEYS = {
  spouseEnabled: "flag.home.spouse.enabled",
  guestRoom: "flag.home.guest_room",
  forcePlot: "flag.home.force_plot",
  warSummons: "flag.home.war_summons",
} as const;

export type HomeSpouseState = {
  enabled: boolean;
  npcId: string | null;
  affection: number;
  supportActions: string[];
};

export type HomeGrowthState = {
  homeLevel: number;
  homeDecoration: string[];
  storageSize: number;
  guestRoom: boolean;
};

export type HomePersistentState = {
  spouse: HomeSpouseState;
  growth: HomeGrowthState;
};

export type HomeRestInterruptionReason =
  | "event"
  | "forced-plot"
  | "war-summons"
  | "council-date";

export type HomeRestHookResult = {
  interrupted: boolean;
  reason: HomeRestInterruptionReason | null;
};

export function parseHomeList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function serializeHomeList(items: readonly string[]): string {
  return items.join(",");
}

export function selectHomePersistentState(state: GameState): HomePersistentState {
  const spouseNpcId = state.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.spouseNpcId];
  const spouseAffection = state.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.spouseAffection];
  const spouseSupportActions =
    state.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.spouseSupportActions];
  const homeLevel = state.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.homeLevel];
  const storageSize = state.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.storageSize];
  const homeDecoration = state.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.homeDecoration];

  return {
    spouse: {
      enabled: state.runtime.flags[HOME_HOUSE_FLAG_KEYS.spouseEnabled] === true,
      npcId: typeof spouseNpcId === "string" && spouseNpcId.length > 0 ? spouseNpcId : null,
      affection: typeof spouseAffection === "number" ? spouseAffection : 0,
      supportActions:
        typeof spouseSupportActions === "string" ? parseHomeList(spouseSupportActions) : [],
    },
    growth: {
      homeLevel: typeof homeLevel === "number" ? homeLevel : 1,
      homeDecoration: typeof homeDecoration === "string" ? parseHomeList(homeDecoration) : [],
      storageSize: typeof storageSize === "number" ? storageSize : 20,
      guestRoom: state.runtime.flags[HOME_HOUSE_FLAG_KEYS.guestRoom] === true,
    },
  };
}

export function resolveHomeRestHook(state: GameState): HomeRestHookResult {
  if (state.scene.activeEventId != null) {
    return {
      interrupted: true,
      reason: "event",
    };
  }

  if (state.runtime.flags[HOME_HOUSE_FLAG_KEYS.forcePlot] === true) {
    return {
      interrupted: true,
      reason: "forced-plot",
    };
  }

  if (state.runtime.flags[HOME_HOUSE_FLAG_KEYS.warSummons] === true) {
    return {
      interrupted: true,
      reason: "war-summons",
    };
  }

  return {
    interrupted: false,
    reason: null,
  };
}
