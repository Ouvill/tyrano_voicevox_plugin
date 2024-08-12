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

## Quick Tutorial

```TyranoScript
; voicevoxのアプリを登録
[register_voicevox_app url="http://localhost:50021"]

; TyranoScriptのキャラを登録
[chara_new name="zunda" storage="chara/zunda/normal.png" jname="ずんだもん"]

; VOICEVOXのプリセットを作成(話速、音程、音量などを指定する)
[voicevox_preset id="zunda_preset" speed="1.3" pitch="0.05" intonation="1.1" volume="1.5" pre="0.1" post="0.1"]

; VOICEVOXの音声登録 & 使用プリセットの指定
[voicevox_chara name="zunda" speaker="ずんだもん" style="ノーマル" preset="zunda_preset"]

; VOICEVOXの音声読み上げ開始(自動で字幕送り機能は未実装)
[voicevox_on]


; シナリオ記述

# zunda
やあ、こんにちは。[p]

# zunda
VOICEVOXの音声を読み上げるプラグインだよ。[p]

[voicevox_chara name="zunda" style="あまあま"]

# zunda
途中でスタイルを変更したり……[p]

[voicevox_preset id="zunda_slow_preset" speed="1.0"]

# zunda
途中でプリセットをつけ替えて話し方を変更できるよ

```

## 注意事項

個人的に欲しいと思ったので作成しました。

初期リリースはティラノスクリプト歴一週間に満たない人が作っているので著しくバグが存在する可能性があります。

## 想定用途

ゲーム実行時にVOICEVOXの起動を要求するのでアプリの配布には向いていません。

デバッグ用途やティラノスクリプトによる動画制作用途に向いています。

## タグリファレンス

ティラノスクリプトのアプリを起動時にVOICEVOXを起動しておく必要があります。

### VoiceVoxの登録

VoiceVoxのアプリを指定します。

| パラメーター | 必須 | 解説                                                            | 初期値                    | 
|--------|----|---------------------------------------------------------------|------------------------|
| url    | o  | VOICEVOXのアプリを指定します<br/> VOICEVOXを起動しているパソコンのアドレスとポートを指定してください | http://localhost:50021 | 

```TyranoScript
[register_voicevox_app url="http://localhost:50021"]
```

### [voicevox_on] VOICEVOX

キャラクターの音声読み上げを有効にします。

#### サンプルコード

```TyranoScript
; VoiceVoxによる読み上げを有効にします。
[voicevox_on]

#zunda
ここの音声は読み上げられる
```

### [voicevox_off] VOICEVOXの読み上げを無効にする

キャラクターの音声読み上げを無効にします。

#### サンプルコード

```TyranoScript
; VoiceVoxによる読み上げを無効にします。
[voicevox_off]

#zunda
ここの音声は読み上げられない
```

### [voicevox_layer]

音声読み上げを行うメッセージレイヤーを選択します。カンマ区切りによる複数指定に対応しています。デフォルトは`message0`のみ

| パラメーター | 必須 | 解説                                | デフォルト値     |
|--------|----|-----------------------------------|------------|
| layer  | o  | メッセージレイヤの指定<br/> カンマ区切りで指定してください。 | "message0" |

#### サンプルコード

```TyranoScript
[voicevox_layer layers="message0, message1"]
```

### [voicevox_chara] キャラボイスの設定

VOVOICEVOXのキャラクターとティラノスクリプトのキャラクターを紐付けます。

| パラメーター  | 必須 | 解説                                                 | 初期値 |
|---------|----|----------------------------------------------------|-----|
| name    | o  | キャラクター名を指定します。                                     |     |
| speaker |    | VOVOICEVOXのキャラクターを指定します <br/> [四国めたん、ずんだもん、春日部つむぎ] |     |
| style   |    | 声のスタイルを指定します。<br/> ノーマル、あまあま、つんつん                  |     |
| preset  |    | `[voicevox_preset]`で登録したidを指定します。                  |     |

#### サンプルコード

```TyranoScript
; キャラをティラノスクリプトに登録する
[chara_new name="shikoku" storage="chara/shikoku/normal.png" jname="四国めたん"]

; ティラノスクリプトのキャラとVOICEVOXのキャラを紐付ける。 
[voicevox_chara name="shikoku" speaker="四国めたん" style="ノーマル"]

#shikoku
四国めたんの声が再生されるよ。

; スクリプトによってパラメータを一部変更できる
[voicevox_chara name="shikoku" style="ツンツン"]
途中でツンツンボイスに切り替えることもできるわ
```

### [voicevox_preset] VOICEVOXの音声調節

VOICEVOXの音声を調節します。
VOICEVOXの指定と一緒です。

| パラメーター     | 必須 | 解説                        | 初期値 |
|------------|----|---------------------------|-----|
| id         | o  | presetの名前を設定してください        |     |
| speed      |    | 話速を指定します                  | 1   |
| pitch      |    | 音高を指定します。 0 ~ 0.15くらいまで推奨 | 0   |
| intonation |    | 抑揚を指定します。                 | 1   |
| volume     |    | 音量を指定します。                 | 1   |
| pre        |    | 開始無音時間を指定します。             | 0.1 | 
| post       |    | 終了無音時間を指定します。             | 0.1 |

#### サンプルコード

```TyranoScript
; プリセットを登録
[voicevox_preset id="zunda_preset" speed="1.3" pitch="0.05" intonation="1.1" volume="1.5" pre="0.1" post="0.1"]

; キャラをティラノスクリプトに登録する
[chara_new name="zunda" storage="chara/zunda/normal.png" jname="ずんだもん"]

; プリセットを利用する。
[voicevox_chara name="zunda" speaker="ずんだもん" style="ノーマル" preset="zunda_preset"]
```

#### サンプルコード2

```TyranoScript
; プリセットの登録は一部だけでもよい
[voicevox_preset id="shikoku_preset" speed="1.3"]
```


