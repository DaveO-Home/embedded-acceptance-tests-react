const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const deployDir = isProduction ? "dist/brunch" : "dist_test/brunch";
const fontLocation = isProduction ? "../fonts" : process.env.USE_WATCH === "true" ? "fonts" : "../fonts";
const singleRun = process.env.USE_HMR !== "true" && !process.env.USE_TDD;
const htmlFile = isProduction ? "brunch/appl/testapp.html" : "brunch/appl/testapp_dev.html";

function resolve(dir) {
  return path.join(__dirname, "brunch", dir);
}

exports.paths = {
  public: deployDir,
  watched: ["brunch/appl", "brunch/jasmine"]
};

exports.files = {
  javascripts: {
    joinTo: {
      "vendor.js": /^(?!brunch\/appl)/,
      "acceptance.js": [/^brunch\/appl/, /^brunch\/jasmine/]
    }
  },
  templates: {
    joinTo: "acceptance.js"
  },
  stylesheets: {
    joinTo: "acceptance.css",
    order: {
      after: ["brunch/appl/css/site.css", "brunch/appl/assets/App.css"]
    }
  }
};

let pluginsObject = {
  stripcode: {
    start: "develblock:start",
    end: "develblock:end"
  },
  babel: {
    presets: ["@babel/env", "@babel/react"],
    ignore: [
      /^node_modules/
    ],
    pattern: /\.(js|jsx)$/
  },
  // See README.md for implementation
  // eslint: {
  //   pattern: /^brunch\/appl\/.*\.js?$/,
  //   warnOnly: true
  // },
  // vue: {
  //   extractCSS: true,
  //   out: deployDir + '/components.css'
  // },
  copycat: {
    "appl/views": ["brunch/appl/views"],
    "appl/templates": ["brunch/appl/templates"],
    "appl/dodex": ["brunch/appl/dodex"],
    "./": ["README.md"],
    "appl": [htmlFile],
    "images": ["brunch/images"],
    "appl/assets": ["brunch/appl/assets/logo.svg"],
    verbose: false,
    onlyChanged: true
  },
  uglify: {
    mangle: false,
    fromString: true,
    compress: {
      global_defs: {
        DEBUG: false
      },
      // defaults here: http://lisperator.net/uglifyjs/compress
      sequences: false,  // join consecutive statemets with the “comma operator”
      properties: true,  // optimize property access: a["foo"] → a.foo
      dead_code: true,  // discard unreachable code
      drop_debugger: true,  // discard “debugger” statements
      unsafe: false, // some unsafe optimizations (see below)
      conditionals: true,  // optimize if-s and conditional expressions
      comparisons: true,  // optimize comparisons
      evaluate: true,  // evaluate constant expressions
      booleans: true,  // optimize boolean expressions
      loops: true,  // optimize loops
      unused: true,  // drop unused variables/functions
      hoist_funs: true,  // hoist function declarations
      hoist_vars: false, // hoist variable declarations
      if_return: true,  // optimize if-s followed by return/continue
      join_vars: true,  // join var declarations
      cascade: true,  // try to cascade `right` into `left` in sequences
      side_effects: true,  // drop side-effect-free statements
      warnings: false, // warn about potentially dangerous optimizations/code -- turned this off or script errors out
    },
    ignored: /vendor\.js/  // so we can leave uglify-js-brunch active - maybe the plugin will be upgraded?
  }
};

// pluginsObject.copycat[fontLocation] = ["node_modules/font-awesome/fonts"];
exports.plugins = pluginsObject;

exports.npm = {
  enabled: true,
  globals: {
    jQuery: "jquery",
    $: "jquery",
    // bootstrap: "bootstrap"
  },
  styles: {
    bootstrap: ["dist/css/bootstrap.css"],
    // "font-awesome": ["css/font-awesome.css"],
    "tablesorter": [
      "dist/css/jquery.tablesorter.pager.min.css",
      "dist/css/theme.blue.min.css",
    ],
    dodex: ["dist/dodex.min.css"],
    jsoneditor: ["dist/jsoneditor.min.css"]
  },
  aliases: {
    "handlebars": "handlebars/dist/handlebars.min.js",
    "pager": "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js"
  }
};

exports.server = {
  port: 3080,
  base: "/",
  stripSlashes: true
};

pluginsObject.karma = require("./brunch/build/karma.conf");
pluginsObject.karma.singleRun = singleRun;

exports.overrides = {
  production: {
    paths: {
      watched: ["brunch/appl"]
    },
    conventions: {
      ignored: ["brunch/jasmine"]
    },
    plugins: {
      off: ["karma"]
    }
  }
};
