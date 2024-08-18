import { SpeechEngine } from "./engine/speech-engine";
import { VoicevoxClient } from "./engine/voicevox-client.ts";
import { SpeechTask } from "./speech-task";
import { SoundPlayer } from "./sound-player.ts";
import { TyranoSoundPlayer } from "./tyrano-sound-player.ts";
import { getStore } from "./store.ts";

// 今後増やす
type EngineType = "voicevox";

export class EngineManager {
  getEngine(type: EngineType): SpeechEngine {
    if (type == "voicevox") {
      return new VoicevoxClient(getStore().voicevox_url);
    } else {
      throw new Error("Not compatible");
    }
  }
}

export class SpeechTaskManager {
  private queue: SpeechTask[] = [];
  private isProcessing = false;
  private currentEngine: SpeechEngine | null = null;
  private currentPlayer: SoundPlayer | TyranoSoundPlayer | null = null;
  private engineManager = new EngineManager();
  private abortController: AbortController | null = null;

  enqueue(task: SpeechTask) {
    this.queue.push(task);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;

    while (this.queue.length > 0) {
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      try {
        const task = this.queue.shift()!;

        const engine = this.engineManager.getEngine(task.engineInfo.type);
        this.currentEngine = engine;
        const voice_file = await engine.generate(task, signal);

        if (signal.aborted) {
          continue;
        }

        const tyranoPlayer = new TyranoSoundPlayer(task.buf);
        this.currentPlayer = tyranoPlayer;

        await tyranoPlayer.play({
          charaName: task.charaName,
          blob: voice_file,
        });
      } catch (e) {
        if (signal.aborted) {
          console.log("Task was cancelled");
        } else {
          console.error(e);
        }
      } finally {
        this.abortController = null;
        this.currentEngine = null;
        this.currentPlayer = null;
      }
    }

    this.isProcessing = false;
  }

  cancelAllTask() {
    this.queue = [];
    this.cancelCurrentTask();
  }

  cancelCurrentTask() {
    if (this.abortController) {
      this.abortController.abort();
    }

    if (this.currentEngine) {
      this.currentEngine = null;
    }

    if (this.currentPlayer) {
      this.currentPlayer.cancel();
      this.currentPlayer = null;
    }
  }
}
