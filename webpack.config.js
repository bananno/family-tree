const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
    publicPath: '/',
  },
  target: 'web',
  devServer: {
    port: '1899',
    static: {
      directory: path.join(__dirname, 'public')
    },
    open: true,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'sass-loader'}
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {loader: 'url-loader', options: {limit: 10000}}
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    })
  ]
};
