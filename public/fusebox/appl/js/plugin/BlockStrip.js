"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockStrip = exports.BlockStripClass = void 0;
/*eslint no-extra-semi: "warn"*/
/*global exports:true*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
class BlockStripClass {
    constructor(options = {}) {
        this.options = options;
        //minimize file selection list by including only js files under a js directory, index.js and js under can
        this.test = /(\/js\/.*\.js|index(\.js|\.ts)|can.*\.js)/;
        this.startComment = options.options.start || 'develblock:start';
        this.endComment = options.options.end || 'develblock:end';
        this.regexPattern = new RegExp("[\\t ]*(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" + this.startComment + " ?[\\*\\/]?[\\s\\S]*?(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" + this.endComment + " ?(\\*\\/)?[\\t ]*\\n?", "g");
    }
    ;
    transform(file) {
        file.loadContents();
        file.contents = file.contents.replace(this.regexPattern, '');
    }
}
exports.BlockStripClass = BlockStripClass;
const BlockStrip = (options) => {
    return new BlockStripClass(options);
};
exports.BlockStrip = BlockStrip;
