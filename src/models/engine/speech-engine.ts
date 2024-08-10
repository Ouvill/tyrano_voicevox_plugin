import { SpeechTask } from '../speech-task'

export interface SpeechEngine {
    generate(task: SpeechTask): Promise<string>
    cancel(): void
}
