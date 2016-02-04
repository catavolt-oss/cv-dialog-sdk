///<reference path="jasmine.d.ts"/>
import { Future } from '../src/catavolt';
import { Success } from '../src/catavolt';
xdescribe("Future", function () {
    it("should be created successfully with Try", function () {
        var f = Future.createCompletedFuture("test", new Success("successfulValue"));
    });
});
//# sourceMappingURL=fp.Test.js.map