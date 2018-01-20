const http = require('http')
const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

let webpackConfig = require('./webpack.dev.js')

const app = express()
const compiler = webpack(webpackConfig)
const middleware = webpackMiddleware(compiler, {
  noInfo: true,
  publicPath: '/'
})

app.use(middleware)
app.use(webpackHotMiddleware(compiler, {heartbeat: 2000}))

app.use(express.static(path.join(__dirname, '../')))

app.listen(9091)