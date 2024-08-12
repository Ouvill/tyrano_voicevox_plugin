import { SpeechTask } from "../speech-task";

export interface SpeechEngine {
  generate(task: SpeechTask, abortSignal: AbortSignal): Promise<Blob>;
}
