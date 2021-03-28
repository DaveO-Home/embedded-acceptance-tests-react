
const path = require("path");
const { merge } = require("webpack-merge");
const utils = require("./utils");
const config = require("../config");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// const packageDep = require("../../package.json");
// const version = Number(/\d/.exec(packageDep.devDependencies.webpack)[0]);

const env = process.env.NODE_ENV === "testing"
  ? require("../config/test.env") : require("../config/prod.env");

const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath("js/[name].[chunkhash].js"),
    chunkFilename: utils.assetsPath("js/[id].[chunkhash].js")
  },
  module: {
    exprContextCritical: false
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: "some",
        parallel: true,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": env
    }),
    new FriendlyErrorsWebpackPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: "appl/testapp.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: "auto" // "dependency"
    }),
    // keep module.id stable when vendor modules does not change
    // new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../static"),
          globOptions: {
            dot: true,
            ignore: [".*"],
          },
          to: config.dev.assetsSubDirectory,
        },
        { from: "./images/**/*", to: "" },
        { from: "./appl/testapp_dev.html", to: config.dev.assetsSubDirectory },
        { from: "./appl/index.html", to: config.dev.assetsSubDirectory },
        { from: "../README.md", to: "../" },
        {
          from: "./appl/views/**/*",
          globOptions: {
            dot: false,
          },
          to: ""
        },
        {
          from: "./appl/templates/**/*",
          globOptions: {
            dot: false,
          },
          to: ""
        },
        {
          from: "./appl/dodex/**/*",
          globOptions: {
            dot: false,
          },
          to: ""
        },
        { from: "./appl/assets/*.*", to: "" }
      ]
    }),
    new webpack.ProgressPlugin()
  ]
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require("compression-webpack-plugin");

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp(
        "\\.(" +
        config.build.productionGzipExtensions.join("|") +
        ")$"
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

webpackConfig.module.rules.push(utils.stripBlock());

module.exports = webpackConfig;

