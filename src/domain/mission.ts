export type MissionId = string;

export type MissionDefinition = {
  id: MissionId;
  title: string;
  description: string;
  issuerCharacterId?: string;
  statusText?: string;
  rewardText?: string;
};
