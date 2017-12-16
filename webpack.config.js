var path = require('path')
var nodeExternals = require('webpack-node-externals')
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  entry: {
    store: resolve('src/store.js'),
    class: resolve('src/class.js')
  },
  externals: [nodeExternals()],
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,  
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  }
}