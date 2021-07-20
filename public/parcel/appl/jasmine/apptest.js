import routerTest from "./routertest";
import domTest from "./domtest";
import toolsTest from "./toolstest";
import contactTest from "./contacttest";
import loginTest from "./logintest";
import dodexTest from "./dodextest";
import inputTest from "./inputtest";
import Start from "../js/controller/start";
import Helpers from "../js/utils/helpers";
import React from "react";
import ReactDOM from "react-dom";
import StartC, { getStartComp } from "../components/StartC";
import { getPdfComp } from "../components/PdfC";
import { Dodexlink } from "../Menulinks";
import ToolsC from "../components/ToolsC";
import Login from "../components/LoginC";
import { timer } from "rxjs";
import dodex from "dodex";
import input from "dodex-input";
import mess from "dodex-mess";
// import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library'

export default function (App) {
    karmaDisplay();

    describe("Application Unit test suite - AppTest", () => {
        beforeAll(() => {
            spyOn(App, "loadController").and.callThrough();
            spyOn(App, "renderTools").and.callThrough();
            spyOn(Helpers, "isResolved").and.callThrough();
        }, 5000);

        afterAll(() => {
            window.parent.scrollTo(0, 0);
            $("body").empty();
        }, 5000);

        it("Is Welcome Page Loaded", done => {
            /*
             * Loading Welcome page.
             */
            getStartComp().then(function (StartComp) {
                ReactDOM.render(
                    <StartComp />,
                    document.getElementById("main_container"),
                    // Using the react callback to run the tests
                    function () {
                        expect(App.controllers["Start"]).not.toBeUndefined();
                        expect(document.querySelector("#main_container span").children.length > 3).toBe(true);
                        domTest("index", document.querySelector("#main_container"));
                        done();
                    }
                );
            });
        });

        it("Is Tools Table Loaded", done => {
            /*
             * Letting the Router load the appropriate page.
             */
            ReactDOM.render(
                <ToolsC />,
                document.querySelector("#main_container")
            );
            Helpers.getResource(ReactDOM, "main_container", 0, 0)
                .catch(rejected => {
                    fail(`The Tools Page did not load within limited time: ${rejected}`);
                }).then(() => {
                    expect(App.loadController).toHaveBeenCalled();
                    expect(App.renderTools.calls.count()).toEqual(1);
                    expect(App.controllers["Table"]).not.toBeUndefined();
                    expect(document.getElementById("main_container").querySelector("#tools").children.length > 1).toBe(true);

                    domTest("tools", document.querySelector("#main_container"));
                    done();
                });
        });

        it("Is Pdf Loaded", done => {
            ReactDOM.render(
                getPdfComp(),
                document.querySelector("#main_container"),
                function () {
                    expect(document.querySelector("#main_container").children.length === 1).toBe(true);

                    domTest("pdf", document.querySelector("#main_container"));
                    done();
                }
            );
        });

        routerTest("table", timer);
        routerTest("pdf", timer);

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(ToolsC, Helpers, ReactDOM, React, timer);
        // Form Validation
        contactTest(timer);
        // Verify modal form
        loginTest(Start, Helpers, ReactDOM, React, StartC, timer);
        // Test dodex
        dodexTest(dodex, input, mess, getAdditionalContent(), Start, timer);
        // Test dodex input
        inputTest(dodex, timer);

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();

        if (testOnly) {
            it("Testing only", () => {
                throw "Testing only, build will not proceed";
            });
        }
    });
}

function karmaDisplay() {
    // Building a link url for css file so Karma can display the page properly
    $.get("/base/dist_test/parcel/appl/testapp_dev.html", function (data) {
        const maincss = /testapp_dev.(.*).css/.exec(data);  // Parcel builds a unique file name
        // Load of test page(without html, head & body) to append to the Karma iframe
        $("body").load("/base/parcel/appl/app_bootstrap.html", function () {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "/base/dist_test/parcel/" + maincss[0]  // So Karma can find the css file
            }).appendTo("head");

            ReactDOM.render(
                <Login />,
                document.getElementById("nav-login")
            );
            ReactDOM.render(
                <Dodexlink />,
                document.querySelector(".dodex--ico")
            );
        });
    });
}

function getAdditionalContent() {
    return {
        cards: {
            card28: {
                tab: "F01999", // Only first 3 characters will show on the tab.
                front: {
                    content: `<h1 style="font-size: 10px;">Friends</h1>
					<address style="width:385px">
						<strong>Charlie Brown</strong> 	111 Ace Ave. Pet Town
						<abbr title="phone"> : </abbr>555 555-1212<br>
						<abbr title="email" class="mr-1"></abbr><a href="mailto:cbrown@pets.com">cbrown@pets.com</a>
					</address>
					`
                },
                back: {
                    content: `<h1 style="font-size: 10px;">More Friends</h1>
					<address style="width:385px">
						<strong>Lucy</strong> 113 Ace Ave. Pet Town
						<abbr title="phone"> : </abbr>555 555-1255<br>
						<abbr title="email" class="mr-1"></abbr><a href="mailto:lucy@pets.com">lucy@pets.com</a>
					</address>
					`
                }
            },
            card29: {
                tab: "F02",
                front: {
                    content: "<h1 style=\"font-size: 14px;\">My New Card Front</h1>"
                },
                back: {
                    content: "<h1 style=\"font-size: 14px;\">My New Card Back</h1>"
                }
            }
        }
    };
}
