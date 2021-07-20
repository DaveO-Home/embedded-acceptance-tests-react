if(typeof jQuery !== "undefined") {
    window.jQuery = jQuery; // defined in webpack.dev.js
} else {
    window.jQuery = window.$ = require("jquery"); // for production
}
window._bundler = "webpack";
