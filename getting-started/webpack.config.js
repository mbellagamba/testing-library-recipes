const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = function (webpackEnv) {
  const isEnvProduction = !webpackEnv.WEBPACK_SERVE;
  return {
    mode: isEnvProduction ? "production" : "development",
    devtool: isEnvProduction ? "source-map" : "inline-source-map",
    entry: {
      app: "./src/index.tsx",
    },
    output: {
      path: path.resolve(__dirname, "build"),
      publicPath: "/",
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
    },
    resolve: {
      extensions: [
        ".web.mjs",
        ".mjs",
        ".web.js",
        ".js",
        ".web.ts",
        ".ts",
        ".web.tsx",
        ".tsx",
        ".json",
        ".web.jsx",
        ".jsx",
      ],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [`...`, new CssMinimizerPlugin()],
      splitChunks: {
        chunks: "all",
      },
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: "url-loader",
              options: {
                limit: 10000,
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: path.resolve(__dirname, "src"),
              loader: "babel-loader",
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: "babel-loader",
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                cacheDirectory: true,
                cacheCompression: false,
                sourceMaps: true,
                inputSourceMap: true,
              },
            },
            {
              test: /\.css$/,
              sideEffects: true,
              use: [
                isEnvProduction
                  ? { loader: MiniCssExtractPlugin.loader }
                  : "style-loader",
                "css-loader",
              ],
            },
            {
              test: /\.svg$/,
              use: ["@svgr/webpack", "url-loader"],
            },
            {
              loader: require.resolve("file-loader"),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: "public/index.html",
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public/*",
            to: "[name][ext]",
            globOptions: {
              ignore: ["**/*.html"],
            },
          },
        ],
      }),
    ].filter(Boolean),
    devServer: {
      historyApiFallback: true,
      contentBase: "./",
      hot: true,
      host: "0.0.0.0",
      port: 8080,
      public: "localhost:8080",
      compress: true,
      open: true,
    },
  };
};
