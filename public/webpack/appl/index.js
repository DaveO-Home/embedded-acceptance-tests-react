import "config";
import "setglobals";
import App from "app";
import Default from "default";
import Setup from "setup"; 
import "tablepager";

App.init(Default);

Setup.init();
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
if (typeof testit !== "undefined" && testit) {
    if (typeof testit !== "undefined" && testit) {
        // Run acceptance tests.
        System.import("apptests").then(function (apptest) {
            apptest(App);
            __karma__.start();
        });
    }
}
/* develblock:end */
