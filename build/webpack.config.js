const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const entry = { };
const weexEntry = { };
const hasPluginInstalled = fs.existsSync('./web/plugin.js');
const isWin = /^win/.test(process.platform);
const buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'

// Retrieve entry file mappings by function recursion
const walk = (dir) => {
    dir = dir || '.';
    const directory = path.join(__dirname, '../src', dir);
    fs.readdirSync(directory).forEach((file) => {
      const fullpath = path.join(directory, file);
      const stat = fs.statSync(fullpath);
      const extname = path.extname(fullpath);
      const basename = path.basename(fullpath);
      if (stat.isFile() && extname === '.js') {
        const name = path.basename(file, extname);
        entry[name] = fullpath + '?entry=true';
        weexEntry[name] = fullpath + '?entry=true';
      }
    });
  }
// Generate an entry file before writing a webpack configuration
// 将pages中的.vue文件生成入口文件，以便webpack打包
walk('entry');
/**
 * Plugins for webpack configuration.
 */
const plugins = [
  new webpack.DefinePlugin({
    'process.env': `"${buildEnv == 'prod' ? 'produciton' : 'test'}"`
  }),
  /*
   * Plugin: UglifyJsPlugin
   * Description: UglifyJS plugin for webpack
   * See: https://github.com/webpack-contrib/uglifyjs-webpack-plugin
   */
  new webpack.optimize.UglifyJsPlugin({
    minimize: true
  }),
  /*
   * Plugin: BannerPlugin
   * Description: Adds a banner to the top of each generated chunk.
   * See: https://webpack.js.org/plugins/banner-plugin/
   */
  new webpack.BannerPlugin({
    banner: `// { "framework": "Vue"} \n`,
    raw: true,
    exclude: 'Vue'
  })
];
// Config for compile jsbundle for web.
const webConfig = {
  entry: entry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].web.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: 'eval-source-map',
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    // webpack 2.0 
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
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins
};
// Config for compile jsbundle for native.
const weexConfig = {
  entry: weexEntry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
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
    }, {
      test: /\.we(\?[^?]+)?$/,
      use: [{
        loader: 'weex-loader'
      }]
    }]
  },
  /*
   * These options configure whether to polyfill or mock certain Node.js globals and modules. 
   * This allows code originally written for the Node.js environment to run in other environments like the browser.
   *
   * See: https://webpack.js.org/configuration/node/#node
   */
  node: {
    setImmediate: false
    // See "Other node core libraries" for additional options.
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins
};
// 打包出web包和weex包
module.exports = [webConfig, weexConfig];
