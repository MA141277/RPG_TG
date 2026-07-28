## Task 1: Register Shared Bounce Cues And The Collision Sound Class

**Files:**
- Create: `src/application/audio/pachinko-collision-sound.ts`
- Create: `src/assets/audio/activity/pachinko-bounce-1.mp3`
- Create: `src/assets/audio/activity/pachinko-bounce-2.mp3`
- Create: `tests/pachinko-collision-sound.test.cjs`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `src/main.ts`
- Modify: `tests/audio-seam.test.cjs`

**Interfaces:**
- Consumes:
  - `queueAppAudioCue(session: AppAudioSession, cueId: string): AppAudioSession` from `src/application/audio/audio-manager.ts`
  - `playCue(cueId: string): void` from the centralized app audio controller
- Produces:
  - `BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1: "activity.pachinko.bounce.1"`
  - `BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2: "activity.pachinko.bounce.2"`
  - `export class PachinkoCollisionSoundEffect { readonly cueIds: readonly string[]; pickCueId(random?: () => number): string; play(target: { playCue(cueId: string): void }, random?: () => number): string; }`
  - `export const PACHINKO_COLLISION_SOUND: PachinkoCollisionSoundEffect`
  - `const PACHINKO_BOUNCE_PLAYBACK_VARIATION: AudioCuePlaybackVariation`

- [ ] **Step 1: Write the failing sound-class and asset-seam tests**

Create `tests/pachinko-collision-sound.test.cjs` with the dedicated wrapper contract:

```js
test("pachinko collision sound chooses only from the two registered bounce cues", () => {
  const played = [];
  const target = {
    playCue(cueId) {
      played.push(cueId);
    },
  };

  const firstCueId = PACHINKO_COLLISION_SOUND.play(target, () => 0);
  const secondCueId = PACHINKO_COLLISION_SOUND.play(target, () => 0.999);

  assert.equal(firstCueId, BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1);
  assert.equal(secondCueId, BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2);
  assert.deepEqual(played, [firstCueId, secondCueId]);
});
```

Extend `tests/audio-seam.test.cjs` so it asserts:

```js
assert.match(audioManagerSource, /activityPachinkoBounce1: "activity\.pachinko\.bounce\.1"/);
assert.match(audioManagerSource, /activityPachinkoBounce2: "activity\.pachinko\.bounce\.2"/);
assert.match(audioManagerSource, /assetPath: "audio\/activity\/pachinko-bounce-1\.mp3"/);
assert.match(audioManagerSource, /assetPath: "audio\/activity\/pachinko-bounce-2\.mp3"/);
assert.match(audioManagerSource, /const PACHINKO_BOUNCE_PLAYBACK_VARIATION: AudioCuePlaybackVariation = \{/);
assert.match(mainSource, /import pachinkoBounce1AudioUrl from "\.\/assets\/audio\/activity\/pachinko-bounce-1\.mp3\?url";/);
assert.match(mainSource, /import pachinkoBounce2AudioUrl from "\.\/assets\/audio\/activity\/pachinko-bounce-2\.mp3\?url";/);
assert.match(mainSource, /"audio\/activity\/pachinko-bounce-1\.mp3": pachinkoBounce1AudioUrl/);
assert.match(mainSource, /"audio\/activity\/pachinko-bounce-2\.mp3": pachinkoBounce2AudioUrl/);
```

- [ ] **Step 2: Run the red test cycle and confirm the shared bounce seam is missing**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-sound.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\audio-seam.test.cjs
```

Expected:

- `FAIL`
- first failures mention the missing `pachinko-collision-sound` module, missing `activityPachinkoBounce*` cue ids, or missing static asset imports

- [ ] **Step 3: Implement the minimal centralized bounce registry and sound class**

Copy the provided files into ASCII asset paths:

```powershell
Copy-Item -LiteralPath "C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\弹珠弹墙1.mp3" -Destination "src\assets\audio\activity\pachinko-bounce-1.mp3"
Copy-Item -LiteralPath "C:\Users\29636\Desktop\工作用文件\2026.7\音频和音效\弹珠弹墙2.mp3" -Destination "src\assets\audio\activity\pachinko-bounce-2.mp3"
```

Create `src/application/audio/pachinko-collision-sound.ts` with the dedicated class:

```ts
import { BUILTIN_AUDIO_CUE_IDS } from "./audio-manager";

export class PachinkoCollisionSoundEffect {
  readonly cueIds: readonly string[];

  constructor(cueIds: readonly string[]) {
    this.cueIds = cueIds;
  }

  pickCueId(random: () => number = Math.random): string {
    const index = Math.min(
      this.cueIds.length - 1,
      Math.floor(random() * this.cueIds.length)
    );
    return this.cueIds[Math.max(0, index)];
  }

  play(
    target: { playCue(cueId: string): void },
    random: () => number = Math.random
  ): string {
    const cueId = this.pickCueId(random);
    target.playCue(cueId);
    return cueId;
  }
}

export const PACHINKO_COLLISION_SOUND = new PachinkoCollisionSoundEffect([
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1,
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2,
]);
```

Extend `src/application/audio/audio-manager.ts` and `src/main.ts` so the centralized registry and static asset map include:

```ts
activityPachinkoBounce1: "activity.pachinko.bounce.1",
activityPachinkoBounce2: "activity.pachinko.bounce.2",
assetPath: "audio/activity/pachinko-bounce-1.mp3",
assetPath: "audio/activity/pachinko-bounce-2.mp3",
import pachinkoBounce1AudioUrl from "./assets/audio/activity/pachinko-bounce-1.mp3?url";
import pachinkoBounce2AudioUrl from "./assets/audio/activity/pachinko-bounce-2.mp3?url";
```

- [ ] **Step 4: Re-run the shared bounce tests until they pass**

Run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc -p tsconfig.test.json
Set-Content -Path .test-dist\package.json -Value '{"type":"commonjs"}'
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\pachinko-collision-sound.test.cjs
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tests\audio-seam.test.cjs
```

Expected:

- `PASS`

