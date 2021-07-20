// Note; Menulinks was loaded in entry.js

export default function (type, timer) {
    let numbers = 0;
    let observable = null;
    if (testit) {
        describe("Testing Menulinks Router", () => {
            it(`is ${type} loaded from router component`, (done) => {
                switch (type) {
                    case "table":
                        $(".fa-table").trigger("click");
                        numbers = timer(50, 50);
                        observable = numbers.subscribe(timer => {
                            let table = $("tbody > tr[role=\"row\"]");
                            if (table.length > 65 || timer === 50) {
                                expect($("tbody > tr[role=\"row\"]").length > 65).toBe(true);  // default page size
                                observable.unsubscribe();
                                done();
                            }
                        });
                        break;
                    case "pdf":
                        $(".pdf-click").trigger("click");
                        numbers = timer(50, 50);
                        observable = numbers.subscribe(timer => {
                            let pdf = $("#main_container > iframe[name=\"pdfDO\"]");
                            if (pdf.length > 0 || timer === 50) {
                                expect($("#main_container > iframe[name=\"pdfDO\"]").length > 0).toBe(true);
                                observable.unsubscribe();
                                done();
                            }
                        });
                        break;
                    default:
                }
            });
        });
    }
}
