/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(run acceptance tests) -> 'build-development' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const { src, dest, task, series, parallel } = require("gulp");
const log = require("fancy-log");
const copy = require("gulp-copy");
const exec = require("child_process").exec;
const path = require("path");
const noop = require("gulp-noop");
const chalk = require("chalk");
const buffer = require("vinyl-buffer");
const envify = require("envify/custom");
const eslint = require("gulp-eslint");
const source = require("vinyl-source-stream");
const uglify = require("gulp-uglify");
const karma = require("karma");
const csslint = require("gulp-csslint");
const watchify = require("watchify");
const stripCode = require("gulp-strip-code");
const browserify = require("browserify");
const removeCode = require("gulp-remove-code");
const sourcemaps = require("gulp-sourcemaps");
const rimrafSync = require("rimraf").rimrafSync;
const browserSync = require("browser-sync").create("devl");

const startComment = "develblock:start",
    endComment = "develblock:end",
    regexPattern = new RegExp("[\\t ]*(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        startComment + " ?[\\*\\/]?[\\s\\S]*?(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        endComment + " ?(\\*\\/)?[\\t ]*\\n?", "g");

let browsers = process.env.USE_BROWSERS;
let testDist = "dist_test/browserify";
let prodDist = "dist/browserify";
let lintCount = 0;
let isWatchify = process.env.USE_WATCH === "true";
let isProduction = process.env.NODE_ENV === "production";
let dist = isProduction ? prodDist : testDist;
let isSplitBundle = true;
let browserifyInited;

if (browsers) {
    global.whichBrowsers = browsers.split(",");
}

/**
 * Build bundle from package.json 
 */
const build = function (cb) {
    isWatchify = false;
    return browserifyBuild(cb);
};
/**
 * Build Development bundle from package.json 
 */
const build_development = function (cb) {
    return isSplitBundle ? browserifyBuild(cb) : noop();
};
/**
 * Production Browserify 
 */
const application = function (cb) {
    isWatchify = false;
    return applicationBuild(cb);
};
/**
 * Development Browserify - optional watchify and reload 
 */
const application_development = function (cb) {
    // Set isWatchify=true via env USE_WATCH for tdd/test   
    return applicationBuild(cb);
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
    process.env.NODE_ENV = "production";
    dist = prodDist;
    var stream = src(["../appl/**/*.js", "../appl/**/*.jsx"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js", // 'eslintConf.json',
            quiet: 1
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(() => {
            // Keeping track of # of javascript files linted.
            lintCount++;
        }))
        .pipe(eslint.failAfterError());

    stream.on("error", function () {
        process.exit(1);
    });

    return stream.on("end", function () {
        log(chalk.blue.bold("# javascript and jsx files linted: " + lintCount));
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

    stream.on("error", function () {
        process.exit(1);
    });
    return stream.on("end", function () {
        cb();
    });
};
/*
 * Bootstrap html linter - does not work with bootstrap5
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
    rimrafSync("../../${prodDist}/**/*", [], (err) => {
       if (err) {
           log(err);
       }
    });
    return done()
};
/**
 * Remove previous browserify test build
 */
const cleant = function (done) {
    isProduction = false;
    rimrafSync("../../${testDist}/node_modules", [], (err) => {
       if (err) {
           log(err);
       }
    });
    rimrafSync("../../${testDist}/browserify", [], (err) => {
       if (err) {
           log(err);
       }
    });
    return done();
};
/**
 * Resources and content copied to dist directory - for production
 */
const copyprod = function () {
    copyIndex();
    return copySrc();
};

const copyprod_images = function () {
    return copyImages();
};
/**
 * Resources and content copied to dist_test directory - for development
 */
const copy_test = function () {
    copyIndex();
    return copySrc();
};

const copy_images = function () {
    return copyImages();
};
/*
 * Setup development with reload of app on code change
 */
const watch = function () {
    dist = testDist;
    browserSync.init({ server: "../../", index: "index_b.html", port: 3080, browser: ["google-chrome"] });
    browserSync.watch("../../" + dist + "/index.js").on("change", browserSync.reload);  // change any file in appl/ to reload app - triggered on watchify results

    return browserSync;
};
/**
 * Run karma/jasmine tests once and exit without rebuilding(requires a previous build)
 */
const b_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }

    karmaServer(done, true, false);
};
/**
 * Run watch(HMR)
 */
const b_hmr = function () {
    log("Watching, will rebuild bundle on code change.");
};

const b_watchify = function(cb) {
    isWatchify = true;
    cb();
};
/**
 * Continuous testing - test driven development.  
 */
const tdd_browserify = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Chrome", "Firefox"];
    }
    karmaServer(done, false, true);
};
/**
 * Karma testing under Opera. -- needs configuation  
 */
const tddo = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Opera"];
    }
    karmaServer(done, false, true);
};

