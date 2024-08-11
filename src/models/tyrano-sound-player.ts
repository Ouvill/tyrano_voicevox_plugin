export class TyranoSoundPlayer {
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

  async play(blob: Blob) {
    const dataUrl = await this.wavBlobToDataUrl(blob);

    return new Promise<void>((resolve) => {
      const buf = 1;
      TYRANO.kag.ftag.startTag("playse", {
        storage: dataUrl,
        buf: buf,
        stop: true,
      });
      TYRANO.kag.tmp.map_se[buf].once("end", () => {
        console.log("kag status:", TYRANO.kag.tmp);
        resolve();
      });
    });
  }

  cancel() {}
}
