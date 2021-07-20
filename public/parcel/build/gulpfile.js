/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(run acceptance tests) -> 'build-development' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const Parcel = require("@parcel/core").default;
const { src, dest, series, parallel, task } = require("gulp");
const karma = require("karma");
const eslint = require("gulp-eslint");
const csslint = require("gulp-csslint");
const exec = require("child_process").exec;
const copy = require("gulp-copy");
const del = require("del");
const log = require("fancy-log");
const flatten = require("gulp-flatten");
const chalk = require("chalk");
const path = require("path");

let lintCount = 0;
let isProduction = process.env.NODE_ENV == "production";
let browsers = process.env.USE_BROWSERS;
let bundleTest = process.env.USE_BUNDLER;
let testDist = "dist_test/parcel";
let prodDist = "dist/parcel";
let dist = isProduction ? prodDist : testDist;

if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
/**
 * Build Development bundle from package.json 
 */
const build_development = function (cb) {
    return parcelBuild(false, cb, false); // setting watch = false
};
/**
 * Production Parcel 
 */
const build = function (cb) {
    process.env.NODE_ENV = "production";
    isProduction = true;
    parcelBuild(false, cb, false).then(function () {
        cb();
    });
};
/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    return karmaServer(done, true, false);
};
/*
 * javascript linter
 */
