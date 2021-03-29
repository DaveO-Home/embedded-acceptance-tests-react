/**
 * Production build using karma/jasmine acceptance test approval and Development environment with Webpack
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(test-build, acceptance-tests) -> ('csslint', 'bootlint') -> 'build(eslint)'
 */
const { src, dest, series, parallel, task } = require("gulp");
const env = require("gulp-env");
const log = require("fancy-log");
const rmf = require("rimraf");
const exec = require("child_process").exec;
const path = require("path");
const chalk = require("chalk");
const eslint = require("gulp-eslint");
const config = require("../config");
const karma = require("karma");
const csslint = require("gulp-csslint");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PORT = process.env.PORT && Number(process.env.PORT);
const pack = require("../../package.json");
const webpackVersion = Number(/\d/.exec(pack.devDependencies.webpack)[0]);

let webpackConfig = null;
let browsers = process.env.USE_BROWSERS;

if (browsers) {
    global.whichBrowser = browsers.split(",");
}
log(`Webpack Version: ${webpackVersion}`);

/*
 * Build the application to the production distribution 
 */
const build = function (cb) {
    let cmd = exec("node build");
    cmd.stdout.on("data", (data) => {
        if (data && data.length > 0) {
            log(data.trim());
        }
    });
    cmd.stderr.on("data", (data) => {
        if (data && data.length > 0)
            log(data.trim());
    });
    return cmd.on("exit", () => {
        cb();
    });
};
/*
 * javascript linter
 */
const esLint = function (cb) {
    process.env.NODE_ENV = "production";
    let lintCount = 0;
    var stream = src(["../appl/**/*.js", "../tests/*.js", "../appl/**/*.jsx"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js",
            quiet: 1
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(() => {
            // Keeping track of # of javascript files linted.
            lintCount++;
            // log(chalk.cyan.bold(result.filePath));
        }))
        .pipe(eslint.failAfterError());

    stream.on("error", function () {
        process.exit(1);
    });

    return stream.on("end", function () {
        log(chalk.blue.bold("# js & jsx files linted: " + lintCount));
        cb();
    });
};
/*
 * css linter
 */
const cssLint = function (cb) {
    var stream = src(["../appl/css/site.css"])
        .pipe(csslint())
        .pipe(csslint.formatter());

    stream.on("error", function (err) {
        log(err);
        process.exit(1);
    });
    return stream.on("end", function (err) {
        log(chalk.cyan(`css linting finished - ${err ? err : 0}`));
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    log(chalk.cyan("Starting Gulpboot.js"));
    let cmd = exec("npx gulp --gulpfile Gulpboot.js");
    cmd.stdout.on("data", (data) => {
        if (data && data.length > 0) {
            log(data.trim());
        }
    });
    cmd.stderr.on("data", (data) => {
        if (data && data.length > 0)
            log(data.trim());
    });
    return cmd.on("exit", (code) => {
        log(chalk.cyan(`Bootstrap linting finished - ${code}`));
        cb();
    });
};
/**
 * Run karma/jasmine tests once and exit
 * Set environment variable USE_BUILD=false to bypass the build
 */
const acceptance_tests = function (done) {
    karmaServer(done, true, false);
};
/**
 * Run karma/jasmine tests once and exit
 */
const jasmine_tests = function (done) {
    karmaServer(done, true, false);
};

const test_env = function (cb) {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "true",
        USE_HMR: "false",
        USE_BUILD: false,
    });

    return src("../appl/main.js")
        .pipe(envs)
        .on("end", function () {
            cb();
        });
};
/*
 * Build Test without Karma settings for npm Express server (npm start)
 */
const webpack_rebuild = function (cb) {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "",
        USE_TEST: "true",
        USE_BUILD: "false"
    });

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });

    return src("../appl/main.js")
        .pipe(envs)
        .pipe(webpackStream(require("./webpack.dev.conf.js"), webpack))
        .pipe(envs.reset)
        .pipe(dest("../../dist_test/webpack"))
        .on("end", function () {
            cb();
        })
        .on("error", (err) => {
            console.error("Error Rebuild: ", err);
        });
};
/*
 * Build the test bundle
 */
