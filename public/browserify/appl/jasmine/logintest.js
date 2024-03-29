export default function (Start, Helpers, ReactDOM, React, StartC, timer) {
    /*
     * Test Form validation and submission.
     */
    describe("Popup Login Form", () => {
        let modal;
        let closeButton;
        let nameObject;

        beforeAll(done => {
            let loginObject = null;
            ReactDOM.render(
                <StartC />,
                document.querySelector("#main_container"),
                function () {
                    loginObject = $("div .login");
                    loginObject.on("click", ev => {
                        Start["div .login click"](ev);
                    });
                    loginObject.trigger("click");
                }
            );

            Start.base = true;
            // Note: if page does not refresh, increase the timer time.
            // Using RxJs instead of Promise.
            const numbers = timer(50, 50);
            const observable = numbers.subscribe(timer => {
                modal = $("#modalTemplate");
                if ((typeof modal[0] !== "undefined" && modal[0].length !== 0) || timer === 20) {
                    nameObject = $("#inputUsername");
                    modal.on("shown.bs.modal", function () {
                        modal.modal("toggle");
                    });
                    observable.unsubscribe();
                    done();
                }
            });
        });

        it("Login form - verify modal with login loaded", function (done) {
            expect(modal[0]).toBeInDOM();
            expect(nameObject[0]).toExist();

            closeButton = $(".close-modal");
            done();
        });
        /*
            This spec works because here bootstrap5 detected jQuery so using pre bootstrap 5 jQuery fn's.
            See the webpack config (base.control.js) for new bootstrap 5 setup. In bootstap 5 mode
            these tests fail because of the async design of bootstrap 5.
        */
        it("Login form - verify cancel and removed from DOM", function (done) {
            expect(modal[0]).toExist();
            closeButton.click();

            const numbers = timer(50, 50);
            const observable = numbers.subscribe(timer => {
                const modal2 = $("#modalTemplate");
                if (typeof modal2[0] === "undefined" || timer === 25) {
                    expect(modal[0]).not.toBeVisible();
                    expect(modal[0]).not.toBeInDOM();
                    observable.unsubscribe();
                    done();
                }
            });
        });
    });
}
