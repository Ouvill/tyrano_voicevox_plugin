import { SpeechEngine } from './speech-engine';
import { SpeechTask } from '../speech-task';

export class VoiceVoxEngine implements SpeechEngine {



    async speak(task: SpeechTask): Promise<void> {


    }
    cancel() {
        // cancel
    }
}
