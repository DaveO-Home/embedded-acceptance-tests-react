/* This is not used */
const alias = require("rollup-plugin-alias");
const buble = require("rollup-plugin-buble");
const builtins = require("rollup-plugin-node-builtins");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const path = require("path");
const postcss = require("rollup-plugin-postcss");
const progress = require("rollup-plugin-progress");
const replaceEnv = require("rollup-plugin-replace");
const babel = require("rollup-plugin-babel");

let isProduction = process.env.BUILD==="true"? true: false;

export default {
    allowRealFiles: true,
    input: "../appl/main.js",
    output: {
        format: "iife",
        name: "acceptance",
    },
    plugins: [
        progress({
            clearLine: isProduction ? false : true
        }),
        replaceEnv({
            "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development")
        }),
        alias(aliases()),
        postcss(),
        buble(),
        nodeResolve({browser: true, jsnext: true, main: true, extensions: [".js", ".jsx"]}),
        babel({
            babelrc: false,
            exclude: ["node_modules/**"],
            presets: [["@babel/preset-react", {
                es2017: {
                    modules: false
                }
            }]],
            plugins: ["@babel/plugin-transform-react-jsx"]
        }),
        commonjs(),
    ],
    // dest: '../../' +  (isProduction? 'dist': 'dist_test') + '/rollup/bundle.js'
};


function modResolve(dir) {
    return path.join(__dirname, "..", dir);
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
        router: modResolve("appl/js/router"),
        start: modResolve("appl/js/controller/start"),
        setup: modResolve("appl/js/utils/setup"),
        setglobals: modResolve("appl/js/utils/set.globals"),
        table: modResolve("appl/js/controller/table"),
        pager: "../../node_modules/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js",
        popper: "../../node_modules/popper.js/dist/esm/popper.js",
        "apptest": "../appl/jasmine/apptest.js",
        "contacttest": "./contacttest.js",
        "domtest": "./domtest.js",
        "logintest": "./logintest.js",
        "routertest": "./routertest.js",
        "toolstest": "./toolstest.js",
        "@": modResolve("appl"),
    };
}
