/* eslint no-unused-vars: 0 */
import routerTest from 'routertest'
import domTest from 'domtest'
import toolsTest from 'toolstest'
import contactTest from 'contacttest'
import loginTest from 'logintest'
import Start from 'start'
import Helpers from 'helpers2'
import React from 'react'
import ReactDOM from 'react-dom'
import StartC, { getStartComp } from 'StartC'
import { getPdfComp } from 'PdfC'
import ToolsC from 'ToolsC'
import ContactC from 'ContactC'
import Login from 'LoginC'
// import WelcomeC from '../appl/components/HelloWorldC'
import Menulinks from 'Menulinks'
import { timer } from 'rxjs'
// import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library'

export default function (App) {
    karmaDisplay()

    describe('Application Unit test suite - AppTest', () => {
        beforeAll(() => {
            spyOn(App, 'loadController').and.callThrough()
            spyOn(App, 'renderTools').and.callThrough()
            spyOn(Helpers, 'isResolved').and.callThrough()
        }, 5000)

        afterAll(() => {
            window.parent.scrollTo(0, 0)
            $('body').empty()
        }, 5000)

        it('Is Welcome Page Loaded', done => {
            /*
             * Loading Welcome page.
             */
            getStartComp().then(function (StartComp) {
                ReactDOM.render(
                    <StartComp />,
                    document.getElementById('main_container'),
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
                document.querySelector('#main_container'),
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
                document.querySelector('#main_container')
            )
            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, ReactDOM, 'main_container', 0, 2)
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`)
            }).then(resolved => {
                expect(App.loadController).toHaveBeenCalled()
                expect(App.renderTools.calls.count()).toEqual(1)
                expect(App.controllers['Table']).not.toBeUndefined()
                // Wait for template completion
                setTimeout(function() {
                    expect(document.getElementById('main_container').querySelector('#tools').children.length > 1).toBe(true)
            
                    domTest('tools', document.querySelector('#main_container'))
                    done()
                }, 100)
            })
        })

        routerTest('table')
        routerTest('pdf')

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(ToolsC, Helpers, ReactDOM, React, timer)
        // Form Validation
        contactTest(ContactC, Helpers, ReactDOM, React)
        // Verify modal form
        loginTest(Start, Helpers, ReactDOM, React, StartC, timer)

        if (testOnly) {
            it('Testing only', () => {
                fail('Testing only, build will not proceed')
            })
        }
    })
}

function karmaDisplay () {
    // Load of test page(without html, head & body) to append to the Karma iframe
    $('body').load('/base/stealjs/appl/app_bootstrap.html', function (data) {
        ReactDOM.render(
            <Menulinks />,
            document.getElementById('root')
        )
        ReactDOM.render(
            <Login />,
            document.getElementById('nav-login')
        )
    })
}
