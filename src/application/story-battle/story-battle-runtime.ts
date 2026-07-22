import type { GameState } from "../../domain/game-state";
import type {
  ActiveStoryBattleSession,
  StoryBattleCompletion,
  StoryBattleUnit,
} from "../../domain/story-battle";
import { resolveTextEntry } from "../content/text-resolution";
import { defaultReviewCyclePolicy } from "../review/review-cycle-provider";

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
      side: "ally",
      controller: "npc",
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
      id: "unit.tanghe.left",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.tanghe_left.name",
        "汤和队"
      ),
      side: "ally",
      controller: "npc",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.tanghe_left.role",
        "左翼接应"
      ),
      x: 0,
      y: 2,
      strength: 360,
      maxStrength: 360,
      status: "ready",
    },
    {
      id: "unit.xuda.right",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.xuda_right.name",
        "徐达队"
      ),
      side: "ally",
      controller: "npc",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.xuda_right.role",
        "右翼接应"
      ),
      x: 2,
      y: 2,
      strength: 350,
      maxStrength: 350,
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
    {
      id: "unit.yuan.south",
      name: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.yuan_south.name",
        "元军南哨"
      ),
      side: "enemy",
      controller: "npc",
      role: getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.unit.yuan_south.role",
        "围困部队"
      ),
      x: 3,
      y: 3,
      strength: 240,
      maxStrength: 240,
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
      "主角本队突入前方缺口，配合郭子兴诸队解开三面围困。"
    ),
    summaryLines: [
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.summary.001",
        "孙德崖一队在前方被三支元军围住，兵力已折损过半。"
      ),
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.summary.002",
        "郭子兴率中军压上，汤和与徐达分走两翼；玩家只指挥朱重八本队，其余友军由 NPC 自动推进。"
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
        "元军三队围住孙德崖残队，郭子兴令诸队前压。"
      ),
      getStoryBattleText(
        context,
        "battle.story.zhu_yuanzhang.sundeya_rescue.log.opening.002",
        "朱重八作为新入营亲兵，只能先带本队抢占前方缺口。"
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
    const reviewSyncedState = defaultReviewCyclePolicy.applySchedule(state, {
      scheduledDate: state.calendar,
      missionText:
        completion.mainMissionText ??
        getStoryBattleText(
          context,
          "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
          "鎴樺悗璇勫畾"
        ),
    });
    const nextState: GameState = {
      ...reviewSyncedState,
      storyBattle: null,
      world: {
        ...reviewSyncedState.world,
        ...(completion.enterHouseId == null
          ? {}
          : { currentHouseId: completion.enterHouseId }),
      },
      ui: {
        ...reviewSyncedState.ui,
        currentView: completion.enterHouseId == null ? "dialogue" : "house",
        mainHouseMissionText:
          completion.mainMissionText ??
          getStoryBattleText(
            context,
            "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
            "战后评定"
          ),
      },
      runtime: {
        ...reviewSyncedState.runtime,
        flags: {
          ...reviewSyncedState.runtime.flags,
          [completion.completedFlagKey]: true,
          [completion.winFlagKey]: true,
        },
        variables: {
          ...reviewSyncedState.runtime.variables,
          [completion.battleIdVariableKey]: session.battleId,
          [completion.resultVariableKey]: "victory",
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
          units: session.units.map((unit) =>
            unit.id === session.playerUnitId
              ? { ...unit, x: 2, y: 3, status: "engaged" }
              : unit
          ),
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
              "郭子兴中军压住正面，汤和、徐达两翼接应，三支元军被迫退散。"
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
    const reviewSyncedState = defaultReviewCyclePolicy.applySchedule(state, {
      scheduledDate: state.calendar,
      missionText:
        completion.mainMissionText ??
        getStoryBattleText(
          context,
          "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
          "鎴樺悗璇勫畾"
        ),
    });
    const nextState: GameState = {
      ...reviewSyncedState,
      storyBattle: null,
      world: {
        ...reviewSyncedState.world,
        ...(completion.enterHouseId == null
          ? {}
          : { currentHouseId: completion.enterHouseId }),
      },
      ui: {
        ...reviewSyncedState.ui,
        currentView: completion.enterHouseId == null ? "dialogue" : "house",
        mainHouseMissionText:
          completion.mainMissionText ??
          getStoryBattleText(
            context,
            "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle",
            "战后评定"
          ),
      },
      runtime: {
        ...reviewSyncedState.runtime,
        flags: {
          ...reviewSyncedState.runtime.flags,
          [completion.completedFlagKey]: true,
          [completion.winFlagKey]: true,
        },
        variables: {
          ...reviewSyncedState.runtime.variables,
          [completion.battleIdVariableKey]: session.battleId,
          [completion.resultVariableKey]: "victory",
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
