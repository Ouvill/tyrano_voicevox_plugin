import { SpeechEngine } from "./speech-engine";
import { SpeechTask } from "../speech-task";
import createClient from "openapi-fetch";
import { paths } from "../../types/voicevox-api";
import { AbortError } from "../abort-error.ts";

export class VoicevoxClient implements SpeechEngine {
  private readonly baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  private async getSpeakerId({
    client,
    speakerName,
    styleName,
  }: {
    client: ReturnType<typeof createClient<paths>>;
    speakerName: string;
    styleName?: string;
  }): Promise<number> {
    const { data, error } = await client.GET("/speakers");

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

  async generate(task: SpeechTask, abortSignal: AbortSignal) {
    try {
      const client = createClient<paths>({
        baseUrl: this.baseUrl,
        signal: abortSignal,
      });

      const speakerId = await this.getSpeakerId({
        client,
        speakerName: task.engineInfo.speaker,
        styleName: task.engineInfo.style,
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
    } catch (error) {
      if (abortSignal.aborted) {
        throw new AbortError("Speech generation aborted");
      }
      throw error;
    }
  }
}
