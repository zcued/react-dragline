const path = require('path')


module.exports = {
  entry:  path.resolve('./index.js'),
  output: {
    path: path.resolve('./docs'),
    filename: 'bundle.js',
  },
  mode: 'production',
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
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
}
