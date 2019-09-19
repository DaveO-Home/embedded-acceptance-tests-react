import routerTest from "b/routertest";
import domTest from "b/domtest";
import toolsTest from "b/toolstest";
import contactTest from "b/contacttest";
import loginTest from "b/logintest";
import Start from "b/start";
import Helpers from "b/helpers";
import React from "react";
import ReactDOM from "react-dom";
import StartC, { getStartComp } from "../components/StartC";
import { getPdfComp } from "../components/PdfC";
import ToolsC from "../components/ToolsC";
import Login from "../components/LoginC";
import Menulinks from "../Menulinks";
import { timer } from "rxjs";
// import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library'

export default function (App) {
    describe("Application Unit test suite - AppTest", () => {
        beforeAll(() => {
            karmaDisplay();
            spyOn(App, "loadController").and.callThrough();
            spyOn(App, "renderTools").and.callThrough();
            spyOn(Helpers, "isResolved").and.callThrough();
        }, 4000);

        afterAll(() => {
            $("body").empty();
            window.parent.scrollTo(0, 0);
        }, 4000);

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

        it("Is Tools Table Loaded", done => {
            /*
             * Letting the Router load the appropriate page.
             */
            ReactDOM.render(
                <ToolsC />,
                document.querySelector("#main_container")
            );
            Helpers.getResource(ReactDOM, "main_container", 0, 0)
                .then(() => {
                    expect(App.loadController).toHaveBeenCalled();
                    expect(App.renderTools.calls.count()).toEqual(1);
                    expect(App.controllers["Table"]).not.toBeUndefined();
                    expect(document.getElementById("main_container").querySelector("#tools").children.length > 1).toBe(true);

                    domTest("tools", document.querySelector("#main_container"));
                    done();
                }).catch(rejected => {
                    throw `The Tools Page did not load within limited time: ${rejected}`;
                });
        });

        routerTest("table");
        routerTest("pdf");

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(ToolsC, Helpers, ReactDOM, React, timer);
        // Form Validation
        contactTest(timer);
        // Verify modal form
        loginTest(Start, Helpers, ReactDOM, React, StartC, timer);

        if (testOnly) {
            it("Testing only", () => {
                throw "Testing only, build will not proceed";
            });
        }
    });
}

function karmaDisplay() {
    // Load of test page(without html, head & body) to append to the Karma iframe
    $("body").load("/base/browserify/appl/app_bootstrap.html", function () {
        ReactDOM.render(
            <Menulinks />,
            document.getElementById("root")
        );
        ReactDOM.render(
            <Login />,
            document.getElementById("nav-login")
        );
    });
}
