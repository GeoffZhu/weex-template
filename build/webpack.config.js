const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const hasPluginInstalled = fs.existsSync('./web/plugin.js')
const isWin = /^win/.test(process.platform)
const buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'

/**
 * Plugins for webpack configuration.
 */
const plugins = [
  new webpack.DefinePlugin({
    'process.env': `"${buildEnv == 'prod' ? 'produciton' : 'test'}"`
  }),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true
  }),
  new webpack.BannerPlugin({
    banner: `// { "framework": "Vue"} \n`,
    raw: true,
    exclude: 'Vue'
  })
]

const webPlugins = [ 
  ...plugins,
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer'
  })
]
const webEntry = {}
const entry = {}
// Retrieve entry file mappings by function recursion
const walk = (dir) => {
    dir = dir || '.'
    const directory = path.join(__dirname, '../src', dir)
    fs.readdirSync(directory).forEach((file) => {
      const fullpath = path.join(directory, file)
      const stat = fs.statSync(fullpath)
      const extname = path.extname(fullpath)
      const basename = path.basename(fullpath)
      if (stat.isFile() && extname === '.js') {
        const name = path.basename(file, extname)
        webEntry[name] = fullpath + '?entry=true'
        entry[name] = fullpath + '?entry=true'
        webPlugins.push(new HtmlWebpackPlugin({
          filename: `${name}.html`,
          template: path.join(__dirname, '../web/index.html'),
          cache: true,
          chunks: ['vendor', name],
          chunksSortMode: 'manual',
          inject: true
        }))
      }
    })
  }
// Generate an entry file before writing a webpack configuration
walk('entry')

// Config for compile jsbundle for web.
const webConfig = {
  entry: webEntry,
  output: {
    path: path.join(__dirname, '../dist/web'),
    filename: buildEnv == 'prod' ? '[name].[chunkhash].web.js' : '[name].web.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  devtool: buildEnv == 'prod' ? 'none' : 'inline-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }],
      exclude: /node_modules(?!(\/|\\).*(weex).*)/
    }, {
      test: /\.vue(\?[^?]+)?$/,
      use: [{
        loader: 'vue-loader',
        options: {
          optimizeSSR: false,
          postcss: [
            // to convert weex exclusive styles.
            require('postcss-plugin-weex')(),
            require('autoprefixer')({
              browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
            }),
            require('postcss-plugin-px2rem')({
              // base on 750px standard.
              rootValue: 75,
              // to leave 1px alone.
              minPixelValue: 1.01
            })
          ],
          compilerModules: [
            {
              postTransformNode: el => {
                // to convert vnode for weex components.
                require('weex-vue-precompiler')()(el)
              }
            }
          ]
        }
      }]
    }]
  },
  plugins: webPlugins
}
// Config for compile jsbundle for native.
const weexConfig = {
  entry,
  output: {
    path: path.join(__dirname, '../dist/native'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  devtool: buildEnv == 'prod' ? 'none' : 'inline-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }],
      exclude: /node_modules(?!(\/|\\).*(weex).*)/
    }, {
      test: /\.vue(\?[^?]+)?$/,
      use: [{
        loader: 'weex-loader'
      }]
    }]
  },
  node: {
    setImmediate: false
  },
  plugins: plugins
}

// 打包出web包和weex包
module.exports = [webConfig, weexConfig]
