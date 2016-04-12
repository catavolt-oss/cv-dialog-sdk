///<reference path="jasmine.d.ts"/>
"use strict";
var catavolt_1 = require('../src/catavolt');
var catavolt_2 = require('../src/catavolt');
xdescribe("Future", function () {
    it("should be created successfully with Try", function () {
        var f = catavolt_1.Future.createCompletedFuture("test", new catavolt_2.Success("successfulValue"));
    });
});
//# sourceMappingURL=fp.Test.js.map