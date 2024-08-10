export class SoundPlayer {
    private readonly buf: number;
    private playing: boolean;
    private cancelCurrentPlay: (() => void) | null = null;

    constructor(buf: number) {
        this.buf = buf;
        this.playing = false;
    }

    private async getAudioDuration(audioFile: Blob): Promise<number> {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const url = URL.createObjectURL(audioFile)

            const loadedMetadataHandler = () => {
                const duration = audio.duration;
                cleanup();
                resolve(duration);
            };

            const errorHandler = (error: ErrorEvent) => {
                cleanup();
                reject(new Error(`Failed to load audio file: ${error.message}`));
            };

            const cleanup = () => {
                audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
                audio.removeEventListener('error', errorHandler);
                URL.revokeObjectURL(url)
                audio.src = '';
            };

            audio.addEventListener('loadedmetadata', loadedMetadataHandler);
            audio.addEventListener('error', errorHandler);

            audio.src = url;
        });
    }

    private createCancellableTimeout(ms: number): { promise: Promise<void>; cancel: () => void } {
        let timeoutId: number;
        let resolve: () => void;
        let reject: (reason?: any) => void;

        const promise = new Promise<void>((res, rej) => {
            resolve = res;
            reject = rej;
            timeoutId = window.setTimeout(resolve, ms);
        });

        const cancel = () => {
            clearTimeout(timeoutId);
            reject(new Error('Timeout cancelled'));
        };

        return {promise, cancel};
    }

    async play(file: Blob): Promise<void> {
        if (this.playing) {
            this.cancel();
        }

        const duration = await this.getAudioDuration(file);
        const url = URL.createObjectURL(file)

        const se_pm = {
            loop: "false",
            storage: url,
            buf: this.buf,
        };

        this.playing = true;
        TYRANO.kag.ftag.startTag("playse", se_pm);

        const {promise, cancel} = this.createCancellableTimeout(duration * 1000);
        this.cancelCurrentPlay = cancel;

        try {
            await promise;
        } finally {
            this.playing = false;
            this.cancelCurrentPlay = null;
        }
    }

    cancel() {
        if (this.playing) {
            const pm = {
                buf: this.buf
            };

            TYRANO.kag.ftag.startTag("stopse", pm);

            if (this.cancelCurrentPlay) {
                this.cancelCurrentPlay();
            }

            this.playing = false;
            this.cancelCurrentPlay = null;
        }
    }
}
