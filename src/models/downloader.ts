import { generateTaskId, SpeechTask } from "./speech-task.ts";
import { EngineManager } from "./speech-task-manager.ts";
import JSZip from "jszip";
import { AbortError } from "./abort-error.ts";

export class SpeechDownloader {
  async generateZipFile(
    tasks: SpeechTask[],
    signal: AbortSignal,
    progressCallback?: (progress: number) => void,
  ) {
    const zip = new JSZip();
    const engineManager = new EngineManager();
    const totalTask = tasks.length;
    const wavProcessingWeight = 0.8;
    const zipGenerationWeight = 0.2;

    for (let i = 0; i < totalTask; i++) {
      const task = tasks[i];
      try {
        if (signal.aborted) break;
        const taskId = generateTaskId(task);
        const engine = engineManager.getEngine(task.engineInfo.type);

        const voice_file = await engine.generate(task, { signal });

        zip.file(`${taskId}.wav`, voice_file);

        if (progressCallback) {
          const wavProgress = ((i + 1) / totalTask) * wavProcessingWeight;
          progressCallback(wavProgress);
        }
      } catch (error) {
        console.error(`Error processing: ${task.text}`, error);
      }
    }

    if (signal.aborted) throw new AbortError("zip generation aborted");

    return zip.generateAsync({ type: "blob" }, (metadata) => {
      if (progressCallback) {
        const zipProgress = (metadata.percent / 100) * zipGenerationWeight;
        const totalProgress = wavProcessingWeight + zipProgress;
        progressCallback(totalProgress);
      }
    });
  }
}
