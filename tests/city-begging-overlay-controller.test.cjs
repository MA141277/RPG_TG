const nodeTest = require("node:test");
const assert = require("node:assert/strict");

nodeTest(
  "city-begging overlay controller delegates pointer and frame ticks to runtime callbacks",
  () => {
    const {
      bindCityBeggingOverlayController,
      resetCityBeggingOverlayController,
    } = require(
      "../.test-dist/application/playables/builtin/city-begging/city-begging-runtime-controller.js"
    );

    const listeners = new Map();
    let scheduledFrame = null;
    let cancelledFrameId = null;
    const pointerCalls = [];
    const tickCalls = [];
    const root = {
      addEventListener(type, handler) {
        listeners.set(type, handler);
      },
      removeEventListener(type, handler) {
        if (listeners.get(type) === handler) {
          listeners.delete(type);
        }
      },
      querySelector(selector) {
        if (selector !== "[data-begging-game-canvas]") {
          return null;
        }
        return {
          width: 1000,
          getBoundingClientRect() {
            return {
              left: 10,
              width: 200,
            };
          },
        };
      },
    };

    resetCityBeggingOverlayController();

    try {
      bindCityBeggingOverlayController({
        root,
        launchKey: "village-catching:0",
        isPlaying: true,
        onPointer(pointerX) {
          pointerCalls.push(pointerX);
        },
        onTick(now) {
          tickCalls.push(now);
        },
        requestAnimationFrame(callback) {
          scheduledFrame = callback;
          return 77;
        },
        cancelAnimationFrame(frameId) {
          cancelledFrameId = frameId;
        },
      });

      const pointerHandler = listeners.get("pointermove");
      assert.equal(typeof pointerHandler, "function");

      pointerHandler({
        clientX: 110,
      });
      assert.deepEqual(pointerCalls, [500]);

      assert.equal(typeof scheduledFrame, "function");
      scheduledFrame(1234);
      assert.deepEqual(tickCalls, [1234]);

      resetCityBeggingOverlayController();
      assert.equal(cancelledFrameId, 77);
      assert.equal(listeners.size, 0);
    } finally {
      resetCityBeggingOverlayController();
    }
  }
);
