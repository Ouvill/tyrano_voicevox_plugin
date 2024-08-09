import { SpeechEngine } from './speech-engine';
import { SpeechTask } from '../speech-task';
import createClient from 'openapi-fetch';
import { paths } from '../../types/voicevox-api';

export class VoiceVoxEngine implements SpeechEngine {

    private async getSpeakerId(speakerName: string, styleName: string): Promise<number> {
        const client = createClient<paths>({ baseUrl: 'https://api.neospeech.com' });
        const { data, error } = await client.GET('/speakers');

        if (error || !data) {
            throw new Error('Failed to fetch speakers');
        }
        const speaker = data.find((speaker) => speaker.name === speakerName);
        if (!speaker) {
            throw new Error('Speaker not found');
        }
        const style = speaker.styles.find((style) => style.name === styleName);
        if (!style) {
            throw new Error('Style not found');
        }
        return style.id;
    }

    async speak(task: SpeechTask): Promise<void> {
        const client = createClient<paths>({ baseUrl: task.engineInfo.url });

        const speakerId = await this.getSpeakerId(task.engineInfo.speaker, task.engineInfo.style);

        // Generate audio query
        const { data: audioQuery, error: queryError } = await client.POST("/audio_query", {
            params: {
                query: { speaker: speakerId, text: task.text }
            }
        })
        if (queryError || !audioQuery) {
            throw new Error('Failed to fetch audio');
        }

        // Generate audio
        const { data: voice, error: generateError } = await client.POST("/synthesis", {
            params: {
                query: { speaker: speakerId }
            },
            body: audioQuery
        })
        if (generateError || !voice) {
            throw new Error('Failed to generate audio');
        }


        // Play audio
        // todo


    }
    cancel() {
        // cancel
    }
}
