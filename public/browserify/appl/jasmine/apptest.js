import routerTest from 'b/routertest'
import domTest from 'b/domtest'
import toolsTest from 'b/toolstest'
import contactTest from 'b/contacttest'
import loginTest from 'b/logintest'
import Start from 'b/start'
import Helpers from 'b/helpers'
import React from "react"
import ReactDOM, { render, unmountComponentAtNode } from "react-dom"
import StartC, { getStartComp } from "../components/StartC"
import PdfC, { getPdfComp } from "../components/PdfC"
import ToolsC, { getToolsComp } from "../components/ToolsC"
import ContactC from "../components/ContactC"
import Login from "../components/LoginC"
import Menulinks from "../Menulinks"
import WelcomeC from "../components/HelloWorldC"
// import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library'

export default function (App) {
    describe('Application Unit test suite - AppTest', () => {
        beforeAll(() => {
            karmaDisplay()
            spyOn(App, 'loadController').and.callThrough()
            spyOn(App, 'renderTools').and.callThrough()
            spyOn(Helpers, 'isResolved').and.callThrough()
        }, 3000)

        afterAll(() => {
            $('body').empty()            
            window.parent.scrollTo(0, 0);
        }, 3000)

        it('Is Welcome Page Loaded', done => {
            /*
             * Loading Welcome page.
             */
            getStartComp().then(function (StartComp) {
                ReactDOM.render(
                    <StartComp />,
                    document.getElementById("main_container"),
                    // Using the react callback to run the tests
                    function () {
                        expect(App.controllers['Start']).not.toBeUndefined()
                        expect(document.querySelector('#main_container span').children.length > 3).toBe(true)
                        domTest('index', document.querySelector('#main_container'))
                        done()
                    }
                )
            })
        })

        it('Is Pdf Loaded', done => {
            ReactDOM.render(
                getPdfComp(),
                document.querySelector("#main_container"),
                function () {
                    expect(document.querySelector('#main_container').children.length === 1).toBe(true)

                    domTest('pdf', document.querySelector('#main_container'))
                    done()
                }
            )
        })
        
        it('Is Tools Table Loaded', done => {
            /*
             * Letting the Router load the appropriate page.
             */
            ReactDOM.render(
                <ToolsC />,
                document.querySelector("#main_container")
            )
            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, ReactDOM, 'main_container', 0, 0)
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`)
            }).then(resolved => {
                expect(App.loadController).toHaveBeenCalled()
                expect(App.renderTools.calls.count()).toEqual(1)
                expect(App.controllers['Table']).not.toBeUndefined()
                expect(document.getElementById('main_container').querySelector('#tools').children.length > 1).toBe(true)

                domTest('tools', document.querySelector('#main_container'))
                done()
            })
        })

        routerTest("table")
        routerTest('pdf')

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(ToolsC, Helpers, ReactDOM, React)
        // Form Validation
        contactTest(ContactC, Helpers, ReactDOM, React)
        // Verify modal form
        loginTest(Start, Helpers, ReactDOM, React, StartC)

        if (testOnly) {
            it('Testing only', () => {
                fail('Testing only, build will not proceed')
            })
        }
    })
}

function karmaDisplay() {
    // Load of test page(without html, head & body) to append to the Karma iframe
    $('body').load("/base/browserify/appl/app_bootstrap.html", function (data) {
        ReactDOM.render(
            <Menulinks />,
            document.getElementById("root")
        )
        const html = ReactDOM.render(
            <Login />,
            document.getElementById("nav-login")
        )
    })
}
