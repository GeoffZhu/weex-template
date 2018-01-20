const webpack = require('webpack')
const configs = require('./webpack.config.js')
const webpackMerge = require('webpack-merge') // used to merge webpack configs
const path = require('path')
// tools
const ip = require('ip').address()
const chalk = require('chalk')
const config = Array.isArray(configs) ? configs[0] : configs

console.log('server is running! Please open ' + chalk.green('http://' + ip + ':9091/'))

// dev状态下，只需要有一个js入口
config.plugins.shift()
// 为entry加入热更新客户端模块
Object.keys(config.entry).forEach(key => {
  config.entry[key] = [config.entry[key], path.join(__dirname, './dev-client.js')]
})
module.exports = webpackMerge(config, {
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [path.resolve('src'), path.resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': "'development'"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
})
