const nodeTest = require("node:test");
const assert = require("node:assert/strict");

nodeTest(
  "city-begging detached runtime keeps host-delivered pointer updates for the active launch",
  () => {
    const {
      createCityBeggingMiniGameState,
      setCityBeggingMiniGamePointer,
    } = require("../.test-dist/application/playables/builtin/city-begging/city-begging-minigame.js");
    const {
      hydrateCityBeggingDetachedRuntime,
      readCityBeggingDetachedRuntimeState,
      resetCityBeggingDetachedRuntime,
    } = require(
      "../.test-dist/application/playables/builtin/city-begging/city-begging-runtime-controller.js"
    );

    resetCityBeggingDetachedRuntime();

    try {
      const initialState = createCityBeggingMiniGameState(0, "village-catching");
      const initialDetachedState =
        hydrateCityBeggingDetachedRuntime(initialState);
      const movedState = setCityBeggingMiniGamePointer(initialState, 160);
      const movedDetachedState =
        hydrateCityBeggingDetachedRuntime(movedState);

      assert.equal(initialState.variantState.status, "playing");
      assert.equal(movedState.variantState.status, "playing");
      assert.equal(initialDetachedState.variantState.pointerX, 500);
      assert.equal(movedState.variantState.pointerX, 160);
      assert.equal(movedDetachedState.variantState.pointerX, 160);
      assert.equal(
        readCityBeggingDetachedRuntimeState()?.variantState.pointerX,
        160
      );
    } finally {
      resetCityBeggingDetachedRuntime();
    }
  }
);
