# ニッポン発生観測所 / NIPPON OCCURRENCE OBSERVATORY

年間統計を時間感覚へ変換して体感する、軽量な観測インフォグラフィック。HTML + CSS + JavaScript のみで構成。

公開URL: https://nippon-observatory.denirokobo.com/

## ファイル構成

| ファイル | 内容 |
|---|---|
| `index.html` | マークアップ（ヘッダー / 統計カウンター / 中央SVGマップ / フィード / 観測項目一覧） |
| `style.css` | 全スタイル（CSS変数によるテーマトークン、レスポンシブ、アニメーション） |
| `script.js` | 観測項目定義・年初累計・ランダム発生・演出・フィード生成・SVG動的描画 |
| `assets/icons/category-v1/` | 観測項目24種の透過PNGアイコン。カテゴリ色と表示サイズを統一 |
| `assets/hero-title-v1.png` / `assets/map-art-v1.png` | ヒーロー文字と中央の日本地図アート |
| `sources.html` | 数値・演出・ランダム配置についての注釈ページ |

## 使い方

`index.html` をブラウザで開くだけで動作します。ビルド不要、ライブラリ不要。

ローカルサーバーで動かす場合:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 依存

- 外部依存は Google Fonts のみ（Noto Sans JP / Oswald / Barlow）
- オフラインで使う場合はフォントをローカルに配置し、`index.html` の `<link>` を差し替えてください

## カスタマイズ

すべて `script.js` 冒頭の `EVENTS` 定義で変更できます。

- `annualCount` … 年間総数。年初からの推定累計と平均発生間隔を自動計算
- `category` … `high` はカウンター主体、それ以外はランダム発生対象
- `animationType` / `duration` / `priority` … 発生時の演出と競合時の優先度
- `sound` / `soundFile` … 仮SEの種類と、後から差し替える実音源パス
- `EVENTS` … 定義したイベントは下部一覧にも自動で追加

### アイコンとカテゴリカラー

アイコンは `assets/icons/category-v1/` にイベントIDと同名で配置しています。`script.js` の `EVENT_TONES` と `CATEGORY_COLORS` でカテゴリと色を管理し、カウンター・最近の出来事・地図上の発生表示・観測項目一覧へ同じ色を適用します。

- `logistics` … 生活・物流 / オレンジ
- `mobility` … 移動・交流 / シアン
- `care` … 医療・救護 / レッド
- `life` … 人生・家族 / ライム
- `crime` … 犯罪・事件 / パープル
- `disaster` … 災害・事故 / オレンジレッド
- `death` … 死亡 / ブルーグレー
- `society` … 社会・企業 / クールブルーグレー

画面下部の観測項目カードはクリックすると地図上の演出を再生します。詳細値は左カラムの `VIEW INDEX` からスクロール可能な表で確認できます。高頻度項目（宅配便・訪日外国人）は個別タイマーを使わず、現在時刻から直接カウンターを算出します。

左カラムのカウンターは5枠構成です。宅配便・訪日外国人の2枠は固定し、残り3枠は実際のシミュレーション発生順に入れ替わります。

カウンターの入れ替えは、表示中の項目が下へスライドし、新しい項目が横から挿入されるアニメーションで表現しています。

配色は `style.css` の `:root` にあるCSS変数（`--lime` `--cyan` `--amber` など）で一括変更可能です。
