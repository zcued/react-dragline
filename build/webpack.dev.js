const path = require('path')


module.exports = {
  entry: './example/example.js',
  output: {
    path: path.resolve('./example'),
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
    open: true,
    contentBase: './example',
  },
}