const test_build = function (cb) {
    var useBuild = process.env.USE_BUILD === "false" ? "false" : "true";
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "true",
        USE_HMR: "false",
        USE_BUILD: useBuild,
    });

    if (process.env.USE_BUILD == "false") {  // Let Webpack do the build if only doing unit-tests
        return src("../appl/main.js")
            .pipe(envs);
    }

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });

    return src("../appl/main.js")
        .pipe(envs)
        .pipe(webpackStream(require("./webpack.dev.conf.js"), webpack))
        .pipe(envs.reset)
        .pipe(dest("../../dist_test/webpack"))
        .on("end", function () {
            cb();
        })
        .on("error", (err) => {
            console.log("Error TestBuild: ", err);
        });
};
/**
 * Continuous testing - test driven development.  
 */
const webpack_tdd = function (done) {
    if (!browsers) {
        global.whichBrowser = ["Chrome", "Firefox"];
    }

    karmaServer(done, false, true);

    // new Server({
    //     configFile: __dirname + "/karma.conf.js"
    // }, done).start();
};
/*
 * Webpack recompile to 'dist_test' on code change
 * run watch in separate window. Used with karma tdd.
 */
const webpack_watch = function (cb) {
    let envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "false",
    });

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });
    return src("../appl/**/*")
        .pipe(envs)
        .pipe(webpackStream(require("./webpack.dev.conf.js"), webpack))
        .pipe(dest("../../dist_test/webpack"))
        .on("end", function () {
            cb();
        });
};

const set_watch_env = function (cb) {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "false",
    });

    return src("./appl/index.js")
        .pipe(envs)
        .on("end", function () {
            cb();
        });
};
/*
 * Webpack development server - use with normal development
 * Rebuilds bundles in dist_test on code change.
 * Run server in separate window - 
 * - watch for code changes 
 * - hot module recompile/replace
 * - reload served web page.
 */
const webpack_server = function (cb) {
    env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "true"
    });

    const options = {
        contentBase: "../../",
        hot: true,
        host: "localhost",
        publicPath: config.dev.assetsPublicPath,
        stats: { colors: true },
        watchOptions: {
            ignored: /node_modules/,
            poll: config.dev.poll
        },
        quiet: false
    };

    webpackConfig = require("./webpack.dev.conf.js");
    webpackConfig.devtool = "eval";
    webpackConfig.output.path = path.resolve(config.dev.assetsRoot);
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        filename: "testapp_dev.html",
        template: "appl/testapp_dev.html",
        // alwaysWriteToDisk: true,
        inject: true
    }));

    // if (!isProduction && useHot) {
    //     module.exports.plugins = (module.exports.plugins || []).concat([
    //         new webpack.NamedModulesPlugin(),
    //         new webpack.HotModuleReplacementPlugin()
    //     ]);
    // if (webpackVersion < 4) {
    //     // module.exports.plugins = (module.exports.plugins || []).concat([
    //         webpackConfig.plugins.push(new ReloadPlugin())
    //     // ]);
    // }
    // }

    WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

    // This seems to be not working?
    //    portfinder.basePort = process.env.PORT || config.dev.port;
    //    portfinder.getPort((err, port) => {
    //      if (err) {
    //        reject(err);
    //      } else {
    //        // publish the new Port, necessary for e2e tests
    //        process.env.PORT = port;
    //        // add port to devServer config
    //        webpackConfig.devServer.port = port;
    //        // Add FriendlyErrorsPlugin
    //        webpackConfig.plugins.push(new FriendlyErrorsPlugin({
    //          compilationSuccessInfo: {
    //            messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`]
    //          },
    //          onErrors: config.dev.notifyOnErrors
    //            ? utils.createNotifierCallback()
    //            : undefined
    //        }));
    //      }
    //    });

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, options);

    server.listen(PORT || config.dev.port, webpackConfig.devServer.host, function (err) {
        log("[webpack-server]", `http://${webpackConfig.devServer.host}:${PORT || config.dev.port}/webpack/appl/testapp_dev.html`);
        if (err) {
            log(err);
        }
        cb();
    });
};

