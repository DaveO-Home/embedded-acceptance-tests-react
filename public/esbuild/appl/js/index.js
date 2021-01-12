// eslint-disable-next-line
import "./config";
import Setup from "./utils/setup";
import popper from "popper.js";
import App from "./app";
import Default from "./utils/default";
import "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js";
import "../entry";
import JSONEditor from "jsoneditor/dist/jsoneditor.min.js";

window.JSONEditor = JSONEditor;
/* develblock:start */
import apptest from "../jasmine/apptest";
window._bundler = "esbuild";
/* develblock:end */
window.Popper = popper;
App.init(Default);
Setup.init();
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
/* eslint no-unused-vars: ["error", { "args": "none" }] */
new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve(0);
    }, 500);
}).catch(rejected => {
    fail(`Error ${rejected}`);
}).then(resolved => {
    if (typeof testit !== "undefined" && testit) {
        // var apptest = require("apptest") // .apptest
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App);
    }
});
/* develblock:end */
