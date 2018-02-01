process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')
var buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'
var fs = require('fs-extra')

var spinner = ora(`building for ${buildEnv}...`)
spinner.start()


rm(path.resolve(__dirname, '../dist'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    // copy bundleJS file to ios project
    fs.pathExists(path.resolve(__dirname, '../platforms/ios/bundlejs/')).then(exists => {
      if (!exists) return
      fs.copy(path.resolve(__dirname, '../dist/native/'), path.resolve(__dirname, '../platforms/ios/bundlejs/')).then(() => {
        console.log(chalk.cyan('  Copy to ios platform complete.\n'))
      }).catch(err => {
        console.log(err)
      })
    })
  })
})
