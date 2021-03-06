import "b/config";
import "b/setglobals";
//removeIf(production)
import apptest from "b/apptest";
//endRemoveIf(production)
import App from "b/app";
import Default from "b/default";
import Setup from "b/setup";
import "tablesorter";
import "b/pager";
import "./entry";
import JSONEditor from "jsoneditor/dist/jsoneditor.min.js";

window.JSONEditor = JSONEditor;
App.init(Default);
Setup.init();
//removeIf(production)
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
/* eslint no-unused-vars: ["error", { "args": "none" }] */
if (typeof testit !== "undefined" && testit) {
    new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(0);
        }, 10);
    }).then((resolved) => {
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App);
    }).catch(rejected => {
        throw `Error ${rejected}`;
    });
}
//endRemoveIf(production)
