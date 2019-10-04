/* eslint no-unused-vars: 0 */
import routerTest from "routertest";
import domTest from "domtest";
import toolsTest from "toolstest";
import contactTest from "contacttest";
import loginTest from "logintest";
import dodexTest from "dodextest";
import inputTest from "inputtest";
import Start from "start";
import Helpers from "helpers2";
import React from "react";
import ReactDOM from "react-dom";
import StartC, { getStartComp } from "StartC";
import { getPdfComp } from "PdfC";
import ToolsC from "ToolsC";
// import ContactC from "ContactC";
import Login from "LoginC";
// import WelcomeC from '../appl/components/HelloWorldC'
import Menulinks, { Dodexlink } from "Menulinks";
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
            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, ReactDOM, "main_container", 0, 2);
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`);
            }).then(resolved => {
                expect(App.loadController).toHaveBeenCalled();
                expect(App.renderTools.calls.count()).toEqual(1);
                expect(App.controllers["Table"]).not.toBeUndefined();
                // Wait for template completion
                setTimeout(function () {
                    expect(document.getElementById("main_container").querySelector("#tools").children.length > 1).toBe(true);

                    domTest("tools", document.querySelector("#main_container"));
                    done();
                }, 100);
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
        // Test dodex
        dodexTest(dodex, input, mess, getAdditionalContent(), Start, timer);
        // Test dodex input
        inputTest(dodex, timer);

        if (testOnly) {
            it("Testing only", () => {
                fail("Testing only, build will not proceed");
            });
        }
    });
}

function karmaDisplay() {
    // Load of test page(without html, head & body) to append to the Karma iframe
    $("body").load("/base/stealjs/appl/app_bootstrap.html", function (data) {
        ReactDOM.render(
            <Menulinks />,
            document.getElementById("root")
        );
        ReactDOM.render(
            <Login />,
            document.getElementById("nav-login")
        );
        ReactDOM.render(
            <Dodexlink />,
            document.querySelector(".dodex--ico")
        );
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