const lintRun = parallel(esLint, cssLint, bootLint);
const prodRun = series(test_build, acceptance_tests, lintRun, build);
prodRun.displayName = "prod";

task(prodRun);
exports.default = prodRun;
exports.test = series(test_build, acceptance_tests);
exports.tdd = series(test_build, webpack_tdd);
exports.rebuild = webpack_rebuild;
exports.acceptance = series(test_env, jasmine_tests);
exports.watch = webpack_watch;
exports.hmr = webpack_server;
exports.development = parallel(webpack_watch, webpack_server, webpack_tdd);
exports.lint = lintRun;
exports.prd = build;

function karmaServer(done, singleRun = false, watch = true) {
    const parseConfig = karma.config.parseConfig;
    const Server = karma.Server;

    parseConfig(
        path.resolve("./karma.conf.js"),
        { port: 9876, singleRun: singleRun, watch: watch },
        { promiseConfig: true, throwErrors: true },
    ).then(
        (karmaConfig) => {
            if(!singleRun) {
                done();
            }
            new Server(karmaConfig, function doneCallback(exitCode) {
                console.log("Karma has exited with " + exitCode);
                if(singleRun) {
                    done();
                }
                if(exitCode > 0) {
                    process.exit(exitCode);
                }
            }).start();
        },
        (rejectReason) => { console.err(rejectReason); }
    );
}

// From Stack Overflow - Node (Gulp) process.stdout.write to file
if (process.env.USE_LOGFILE == "true") {
    var fs = require("fs");
    var util = require("util");
    var logFile = fs.createWriteStream("log.txt", { flags: "w" });
    // Or "w" to truncate the file every time the process starts.
    var logStdout = process.stdout;
    /* eslint no-console: 0 */
    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + "\n");
        logStdout.write(util.format.apply(null, arguments) + "\n");
    };
    console.error = console.log;
}
/*
 * Taking a snapshot example - puppeteer - Not installed!
 */
function karmaServerSnap(done, singleRun = true, watch = false) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
    const parseConfig = karma.config.parseConfig;
    const Server = karma.Server;

    parseConfig(
        path.resolve("./karma.conf.js"),
        { port: 9876, singleRun: singleRun, watch: watch },
        { promiseConfig: true, throwErrors: true },
    ).then(
        (karmaConfig) => {
            new Server(karmaConfig, function doneCallback(exitCode) {
                console.log("Karma has exited with " + exitCode);
                done();
                if (exitCode > 0) {
                    takeSnapShot(["", "start"]);
                    takeSnapShot(["contact", "contact"]);
                    takeSnapShot(["welcome", "react"]);
                    takeSnapShot(["table/tools", "tools"]);
                    // Not working with PDF-?
                    // takeSnapShot(['pdf/test', 'test'])       
                }
                process.exit(exitCode);
            }).start();
        },
        (rejectReason) => { console.err(rejectReason); }
    );
}

function snap(url, puppeteer, snapshot) {
    puppeteer.launch().then((browser) => {
        console.log("SnapShot URL", `${url}${snapshot[0]}`);
        let name = snapshot[1];
        let page = browser.newPage().then((page) => {
            page.goto(`${url}${snapshot[0]}`).then(() => {
                page.screenshot({ path: `snapshots/${name}Acceptance.png` }).then(() => {
                    browser.close();
                }).catch((rejected) => {
                    log(rejected);
                });
            }).catch((rejected) => {
                log(rejected);
            });
        }).catch((rejected) => {
            log(rejected);
        });
    }).catch((rejected) => {
        log(rejected);
    });
}

function takeSnapShot(snapshot) {
    const puppeteer = require("puppeteer");
    let url = "http://localhost:3080/dist_test/webpack/appl/testapp_dev.html#/";

    snap(url, puppeteer, snapshot);
}

