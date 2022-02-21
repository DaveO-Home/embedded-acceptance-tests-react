
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
// const packageDep = require("../../package.json");
// const version = Number(/\d/.exec(packageDep.devDependencies.webpack)[0]);

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    context: path.resolve(__dirname, "../"),
    entry: {
        app: "./appl/main.js"
    },
    output: {
        path: config.build.assetsRoot,
        filename: process.env.NODE_ENV === "development" ? "main.js" : "[name].js",
        chunkFilename: "app[name]-[chunkhash].js",
        publicPath: process.env.NODE_ENV === "production"
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath,
    },
    stats: {        // "normal", minimal, none, normal, verbose, errors-only
        errorDetails: true,
        warnings: false,
        children: false,
        colors: true
    },
    target: "web",
    resolve: {
        extensions: [".js", ".json", ".jsx"],
        alias: {
            "@": resolve("appl"),
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
            dodextests: resolve("tests/dodextest"),
            inputtests: resolve("tests/inputtest"),
            handlebars: "handlebars/dist/handlebars.js",
            StartC: resolve("appl/components/StartC"),
            PdfC: resolve("appl/components/PdfC"),
            ToolsC: resolve("appl/components/ToolsC"),
            LoginC: resolve("appl/components/LoginC"),
            HelloWorldC: resolve("appl/components/HelloWorldC"),
            ContactC: resolve("appl/components/ContactC"),
            DodexC: resolve("appl/components/DodexC"),
            Menulinks: resolve("appl/Menulinks"),
            entry: resolve("appl/entry")
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "sass-loader"
                    }
                ],
                type: "javascript/auto"
            }
            , {
                test: /\.stache$/,
                type: "asset/source"
            },
            {
                test: /\.js|jsx$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                }
                ],
                include: [resolve("appl"), resolve("test"), resolve("node_modules/webpack-dev-server/client")],
                type: "javascript/auto"
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                type: "asset"
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                type: "asset"
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                generator: {
                    filename: utils.assetsPath("fonts/[name][hash:7][ext]")
                },
                type: "asset"
            },
        ]
    },
    experiments: {
        // asset: true
    },
    node: false,
};

const eslintOptions = {
    context: "../appl",
    extensions: ["js", "jsx"],
    fix: true
}

module.exports.plugins = (module.exports.plugins || []).concat([
    new MiniCssExtractPlugin({
        filename: process.env.NODE_ENV === "development"
            ? "main.css" : "[name].[contenthash].css",
        chunkFilename: process.env.NODE_ENV === "development"
            ? "[name].[id].css" : "[name].[id].[contenthash].css"
    }),
    new ESLintPlugin(eslintOptions)
]);


