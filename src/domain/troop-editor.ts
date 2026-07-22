import type {
  BattleFormation,
  BattleFormationMember,
  BattleFormationSlotKey,
  BattleFormationUnitRole,
} from "./battle-formation";
import type { CharacterId } from "./character";

export type TroopEditorResourceSlot = {
  id: string;
  label: string;
  valueText: string;
};

export type TroopEditorMenuItem = {
  id: string;
  label: string;
  actionId: string | null;
};

export type SharedTroopSlotSnapshot = {
  slotKey: BattleFormationSlotKey;
  occupantName: string | null;
  occupantRole: BattleFormationUnitRole | null;
  isOccupied: boolean;
};

export type SharedTroopSnapshot = {
  id: string;
  name: string;
  subtitle: string;
  slots: SharedTroopSlotSnapshot[];
};

export type TroopReserveMember = Omit<BattleFormationMember, "slotKey"> & {
  sourceTroopId: string;
};

export type TroopShopOffer = {
  id: string;
  name: string;
  role: BattleFormationUnitRole;
  unitDefinitionId: string;
  price: number;
  requiredFame: number;
};

export type TroopRuntimeState = {
  formations: BattleFormation[];
  reserve: {
    capacity: number;
    members: TroopReserveMember[];
  };
  shop: {
    refreshVersion: number;
    offers: TroopShopOffer[];
  };
};

export const PLAYER_MAIN_TROOP_ID = "troop.zhu-chongba.main";
const TROOP_SHOP_SOURCE_ID = "troop.shop.reserve";

function getPreferredUnitDefinitionIdForRole(
  role: BattleFormationUnitRole,
  currentUnitDefinitionId: string
): string {
  if (role === "teppo") {
    return "unit.teppo.demo";
  }

  return currentUnitDefinitionId;
}

const TROOP_SHOP_ROLE_CATALOG: ReadonlyArray<
  Omit<TroopShopOffer, "id" | "name">
> = [
  {
    role: "infantry",
    unitDefinitionId: "unit.infantry.demo",
    price: 8,
    requiredFame: 0,
  },
  {
    role: "spearman",
    unitDefinitionId: "unit.spearman.demo",
    price: 12,
    requiredFame: 3,
  },
  {
    role: "archer",
    unitDefinitionId: "unit.archer.demo",
    price: 16,
    requiredFame: 5,
  },
  {
    role: "teppo",
    unitDefinitionId: "unit.teppo.demo",
    price: 18,
    requiredFame: 6,
  },
  {
    role: "heavy-cavalry",
    unitDefinitionId: "unit.light-cavalry.demo",
    price: 24,
    requiredFame: 8,
  },
] as const;

const TROOP_NAME_SURNAMES = [
  "张",
  "李",
  "王",
  "赵",
  "孙",
  "周",
  "吴",
  "郑",
  "冯",
  "陈",
  "褚",
  "卫",
  "蒋",
  "沈",
  "韩",
  "杨",
  "刘",
  "许",
  "何",
  "吕",
  "施",
  "孔",
  "曹",
  "严",
  "华",
  "金",
  "魏",
  "陶",
  "姜",
  "谢",
] as const;

const TROOP_NAME_NUMERALS = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
] as const;

export function createDefaultTroopRuntimeState(
  leaderCharacterId: CharacterId
): TroopRuntimeState {
  const formations: BattleFormation[] = [
    {
      id: PLAYER_MAIN_TROOP_ID,
      name: "朱重八本队",
      leaderCharacterId,
      members: [
        {
          id: "member.front-left.spearman",
          unitDefinitionId: "unit.spearman.demo",
          name: "张三",
          role: "spearman",
          slotKey: "front-left",
        },
        {
          id: "member.front-center.infantry",
          unitDefinitionId: "unit.infantry.demo",
          name: "李四",
          role: "infantry",
          slotKey: "front-center",
        },
        {
          id: "member.front-right.spearman",
          unitDefinitionId: "unit.spearman.demo",
          name: "王五",
          role: "spearman",
          slotKey: "front-right",
        },
        {
          id: "member.middle-center.infantry",
          unitDefinitionId: "unit.infantry.demo",
          name: "赵六",
          role: "infantry",
          slotKey: "middle-center",
        },
        {
          id: "member.rear-center.archer",
          unitDefinitionId: "unit.archer.demo",
          name: "孙七",
          role: "archer",
          slotKey: "rear-center",
        },
      ],
    },
  ];
  const reserveMembers: TroopReserveMember[] = [];
  const usedNames = collectUsedTroopMemberNames(formations, reserveMembers);

  return {
    formations,
    reserve: {
      capacity: 200,
      members: reserveMembers,
    },
    shop: {
      refreshVersion: 0,
      offers: createTroopShopOffers(usedNames),
    },
  };
}

