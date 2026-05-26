/// <reference types="vite/client" />

declare module "*.img?url" {
  const assetUrl: string;
  export default assetUrl;
}

declare module "*.mp4?url" {
  const assetUrl: string;
  export default assetUrl;
}
