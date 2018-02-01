# 更符合前端工程师的weex项目模板

## 为什么有这个模板？

1. 官方cli生成出的项目模板引用的各类包相对老旧。
2. 官方cli生成出的项目模板无法直接编译出可在线上使用的html页面。

## 本模板优势

- 可以直接编译web端HTML页面
- 针对web端引入postcss-plugin-px2rem和autoprefixer，更简单的适配web端
- 开箱即用的vue-router、vuex
- 支持weex-toolkit所有命令

## 如何使用？

下载本项目zip包，解压后

``` shell

npm install

# 开发
npm run dev

# 测试包（含有source-map, 并使用开发测试域名）
npm run build

# 正式包 (静态资源加hash, 并使用线上域名)
npm run build prod
```
## 内置插件和模块

### Vue http插件
由weex中stream模块封装的Vue插件，使用方法更符合Vue语法。例如：

``` javascript
// GET请求
this.$http({
  url: '/address',
  headers: {},
  params: {
    id: 'test-id'
  }
})

this.$http({
  method: 'POST',
  url: '/address',
  headers: {},
  body: {
    id: 'test-id'
  }
})
```
在使用前，请先到/src/tools/http.js中配置开发测试环境域名和线上域名

### getEntryUrl

``` javascript
// weex页面间跳转，直接传入entry文件的文件名，即可适配多端跳转
navigator.push({
  url: getEntryUrl('test'),
  animated: 'true'
})
```

## Demo展示

#### Web

[http://geoffzhu.cn/weex-template/](http://geoffzhu.cn/weex-template/)

#### Native (Use weex playground)
![](http://geoffzhu.cn/weex-template/qr-code.png)
