///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        xdescribe("Future", function () {
            it("should be created successfully with Try", function () {
                var f = fp.Future.createCompletedFuture("test", new fp.Success("successfulValue"));
            });
        });
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
