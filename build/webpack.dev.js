const webpack = require('webpack');
const configs = require('./webpack.config.js');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const path = require('path');
// tools
const ip = require('ip').address();
const chalk = require('chalk');
const config = Array.isArray(configs) ? configs[0] : configs;
// configs.plugins.push(new webpack.HotModuleReplacementPlugin());
console.log('server is running! Please open ' + chalk.green('http://' + ip + ':9081/'));
/**
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
/**
 * Webpack configuration
 */
// dev状态下，只需要有一个js入口
config.plugins.shift()
module.exports = function () {
  return webpackMerge(config, {
    /*
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
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
        // support for .html antd .css as raw text
        {
          test: /\.html$/,
          loader: 'raw-loader'
        }
      ]
    },
    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      new webpack.DefinePlugin({
        'process.env': "'development'"
      }),
      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, '../web/index.html'),
        isDevServer: true,
        chunks: ['index'],
        chunksSortMode: 'dependency',
        inject: true
      }),
      new HtmlWebpackPlugin({
        filename: 'test.html',
        template: path.join(__dirname, '../web/index.html'),
        isDevServer: true,
        chunks: ['test'],
        chunksSortMode: 'dependency',
        inject: true
      }),
      /*
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      })
    ],
    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    // devServer: {
    //   compress: true,
    //   host: '0.0.0.0',
    //   port: '9081',
    //   historyApiFallback: true,
    //   public: ip + ':9081',
    //   watchOptions: {
    //     aggregateTimeout: 300,
    //     poll: 1000
    //   },
    //   proxy: {
    //     // "/api": {
    //     //   target: '', // 测试环境
    //     //   changeOrigin: true,
    //     //   secure: false,
    //     //   cookieDomainRewrite: ''
    //     // }
    //   }
    // }
  });
};
