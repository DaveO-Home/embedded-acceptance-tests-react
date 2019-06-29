/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(run acceptance tests) -> 'build-development' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const { src, dest, series, parallel, task } = require('gulp');
const alias = require('rollup-plugin-alias');
const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const copy = require("gulp-copy");
const csslint = require('gulp-csslint');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const livereload = require('rollup-plugin-livereload');
const log = require('fancy-log');
const nodeResolve = require('rollup-plugin-node-resolve');
const noop = require('gulp-noop');
const path = require('path')
const postcss = require('rollup-plugin-postcss');
const progress = require('rollup-plugin-progress');
const rename = require('gulp-rename');
const replaceEnv = require('rollup-plugin-replace')
const rmf = require('rimraf')
const rollup = require('rollup');
const serve = require('rollup-plugin-serve');
const stripCode = require("gulp-strip-code");
const Server = require('karma').Server;
const uglify = require('gulp-uglify');
const chalk = require('chalk');
const { timer } = require('rxjs');

const startComment = "develblock:start",
    endComment = "develblock:end",
    regexPattern = new RegExp("[\\t ]*(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        startComment + " ?[\\*\\/]?[\\s\\S]*?(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        endComment + " ?(\\*\\/)?[\\t ]*\\n?", "g");

let lintCount = 0
let isProduction = process.env.NODE_ENV == 'production'
let browsers = process.env.USE_BROWSERS
let testDist = "dist_test/rollup"
let prodDist = "dist/rollup"
let dist = isProduction ? prodDist : testDist

if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
/**
 * Build Development bundle from package.json 
 */
const build_development = function (cb) {
    rollupBuild(cb);
};
/**
 * Production Rollup 
 */
const build = function (done) {
    rollupBuild(done);
};
/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    runKarma(done);
};
/*
 * javascript linter
 */
const esLint = function (cb) {
    dist = prodDist;
    var stream = src(["../appl/js/**/*.js"])
        .pipe(eslint({
            // configFile: 'eslintConf.json',
            // quiet: 1
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
            //Keeping track of # of javascript files linted.
            lintCount++;
        }))
        .pipe(eslint.failAfterError());

    stream.on('error', function () {
        process.exit(1);
    });

    return stream.on('end', function () {
        log("# javascript files linted: " + lintCount);
        cb()
    });
};
/*
 * css linter
 */
