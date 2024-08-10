import { SpeechEngine } from "./engine/speech-engine";
import { VoiceVoxEngine } from "./engine/voicevox-engine";
import { SpeechTask } from "./speech-task";

type EngineType = 'voicevox' | 'google' | 'aws'

export type Priority = 'queue' | 'immediate'

class EngineManager {
    private engines: Map<string, SpeechEngine> = new Map()

    getEngine(type: EngineType): SpeechEngine {
        if (!this.engines.has(type)) {
            this.engines.set(type, new VoiceVoxEngine())
        }
        return this.engines.get(type)!
    }
}

export class SpeechTaskManager {
    private queue: SpeechTask[] = [];
    private isProcessing = false;
    private currentEngine: SpeechEngine | null = null;
    private engineManager = new EngineManager()

    euqueue(task: SpeechTask) {
        if (task.priority === 'immediate') {
            this.queue = []
            this.cancelCurrentTask()
            this.queue.push(task)
        } else {
            this.queue.push(task)
        }
        this.processQueue()
    }

    private async processQueue() {
        if (this.isProcessing) {
            return
        }
        this.isProcessing = true

        while (this.queue.length > 0) {
            const task = this.queue.shift()!

            const engine = this.engineManager.getEngine(task.engineInfo.type)
            this.currentEngine = engine
            await engine.speak(task)
            this.currentEngine = null
        }

        this.isProcessing = false
    }

    cancelCurrentTask() {
        if (this.currentEngine) {
            this.currentEngine.cancel()
            this.currentEngine = null
        }
    }
}
