import type { GameState } from "../../domain/game-state";
import type {
  ActiveStoryBattleSession,
  StoryBattleCompletion,
  StoryBattleUnit,
} from "../../domain/story-battle";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";
import { resolveTextEntry } from "../content/text-resolution";
import { formatCouncilStatusText } from "../time/time-progression";

export type StoryBattleActionResult = {
  state: GameState;
  enterHouseId: string | null;
};

export type StoryBattleTextContext = {
  textEntriesById?: Record<string, string> | undefined;
};

function getStoryBattleText(
  context: StoryBattleTextContext,
  textId: string | undefined,
  fallback: string
): string {
  return resolveTextEntry(context.textEntriesById ?? {}, textId, fallback);
}

export function createSundeyaRescueBattleSession(
  completion: StoryBattleCompletion,
  context: StoryBattleTextContext = {}
): NonNullable<ActiveStoryBattleSession> {
  const units: StoryBattleUnit[] = [
    {
      id: "unit.player.vanguard",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.player_vanguard.name",
        "朱重八本队"
      ),
      side: "player",
      controller: "player",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.player_vanguard.role",
        "亲兵小队"
      ),
      x: 1,
      y: 3,
      strength: 320,
      maxStrength: 320,
      status: "ready",
    },
    {
      id: "unit.guo.center",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.guo_center.name",
        "郭子兴中军"
      ),
      side: "player",
      controller: "player",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.guo_center.role",
        "救援主力"
      ),
      x: 1,
      y: 1,
      strength: 540,
      maxStrength: 540,
      status: "ready",
    },
    {
      id: "unit.sundeya.trapped",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.sundeya_trapped.name",
        "孙德崖残队"
      ),
      side: "ally",
      controller: "npc",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.sundeya_trapped.role",
        "被围友军"
      ),
      x: 3,
      y: 2,
      strength: 180,
      maxStrength: 420,
      status: "surrounded",
    },
    {
      id: "unit.yuan.north",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.yuan_north.name",
        "元军北哨"
      ),
      side: "enemy",
      controller: "npc",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.yuan_north.role",
        "围困部队"
      ),
      x: 3,
      y: 1,
      strength: 260,
      maxStrength: 260,
      status: "ready",
    },
    {
      id: "unit.yuan.front",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.yuan_front.name",
        "元军前锋"
      ),
      side: "enemy",
      controller: "npc",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.yuan_front.role",
        "围困部队"
      ),
      x: 4,
      y: 2,
      strength: 310,
      maxStrength: 310,
      status: "ready",
    },
  ];

  return {
    battleId: "story.zhu_yuanzhang.sundeya-rescue",
    title: getStoryBattleText(
      context,
      "battle.story.zhu_yuanzhang.sundeya_rescue.title",
      "救援孙德崖"
    ),
    objective: getStoryBattleText(
      context,
      "battle.story.zhu_yuanzhang.sundeya_rescue.objective",
      "朱重八本队与郭子兴中军合力打穿缺口，救出被围的孙德崖。"
    ),
    summaryLines: [
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.summary.001",
        "孙德崖一队在前方被两支元军围住，兵力已折损过半。"
      ),
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.summary.002",
        "郭子兴与朱重八各领一队压上，合力撕开包围；孙德崖残部由战场态势自行支撑。"
      ),
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.summary.003",
        "本战目标不是全歼，而是打穿缺口、救出被围友军。"
      ),
    ],
    playerUnitId: "unit.player.vanguard",
    rescuedUnitId: "unit.sundeya.trapped",
    demoScenarioId: "sundeya-rescue",
    phase: "embedded-running",
    units,
    logLines: [
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.log.opening.001",
        "元军两支前队围住孙德崖残队，郭子兴与朱重八分别前压。"
      ),
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.log.opening.002",
        "朱重八负责南侧缺口，郭子兴中军压住正面，准备同时打穿包围。"
      ),
    ],
    completion: {
      ...completion,
      mainMissionText:
        completion.mainMissionText ??
        getStoryBattleText(
          context,
          "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
          "战后评定"
        ),
    },
  };
}

export function startStoryBattle(
  state: GameState,
  session: NonNullable<ActiveStoryBattleSession>
): GameState {
  return {
    ...state,
    storyBattle: session,
    ui: {
      ...state.ui,
      currentView: "battle",
      overlayView: null,
      mainHouseMissionText: session.title,
    },
  };
}

