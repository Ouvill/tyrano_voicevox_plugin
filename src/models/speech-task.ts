export interface VoiceVoxInfo {
  type: "voicevox";
  speaker: string;
  style: string;
  preset: string;
}

export interface SpeechTask {
  text: string;
  buf: number;
  engineInfo: VoiceVoxInfo;
}
