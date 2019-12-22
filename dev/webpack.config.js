const path = require('path')


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, './index.tsx'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   loader: 'source-map-loader',
      // },
    ],
  },
  devServer: {
    port: '8013',
    contentBase: __dirname,
  },
}
