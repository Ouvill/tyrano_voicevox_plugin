import { VoiceVoxInfo } from "./speech-task.ts";

/**
 * キャラのコンフィグ
 */
export type SpeakerInfo = {
  /** キャラボイスのbusを指定 */
  buf: number;
  /** 音声合成エンジンの指定 */
  engine: VoiceVoxInfo;
};

/**
 * pluginの状態管理
 */
type Store = {
  /** 音声読み上げ機能が有効かどうか */
  isTextToSpeechEnabled: boolean;
  /** voicevoxのurl */
  voicevox_url: string;
  /** 監視対象のメッセージレイヤ */
  layers: string[];
  /** キャラごとの音声設定 */
  chara: {
    [key: string]: SpeakerInfo;
  };
};

export const store: Store = {
  isTextToSpeechEnabled: true,
  voicevox_url: "http://localhost:50021",
  chara: {
    akane: {
      buf: 1,
      engine: {
        type: "voicevox",
        preset: "",
        speaker: "春日部つむぎ",
        style: "ノーマル",
      },
    },
    zunda: {
      buf: 2,
      engine: {
        type: "voicevox",
        preset: "",
        speaker: "ずんだもん",
        style: "ノーマル",
      },
    },
  },

  layers: ["message0"],
};