export function moveTroopFormationMember(
  troopRuntimeState: TroopRuntimeState,
  input: {
    troopId: string;
    fromSlotKey: BattleFormationSlotKey;
    toSlotKey: BattleFormationSlotKey;
  }
): TroopRuntimeState {
  if (input.fromSlotKey === input.toSlotKey) {
    return troopRuntimeState;
  }

  let didMove = false;

  const formations = troopRuntimeState.formations.map((formation) => {
    if (formation.id !== input.troopId) {
      return formation;
    }

    const sourceMember =
      formation.members.find((member) => member.slotKey === input.fromSlotKey) ?? null;
    if (sourceMember == null) {
      return formation;
    }

    const targetMember =
      formation.members.find((member) => member.slotKey === input.toSlotKey) ?? null;
    if (targetMember != null) {
      return formation;
    }

    didMove = true;
    return {
      ...formation,
      members: formation.members.map((member) =>
        member.id === sourceMember.id
          ? {
              ...member,
              slotKey: input.toSlotKey,
            }
          : member
      ),
    };
  });

  if (!didMove) {
    return troopRuntimeState;
  }

  return {
    ...troopRuntimeState,
    formations,
  };
}

export function removeTroopFormationMember(
  troopRuntimeState: TroopRuntimeState,
  input: {
    troopId: string;
    slotKey: BattleFormationSlotKey;
  }
): TroopRuntimeState {
  if (troopRuntimeState.reserve.members.length >= troopRuntimeState.reserve.capacity) {
    return troopRuntimeState;
  }

  let removedMember: TroopReserveMember | null = null;

  const formations = troopRuntimeState.formations.map((formation) => {
    if (formation.id !== input.troopId) {
      return formation;
    }

    const sourceMember =
      formation.members.find((member) => member.slotKey === input.slotKey) ?? null;
    if (sourceMember == null) {
      return formation;
    }

    removedMember = {
      id: sourceMember.id,
      unitDefinitionId: sourceMember.unitDefinitionId,
      name: sourceMember.name,
      role: sourceMember.role,
      ...(sourceMember.characterId == null
        ? {}
        : { characterId: sourceMember.characterId }),
      ...(sourceMember.capacityCost == null
        ? {}
        : { capacityCost: sourceMember.capacityCost }),
      sourceTroopId: formation.id,
    };

    return {
      ...formation,
      members: formation.members.filter((member) => member.id !== sourceMember.id),
    };
  });

  if (removedMember == null) {
    return troopRuntimeState;
  }

  return {
    ...troopRuntimeState,
    formations,
    reserve: {
      ...troopRuntimeState.reserve,
      members: [...troopRuntimeState.reserve.members, removedMember],
    },
  };
}

export function clearTroopFormationMembersToReserve(
  troopRuntimeState: TroopRuntimeState,
  input: {
    troopId: string;
  }
): TroopRuntimeState {
  const formation =
    troopRuntimeState.formations.find((candidate) => candidate.id === input.troopId) ?? null;
  if (formation == null || formation.members.length === 0) {
    return troopRuntimeState;
  }

  if (
    troopRuntimeState.reserve.members.length + formation.members.length >
    troopRuntimeState.reserve.capacity
  ) {
    return troopRuntimeState;
  }

  const reserveMembers: TroopReserveMember[] = formation.members.map((member) => ({
    id: member.id,
    unitDefinitionId: member.unitDefinitionId,
    name: member.name,
    role: member.role,
    ...(member.characterId == null ? {} : { characterId: member.characterId }),
    ...(member.capacityCost == null ? {} : { capacityCost: member.capacityCost }),
    sourceTroopId: formation.id,
  }));

  return {
    ...troopRuntimeState,
    formations: troopRuntimeState.formations.map((candidate) =>
      candidate.id === input.troopId
        ? {
            ...candidate,
            members: [],
          }
        : candidate
    ),
    reserve: {
      ...troopRuntimeState.reserve,
      members: [...troopRuntimeState.reserve.members, ...reserveMembers],
    },
  };
}