export function dispatchStoryBattleAction(
  state: GameState,
  actionId: string,
  context: StoryBattleTextContext = {}
): StoryBattleActionResult {
  const session = state.storyBattle;
  if (session == null) {
    return { state, enterHouseId: null };
  }

  if (
    actionId === "embedded-victory" &&
    session.phase === "embedded-running"
  ) {
    const completion = session.completion;
    const shouldResumeScene = state.scene.activeSceneId != null;
    const nextState: GameState = {
      ...state,
      storyBattle: null,
      world: {
        ...state.world,
        ...(completion.enterHouseId == null
          ? {}
          : { currentHouseId: completion.enterHouseId }),
        schedule: {
          councilDate: state.calendar,
        },
      },
      ui: {
        ...state.ui,
        currentView:
          shouldResumeScene || completion.enterHouseId == null ? "scene" : "house",
        mainHouseMissionText:
          completion.mainMissionText ??
          getStoryBattleText(
            context,
            "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
            "战后评定"
          ),
        reviewDateText: formatCouncilStatusText(0),
      },
      runtime: {
        ...state.runtime,
        flags: {
          ...state.runtime.flags,
          [completion.completedFlagKey]: true,
          [completion.winFlagKey]: true,
        },
        variables: {
          ...state.runtime.variables,
          [completion.battleIdVariableKey]: session.battleId,
          [completion.resultVariableKey]: "victory",
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    };

    return {
      state: nextState,
      enterHouseId: completion.enterHouseId ?? null,
    };
  }

  if (
    actionId === "player-advance" &&
    session.phase === "awaiting-player-order"
  ) {
    return {
      state: {
        ...state,
        storyBattle: {
          ...session,
          phase: "npc-resolution",
          units: session.units.map((unit) => {
            if (unit.id === session.playerUnitId) {
              return { ...unit, x: 2, y: 3, status: "engaged" };
            }
            if (unit.id === "unit.guo.center") {
              return { ...unit, x: 2, y: 1, status: "engaged" };
            }
            return unit;
          }),
          logLines: [
            ...session.logLines,
            getStoryBattleText(
              context,
              "battle.story.zhu_yuanzhang.sundeya_rescue.log.advance.001",
              "朱重八本队向前突入，卡住南侧元军，给友军合围让出通道。"
            ),
          ],
        },
      },
      enterHouseId: null,
    };
  }

  if (actionId === "npc-resolve" && session.phase === "npc-resolution") {
    const nextUnits = session.units.map((unit) => {
      if (unit.side === "enemy") {
        return { ...unit, strength: 0, status: "routed" as const };
      }

      if (unit.id === session.rescuedUnitId) {
        return { ...unit, status: "relieved" as const };
      }

      if (unit.controller === "player") {
        return { ...unit, status: "engaged" as const };
      }

      if (unit.controller === "npc" && unit.side === "ally") {
        return { ...unit, status: "engaged" as const };
      }

      return unit;
    });

    return {
      state: {
        ...state,
        storyBattle: {
          ...session,
          phase: "victory",
          units: nextUnits,
          logLines: [
            ...session.logLines,
            getStoryBattleText(
              context,
              "battle.story.zhu_yuanzhang.sundeya_rescue.log.victory.001",
              "郭子兴中军压住正面，朱重八本队打穿南侧缺口，两支元军被迫退散。"
            ),
            getStoryBattleText(
              context,
              "battle.story.zhu_yuanzhang.sundeya_rescue.log.victory.002",
              "孙德崖残队脱出包围，战后诸队回帅府听候评定。"
            ),
          ],
        },
      },
      enterHouseId: null,
    };
  }

  if (actionId === "finish" && session.phase === "victory") {
    const completion = session.completion;
    const nextState: GameState = {
      ...state,
      storyBattle: null,
      world: {
        ...state.world,
        ...(completion.enterHouseId == null
          ? {}
          : { currentHouseId: completion.enterHouseId }),
        schedule: {
          councilDate: state.calendar,
        },
      },
      ui: {
        ...state.ui,
        currentView: completion.enterHouseId == null ? "scene" : "house",
        mainHouseMissionText:
          completion.mainMissionText ??
          getStoryBattleText(
            context,
            "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
            "战后评定"
          ),
        reviewDateText: formatCouncilStatusText(0),
      },
      runtime: {
        ...state.runtime,
        flags: {
          ...state.runtime.flags,
          [completion.completedFlagKey]: true,
          [completion.winFlagKey]: true,
        },
        variables: {
          ...state.runtime.variables,
          [completion.battleIdVariableKey]: session.battleId,
          [completion.resultVariableKey]: "victory",
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    };

    return {
      state: nextState,
      enterHouseId: completion.enterHouseId ?? null,
    };
  }

  return { state, enterHouseId: null };
}
