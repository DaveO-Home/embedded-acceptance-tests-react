/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat' -> ('eslint', 'csslint') -> 'boot' -> 'build'
 */

const chalk = require('chalk')
const csslint = require('gulp-csslint');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const log = require("fancy-log");
const stealTools = require('steal-tools');
const Server = require('karma').Server;

let lintCount = 0;
let browsers = process.env.USE_BROWSERS;
if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
let isWindows = /^win/.test(process.platform);
/**
 * Default: Production Acceptance Tests 
 */
gulp.task('pat', function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"]
    }

    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();

        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
});

/*
 * javascript linter
 */
gulp.task('eslint', ['pat'], () => {
    var stream = gulp.src(["../appl/js/**/*.js"])
            .pipe(eslint({
                configFile: 'eslintConf.json',
                quiet: 1
            }))
            .pipe(eslint.format())
            .pipe(eslint.result(result => {
                //Keeping track of # of javascript files linted.
                lintCount++;
            }))
            .pipe(eslint.failAfterError());

    stream.on('end', function () {
        log("# javascript files linted: " + lintCount);
    });
    stream.on('error', function () {
        process.exit(1);
    });
    
    return stream;
});
/*
 * css linter
 */
gulp.task('csslint', ['pat'], function () {
    var stream = gulp.src(['../appl/css/site.css',
        '../appl/css/main.css'])
            .pipe(csslint())
            .pipe(csslint.formatter());

    stream.on('error', function () {
        process.exit(1);
    });
});

/*
 * Build the application to the production distribution 
 */
gulp.task('build', ['boot'], function () {
    return stealTools.build({
        main: "stealjs/appl/main",
        baseURL: "../../"
    }, {
        sourceMaps: false,
        bundleAssets: {
            infer: true,
            glob: [
                '../images/favicon.ico',
                '../appl/testapp.html',
                '../appl/index.html',
                '../index.html',
                '../appl/assets/logo.svg',
                '../appl/views/**/*',
                '../appl/templates/**/*',
                '../../README.md',
                '../../node_modules/bootstrap/dist/css/bootstrap.min.css',
                '../appl/css/site.css',
                '../../node_modules/tablesorter/dist/css/theme.blue.min.css',
                '../../node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css',
                '../../node_modules/font-awesome/css/font-awesome.css',
                '../../node_modules/font-awesome/fonts/*'
            ]
        },
        bundleSteal: false,
        dest: "dist",
        removeDevelopmentCode: true,
        envify: true,
        minify: true,
        maxBundleRequests: 5,
        maxMainRequests: 5
    });
});
/*
 * Bootstrap html linter 
 */
gulp.task('boot', ['eslint', 'csslint'], function (cb) {

    exec('gulp --gulpfile Gulpboot.js', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
});

/**
 * Run karma/jasmine tests using FirefoxHeadless 
 */
gulp.task('steal-firefox', function (done) {
    // Running both together as Headless has problems, tdd works
    global.whichBrowsers = ["FirefoxHeadless"];

    runKarma(done, true, false);
});

/**
 * Run karma/jasmine tests using ChromeHeadless 
 */
gulp.task('steal-chrome', function (done) {
    // Running both together as Headless has problems, tdd works
    global.whichBrowsers = ["ChromeHeadless"];

    runKarma(done, true, false);
});

/**
 * Run karma/jasmine tests once and exit
 */
gulp.task('steal-test', function (done) {
    // Running both together as Headless has problems, tdd works
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }

    return runKarma(done, true, false);
});

/**
 * Continuous testing - test driven development.  
 */
gulp.task('steal-tdd', function (done) {
    if (!browsers) {
        global.whichBrowsers = ['Firefox', 'Chrome'];
    }

    return runKarma(done, false, true);
});

/*
 * Startup live reload monitor. 
 */
gulp.task('live-reload', ["vendor"], function (cb) {
    var osCommands = 'cd ../..; node_modules/.bin/steal-tools live-reload';
    if(isWindows) {
	osCommands = 'cd ..\\.. & .\\node_modules\\.bin\\steal-tools live-reload'
    }
    
    exec(osCommands, function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
});
/*
 * Build a vendor bundle from package.json
 */
gulp.task('vendor', function (cb) {
    let vendorBuild = process.env.USE_VENDOR_BUILD;

    if (vendorBuild && vendorBuild == "false") {
        cb();
        return;
    }

    stealTools.bundle({
        config: "../../package.json!npm"
    }, {
        filter: ["node_modules/**/*", "package.json"],
        //dest: __dirname + "/../dist_test"
    }).then(() => {
        cb();
    });
});
/*
 * Startup live reload monitor. 
 */
gulp.task('web-server', function (cb) {
    log.warn(chalk.cyan("Express started"))
    return exec('npm run server', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
});

gulp.task('default', ['pat', 'eslint', 'csslint', 'boot', 'build']);
gulp.task('prod', ['pat', 'eslint', 'csslint', 'boot', 'build']);
gulp.task('tdd', ['steal-tdd']);
gulp.task('test', ['steal-test']);
gulp.task('firefox', ['steal-firefox']);
gulp.task('chrome', ['steal-chrome']);
gulp.task('hmr', ['live-reload']);
gulp.task('server', ['web-server']);

function runKarma(done, singleRun, watch) {

    let server = new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun,
        watch: typeof watch === "undefined" || !watch ? false : true
    },done()) //.start();
    server.start()
}

//From Stack Overflow - Node (Gulp) process.stdout.write to file
if (process.env.USE_LOGFILE == 'true') {
    var fs = require('fs');
    var proc = require('process');
    var origstdout = process.stdout.write,
            origstderr = process.stderr.write,
            outfile = 'production_build.log',
            errfile = 'production_error.log';

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
