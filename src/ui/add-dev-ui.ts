import App from "./App.svelte";
import { isDevOpen } from "./store.ts";
import { get } from "svelte/store";
import { PLUGIN_NAME } from "../constants.ts";
import { enablePatches } from "immer";
import { AppEventMap, EventBus } from "../models/event-bus.ts";
import { taskStore } from "./task-store.ts";
import { getTyranoDebugElement } from "../lib/is-tyrano-debug-mode.ts";

enablePatches();

function addOpenExtensionUiButton() {
  const reloadButtonContainer = getTyranoDebugElement();
  if (reloadButtonContainer === null) {
    return;
  }

  const button = document.createElement("button");
  button.innerText = "VoiceVoxUI 開く";
  button.style.marginLeft = "4px";
  button.style.marginRight = "4px";
  button.onclick = (e) => {
    e.stopPropagation();
    isDevOpen.update((bool) => !bool);
    button.innerText = `VoiceVoxUI ${get(isDevOpen) ? "閉じる" : "開く"}`;
  };
  reloadButtonContainer.appendChild(button);
}

function addMainExtensionUi() {
  const container_id = `${PLUGIN_NAME}_container`;
  let div = document.getElementById(container_id);
  if (div) {
    div.innerHTML = ``;
  } else {
    div = document.createElement("div");
    div.id = container_id;
  }

  document.body.insertAdjacentElement("afterbegin", div);
  return new App({
    target: div,
  });
}

export function addDevUi() {
  const eventBus = EventBus.getInstance<AppEventMap>();
  eventBus.on("generatedSpeech", (task) => {
    taskStore.addTask(task);
  });

  addOpenExtensionUiButton();
  addMainExtensionUi();
}
