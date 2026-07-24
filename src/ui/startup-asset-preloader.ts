type StartupAssetKind = "image" | "data";

type StartupAsset = {
  kind: StartupAssetKind;
  url: string;
};

export type StartupAssetPreloadProgress = {
  loaded: number;
  total: number;
};

const preloadedImages = new Map<string, Promise<void>>();
const preloadedDataAssets = new Map<string, Promise<void>>();

const MAP_IMAGE_DATA_ATTRIBUTES = [
  "data-map-texture-url",
  "data-map-height-url",
  "data-map-material-url",
  "data-map-grass-texture-url",
  "data-map-sand-texture-url",
  "data-map-rock-texture-url",
  "data-map-snow-texture-url",
  "data-map-water-texture-url",
  "data-map-cloud-noise-url",
  "data-campaign-city-texture-url",
  "data-campaign-player-sprite-url",
  "data-campaign-player-texture-url",
] as const;

const MAP_DATA_ATTRIBUTES = [
  "data-map-hex-grid-url",
  "data-map-vegetation-rules-url",
  "data-campaign-city-mesh-url",
  "data-campaign-player-model-url",
  "data-campaign-player-idle-animation-url",
  "data-campaign-player-walk-animation-url",
] as const;

function readAttributeUrl(element: Element, attributeName: string): string | null {
  const value = element.getAttribute(attributeName);
  if (value == null || value.trim() === "") {
    return null;
  }

  return value;
}

function addAsset(
  assetsByUrl: Map<string, StartupAsset>,
  kind: StartupAssetKind,
  url: string | null
): void {
  if (url == null) {
    return;
  }

  assetsByUrl.set(url, { kind, url });
}

export function collectInitialMapViewAssets(root: ParentNode): StartupAsset[] {
  const assetsByUrl = new Map<string, StartupAsset>();
  const mapRoot = root.querySelector("[data-campaign-map-viewport]");
  if (mapRoot == null) {
    return [];
  }

  for (const imageElement of mapRoot.querySelectorAll<HTMLImageElement>("img[src]")) {
    addAsset(assetsByUrl, "image", imageElement.currentSrc || imageElement.src);
  }

  for (const element of mapRoot.querySelectorAll<Element>("*")) {
    for (const attributeName of MAP_IMAGE_DATA_ATTRIBUTES) {
      addAsset(assetsByUrl, "image", readAttributeUrl(element, attributeName));
    }

    for (const attributeName of MAP_DATA_ATTRIBUTES) {
      addAsset(assetsByUrl, "data", readAttributeUrl(element, attributeName));
    }
  }

  return Array.from(assetsByUrl.values());
}

function preloadImage(url: string): Promise<void> {
  const cached = preloadedImages.get(url);
  if (cached != null) {
    return cached;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (typeof image.decode === "function") {
        image.decode().then(resolve).catch(() => resolve());
        return;
      }

      resolve();
    };
    image.onerror = () => {
      reject(new Error(`Failed to preload image "${url}".`));
    };
    image.src = url;
  });

  preloadedImages.set(url, promise);
  return promise;
}

function preloadDataAsset(url: string): Promise<void> {
  const cached = preloadedDataAssets.get(url);
  if (cached != null) {
    return cached;
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to preload data asset "${url}".`);
      }
    });

  preloadedDataAssets.set(url, promise);
  return promise;
}

function preloadAsset(asset: StartupAsset): Promise<void> {
  if (asset.kind === "image") {
    return preloadImage(asset.url);
  }

  return preloadDataAsset(asset.url);
}

export async function preloadInitialMapViewAssets(
  root: ParentNode,
  onProgress?: (progress: StartupAssetPreloadProgress) => void
): Promise<void> {
  const assets = collectInitialMapViewAssets(root);
  const total = assets.length;
  let loaded = 0;
  onProgress?.({ loaded, total });

  if (total === 0) {
    return;
  }

  await Promise.all(
    assets.map((asset) =>
      preloadAsset(asset)
        .catch((error: unknown) => {
          console.warn("Failed to preload startup map asset.", asset.url, error);
        })
        .finally(() => {
          loaded += 1;
          onProgress?.({ loaded, total });
        })
    )
  );
}
