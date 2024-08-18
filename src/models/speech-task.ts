import { Preset } from "./store.ts";
import {djb2Hash} from "../lib/djb2Hash.ts";

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
  charaName: string;
  text: string;
  isAquesTalkNotation: boolean;
  buf: number;
  engineInfo: EngineTask;
}

export function generateTaskId(task: SpeechTask) {
  const taskString = JSON.stringify(task);
  const hash = djb2Hash(taskString);
  return hash.toString(16);
}
