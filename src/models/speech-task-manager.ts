import {SpeechEngine} from "./engine/speech-engine";
import {VoicevoxClient} from "./engine/voicevox-client.ts";
import {SpeechTask} from "./speech-task";
import {SoundPlayer} from "./sound-player.ts";

// 今後増やす
type EngineType = 'voicevox'

export type Priority = 'queue' | 'immediate'

class EngineManager {
    getEngine(type: EngineType): SpeechEngine {
        if (type == 'voicevox') {
            return new VoicevoxClient()
        } else {
            throw new Error("Not compatible")
        }
    }
}

export class SpeechTaskManager {
    private queue: SpeechTask[] = [];
    private isProcessing = false;
    private currentEngine: SpeechEngine | null = null;
    private currentPlayer: SoundPlayer | null = null;
    private engineManager = new EngineManager()

    enqueue(task: SpeechTask) {
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
            const voice_file = await engine.generate(task)
            this.currentEngine = null


            const player = new SoundPlayer(task.buf)
            this.currentPlayer = player;
            await player.play(voice_file)
            this.currentPlayer = null
        }

        this.isProcessing = false
    }

    cancelCurrentTask() {
        if (this.currentEngine) {
            this.currentEngine.cancel()
            this.currentEngine = null
        }

        if (this.currentPlayer) {
            this.currentPlayer.cancel()
            this.currentPlayer = null
        }
    }
}
