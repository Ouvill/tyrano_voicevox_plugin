function extendJQuery($: { [key in string]: unknown }) {
  // ティラノスクリプトでdata-urlの判定を行っているが、imageしか受け付けていない。
  // audioファイルもtrue判定されるようにするモンキーパッチ
  $.isBase64 = function (str: string) {
    // 文字列が 'data:image' または 'data:audio' で始まっているかチェック
    return str.startsWith("data:image") || str.startsWith("data:audio");
  };
}

// @ts-expect-error
extendJQuery($);
