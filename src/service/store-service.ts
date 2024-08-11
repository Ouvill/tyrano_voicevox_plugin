import { SpeakerInfo, store } from "../models/store";

export class StoreService {
  setTextToSpeechEnable(bool: boolean) {
    store.isTextToSpeechEnabled = bool;
  }

  setVoiceVoxUrl(url: string) {
    store.voicevox_url = url;
  }

  setLayer(layers_str: string) {
    store.layers = layers_str.split(",").map((layer) => layer.trim());
  }

  updateChara(chara: string, info: Partial<SpeakerInfo>) {
    store.chara[chara] = {
      ...store.chara[chara],
      ...info,
    };
  }
}
