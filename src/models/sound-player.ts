export class SoundPlayer {
    private readonly audio: HTMLAudioElement | null = null;
    private playPromise: Promise<void> | null = null;
    private resolvePlay: (() => void) | null = null;
    private rejectPlay: ((reason?: any) => void) | null = null;
    private currentUrl: string | null = null;

    constructor() {
        this.audio = new Audio()
    }

    async play(blob: Blob): Promise<void> {
        this.playPromise = new Promise((resolve, reject) => {
            this.resolvePlay = resolve;
            this.rejectPlay = reject;

            if (this.audio == null) {
                this.rejectPlay(new Error("Audio element not initialized"))
                return;
            }

            this.currentUrl = URL.createObjectURL(blob)
            this.audio.src = this.currentUrl;

            this.audio.onended = () => {
                this.resolvePlay!();
                this.cleanup()
            }

            this.audio.onerror = () => {
                this.rejectPlay!(new Error("Error playing audio"))
                this.cleanup()
            }

            this.audio.play().catch((error) => {
                this.rejectPlay!(error)
                this.cleanup();
            })
        })

        return this.playPromise
    }

    cancel() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        if (this.rejectPlay) {
            this.rejectPlay(new Error("Playback cancelled"))
        }
        this.cleanup()
    }

    private cleanup(): void {
        if (this.currentUrl) {
            URL.revokeObjectURL(this.currentUrl)
            this.currentUrl = null;
        }

        this.playPromise = null
        this.resolvePlay = null
        this.rejectPlay = null
    }
}
