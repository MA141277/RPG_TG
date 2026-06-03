    (function () {
      if (location.protocol === "file:") {
        var w = document.getElementById("fileProtoWarn");
        if (w) w.hidden = false;
      }
      if (new URLSearchParams(location.search).get("embed") === "1") {
        document.body.classList.add("is-embedded-engine");
      }
    })();

    function ls(key, val) {
      try {
        if (val === undefined) return localStorage.getItem(key);
        localStorage.setItem(key, val);
      } catch (e) {}
      return val === undefined ? null : undefined;
    }

    // ⚠ 注意：把 key 写死在前端文件里并不安全（任何拿到此 HTML 的人都能提取出来）。
    // 你要求“不显示并写死”，这里按要求实现。
    const CONFIG = {
      baseUrl: "https://epone.ggb.today",
      apiKey: "sk-CNzjubL7xVCdLzw3VF9lPrBMqUqjTwhon4CRy5qDiJOeAm2f",
      defaultModel: "nano-banana",
      imageSize: "1024x1024",
      // 火山 Ark（豆包）生图：用于“资源掉落物品 icon”
      arkImageApiUrl: "https://ark.cn-beijing.volces.com/api/v3/images/generations",
      arkImageModel: "doubao-seedream-5-0-260128",
      arkApiKey: "ark-1b0dbad2-561e-447a-b109-10aab9acd4c0-04673",
    };
