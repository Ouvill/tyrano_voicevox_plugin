import {
  defaultPreset,
  defaultSpeakerInfo,
  Preset,
  SpeakerInfo,
  store,
} from "../models/store";

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

  updateChara(charaId: string, info: DeepPartial<SpeakerInfo>) {
    const chara = this.getChara(charaId) || defaultSpeakerInfo;

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

  updatePreset(id: string, preset: Partial<Preset>) {
    const prePreset = store.presets[id] || defaultPreset;

    store.presets[id] = { ...prePreset, ...preset };
  }
}
