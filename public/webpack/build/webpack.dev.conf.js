
const path = require("path");
const { merge } = require("webpack-merge");
const utils = require("./utils");
const config = require("../config");
const webpack = require("webpack");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const isWatch = process.env.USE_WATCH === "true";
const devPublicPath = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "/dist_test/webpack/";

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

baseWebpackConfig.output.publicPath = devPublicPath;

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    cache: false,
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.join(config.dev.assetsPublicPath, "index.html") }
            ]
        },
        compress: false, // true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        devMiddleware: {
            index: true,
            // mimeTypes: { "text/plain": ["md"] },
            publicPath: config.dev.assetsPublicPath,
            serverSideRender: false,
            // writeToDisk: true,
        },
        client: {
            logging: "info",
            overlay: {
                errors: true,
                warnings: false,
            },
            // overlay: true,
            progress: true,
        },
        static: {
            // directory: path.resolve(__dirname, "static"),
            staticOptions: {},
            publicPath: ["/dist_test/"],
            // serveIndex: true,
            // watch: {} (options for the `watch` option you can find https://github.com/paulmillr/chokidar)
            watch: true,
        },
        allowedHosts: "all",
        proxy: config.dev.proxyTable,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": require("../config/dev.env")
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
        // // copy custom static assets
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
                { from: "../README.md", to: "./" },
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
    ],
    watch: isWatch,
    watchOptions: {
        ignored: /node_modules/
    }
});

module.exports = devWebpackConfig;
