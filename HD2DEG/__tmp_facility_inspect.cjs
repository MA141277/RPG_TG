const { chromium } = require('C:/Users/13594/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:8765/pixel-workflow.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const data = await page.evaluate(async () => {
    window.ensureFacilityProfileAsync = async () => ({ status: 'ready', actionLabel: '熔炼', summary: '' });
    window.ensureFacilityRecipesAsync = async (_o, record) => {
      if (record?.recipe) {
        record.recipe.status = 'idle';
        record.recipe.candidates = [];
        record.recipe.selectedId = '';
      }
      return record?.recipe || { status: 'idle', candidates: [] };
    };
    window.setFxFullscreen(true);
    const obj = {
      id: 999001,
      name: '测试设施',
      wx: 0,
      wy: 0,
      tags: ['facility'],
      interactionTags: ['facility-open'],
      properties: { facility: window.sanitizeFacilityRecord(null, { name: '测试设施' }) }
    };
    obj.properties.facility.profile.status = 'ready';
    obj.properties.facility.profile.actionLabel = '熔炼';
    obj.properties.facility.profile.updatedAt = Date.now();
    window.__facilityTestObj = obj;
    window.openFacilityModal(obj);
    await new Promise(r => setTimeout(r, 1000));
    const img = document.querySelector('#fxInteractionModalCard .fx-container-slot-hotbar img');
    const btn = document.querySelector('#fxInteractionModalCard .fx-container-slot-hotbar');
    const slot = document.querySelector('#fxInteractionModalCard .fx-container-slot[data-transform-index="0"]');
    return {
      img: img ? {
        src: img.getAttribute('src'),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        rect: { x: img.getBoundingClientRect().x, y: img.getBoundingClientRect().y, w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height },
        style: {
          display: getComputedStyle(img).display,
          visibility: getComputedStyle(img).visibility,
          opacity: getComputedStyle(img).opacity,
          width: getComputedStyle(img).width,
          height: getComputedStyle(img).height,
        }
      } : null,
      btn: btn ? {
        rect: { x: btn.getBoundingClientRect().x, y: btn.getBoundingClientRect().y, w: btn.getBoundingClientRect().width, h: btn.getBoundingClientRect().height },
        style: {
          display: getComputedStyle(btn).display,
          visibility: getComputedStyle(btn).visibility,
          opacity: getComputedStyle(btn).opacity,
          color: getComputedStyle(btn).color,
          background: getComputedStyle(btn).backgroundColor,
        },
        html: btn.innerHTML,
      } : null,
      slot: slot ? {
        rect: { x: slot.getBoundingClientRect().x, y: slot.getBoundingClientRect().y, w: slot.getBoundingClientRect().width, h: slot.getBoundingClientRect().height },
        html: slot.innerHTML,
      } : null,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
  process.exit(0);
})();
