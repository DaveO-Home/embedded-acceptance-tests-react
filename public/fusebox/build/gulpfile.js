/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'accept' -> 'pat' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const { src, /*dest,*/ series, parallel, task } = require("gulp");
const runFusebox = require("./fuse4.js");
const chalk = require("chalk");
const csslint = require("gulp-csslint");
const eslint = require("gulp-eslint");
const exec = require("child_process").exec;
const log = require("fancy-log");
const path = require("path");
const Server = require("karma").Server;

let lintCount = 0;
let browsers = process.env.USE_BROWSERS;
let useBundler = process.env.USE_BUNDLER !== "false";
let useFtl = true;

process.argv.forEach(function (val, index, array) {
    useFtl = val === "--noftl" && useFtl ? false : useFtl;
    if(index > 2) {
        process.argv[index] = "";
    }
});

if (browsers) {
    global.whichBrowser = browsers.split(",");
}

/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }

    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
};
/*
 * javascript linter
 */
const esLint = function (cb) {
    var stream = src(["../appl/**/*.js", "../appl/**/*.jsx"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js",
            quiet: 1,
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
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
    var stream = src(["../appl/css/site.css"
    ])
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
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    return exec("npx gulp --gulpfile Gulpboot.js", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        if (err) {
            log("ERROR", err);
        } else {
            log(chalk.green("Bootstrap linting a success"));
        }
        cb();
    });
};
/*
 * Build the application to run karma acceptance tests
 */
const testBuild = function (cb) {
    process.argv[2] = "";
    const props = {
        isKarma: true,
        isHmr: false,
        isWatch: false,
        env: "development",
        useServer: false,
        ftl: false
    };
    let mode = "test";
    const debug = true;
    try {
        log(fuseboxConfig(mode, props));
        return runFusebox(mode, fuseboxConfig(mode, props), debug, cb);
    } catch (e) {
        log("Error", e);
    }
};
/*
 * Build the application to the production distribution 
 */
const build = function (cb) {
    process.argv[2] = "";
    if (!useBundler) {
        return cb();
    }
    const props = {
        isKarma: false,
        isHmr: false,
        isWatch: false,
        env: "production",
        useServer: false,
        ftl: false
    };
    let mode = "prod";
    const debug = true;
    try {
       return runFusebox(mode, fuseboxConfig(mode, props), debug, cb);
    } catch (e) {
        log("Error", e);
    }
};
/*
 * Build the application to preview the production distribution 
 */
const preview = function (cb) {
    process.argv[2] = "";
    const props = {
        isKarma: false,
        isHmr: false,
        isWatch: false,
        env: "production",
        useServer: true,
        ftl: false
    };
    let mode = "preview";
    const debug = true;
    try {
        return runFusebox(mode, fuseboxConfig(mode, props), debug, cb);
    } catch (e) {
        log("Error", e);
    }
};
/*
 * Build the application to run karma acceptance tests with hmr
 */
const fuseboxHmr = function (cb) {
    process.argv[2] = "";
    const props = {
        isKarma: false,
        isHmr: true,
        isWatch: true,
        env: "development",
        useServer: true,
        ftl: useFtl
    };
    let mode = "test";
    const debug = true;
    try {
        runFusebox(mode, fuseboxConfig(mode, props), debug, cb);
    } catch (e) {
        log("Error", e);
    }
};
const setNoftl = function (cb) {
    useFtl = false;
    cb();
};
/*
 * Build the application to run node express so font-awesome is resolved
 */
const fuseboxRebuild = function (cb) {
    process.argv[2] = "";
    const props = {
        isKarma: false,
        isHmr: false,
        isWatch: false,
        env: "development",
        useServer: false,
        ftl: false
    };
    let mode = "test";
    const debug = true;
    try {
        return runFusebox(mode, fuseboxConfig(mode, props), debug, cb);
    } catch (e) {
        log("Error", e);
    }
};
/*
 * copy assets for development
 */
const copy = async function (cb) {
    process.argv[2] = "";
    const props = {
        isKarma: false,
        isHmr: false,
        isWatch: false,
        env: "development",
        useServer: false
    };
    let mode = "copy";
    const debug = true;
    try {
        runFusebox(mode, fuseboxConfig(mode, props), debug);
    } catch (e) {
        log("Error", e);
    }
    cb();
};
/**
 * Run karma/jasmine tests once and exit
 */
const fuseboxAcceptance = function (done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
};
/**
 * Continuous testing - test driven development.  
 */
const fuseboxTdd = function (done) {
    if (!browsers) {
        global.whichBrowser = ["Chrome", "Firefox"];
    }

    new Server({
        configFile: __dirname + "/karma.conf.js",
    }, done).start();
};
/**
 * Continuous testing - test driven development.  
 */
const fuseboxTddWait = function (done) {
    if (!browsers) {
        global.whichBrowser = ["Chrome", "Firefox"];
    }
    setTimeout(function() {
        new Server({
            configFile: __dirname + "/karma.conf.js",
        }, done).start();
    }, 7000);
};
/**
 * Karma testing under Opera. -- needs configuation  
 */
const tddo = function (done) {
    if (!browsers) {
        global.whichBrowser = ["Opera"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
    }, done).start();
};

const runProd = series(testBuild, pat, parallel(esLint, cssLint, bootLint), build);
runProd.displayName = "prod";

task(runProd);
exports.default = runProd;
exports.prd = series(parallel(esLint, cssLint, bootLint), build);
exports.preview = preview;
exports.test = series(testBuild, pat);
exports.tdd = fuseboxTdd;
exports.hmr = fuseboxHmr;
exports.rebuild = fuseboxRebuild;
exports.copy = copy;
exports.acceptance = fuseboxAcceptance;
exports.e2e = fuseboxAcceptance;
exports.development = series(setNoftl, parallel(fuseboxHmr, fuseboxTddWait));
exports.lint = parallel(esLint, cssLint, bootLint);
exports.opera = tddo;

function fuseboxConfig(mode, props) {
    mode = mode || "test";
    // if(process.argv[2]) {
    //     mode = process.argv[2];
    // }
    if (typeof props === "undefined") {
        props = {};
    }
    let toDist = "";
    let isProduction = mode !== "test";
    let distDir = isProduction ? path.join(__dirname, "../../dist/fusebox") : path.join(__dirname, "../../dist_test/fusebox");
    let defaultServer = props.useServer;
    let devServe = {
        httpServer: {
            root: "../../",
            port: 3080,
            open: false
        },
    };
    const configure = {
        root: path.join(__dirname, "../.."),
        distRoot: path.join("/", `${distDir}${toDist}`),
        target: "browser",
        env: { NODE_ENV: isProduction ? "production" : "development" },
        entry: path.join(__dirname, "../appl/main.js"),
        cache: {
            root: path.join(__dirname, ".cache"),
            enabled: !isProduction,
            FTL: typeof props.ftl === "undefined" ? true : props.ftl
        },
        sourceMap: !isProduction,
        webIndex: {
            distFileName: isProduction ? path.join(__dirname, "../../dist/fusebox/appl/testapp.html") : path.join(__dirname, "../../dist_test/fusebox/appl/testapp_dev.html"),
            publicPath: "../",
            template: isProduction ? path.join(__dirname, "../../fusebox/appl/testapp.html") : path.join(__dirname, "../../fusebox/appl/testapp_dev.html")
        },
        watch: props.isWatch && !isProduction,
        hmr: props.isHmr && !isProduction,
        devServer: defaultServer ? devServe : false,
        logging: { level: "succinct" },
        turboMode: true,
        exclude: isProduction ? "**/*test.js" : "",
        resources: {
            resourceFolder: "./appl/resources",
            resourcePublicRoot: isProduction ? "../appl/resources" : "./resources",
        },
        codeSplitting: {
            useHash: isProduction ? true : false
        },
        plugins: []
    };
    return configure;
}

//From Stack Overflow - Node (Gulp) process.stdout.write to file
if (process.env.USE_LOGFILE == "true") {
    var fs = require("fs");
    var util = require("util");
    var logFile = fs.createWriteStream("log.txt", { flags: "w" });
    // Or "w" to truncate the file every time the process starts.
    var logStdout = process.stdout;
    /*eslint no-console: 0 */
    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + "\n");
        logStdout.write(util.format.apply(null, arguments) + "\n");
    };
    console.error = console.log;
}
