'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageDep = require('../../package.json')
const version = Number(/\d/.exec(packageDep.devDependencies.webpack)[0])

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
    test: /\.(js)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('appl'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './appl/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        chunkFilename: 'app[name]-[chunkhash].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    target: "web",
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolve('appl'),
            app: resolve("appl/js/app.js"),
            basecontrol: resolve("appl/js/utils/base.control"),
            config: resolve("appl/js/config"),
            default: resolve("appl/js/utils/default"),
            helpers: resolve("appl/js/utils/helpers"),
            menu: resolve("appl/js/utils/menu.js"),
            pdf: resolve("appl/js/controller/pdf"),
            router: resolve("appl/router"),
            start: resolve("appl/js/controller/start"),
            setup: resolve("appl/js/utils/setup"),
            setglobals: resolve("appl/js/utils/set.globals"),
            table: resolve("appl/js/controller/table"),
            tablepager: "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js",
            tablewidgets: "tablesorter/dist/js/jquery.tablesorter.widgets.min.js",
            apptests: resolve("tests/apptest"),
            contacttests: resolve("tests/contacttest"),
            domtests: resolve("tests/domtest"),
            logintests: resolve("tests/logintest"),
            routertests: resolve("tests/routertest"),
            toolstests: resolve("tests/toolstest"),
            handlebars: 'handlebars/dist/handlebars.js'
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            version < 4 ?
                {
                    test: /.css$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" }
                    ]
                } :
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
            {
                test: /\.stache$/,
                use: "raw-loader"
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('appl'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            setJsonLoader(version)
        ]
    },
    node: {
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}

if (version < 4) {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new ExtractTextPlugin({
            filename: '[name].bundle.css',
            disable: false,
            allChunks: true
        })
    ]);
}
else {
    module.exports.plugins = (module.exports.plugins || []).concat([new MiniCssExtractPlugin({
        filename: process.env.NODE_ENV === 'development' ? "[name].css" : "[name].[contenthash].css",
        chunkFilename: process.env.NODE_ENV === 'development' ? "[name].[id].css" : "[name].[id].[contenthash].css"
    })]);
}
function setJsonLoader(version) {
    let rules = {}

    if (version < 4) {
        rules = {
            test: /\.json$/,
            use: "json-loader"
        }
    }

    return rules;
}

function setSideEffects(version) {
    if (version >= 4) {
        module.exports.module.rules.push(
            {
                include: /node_modules/,
                sideEffects: true
            });
        module.exports.module.rules.push(
            {
                include: /appl\/css/,
                sideEffects: true
            });
    }
}