export function disbandTroopFormationToReserve(
  troopRuntimeState: TroopRuntimeState,
  input: {
    troopId: string;
  }
): TroopRuntimeState {
  if (input.troopId === PLAYER_MAIN_TROOP_ID) {
    return troopRuntimeState;
  }

  const formation =
    troopRuntimeState.formations.find((candidate) => candidate.id === input.troopId) ?? null;
  if (formation == null) {
    return troopRuntimeState;
  }

  if (
    troopRuntimeState.reserve.members.length + formation.members.length >
    troopRuntimeState.reserve.capacity
  ) {
    return troopRuntimeState;
  }

  const reserveMembers: TroopReserveMember[] = formation.members.map((member) => ({
    id: member.id,
    unitDefinitionId: member.unitDefinitionId,
    name: member.name,
    role: member.role,
    ...(member.characterId == null ? {} : { characterId: member.characterId }),
    ...(member.capacityCost == null ? {} : { capacityCost: member.capacityCost }),
    sourceTroopId: formation.id,
  }));

  return {
    ...troopRuntimeState,
    formations: troopRuntimeState.formations.filter(
      (candidate) => candidate.id !== input.troopId
    ),
    reserve: {
      ...troopRuntimeState.reserve,
      members: [...troopRuntimeState.reserve.members, ...reserveMembers],
    },
  };
}

export function createTroopFormation(
  troopRuntimeState: TroopRuntimeState,
  input: {
    leaderCharacterId: CharacterId;
    name: string;
  }
): TroopRuntimeState {
  const normalizedName = input.name.trim().slice(0, 10);
  if (normalizedName.length === 0) {
    return troopRuntimeState;
  }

  if (
    troopRuntimeState.formations.some((formation) => formation.name === normalizedName)
  ) {
    return troopRuntimeState;
  }

  let nextIndex = troopRuntimeState.formations.length + 1;
  let nextId = `troop.custom.${nextIndex}`;
  while (troopRuntimeState.formations.some((formation) => formation.id === nextId)) {
    nextIndex += 1;
    nextId = `troop.custom.${nextIndex}`;
  }

  return {
    ...troopRuntimeState,
    formations: [
      ...troopRuntimeState.formations,
      {
        id: nextId,
        name: normalizedName,
        leaderCharacterId: input.leaderCharacterId,
        members: [],
      },
    ],
  };
}

export function swapTroopFormationOrder(
  troopRuntimeState: TroopRuntimeState,
  input: {
    firstTroopId: string;
    secondTroopId: string;
  }
): TroopRuntimeState {
  if (input.firstTroopId === input.secondTroopId) {
    return troopRuntimeState;
  }

  const firstIndex = troopRuntimeState.formations.findIndex(
    (formation) => formation.id === input.firstTroopId
  );
  const secondIndex = troopRuntimeState.formations.findIndex(
    (formation) => formation.id === input.secondTroopId
  );
  if (firstIndex < 0 || secondIndex < 0) {
    return troopRuntimeState;
  }

  const formations = [...troopRuntimeState.formations];
  const firstFormation = formations[firstIndex];
  const secondFormation = formations[secondIndex];
  if (firstFormation == null || secondFormation == null) {
    return troopRuntimeState;
  }

  formations[firstIndex] = secondFormation;
  formations[secondIndex] = firstFormation;

  return {
    ...troopRuntimeState,
    formations,
  };
}

export function dismissTroopReserveMember(
  troopRuntimeState: TroopRuntimeState,
  input: {
    reserveMemberId: string;
  }
): TroopRuntimeState {
  const nextMembers = troopRuntimeState.reserve.members.filter(
    (member) => member.id !== input.reserveMemberId
  );
  if (nextMembers.length === troopRuntimeState.reserve.members.length) {
    return troopRuntimeState;
  }

  return {
    ...troopRuntimeState,
    reserve: {
      ...troopRuntimeState.reserve,
      members: nextMembers,
    },
  };
}

export function addTroopFormationMemberFromReserve(
  troopRuntimeState: TroopRuntimeState,
  input: {
    troopId: string;
    reserveMemberId: string;
    toSlotKey: BattleFormationSlotKey;
  }
): TroopRuntimeState {
  const reserveMember =
    troopRuntimeState.reserve.members.find((member) => member.id === input.reserveMemberId) ??
    null;
  if (reserveMember == null) {
    return troopRuntimeState;
  }

  let didAdd = false;

  const formations = troopRuntimeState.formations.map((formation) => {
    if (formation.id !== input.troopId) {
      return formation;
    }

    const targetMember =
      formation.members.find((member) => member.slotKey === input.toSlotKey) ?? null;
    if (targetMember != null) {
      return formation;
    }

    didAdd = true;
    return {
      ...formation,
      members: [
        ...formation.members,
        {
          id: reserveMember.id,
          unitDefinitionId: reserveMember.unitDefinitionId,
          name: reserveMember.name,
          role: reserveMember.role,
          slotKey: input.toSlotKey,
          ...(reserveMember.characterId == null
            ? {}
            : { characterId: reserveMember.characterId }),
          ...(reserveMember.capacityCost == null
            ? {}
            : { capacityCost: reserveMember.capacityCost }),
        },
      ],
    };
  });

  if (!didAdd) {
    return troopRuntimeState;
  }

  return {
    ...troopRuntimeState,
    formations,
    reserve: {
      ...troopRuntimeState.reserve,
      members: troopRuntimeState.reserve.members.filter(
        (member) => member.id !== input.reserveMemberId
      ),
    },
  };
}

