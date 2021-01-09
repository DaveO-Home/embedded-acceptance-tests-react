
const path = require("path");
const { merge } = require("webpack-merge");
const utils = require("./utils");
const config = require("../config");
const webpack = require("webpack");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const packageDep = require("../../package.json");
// const version = Number(/\d/.exec(packageDep.devDependencies.webpack)[0]);
const isWatch = process.env.USE_WATCH === "true";
const devPublicPath = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "/dist_test/webpack/";

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

baseWebpackConfig.output.publicPath = devPublicPath;

const devWebpackConfig = merge(baseWebpackConfig, {
    stats: "normal", // minimal, none, normal, verbose, errors-only
    mode: "development",
    cache: false,
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: "warning",
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.join(config.dev.assetsPublicPath, "index.html") }
            ]
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": require("../config/dev.env")
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ["popper.js", "default"]
        }),
        // // copy custom static assets
        new CopyWebpackPlugin({ patterns: [
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
        ]})
    ],
    watch: isWatch,
    watchOptions: {
        ignored: /node_modules/
    }
});

module.exports = devWebpackConfig;

// module.exports = new Promise((resolve, reject) => {
//  portfinder.basePort = process.env.PORT || config.dev.port
//  portfinder.getPort((err, port) => {
//    if (err) {
//      reject(err)
//    } else {
//      // publish the new Port, necessary for e2e tests
//      process.env.PORT = port
//      // add port to devServer config
//      devWebpackConfig.devServer.port = port
//
//      // Add FriendlyErrorsPlugin
//      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//        compilationSuccessInfo: {
//          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//        },
//        onErrors: config.dev.notifyOnErrors
//        ? utils.createNotifierCallback()
//        : undefined
//      }))
//
//      resolve(devWebpackConfig)
//    }
//  })
// })

