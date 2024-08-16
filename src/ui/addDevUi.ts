import App from "./Hello.svelte";
import { isDevOpen } from "./store.ts";
import { get } from "svelte/store";

export function addDevUi() {
  console.log("adding");

  const reloadButtonContainer = document.querySelector(
    "body > .ui-draggable-handle.ui-draggable",
  );

  const button = document.createElement("button");
  button.innerText = "VoiceVoxUI 開く";
  button.style.marginLeft = "4px";
  button.style.marginLeft = "4px";
  button.onclick = (e) => {
    e.stopPropagation()
    isDevOpen.update((bool) => !bool);
    button.innerText = `VoiceVoxUI ${get(isDevOpen) ? "閉じる" : "開く"}`;
  };

  if (reloadButtonContainer !== null) {
    reloadButtonContainer.appendChild(button);
  }

  const div = document.createElement("div");

  div.id = "svelte";

  document.body.appendChild(div);
  return new App({
    target: div,
  });
}
