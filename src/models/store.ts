import { VoiceVoxInfo } from "./speech-task.ts";

/**
 * キャラのコンフィグ
 */
type SpeakerInfo = {
  /** キャラボイスのbusを指定 */
  buf: number;
  /** 音声合成エンジンの指定 */
  engine: VoiceVoxInfo;
};
type Store = {
  voicevox: string;
  layers: string[];
  chara: {
    [key: string]: SpeakerInfo;
  };
};
export const store: Store = {
  voicevox: "http://localhost:50021",
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
