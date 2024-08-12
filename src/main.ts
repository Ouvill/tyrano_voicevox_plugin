import { EventBus, StrictEventMap } from "./models/event-bus";
import { SpeechTaskManager } from "./models/speech-task-manager.ts";
import { store } from "./models/store.ts";
import { patchJQuery } from "./patch.ts";
import { registerVoiceVoxTag } from "./presentation/tag.ts";

const PLUGIN_NAME = "TYRANO_VOICEVOX_PLUGIN";

interface AppEventMap extends StrictEventMap {
  message: {
    chara_id: string;
    message: string;
    layer: string;
  };
}

const taskManager = new SpeechTaskManager();

/**
 * Initializes the application by setting up event listeners and registering callbacks.
 *
 * @return {void}
 */
function init(): void {
  if (
    !window.tyrano ||
    !window.tyrano.plugin ||
    window.tyrano.plugin[PLUGIN_NAME] !== undefined
  ) {
    return;
  } else {
    window.tyrano.plugin[PLUGIN_NAME] = PLUGIN_NAME;
  }

  //@ts-expect-error
  patchJQuery($);

  registerVoiceVoxTag();

  // Plugin利用者が変数確認しやすいようにティラノスクリプト側に変数登録
  // (不要)
  TYRANO.kag.stat.f["voicevox"] = store;

  // イベント処理の登録
  const eventBus = EventBus.getInstance<AppEventMap>();
  // メッセージウィンドウが更新されたら発火
  TYRANO.kag.on("tag-text-message", (e) => {
    const message = e.target.val;
    const chara_name = TYRANO.kag.chara.getCharaName(true);
    const chara_id = TYRANO.kag.stat.jcharas[chara_name] || "";

    const layer = TYRANO.kag.stat.current_layer;

    eventBus.emit("message", {
      message,
      chara_id,
      layer,
    });
  });

  // [l]タグでクリック待ちが発生する。クリックイベントが発生したのち、nextorderが実行される。
  // メッセージが更新されると予想されるので、音声再生を停止
  TYRANO.kag.on("tag-l", () => {
    TYRANO.kag.once("nextorder", () => {
      taskManager.cancelAllTask();
    });
  });

  // [p]タグでクリック待ちが発生する。クリックイベントが発生したのち、nextorderが実行される。
  // メッセージが更新されると予想されるので、音声再生を停止
  TYRANO.kag.on("tag-p", () => {
    TYRANO.kag.once("nextorder", () => {
      taskManager.cancelAllTask();
    });
  });

  eventBus.on("message", ({ chara_id, layer, message }) => {
    if (!store.isTextToSpeechEnabled) {
      return;
    }

    const speaker = store.charas[chara_id];
    if (!speaker) {
      return;
    }
    if (!store.layers.includes(layer)) {
      return;
    }

    taskManager.enqueue({
      text: message,
      buf: speaker.buf,
      engineInfo: {
        type: "voicevox",
        speaker: speaker.engine.speaker,
        style: speaker.engine.style,
        preset: speaker.engine.preset,
      },
    });
  });
}

TYRANO.kag.enableEventLogging();
init();
