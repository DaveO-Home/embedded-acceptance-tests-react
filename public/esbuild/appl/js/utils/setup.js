
import Menu from "./menu";
import "./set.globals";

import handlebars from "handlebars/dist/handlebars.js";
window.Stache = handlebars;

export default {
    init () {
        // Show the page
        $("#top-nav").removeAttr("hidden");
        $("#side-nav").removeAttr("hidden");
        Menu.activate("#top-nav div ul li");
        Menu.activate("#side-nav nav ul li");
    }
};
