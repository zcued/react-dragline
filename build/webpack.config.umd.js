const path = require('path')
const argv = require('yargs').argv
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


const minify = Boolean(argv.minify)
const mode = minify ? 'production' : 'development'
const devtool = minify ? 'source-map' : undefined
const filename = minify ? 'react-drag-guideline.min.js' : 'react-drag-guideline.js'


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('./dist'),
    filename,
    libraryTarget: 'umd',
  },
  mode,
  devtool,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          'eslint-loader',
        ],
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
}
