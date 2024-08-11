# Tyrano Voicevox Plugin

ティラノスクリプトの台詞をVOICEVOXで逐次再生させるプラグイン

## 導入方法

releaseページからファイルをダウンロード。

ファイルを解凍してファイルの中身をティラノスクリプトのプロジェクトフォルダーの`data/others/plugin/tyrano_voicevox_plugin`
に配置してください。

`first.ks`や任意の`.ks`ファイルの中で以下のコードを追加してください。

```TyranoScript
[plugin name="tyrano_voicevox_plugin"]
```

## 注意事項

個人的に欲しいと思ったので作成しました。

初期リリースはティラノスクリプト歴3日の人が作っているので著しくバグが存在する可能性があります。

## 想定用途

ゲーム実行時にVOICEVOXの起動を要求するのでアプリの配布には向いていません。

デバッグ用途やティラノスクリプトによる動画制作用途に向いています。

## タグリファレンス

ティラノスクリプトのアプリを起動時にVOICEVOXを起動しておく必要があります。

### [voicevox_on] VOICEVOXの読み上げを有効にする

キャラクターの音声読み上げを有効にします。

```TyranoScript
[voicevox_on url="http://localhost:50021"]
```

### [voicevox_off] VOICEVOXの読み上げを無効にする

キャラクターの音声読み上げを無効にします。

```TyranoScript
[voicevox_off]
```

### [voicevox_layer]

音声読み上げを行うメッセージレイヤーを選択します。カンマ区切りによる複数指定に対応しています。デフォルトは`message0`のみ

```TyranoScript
[voicevox_layer layers="message0, message1"]
```

### [voicevox_chara] キャラボイスの設定

```TyranoScript
[chara_new name="akane" storage="chara/akane/normal.png" jname="あかね"]

; ローカルで動いているvoicevoxを指定する場合
[voicevox_chara name="akane" speaker="春日部つむぎ" style="ノーマル"]

; リモートで動いているvoicevox(実行サーバ example.com ポート 50021)を指定する場合
[voicevox_chara name="akane" speaker="春日部つむぎ" style="ノーマル" host="example.com" port="50021"]
```

### [voicevox_auto] 自動再生をonにする。

音声の読み上げが終了したら次のメッセージを表示させます。

```TyranoScript
[voicevox_auto]
```

