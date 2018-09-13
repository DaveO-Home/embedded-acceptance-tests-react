import './config'
import Setup from './utils/setup'
import App from './app'
import Default from './utils/default'
import 'pager'
import '../entry'
/* eslint "import/first": [ "warn", "DISABLE-absolute-first" ] */
/* develblock:start */
import apptest from '../../jasmine/apptest'
/* develblock:end */
App.init(Default)
Setup.init()
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve(0)
    }, 500)
}).catch(rejected => {
    fail(`Error ${rejected}`)
}).then(resolved => {
    if (typeof testit !== 'undefined' && testit) {
        // var apptest = require('../../jasmine/apptest').apptest
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000
        __karma__.start()
    }
})
/* develblock:end */
