
import 'config'
import Setup from 'setup'
import popper from 'popper.js'
import App from 'app'
import Default from 'default'
import 'pager'
import '../entry'
/* eslint "import/first": [ "warn", "DISABLE-absolute-first" ] */
/* develblock:start */
import apptest from 'apptest'
window._bundler = "fusebox"
/* develblock:end */
window.Popper = popper
App.init(Default)
Setup.init()
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
/* eslint no-unused-vars: ["error", { "args": "none" }] */
new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve(0)
    }, 500)
}).catch(rejected => {
    fail(`Error ${rejected}`)
}).then(resolved => {
    if (typeof testit !== "undefined" && testit) {
        // var apptest = require("apptest") // .apptest
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
        __karma__.start()
    }
})
/* develblock:end */