export function purchaseTroopShopOffer(
  troopRuntimeState: TroopRuntimeState,
  input: {
    offerId: string;
  }
): TroopRuntimeState {
  if (troopRuntimeState.reserve.members.length >= troopRuntimeState.reserve.capacity) {
    return troopRuntimeState;
  }

  const offer =
    troopRuntimeState.shop.offers.find((candidate) => candidate.id === input.offerId) ?? null;
  if (offer == null) {
    return troopRuntimeState;
  }

  return {
    ...troopRuntimeState,
    reserve: {
      ...troopRuntimeState.reserve,
      members: [
        ...troopRuntimeState.reserve.members,
        {
          id: `reserve.shop.${offer.id}`,
          unitDefinitionId: offer.unitDefinitionId,
          name: offer.name,
          role: offer.role,
          sourceTroopId: TROOP_SHOP_SOURCE_ID,
        },
      ],
    },
    shop: {
      ...troopRuntimeState.shop,
      offers: troopRuntimeState.shop.offers.filter(
        (candidate) => candidate.id !== input.offerId
      ),
    },
  };
}

function collectUsedTroopMemberNames(
  formations: ReadonlyArray<BattleFormation>,
  reserveMembers: ReadonlyArray<TroopReserveMember>
): Set<string> {
  const usedNames = new Set<string>();

  for (const formation of formations) {
    for (const member of formation.members) {
      usedNames.add(member.name);
    }
  }

  for (const member of reserveMembers) {
    usedNames.add(member.name);
  }

  return usedNames;
}

function createTroopShopOffers(usedNames: Set<string>): TroopShopOffer[] {
  return TROOP_SHOP_ROLE_CATALOG.map((offer, index) => {
    const name = createUniqueTroopMemberName(usedNames);
    return {
      id: `shop.offer.${index + 1}`,
      name,
      role: offer.role,
      unitDefinitionId: offer.unitDefinitionId,
      price: offer.price,
      requiredFame: offer.requiredFame,
    };
  });
}

function createUniqueTroopMemberName(usedNames: Set<string>): string {
  for (const surname of TROOP_NAME_SURNAMES) {
    for (const numeral of TROOP_NAME_NUMERALS) {
      const candidateName = `${surname}${numeral}`;
      if (usedNames.has(candidateName)) {
        continue;
      }

      usedNames.add(candidateName);
      return candidateName;
    }
  }

  const fallbackName = `义兵${usedNames.size + 1}`;
  usedNames.add(fallbackName);
  return fallbackName;
}

export function normalizeTroopRuntimeStateUnitDefinitions(
  troopRuntimeState: TroopRuntimeState
): TroopRuntimeState {
  let didChange = false;

  const formations = troopRuntimeState.formations.map((formation) => {
    let formationChanged = false;

    const members = formation.members.map((member) => {
      const nextUnitDefinitionId = getPreferredUnitDefinitionIdForRole(
        member.role,
        member.unitDefinitionId
      );

      if (nextUnitDefinitionId === member.unitDefinitionId) {
        return member;
      }

      didChange = true;
      formationChanged = true;
      return {
        ...member,
        unitDefinitionId: nextUnitDefinitionId,
      };
    });

    return formationChanged ? { ...formation, members } : formation;
  });

  const reserveMembers = troopRuntimeState.reserve.members.map((member) => {
    const nextUnitDefinitionId = getPreferredUnitDefinitionIdForRole(
      member.role,
      member.unitDefinitionId
    );

    if (nextUnitDefinitionId === member.unitDefinitionId) {
      return member;
    }

    didChange = true;
    return {
      ...member,
      unitDefinitionId: nextUnitDefinitionId,
    };
  });

  const offers = troopRuntimeState.shop.offers.map((offer) => {
    const nextUnitDefinitionId = getPreferredUnitDefinitionIdForRole(
      offer.role,
      offer.unitDefinitionId
    );

    if (nextUnitDefinitionId === offer.unitDefinitionId) {
      return offer;
    }

    didChange = true;
    return {
      ...offer,
      unitDefinitionId: nextUnitDefinitionId,
    };
  });

  if (!didChange) {
    return troopRuntimeState;
  }

  return {
    ...troopRuntimeState,
    formations,
    reserve: {
      ...troopRuntimeState.reserve,
      members: reserveMembers,
    },
    shop: {
      ...troopRuntimeState.shop,
      offers,
    },
  };
}
