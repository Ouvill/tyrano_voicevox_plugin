export interface VoiceVoxInfo {
  type: "voicevox";
  speaker: string;
  style?: string;
  preset?: string;
}

export type EngineInfo = VoiceVoxInfo;

export interface SpeechTask {
  text: string;
  buf: number;
  engineInfo: EngineInfo;
}
