export interface VoiceVoxInfo {
    type: 'voicevox',
    url: string,
    speaker: string,
    style: string,
    preset: string,
}

export interface SpeechTask {
    text: string,
    buf: number
    priority: 'queue' | 'immediate'
    engineInfo: VoiceVoxInfo
}
