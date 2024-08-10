import { SpeechTask } from "../speech-task";

export interface SpeechEngine {
  generate(task: SpeechTask): Promise<Blob>;
  cancel(): void;
}
