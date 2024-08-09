type EngineType = 'voicevox' | 'google' | 'aws'

export type SpeakerInfo = VoiceVoxInfo

export type Priority = 'queue' | 'immediate'

interface VoiceVoxInfo {
    type: 'voicevox',
    url: string,
    speaker: string,
    style: string,
    preset: string,
}

export interface SpeechTask {
    text: string,
    priority: 'queue' | 'immediate'
    engineInfo: VoiceVoxInfo
}

interface SpeechEngine {
    speak(task: SpeechTask): Promise<void>
    cancel(): void
}

class VoiceVoxEngine implements SpeechEngine {
    async speak(task: SpeechTask): Promise<void> {


    }
    cancel() {
        // cancel
    }
}

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
