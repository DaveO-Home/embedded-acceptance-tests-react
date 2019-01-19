// /* eslint-disable no-unused-vars */
// /* eslint-enable no-unused-vars */
import 'config'
import 'setglobals'
import App from 'app'
import Default from 'default'
import Setup from 'setup'
import 'tablepager'
/* develblock:start */
import apptest from 'apptests'
/* develblock:end */
import './entry'

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
    if (typeof testit !== 'undefined' && testit) {
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
        __karma__.start()
    }
})
/* develblock:end */
