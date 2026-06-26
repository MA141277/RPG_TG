// @ts-nocheck
const TAVERN_GAMBLE_PLAYED_GROUP_TARGET = 2;
const TAVERN_GAMBLE_PLAYER_COUNT = 4;
const TAVERN_GAMBLE_HAND_SIZE = 4;
const TAVERN_GAMBLE_DRAW_DISCARD_COUNT = 2;
const TAVERN_GAMBLE_MELD_RESPONSE_SECONDS = 5;
const TAVERN_GAMBLE_DISCARD_RESPONSE_SECONDS = 3;
const TAVERN_GAMBLE_PUBLIC_TILE_COUNT = 9;
const TAVERN_GAMBLE_SHOWDOWN_SIZE = 6;
const TAVERN_LONG_GAMBLE_HAND_SIZE = 5;
const TAVERN_LONG_GAMBLE_PUBLIC_TILE_COUNT = 9;
const TAVERN_LONG_GAMBLE_REVEAL_TICKS = 1;
const TAVERN_LONG_GAMBLE_DRAW_DISCARD_COUNT = 3;
const TAVERN_LONG_GAMBLE_MELD_RESPONSE_SECONDS = 10;
const TAVERN_GAMBLE_SMALL_BLIND = 10;
const TAVERN_GAMBLE_BIG_BLIND = 20;
const suitLabels = {
    wan: "万",
    tiao: "条",
    tong: "筒",
};
const honorLabels = {
    east: "东",
    south: "南",
    west: "西",
    north: "北",
    zhong: "中",
    fa: "发",
    bai: "白",
};
const flowerLabels = {
    spring: "春",
    summer: "夏",
    autumn: "秋",
    winter: "冬",
    plum: "梅",
    orchid: "兰",
    bamboo: "竹",
    chrysanthemum: "菊",
};
const dragonHonors = new Set(["zhong", "fa", "bai"]);
const windHonors = new Set(["east", "south", "west", "north"]);
function createTavernMahjongDeck() {
    const tiles = [];
    for (const suit of Object.keys(suitLabels)) {
        for (let rank = 1; rank <= 9; rank += 1) {
            for (let copy = 1; copy <= 4; copy += 1) {
                tiles.push({ id: `${suit}-${rank}-${copy}`, kind: "suited", suit, rank, copy });
            }
        }
    }
    for (const honor of Object.keys(honorLabels)) {
        for (let copy = 1; copy <= 4; copy += 1) {
            tiles.push({ id: `${honor}-${copy}`, kind: "honor", honor, copy });
        }
    }
    for (const flower of Object.keys(flowerLabels)) {
        tiles.push({ id: `flower-${flower}`, kind: "flower", flower });
    }
    return tiles;
}
function shuffleTavernMahjongDeck(deck, seed) {
    const result = [...deck];
    let cursor = seed <= 0 ? 1 : seed;
    for (let index = result.length - 1; index > 0; index -= 1) {
        cursor = (cursor * 1664525 + 1013904223) >>> 0;
        const swapIndex = cursor % (index + 1);
        const current = result[index];
        const swap = result[swapIndex];
        if (current != null && swap != null) {
            result[index] = swap;
            result[swapIndex] = current;
        }
    }
    return result;
}
function getTavernMahjongTileLabel(tile) {
    if (tile.kind === "suited") {
        return `${tile.rank}${suitLabels[tile.suit]}`;
    }
    if (tile.kind === "honor") {
        return honorLabels[tile.honor];
    }
    return flowerLabels[tile.flower];
}
function getTavernMahjongTileKey(tile) {
    if (tile.kind === "suited") {
        return `${tile.suit}-${tile.rank}`;
    }
    if (tile.kind === "honor") {
        return tile.honor;
    }
    return tile.flower;
}
function getTavernGambleStreetLabel(street) {
    return getStreetLabel(street);
}
function getTavernGamblePhaseLabel(phase) {
    switch (phase) {
        case "betting":
            return "下注";
        case "meld-window":
            return "碰杠";
        case "draw-discard":
            return "摸打";
        case "draw-bet":
            return "摸后下注";
        case "npc-thinking":
            return "NPC思考";
        case "showdown":
            return "摊牌";
        case "finished":
            return "结算";
    }
}
function getMeldKindLabel(kind) {
    switch (kind) {
        case "chi":
            return "吃";
        case "pong":
            return "碰";
        case "public-kong":
            return "明杠";
        case "concealed-kong":
            return "暗杠";
    }
}
function getStreetLabel(street) {
    switch (street) {
        case "pre-flop":
            return "翻牌前";
        case "flop":
            return "翻牌";
        case "turn":
            return "转牌";
        case "river":
            return "河牌";
        case "showdown":
            return "摊牌";
    }
}
function createTavernGambleSession(input) {
    const shuffled = shuffleTavernMahjongDeck(createTavernMahjongDeck(), input.seed);
    let deadWall = shuffled.slice(-16);
    const wall = shuffled.slice(0, -16);
    const players = ["you", "traveler", "broker", "guard"].map((id, index) => ({
        id,
        name: index === 0 ? input.playerName : index === 1 ? "行脚客" : index === 2 ? "牙人" : "护院",
        isHuman: index === 0,
        seatIndex: index,
        hand: [],
        flowers: [],
        discarded: [],
        exposedMelds: [],
        playedGroups: [],
        playedOwnTileCount: 0,
        spentPublicTileIds: [],
        longTileOrder: [],
        folded: false,
        committed: 0,
        skipsDraw: false,
    }));
    let dealWall = wall;
    const dealtPlayers = players.map((player) => {
        const handResult = drawNonFlowerTiles(dealWall, deadWall, TAVERN_GAMBLE_HAND_SIZE);
        dealWall = handResult.wall;
        deadWall = handResult.deadWall;
        return { ...player, hand: handResult.tiles, flowers: handResult.flowers };
    });
    const smallBlind = Math.min(TAVERN_GAMBLE_SMALL_BLIND, input.wager);
    const bigBlind = Math.min(TAVERN_GAMBLE_BIG_BLIND, input.wager);
    dealtPlayers[1] = { ...dealtPlayers[1], committed: smallBlind };
    dealtPlayers[2] = { ...dealtPlayers[2], committed: bigBlind };
    return {
        id: `tavern-gamble-${input.seed}`,
        variant: "short",
        limitMode: input.limitMode ?? "no-limit",
        street: "pre-flop",
        phase: "betting",
        dealerSeat: 0,
        smallBlindSeat: 1,
        bigBlindSeat: 2,
        actingSeat: 3,
        currentBet: bigBlind,
        minRaise: bigBlind,
        pot: smallBlind + bigBlind,
        wager: input.wager,
        wall: dealWall,
        deadWall,
        publicTiles: [],
        publicDiscards: [],
        unclaimableDiscardTileIds: [],
        players: dealtPlayers,
        pendingDrawTile: null,
        pendingHumanHu: false,
        pendingDiscardsRemaining: 0,
        selectedPlayTileIds: [],
        spentPublicTileIds: [],
        pendingMelds: [],
        meldWindow: null,
        resolvedDiscardResponseTileIds: [],
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        bettingRound: 1,
        longPublicRevealTicks: 0,
        roundLog: ["定下按钮位，小盲注与大盲注已经入池。", "每名玩家发 4 张暗牌，公共牌按 5 / 2 / 2 翻开。"],
        showdown: null,
    };
}
function createTavernLongGambleSession(input) {
    const shuffled = shuffleTavernMahjongDeck(createTavernMahjongDeck(), input.seed);
    let deadWall = shuffled.slice(-16);
    const wall = shuffled.slice(0, -16);
    const players = ["you", "traveler", "broker", "guard"].map((id, index) => ({
        id,
        name: index === 0 ? input.playerName : index === 1 ? "行脚客" : index === 2 ? "牙人" : "护院",
        isHuman: index === 0,
        seatIndex: index,
        hand: [],
        flowers: [],
        discarded: [],
        exposedMelds: [],
        playedGroups: [],
        playedOwnTileCount: 0,
        spentPublicTileIds: [],
        publicTileSlots: [],
        longTileOrder: [],
        folded: false,
        committed: 0,
        skipsDraw: false,
    }));
    let dealWall = wall;
    const sharedPublicResult = drawNonFlowerTiles(dealWall, deadWall, TAVERN_LONG_GAMBLE_PUBLIC_TILE_COUNT);
    dealWall = sharedPublicResult.wall;
    deadWall = sharedPublicResult.deadWall;
    const dealtPlayers = players.map((player) => {
        const handResult = drawNonFlowerTiles(dealWall, deadWall, TAVERN_LONG_GAMBLE_HAND_SIZE);
        dealWall = handResult.wall;
        deadWall = handResult.deadWall;
        return {
            ...player,
            hand: handResult.tiles,
            flowers: [...handResult.flowers],
            publicTileSlots: sharedPublicResult.tiles.map((tile, slotIndex) => ({
                id: `${player.id}-public-${slotIndex + 1}`,
                tile: { ...tile, id: `${player.id}-public-copy-${slotIndex + 1}-${tile.id}` },
                covered: false,
            })),
            longTileOrder: [
                ...handResult.tiles.map((tile) => tile.id),
                ...sharedPublicResult.tiles.map((tile, slotIndex) => `${player.id}-public-copy-${slotIndex + 1}-${tile.id}`),
            ],
        };
    });
    const smallBlind = Math.min(TAVERN_GAMBLE_SMALL_BLIND, input.wager);
    const bigBlind = Math.min(TAVERN_GAMBLE_BIG_BLIND, input.wager);
    dealtPlayers[1] = { ...dealtPlayers[1], committed: smallBlind };
    dealtPlayers[2] = { ...dealtPlayers[2], committed: bigBlind };
    return {
        id: `tavern-long-gamble-${input.seed}`,
        variant: "long",
        limitMode: input.limitMode ?? "no-limit",
        street: "pre-flop",
        phase: "betting",
        dealerSeat: 0,
        smallBlindSeat: 1,
        bigBlindSeat: 2,
        actingSeat: 3,
        currentBet: bigBlind,
        minRaise: bigBlind,
        pot: smallBlind + bigBlind,
        wager: input.wager,
        wall: dealWall,
        deadWall,
        publicTiles: [],
        publicDiscards: [],
        unclaimableDiscardTileIds: [],
        players: dealtPlayers,
        pendingDrawTile: null,
        pendingDiscardsRemaining: 0,
        selectedPlayTileIds: [],
        spentPublicTileIds: [],
        pendingMelds: [],
        meldWindow: null,
        resolvedDiscardResponseTileIds: [],
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        bettingRound: 1,
        longPublicRevealTicks: 0,
        roundLog: [
            "??????? 5 ????????? 9 ????????????????????",
            "???????? 3 ? 3??????????????????????????????????",
        ],
        showdown: null,
    };
}
function resolveTavernGambleBettingAction(session, action) {
    if (session.phase !== "betting" && session.phase !== "draw-bet") {
        return session;
    }
    const player = getHumanPlayer(session);
    if (hasCompletedPlayedGroups(player)) {
        const skipLog = "你已打出两组顺/刻，本局不再参与行动，等待结算。";
        return session.phase === "draw-bet"
            ? startNpcThinking({ ...session, pendingDrawTile: null, pendingDiscardsRemaining: 0 }, skipLog)
            : advanceAfterBetting(session, skipLog);
    }
    if (session.phase === "draw-bet") {
        return resolveHumanDrawBettingAction(session, player, action);
    }
    if (player.folded) {
        return advanceAfterBetting(session, "你已经弃牌。");
    }
    if (action === "fold") {
        return advanceAfterBetting(updatePlayer(session, player.id, { folded: true }), "你弃牌。");
    }
    const callAmount = Math.max(0, session.currentBet - player.committed);
    if (action === "raise") {
        const raiseAmount = session.minRaise;
        const commitAmount = getAffordableCommit(session, player, callAmount + raiseAmount);
        const nextCommitted = player.committed + commitAmount;
        const raisedSession = updatePlayer(session, player.id, { committed: nextCommitted });
        return advanceAfterBetting({ ...raisedSession, currentBet: nextCommitted, pot: session.pot + commitAmount }, `你加注到 ${nextCommitted} 文。`);
    }
    if (action === "call") {
        const commitAmount = getAffordableCommit(session, player, callAmount);
        const calledSession = updatePlayer(session, player.id, { committed: player.committed + commitAmount });
        return advanceAfterBetting({ ...calledSession, pot: session.pot + commitAmount }, commitAmount === 0 ? "你让牌。" : `你跟注 ${commitAmount} 文。`);
    }
    if (callAmount > 0) {
        const commitAmount = getAffordableCommit(session, player, callAmount);
        const calledSession = updatePlayer(session, player.id, { committed: player.committed + commitAmount });
        return advanceAfterBetting({ ...calledSession, pot: session.pot + commitAmount }, `当前不能免费让牌，改为跟注 ${commitAmount} 文。`);
    }
    return advanceAfterBetting(session, "你让牌。");
}
function resolveHumanDrawBettingAction(session, player, action) {
    if (player.folded) {
        return startNpcThinking({ ...session, pendingDrawTile: null, pendingDiscardsRemaining: 0 }, "你已经弃牌。");
    }
    if (action === "fold") {
        return startNpcThinking({
            ...updatePlayer(session, player.id, { folded: true }),
            pendingDrawTile: null,
            pendingDiscardsRemaining: 0,
        }, "你弃牌，本轮不再弃牌。");
    }
    const callAmount = Math.max(0, session.currentBet - player.committed);
    if (action === "raise") {
        const raiseAmount = session.minRaise;
        const commitAmount = getAffordableCommit(session, player, callAmount + raiseAmount);
        const nextCommitted = player.committed + commitAmount;
        const raisedSession = updatePlayer(session, player.id, { committed: nextCommitted });
        return startNpcThinking({
            ...raisedSession,
            currentBet: nextCommitted,
            pot: session.pot + commitAmount,
        }, `你加注到 ${nextCommitted} 文，本轮摸后行动结束。`);
    }
    if (action === "call" || callAmount > 0) {
        const commitAmount = getAffordableCommit(session, player, callAmount);
        const calledSession = updatePlayer(session, player.id, { committed: player.committed + commitAmount });
        return startNpcThinking({
            ...calledSession,
            pot: session.pot + commitAmount,
        }, callAmount === 0 ? "你选择跟牌，本轮摸后行动结束。" : `你跟注 ${callAmount} 文，本轮摸后行动结束。`);
    }
    return startNpcThinking(session, "你让牌，本轮摸后行动结束。");
}
function skipTavernGambleMeld(session) {
    if (session.phase !== "meld-window") {
        return session;
    }
    if (session.meldWindow?.source === "discard") {
        return resumeAfterDiscardResponse({
            ...session,
            pendingMelds: [],
            meldWindow: null,
            meldCountdownTicks: 0,
        });
    }
    const player = getHumanPlayer(session);
    if (hasCompletedPlayedGroups(player)) {
        return startNpcThinking(session, "你已打出两组顺/刻，本局不再参与行动，等待结算。");
    }
    if (hasPlayableGroup(player, session)) {
        return {
            ...session,
            phase: "draw-discard",
            pendingMelds: [],
            meldWindow: null,
            meldCountdownTicks: 0,
            roundLog: [...session.roundLog, "没有声明杠，可继续打出顺/刻。"],
        };
    }
    return enterPostDrawDiscard(session, "没有声明杠，也没有可打出的顺/刻，请弃 2 张。");
}
function declareTavernGambleMeld(session, optionId) {
    if (session.phase !== "meld-window") {
        return session;
    }
    const option = session.pendingMelds.find((candidate) => candidate.id === optionId);
    if (option == null) {
        return session;
    }
    const player = getHumanPlayer(session);
    if (hasCompletedPlayedGroups(player)) {
        return startNpcThinking(session, "你已打出两组顺/刻，本局不再参与行动，等待结算。");
    }
    if (session.meldWindow?.source === "discard") {
        return declareDiscardResponseMeld(session, player, option);
    }
    const meld = {
        kind: option.kind,
        tileKey: option.tileKey,
        tileLabel: option.tileLabel,
        fan: option.fan,
    };
    const commitAmount = getAffordableCommit(session, player, option.raiseAmount);
    const nextCommitted = player.committed + commitAmount;
    const withMeld = updatePlayer(session, player.id, {
        exposedMelds: [...player.exposedMelds, meld],
        committed: nextCommitted,
        skipsDraw: option.kind === "pong",
    });
    const withRaise = commitAmount > 0
        ? {
            ...withMeld,
            currentBet: Math.max(withMeld.currentBet, nextCommitted),
            minRaise: Math.max(withMeld.minRaise, commitAmount),
            pot: withMeld.pot + commitAmount,
        }
        : withMeld;
    const log = option.kind === "pong"
        ? `你碰出 ${option.tileLabel}，本轮放弃摸牌。`
        : `你声明${getMeldKindLabel(option.kind)} ${option.tileLabel}，提前加注 ${option.raiseAmount} 文。`;
    return enterPostDrawDiscard(withRaise, log);
}
function declareDiscardResponseMeld(session, player, option) {
    const discardTileId = session.meldWindow?.discardTileId;
    const discardTile = session.publicDiscards.find((tile) => tile.id === discardTileId) ?? null;
    const claimTileIds = option.claimTileIds ?? [];
    const claimTiles = getClaimTiles(player, session, claimTileIds);
    if (discardTile == null) {
        return session;
    }
    const selectedTiles = [...claimTiles.ownTiles, ...claimTiles.publicTiles, discardTile];
    const groupKind = resolvePlayableGroupKind(selectedTiles);
    const isValidChi = option.kind === "chi" && groupKind === "sequence" && selectedTiles.length === 3;
    const isValidPong = option.kind === "pong" && selectedTiles.length === 3 && groupKind === "triplet";
    const isValidKong = option.kind === "public-kong" &&
        selectedTiles.length === 4 &&
        selectedTiles.every((tile) => getTavernMahjongTileKey(tile) === getTavernMahjongTileKey(discardTile));
    if (!isValidChi && !isValidPong && !isValidKong) {
        return session;
    }
    const drawn = drawNonFlowerTiles(session.wall, session.deadWall, claimTiles.ownTiles.length);
    const nextExposedMelds = option.kind === "chi"
        ? player.exposedMelds
        : [
            ...player.exposedMelds,
            {
                kind: option.kind,
                tileKey: option.tileKey,
                tileLabel: option.tileLabel,
                fan: option.fan,
            },
        ];
    const nextPlayedGroups = option.kind !== "chi"
        ? player.playedGroups
        : [
            ...player.playedGroups,
            {
                id: `played-${player.id}-${player.playedGroups.length + 1}`,
                kind: "sequence",
                tileLabels: selectedTiles.map(getTavernMahjongTileLabel),
                ownTileCount: claimTiles.ownTiles.length,
                usesPublicTile: true,
                fan: 0,
            },
        ];
    const nextPlayer = {
        ...player,
        hand: [
            ...player.hand.filter((tile) => !claimTiles.ownTiles.some((ownTile) => ownTile.id === tile.id)),
            ...drawn.tiles,
        ],
        flowers: [...player.flowers, ...drawn.flowers],
        exposedMelds: nextExposedMelds,
        playedGroups: nextPlayedGroups,
        playedOwnTileCount: option.kind === "chi"
            ? player.playedOwnTileCount + claimTiles.ownTiles.length
            : player.playedOwnTileCount,
        spentPublicTileIds: [
            ...getPlayerSpentPublicTileIds(player),
            ...claimTiles.publicTiles.map((tile) => tile.id),
        ],
        skipsDraw: option.kind === "pong",
    };
    const nextPlayerWithCovered = coverPublicSlots(nextPlayer, claimTiles.publicTiles.map((tile) => tile.id));
    const withClaim = {
        ...updatePlayer(session, player.id, nextPlayerWithCovered),
        wall: drawn.wall,
        deadWall: drawn.deadWall,
        publicDiscards: removeTileById(session.publicDiscards, discardTile.id),
        resolvedDiscardResponseTileIds: [...session.resolvedDiscardResponseTileIds, discardTile.id],
        pendingDrawTile: discardTile,
        pendingMelds: [],
        meldWindow: null,
        meldCountdownTicks: 0,
        selectedPlayTileIds: [],
        roundLog: [
            ...session.roundLog,
            `你${getMeldKindLabel(option.kind)} ${selectedTiles.map(getTavernMahjongTileLabel).join("、")}。`,
        ],
    };
    if (hasCompletedPlayedGroups(nextPlayerWithCovered)) {
        return startNpcThinking({
            ...withClaim,
            pendingDrawTile: null,
            pendingDiscardsRemaining: 0,
            selectedPlayTileIds: [],
        }, "你已打出两组顺/刻，本局后续行动跳过，等待结算。");
    }
    if (option.kind === "chi" && hasPlayableGroup(nextPlayerWithCovered, withClaim)) {
        return withClaim;
    }
    return enterDiscardMode(withClaim, 1, "响应碰/吃后请按传统规则弃 1 张。");
}
function drawForTavernGamble(session) {
    if (session.phase !== "draw-discard" || session.pendingDrawTile != null) {
        return session;
    }
    const player = getHumanPlayer(session);
    if (hasCompletedPlayedGroups(player)) {
        return startNpcThinking(session, "你已打出两组顺/刻，本局不再参与行动，等待结算。");
    }
    if (player.skipsDraw) {
        return startNpcThinking(updatePlayer(session, player.id, { skipsDraw: false }), "你本轮已经碰牌，跳过摸打。");
    }
    const drawn = drawNonFlowerTiles(session.wall, session.deadWall, getGambleDrawDiscardCount(session));
    const lastDrawnTile = drawn.tiles[drawn.tiles.length - 1];
    if (lastDrawnTile == null) {
        return session;
    }
    const nextPlayer = { ...player, hand: [...player.hand, ...drawn.tiles], flowers: [...player.flowers, ...drawn.flowers] };
    const withDrawn = {
        ...updatePlayer(session, player.id, nextPlayer),
        wall: drawn.wall,
        deadWall: drawn.deadWall,
        pendingDrawTile: lastDrawnTile,
        pendingDiscardsRemaining: 0,
        selectedPlayTileIds: [],
        roundLog: [
            ...session.roundLog,
            `你摸到 ${drawn.tiles.map(getTavernMahjongTileLabel).join("、")}。`,
        ],
    };
    if (canHumanLongHu(withDrawn)) {
        return {
            ...withDrawn,
            pendingHumanHu: true,
            roundLog: [...withDrawn.roundLog, "?????????????????"],
        };
    }
    const pendingMelds = getAvailableKongs(nextPlayer, withDrawn);
    if (pendingMelds.length > 0) {
        return {
            ...withDrawn,
            phase: "meld-window",
            pendingMelds,
            meldWindow: {
                source: "draw",
                stage: "kong",
                discardTileId: null,
                resumeNpcAfterSeat: null,
            },
            meldCountdownTicks: getGambleMeldResponseSeconds(session),
        };
    }
    if (isLongGamble(withDrawn)) {
        return enterPostDrawDiscard(withDrawn, "长牌摸 3 张后，请从暗牌或自己的明牌槽弃 3 张。");
    }
    if (!hasPlayableGroup(nextPlayer, withDrawn)) {
        return enterPostDrawDiscard(withDrawn, "摸后没有可打出的顺/刻，请弃 2 张。");
    }
    return {
        ...withDrawn,
        roundLog: [...withDrawn.roundLog, "摸后形成顺/刻，可从手牌和公共牌移入出牌槽打出。"],
    };
}
function toggleTavernGamblePlayTile(session, tileId) {
    if (session.phase !== "draw-discard" || session.pendingDrawTile == null) {
        return session;
    }
    const player = getHumanPlayer(session);
    if (getPlayerSpentPublicTileIds(player).includes(tileId)) {
        return session;
    }
    const tile = [...player.hand, ...getAvailablePublicTiles(session, player)].find((candidate) => candidate.id === tileId);
    if (tile == null) {
        return session;
    }
    const selectionCap = Math.max(1, session.pendingDiscardsRemaining > 0 ? session.pendingDiscardsRemaining : 3);
    const selected = session.selectedPlayTileIds.includes(tileId)
        ? session.selectedPlayTileIds.filter((selectedId) => selectedId !== tileId)
        : [...session.selectedPlayTileIds, tileId].slice(-selectionCap);
    return { ...session, selectedPlayTileIds: selected };
}
function confirmSelectedTavernGambleDiscards(session) {
    if (session.phase !== "draw-discard" ||
        session.pendingDrawTile == null ||
        session.pendingDiscardsRemaining <= 0 ||
        session.selectedPlayTileIds.length === 0) {
        return session;
    }
    let nextSession = { ...session };
    const discardQueue = nextSession.selectedPlayTileIds.slice(0, nextSession.pendingDiscardsRemaining);
    nextSession = { ...nextSession, selectedPlayTileIds: [] };
    for (const tileId of discardQueue) {
        const before = nextSession;
        nextSession = discardForTavernGamble(nextSession, tileId);
        if (nextSession === before) {
            break;
        }
        if (nextSession.phase !== "draw-discard") {
            return nextSession;
        }
    }
    return nextSession;
}
function clearTavernGamblePlaySlot(session) {
    if (session.phase !== "draw-discard") {
        return session;
    }
    return { ...session, selectedPlayTileIds: [] };
}
function passTavernGamblePlayGroups(session) {
    if (session.phase !== "draw-discard" || session.pendingDrawTile == null) {
        return session;
    }
    return enterPostDrawDiscard({ ...session, selectedPlayTileIds: [] }, "你不再打出顺/刻，请弃 2 张。");
}
function confirmTavernGamblePlayGroup(session) {
    if (session.phase !== "draw-discard" || session.pendingDrawTile == null || session.selectedPlayTileIds.length !== 3) {
        return session;
    }
    const player = getHumanPlayer(session);
    const availablePublicTiles = getAvailablePublicTiles(session, player);
    const selectedTiles = session.selectedPlayTileIds
        .map((tileId) => [...player.hand, ...availablePublicTiles].find((tile) => tile.id === tileId) ?? null)
        .filter((tile) => tile != null);
    if (selectedTiles.length !== 3) {
        return session;
    }
    const groupKind = resolvePlayableGroupKind(selectedTiles);
    if (groupKind == null) {
        return session;
    }
    const ownTileIds = new Set(player.hand.map((tile) => tile.id));
    const publicTileIds = new Set(availablePublicTiles.map((tile) => tile.id));
    const ownSelectedTiles = selectedTiles.filter((tile) => ownTileIds.has(tile.id));
    const publicSelectedTiles = selectedTiles.filter((tile) => publicTileIds.has(tile.id));
    const drawn = drawNonFlowerTiles(session.wall, session.deadWall, ownSelectedTiles.length);
    const playedGroup = {
        id: `played-${player.id}-${player.playedGroups.length + 1}`,
        kind: groupKind,
        tileLabels: selectedTiles.map(getTavernMahjongTileLabel),
        ownTileCount: ownSelectedTiles.length,
        usesPublicTile: publicSelectedTiles.length > 0,
        fan: publicSelectedTiles.length > 0 ? 0 : 1,
    };
    const nextOwnCount = player.playedOwnTileCount + ownSelectedTiles.length;
    const nextPlayer = {
        ...player,
        hand: [
            ...player.hand.filter((tile) => !session.selectedPlayTileIds.includes(tile.id)),
            ...drawn.tiles,
        ],
        flowers: [...player.flowers, ...drawn.flowers],
        playedGroups: [...player.playedGroups, playedGroup],
        playedOwnTileCount: nextOwnCount,
        spentPublicTileIds: [...getPlayerSpentPublicTileIds(player), ...publicSelectedTiles.map((tile) => tile.id)],
    };
    const nextPlayerWithCovered = coverPublicSlots(nextPlayer, publicSelectedTiles.map((tile) => tile.id));
    const withPlayed = {
        ...updatePlayer(session, player.id, nextPlayerWithCovered),
        wall: drawn.wall,
        deadWall: drawn.deadWall,
        selectedPlayTileIds: [],
        roundLog: [
            ...session.roundLog,
            `你打出${playedGroup.usesPublicTile ? "明" : "暗"}${groupKind === "sequence" ? "顺" : "刻"}：${playedGroup.tileLabels.join("、")}，补 ${ownSelectedTiles.length} 张。`,
        ],
    };
    if (hasCompletedPlayedGroups(nextPlayerWithCovered)) {
        return startNpcThinking({
            ...withPlayed,
            pendingDrawTile: null,
            pendingDiscardsRemaining: 0,
            selectedPlayTileIds: [],
        }, `你已打出两组顺/刻，本局后续行动跳过，等待结算。`);
    }
    const withEarlyLog = nextOwnCount >= TAVERN_GAMBLE_SHOWDOWN_SIZE
        ? {
            ...withPlayed,
            roundLog: [...withPlayed.roundLog, `你已打出 ${nextOwnCount} 张自己的牌，提前胡加番。`],
        }
        : withPlayed;
    if (hasPlayableGroup(nextPlayerWithCovered, withPlayed)) {
        return withEarlyLog;
    }
    return enterPostDrawDiscard(withEarlyLog, "没有新的顺/刻可打，请弃 2 张。");
}
function discardForTavernGamble(session, tileId) {
    if (session.phase !== "draw-discard" || session.pendingDrawTile == null || session.pendingDiscardsRemaining <= 0) {
        return session;
    }
    const player = getHumanPlayer(session);
    let nextPlayerBase = player;
    let discarded = player.hand.find((tile) => tile.id === tileId) ?? null;
    let unclaimable = false;
    if (discarded == null && isLongGamble(session)) {
        const publicDiscard = coverPublicSlotWithReplacement(player, tileId);
        nextPlayerBase = publicDiscard.player;
        discarded = publicDiscard.discarded;
        unclaimable = publicDiscard.unclaimable;
    }
    if (discarded == null) {
        return session;
    }
    const remainingDiscards = session.pendingDiscardsRemaining - 1;
    const nextPlayer = {
        ...nextPlayerBase,
        hand: discarded.id === tileId ? removeTileById(nextPlayerBase.hand, tileId) : nextPlayerBase.hand,
        discarded: [...player.discarded, discarded],
    };
    const nextUnclaimableDiscardTileIds = unclaimable
        ? [...(session.unclaimableDiscardTileIds ?? []), discarded.id]
        : (session.unclaimableDiscardTileIds ?? []);
    const withDiscard = {
        ...updatePlayer(session, player.id, remainingDiscards === 0 && !isLongGamble(session) ? normalizeHand(nextPlayer) : nextPlayer),
        publicDiscards: [...session.publicDiscards, discarded],
        unclaimableDiscardTileIds: nextUnclaimableDiscardTileIds,
        pendingDiscardsRemaining: remainingDiscards,
    };
    if (remainingDiscards > 0) {
        return {
            ...withDiscard,
            roundLog: [
                ...session.roundLog,
                `你打出 ${getTavernMahjongTileLabel(discarded)}，还需打出 ${remainingDiscards} 张。`,
            ],
        };
    }
    return startNpcThinking({
        ...withDiscard,
        pendingDrawTile: null,
    }, `你打出 ${getTavernMahjongTileLabel(discarded)}。`);
}
function hasPlayableGroup(player, session) {
    const availablePublicTiles = getAvailablePublicTiles(session, player);
    const tiles = [...player.hand, ...availablePublicTiles].filter((tile) => tile.kind !== "flower");
    return combinations(tiles, 3).some((candidate) => resolvePlayableGroupKind(candidate) != null);
}
function resolvePlayableGroupKind(tiles) {
    if (tiles.length !== 3 || tiles.some((tile) => tile.kind === "flower")) {
        return null;
    }
    const keys = tiles.map(getTavernMahjongTileKey);
    if (keys.every((key) => key === keys[0])) {
        return "triplet";
    }
    const suited = tiles.filter((tile) => tile.kind === "suited");
    if (suited.length !== 3 || new Set(suited.map((tile) => tile.suit)).size !== 1) {
        return null;
    }
    const ranks = suited.map((tile) => tile.rank).sort((left, right) => left - right);
    return ranks[0] != null && ranks[1] === ranks[0] + 1 && ranks[2] === ranks[1] + 1 ? "sequence" : null;
}
function reorderTavernGambleHand(session, tileId, beforeTileId) {
    const player = getHumanPlayer(session);
    if (beforeTileId === tileId) {
        return session;
    }
    if (isLongGamble(session) && session.street !== "pre-flop") {
        const visibleOrder = getLongVisibleTileOrder(player);
        if (!visibleOrder.includes(tileId)) {
            return session;
        }
        const withoutMoving = visibleOrder.filter((id) => id !== tileId);
        const insertIndex = beforeTileId == null ? withoutMoving.length : withoutMoving.findIndex((id) => id === beforeTileId);
        const nextOrder = insertIndex < 0
            ? [...withoutMoving, tileId]
            : [...withoutMoving.slice(0, insertIndex), tileId, ...withoutMoving.slice(insertIndex)];
        return updatePlayer(session, player.id, { longTileOrder: nextOrder });
    }
    const movingTile = player.hand.find((tile) => tile.id === tileId);
    if (movingTile == null) {
        return session;
    }
    const withoutMoving = player.hand.filter((tile) => tile.id !== tileId);
    const insertIndex = beforeTileId == null
        ? withoutMoving.length
        : withoutMoving.findIndex((tile) => tile.id === beforeTileId);
    const nextHand = insertIndex < 0
        ? [...withoutMoving, movingTile]
        : [
            ...withoutMoving.slice(0, insertIndex),
            movingTile,
            ...withoutMoving.slice(insertIndex),
        ];
    return updatePlayer(session, player.id, { hand: nextHand });
}
function advanceTavernLongPublicReveal(session) {
    if (!isLongGamble(session) || (session.longPublicRevealTicks ?? 0) <= 0) {
        return session;
    }
    return {
        ...session,
        longPublicRevealTicks: Math.max(0, (session.longPublicRevealTicks ?? 0) - 1),
    };
}
function advanceTavernGambleNpcThinking(session) {
    if (session.phase !== "npc-thinking" || session.npcThinkingSeat == null) {
        return session;
    }
    if (session.npcThinkTicksRemaining > 1) {
        return { ...session, npcThinkTicksRemaining: session.npcThinkTicksRemaining - 1 };
    }
    const player = session.players.find((candidate) => candidate.seatIndex === session.npcThinkingSeat);
    if (player == null || player.isHuman || player.folded) {
        return continueNpcThinking(session, session.npcThinkingSeat);
    }
    if (player.skipsDraw) {
        const skipped = updatePlayer(session, player.id, { skipsDraw: false });
        return continueNpcThinking({
            ...skipped,
            roundLog: [...session.roundLog, `${player.name} 本轮已经碰牌，跳过摸打。`],
        }, player.seatIndex);
    }
    const drawn = drawNonFlowerTiles(session.wall, session.deadWall, getGambleDrawDiscardCount(session));
    const withDrawn = { ...player, hand: [...player.hand, ...drawn.tiles], flowers: [...player.flowers, ...drawn.flowers] };
    const longHu = resolveLongHuIfAny({
        ...updatePlayer(session, player.id, withDrawn),
        wall: drawn.wall,
        deadWall: drawn.deadWall,
    }, `${player.name} 摸牌后成胡，牌局立即结算。`);
    if (longHu.phase === "finished") {
        return longHu;
    }
    if (isLongGamble(session)) {
        const npcDecision = resolveNpcDrawBetting({
            ...updatePlayer(session, player.id, withDrawn),
            wall: drawn.wall,
            deadWall: drawn.deadWall,
        }, withDrawn);
        if (npcDecision.player.folded) {
            const folded = updatePlayer(session, player.id, npcDecision.player);
            return continueNpcThinking({
                ...folded,
                wall: drawn.wall,
                deadWall: drawn.deadWall,
                pot: npcDecision.pot,
                roundLog: [...session.roundLog, `${player.name} 摸牌后弃牌。`],
            }, player.seatIndex);
        }
        const npcDiscardDecision = chooseNpcDiscards(npcDecision.player, getGambleDrawDiscardCount(session), session);
        const discards = npcDiscardDecision.discards;
        return continueNpcThinking({
            ...updatePlayer(session, player.id, {
                ...npcDiscardDecision.player,
                discarded: [...npcDecision.player.discarded, ...discards],
            }),
            wall: drawn.wall,
            deadWall: drawn.deadWall,
            pot: npcDecision.pot,
            publicDiscards: [...session.publicDiscards, ...discards],
            unclaimableDiscardTileIds: [
                ...(session.unclaimableDiscardTileIds ?? []),
                ...npcDiscardDecision.unclaimableTileIds,
            ],
            roundLog: [
                ...session.roundLog,
                `${player.name} 摸后拆牌打出 ${discards.map(getTavernMahjongTileLabel).join("、")}。`,
            ],
        }, player.seatIndex);
    }
    const npcPlayed = resolveNpcPlayedGroups({
        ...session,
        wall: drawn.wall,
        deadWall: drawn.deadWall,
    }, withDrawn);
    if (hasCompletedPlayedGroups(npcPlayed.player)) {
        return continueNpcThinking({
            ...updatePlayer(npcPlayed.session, player.id, npcPlayed.player),
            roundLog: [
                ...npcPlayed.session.roundLog,
                `${player.name} 已打出两组顺/刻，本局后续行动跳过。`,
            ],
        }, player.seatIndex);
    }
    const npcDecision = resolveNpcDrawBetting(npcPlayed.session, npcPlayed.player);
    if (npcDecision.player.folded) {
        const folded = updatePlayer(npcPlayed.session, player.id, npcDecision.player);
        return continueNpcThinking({
            ...folded,
            roundLog: [...npcPlayed.session.roundLog, `${player.name} 摸牌后弃牌。`],
        }, player.seatIndex);
    }
    const npcDiscardDecision = chooseNpcDiscards(npcDecision.player, getGambleDrawDiscardCount(session), session);
    const discards = npcDiscardDecision.discards;
    const discardedIds = new Set(discards.map((discard) => discard.id));
    const normalized = isLongGamble(session)
        ? {
            ...npcDiscardDecision.player,
            discarded: [...npcDiscardDecision.player.discarded, ...discards],
        }
        : normalizeHand({
            ...npcDiscardDecision.player,
            hand: npcDiscardDecision.player.hand.filter((tile) => !discardedIds.has(tile.id)),
            discarded: [...npcDecision.player.discarded, ...discards],
        });
    return continueNpcThinking({
        ...updatePlayer(npcPlayed.session, player.id, normalized),
        pot: npcDecision.pot,
        publicDiscards: [...npcPlayed.session.publicDiscards, ...discards],
        unclaimableDiscardTileIds: [
            ...(npcPlayed.session.unclaimableDiscardTileIds ?? []),
            ...npcDiscardDecision.unclaimableTileIds,
        ],
        roundLog: [
            ...npcPlayed.session.roundLog,
            ...(normalized.playedOwnTileCount >= TAVERN_GAMBLE_SHOWDOWN_SIZE
                ? [`${player.name} 已打出 ${normalized.playedOwnTileCount} 张自己的牌，提前胡加番。`]
                : []),
            `${player.name} 摸后打出 ${discards.map(getTavernMahjongTileLabel).join("、")}。`,
        ],
    }, player.seatIndex);
}
function advanceTavernGambleMeldCountdown(session) {
    if (session.phase !== "meld-window") {
        return session;
    }
    if (session.meldCountdownTicks <= 1) {
        if (session.meldWindow?.source === "discard") {
            return advanceDiscardResponseStage({
                ...session,
                meldCountdownTicks: 0,
            });
        }
        return skipTavernGambleMeld({
            ...session,
            meldCountdownTicks: 0,
        });
    }
    return {
        ...session,
        meldCountdownTicks: session.meldCountdownTicks - 1,
    };
}
function resolveTavernGambleShowdown(session) {
    const showdown = session.players.map((player) => scoreTavernGambleSessionPlayer(session, player)).sort(compareShowdownResults);
    return {
        ...session,
        phase: "finished",
        street: "showdown",
        showdown,
        roundLog: [...session.roundLog, "摊牌完成，从 4 张手牌与 9 张公共牌中选最佳 6 张比番。"],
    };
}
function resolveLongHuIfAny(session, log) {
    if (!isLongGamble(session)) {
        return session;
    }
    const showdown = session.players.map((player) => scoreTavernGambleSessionPlayer(session, player)).sort(compareShowdownResults);
    if (!showdown.some((result) => !result.folded && result.bestScore.validHu && result.totalFan > 0)) {
        return session;
    }
    return {
        ...session,
        phase: "finished",
        street: "showdown",
        showdown,
        pendingDrawTile: null,
        pendingDiscardsRemaining: 0,
        selectedPlayTileIds: [],
        pendingMelds: [],
        meldWindow: null,
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        roundLog: [...session.roundLog, log],
    };
}
function canHumanLongHu(session) {
    if (!isLongGamble(session)) {
        return false;
    }
    const human = getHumanPlayer(session);
    const result = scoreTavernGambleSessionPlayer(session, human);
    return !result.folded && result.bestScore.validHu && result.totalFan > 0;
}
function pushHumanLongHu(session) {
    if (!session.pendingHumanHu || !canHumanLongHu(session)) {
        return session;
    }
    return resolveLongHuIfAny({
        ...session,
        pendingHumanHu: false,
    }, "你推牌胡了，牌局立即结算。");
}
function passHumanLongHu(session) {
    if (!session.pendingHumanHu || !isLongGamble(session)) {
        return session;
    }
    return enterPostDrawDiscard({
        ...session,
        pendingHumanHu: false,
    }, "你选择不推胡，继续弃 3 张。");
}
function getTavernGambleWinners(session) {
    const showdown = session.showdown ?? [];
    const top = showdown[0];
    if (top == null) {
        return [];
    }
    return showdown.filter((result) => compareRankKeys(result.rankKey, top.rankKey) === 0);
}
function scoreTavernGamblePlayer(player, publicTiles) {
    const bestScore = scoreBestSix([...player.hand, ...publicTiles], player);
    const totalFan = player.folded || !bestScore.validHu ? 0 : bestScore.totalFan;
    const rankKey = [
        totalFan,
        bestScore.mainFan,
        bestScore.groupRank,
        bestScore.purityRank,
        bestScore.pairRank,
        bestScore.flowerCount,
        bestScore.kongCount,
        bestScore.handContribution,
    ];
    return { playerId: player.id, playerName: player.name, bestScore, totalFan, rankKey, folded: player.folded };
}
function scoreTavernGambleSessionPlayer(session, player) {
    if (!isLongGamble(session)) {
        return scoreTavernGamblePlayer(player, session.publicTiles);
    }
    const bestScore = scoreBestLongHand([...player.hand, ...getPlayerScoringPublicTiles(session, player)], player);
    const totalFan = player.folded || !bestScore.validHu ? 0 : bestScore.totalFan;
    const rankKey = [
        totalFan,
        bestScore.mainFan,
        bestScore.groupRank,
        bestScore.purityRank,
        bestScore.pairRank,
        bestScore.flowerCount,
        bestScore.kongCount,
        bestScore.handContribution,
    ];
    return { playerId: player.id, playerName: player.name, bestScore, totalFan, rankKey, folded: player.folded };
}
function advanceAfterBetting(session, playerLog) {
    const npcSession = runNpcBetting(session);
    const next = { ...npcSession, roundLog: [...npcSession.roundLog, playerLog, "其余玩家完成开局下注行动。"] };
    return advanceStreet(next, "开局下注已定。");
}
function runNpcBetting(session) {
    let next = session;
    for (const player of next.players) {
        if (player.isHuman || player.folded || hasCompletedPlayedGroups(player)) {
            continue;
        }
        const callAmount = Math.max(0, next.currentBet - player.committed);
        const shouldFold = next.bettingRound >= 3 && player.seatIndex === 3 && callAmount > 0;
        if (shouldFold) {
            next = updatePlayer(next, player.id, { folded: true });
            continue;
        }
        const commitAmount = getAffordableCommit(next, player, callAmount);
        next = updatePlayer(next, player.id, { committed: player.committed + commitAmount });
        next = { ...next, pot: next.pot + commitAmount };
    }
    return next;
}
function revealNextPublicTiles(session) {
    const revealCount = session.street === "pre-flop" ? 5 : 2;
    const revealed = drawNonFlowerTiles(session.wall, session.deadWall, revealCount);
    const nextPublic = revealed.tiles;
    const nextStreet = session.street === "pre-flop" ? "flop" : session.street === "flop" ? "turn" : "river";
    return {
        ...session,
        street: nextStreet,
        wall: revealed.wall,
        deadWall: revealed.deadWall,
        publicTiles: [...session.publicTiles, ...nextPublic].slice(0, TAVERN_GAMBLE_PUBLIC_TILE_COUNT),
        currentBet: 0,
        bettingRound: session.bettingRound + 1,
        roundLog: [
            ...session.roundLog,
            `${getStreetLabel(nextStreet)}发出：${nextPublic.map(getTavernMahjongTileLabel).join("、")}。`,
            ...(revealed.flowers.length > 0 ? [`公共牌摸到花牌 ${revealed.flowers.map(getTavernMahjongTileLabel).join("、")}，已从牌尾补牌。`] : []),
        ],
    };
}
function enterPostDrawDiscard(session, log) {
    return enterDiscardMode(session, getGambleDrawDiscardCount(session), log);
}
function enterDiscardMode(session, discardCount, log) {
    return {
        ...session,
        phase: "draw-discard",
        pendingHumanHu: false,
        pendingMelds: [],
        meldWindow: null,
        selectedPlayTileIds: [],
        pendingDiscardsRemaining: discardCount,
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        roundLog: [...session.roundLog, log],
    };
}
function startDrawDiscard(session, log) {
    const nextSession = {
        ...session,
        phase: "draw-discard",
        pendingHumanHu: false,
        pendingMelds: [],
        meldWindow: null,
        pendingDrawTile: null,
        pendingDiscardsRemaining: 0,
        selectedPlayTileIds: [],
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        roundLog: [
            ...session.roundLog,
            log,
            isLongGamble(session)
                ? "长牌轮次：未弃牌玩家依次摸 3 张，再从暗牌或自己的明牌槽弃 3 张。"
                : "开牌后，未弃牌玩家依次摸 2 张；若能组成顺/刻，可连续打出并按自己贡献牌数补牌。",
        ],
    };
    const human = getHumanPlayer(nextSession);
    if (hasCompletedPlayedGroups(human)) {
        return startNpcThinking(nextSession, "你已打出两组顺/刻，本轮跳过行动。");
    }
    return nextSession;
}
function advanceStreet(session, log) {
    if (isLongGamble(session)) {
        return advanceLongStreet(session, log);
    }
    if (session.street === "river") {
        return resolveTavernGambleShowdown({
            ...session,
            pendingDrawTile: null,
            pendingDiscardsRemaining: 0,
            selectedPlayTileIds: [],
            meldCountdownTicks: 0,
            npcThinkingSeat: null,
            npcThinkTicksRemaining: 0,
            roundLog: [...session.roundLog, log],
        });
    }
    const withPublic = revealNextPublicTiles({
        ...session,
        pendingDrawTile: null,
        pendingDiscardsRemaining: 0,
        pendingMelds: [],
        meldWindow: null,
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        roundLog: [...session.roundLog, log],
    });
    return startDrawDiscard({
        ...withPublic,
        minRaise: TAVERN_GAMBLE_BIG_BLIND,
    }, "公共牌已开，庄家先摸牌。");
}
function advanceLongStreet(session, log) {
    const cleared = {
        ...session,
        pendingDrawTile: null,
        pendingDiscardsRemaining: 0,
        pendingMelds: [],
        meldWindow: null,
        meldCountdownTicks: 0,
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        selectedPlayTileIds: [],
        roundLog: [...session.roundLog, log],
    };
    if (session.phase !== "betting") {
        return {
            ...cleared,
            phase: "betting",
            currentBet: 0,
            minRaise: TAVERN_GAMBLE_BIG_BLIND,
            bettingRound: session.bettingRound + 1,
            longPublicRevealTicks: 0,
            roundLog: [...cleared.roundLog, "本轮摸打结束，进入下一轮下注。"],
        };
    }
    if (session.street === "river") {
        return resolveTavernGambleShowdown(cleared);
    }
    const nextStreet = session.street === "pre-flop" ? "flop" : session.street === "flop" ? "turn" : "river";
    return startDrawDiscard({
        ...cleared,
        street: nextStreet,
        currentBet: 0,
        minRaise: TAVERN_GAMBLE_BIG_BLIND,
        longPublicRevealTicks: session.street === "pre-flop" ? TAVERN_LONG_GAMBLE_REVEAL_TICKS : 0,
    }, `${getStreetLabel(nextStreet)}下注完成，开始摸 3 打 3。`);
}
function startNpcThinking(session, log) {
    const firstNpc = findNextNpcDrawPlayer(session, 0);
    if (firstNpc == null) {
        return advanceStreet(session, log);
    }
    const delay = getNpcThinkDelay(session, firstNpc);
    return {
        ...session,
        phase: "npc-thinking",
        pendingDrawTile: null,
        pendingDiscardsRemaining: 0,
        selectedPlayTileIds: [],
        pendingMelds: [],
        meldWindow: null,
        meldCountdownTicks: 0,
        npcThinkingSeat: firstNpc.seatIndex,
        npcThinkTicksRemaining: delay,
        roundLog: [...session.roundLog, log, `${firstNpc.name} 正在思考...`],
    };
}
function openHumanDiscardResponseWindow(session, discardTile, resumeNpcAfterSeat) {
    if (discardTile == null ||
        session.resolvedDiscardResponseTileIds.includes(discardTile.id) ||
        session.meldWindow != null ||
        (session.unclaimableDiscardTileIds ?? []).includes(discardTile.id)) {
        return session;
    }
    const human = getHumanPlayer(session);
    if (human.folded || hasCompletedPlayedGroups(human)) {
        return {
            ...session,
            resolvedDiscardResponseTileIds: [...session.resolvedDiscardResponseTileIds, discardTile.id],
        };
    }
    const options = getDiscardResponseOptions(human, session, discardTile, "chi-pong-kong");
    if (options.length === 0) {
        return {
            ...session,
            resolvedDiscardResponseTileIds: [...session.resolvedDiscardResponseTileIds, discardTile.id],
        };
    }
    return {
        ...session,
        phase: "meld-window",
        pendingMelds: options,
        meldWindow: {
            source: "discard",
            stage: "chi-pong-kong",
            discardTileId: discardTile.id,
            resumeNpcAfterSeat,
        },
        meldCountdownTicks: getDiscardResponseSeconds(session),
        npcThinkingSeat: null,
        npcThinkTicksRemaining: 0,
        roundLog: [...session.roundLog, "弃牌响应：3 秒内可吃/碰/杠。"],
    };
}
function advanceDiscardResponseStage(session) {
    const window = session.meldWindow;
    if (window?.source !== "discard" || window.discardTileId == null) {
        return skipTavernGambleMeld(session);
    }
    const nextStage = getNextDiscardResponseStage(window.stage);
    if (nextStage == null) {
        return resumeAfterDiscardResponse(session);
    }
    const discardTile = session.publicDiscards.find((tile) => tile.id === window.discardTileId) ?? null;
    const options = discardTile == null ? [] : getDiscardResponseOptions(getHumanPlayer(session), session, discardTile, nextStage);
    if (options.length === 0) {
        return resumeAfterDiscardResponse({
            ...session,
            meldWindow: { ...window, stage: nextStage },
        });
    }
    return {
        ...session,
        pendingMelds: options,
        meldWindow: { ...window, stage: nextStage },
        meldCountdownTicks: getDiscardResponseSeconds(session),
        roundLog: [...session.roundLog, "响应窗口继续缩小，剩余可用动作闪烁。"],
    };
}
function getNextDiscardResponseStage(stage) {
    if (stage === "chi-pong-kong")
        return "pong-kong";
    if (stage === "pong-kong")
        return "kong";
    return null;
}
function resumeAfterDiscardResponse(session) {
    const discardTileId = session.meldWindow?.discardTileId;
    const previousSeat = session.meldWindow?.resumeNpcAfterSeat ?? 0;
    const resolved = discardTileId == null || session.resolvedDiscardResponseTileIds.includes(discardTileId)
        ? session.resolvedDiscardResponseTileIds
        : [...session.resolvedDiscardResponseTileIds, discardTileId];
    return continueNpcThinking({
        ...session,
        phase: "npc-thinking",
        pendingMelds: [],
        meldWindow: null,
        resolvedDiscardResponseTileIds: resolved,
        meldCountdownTicks: 0,
        selectedPlayTileIds: [],
    }, previousSeat);
}
function continueNpcThinking(session, previousSeat) {
    const latestDiscard = session.publicDiscards[session.publicDiscards.length - 1] ?? null;
    const responseWindow = openHumanDiscardResponseWindow(session, latestDiscard, previousSeat);
    if (responseWindow.phase === "meld-window") {
        return responseWindow;
    }
    const nextNpc = findNextNpcDrawPlayer(responseWindow, previousSeat);
    if (nextNpc == null) {
        return advanceStreet({
            ...responseWindow,
            npcThinkingSeat: null,
            npcThinkTicksRemaining: 0,
        }, "其余玩家摸打结束。");
    }
    const delay = getNpcThinkDelay(responseWindow, nextNpc);
    return {
        ...responseWindow,
        npcThinkingSeat: nextNpc.seatIndex,
        npcThinkTicksRemaining: delay,
        roundLog: [...session.roundLog, `${nextNpc.name} 正在思考...`],
    };
}
function findNextNpcDrawPlayer(session, previousSeat) {
    return ([...session.players]
        .sort((left, right) => left.seatIndex - right.seatIndex)
        .find((player) => !player.isHuman &&
        !player.folded &&
        !hasCompletedPlayedGroups(player) &&
        player.seatIndex > previousSeat) ?? null);
}
function hasCompletedPlayedGroups(player) {
    return player.playedGroups.length >= TAVERN_GAMBLE_PLAYED_GROUP_TARGET;
}
function getPlayerSpentPublicTileIds(player) {
    return player.spentPublicTileIds ?? [];
}
function isLongGamble(session) {
    return session.variant === "long";
}
function getLongVisibleTileOrder(player) {
    const visibleIds = [
        ...player.hand.map((tile) => tile.id),
        ...getOpenPublicSlotTiles(player).map((tile) => tile.id),
    ];
    if (visibleIds.length === 0) {
        return [];
    }
    const preferred = player.longTileOrder ?? [];
    const preferredVisible = preferred.filter((id) => visibleIds.includes(id));
    const missing = visibleIds.filter((id) => !preferredVisible.includes(id));
    return [...preferredVisible, ...missing];
}
function getGambleDrawDiscardCount(session) {
    return isLongGamble(session) ? TAVERN_LONG_GAMBLE_DRAW_DISCARD_COUNT : TAVERN_GAMBLE_DRAW_DISCARD_COUNT;
}
function getGambleMeldResponseSeconds(session) {
    return isLongGamble(session) ? TAVERN_LONG_GAMBLE_MELD_RESPONSE_SECONDS : TAVERN_GAMBLE_MELD_RESPONSE_SECONDS;
}
function getDiscardResponseSeconds(session) {
    return isLongGamble(session) ? TAVERN_LONG_GAMBLE_MELD_RESPONSE_SECONDS : TAVERN_GAMBLE_DISCARD_RESPONSE_SECONDS;
}
function getOpenPublicSlotTiles(player) {
    return (player.publicTileSlots ?? [])
        .filter((slot) => !slot.covered)
        .map((slot) => slot.tile);
}
function getPlayerScoringPublicTiles(session, player) {
    if (!isLongGamble(session)) {
        return session.publicTiles;
    }
    return (player.publicTileSlots ?? []).map((slot) => slot.tile);
}
function getAvailablePublicTiles(session, player) {
    if (isLongGamble(session)) {
        return getOpenPublicSlotTiles(player);
    }
    const spentPublicTileIds = new Set(getPlayerSpentPublicTileIds(player));
    return session.publicTiles.filter((tile) => !spentPublicTileIds.has(tile.id));
}
function coverPublicSlotWithReplacement(player, tileId) {
    const slots = player.publicTileSlots ?? [];
    const slot = slots.find((candidate) => candidate.tile.id === tileId && !candidate.covered);
    if (slot == null) {
        return { player, discarded: null, unclaimable: false };
    }
    const replacement = player.hand[player.hand.length - 1] ?? null;
    const nextSlots = slots.map((candidate) => candidate.id === slot.id
        ? {
            ...candidate,
            tile: replacement ?? candidate.tile,
            covered: true,
        }
        : candidate);
    return {
        player: syncLongTileOrder({
            ...player,
            hand: replacement == null ? player.hand : removeTileById(player.hand, replacement.id),
            publicTileSlots: nextSlots,
        }),
        discarded: slot.tile,
        unclaimable: true,
    };
}
function coverPublicSlots(player, tileIds) {
    if (tileIds.length === 0 || player.publicTileSlots == null) {
        return player;
    }
    const tileIdSet = new Set(tileIds);
    return syncLongTileOrder({
        ...player,
        publicTileSlots: player.publicTileSlots.map((slot) => tileIdSet.has(slot.tile.id) ? { ...slot, covered: true } : slot),
    });
}
function syncLongTileOrder(player) {
    return {
        ...player,
        longTileOrder: getLongVisibleTileOrder(player),
    };
}
function getNpcThinkDelay(session, player) {
    return 1 + ((session.bettingRound * 13 + player.seatIndex * 7 + session.wall.length) % 3);
}
function resolveNpcPlayedGroups(session, player) {
    let nextSession = session;
    let nextPlayer = player;
    let guard = 0;
    while (guard < 6 && !hasCompletedPlayedGroups(nextPlayer)) {
        guard += 1;
        const group = chooseNpcPlayableGroup(nextSession, nextPlayer);
        if (group == null) {
            break;
        }
        const ownTileIds = new Set(nextPlayer.hand.map((tile) => tile.id));
        const publicTileIds = new Set(getAvailablePublicTiles(nextSession, nextPlayer).map((tile) => tile.id));
        const ownTiles = group.filter((tile) => ownTileIds.has(tile.id));
        const publicTiles = group.filter((tile) => publicTileIds.has(tile.id));
        const drawn = drawNonFlowerTiles(nextSession.wall, nextSession.deadWall, ownTiles.length);
        const groupKind = resolvePlayableGroupKind(group);
        if (groupKind == null) {
            break;
        }
        const playedGroup = {
            id: `played-${nextPlayer.id}-${nextPlayer.playedGroups.length + 1}`,
            kind: groupKind,
            tileLabels: group.map(getTavernMahjongTileLabel),
            ownTileCount: ownTiles.length,
            usesPublicTile: publicTiles.length > 0,
            fan: publicTiles.length > 0 ? 0 : 1,
        };
        nextPlayer = {
            ...nextPlayer,
            hand: [
                ...nextPlayer.hand.filter((tile) => !ownTiles.some((ownTile) => ownTile.id === tile.id)),
                ...drawn.tiles,
            ],
            flowers: [...nextPlayer.flowers, ...drawn.flowers],
            playedGroups: [...nextPlayer.playedGroups, playedGroup],
            playedOwnTileCount: nextPlayer.playedOwnTileCount + ownTiles.length,
            spentPublicTileIds: [...getPlayerSpentPublicTileIds(nextPlayer), ...publicTiles.map((tile) => tile.id)],
        };
        nextPlayer = coverPublicSlots(nextPlayer, publicTiles.map((tile) => tile.id));
        nextSession = {
            ...nextSession,
            wall: drawn.wall,
            deadWall: drawn.deadWall,
            roundLog: [
                ...nextSession.roundLog,
                `${nextPlayer.name} 打出${playedGroup.usesPublicTile ? "明" : "暗"}${groupKind === "sequence" ? "顺" : "刻"}。`,
            ],
        };
    }
    return { session: nextSession, player: nextPlayer };
}
function chooseNpcPlayableGroup(session, player) {
    const availablePublicTiles = getAvailablePublicTiles(session, player);
    const candidates = combinations([...player.hand, ...availablePublicTiles], 3)
        .filter((candidate) => resolvePlayableGroupKind(candidate) != null)
        .sort((left, right) => {
        const ownTileIds = new Set(player.hand.map((tile) => tile.id));
        const leftOwn = left.filter((tile) => ownTileIds.has(tile.id)).length;
        const rightOwn = right.filter((tile) => ownTileIds.has(tile.id)).length;
        if (leftOwn !== rightOwn)
            return rightOwn - leftOwn;
        return getGroupTileRank(right) - getGroupTileRank(left);
    });
    return candidates[0] ?? null;
}
function getGroupTileRank(tiles) {
    return tiles.reduce((best, tile) => Math.max(best, getTileSortRank(tile)), 0);
}
function chooseNpcDiscard(player) {
    const counts = countByTileKey(player.hand);
    const discard = [...player.hand].sort((left, right) => {
        const leftCount = counts.get(getTavernMahjongTileKey(left)) ?? 0;
        const rightCount = counts.get(getTavernMahjongTileKey(right)) ?? 0;
        return leftCount === rightCount ? getTileSortRank(right) - getTileSortRank(left) : leftCount - rightCount;
    })[0];
    if (discard == null) {
        throw new Error("Tavern gambling NPC has no discard.");
    }
    return discard;
}
function chooseNpcDiscards(player, count, session) {
    if (isLongGamble(session)) {
        return chooseLongNpcDiscards(player, count, session);
    }
    let nextPlayer = player;
    const discards = [];
    const unclaimableTileIds = [];
    while (discards.length < count) {
        const shouldUsePublicSlot = isLongGamble(session) &&
            discards.length % 2 === 1 &&
            getOpenPublicSlotTiles(nextPlayer).length > 0 &&
            nextPlayer.hand.length > 0;
        if (shouldUsePublicSlot) {
            const slotTile = getOpenPublicSlotTiles(nextPlayer)[0];
            if (slotTile != null) {
                const publicDiscard = coverPublicSlotWithReplacement(nextPlayer, slotTile.id);
                if (publicDiscard.discarded != null) {
                    discards.push(publicDiscard.discarded);
                    unclaimableTileIds.push(publicDiscard.discarded.id);
                    nextPlayer = publicDiscard.player;
                    continue;
                }
            }
        }
        const discard = chooseNpcDiscard(nextPlayer);
        discards.push(discard);
        nextPlayer = { ...nextPlayer, hand: removeTileById(nextPlayer.hand, discard.id) };
    }
    return { player: nextPlayer, discards, unclaimableTileIds };
}
function chooseLongNpcDiscards(player, count, session) {
    let nextPlayer = player;
    const discards = [];
    const unclaimableTileIds = [];
    while (discards.length < count) {
        const candidates = [
            ...nextPlayer.hand.map((tile) => ({ kind: "hand", tile })),
            ...getOpenPublicSlotTiles(nextPlayer).map((tile) => ({ kind: "public", tile })),
        ];
        if (candidates.length === 0) {
            break;
        }
        const bestCandidate = candidates
            .map((candidate) => {
            if (candidate.kind === "public") {
                const covered = coverPublicSlotWithReplacement(nextPlayer, candidate.tile.id);
                const score = scoreTavernGambleSessionPlayer({ ...session, players: session.players.map((entry) => (entry.id === nextPlayer.id ? covered.player : entry)) }, covered.player);
                return { candidate, nextPlayer: covered.player, discarded: covered.discarded, unclaimable: covered.unclaimable, score };
            }
            const simulatedPlayer = {
                ...nextPlayer,
                hand: removeTileById(nextPlayer.hand, candidate.tile.id),
            };
            const score = scoreTavernGambleSessionPlayer({ ...session, players: session.players.map((entry) => (entry.id === nextPlayer.id ? simulatedPlayer : entry)) }, simulatedPlayer);
            return { candidate, nextPlayer: simulatedPlayer, discarded: candidate.tile, unclaimable: false, score };
        })
            .sort((left, right) => {
            if (left.score.totalFan !== right.score.totalFan) {
                return right.score.totalFan - left.score.totalFan;
            }
            if (Number(left.score.bestScore.validHu) !== Number(right.score.bestScore.validHu)) {
                return Number(right.score.bestScore.validHu) - Number(left.score.bestScore.validHu);
            }
            if (left.score.bestScore.mainFan !== right.score.bestScore.mainFan) {
                return right.score.bestScore.mainFan - left.score.bestScore.mainFan;
            }
            if (left.score.bestScore.handContribution !== right.score.bestScore.handContribution) {
                return right.score.bestScore.handContribution - left.score.bestScore.handContribution;
            }
            if (left.candidate.kind !== right.candidate.kind) {
                return left.candidate.kind === "public" ? -1 : 1;
            }
            return getTileSortRank(right.candidate.tile) - getTileSortRank(left.candidate.tile);
        })[0];
        if (bestCandidate == null || bestCandidate.discarded == null) {
            break;
        }
        nextPlayer = bestCandidate.nextPlayer;
        discards.push(bestCandidate.discarded);
        if (bestCandidate.unclaimable) {
            unclaimableTileIds.push(bestCandidate.discarded.id);
        }
    }
    return { player: nextPlayer, discards, unclaimableTileIds };
}
function resolveNpcDrawBetting(session, player) {
    const callAmount = Math.max(0, session.currentBet - player.committed);
    const shouldFold = session.bettingRound >= 3 && player.seatIndex === 3 && callAmount > 0;
    if (shouldFold) {
        return { player: { ...player, folded: true }, pot: session.pot };
    }
    const commitAmount = getAffordableCommit(session, player, callAmount);
    return {
        player: { ...player, committed: player.committed + commitAmount },
        pot: session.pot + commitAmount,
    };
}
function getAvailableKongs(player, session) {
    return getAvailableMelds(player, session).filter((option) => option.kind !== "pong");
}
function getDiscardResponseOptions(player, session, discardTile, stage) {
    const tileKey = getTavernMahjongTileKey(discardTile);
    const tileLabel = getTavernMahjongTileLabel(discardTile);
    const claimableTiles = getClaimableTiles(player, session);
    const sameKeyTiles = claimableTiles.filter((tile) => getTavernMahjongTileKey(tile) === tileKey);
    const options = [];
    if (stage === "chi-pong-kong") {
        options.push(...getDiscardChiOptions(player, session, discardTile));
    }
    if (stage === "chi-pong-kong" || stage === "pong-kong") {
        if (sameKeyTiles.length >= 2) {
            options.push({
                id: `pong:${discardTile.id}`,
                kind: "pong",
                tileKey,
                tileLabel,
                fan: 0,
                raiseAmount: 0,
                claimTileIds: sameKeyTiles.slice(0, 2).map((tile) => tile.id),
            });
        }
    }
    if (sameKeyTiles.length >= 3) {
        options.push({
            id: `public-kong:${discardTile.id}`,
            kind: "public-kong",
            tileKey,
            tileLabel,
            fan: 2,
            raiseAmount: 0,
            claimTileIds: sameKeyTiles.slice(0, 3).map((tile) => tile.id),
        });
    }
    return options;
}
function getDiscardChiOptions(player, session, discardTile) {
    if (discardTile.kind !== "suited") {
        return [];
    }
    const suitedClaimableTiles = getClaimableTiles(player, session).filter((tile) => tile.kind === "suited" && tile.suit === discardTile.suit);
    return combinations(suitedClaimableTiles, 2)
        .filter((tiles) => resolvePlayableGroupKind([...tiles, discardTile]) === "sequence")
        .map((tiles) => ({
        id: `chi:${discardTile.id}:${tiles.map((tile) => tile.id).join(":")}`,
        kind: "chi",
        tileKey: getTavernMahjongTileKey(discardTile),
        tileLabel: getTavernMahjongTileLabel(discardTile),
        fan: 0,
        raiseAmount: 0,
        claimTileIds: tiles.map((tile) => tile.id),
    }));
}
function getClaimableTiles(player, session) {
    return [...player.hand, ...getAvailablePublicTiles(session, player)];
}
function getClaimTiles(player, session, tileIds) {
    const remainingTileIds = [...tileIds];
    const takeRequestedTile = (tile) => {
        const index = remainingTileIds.indexOf(tile.id);
        if (index < 0) {
            return false;
        }
        remainingTileIds.splice(index, 1);
        return true;
    };
    const ownTiles = player.hand.filter(takeRequestedTile);
    const publicTiles = getAvailablePublicTiles(session, player).filter(takeRequestedTile);
    return remainingTileIds.length === 0 ? { ownTiles, publicTiles } : { ownTiles: [], publicTiles: [] };
}
function getAvailableMelds(player, session) {
    const counts = countByTileKey(player.hand);
    const publicCounts = countByTileKey(getAvailablePublicTiles(session, player));
    const options = [];
    for (const [tileKey, count] of counts.entries()) {
        const publicCount = publicCounts.get(tileKey) ?? 0;
        const tile = player.hand.find((candidate) => getTavernMahjongTileKey(candidate) === tileKey);
        if (tile == null) {
            continue;
        }
        const tileLabel = getTavernMahjongTileLabel(tile);
        if (count >= 4) {
            options.push({
                id: `concealed-kong:${tileKey}`,
                kind: "concealed-kong",
                tileKey,
                tileLabel,
                fan: 4,
                raiseAmount: TAVERN_GAMBLE_BIG_BLIND * 2,
            });
        }
        if (count >= 3 && publicCount >= 1) {
            options.push({
                id: `public-kong:${tileKey}`,
                kind: "public-kong",
                tileKey,
                tileLabel,
                fan: 2,
                raiseAmount: TAVERN_GAMBLE_BIG_BLIND,
            });
        }
        if (count >= 2 && publicCount >= 1) {
            options.push({ id: `pong:${tileKey}`, kind: "pong", tileKey, tileLabel, fan: 0, raiseAmount: 0 });
        }
    }
    return options.sort((left, right) => {
        const rank = { "concealed-kong": 4, "public-kong": 3, pong: 2, chi: 1 };
        return rank[right.kind] - rank[left.kind];
    });
}
function scoreBestSix(tiles, player) {
    const playedGroupTiles = (player.playedGroups ?? []).map(createVirtualPlayedGroupTiles);
    const fixedPlayedTiles = playedGroupTiles.flat().slice(0, TAVERN_GAMBLE_SHOWDOWN_SIZE);
    const ordinaryTiles = removePlayedLabelsFromCandidates(tiles.filter((tile) => tile.kind !== "flower"), fixedPlayedTiles.map(getTavernMahjongTileLabel));
    const meldTriplets = player.exposedMelds.map(createVirtualMeldTriplet);
    const neededFromCandidates = TAVERN_GAMBLE_SHOWDOWN_SIZE - fixedPlayedTiles.length;
    const candidates = fixedPlayedTiles.length >= TAVERN_GAMBLE_SHOWDOWN_SIZE
        ? [fixedPlayedTiles]
        : [
            ...combinations(ordinaryTiles, neededFromCandidates).map((rest) => [
                ...fixedPlayedTiles,
                ...rest,
            ]),
            ...meldTriplets.flatMap((triplet) => combinations(ordinaryTiles, neededFromCandidates - triplet.length).map((rest) => [
                ...fixedPlayedTiles,
                ...triplet,
                ...rest,
            ])),
            ...(neededFromCandidates === TAVERN_GAMBLE_SHOWDOWN_SIZE
                ? combinations(meldTriplets, 2).map(([left, right]) => [...left, ...right])
                : []),
        ];
    const scored = candidates.map((candidate) => scoreSix(candidate, player));
    scored.sort(compareScores);
    return scored[0] ?? createEmptyScore(player);
}
function removePlayedLabelsFromCandidates(tiles, playedLabels) {
    const remainingPlayedLabels = [...playedLabels];
    return tiles.filter((tile) => {
        const labelIndex = remainingPlayedLabels.indexOf(getTavernMahjongTileLabel(tile));
        if (labelIndex < 0) {
            return true;
        }
        remainingPlayedLabels.splice(labelIndex, 1);
        return false;
    });
}
function scoreSix(tiles, player) {
    const suitedTiles = tiles.filter((tile) => tile.kind === "suited");
    const suits = new Set(suitedTiles.map((tile) => tile.suit));
    const honors = tiles.filter((tile) => tile.kind === "honor");
    const hasHonor = honors.length > 0;
    const shape = resolveSixTileShape(tiles);
    const allSameSuit = suitedTiles.length === tiles.length && suits.size === 1;
    const mixedOneSuit = hasHonor && suitedTiles.length > 0 && suits.size === 1;
    const allTerminalsOrHonors = tiles.every((tile) => tile.kind === "honor" || (tile.kind === "suited" && (tile.rank === 1 || tile.rank === 9)));
    const allBig = suitedTiles.length === tiles.length && suitedTiles.every((tile) => tile.rank >= 7);
    const allMiddle = suitedTiles.length === tiles.length &&
        suitedTiles.every((tile) => tile.rank >= 4 && tile.rank <= 6);
    const allSmall = suitedTiles.length === tiles.length && suitedTiles.every((tile) => tile.rank <= 3);
    const allEven = suitedTiles.length === tiles.length && suitedTiles.every((tile) => tile.rank % 2 === 0);
    const bonusItems = [];
    if (shape.valid) {
        if (hasSameSequenceDifferentSuits(tiles))
            bonusItems.push({ label: "喜相逢", fan: 3 });
        if (hasCleanSixRun(tiles))
            bonusItems.push({ label: "连六", fan: 3 });
        if (hasStepStraightSameSuit(tiles))
            bonusItems.push({ label: "步步高", fan: 4 });
        if (hasOldYoungSameSuit(tiles))
            bonusItems.push({ label: "老少副", fan: 4 });
        if (hasIdenticalSequencesSameSuit(tiles))
            bonusItems.push({ label: "一般高", fan: 2 });
        if (hasSameRankTripletsDifferentSuits(tiles))
            bonusItems.push({ label: "双同刻", fan: 4 });
        if (hasTerminalPairOfTriplets(tiles))
            bonusItems.push({ label: "幺九双刻", fan: 4 });
        if (hasTwoHonorTriplets(tiles))
            bonusItems.push({ label: "字牌双刻", fan: 5 });
        if (allTerminalsOrHonors)
            bonusItems.push({ label: "清幺九", fan: 5 });
        if (allSameSuit)
            bonusItems.push({ label: "清一色", fan: 4 });
        if (mixedOneSuit)
            bonusItems.push({ label: "混一色", fan: 3 });
        if (allBig)
            bonusItems.push({ label: "全大", fan: 2 });
        if (allMiddle)
            bonusItems.push({ label: "全中", fan: 2 });
        if (allSmall)
            bonusItems.push({ label: "全小", fan: 2 });
        if (allEven)
            bonusItems.push({ label: "全双", fan: 2 });
        if (hasTerminalOrHonorGroup(tiles))
            bonusItems.push({ label: "幺九/字牌组", fan: 1 });
        if (hasDragonTriplet(tiles))
            bonusItems.push({ label: "箭刻", fan: 2 });
        if (player.playedOwnTileCount === 5)
            bonusItems.push({ label: "五张胡", fan: 2 });
        if (player.playedOwnTileCount >= 6)
            bonusItems.push({ label: "提前胡", fan: 2 });
        if (player.playedOwnTileCount >= 7)
            bonusItems.push({ label: "七张超胡", fan: 1 });
        const concealedTripletCount = countConcealedTriplets(tiles, player);
        if (concealedTripletCount > 0) {
            bonusItems.push({ label: concealedTripletCount >= 2 ? "双暗刻" : "暗刻", fan: concealedTripletCount });
        }
        if (!hasHonor)
            bonusItems.push({ label: "无字", fan: 1 });
    }
    const flowerFan = player.flowers.length;
    const kongFan = player.exposedMelds.reduce((sum, meld) => sum + meld.fan, 0);
    const kongCount = player.exposedMelds.filter((meld) => meld.kind.includes("kong")).length;
    const playedContribution = tiles.filter((tile) => tile.id.startsWith("played-group-")).length;
    const handContribution = playedContribution + tiles.filter((tile) => player.hand.some((handTile) => handTile.id === tile.id)).length;
    const bonusFan = bonusItems.reduce((sum, item) => sum + item.fan, 0) + flowerFan + kongFan;
    const totalFan = shape.valid ? shape.fan + bonusFan : 0;
    const bonusSummary = [
        ...bonusItems.map((item) => `${item.label}+${item.fan}`),
        ...(flowerFan > 0 ? [`花牌+${flowerFan}`] : []),
        ...(kongFan > 0 ? [`杠+${kongFan}`] : []),
    ];
    return {
        totalFan,
        mainFan: shape.fan,
        mainPattern: shape.label,
        selectedTiles: tiles.map(getTavernMahjongTileLabel),
        purityRank: allSameSuit ? 4 : mixedOneSuit ? 3 : suits.size <= 2 ? 2 : hasHonor ? 0 : 1,
        groupRank: getGroupRank(tiles),
        pairRank: getPairRank(tiles),
        handContribution,
        flowerCount: player.flowers.length,
        kongCount,
        validHu: shape.valid,
        detailLines: [
            `基础：${shape.label} ${shape.fan} 番`,
            `加成：${bonusSummary.length > 0 ? bonusSummary.join("、") : "无"}`,
            `结构：${shape.valid ? "成型即有效" : "未成两组/三对/特殊字牌型"}`,
            `出牌/手牌入选 ${handContribution} 张，花牌 ${flowerFan} 张，杠番 ${kongFan}`,
        ],
    };
}
function scoreBestLongHand(tiles, player) {
    const ordinaryTiles = tiles.filter((tile) => tile.kind !== "flower");
    const candidates = combinations(ordinaryTiles, 14);
    const scored = candidates.map((candidate) => scoreLongFourMeldsAndPair(candidate, player));
    scored.sort(compareScores);
    return scored[0] ?? {
        ...createEmptyScore(player),
        mainPattern: "未胡",
        detailLines: ["长牌需要从 5 暗牌与个人明牌/盖牌中组成 14 张胡牌型。"],
    };
}
function scoreLongFourMeldsAndPair(tiles, player) {
    const ordinaryTiles = tiles.filter((tile) => tile.kind !== "flower");
    if (ordinaryTiles.length !== 14) {
        return createEmptyScore(player);
    }
    const suitedTiles = ordinaryTiles.filter((tile) => tile.kind === "suited");
    const suits = new Set(suitedTiles.map((tile) => tile.suit));
    const honors = ordinaryTiles.filter((tile) => tile.kind === "honor");
    const counts = countByTileKey(ordinaryTiles);
    const pairShape = [...counts.values()].filter((count) => count === 2).length === 7;
    const meldShape = pairShape ? null : resolveStandardMeldShapeWithPair(counts);
    const validHu = pairShape || meldShape != null;
    if (!validHu) {
        return createEmptyScore(player);
    }
    const allSameSuit = suitedTiles.length === ordinaryTiles.length && suits.size === 1;
    const mixedOneSuit = honors.length > 0 && suitedTiles.length > 0 && suits.size === 1;
    const allTerminalsOrHonors = ordinaryTiles.every((tile) => tile.kind === "honor" || (tile.kind === "suited" && (tile.rank === 1 || tile.rank === 9)));
    const bonusItems = [];
    if (pairShape)
        bonusItems.push({ label: "七对", fan: 24 });
    if (allTerminalsOrHonors)
        bonusItems.push({ label: "混幺九", fan: 32 });
    if (allSameSuit)
        bonusItems.push({ label: "清一色", fan: 24 });
    if (mixedOneSuit)
        bonusItems.push({ label: "混一色", fan: 6 });
    if (hasDragonTriplet(ordinaryTiles))
        bonusItems.push({ label: "箭刻", fan: 2 });
    if (hasTwoHonorTriplets(ordinaryTiles))
        bonusItems.push({ label: "双箭/风刻", fan: 6 });
    if (honors.length === 0)
        bonusItems.push({ label: "无字", fan: 1 });
    const flowerFan = player.flowers.length;
    const kongFan = player.exposedMelds.reduce((sum, meld) => sum + meld.fan, 0);
    const baseFan = pairShape ? 24 : 8;
    const bonusFan = bonusItems.reduce((sum, item) => sum + item.fan, 0) + flowerFan + kongFan;
    const mainPattern = pairShape ? "七对" : "四组一对";
    const selectedTiles = ordinaryTiles.map(getTavernMahjongTileLabel);
    const handContribution = ordinaryTiles.filter((tile) => player.hand.some((handTile) => handTile.id === tile.id)).length;
    return {
        totalFan: baseFan + bonusFan,
        mainFan: baseFan,
        mainPattern,
        selectedTiles,
        purityRank: allSameSuit ? 4 : mixedOneSuit ? 3 : suits.size <= 2 ? 2 : honors.length > 0 ? 0 : 1,
        groupRank: getGroupRank(ordinaryTiles),
        pairRank: getPairRank(ordinaryTiles),
        handContribution,
        flowerCount: player.flowers.length,
        kongCount: player.exposedMelds.filter((meld) => meld.kind.includes("kong")).length,
        validHu: true,
        detailLines: [
            `基础：${mainPattern} ${baseFan} 番`,
            `核心番：${bonusItems.length > 0 ? bonusItems.map((item) => `${item.label}+${item.fan}`).join("、") : "无"}`,
            `花牌 ${flowerFan}，杠番 ${kongFan}`,
        ],
    };
}
function resolveStandardMeldShapeWithPair(counts) {
    for (const [pairKey, count] of counts.entries()) {
        if (count < 2) {
            continue;
        }
        const rest = new Map(counts);
        rest.set(pairKey, count - 2);
        const shape = resolveMeldShape(rest, 4);
        if (shape != null) {
            return shape;
        }
    }
    return null;
}
function resolveSixTileShape(tiles) {
    const ordinaryTiles = tiles.filter((tile) => tile.kind !== "flower");
    if (ordinaryTiles.length !== TAVERN_GAMBLE_SHOWDOWN_SIZE) {
        return { label: "未成牌型", fan: 0, valid: false };
    }
    if (hasFourWindsWithPair(ordinaryTiles)) {
        return { label: "四喜雏形", fan: 8, valid: true };
    }
    if (hasSixUnpairedHonors(ordinaryTiles)) {
        return { label: "六字不靠", fan: 6, valid: true };
    }
    const counts = countByTileKey(ordinaryTiles);
    const countValues = [...counts.values()].sort((left, right) => left - right);
    if (countValues.length === 3 && countValues.every((count) => count === 2)) {
        return { label: "三对将", fan: 3, valid: true };
    }
    const meldShape = resolveMeldShape(counts, 2);
    if (meldShape == null) {
        return { label: "未成牌型", fan: 0, valid: false };
    }
    if (meldShape.triplets === 2) {
        return { label: "双刻", fan: 5, valid: true };
    }
    if (meldShape.triplets === 1 && meldShape.sequences === 1) {
        return { label: "一顺一刻", fan: 3, valid: true };
    }
    return { label: "双顺", fan: 2, valid: true };
}
function createEmptyScore(player) {
    return {
        totalFan: player.flowers.length,
        mainFan: 0,
        mainPattern: "无有效牌型",
        selectedTiles: [],
        purityRank: 0,
        groupRank: 0,
        pairRank: 0,
        handContribution: 0,
        flowerCount: player.flowers.length,
        kongCount: player.exposedMelds.filter((meld) => meld.kind.includes("kong")).length,
        validHu: false,
        detailLines: ["无有效计分项"],
    };
}
function createVirtualPlayedGroupTiles(group) {
    return group.tileLabels.map((label, index) => createVirtualTileFromLabel(label, `played-group-${group.id}-${index}`));
}
function createVirtualMeldTriplet(meld) {
    const baseTile = createVirtualTileFromKey(meld.tileKey, `${meld.kind}-${meld.tileKey}`);
    return [1, 2, 3].map((copy) => ({ ...baseTile, id: `${baseTile.id}-${copy}` }));
}
function createVirtualTileFromLabel(label, id) {
    const suitedMatch = /^([1-9])(万|条|筒)$/.exec(label);
    if (suitedMatch != null) {
        const [, rankText, suitLabel] = suitedMatch;
        const suitEntry = Object.entries(suitLabels).find(([, candidateLabel]) => candidateLabel === suitLabel);
        if (rankText != null && suitEntry != null) {
            return {
                id,
                kind: "suited",
                suit: suitEntry[0],
                rank: Number(rankText),
                copy: 0,
            };
        }
    }
    const honorEntry = Object.entries(honorLabels).find(([, candidateLabel]) => candidateLabel === label);
    if (honorEntry != null) {
        return { id, kind: "honor", honor: honorEntry[0], copy: 0 };
    }
    throw new Error(`Invalid tavern gambling tile label: ${label}`);
}
function createVirtualTileFromKey(tileKey, idPrefix) {
    const [suit, rankText] = tileKey.split("-");
    if (suit === "wan" || suit === "tiao" || suit === "tong") {
        const rank = Number(rankText);
        if (!Number.isInteger(rank) || rank < 1 || rank > 9) {
            throw new Error(`Invalid tavern gambling suited tile key: ${tileKey}`);
        }
        return { id: idPrefix, kind: "suited", suit, rank, copy: 0 };
    }
    if (tileKey in honorLabels) {
        return { id: idPrefix, kind: "honor", honor: tileKey, copy: 0 };
    }
    throw new Error(`Invalid tavern gambling meld tile key: ${tileKey}`);
}
function compareShowdownResults(left, right) {
    return compareRankKeys(right.rankKey, left.rankKey);
}
function compareScores(left, right) {
    return compareRankKeys(rightToKey(right), rightToKey(left));
}
function rightToKey(score) {
    return [
        score.totalFan,
        score.mainFan,
        score.groupRank,
        score.purityRank,
        score.pairRank,
        score.flowerCount,
        score.kongCount,
        score.handContribution,
    ];
}
function compareRankKeys(left, right) {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
        const leftValue = left[index] ?? 0;
        const rightValue = right[index] ?? 0;
        if (leftValue !== rightValue) {
            return leftValue - rightValue;
        }
    }
    return 0;
}
function getGroupRank(tiles) {
    const counts = countByTileKey(tiles);
    let best = 0;
    for (const [tileKey, count] of counts.entries()) {
        if (count >= 3) {
            best = Math.max(best, 200 + getTileSortRankByKey(tileKey, tiles));
        }
        else if (count >= 2) {
            best = Math.max(best, 100 + getTileSortRankByKey(tileKey, tiles));
        }
    }
    return best;
}
function getPairRank(tiles) {
    const counts = countByTileKey(tiles);
    let best = 0;
    for (const [tileKey, count] of counts.entries()) {
        if (count >= 2) {
            best = Math.max(best, getTileSortRankByKey(tileKey, tiles));
        }
    }
    return best;
}
function getTileSortRankByKey(tileKey, tiles) {
    const tile = tiles.find((candidate) => getTavernMahjongTileKey(candidate) === tileKey);
    return tile == null ? 0 : getTileSortRank(tile);
}
function getTileSortRank(tile) {
    if (tile.kind === "honor") {
        return 300 + Object.keys(honorLabels).indexOf(tile.honor);
    }
    if (tile.kind === "suited") {
        const suitRank = tile.suit === "wan" ? 30 : tile.suit === "tiao" ? 20 : 10;
        return suitRank + tile.rank;
    }
    return 0;
}
function hasSameSequenceDifferentSuits(tiles) {
    const counts = countByTileKey(tiles);
    for (let start = 1; start <= 7; start += 1) {
        const suitHits = Object.keys(suitLabels).filter((suit) => [start, start + 1, start + 2].every((rank) => (counts.get(`${suit}-${rank}`) ?? 0) >= 1));
        if (suitHits.length >= 2) {
            return true;
        }
    }
    return false;
}
function hasIdenticalSequencesSameSuit(tiles) {
    const counts = countByTileKey(tiles);
    for (const suit of Object.keys(suitLabels)) {
        for (let start = 1; start <= 7; start += 1) {
            if ([start, start + 1, start + 2].every((rank) => (counts.get(`${suit}-${rank}`) ?? 0) >= 2)) {
                return true;
            }
        }
    }
    return false;
}
function hasOldYoungSameSuit(tiles) {
    const counts = countByTileKey(tiles);
    for (const suit of Object.keys(suitLabels)) {
        const hasYoung = [1, 2, 3].every((rank) => (counts.get(`${suit}-${rank}`) ?? 0) >= 1);
        const hasOld = [7, 8, 9].every((rank) => (counts.get(`${suit}-${rank}`) ?? 0) >= 1);
        if (hasYoung && hasOld) {
            return true;
        }
    }
    return false;
}
function hasCleanSixRun(tiles) {
    const suited = tiles.filter((tile) => tile.kind === "suited");
    if (suited.length !== TAVERN_GAMBLE_SHOWDOWN_SIZE || new Set(suited.map((tile) => tile.suit)).size !== 1) {
        return false;
    }
    const ranks = new Set(suited.map((tile) => tile.rank));
    return [1, 2, 3, 4].some((start) => [0, 1, 2, 3, 4, 5].every((offset) => ranks.has(start + offset)));
}
function hasStepStraightSameSuit(tiles) {
    const counts = countByTileKey(tiles);
    for (const suit of Object.keys(suitLabels)) {
        for (let firstStart = 1; firstStart <= 7; firstStart += 1) {
            for (const step of [1, 2]) {
                const secondStart = firstStart + step;
                if (secondStart > 7) {
                    continue;
                }
                const needed = [
                    firstStart,
                    firstStart + 1,
                    firstStart + 2,
                    secondStart,
                    secondStart + 1,
                    secondStart + 2,
                ].map((rank) => `${suit}-${rank}`);
                const neededCounts = new Map();
                for (const key of needed) {
                    neededCounts.set(key, (neededCounts.get(key) ?? 0) + 1);
                }
                if ([...neededCounts.entries()].every(([key, count]) => (counts.get(key) ?? 0) >= count)) {
                    return true;
                }
            }
        }
    }
    return false;
}
function hasSameRankTripletsDifferentSuits(tiles) {
    const counts = countByTileKey(tiles);
    for (let rank = 1; rank <= 9; rank += 1) {
        const tripletSuits = Object.keys(suitLabels).filter((suit) => (counts.get(`${suit}-${rank}`) ?? 0) >= 3);
        if (tripletSuits.length >= 2) {
            return true;
        }
    }
    return false;
}
function hasTerminalPairOfTriplets(tiles) {
    const counts = countByTileKey(tiles);
    let terminalTripletCount = 0;
    for (const suit of Object.keys(suitLabels)) {
        if ((counts.get(`${suit}-1`) ?? 0) >= 3)
            terminalTripletCount += 1;
        if ((counts.get(`${suit}-9`) ?? 0) >= 3)
            terminalTripletCount += 1;
    }
    return terminalTripletCount >= 2;
}
function hasTwoHonorTriplets(tiles) {
    const counts = countByTileKey(tiles);
    let honorTripletCount = 0;
    for (const honor of Object.keys(honorLabels)) {
        if ((counts.get(honor) ?? 0) >= 3) {
            honorTripletCount += 1;
        }
    }
    return honorTripletCount >= 2;
}
function countConcealedTriplets(tiles, player) {
    const counts = countByTileKey(tiles);
    const handCounts = countByTileKey(player.hand);
    let concealedTriplets = 0;
    for (const [tileKey, count] of counts.entries()) {
        if (count >= 3 && (handCounts.get(tileKey) ?? 0) >= 3) {
            concealedTriplets += 1;
        }
    }
    return concealedTriplets;
}
function hasFourWindsWithPair(tiles) {
    const counts = countByTileKey(tiles);
    const hasAllWinds = [...windHonors].every((honor) => (counts.get(honor) ?? 0) >= 1);
    return hasAllWinds && [...counts.values()].some((count) => count >= 2);
}
function hasSixUnpairedHonors(tiles) {
    const counts = countByTileKey(tiles);
    return tiles.every((tile) => tile.kind === "honor") && counts.size === TAVERN_GAMBLE_SHOWDOWN_SIZE;
}
function resolveMeldShape(counts, meldsLeft) {
    if (meldsLeft === 0) {
        return [...counts.values()].every((count) => count === 0) ? { sequences: 0, triplets: 0 } : null;
    }
    const firstKey = [...counts.entries()]
        .filter(([, count]) => count > 0)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))[0]?.[0];
    if (firstKey == null) {
        return null;
    }
    if ((counts.get(firstKey) ?? 0) >= 3) {
        const tripletCounts = new Map(counts);
        tripletCounts.set(firstKey, (tripletCounts.get(firstKey) ?? 0) - 3);
        const rest = resolveMeldShape(tripletCounts, meldsLeft - 1);
        if (rest != null) {
            return { sequences: rest.sequences, triplets: rest.triplets + 1 };
        }
    }
    const [suit, rankText] = firstKey.split("-");
    const rank = Number(rankText);
    if (suit !== "wan" && suit !== "tiao" && suit !== "tong") {
        return null;
    }
    if (!Number.isInteger(rank) || rank > 7) {
        return null;
    }
    const sequenceKeys = [rank, rank + 1, rank + 2].map((sequenceRank) => `${suit}-${sequenceRank}`);
    if (!sequenceKeys.every((key) => (counts.get(key) ?? 0) > 0)) {
        return null;
    }
    const sequenceCounts = new Map(counts);
    for (const key of sequenceKeys) {
        sequenceCounts.set(key, (sequenceCounts.get(key) ?? 0) - 1);
    }
    const rest = resolveMeldShape(sequenceCounts, meldsLeft - 1);
    return rest == null ? null : { sequences: rest.sequences + 1, triplets: rest.triplets };
}
function hasDragonTriplet(tiles) {
    const counts = countByTileKey(tiles);
    for (const honor of dragonHonors) {
        if ((counts.get(honor) ?? 0) >= 3) {
            return true;
        }
    }
    return false;
}
function hasTerminalOrHonorGroup(tiles) {
    const counts = countByTileKey(tiles);
    for (const [tileKey, count] of counts.entries()) {
        if (count < 2)
            continue;
        const tile = tiles.find((candidate) => getTavernMahjongTileKey(candidate) === tileKey);
        if (tile?.kind === "honor" || (tile?.kind === "suited" && (tile.rank === 1 || tile.rank === 9))) {
            return true;
        }
    }
    return false;
}
function combinations(items, size) {
    if (size < 0)
        return [];
    if (size === 0)
        return [[]];
    if (items.length < size)
        return [];
    const [head, ...tail] = items;
    return [...combinations(tail, size - 1).map((candidate) => [head, ...candidate]), ...combinations(tail, size)];
}
function drawNonFlowerTiles(wall, deadWall, count) {
    let nextWall = wall;
    let nextDeadWall = deadWall;
    const tiles = [];
    const flowers = [];
    while (tiles.length < count) {
        const drawn = drawOneNonFlower(nextWall, nextDeadWall);
        tiles.push(drawn.tile);
        flowers.push(...drawn.flowers);
        nextWall = drawn.wall;
        nextDeadWall = drawn.deadWall;
    }
    return { tiles, flowers, wall: nextWall, deadWall: nextDeadWall };
}
function drawOneNonFlower(wall, deadWall) {
    let nextWall = wall;
    let nextDeadWall = deadWall;
    const flowers = [];
    let tile = nextWall[0];
    nextWall = nextWall.slice(1);
    while (tile?.kind === "flower") {
        flowers.push(tile);
        tile = nextDeadWall[0];
        nextDeadWall = nextDeadWall.slice(1);
    }
    if (tile == null) {
        const fallback = nextDeadWall.find((candidate) => candidate.kind !== "flower");
        if (fallback == null) {
            throw new Error("Tavern gambling wall exhausted.");
        }
        tile = fallback;
        nextDeadWall = removeTileById(nextDeadWall, fallback.id);
    }
    return { tile, flowers, wall: nextWall, deadWall: nextDeadWall };
}
function normalizeHand(player) {
    return { ...player, hand: player.hand.slice(0, TAVERN_GAMBLE_HAND_SIZE) };
}
function getHumanPlayer(session) {
    const player = session.players.find((candidate) => candidate.isHuman);
    if (player == null) {
        throw new Error("Tavern gambling session has no human player.");
    }
    return player;
}
function updatePlayer(session, playerId, patch) {
    return {
        ...session,
        players: session.players.map((player) => (player.id === playerId ? { ...player, ...patch } : player)),
    };
}
function getAffordableCommit(session, player, requestedAmount) {
    return Math.max(0, Math.min(requestedAmount, session.wager - player.committed));
}
function removeTileById(tiles, tileId) {
    let removed = false;
    return tiles.filter((tile) => {
        if (!removed && tile.id === tileId) {
            removed = true;
            return false;
        }
        return true;
    });
}
function countByTileKey(tiles) {
    const counts = new Map();
    for (const tile of tiles) {
        const key = getTavernMahjongTileKey(tile);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
}


export { TAVERN_GAMBLE_PLAYER_COUNT, TAVERN_GAMBLE_HAND_SIZE, TAVERN_GAMBLE_DRAW_DISCARD_COUNT, TAVERN_GAMBLE_MELD_RESPONSE_SECONDS, TAVERN_GAMBLE_DISCARD_RESPONSE_SECONDS, TAVERN_GAMBLE_PUBLIC_TILE_COUNT, TAVERN_GAMBLE_SHOWDOWN_SIZE, TAVERN_LONG_GAMBLE_HAND_SIZE, TAVERN_LONG_GAMBLE_PUBLIC_TILE_COUNT, TAVERN_LONG_GAMBLE_DRAW_DISCARD_COUNT, TAVERN_LONG_GAMBLE_MELD_RESPONSE_SECONDS, TAVERN_GAMBLE_SMALL_BLIND, TAVERN_GAMBLE_BIG_BLIND, createTavernMahjongDeck, shuffleTavernMahjongDeck, getTavernMahjongTileLabel, getTavernMahjongTileKey, getTavernGambleStreetLabel, getTavernGamblePhaseLabel, getMeldKindLabel, getStreetLabel, createTavernGambleSession, createTavernLongGambleSession, resolveTavernGambleBettingAction, skipTavernGambleMeld, declareTavernGambleMeld, drawForTavernGamble, toggleTavernGamblePlayTile, confirmSelectedTavernGambleDiscards, clearTavernGamblePlaySlot, passTavernGamblePlayGroups, confirmTavernGamblePlayGroup, discardForTavernGamble, reorderTavernGambleHand, advanceTavernLongPublicReveal, advanceTavernGambleNpcThinking, advanceTavernGambleMeldCountdown, resolveTavernGambleShowdown, canHumanLongHu, pushHumanLongHu, passHumanLongHu, getTavernGambleWinners, scoreTavernGamblePlayer, scoreTavernGambleSessionPlayer };
