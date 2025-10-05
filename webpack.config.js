const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const packageJson = require('./package.json')

module.exports = {
  mode: 'production',
  entry: './src/html-report.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
    libraryTarget: 'commonjs',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(packageJson.version),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ejs/,
        type: 'asset/source',
      },
    ],
  },
}
