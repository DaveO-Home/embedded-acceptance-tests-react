"use strict"

const path = require("path")
const subDirectory = "appl"
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: subDirectory,
    assetsPublicPath: "/dist_test/webpack/",
    assetsRoot: path.resolve(__dirname, "../../dist_test/webpack/"),
    proxyTable: {},
    // Various Dev Server settings
    host: "localhost", // can be overwritten by process.env.HOST
    port: 3080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: "eval-cheap-module-source-map",
    cacheBusting: true,
    cssSourceMap: true,
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, `../../dist/webpack/${subDirectory}/testapp.html`),
    // Paths
    assetsRoot: path.resolve(__dirname, "../../dist/webpack"),
    assetsSubDirectory: subDirectory,
    assetsPublicPath: "/dist/webpack/",
    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "cheap-module-source-map",
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

