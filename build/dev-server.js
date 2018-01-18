const http = require('http');
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

let webpackConfig = require('./webpack.dev.js')()

const app = express();
const compiler = webpack(webpackConfig);
const middleware = webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
});
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('/:appName', function (req, res) {
  var result = '';
  var htmlPath = path.join(__dirname, webpackConfig.output.path + '/' + req.params.appName + '/index.html');
  console.log(htmlPath);
  try {
    result = middleware.fileSystem
      .readFileSync(htmlPath);
  } catch (err) {
    result = err.toString();
  }
  res.write(result);
  res.end();
});

app.use(express.static(path.join(__dirname, '../')));

app.listen(9091)