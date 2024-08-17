import App from "./App.svelte";
import { isDevOpen } from "./store.ts";
import { get } from "svelte/store";
import { PLUGIN_NAME } from "../constants.ts";
import { enablePatches } from "immer";
import { AppEventMap, EventBus } from "../models/event-bus.ts";
import { taskStore } from "./task-store.ts";

enablePatches();

export function addDevUi() {
  const eventBus = EventBus.getInstance<AppEventMap>();
  eventBus.on("addTask", (task) => {
    taskStore.addTask(task);
  });

  const reloadButtonContainer = document.querySelector(
    "body > .ui-draggable-handle.ui-draggable",
  );

  const button = document.createElement("button");
  button.innerText = "VoiceVoxUI 開く";
  button.style.marginLeft = "4px";
  button.style.marginRight = "4px";
  button.onclick = (e) => {
    e.stopPropagation();
    isDevOpen.update((bool) => !bool);
    button.innerText = `VoiceVoxUI ${get(isDevOpen) ? "閉じる" : "開く"}`;
  };

  if (reloadButtonContainer !== null) {
    reloadButtonContainer.appendChild(button);
  }

  const container_id = `${PLUGIN_NAME}_container`;
  let div = document.getElementById(container_id);
  if (div) {
    div.innerHTML = ``;
  } else {
    div = document.createElement("div");
  }

  document.body.insertAdjacentElement("afterbegin", div);
  return new App({
    target: div,
  });
}
