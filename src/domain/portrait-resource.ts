export type PortraitResourceDefinition = {
  id: string;
  label: string;
  portraitImage: string;
  avatarImage?: string;
};

export type PortraitVariantDefinition = {
  id: string;
  label: string;
  parentPortraitId: string;
  portraitId: string;
};
