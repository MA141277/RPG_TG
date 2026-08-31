const { createConfiguredNpcAiDialogueProvider } = require('./.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js');

function createProviderRequest(overrides = {}) {
  return {
    requestId: 'npc-ai-dialogue-request-1',
    system: 'test-system',
    messages: [{ role: 'user', content: '开始和这个人交谈。' }],
    metadata: {
      contextType: 'house',
      npcId: 'char.test.npc',
      npcName: '茶博士',
      inputType: 'start_talk',
      houseId: 'house.test.tea',
      placeName: '测试茶馆',
    },
    ...overrides,
  };
}

const writes = [];
const storage = {
  _value: null,
  getItem() { return this._value; },
  setItem(key, value) { this._value = value; writes.push({ key, value }); },
};

const fetchCalls = [];
const provider = createConfiguredNpcAiDialogueProvider({
  globalObject: {
    __RPG_TG_NPC_AI_CONFIG__: {
      mode: 'openai-compatible',
      baseUrl: 'https://example.com/proxy/',
      model: 'deepseek-v3.1',
      authToken: 'secret-token',
    },
    localStorage: storage,
  },
  fetchImplementation: async (_url, init) => {
    const body = init?.body == null ? null : JSON.parse(init.body);
    fetchCalls.push(body);
    return new Response(JSON.stringify({
      id: `chatcmpl-house-gate-bad-${fetchCalls.length}`,
      object: 'chat.completion',
      model: 'deepseek-v3.1',
      choices: [{
        index: 0,
        finish_reason: 'stop',
        message: {
          role: 'assistant',
          content: fetchCalls.length === 1 ? '我替你想想。' : '[INTENT: route|go-to-house|house.kulan.keep]',
        },
      }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  },
});

(async () => {
  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: 'house',
        npcId: 'char.test.npc',
        npcName: '钱掌柜',
        inputType: 'custom_input',
        houseId: 'house.test.market',
        placeName: '测试货栈',
        customInputText: '我去帅府一趟',
        houseConversationCapabilitySnapshot: {
          cityId: 'city.kulan',
          houseId: 'house.test.market',
          moduleId: 'market-house',
          targetCharacterId: 'char.test.npc',
          targetCharacterName: '钱掌柜',
          switchableNpcTargets: [{ characterId: 'char.test.npc', characterName: '钱掌柜', available: true }],
          houseActions: [],
          houseServices: [],
          reachableHouses: [{ houseId: 'house.kulan.grain_shop', houseName: '粮铺', available: true }],
          leaveAction: { actionId: 'leave-house', label: '离开货栈', available: true },
          negotiableStoryNodes: [],
        },
      },
    }),
    (event) => { events.push(event); }
  );
  console.log(JSON.stringify({ fetchCalls: fetchCalls.length, events, writes }, null, 2));
})();