const runCopyProd = parallel(copyprod, copyprod_images);
const runCopyTest = parallel(copy_test, copy_images);
const runTest = series(parallel(application_development, build_development), pat);
const runLint = parallel(esLint, cssLint /* , bootLint*/);
const runHmr = series(b_watchify, parallel(application_development, build_development), b_hmr);
const runTdd = series(b_watchify, parallel(application_development, build_development), tdd_browserify);
const runProd = series(cleant, runCopyTest, runTest, runLint, clean, runCopyProd, parallel(application, build));
runProd.displayName = "prod";

task("default", runProd);
exports.prod = task(runProd);
exports.prd = series(runLint, clean, runCopyProd, parallel(application, build));
exports.test = series(cleant, runCopyTest, runTest);
exports.acceptance = b_test;
exports.tdd = runTdd;
exports.rebuild = parallel(application_development, build_development);
exports.server = watch;
exports.hmr = runHmr;
exports.development = parallel(watch, runHmr, runTdd);
exports.lint = runLint;
exports.copy = runCopyTest;

function browserifyBuild(cb) {
    browserifyInited = browserify({
        debug: !isProduction,
        bundleExternal: true
    });

    var mods = getNPMPackageIds();
    for (var id in mods) {
        if (mods[id] !== "font-awesome") {
            browserifyInited.require(require("resolve").sync(mods[id]), { expose: mods[id] });
        }
    }

    var stream = browserifyInited.bundle()
        .pipe(source("vendor.js"))
        .pipe(buffer())
        .pipe(isProduction ? stripCode({ pattern: regexPattern }) : noop())
        .pipe(isProduction ? uglify() : noop());

    stream = stream.pipe(sourcemaps.init({ loadMaps: !isProduction }))
        .pipe(sourcemaps.write("../../" + dist + "/maps", { addComment: !isProduction }));

    stream = stream.pipe(dest("../../" + dist));
    return stream.on("end", function () {
        cb();
    });
}

function getNPMPackageIds() {
    var ids = JSON.parse("{" +
        "\"aw\": \"@fortawesome/fontawesome-free\"," +
        "\"bo\": \"bootstrap\"," +
        "\"jq\": \"jquery\"," +
        "\"lo\": \"lodash\"," +
        "\"hb\": \"handlebars\"," +
        "\"mo\": \"moment\"," +
        //        '"pd": "pdfjs-dist",' +
        "\"@po\": \"@popperjs/core\"," +
        "\"tb\": \"tablesorter\"}");
    return ids;
}

function applicationBuild(cb) {
    browserifyInited = browserify({
        entries: ["../appl/main"],
        transform: ["browserify-css"],
        extensions: [".jsx", ".js"],
        debug: !isProduction,
        insertGlobals: true,
        noParse: ["jquery"],
        cache: {},
        packageCache: {}
    }).transform("babelify", {presets: ["@babel/preset-env", "@babel/preset-react"]});

    let modules = [];
    var mods = getNPMPackageIds();
    for (var id in modules) {
        if (mods[id] !== "font-awesome") {
            modules.push(mods[id]);
        }
    }

    if (isSplitBundle) {
        browserifyInited.external(modules);
    }
    enableWatchify();

    return browserifyApp(cb);
}

/*
 * Build application bundle for production or development
 */
function browserifyApp(cb) {
    var stream = browserifyInited
        .transform(
            { global: true },
            envify({ NODE_ENV: isProduction ? "production" : "development" })
        )
        .bundle()
        .pipe(source("index.js"))
        .pipe(removeCode({ production: isProduction }))
        .pipe(buffer())
        .pipe(isProduction ? stripCode({ pattern: regexPattern }) : noop())
        .pipe(isProduction ? uglify().on("error", log) : noop());

    stream = stream.pipe(sourcemaps.init({ loadMaps: !isProduction }))
        .pipe(sourcemaps.write("../../" + dist + "/maps", { addComment: !isProduction }));

    stream = stream.pipe(dest("../../" + dist));

    return stream.on("end", function () {
        if(typeof cb === "function") {
            cb();
        }
    });
}

function enableWatchify() {
    if (isWatchify) {
        browserifyInited.plugin(watchify);
        browserifyInited.on("update", applicationBuild);
        browserifyInited.on("log", log);
    }
}

function copySrc() {
    return src(["../appl/views/**/*", "../appl/templates/**/*", "../appl/dodex/**/*", "../appl/index.html", isProduction ? "../appl/testapp.html" : "../appl/testapp_dev.html"])
        .pipe(copy("../../" + dist + "/appl"));
}

function copyIndex() {
    return src(["../index.html"])
        .pipe(copy("../../" + dist + "/browserify"));
}

function copyImages() {
    return src(["../images/*", "../../README.md", "../appl/assets/*"])
        .pipe(copy("../../" + dist + "/appl"));
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
