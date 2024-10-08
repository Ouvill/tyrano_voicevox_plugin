import { StoreService } from "../service/store-service.ts";
import { EngineInfo } from "../models/speech-task.ts";
import { Preset, SpeakerInfo } from "../models/store.ts";

type Tag = {
  vital: string[];
  pm: Record<string, any>;

  start(pm: Record<string, any>): void;
};

/**
 * 文字列か型を確定させる
 * @param value
 */
function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * 数字か型を確定させる
 * @param value
 */
function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * ティラノスクリプトで入力された値を数値型に解析する
 *
 * @param pm ティラノスクリプトのタグ引数オブジェクト
 * @param paramKey 解析したいタグ引数
 * @return number | undefined
 */
function parseNumberParameter(
  pm: Record<string, any>,
  paramKey: string,
): number | undefined {
  const value = pm[paramKey];
  if (value === undefined) {
    return;
  }

  if (isString(value)) {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      console.error(`"${paramKey}" が有効な数字じゃありません`);
    }
  } else if (isNumber(value)) {
    return value;
  } else {
    console.error(`"${paramKey}"が文字列または数値じゃありません`);
  }
}

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
  register_voicevox_app: {
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
   * #[voicevox_layer]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * 読み上げるメッセージレイヤーの指定
   *
   * :exp
   * 音声読み上げを行うメッセージレイヤーを選択します。カンマ区切りによる複数指定に対応しています。デフォルトは`message0`のみ
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
   * ティラノスクリプトのキャラクターにVOICEVOXの話し手を紐付けます。
   *
   * :param
   * name = キャラクター名を指定します。
   * buf = 音声を鳴らす音声スロットを指定します。デフォルトは 1
   * speaker = ボイスボックスのキャラクターを指定します。[四国めたん、ずんだもん、春日部つむぎ]
   * style = 声のスタイルを指定します。[ノーマル、あまあま、つんつん]
   * preset = [voicevox_preset]で登録したidを指定します。
   *
   * #[end]
   */
  voicevox_chara: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      next: true,
    },
    start: function (pm) {
      const store = new StoreService();
      if (typeof pm.name !== "string") {
        console.error("voicevox error: キャラクター名を指定してください");
        return;
      }
      const name = pm.name;

      const tmpChara: Partial<SpeakerInfo> = {};
      const tmpEngine: Partial<EngineInfo> = {
        type: "voicevox",
      };

      const buf = parseNumberParameter(pm, "buf");
      if (buf != undefined) {
        tmpChara.buf = buf;
      }

      if (isString(pm.speaker)) {
        tmpEngine.speaker = pm.speaker;
      }

      if (isString(pm.style)) {
        tmpEngine.style = pm.style;
      }

      if (isString(pm.preset)) {
        tmpEngine.preset = pm.preset;
      }

      store.updateChara(name, {
        ...tmpChara,
        engine: {
          ...tmpEngine,
        },
      });

      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },

  /**
   * #[voicevox_preset]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * VOICEVOXの音声調整
   *
   * :exp
   * VoiceVoxの音声を調整します。
   *
   * :param
   * id = Preset IDを設定します。任意の文字列
   * speed = 話速を指定します。デフォルトは 1
   * pitch = 音高を指定します。デフォルトは 0
   * intonation = 抑揚を指定します。デフォルトは 1
   * volume = 音量を指定します。デフォルトは 1
   * pre = 開始無音時間を指定します。デフォルトは 0.1
   * post = 終了無音時間を指定します。デフォルトは 0.1
   *
   * #[end]
   */
  voicevox_preset: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: [],
    pm: {
      next: true,
    },
    start: function (pm) {
      const tmpPreset: Partial<Preset> = {};
      const parameters: Array<{
        key: string;
        targetKey: keyof Omit<Preset, "id">;
      }> = [
        { key: "speed", targetKey: "speedScale" },
        { key: "pitch", targetKey: "pitchScale" },
        { key: "intonation", targetKey: "intonationScale" },
        { key: "volume", targetKey: "volumeScale" },
        { key: "pre", targetKey: "prePhonemeLength" },
        { key: "post", targetKey: "postPhonemeLength" },
      ];

      if (typeof pm.id !== "string" || pm.id === "") {
        console.error("Preset IDを指定してください");
        return;
      } else {
        tmpPreset.id = pm.id;
      }

      parameters.forEach(({ key, targetKey }) => {
        const value = parseNumberParameter(pm, key);
        if (value !== undefined) {
          tmpPreset[targetKey] = value;
        }
      });

      const store = new StoreService();
      store.updatePreset(tmpPreset.id, tmpPreset);

      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },

  /**
   * #[voicevox_ruby]
   *
   * :group
   * ボイス・読み上げ
   *
   * :title
   * VOICEVOX用の読み指定
   *
   * :exp
   * VOICEVOX用のフリガナを指定します。
   * 次に表示されるメッセージの読みを置換します。
   *
   * is_aques="true"のとき、AquesTalk風記法で解釈されます。
   * - 全てのカナはカタカナで記述される
   * - アクセント句は/または、で区切る。、で区切った場合に限り無音区間が挿入される。
   * - カナの手前に_を入れるとそのカナは無声化される
   * - アクセント位置を'で指定する。全てのアクセント句にはアクセント位置を1つ指定する必要がある。
   * - アクセント句末に？(全角)を入れることにより疑問文の発音ができる。
   *
   * :param
   * text = VoiceVoxに読ませたい文章を記述します。
   * is_aques = `true`のとき、AquesTalk風記法で解釈します
   *
   * :sample
   *
   * #[end]
   */
  voicevox_ruby: {
    // @ts-expect-error
    kag: TYRANO.kag,
    vital: ["text"],
    pm: {
      next: true,
    },
    start: function (pm) {
      if (!isString(pm.text)) {
        return;
      }
      const text = pm.text;
      let is_aques: boolean;
      if (isString(pm.is_aques)) {
        is_aques = !!pm.is_aques;
      } else {
        is_aques = false;
      }

      const storeService = new StoreService();
      storeService.setNextMessage({
        text,
        isAquesTalkNotation: is_aques,
      });

      if (pm.next) {
        TYRANO.kag.ftag.nextOrder();
      }
    },
  },
};

/**
 * VOICEVOX操作用のティラノスクリプトタグを登録する。
 */
export function registerVoiceVoxTag() {
  extendMasterTag(extendTags);
}
