import { /* Modal */ } from "bootstrap";
export default function (Start, Helpers, ReactDOM, React, StartC, timer) {
    /*
     * Test Form validation and submission. (Bootstrap Modal)
     */
    describe("Popup Login Form", () => {
        let modal;
        // let closeButton;
        let nameObject;
        // let loginModal;
        // let modalEle;
        let loginObject = null;

        beforeAll(done => {
            ReactDOM.render(
                <StartC />,
                document.querySelector("#main_container"),
                function () {
                    loginObject = $("div .login");
                    loginObject.on("click", (ev) => {
                        Start["div .login click"](ev);
                    });
                    loginObject.trigger("click"); // creates and opens the modal - setup in "base.control.js"
                }
            );

            Start.base = true;
            done();
        });

        it("Login form - verify modal with login loaded", function (done) {
            // Note: if page does not refresh, increase the timer time.
            // Using RxJs instead of Promise.
            const numbers = timer(50, 50);

            const observable = numbers.subscribe(timer => {
                modal = $("#modalTemplate");

                if ((typeof modal[0] !== "undefined" && modal[0].classList.contains("show")) || timer === 20) {
                    nameObject = $("#inputUsername");
                    
                    observable.unsubscribe();
                    expect(modal[0]).toBeInDOM();
                    expect(nameObject[0]).toExist();
                    // closeButton = modal.find(".close-modal");
                    
                    done();
                }
            });
        });
        /* The webpack demo is configured to use the default Bootstrap 5 "bootstrap.js" file. That is, if jQuery is not
            detected("window.jQuery"), the code uses the bootstrap 5 code. See "base.control.js" for config. However,
            jasmine has problems with the async bootstrap modules, one being "Modal". As Bootstrap docs explain, bootstrap
            functions are async and therefore the actions happen after the fact, no promises are returned. The other bundler
            demos work because jQuery is detected and all of the bootstrap 4 jQuery "fn" functions are included.
        */
        // it("Login form - verify cancel and removed from DOM", function (done) {
        //     expect(modal[0]).toExist();
        //     // console.log("CloseButton", closeButton[0])
        //     // closeButton.trigger("click");

        //     const modalOptions = {backdrop: "static", keyboard: false, focus: true};
        //     const loginModal = Modal.getOrCreateInstance(modal[0], modalOptions);
        //     loginModal.hide();

        //     const numbers = timer(500, 5);
        //     const observable = numbers.subscribe(timer => {
        //         if ((typeof modal[0] !== "undefined" && !modal[0].classList.contains("show")) || timer === 1) {
        //             done();
        //             observable.unsubscribe();

        //             setTimeout(() => {
        //                 expect(modal[0]).not.toBeVisible();
        //                 // setTimeout(()=>{
        //                 //     expect(modal[0]).not.toBeInDOM();
        //                 // }, 1000);
        //             }, 1000);
        //         }
        //     });
        // });
    });
}
