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

  setChara(charaId: string, info: SpeakerInfo) {
    store.charas[charaId] = info;
  }

  updateChara(charaId: string, info: DeepPartial<SpeakerInfo>) {
    const chara = this.getChara(charaId);

    if (chara === undefined) return;

    store.charas[charaId] = {
      ...chara,
      ...info,
      engine: {
        ...chara.engine,
        ...info.engine,
      },
    };
  }

  getChara(chara: string) {
    if (store.charas[chara]) {
      return store.charas[chara];
    } else {
      return undefined;
    }
  }
}
