const pathTo = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const entry = { index: pathTo.resolve('src', 'entry.js') + '?entry=true' };
const weexEntry = { index: pathTo.resolve('src', 'entry.js') + '?entry=true' };
const vueWebTemp = '../temp';
const hasPluginInstalled = fs.existsSync('./web/plugin.js');
const isWin = /^win/.test(process.platform);
const buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'

// Wraping the entry file
const getEntryFileContent = (entryPath, vueFilePath) => {
    let relativePath = pathTo.relative(pathTo.join(entryPath, '../'), vueFilePath);
    let contents = '';
    /**
     * The plugin's logic currently only supports the .we version
     * which will be supported later in .vue
     */
    if (hasPluginInstalled) {
      const plugindir = pathTo.resolve('./web/plugin.js');
      contents = 'require(\'' + plugindir + '\') \n';
    }
    if (isWin) {
      relativePath = relativePath.replace(/\\/g, '\\\\');
    }
    contents += 'var App = require(\'' + relativePath + '\')\n';
    contents += 'App.el = \'#root\'\n';
    contents += 'new Vue(App)\n';
    return contents;
  }
// Retrieve entry file mappings by function recursion
const walk = (dir) => {
    dir = dir || '.';
    const directory = pathTo.join(__dirname, '../src', dir);
    fs.readdirSync(directory).forEach((file) => {
      const fullpath = pathTo.join(directory, file);
      const stat = fs.statSync(fullpath);
      const extname = pathTo.extname(fullpath);
      const basename = pathTo.basename(fullpath);
      if (stat.isFile() && extname === '.vue') {
        const name = pathTo.join(dir, pathTo.basename(file, extname));
        if (extname === '.vue') {
          const entryFile = pathTo.join(vueWebTemp, dir, pathTo.basename(file, extname) + '.js');
          fs.outputFileSync(pathTo.join(entryFile), getEntryFileContent(entryFile, fullpath));
          entry[name] = pathTo.join(__dirname, entryFile) + '?entry=true';
        }
        weexEntry[name] = fullpath + '?entry=true';
      }
    });
  }
// Generate an entry file before writing a webpack configuration
// 将pages中的.vue文件生成入口文件，以便webpack打包
walk('pages');
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
  context: pathTo.join(__dirname, ''),
  entry: entry,
  output: {
    path: pathTo.join(__dirname, '../dist'),
    filename: '[name].web.js'
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
    path: pathTo.join(__dirname, '../dist'),
    filename: '[name].js'
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
