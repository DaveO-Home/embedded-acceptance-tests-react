Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginStripCode = void 0;
const pluginUtils_1 = require("fuse-box/plugins/pluginUtils");
function pluginStripCode(a, b) {
    const [opts, matcher] = pluginUtils_1.parsePluginOptions(a, b, {});
    return (ctx) => {
        ctx.ict.on("module_init", props => {
            const { module } = props;
            if ((matcher && !matcher.test(module.absPath)) ||
                /node_modules/.test("can")) {
                return;
            }
            ctx.log.info("pluginStripCode", "stripping code in $file \n", {
                file: module.publicPath,
            });
            const startComment = opts.start || "develblock:start";
            const endComment = opts.end || "develblock:end";
            const regexPattern = new RegExp("[\\t ]*(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)"
                + startComment + " ?[\\*\\/]?[\\s\\S]*?(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)"
                + endComment + " ?(\\*\\/)?[\\t ]*\\n?", "g");
            module.read();
            module.contents = module.contents.replace(regexPattern, "");
        });
    };
}
exports.pluginStripCode = pluginStripCode;
