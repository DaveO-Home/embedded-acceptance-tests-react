// Karma configuration
var bundler = "stealjs";
module.exports = function (config) {

    if (!global.whichBrowsers) {
        global.whichBrowsers = ["ChromeHeadless, FirefoxHeadless"];
    }
    config.set({
        basePath: "../../",
        frameworks: ["jasmine-jquery"],
        proxies: {
            "/views/": "/base/" + bundler + "/appl/views/",
            "/templates": "/base/" + bundler + "/appl/templates",
            "/app_bootstrap.html": "/base/" + bundler + "/appl/app_bootstrap.html",
            "/README.md": "/base/README.md",
            "/base/jquery.js": "/base/node_modules/jquery/dist/jquery.js",
            "/appl/assets/logo.svg": "/base/" + bundler + "/appl/assets/logo.svg",
            "/images/dodex_g.ico": "/base/" + bundler + "/images/dodex_g.ico",
            "/dodex/data/content.js": "/base/" + bundler + "/appl/dodex/data/content.js",
            "stealjs/appl/": "/base/stealjs/appl/",
            "/base/bootstrap.js": "/base/node_modules/bootstrap/dist/js/bootstrap.js"
        },
        // list of files / patterns to load in the browser
        files: [
            // Webcomponents for Firefox - used for link tag with import attribute.
            {pattern: bundler + "/appl/jasmine/webcomponents-hi-sd-ce.js", watched: false},
            // Jasmine tests
            bundler + "/tests/unit_*.js",
            // Application and Acceptance specs.
            bundler + "/appl/testapp_karma.html",
            // Module loader - so we can run steal unit tests - see include-all-tests.js
            "node_modules/steal/steal.js",
            {pattern: "node_modules/steal/**", watched: false, served: true, included: false},
            {pattern: "node_modules/**/package.json", watched: false, served: true, included: false},
            {pattern: "node_modules/steal-css/css.js", watched: false, included: false},
            {pattern: "node_modules/tablesorter/dist/js/jquery.tablesorter.combined.min.js", watched: false, served: true, included: false},
            {pattern: "node_modules/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js", watched: false, served: true, included: false},
            {pattern: "node_modules/bootstrap/dist/js/bootstrap.js", watched: false, included: false},
            {pattern: "node_modules/tablesorter/dist/js/jquery.tablesorter.widgets.min.js", watched: false, included: false},
            {pattern: "node_modules/jsoneditor/dist/jsoneditor.min.js", watched: false, included: false},
            {pattern: "node_modules/@popperjs/core/dist/cjs/**/*.js", watched: false, included: false},
            {pattern: "node_modules/jquery/dist/jquery.js", watched: false, included: false},
            {pattern: "node_modules/lodash-es/capitalize.js", watched: false, included: false},
            {pattern: "node_modules/lodash-es/trimStart.js", watched: false, included: false},
            {pattern: "node_modules/lodash-es/toString.js", watched: false, included: false},
            {pattern: "node_modules/lodash-es/upperFirst.js", watched: false, included: false},
            {pattern: "node_modules/lodash-es/*.js", watched: false, included: false},
            {pattern: "node_modules/moment/moment.js", watched: false, included: false},
            {pattern: "node_modules/moment/locale/*.js", watched: false, included: false},
            {pattern: "node_modules/marked/lib/marked.js", watched: false, included: false},
            // {pattern: "node_modules/rxjs/index.js", watched: false, included: false},
            {pattern: "node_modules/rxjs/dist/cjs/**/*.js", watched: false, included: false},
            // {pattern: "node_modules/rxjs/internal/**/*.js", watched: false, included: false},
            {pattern: "node_modules/redux/lib/redux.js", watched: false, included: false},
            {pattern: "node_modules/prop-types/**/*.js", watched: false, included: false},
            {pattern: "node_modules/object-assign/index.js", watched: false, included: false},
            {pattern: "node_modules/scheduler/index.js", watched: false, included: false},
            {pattern: "node_modules/scheduler/cjs/*.js", watched: false, included: false},
            {pattern: "node_modules/scheduler/tracing.js", watched: false, included: false},
            {pattern: "node_modules/symbol-observable/**/*.js", watched: false, included: false},
            {pattern: "node_modules/history/cjs/*.js", watched: false, included: false},
            {pattern: "node_modules/history/*.js", watched: false, included: false},
            {pattern: "node_modules/tiny-warning/dist/tiny-warning.cjs.js", watched: false, included: false},
            {pattern: "node_modules/tiny-invariant/dist/tiny-invariant.cjs.js", watched: false, included: false},
            // {pattern: "node_modules/tiny-inflate/index.js", watched: false, included: false},
            {pattern: "node_modules/resolve*/**/*.js", watched: false, included: false},
            {pattern: "node_modules/value-equal/index.js", watched: false, included: false},
            {pattern: "node_modules/value-equal/cjs/value-equal.min.js", watched: false, included: false},
            {pattern: "node_modules/value-equal/cjs/value-equal.js", watched: false, included: false},
            {pattern: "node_modules/value-or-function/index.js", watched: false, included: false},
            {pattern: "node_modules/handlebars/dist/handlebars.min.js", watched: false, included: false},
            {pattern: bundler + "/appl/dodex/data/*.*", included: false, watched: false},
            {pattern: "node_modules/dodex/dist/*", watched: false, included: false},
            {pattern: "node_modules/dodex-input/dist/dodex-input.min.js", watched: false, included: false},
            {pattern: "node_modules/dodex-mess/dist/dodex-mess.min.js", watched: false, included: false},
            {pattern: "node_modules/react*/**", watched: false, included: false},
            {pattern: bundler + "/appl/**/*.js", included: false, watched: true, served: true },
            {pattern: bundler + "/appl/**/*.jsx", included: false, watched: true, served: true },
            {pattern: bundler + "/appl/**", included: false},
            {pattern: bundler + "/images/*", included: false},
            {pattern: "package.json", watched: false, included: false},
            {pattern: "README.md", included: false},
            {pattern: "index.js", included: false, watched: false, served: false},
            {pattern: "dev-bundle.js", watched: false, included: false},
            {pattern: "node_modules/bootstrap/dist/css/bootstrap.min.css", watched: false, included: false},
            {pattern: "node_modules/tablesorter/dist/css/theme.blue.min.css", watched: false, included: false},
            {pattern: "node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css", watched: false, included: false},
            {pattern: "node_modules/jsoneditor/dist/jsoneditor.min.css", watched: false, included: false},
            {pattern: "node_modules/font-awesome/css/font-awesome.css", watched: false, included: false},
            {pattern: "node_modules/font-awesome/fonts/fontawesome-webfont.woff2", watched: false, included: false},
            {pattern: "node_modules/hoist-non-react-statics/**", watched: false, included: false},
            // {pattern: "node_modules/react-router/node_modules/path-to-regexp/node_modules/isarray/**/*", watched: false, included: false},
            // {pattern: "node_modules/react-router/**/*", watched: false, included: false},
            {pattern: "node_modules/isarray/**", watched: false, included: false},
            {pattern: "node_modules/js-tokens/**", watched: false, included: false},
            {pattern: "node_modules/loose-envify/**", watched: false, included: false},
            {pattern: "node_modules/mini-create-react-context/**", watched: false, included: false},
            {pattern: "node_modules/path-to-regexp/**", watched: false, included: false},
            {pattern: "node_modules/regenerator-runtime/**", watched: false, included: false},
            {pattern: "node_modules/resolve-pathname/**", watched: false, included: false},
            {pattern: "node_modules/@babel/**", watched: false, included: false},
            // Jasmine/Steal tests and starts Karma
            bundler + "/build/karma.bootstrap.js"
        ],
        bowerPackages: [
        ],
        plugins: [
            "karma-*",
            "@metahub/karma-jasmine-jquery",
        ],
        /* Karma uses <link href="/base/appl/testapp_dev.html" rel="import"> -- you will need webcomponents polyfill to use browsers other than Chrome.
         * This test demo will work with Chrome/ChromeHeadless by default - Webcomponents included above, so FirefoxHeadless should work also. 
         * Other browsers may work with tdd.
         */
        browsers: global.whichBrowsers,
        customLaunchers: {
            FirefoxHeadless: {
                base: "Firefox",
                flags: ["--headless"]
            }
        },
        browserNoActivityTimeout: 0,
        exclude: [
        ],
        preprocessors: {
            "*/**/*.html": []
        },
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        loggers: [{
                type: "console"
            }
        ],
        client: {
            captureConsole: true,
            clearContext: true
        },
        concurrency: 5, // Infinity
    });
};
