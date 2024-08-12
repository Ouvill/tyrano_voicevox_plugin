import { SpeechEngine } from "./speech-engine";
import { SpeechTask } from "../speech-task";
import createClient from "openapi-fetch";
import { paths } from "../../types/voicevox-api";

export class VoicevoxClient implements SpeechEngine {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor(url: string) {
    this.baseUrl = url;
  }

  private async getSpeakerId({
    baseUrl,
    speakerName,
    styleName,
    signal,
  }: {
    baseUrl: string;
    speakerName: string;
    styleName?: string;
    signal: AbortSignal;
  }): Promise<number> {
    const client = createClient<paths>({ baseUrl });
    const { data, error } = await client.GET("/speakers", { signal });

    if (error || !data) {
      throw new Error("Failed to fetch speakers");
    }
    const speaker = data.find((speaker) => speaker.name === speakerName);
    if (!speaker) {
      throw new Error("Speaker not found");
    }
    const style =
      speaker.styles.find((style) => style.name === styleName) ||
      speaker.styles[0];
    return style.id;
  }

  async generate(task: SpeechTask) {
    if (this.abortController) {
      this.cancel();
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const client = createClient<paths>({ baseUrl: this.baseUrl, signal });

      const speakerId = await this.getSpeakerId({
        baseUrl: this.baseUrl,
        speakerName: task.engineInfo.speaker,
        styleName: task.engineInfo.style,
        signal: signal,
      });

      // Generate audio query
      const { data: audioQuery, error: queryError } = await client.POST(
        "/audio_query",
        {
          params: {
            query: { speaker: speakerId, text: task.text },
          },
        },
      );
      if (queryError || !audioQuery) {
        throw new Error("Failed to fetch audio");
      }

      // Generate audio
      const { data: voice, error: generateError } = await client.POST(
        "/synthesis",
        {
          params: {
            query: { speaker: speakerId },
          },
          body: audioQuery,
          parseAs: "blob",
        },
      );
      if (generateError || !voice) {
        throw new Error("Failed to generate audio");
      }

      return voice;
    } finally {
      this.abortController = null;
    }
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
