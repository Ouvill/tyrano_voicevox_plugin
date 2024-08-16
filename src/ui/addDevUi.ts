import App from "./Hello.svelte";

export function addDevUi() {
  console.log("adding");
  const div = document.createElement("div");
  div.id = "svelte";


  document.body.appendChild(div);
  return new App({
    target: div,
  });
}
