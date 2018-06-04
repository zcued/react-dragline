const path = require('path')
const configs = require('./config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const { UglifyJsPlugin } = webpack.optimize
const { DefinePlugin } = webpack


const toDefine = (configuration) => {
  const option = {}
  Object.keys(configuration).forEach(key => {
    option[key] = JSON.stringify(configs[key])
  })
  return option
}

module.exports = {
  entry: {
    main: path.join(__dirname, '../src'),
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 4,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({
      // contentHash https://goo.gl/VtpvRo
      filename: '[name].[contenthash:16].css',
      disable: false,
      allChunks: false,
    }),
    new DefinePlugin(toDefine(configs)),
    new UglifyJsPlugin({
      beautify: false,
      comments: false,
      sourceMap: true,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: '../index.html',
      inject: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.join(__dirname, '../'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, '../src'),
        ],
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?-autoprefixer'],
      },
    ],
  },
}
