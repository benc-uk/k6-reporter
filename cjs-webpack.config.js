import webpack from 'webpack'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf-8'))

export default {
  mode: 'production',
  entry: './src/report.js',

  output: {
    filename: 'bundle.cjs',
    path: path.resolve(process.cwd(), 'dist'),
    libraryTarget: 'commonjs',
  },

  plugins: [
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
