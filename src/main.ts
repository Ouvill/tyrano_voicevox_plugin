import { AppEventMap, EventBus } from "./models/event-bus";
import { SpeechTaskManager } from "./models/speech-task-manager.ts";
import { Preset, getStore } from "./models/store.ts";
import { patchJQuery } from "./patch.ts";
import { registerVoiceVoxTag } from "./presentation/tag.ts";
import { PLUGIN_NAME } from "./constants.ts";
import { isTyranoDebugMode } from "./lib/is-tyrano-debug-mode.ts";
import { SpeechTask } from "./models/speech-task.ts";

const taskManager = new SpeechTaskManager();

/**
 * クリック待ちが解除されたときはページ送りなどが発生しているので
 * キャンセル処理を行う
 */
function registerCancelAllTaskHandler() {
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
}

/**
 * メッセージが更新されたときは
 * @param eventBus
 */
function registerOnMessageHandler(eventBus: EventBus<AppEventMap>) {
  // メッセージウィンドウが更新されたら発火
  TYRANO.kag.on("tag-text-message", (e) => {
    const message = e.target.val;
    const chara_name = TYRANO.kag.chara.getCharaName(true);
    const chara_id = TYRANO.kag.stat.jcharas[chara_name] || chara_name;

    const layer = TYRANO.kag.stat.current_layer;

    eventBus.emit("message", {
      message,
      chara_id,
      layer,
    });
  });

  eventBus.on("message", ({ chara_id, layer, message }) => {
    const store = getStore();
    if (!store.isTextToSpeechEnabled) {
      return;
    }

    const chara_voice = store.charas[chara_id];
    if (!chara_voice) {
      return;
    }

    if (!store.layers.includes(layer)) {
      return;
    }

    // presetの取得
    let preset: Preset | undefined;
    if (chara_voice.engine.preset && store.presets[chara_voice.engine.preset]) {
      preset = store.presets[chara_voice.engine.preset];
    }

    // nextMessageが指定されているときの処理
    let text = message;
    let isAquesTalkNotation = false;
    if (store.nextMessage) {
      text = store.nextMessage.text;
      isAquesTalkNotation = store.nextMessage.isAquesTalkNotation;
      store.nextMessage = undefined;
    }

    const task: SpeechTask = {
      charaName: chara_id,
      text: text,
      isAquesTalkNotation,
      buf: chara_voice.buf,
      engineInfo: {
        type: "voicevox",
        speaker: chara_voice.engine.speaker,
        style: chara_voice.engine.style,
        preset: preset,
      },
    };

    taskManager.enqueue(task);
  });
}

const isDev = import.meta.env.MODE == "development";

/**
 * Initializes the application by setting up event listeners and registering callbacks.
 *
 * @return {void}
 */
async function init() {
  if (isTyranoDebugMode()) {
    console.log("debug mode");
    const { addDevUi } = await import("./ui/addDevUi.ts");
    addDevUi();
  }

  if (isDev) {
    TYRANO.kag.enableEventLogging();
  }

  // setInitializedFlag
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

  // イベント処理の登録
  const eventBus = EventBus.getInstance<AppEventMap>();

  registerVoiceVoxTag();
  registerCancelAllTaskHandler();
  registerOnMessageHandler(eventBus);
}

init();
