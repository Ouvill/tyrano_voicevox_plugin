import { SpeechEngine } from "./speech-engine";
import { SpeechTask } from "../speech-task";
import createClient from "openapi-fetch";
import type { components } from "../../types/voicevox-api";
import { paths } from "../../types/voicevox-api";
import { AbortError } from "../abort-error.ts";

type AudioQuery = components["schemas"]["AudioQuery"];

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

  private async getAccentPhrases({
    client,
    text,
    speakerId,
    isAquesTalkNotation,
  }: {
    client: ReturnType<typeof createClient<paths>>;
    text: string;
    speakerId: number;
    isAquesTalkNotation: boolean;
  }) {
    const { data, error } = await client.POST("/accent_phrases", {
      params: {
        query: {
          text,
          speaker: speakerId,
          is_kana: isAquesTalkNotation,
        },
      },
    });
    if (error || !data) {
      throw new Error(`Faild to fetch accent_phrases ${error.text}`);
    }
    return data;
  }

  private async getAudioQuery({
    client,
    text,
    speakerId,
  }: {
    client: ReturnType<typeof createClient<paths>>;
    text: string;
    speakerId: number;
  }) {
    const { data, error } = await client.POST("/audio_query", {
      params: {
        query: { speaker: speakerId, text: text },
      },
    });
    if (error || !data) {
      throw new Error("Failed to fetch audio");
    }

    return data;
  }

  private async getSynthesis({
    client,
    speakerId,
    audioQuery,
  }: {
    client: ReturnType<typeof createClient<paths>>;
    speakerId: number;
    audioQuery: AudioQuery;
  }): Promise<Blob> {
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

  async generate(task: SpeechTask, options?: Partial<{ signal: AbortSignal }>) {
    let abortSignal = options?.signal;

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

      const baseAudioQuery = await this.getAudioQuery({
        client,
        speakerId,
        text: task.text,
      });

      // AquesTalk記法のとき、queryを更新
      let accentPhrases = baseAudioQuery.accent_phrases;
      let kana = baseAudioQuery.kana;
      if (task.isAquesTalkNotation) {
        accentPhrases = await this.getAccentPhrases({
          client,
          text: task.text,
          speakerId: speakerId,
          isAquesTalkNotation: task.isAquesTalkNotation,
        });
        kana = task.text;
      }
      const audioQuery: AudioQuery = {
        ...baseAudioQuery,
        accent_phrases: accentPhrases,
        ...task.engineInfo.preset,
        kana,
      };

      return await this.getSynthesis({
        client,
        speakerId,
        audioQuery,
      });
    } catch (error) {
      if (abortSignal?.aborted) {
        throw new AbortError("Speech generation aborted");
      }
      throw error;
    }
  }
}
