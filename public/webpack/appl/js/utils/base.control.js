
import App from "app";
import Helpers from "helpers";
import {Modal} from "bootstrap";

export default {
    defaults: {
    },
    init () { //
    },
    view (options) {
        const loading = Helpers.getValueOrDefault(options.loading, false);

        // Lets not clutter up the test reporting.
        if (typeof testit !== "undefined" && !testit) {
            if (loading) {
                // In lieu of spinner for demo
                console.warn("Loading");
            }
        }

        const render = Helpers.renderer(this, options);

        if (options.template) {
            if(options.template.split(".")[0] === "tools") {
                App.renderTools(options, render);
            }
        } else {
            App.loadView(options, frag => {
                App.html = render(frag);
            });
        }
    },
    modal (options) {
        let template;

        App.loadView({
            url: "templates/stache/modal.stache"
        }, modalFrag => {
            template = Stache.compile(modalFrag);

            App.loadView(options, frag => {
                options["body"] = frag;
                options["foot"] = Stache.compile(options.foot)(options);
                const el = $(document.body).append(template(options)).find("> .modal").last();
                const css = {};
                if (options.width) {
                    css["width"] = typeof css.width === "number" ? `${options.width}%` : options.width;
                    const width = css.width.substring(0, css.width.length - 1);
                    css["margin-left"] = `${(100 - width) / 2}%`;
                }
                $(".modal .submit-login").on("click", this[".modal .submit-login click"]);
                $("div .modal-footer .contact").on("click", this["div .modal-footer .contact click"]);
                el[0].addEventListener("show.bs.modal", () => {
                    if (options.fnLoad) {
                        options.fnLoad(el);
                    }
                });
                el[0].addEventListener("hide.bs.modal", () => {
                    if (options.fnHide) {
                        options.fnHide(el);
                    }
                });
                el[0].addEventListener("hidden.bs.modal", () => {
                    el.remove();
                });
                el.css(css).find("> .modal-dialog").addClass(options.widthClass);
                
                const modalOptions = {backdrop: "static", keyboard: false, focus: true};
                const loginModal = Modal.getOrCreateInstance(el[0], modalOptions);
                loginModal.show();
                // $("#openLogin").trigger("click");
            });
        });
    }
};
