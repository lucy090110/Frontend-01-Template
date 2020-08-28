const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack"); // 用于访问内置插件

module.exports = {
  mode: "development",
  entry: path.resolve("./src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[hash].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 匹配文件路径的正则表达式，通常我们都是匹配文件类型后缀
        loader: "babel-loader", // 指定使用的 loader
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            [
              "@babel/plugin-transform-react-jsx",
              {
                pragma: "createElement",
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve("./src/index.html"),
    }),
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  ],
  optimization: {
    minimize: false,
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    hot: true,
    port: "8000",
    inline: true,
    open: true,
    overlay: true,
  },
};
