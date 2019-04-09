const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const markdownFileStringPlaceholderCN = fs.readFileSync(
  path.resolve(__dirname, './doc/api.zh-CN.md')
).toString();

const markdownFileStringPlaceholderEN = fs.readFileSync(
  path.resolve(__dirname, './doc/api.md')
).toString();


module.exports = {
  mode: 'production',
  entry: './doc/index.js',
  output: {
    path: path.resolve(__dirname, 'doc'),
    filename: 'index.bundle.js'
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'API document',
      hash: false,
      filename: 'index.html',
      template: path.resolve(__dirname, './doc/index.template.html'),
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      markdownFileStringPlaceholderEN: JSON.stringify(markdownFileStringPlaceholderEN),
      markdownFileStringPlaceholderCN: JSON.stringify(markdownFileStringPlaceholderCN)
    })
  ],
};