const cssLint = function (cb) {
    var stream = src(['../appl/css/site.css'])
        .pipe(csslint())
        .pipe(csslint.formatter());

    stream.on('error', function () {
        process.exit(1);
    });
    return stream.on('end', function () {
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {

    exec('npx gulp --gulpfile Gulpboot.js', function (err, stdout, stderr) {
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
    return rmf(`../../${prodDist}/**/*`, err => {
        done(err)
    })
};
/**
 * Remove previous test build
 */
const cleant = function (done) {
    isProduction = false;
    dist = testDist;
    return rmf(`../../${dist}/**/*`, err => {
        done(err)
    })
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

const copyprod_node_css = function () {
    return copyNodeCss();
};

const copyprod_css = function () {
    return copyCss();
};

const copyprod_fonts = function () {
    isProduction = true;
    dist = prodDist;
    return copyFonts();
};
/**
 * Resources and content copied to dist_test directory - for development
 */
const copy_test = function () {
    return copySrc();
};

const copy_images = function () {
    copyIndex();
    return copyImages();
};

const copy_node_css = function () {
    return copyNodeCss();
};

const copy_css = function () {
    return copyCss();
};

const copy_fonts = function () {
    isProduction = false;
    dist = testDist;
    return copyFonts();
};
/**
 * Run karma/jasmine tests once and exit without rebuilding(requires a previous build)
 */
const r_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    runKarma(done);
};
/**
 * Continuous testing - test driven development.  
 */
const rollup_tdd = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Chrome", "Firefox"];
    }
    new Server({
        configFile: __dirname + '/karma.conf.js',
    }, done).start();
};
/**
 * Karma testing under Opera. -- needs configuation  
 */
const tddo = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Opera"];
    }
    new Server({
        configFile: __dirname + '/karma.conf.js',
    }, done).start();
};

const rollup_watch = function (cb) {
    const watchOptions = {
        allowRealFiles: true,
        input: '../appl/main.js',
        plugins: [
            progress({
                clearLine: isProduction ? false : true
            }),
            replaceEnv({
                'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            }),
            alias(aliases()),
            postcss(),
            nodeResolve({
                browser: true,
                jsnext: true,
                main: true,
                extensions: ['.js', '.jsx']
            }),
            babel({
                babelrc: false,
                exclude: ['node_modules/**'],
                presets: [["@babel/preset-react", {
                    es2017: {
                        modules: false
                    }
                }]],
                plugins: ["@babel/plugin-transform-react-jsx"]
            }),
            commonjs(),
            serve({
                open: false,
                verbose: true,
                contentBase: "../../",
                historyApiFallback: false,
                host: "localhost",
                port: 3080
            }),
            livereload({
                watch: "../../" + dist + "/bundle.js",
                verbose: true,
            })
        ],
        output: {
            name: "acceptance",
            file: '../../' + dist + '/bundle.js',
            format: "iife",
            sourcemap: true
        }
    };
    watcher = rollup.watch(watchOptions);
    let starting = false;
    watcher.on('event', event => {
        switch (event.code) {
            case "START":
                log("Starting...");
                starting = true;
                break;
            case "BUNDLE_START":
                log(event.code, "\nInput=", event.input, "\nOutput=", event.output);
                break;
            case "BUNDLE_END":
                log("Waiting for code change. Build Time:", millisToMinutesAndSeconds(event.duration));
                break;
            case "END":
                if (!starting) {
                    log("Watch Shutdown Normally");
                    cb()
                }
                starting = false;
                break;
            case "ERROR":
                log("Unexpected Error", event);
                cb();
                break;
            case "FATAL":
                log("Rollup Watch interrupted by Fatal Error", event);
                cb();
                break;
            default:
                break;
        }
    });
};

const testCopyRun = series(copy_fonts, parallel(copy_test, copy_images, copy_node_css, copy_css))
const testRun = series(cleant, testCopyRun, build_development)
const lintRun = parallel(esLint, cssLint, bootLint)
const prodCopyRun = series(copyprod_fonts, parallel(copyprod, copyprod_images, copyprod_node_css, copyprod_css))
const prodRun = series(cleant, testCopyRun, build_development, pat, lintRun, clean, prodCopyRun, build)
prodRun.displayName = 'prod'

task(prodRun)
exports.default = prodRun
exports.test = series(testRun, pat)
exports.tdd = series(testRun, rollup_tdd)
exports.watch = rollup_watch
exports.rebuild = testRun
exports.acceptance = r_test
exports.development = parallel(rollup_watch, rollup_tdd)

const inputOptions = {
    input: '../appl/main.js',
    plugins: [
        progress({
            clearLine: isProduction ? false : true
        }),
        replaceEnv({
            'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
        }),
        alias(aliases()),
        postcss(),
        nodeResolve({ /*browser: true, jsnext: true, main: true, */ extensions: ['.js', '.jsx'] }),
        babel({
            babelrc: false,
            exclude: ['node_modules/**'],
            presets: [["@babel/preset-react", {
                es2017: {
                    modules: false
                }
            }]],
            plugins: ["@babel/plugin-transform-react-jsx"]
        }),
        commonjs()
    ],
    onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED' ||
            warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
        }
        console.warn(warning.message);
    },
    treeshake: true,
    perf: isProduction === true, 
    external: []
};

const inputOptionsProd = {
    input: '../appl/main.js',
    plugins: [
        progress({
            clearLine: false
        }),
        replaceEnv({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        alias(aliases()),
        postcss(),
        buble(),
        nodeResolve({ browser: true, jsnext: true, main: true, extensions: ['.js', '.jsx'] }),
        babel({
            babelrc: false,
            exclude: ['node_modules/**'],
            presets: [["@babel/preset-react", {
                es2017: {
                    modules: false
                }
            }]],
            plugins: ["@babel/plugin-transform-react-jsx"]
        }),
        commonjs(),
    ],
    onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED' ||
            warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
        }
        console.warn(warning.message);
    },
    treeshake: true,
    perf: true, 
    external: []
};

const outputOptions = {
    compact: isProduction ? true : false,
    format: "iife",
    name: "acceptance",
    sourcemap: isProduction ? false : true,
    file: 'build/bundle.js'
};

async function rollupBuild(done) {
    const bundle = await rollup.rollup(isProduction ? inputOptionsProd : inputOptions);
    if(isProduction) {
        console.log("Timings:", bundle.getTimings())
    }
    await bundle.write(outputOptions);

    await rollup2Build(done)
}

function rollup2Build(done) {
    if (isProduction) {
        log(chalk.cyan("Starting Bundle Strip Code and Uglify"));
    } else {
        log(chalk.cyan("Copying Test Bundle and Map"));
    }
    if (!isProduction) {
        copySrcMaps()
    }
    const stream = src(['build/bundle.js'])
        .pipe(isProduction ? stripCode({ pattern: regexPattern }) : noop())
        .pipe(rename('bundle.js'))
        .pipe(isProduction ? uglify() : noop())
        .pipe(dest('../../' + dist));
    stream.on('end', function () {
        log(chalk.cyan("Done with compile"));
        if (typeof done !== 'undefined') {
            done()
        }
    });
}

function modResolve(dir) {
    return path.join(__dirname, '..', dir)
}

function aliases() {
    return {
        app: modResolve("appl/js/app.js"),
        basecontrol: modResolve("appl/js/utils/base.control"),
        config: modResolve("appl/js/config"),
        default: modResolve("appl/js/utils/default"),
        helpers: modResolve("appl/js/utils/helpers"),
        menu: modResolve("appl/js/utils/menu.js"),
        pdf: modResolve("appl/js/controller/pdf"),
        router: modResolve("appl/router"),
        start: modResolve("appl/js/controller/start"),
        setup: modResolve("appl/js/utils/setup"),
        setglobals: modResolve("appl/js/utils/set.globals"),
        setimports: modResolve("appl/js/utils/set.imports"),
        table: modResolve("appl/js/controller/table"),
        pager: "../../node_modules/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js",
        popper: "../../node_modules/popper.js/dist/esm/popper.js",
        handlebars: "../../node_modules/handlebars/dist/handlebars.min.js",
        bootstrap: "../../node_modules/bootstrap/dist/js/bootstrap.min.js",
        "apptest": "../appl/jasmine/apptest.js",
        "contacttest": "./contacttest.js",
        "domtest": "./domtest.js",
        "logintest": "./logintest.js",
        "routertest": "./routertest.js",
        "toolstest": "./toolstest.js",
        '@': modResolve('appl'),
    };
}

function copySrc() {
    return src(['../appl/views/**/*', '../appl/templates/**/*', '../appl/index.html', '../appl/assets/**/*', isProduction ? '../appl/testapp.html' : '../appl/testapp_dev.html'])
        .pipe(copy('../../' + dist + '/appl'));
}

function copyIndex() {
    return src(['../index.html'])
        .pipe(copy('../../' + dist + '/rollup'));
}

function copyImages() {
    return src(['../images/*', '../../README.md'])
        .pipe(copy('../../' + dist + '/appl'));
}

function copyCss() {
    return src(['../appl/css/site.css'])
        .pipe(copy('../../' + dist + '/appl'));
}

function copyNodeCss() {
    return src(['../../node_modules/bootstrap/dist/css/bootstrap.min.css', "../../node_modules/font-awesome/css/font-awesome.css",
        "../../node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css", "../../node_modules/tablesorter/dist/css/theme.blue.min.css"])
        .pipe(copy('../../' + dist + '/appl'));
}

function copyFonts() {
    return src(['../../node_modules/font-awesome/fonts/*'])
        .pipe(copy('../../' + dist + '/appl'));
}

function copySrcMaps() {
    return src(['build/bundle.js.map'])
        .pipe(dest('../../' + dist))
}

function runKarma(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        if (typeof done === "function") {
            done();
        }
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();

}
//per stackoverflow - Converting milliseconds to minutes and seconds with Javascript
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return ((seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds) + (minutes === 0 ? " seconds" : "minutes"));

}
/*
 * From Stack Overflow - Node (Gulp) process.stdout.write to file
 * @type type
 */
if (process.env.USE_LOGFILE == 'true') {
    var fs = require('fs');
    var origstdout = process.stdout.write,
        origstderr = process.stderr.write,
        outfile = 'node_output.log',
        errfile = 'node_error.log';

    if (fs.exists(outfile)) {
        fs.unlink(outfile);
    }
    if (fs.exists(errfile)) {
        fs.unlink(errfile);
    }

    process.stdout.write = function (chunk) {
        fs.appendFile(outfile, chunk.replace(/\x1b\[[0-9;]*m/g, ''));
        origstdout.apply(this, arguments);
    };

    process.stderr.write = function (chunk) {
        fs.appendFile(errfile, chunk.replace(/\x1b\[[0-9;]*m/g, ''));
        origstderr.apply(this, arguments);
    };
}
