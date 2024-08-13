export class TyranoSoundPlayer {
  private cancelCallback: (() => void) | null = null;
  private readonly buf: number;
  private isPlaying: boolean = false;

  constructor(buf: number) {
    this.buf = buf;
  }

  wavBlobToDataUrl(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to convert blob to data URL"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  async play({ charaName, blob }: { charaName: string; blob: Blob }) {
    const dataUrl = await this.wavBlobToDataUrl(blob);

    return new Promise<void>((resolve) => {
      const buf = this.buf;
      this.isPlaying = true;

      this.cancelCallback = () => {
        resolve();
      };

      TYRANO.kag.ftag.startTag("playse", {
        chara: charaName,
        storage: dataUrl,
        buf: buf,
        stop: true,
      });
      TYRANO.kag.tmp.map_se[buf].once("end", () => {
        this.isPlaying = false;
        resolve();
      });
    });
  }

  cancel() {
    if (this.isPlaying && this.cancelCallback != null) {
      TYRANO.kag.ftag.startTag("stopse", { buf: this.buf, stop: true });
      this.cancelCallback();
    }
  }
}
