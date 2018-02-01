# weex-template

[中文文档](https://github.com/GeoffZhu/weex-template/blob/master/README.zh.md)

## Why is this template?

1. The official template is too old, weex changed a lot.
2. The official template only generated native bundleJS, not have html for web.

## Advantage

- You can compile web-side HTML pages directly.
- Introducing postcss-plugin-px2rem and autoprefixer for web, simpler adaptation to web.
- Easy to use vue-router、vuex.
- Support all weex-toolkit(v1.2.8) Commands.

## How to use?

download this repo, and then

``` shell

npm install

# develop
npm run dev

# build debug bundle to dist folder
npm run build

# build production bundle to dist folder
npm run build prod

```

If there is an ios project in your platforms folder, when build complated, It will copy bundleJS to ```/platforms/ios/bundlejs/```.

## Internal plugin and methods

### Vue http plugin
Package weex-stream module as a vue-plugin, more vue flavor. :)

``` javascript
// GET
this.$http({
  url: '/address',
  headers: {},
  params: {
    id: 'test-id'
  }
})
// POST
this.$http({
  method: 'POST',
  url: '/address',
  headers: {},
  body: {
    id: 'test-id'
  }
})
```
If you want to use this vue plugin, config api domain first before develop, in ```/src/tools/http.js```.

### getEntryUrl

``` javascript
// weex navigator use 
navigator.push({
  url: getEntryUrl('test'),
  animated: 'true'
})
```

## Demo

#### Web

[http://geoffzhu.cn/weex-template/](http://geoffzhu.cn/weex-template/)

#### Native (Use weex playground)
![](http://geoffzhu.cn/weex-template/qr-code.png)
