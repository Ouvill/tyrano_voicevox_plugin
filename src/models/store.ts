import { EngineInfo } from "./speech-task.ts";
import { PLUGIN_NAME } from "../constants.ts";

/**
 * キャラのコンフィグ
 */
export type SpeakerInfo = {
  /** キャラボイスのbusを指定 */
  buf: number;
  /** 音声合成エンジンの指定 */
  engine: EngineInfo;
};

export const defaultSpeakerInfo: SpeakerInfo = {
  buf: 1,
  engine: {
    type: "voicevox",
    speaker: "",
  },
};

/**
 * VOVOICEVOXの音程調整設定
 */
export type Preset = {
  id: string;
  /** 話速 */
  speedScale: number;
  /** 音高 */
  pitchScale: number;
  /** 抑揚 */
  intonationScale: number;
  /** 音量 */
  volumeScale: number;
  /** 開始無音 */
  prePhonemeLength: number;
  /** 終了無音 */
  postPhonemeLength: number;
};

export const defaultPreset: Preset = {
  id: "default",
  speedScale: 1,
  pitchScale: 0,
  intonationScale: 1,
  volumeScale: 1,
  prePhonemeLength: 0.1,
  postPhonemeLength: 0.1,
};

/**
 * メッセージを上書きするためのキャッシュ
 */
export type NextMessage = {
  /** メッセージ本体 */
  text: string;
  /** AquesTalk記法に従っているか */
  isAquesTalkNotation: boolean;
};

/**
 * pluginの状態管理
 */
export type Store = {
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
  presets: {
    [key: string]: Preset;
  };
  nextMessage?: NextMessage;
};

const store: Store = {
  isTextToSpeechEnabled: false,
  voicevox_url: "http://localhost:50021",
  charas: {},
  layers: ["message0"],
  presets: {},
};

export const getStore = (): Store => {
  if (TYRANO.kag.stat.f[PLUGIN_NAME] !== undefined) {
    return TYRANO.kag.stat.f[PLUGIN_NAME] as Store;
  } else {
    TYRANO.kag.stat.f[PLUGIN_NAME] = store;
    return TYRANO.kag.stat.f[PLUGIN_NAME];
  }
};
