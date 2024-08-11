import { SpeechEngine } from "./speech-engine";
import { SpeechTask } from "../speech-task";
import createClient from "openapi-fetch";
import { paths } from "../../types/voicevox-api";

export class VoicevoxClient implements SpeechEngine {
  private baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  private async getSpeakerId(
    speakerName: string,
    styleName: string,
    baseUrl: string,
  ): Promise<number> {
    const client = createClient<paths>({ baseUrl });
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

  async generate(task: SpeechTask) {
    const client = createClient<paths>({ baseUrl: this.baseUrl });

    const speakerId = await this.getSpeakerId(
      task.engineInfo.speaker,
      task.engineInfo.style,
      this.baseUrl,
    );

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
  }

  cancel() {
    // cancel
  }
}
