/* eslint no-unused-vars: ['error', { 'args': 'none' }] */

import App from 'app'
import Base from 'basecontrol'
import Menu from 'menu'
import Marked from 'marked'
let me

export default App.controllers.Start ||
    (App.controllers.Start = Object.assign({ // new (Base.extend({
        name: 'start',
        init () {
            me = this
            this.setLocation()
            Base.init()
        },
        initMenu () {
            me = this
            this.setLocation()
            Menu.activate('#top-nav div ul li')
            Menu.activate('#side-nav nav ul li')
        },
        setLocation () {
            const hash = window.location.hash
            this.location = hash === '#/contact' ? this.location : hash
        },
        location: '#/',
        index (options) {
            const indexUrl = 'views/prod/index.html'
            if (this.base) {
                me.baseUrl = `base/${window._bundler}/appl/`
            }
            const markdownUrl = this.base ? 'base/README.md' : '../../README.md' // typeof testit !== 'undefined' ? '/README.md' : '../../README.md'
            this.view({
                url: me.baseUrl + indexUrl,
                urlMd: markdownUrl,
                fade: true,
                controller: 'Start',
                selector: '#main_container',
                react: true,
                fnLoad (el) {
                }
            })
        },
        getHtml () {
            return this.html
        },
        'div .login click': function (sender, e) {
            const loginUrl = 'views/prod/login.html'
            me.modal({
                baseUrl: me.baseUrl,
                url: me.baseUrl + loginUrl,
                title: 'Account Log In',
                submit: 'Login',
                submitCss: 'submit-login',
                widthClass: 'modal-lg',
                width: '30%',
                foot: me.footer,
                close: 'Close',
                contactFooter: me.contactFooter
            })
        },
        '.modal .submit-login click': function (sender, e) {
            alert('Not implemented')
            $(sender.target).closest('.modal').modal('hide')
        },
        'div .modal-footer .contact click': function (sender, e) {
            $(sender.target).closest('.modal').modal('hide')
        },
        contact (ev) {
            this.view({
                url: `${me.baseUrl}views/prod/contact.html`,
                selector: window.rmain_container || '#main_container',
                fade: true,
                contactListener: me.contactListener
            })
        },
        contactListener (el, me) {
            const form = $('form', el)

            const formFunction = e => {
                /* develblock:start */
                if (window.__karma__) { // To prevent firefox testing from clearing context
                    e.preventDefault()
                }
                /* develblock:end */
                const validateForm = isValid => {
                    const inputs = Array.prototype.slice.call(document.querySelectorAll('form input'))
                    inputs.push(document.querySelector('form textarea'))
                    for (let i = 0; i < inputs.length; i++) {
                        isValid = !inputs[i].checkValidity() ? false : isValid
                        inputs[i].setCustomValidity('')
                        if (inputs[i].validity.valueMissing && !isValid) {
                            inputs[i].setCustomValidity('Please enter data for required field')
                        }
                    }
                    return isValid
                }

                const isValid = validateForm(true) ? true : validateForm(true)

                if (isValid) {
                    e.preventDefault()
                    me.showAlert(me)
                    // TODO: do something with collected data
                    // var data = $('form.form-modal').serializeArray()
                    //     .reduce(function (a, x) {
                    //        a[x.name] = x.value
                    //        return a
                    // }, {})

                    let secs = 3000
                    /* develblock:start */
                    if (window.__karma__) {
                        secs = 10
                    }
                    /* develblock:end */
                    setTimeout(() => {
                        $('#data').empty()
                        window.location.hash = me.location
                    }, secs)
                }
            }
            form.find('input[type=submit]', el).click(formFunction)
        },
        footer: '<button class="btn btn-sm btn-primary submit-modal mr-auto raised submit-login">{{submit}}</button>' +
                     '<button class="btn btn-sm close-modal raised" data-dismiss="modal" aria-hidden="true">{{close}}</button>',
        contactFooter: '<div class="modal-footer">' +
                            '<div class="mr-auto contact" >' +
                                '<a href="#/contact" ><small class="grey">Contact</small></a>' +
                            '</div>' +
                            '</div>',
        alert: '<div class="alert alert-info alert-dismissible fade show" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times</span></button>' +
                    '<strong>Thank You!</strong> Your request is being processed.' +
                    '</div>',
        showAlert (me) {
            $('form.form-horizontal').append(me.alert)
        },
        finish (options) {
            // const marked = require('../utils/marked')
            me = this
            const mdFunction = data => {
                me.html = `${App.html} ${Marked(data)}`
            }
            $.get(options.urlMd, mdFunction, 'text')
            .fail(err => {
                console.warn('IT FAILED', err)
            })
        },
        html: ''
    }, Base))
