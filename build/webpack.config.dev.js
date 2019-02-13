const path = require('path')


module.exports = {
  entry: path.resolve('./index.js'),
  output: {
    filename: 'bundle.js',
  },
  mode: 'development',
  devtool: 'source-map',
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
  devServer: {
    port: '8013',
  },
}
