import { EngineInfo } from "./speech-task.ts";

/**
 * キャラのコンフィグ
 */
export type SpeakerInfo = {
  /** キャラボイスのbusを指定 */
  buf: number;
  /** 音声合成エンジンの指定 */
  engine: EngineInfo;
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
  charas: {
    [key: string]: SpeakerInfo;
  };
};

export const store: Store = {
  isTextToSpeechEnabled: false,
  voicevox_url: "http://localhost:50021",
  charas: {},
  layers: ["message0"],
};
