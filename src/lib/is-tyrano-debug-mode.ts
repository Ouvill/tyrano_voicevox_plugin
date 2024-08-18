/**
 * ティラノスクリプトのリロードと書かれたuiを取得する。
 */
export function getTyranoDebugElement() {
  return document.querySelector("body > .ui-draggable-handle.ui-draggable");
}

/**
 * ティラノスクリプトでデバッグモードであるかどうか判定する。
 *
 * 「リロード」と書かれたボタンに、ui-draggable
 */
export function isTyranoDebugMode() {
  const debugElement = document.querySelector(
    "body > .ui-draggable-handle.ui-draggable",
  );
  return !!debugElement;
}
