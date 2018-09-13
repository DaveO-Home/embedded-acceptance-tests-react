// Note; Menulinks was loaded in entry.js

export default function (type) {
    if (testit) {
        describe("Testing Menulinks Router", () => {
            it(`is ${type} loaded from router component`, (done) => {
                switch (type) {
                    case "table":
                        $('.fa-table').click()
                        setTimeout(function () {
                            expect($('tbody > tr[role="row"]').length > 65).toBe(true)  //default page size
                            done()
                        }, 503)
                        break
                    case "pdf":
                        $('.fa-file-pdf-o').click()
                        setTimeout(function () {
                            expect($('#main_container > iframe[name="pdfDO"]').length > 0).toBe(true)
                            done()
                        }, 504)
                        break
                    default:
                }
            })
        })
    }
}
