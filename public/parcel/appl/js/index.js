
import "./utils/set.globals";
import "./config";

/* develblock:start */
// Load before app.js since app.js has embedded test
import apptest from "../jasmine/apptest";
/* develblock:end */
import App from "./app";
import Default from "./utils/default";
import Setup from "./utils/setup";
import "tablesorter";
import "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js";
import "./entry";
App.init(Default);
Setup.init();
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
/* eslint no-unused-vars: ["error", { "args": "none" }] */
if (typeof testit !== "undefined" && testit) {
    new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(0);
        }, 10);
    }).catch(rejected => {
        fail(`Error ${rejected}`);
    }).then(resolved => {
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App);
    });
}
/* develblock:end */
