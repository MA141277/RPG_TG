## Task 1: Add Runtime Prefab Composition And Example Assets

**Files:**
- Create: `src/ui/views/city/city-stage-layout-data.ts`
- Create: `tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json`
- Modify: `src/ui/views/city/city-stage-layout.ts`
- Modify: `tools/city-map-building-editor/examples/haozhou-city-layout.example.json`
- Modify: `tests/city-map-building-editor.test.cjs`

**Interfaces:**
- Consumes:
  - `haozhou-city-layout.example.json`
  - `haozhou-city-prefabs.example.json`
- Produces:
  - `type CityStagePrefabLibrary`
  - `type CityStageLayoutSource`
  - `type ComposedCityStageEntity`
  - `function composeCityStageLayout(layoutSource: CityStageLayoutSource, prefabLibrary: CityStagePrefabLibrary): ComposedCityStageEntity[]`

- [ ] **Step 1: Write the failing test**

```js
test("runtime city stage composes prefabs with city instances", () => {
  const html = readText(indexPath);
  const layout = readExampleLayout();
  const prefabPath = path.join(
    editorDir,
    "examples",
    "haozhou-city-prefabs.example.json"
  );
  const prefabs = JSON.parse(readText(prefabPath));
  const layoutSource = readText(cityStageLayoutPath);

  assert.equal(fs.existsSync(prefabPath), true);
  assert.equal(Array.isArray(prefabs.prefabs), true);
  assert.equal(Array.isArray(layout.instances), true);
  assert.equal("entities" in layout, false);
  assert.match(layoutSource, /composeCityStageLayout/);
  assert.match(layoutSource, /prefabId/);
  assert.match(html, /haozhou-city-prefabs\\.example\\.json/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- Missing `haozhou-city-prefabs.example.json`
- The example layout still exposes `entities`

- [ ] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-stage-layout-data.ts
export type CityStagePrefab = {
  id: string;
  name: string;
  category: string;
  entry: CityStageEntry;
  asset: CityStageAsset;
  footprint: { cols: number; rows: number };
  interaction: CityStageInteraction;
};

export type CityStageInstance = {
  id: string;
  prefabId: string;
  gridX: number;
  gridY: number;
  render?: CityStageRender;
};

export function composeCityStageLayout(
  layoutSource: CityStageLayoutSource,
  prefabLibrary: CityStagePrefabLibrary
): ComposedCityStageEntity[] {
  const prefabById = new Map(prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab]));
  return layoutSource.instances.map((instance) => {
    const prefab = prefabById.get(instance.prefabId);
    if (!prefab) {
      throw new Error(`Unknown city-stage prefab: ${instance.prefabId}`);
    }
    return {
      id: instance.id,
      prefabId: prefab.id,
      name: prefab.name,
      category: prefab.category,
      entry: prefab.entry,
      asset: prefab.asset,
      lot: {
        gridX: instance.gridX,
        gridY: instance.gridY,
        cols: prefab.footprint.cols,
        rows: prefab.footprint.rows,
      },
      render: instance.render ?? { visible: true, locked: false, zIndexMode: "y-sort", zIndex: null },
      interaction: prefab.interaction,
    };
  });
}
```

```ts
// src/ui/views/city/city-stage-layout.ts
import * as haozhouCityPrefabModule from "../../../../tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json";
import {
  composeCityStageLayout,
  type CityStagePrefabLibrary,
  type CityStageLayoutSource,
} from "./city-stage-layout-data";

const haozhouCityStagePrefabs = unwrapJsonModule<CityStagePrefabLibrary>(haozhouCityPrefabModule);
const haozhouCityStageLayout = unwrapJsonModule<CityStageLayoutSource>(haozhouCityLayoutModule);
const composedHaozhouEntities = composeCityStageLayout(
  haozhouCityStageLayout,
  haozhouCityStagePrefabs
);
```

```json
// tools/city-map-building-editor/examples/haozhou-city-layout.example.json
{
  "version": 2,
  "map": {
    "id": "haozhou-city",
    "name": "毫州�?,
    "stageWidth": 2048,
    "stageHeight": 1152,
    "baseSpace": {
      "x": 139,
      "y": 88,
      "width": 1771,
      "height": 976
    },
    "backgroundImage": "ui/yuansu/菱形格子/20260716-111958.png",
    "foregroundImage": "ui/yuansu/菱形格子/20260716-141239.png",
    "referenceMask": []
  },
  "grid": {
    "type": "isometric-board",
    "cols": 40,
    "rows": 40,
    "cellWidth": 40,
    "cellHeight": 20,
    "originX": 885,
    "originY": 110,
    "snap": true,
    "visible": true,
    "showCoordinates": true,
    "showOutline": true
  },
  "instances": [
    {
      "id": "haozhou-keep",
      "prefabId": "keep",
      "gridX": 16,
      "gridY": 10,
      "render": { "visible": true, "locked": false, "zIndexMode": "y-sort", "zIndex": null }
    }
  ]
}
```

- [ ] **Step 4: Run verification for the new runtime data path**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- `composeCityStageLayout` is referenced by runtime code
- example layout uses `instances`

- [ ] **Step 5: Commit**

```bash
git add \
  src/ui/views/city/city-stage-layout-data.ts \
  src/ui/views/city/city-stage-layout.ts \
  tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json \
  tools/city-map-building-editor/examples/haozhou-city-layout.example.json \
  tests/city-map-building-editor.test.cjs
git commit -m "feat: compose city stage entities from prefabs"
```

