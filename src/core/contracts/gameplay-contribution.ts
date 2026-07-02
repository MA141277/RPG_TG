export type GameplayContributionDeclaration = {
  navigation?: string[];
  events?: string[];
  scenes?: string[];
  tasks?: string[];
  houses?: string[];
};

export type GameplayContributionRegistry = {
  contentPackIds: string[];
  navigation: string[];
  events: string[];
  scenes: string[];
  tasks: string[];
  houses: string[];
  houseModules: string[];
};
