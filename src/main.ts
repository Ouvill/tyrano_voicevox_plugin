import { EventBus, StrictEventMap } from "./models/event-bus";
import { SpeechTaskManager } from "./models/speech-task-manager.ts";
import { store } from "./models/store.ts";

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
  }

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
    const speaker = store.chara[chara_id];
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
        url: store.voicevox,
        speaker: speaker.engine.speaker,
        style: speaker.engine.style,
        preset: speaker.engine.preset,
      },
    });
  });
}

TYRANO.kag.enableEventLogging();
init();
