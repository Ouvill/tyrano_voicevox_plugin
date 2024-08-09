import { SpeechTask } from '../speech-task'

export interface SpeechEngine {
    speak(task: SpeechTask): Promise<void>
    cancel(): void
}
