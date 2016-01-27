///<reference path="jasmine.d.ts"/>
import * as fp from './module_test';
describe("Api Usage", function () {
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });
    it("Should run Simple test", function (done) {
        var tryTest = new fp.Success('success');
        done();
    });
});
