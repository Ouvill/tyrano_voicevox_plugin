import { Preset } from "./store.ts";

export interface VoiceVoxInfo {
  type: "voicevox";
  speaker: string;
  style?: string;
  preset?: string;
}

export type EngineInfo = VoiceVoxInfo;

export interface VoiceVoxTask {
  type: "voicevox";
  speaker: string;
  style?: string;
  preset?: Preset;
}

export type EngineTask = VoiceVoxTask;

export interface SpeechTask {
  text: string;
  isAquesTalkNotation: boolean;
  buf: number;
  engineInfo: EngineTask;
}
