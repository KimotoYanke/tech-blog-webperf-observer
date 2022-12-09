# Webパフォーマンス定期観測

こちらは社内で使われている定期観測システムをやや簡易化させたものです

## Architecture
![web_performance_observation_architecture](https://user-images.githubusercontent.com/15257960/195814927-6426b065-94a8-457b-8beb-45617030e40d.png)

Lighthouse以外のものを入れたり、Datadog以外へ入れたり、本番DBからランダムにページを抜き出して観測するということが将来的にありうるので、Clean Architectureで実装しています。
## How to run locally
1. まずDatadogでAPIキーとアプリケーションキーを取得します
https://app.datadoghq.com/organization-settings/api-keys
https://app.datadoghq.com/organization-settings/application-keys


2. 続いて、URLをurl.jsonに登録します
`resources/url.json`

3. 以下のコマンドでmain.tsを起動します

```
DD_APP_KEY=[取得したアプリケーションキー] DD_API_KEY=[取得したAPIキー] npx ts-node main.ts
```

JSON内のページをLighthouseで測り、結果がDatadog側にenv:developmentで送信されます。

Metric名は`webperf.lighthouse.[ページのタグ].[desktop/mobile].[計測種別(largest_contentful_paintなど)]`という形になります
