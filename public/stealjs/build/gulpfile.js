/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat' -> ('eslint', 'csslint', 'boot') -> 'build'
 */
const { src, /* dest, */ series, parallel, /* task */ } = require("gulp");
const chalk = require("chalk");
const csslint = require("gulp-csslint");
const eslint = require("gulp-eslint");
const exec = require("child_process").exec;
const path = require("path");
const log = require("fancy-log");
const stealTools = require("steal-tools");
const karma = require("karma");

let lintCount = 0;
let browsers = process.env.USE_BROWSERS;
if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
let isWindows = /^win/.test(process.platform);
/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }

    karmaServer(done, true, false);
};

/*
 * javascript linter
 */
const esLint = function (cb) {
    var stream = src(["../appl/**/*.js", "../appl/**/*.jsx"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js",
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
        log(chalk.blue.bold("# javascript & jsx files linted: " + lintCount));
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
 * Build the application to the production distribution 
 */
const build = function (cb) {
    process.env.NODE_ENV = "production";
    return stealTools.build({
        main: "stealjs/appl/main",
        baseURL: "../../"
    }, {
        sourceMaps: false,
        bundleAssets: {
            infer: true,
            glob: [
                "../images/*",
                "../appl/testapp.html",
                "../appl/index.html",
                "../index.html",
                "../appl/assets/logo.svg",
                "../appl/views/**/*",
                "../appl/templates/**/*",
                "../appl/dodex/**/*",
                "../../README.md",
                "../../node_modules/bootstrap/dist/css/bootstrap.min.css",
                "../appl/css/site.css",
                "../../node_modules/tablesorter/dist/css/theme.blue.min.css",
                "../../node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css",
                "../../node_modules/font-awesome/css/font-awesome.css",
                "../../node_modules/font-awesome/fonts/*"
            ]
        },
        bundleSteal: false,
        dest: "dist",
        removeDevelopmentCode: true,
        envify: true,
        minify: true,
        maxBundleRequests: 5,
        maxMainRequests: 5
    }).then(function () {
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    exec("npx gulp --gulpfile Gulpboot.js", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/**
 * Run karma/jasmine tests using FirefoxHeadless 
 */
const steal_firefox = function (done) {
    global.whichBrowsers = ["FirefoxHeadless"];
    karmaServer(done, true, false);
};
/**
 * Run karma/jasmine tests using ChromeHeadless 
 */
const steal_chrome = function (done) {
    global.whichBrowsers = ["ChromeHeadless"];
    karmaServer(done, true, false);
};
/**
 * Run karma/jasmine tests once and exit
 */
const steal_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    return karmaServer(done, true, false);
};
/**
 * Continuous testing - test driven development.  
 */
const steal_tdd = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Firefox", "Chrome"];
    }
    return karmaServer(done, false, true);
};
/*
 * Startup live reload monitor. 
 */
const live_reload = function (cb) {
    var osCommands = "cd ../..; npx steal-tools live-reload"; // node_modules/.bin/steal-tools live-reload';
    if (isWindows) {
        osCommands = "cd ..\\.. & .\\node_modules\\.bin\\steal-tools live-reload";
    }

    return exec(osCommands, function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/*
 * Build a vendor bundle from package.json
 */
const vendor = function (cb) {
    let vendorBuild = process.env.USE_VENDOR_BUILD;

    if (vendorBuild && vendorBuild == "false") {
        cb();
        return;
    }

    stealTools.bundle({
        config: "../../package.json!npm"
    }, {
        filter: ["node_modules/**/*", "package.json"],
        // dest: __dirname + "/../dist_test"
    }).then(() => {
        cb();
    });
};
/*
 * Startup live reload monitor. 
 */
const web_server = function (cb) {
    log.warn(chalk.cyan("Express started"));
    return exec("npm run server", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};

const runLint = parallel(esLint, cssLint, bootLint);

exports.default = series(pat, runLint, build);
exports.prod = series(pat, runLint, build);
exports.prd = build;
exports.test = steal_test;
exports.tdd = steal_tdd;
exports.firefox = steal_firefox;
exports.chrome = steal_chrome;
exports.hmr = series(vendor, live_reload);
exports.server = web_server;
exports.development = parallel(series(vendor, live_reload), web_server, steal_tdd);
exports.lint = runLint;

function karmaServer(done, singleRun = false, watch = true) {
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
                process.exit(exitCode);
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
