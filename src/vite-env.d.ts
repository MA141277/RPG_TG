/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NPC_AI_PROVIDER_MODE?: string;
  readonly VITE_NPC_AI_BASE_URL?: string;
  readonly VITE_NPC_AI_MODEL?: string;
  readonly VITE_NPC_AI_API_KEY?: string;
  readonly VITE_NPC_AI_STREAM?: string;
  readonly VITE_NPC_AI_TEMPERATURE?: string;
}

declare module "*.img?url" {
  const assetUrl: string;
  export default assetUrl;
}

declare module "*.mp4?url" {
  const assetUrl: string;
  export default assetUrl;
}

declare module "*.mp3?url" {
  const assetUrl: string;
  export default assetUrl;
}

declare module "*.json?url" {
  const assetUrl: string;
  export default assetUrl;
}
