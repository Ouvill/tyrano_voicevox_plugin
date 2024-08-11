import { StoreService } from "../service/store-service.ts";
import { SpeakerInfo } from "../models/store.ts";
import { EngineInfo } from "../models/speech-task.ts";

type Tag = {
  vital: string[];
  pm: Record<string, any>;

  start(pm: Record<string, any>): void;
};

/**
 * Function to register TyranoScript tags in bulk
 * @param extensionObj
 */
function extendMasterTag(extensionObj: Record<string, Tag>) {
  Object.entries(extensionObj).forEach(([key, value]) => {
    if (TYRANO.kag.ftag.master_tag[key]) {
      console.warn("すでにタグが追加されています");
      return;
    }
    TYRANO.kag.ftag.master_tag[key] = value;
  });
}

const extendTags: Record<string, Tag> = {
  /**
   * #[regist_voicevox_app]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * VoiceVoxのアプリ指定
   *
   * :epx
   * VoiceVoxのアプリを指定します。
   *
   * :param
   * url = VOICEVOXのサーバーを指定します。
   * next = シナリオファイルの次の命令を実行するか。
   *
   * #end
   */
  regist_voicevox_app: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      next: true,
    },
    /**
     * Starts the application
     * @param {Object} pm - The parameter object for starting the application
     */
    start: function (pm) {
      const store = new StoreService();
      if (typeof pm.url == "string") {
        store.setVoiceVoxUrl(pm.url);
      }
      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },

  /**
   * #[voicevox_on]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * VoiceVoxの読み上げの有効化
   *
   * :exp
   * VoiceVoxの読み上げを有効化します
   *
   * :param
   *
   * #[end]
   */
  voicevox_on: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      next: true,
    },
    start: function (pm) {
      const store = new StoreService();
      store.setTextToSpeechEnable(true);
      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },

  /**
   * #[voicevox_off]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * VoiceVoxの読み上げの無効化
   *
   * :exp
   * VoiceVoxの読み上げを無効化します
   *
   * :param
   *
   * #[end]
   */
  voicevox_off: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      next: true,
    },
    start: function (pm) {
      const store = new StoreService();
      store.setTextToSpeechEnable(false);
      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },

  /**
   * #[voicevox_off]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * VoiceVoxの読み上げの無効化
   *
   * :exp
   * VoiceVoxの読み上げを無効化します
   *
   * :param
   *
   * #[end]
   */
  voicevox_layer: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      next: true,
    },
    start: function (pm) {
      const store = new StoreService();
      if (typeof pm.layers === "string") {
        store.setLayer(pm.layers);
      }

      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },

  /**
   * #[voicevox_chara]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * キャラのVOICEVOX設定
   *
   * :exp
   * VoiceVoxの読み上げを無効化します
   *
   * :param
   * name = キャラクター名を指定します。
   * buf = 音声を鳴らす音声スロットを指定します。デフォルトは 1
   * speaker = ボイスボックスのキャラクターを指定します。[四国めたん、ずんだもん、春日部つむぎ]
   * style = 声のスタイルを指定します。[ノーマル、あまあま、つんつん]
   *
   * #[end]
   */
  voicevox_chara: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      buf: 1,
      next: true,
    },
    start: function (pm) {
      const store = new StoreService();
      if (typeof pm.name !== "string") {
        console.error("voicevox error: キャラクター名を指定してください");
        return;
      }
      const update: DeepPartial<SpeakerInfo> = store.getChara(pm.name) || {};

      if (typeof pm.buf === "string") {
        update["buf"] = parseInt(pm.buf);
      } else if (typeof pm.buf === "number") {
        update["buf"] = pm.buf;
      }

      const tmpEngine: EngineInfo = {
        type: "voicevox",
        speaker: "",
      };

      if (typeof pm.speaker === "string") {
        tmpEngine.speaker = pm.speaker;
      }

      if (typeof pm.style === "string") {
        tmpEngine.style = pm.style;
      }

      store.updateChara(pm.name, update);

      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },
};

extendMasterTag(extendTags);
