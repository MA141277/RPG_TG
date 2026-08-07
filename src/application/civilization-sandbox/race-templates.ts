import type { CivilizationSandboxRaceId } from "../../domain/civilization-sandbox";

export type CivilizationSandboxBehaviorProfile = {
  combat: number;
  expansion: number;
  farming: number;
  conflictAvoidance: number;
  technology: number;
  building: number;
};

export type CivilizationSandboxRaceTemplate = {
  id: CivilizationSandboxRaceId;
  founderName: string;
  color: string;
  behavior: CivilizationSandboxBehaviorProfile;
};

export const SANDBOX_RACE_TEMPLATES: Record<
  CivilizationSandboxRaceId,
  CivilizationSandboxRaceTemplate
> = {
  "wu-tong": {
    id: "wu-tong",
    founderName: "吴同",
    color: "red",
    behavior: {
      combat: 3,
      expansion: 3,
      farming: 1,
      conflictAvoidance: 1,
      technology: 1,
      building: 2,
    },
  },
  "yu-qingqing": {
    id: "yu-qingqing",
    founderName: "于晴晴",
    color: "green",
    behavior: {
      combat: 1,
      expansion: 1,
      farming: 3,
      conflictAvoidance: 3,
      technology: 1,
      building: 1,
    },
  },
  "chen-yihan": {
    id: "chen-yihan",
    founderName: "陈倚晗",
    color: "blue",
    behavior: {
      combat: 1,
      expansion: 2,
      farming: 1,
      conflictAvoidance: 1,
      technology: 3,
      building: 3,
    },
  },
};