const esLint = function (cb) {
    dist = prodDist;
    var stream = src(["../appl/**/*.js"])
        .pipe(eslint({}))
        .pipe(eslint.format())
        .pipe(eslint.result(() => {
            // Keeping track of # of javascript files linted.
            lintCount++;
        }))
        .pipe(eslint.failAfterError());

    stream.on("error", () => {
        process.exit(1);
    });

    return stream.on("end", () => {
        log(chalk.cyan.bold("# javascript files linted: " + lintCount));
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

    stream.on("error", () => {
        process.exit(1);
    });
    return stream.on("end", () => {
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    return exec("npx gulp --gulpfile Gulpboot.js", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/**
 * Remove previous build
 */
const clean = function (done) {
    isProduction = true;
    dist = prodDist;
    return del([
        "../../" + prodDist + "/**/*"
    ], { dryRun: false, force: true }, done);
};

const cleant = function (done) {
    let dryRun = false;
    if (bundleTest && bundleTest === "false") {
        dryRun = true;
    }
    isProduction = false;
    dist = testDist;
    return del([
        "../../" + testDist + "/**/*"
    ], { dryRun: dryRun, force: true }, done);
};

const delCache = function (cb) {
    return del([
        ".cache/**/*"
    ], { dryRun: false, force: true }, cb);
};
/**
 * Resources and content copied to dist directory - for production
 */
const copyprod = function () {
    return copySrc();
};

const copyprod_images = function () {
    isProduction = true;
    dist = prodDist;
    return copyImages();
};
/**
 * Resources and content copied to dist_test directory - for development
 */
const copy_test = function () {
    return copySrc();
};

const copy_images = function () {
    isProduction = false;
    dist = testDist;
    return copyImages();
};
/**
 * Run karma/jasmine tests once and exit without rebuilding(requires a previous build)
 */
const r_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    karmaServer(done, true, false);
};
/**
 * Continuous testing - test driven development.  
 */
// gulp.task('tdd-parcel', ['build-development'], done => {
const tdd_parcel = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Chrome", "Firefox"];
    }
    karmaServer(done, false, true);
};
/**
 * Karma testing under Opera. -- needs configuation  
 */
// eslint-disable-next-line no-unused-vars
const tddo = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Opera"];
    }
    karmaServer(done, false, true);
};

const watch_parcel = function (cb) {
    return parcelBuild(true, cb, false);
};

const serve_parcel = function (cb) {
    return parcelBuild(false, cb, false);
};

const runTestCopy = parallel(copy_test, copy_images);
const runTest = series(cleant, runTestCopy, build_development);
const runProdCopy = parallel(copyprod, copyprod_images);
const runProd = series(runTest, pat, esLint, parallel(cssLint /* , bootLint */), clean, runProdCopy, build);
runProd.displayName = "prod";

exports.build = series(clean, runProdCopy, build);
task(runProd);
task("default", runProd);
exports.prd = series(clean, runProdCopy, build);
exports.test = series(runTest, pat);
exports.tdd = series(runTest, tdd_parcel);
exports.watch = series(runTestCopy, watch_parcel);
exports.serve = series(runTestCopy, delCache, serve_parcel);
exports.acceptance = r_test;
exports.rebuild = series(runTest);
exports.lint = parallel(esLint, cssLint /* , bootLint */);
exports.copy = runTestCopy;
// exports.development = parallel(series(delCache, runTestCopy, watch_parcel/*, sync, watcher*/), series(delCache, runTestCopy, build_development, tdd_parcel))

function parcelBuild(watch, cb, serve = false) {
    if (bundleTest && bundleTest === "false") {
        return cb();
    }
    const file = isProduction ? "../appl/testapp.html" : "../appl/testapp_dev.html";
    const port = 3080;
    // Bundler options
    const options = {
        mode: isProduction? "production": "development",
        entryRoot: "../appl",
        entries: file,
        shouldDisableCache: !isProduction,
        shouldAutoInstall: true,
        shouldProfile: false,
        cacheDir: ".cache",
        shouldContentHash: isProduction,
        logLevel: "info", // 'none' | 'error' | 'warn' | 'info' | 'verbose'
        detailedReport: isProduction,
        defaultConfig: require.resolve("@parcel/config-default"),
        shouldPatchConsole: false,
        additionalReporters: [
           { packageName: "@parcel/reporter-cli", resolveFrom: __filename },
           // { packageName: "@parcel/reporter-dev-server", resolveFrom: __filename }
        ],
        defaultTargetOptions: {
            shouldOptimize: isProduction,
            shouldScopeHoist: false,
            sourceMaps: isProduction,
            publicUrl: "./",
            distDir: "../../" + dist + "/appl",
            engines: {
                browsers: ["> 0.2%, not dead, not op_mini all"]
            }
          },
    };

    return ( async () => {
        const parcel = new Parcel(options);
        if (serve || watch) {
            options.hmrOptions = {
                port: port,
                host: "localhost"
            };
            options.serveOptions = {
                host: "localhost",
                port: port,
                https: false
            };
            await parcel.watch(err => {
                if (err) throw err;
            });
            cb();
        } else {
        try {
                await parcel.run(err => {
                    console.error(err, err.diagnostics[0]? err.diagnostics[0].codeFrame: "");
                });
        } catch(e) { 
            console.error(e);
            process.exit(1);	
        }
            cb();
        }
    })();
}

function copySrc() {
    return src(["../appl/view*/**/*", "../appl/temp*/**/*", "../appl/assets*/**/*", "../appl/dodex*/**/*"])
        .pipe(flatten({ includeParents: -2 })
        .pipe(dest("../../" + dist + "/appl/")));
}

function copyImages() {
    if (!isProduction) {
        src(["../../README.md"])
            .pipe(copy("../../" + dist + "/appl", { prefix: 2 }));
    }
    src(["../images/*"])
        .pipe(copy("../../" + dist + "/appl", { prefix: 1 }));

    src(["../images/more_horiz.png"])
        .pipe(copy("../../" + dist, { prefix: 1 }));

    return src(["../../README.md"])
        .pipe(copy("../../" + dist, { prefix: 2 }));
}
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
                console.warn("Karma has exited with " + exitCode);
                if(singleRun) {
                    done();
                }
                if(exitCode > 0) {
                    process.exit(exitCode);
                }
            }).start();
        },
        (rejectReason) => { console.error(rejectReason); }
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
