export type GameplayContributionDeclaration = {
  navigation?: string[];
  events?: string[];
  dialogues?: string[];
  tasks?: string[];
  houses?: string[];
  playables?: string[];
  playableIntegrations?: string[];
};

export type GameplayContributionRegistry = {
  contentPackIds: string[];
  navigation: string[];
  events: string[];
  dialogues: string[];
  tasks: string[];
  houses: string[];
  houseModules: string[];
  playables: string[];
  playableIntegrations: string[];
};
