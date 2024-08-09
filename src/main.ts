import { EventBus, StrictEventMap } from "./event-bus";
import { SpeakerInfo, Priority, SpeechTaskManager } from "./task-manager";

interface AppEventMap extends StrictEventMap {
    message: {
        chara_id: string;
        message: string;
        layer: string;
        priority: Priority;
    };
}


type Store = {
    voicevox: string,
    chara: {
        [key: string]: SpeakerInfo
    },
    layers: string[]
}

const store: Store = {
    voicevox: "http://localhost:50021",
    chara: {},
    layers: ['message0']
}

const taskManager = new SpeechTaskManager()

function init() {
    const eventBus = EventBus.getInstance<AppEventMap>()
    TYRANO.kag.on("tag-text-message", (e) => {
        const message = e.target.val;
        const chara_id = TYRANO.kag.chara.getCharaName(true)
        const layer = TYRANO.kag.stat.current_layer

        // ログ結合が有効ならqueue、無効ならimmediate
        const priority: Priority = TYRANO.kag.stat.log_join ? "queue" : "immediate"

        eventBus.emit("message", {
            message,
            chara_id,
            layer,
            priority

        })
    })

    eventBus.on("message", ({ chara_id, layer, message, priority }) => {
        const speaker = store.chara[chara_id]
        if (!speaker) {
            return
        }
        if (!store.layers.includes(layer)) {
            return
        }

        taskManager.euqueue({
            text: message,
            priority,
            engineInfo: {
                type: "voicevox",
                url: store.voicevox,
                speaker: speaker.speaker,
                style: speaker.style,
                preset: speaker.preset
            }
        })
    })
}

init()
