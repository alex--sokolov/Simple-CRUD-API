const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require('webpack');
const dotenv = require('dotenv')
dotenv.config();

module.exports = {
  mode: "production",
  devtool: false,
  entry: "./src/server.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ESLintPlugin({ extensions: ["ts"] }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })
  ],
  resolve: {
    extensions: [".ts"],
    fallback: {
      "dotenv": false,
      "http": false,
      "path": false,
      "fs": false,
      "os": false,
      "process": false
    }
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist")
  }

};