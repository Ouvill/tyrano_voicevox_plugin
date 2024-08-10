import {VoiceVoxInfo} from "./speech-task.ts";

/**
 * キャラのコンフィグ
 */
type SpeakerInfo = {
    /** キャラボイスのbusを指定 */
    buf: number
    /** 音声合成エンジンの指定 */
    engine: VoiceVoxInfo
}
type Store = {
    voicevox: string,
    layers: string[]
    chara: {
        [key: string]: SpeakerInfo
    },
}
export const store: Store = {
    voicevox: "http://localhost:50021",
    chara: {},
    layers: ['message0']
}
