import type {
  ActivePlayableSession,
  PlayablePresenterModel,
} from "../../core/contracts/playable-runtime";

export function presentActivityQtePlayable(
  session: ActivePlayableSession
): PlayablePresenterModel {
  return {
    playableId: session.playableId,
    layout: "panel",
    title: "互动问答",
    summaryLines: [],
    actions: [],
  };
}
