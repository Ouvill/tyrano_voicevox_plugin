export class SoundPlayer {
    private buf: number

    constructor(buf: number) {
        this.buf = buf
    }

    async play(file: string) {
        const se_pm = {
            loop: "false",
            storage: file,
            buf: this.buf,
        }

        TYRANO.kag.ftag.startTag("playse", se_pm)
    }

    async cancel() {
        const pm = {
            buf: this.buf
        }

        TYRANO.kag.ftag.startTag("stopse", pm)
    }

}
