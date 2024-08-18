import {
  defaultPreset,
  defaultSpeakerInfo,
  getStore,
  NextMessage,
  Preset,
  SpeakerInfo,
  Store,
} from "../models/store";

export class StoreService {
  private store: Store;

  constructor() {
    this.store = getStore();
  }

  setTextToSpeechEnable(bool: boolean) {
    this.store.isTextToSpeechEnabled = bool;
  }

  setVoiceVoxUrl(url: string) {
    this.store.voicevox_url = url;
  }

  setLayer(layers_str: string) {
    this.store.layers = layers_str.split(",").map((layer) => layer.trim());
  }

  updateChara(charaId: string, info: DeepPartial<SpeakerInfo>) {
    const chara = this.getChara(charaId) || defaultSpeakerInfo;

    this.store.charas[charaId] = {
      ...chara,
      ...info,
      engine: {
        ...chara.engine,
        ...info.engine,
      },
    };
  }

  getChara(chara: string) {
    if (this.store.charas[chara]) {
      return this.store.charas[chara];
    } else {
      return undefined;
    }
  }

  updatePreset(id: string, preset: Partial<Preset>) {
    const prePreset = this.store.presets[id] || defaultPreset;

    this.store.presets[id] = { ...prePreset, ...preset };
  }

  setNextMessage(message: NextMessage) {
    this.store.nextMessage = message;
  }
}
