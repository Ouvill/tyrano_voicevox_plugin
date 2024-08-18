import { SpeechTask } from "../speech-task";

export interface SpeechEngine {
  generate(
    task: SpeechTask,
    options?: Partial<{ signal: AbortSignal }>,
  ): Promise<Blob>;
}
